import '@fastify/swagger';

import { Middlewares } from '@decorators/middlewares';
import { HandlerMethod } from './method/handler';
import { RedisManager } from '@managers/redis';
import { Router } from '@decorators/router';
import { getMetadata } from '@utils/index';

import { createSchema } from 'zod-openapi';
import fastifyPlugin from 'fastify-plugin';

// Types
import type { ControllerMetadata } from '@builders/method/decorator';
import type { CustomZodParser } from './validation-schema';
import type { FastifySchema, RouteOptions } from 'fastify';
import type { RedisOptions } from 'ioredis';
import type Redis from 'ioredis';

/**
 * Plugin responsible for loading the decorator routes
 */
export const MaoriPlugin = fastifyPlugin(
    function MaoriPlugin(fastify, options: PluginOptions, done) {
        if (!options.mainRoute) throw new Error('You did not define a main route.');

        if (!isClass(options.mainRoute) || !getMetadata('router', options.mainRoute))
            throw new Error('The informed main route does not have a signature of our decorators.');

        const routes = Router.getData(options.mainRoute);
        if (!routes || !routes.size) return done();

        if (options.customZodParser) Middlewares.setCustomZodParser(options.customZodParser);
        if (options.redis) RedisManager.initialize(options.redis);

        for (const [, route] of routes.entries()) {
            try {
                fastify.route(
                    removeUndefinedProperties({
                        url: route.url,
                        method: route.method,

                        schema: removeUndefinedProperties({
                            description: route.options?.description,
                            summary: route.options?.summary,
                            operationId: route.options?.operationId,
                            tags: route.options?.tags,
                            consumes: route.options?.consumes,
                            deprecated: route.options?.deprecated,
                            hide: route.options?.hide,
                            produces: route.options?.produces,
                            security: route.options?.security,

                            response: makeResponse(route),

                            body: route.options?.body
                                ? !['GET', 'HEAD'].includes(route.method)
                                    ? createSchema(route.options?.body).schema
                                    : undefined
                                : undefined,
                            params: route.options?.params
                                ? createSchema(route.options.params).schema
                                : undefined,
                            querystring: route.options?.querystring
                                ? createSchema(route.options.querystring).schema
                                : undefined,
                        } as FastifySchema),

                        validatorCompiler: () => () => ({ value: true }),
                        serializerCompiler: () => (data) => JSON.stringify(data),

                        preValidation: route.middlewares,
                        onSend: HandlerMethod.onSend(route),

                        handler: route.handler.bind(
                            new route.constructorController(
                                ...(options.controllerParameters || []),
                            ),
                        ),
                    } as RouteOptions),
                );
            } catch (error: any) {
                error.route = route;

                throw error;
            }
        }

        done();
    },
    {
        name: 'maori',
        fastify: '5.x',
    },
);

function makeResponse(route: ControllerMetadata) {
    if (!route?.options?.response) return;
    return Object.fromEntries(
        Object.entries(route.options!.response!).map(([status, schema]) => [
            status,
            createSchema(schema).schema,
        ]),
    );
}

function removeUndefinedProperties<T extends object>(data: T): T {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
    ) as T;
}

function isClass(route: PluginOptions['mainRoute']) {
    return typeof route === 'function' && typeof route.prototype !== 'undefined';
}

export interface PluginOptions {
    /**
     * Main route of your application
     */
    mainRoute: new (...args: any[]) => any;

    /**
     * Here you can define the parameters for the class that controllers were created
     */
    controllerParameters?: any[];

    /**
     * Here you can define a custom parser for validations, such as generating
     * modified messages or modified errors
     */
    customZodParser?: CustomZodParser;

    /**
     * Use to define a connection with Redis to use as a cache
     */
    redis?: RedisOptions | Redis | string;
}
