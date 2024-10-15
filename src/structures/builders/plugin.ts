import '@fastify/swagger';

import { Middlewares } from '@decorators/middlewares';
import { HandlerMethod } from './method/handler';
import { RedisManager } from '@managers/redis';
import { Router } from '@decorators/router';
import { getMetadata } from '@utils/index';

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
export const KenaiPlugin = fastifyPlugin(
    function KenaiPlugin(fastify, options: PluginOptions, done) {
        // If the user does not inform a main route, throw an error
        if (!options.mainRoute) throw new Error('You did not define a main route.');

        // Check if the main route is a class with the kenai router decorator
        if (!isClass(options.mainRoute) || !getMetadata('router', options.mainRoute))
            throw new Error('The informed main route does not have a signature of our decorators.');

        // Get all routes from the main route
        const routes = Router.getData(options.mainRoute);
        if (!routes || !routes.size) return done();

        // If the user inform a custom Zod parser, set it
        if (options.customZodParser) Middlewares.setCustomZodParser(options.customZodParser);
        // If the user inform Redis options, initialize it
        if (options.redis) RedisManager.initialize(options.redis);

        // Loop through all routes and create a new route for each one
        for (const [, route] of routes.entries()) {
            try {
                // Create the route with the options informed by the user
                fastify.route(
                    removeUndefinedProperties({
                        ...route.options?.fastifyRouteOptions,

                        url: route.url,
                        method: route.method,

                        schema: removeUndefinedProperties({
                            ...route.options?.fastifyRouteOptions?.schema,

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

                            body: route.options?.body?.json,
                            params: route.options?.params?.json,
                            querystring: route.options?.querystring?.json,
                        } as FastifySchema),

                        validatorCompiler: () => (data) => ({ value: data }),
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
                // If an error occurs, add the route to the error and throw it
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

/**
 * Creates a response object for a route, using the response from the route
 * options, and transforming it into a format that Fastify can understand.
 *
 * @param route The route metadata
 * @returns The response object
 */
function makeResponse(route: ControllerMetadata) {
    if (!route?.options?.response) return;

    return Object.fromEntries(
        Object.entries(route.options!.response!).map(([status, { json }]) => [status, json]),
    );
}

/**
 * Removes all properties from an object which have an undefined value.
 *
 * @example
 * const input = { a: 1, b: undefined, c: 3 };
 * const output = removeUndefinedProperties(input);
 * // output is { a: 1, c: 3 }
 *
 * @param data The object to remove undefined properties from
 * @returns The object with all undefined properties removed
 */
function removeUndefinedProperties<T extends object>(data: T): T {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
    ) as T;
}

/**
 * Checks if the given value is a class (i.e. a function with a prototype).
 *
 * @param route The value to check
 * @returns True if the value is a class, false otherwise
 */
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
