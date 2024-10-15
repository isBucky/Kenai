import { KenaiGlobal } from '@managers/kenai-global';
import { RedisManager } from '@managers/redis';
import { getMetadata } from '@utils/index';

import ObjectManager from 'object.mn';

// Types
import type { CustomZodParser } from '@builders/validation-schema';
import type { ControllerMetadata, Controllers } from './decorator';
import type { FastifyHandler } from '@decorators/middlewares';
import type { onSendHookHandler } from 'fastify';
import type { z } from 'zod';

export class HandlerMethod {
    public controller: ControllerMetadata;

    /**
     * @param target The target class that owns this method.
     * @param key The key of the method in the target class.
     */
    constructor(
        public target: Function,
        public key: PropertyKey,
    ) {
        this.controller = getMetadata<Controllers>('controllers', target).get(key)!;
    }

    /**
     *
     * @param callback
     * @param args
     */
    public async run(
        callback: CallbackOriginalFunction,
        args: Parameters<CallbackOriginalFunction>,
    ) {
        const [request, reply] = args;
        const options = this.controller.options;

        if (!options || !Object.keys(options).length) return await callback(...args);

        // Verifying if there are values ​​in the database
        if (options.cache?.ttl && !options.cache.invalidateOnUpdate) {
            if (!KenaiGlobal.has('redis'))
                console.error(
                    new Error('No Redis connection was defined to use cache on the routes'),
                );
            else {
                const cacheData = await RedisManager.get(request.url);
                if (cacheData) return reply.code(200).send(cacheData);
            }
        }

        const value = await callback(...this.resolveCustomParams(args));

        if (options.cache?.invalidateOnUpdate) {
            if (!KenaiGlobal.has('redis'))
                console.error(
                    new Error('No Redis connection was defined to use cache on the routes'),
                );
            else RedisManager.delete(request.url);
        }

        if (request.socket.closed || reply.sent) return;
        if (!value) return reply.code(204).send();

        // Inserindo os valores no chace
        if (options.cache?.ttl && !options.cache.invalidateOnUpdate) {
            if (!KenaiGlobal.has('redis'))
                console.error(
                    new Error('No Redis connection was defined to use cache on the routes'),
                );
            else RedisManager.set(request.url, value, options.cache.ttl);
        }

        return reply.code(200).send(value);
    }

    /**
     * This function is used when the route sends a message, so I can check the returned data
     *
     * @param route Controller data
     * @returns Hook for Fastify `onSend` event
     */
    public static onSend(route: ControllerMetadata): onSendHookHandler {
        return function (request, reply, payload, done) {
            if (reply.statusCode == 204 || !payload || !payload?.['length']) return done();
            if (['HEAD', 'OPTIONS'].includes(request.method)) return done(null, payload);

            // Get the content type of the response
            const contentType = reply.getHeader('Content-Type') as string;

            // If the content type is JSON, parse the payload and validate it with the Zod schema
            if (contentType && contentType.split(';')[0] == 'application/json') {
                const responseSchema = route.options?.response?.[reply.statusCode];

                if (responseSchema && responseSchema.zod) {
                    // Parse the payload to a JSON object
                    const payloadParsed = JSON.parse(<string>payload || '');

                    // Validate the payload with the Zod schema
                    const result = HandlerMethod.parser(responseSchema.zod, payloadParsed);

                    // Return the validated payload as a JSON string
                    return done(null, JSON.stringify(result));
                }
            }

            // Return the payload as is if it's not a JSON response
            return done(null, payload);
        };
    }

    /**
     * Use this function to create the response validation
     *
     * @param schema Zod schema
     * @param value Value to be valid
     * @returns Validated value
     */
    public static parser(schema: z.ZodTypeAny, value: unknown): unknown {
        /**
         * Check if the global customZodParser is defined
         * and use it to validate the value if it exists
         */
        const customZodParser = KenaiGlobal.get<CustomZodParser>('custom-zod-parser');
        if (customZodParser) return customZodParser(schema, value);

        /**
         * If there is no custom parser, use the default Zod parse
         * to validate the value
         */
        return schema.parse(value);
    }

    /**
     * Use this function to solve custom parameters for the controller handler
     *
     * @param args Handler parameters
     */
    private resolveCustomParams(args: Parameters<CallbackOriginalFunction>) {
        const customParams = this.controller.customHandlerParams;
        if (!customParams || !customParams.length) return args;

        const [request, reply] = args;
        const data = new ObjectManager({ request, reply });

        return <[any, any]>customParams.map((param) => data.get(param));
    }
}

export type CallbackOriginalFunction = (...args: Parameters<FastifyHandler>) => unknown;
