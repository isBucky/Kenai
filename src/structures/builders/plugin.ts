import { Middlewares } from '@decorators/middlewares';
import { buildRouters } from './build-routers';
import { RedisManager } from '@managers/redis';
import { isClass } from '@utils/is-class';

import fastifyPlugin from 'fastify-plugin';

// Types
import type { RedisOptions } from 'ioredis';
import type Redis from 'ioredis';
import { RouteOptions } from 'fastify';

/**
 * Plugin responsible for loading the decorator routes
 */
export const KenaiPlugin = fastifyPlugin(
    function KenaiPlugin(fastify, options: PluginOptions, done) {
        // If the user does not inform a main route, throw an error
        if (!options.routes || !options.routes.length)
            throw new Error('You did not define any route to load');

        // If the user inform a custom Zod parser, set it
        if (options.customZodParser) Middlewares.setCustomZodParser(options.customZodParser);

        // If the user inform Redis options, initialize it
        if (options.redis) RedisManager.initialize(options.redis);

        // If the user wants to use Redis as a cache
        if (options.bufferRedisData === true) RedisManager.setBufferRedisData(true);

        for (const unresolvedRoute of options.routes) {
            if (!isClass(unresolvedRoute))
                throw new Error('One of the routes informed is not a valid class');

            buildRouters({
                fastify,
                unresolvedRoute,
                controllerParameters: options.controllerParameters,
                handler: options.handler,
            });
        }

        return done();
    },
    {
        name: 'kenai',
        fastify: '5.x',
    },
);

export interface PluginOptions {
    /**
     * Main route of your application
     */
    routes: (new (...args: any[]) => any)[];

    /**
     * Here you can define the parameters for the class that controllers were created
     */
    controllerParameters?: any[];

    handler?: (data: RouteOptions) => RouteOptions;

    /**
     * Here you can define a custom parser for validations, such as generating
     * modified messages or modified errors
     */
    customZodParser?: any;

    /**
     * Use to define a connection with Redis to use as a cache
     */
    redis?: RedisOptions | Redis | string;

    /**
     * If true, the data stored in Redis will be buffered,
     * if false, the data will be stored in plain text.
     *
     * @remarks Saving data in buffer in redis saves a considerable amount of memory
     *
     * @default false
     */
    bufferRedisData?: boolean;
}
