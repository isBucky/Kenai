import { ControllerManager } from '@managers/controller.manager';
import { resolvePath } from '@utils/resolve-path';
import { HandlerMethod } from './handler';

// Types
import type { FastifyHandler, FastifyValidation } from '@decorators/middlewares';
import type { _HTTPMethods } from 'fastify/types/utils';
import type { RouteShorthandOptions } from 'fastify';
import type { SafeZodType } from 'types';

/**
 * Function used to create a decorator for a controller method
 *
 * @param method Method type (GET, POST, PUT, DELETE, PATCH, OPTIONS)
 * @param url Path to create the route
 * @param fastifyRouteOptions Fastify route options
 *
 * @return A decorator function
 */
export function createMethodDecorator(
    method: _HTTPMethods,
    url?: string | RouteShorthandOptions,
    fastifyRouteOptions?: RouteShorthandOptions,
) {
    if (typeof url !== 'string') {
        fastifyRouteOptions = url;
        url = '/';
    } else if (!url.length) url = '/';

    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const controllerManager = new ControllerManager(target.constructor);
        const originalFunction: Function = descriptor.value;

        /**
         * Function used to create a route manipulator
         *
         * @param args Arguments
         */
        descriptor.value = async function MaoriHandler(...args: Parameters<FastifyHandler>) {
            if (!args.length || typeof args[0] !== 'object' || typeof args[1] !== 'object')
                throw new Error('Os parâmetros Request e Reply não foram definidos corretamente');

            const handlerMethod = new HandlerMethod(target.constructor, key);
            return await handlerMethod.run((...args) => originalFunction.call(this, ...args), args);
        };

        // Assigning the defined values ​​for the controller
        controllerManager.create(key as string, {
            url: resolvePath(url),
            method,
            handler: descriptor.value,
            constructorController: <any>target.constructor,
            key,

            options: {
                fastifyRouteOptions,
            },
        });

        return descriptor;
    };
}

export type MethodDecoratorParams = [
    path?: string | RouteShorthandOptions,
    options?: RouteShorthandOptions,
];

export type Controllers = Map<PropertyKey, ControllerMetadata>;

export interface ControllerMetadata {
    /**
     * Path that the route is responsible for
     */
    url: string;

    /**
     * Route request method
     */
    method: _HTTPMethods;

    /**
     * Responsible function for responding to request
     */
    handler: FastifyHandler;

    /**
     * Main function parameters
     */
    customHandlerParams?: string[];

    /**
     * Controller class constructor
     */
    constructorController: new (...args: any[]) => any;

    /**
     * Property name
     */
    key: PropertyKey;

    /**
     * Middlewares for your route
     */
    middlewares?: FastifyValidation[];

    /**
     * Here you will find all the route definition options, such as response status, cache, etc.
     */
    options?: ControllerOptions;
}

export interface ControllerOptions {
    /**
     * Fastify route options
     */
    fastifyRouteOptions?: RouteShorthandOptions;

    /**
     * Optional description of the route
     */
    description?: string;

    /**
     * Optional summary of the route
     */
    summary?: string;

    /**
     * Optional tags for the route
     */
    tags?: string[];

    /**
     * Optional operationId for the route
     */
    operationId?: string;

    /**
     * Specify the MIME types of the request body
     */
    consumes?: string[];

    /**
     * Specify the MIME types of the response body
     */
    produces?: string[];

    /**
     * Specify security requirements for the route
     */
    security?: Record<string, string[]>[];

    /**
     * Specify if the route is deprecated
     */
    deprecated?: boolean;

    /**
     * Specify if the route should be hidden from documentation
     */
    hide?: boolean;

    /**
     * Specify the schema of the request body
     */
    body?: ZodAndJson;

    /**
     * Specify the schema of the querystring
     */
    querystring?: ZodAndJson;

    /**
     * Specify the schema of the route params
     */
    params?: ZodAndJson;

    /**
     * Specify the response schema for each status code
     */
    response?: {
        [code: number]: ZodAndJson;
    };

    /**
     * If defined, the route has a cache where the request return will be saved
     */
    cache?: {
        /**
         * Use to define how long the data will remain in cache (in seconds)
         *
         * @default 5 minutes
         */
        ttl?: number;

        /**
         * Use this function to invalidate the caches of your routes.Put
         * Example, when a GET request on the route is performed, the data is
         * stored in the cache.When calling this function, any new request
         * on the route to update or remove data will result in the removal of the
         * Cache, ensuring that the values ​​are always up to date.
         */
        invalidateOnUpdate?: boolean;

        /**
         * You can use the deleteAllKeys parameter, which is
         * responsible for deleting all cache keys associated with a specific URL. For
         * example, imagine you have a users route where user information is cached.
         * When fetching a user's details, they are stored in the cache under the path
         * `/users/{id}`. However, if you have a route that deletes all users from the
         * database, using this parameter allows you to clear all cached values for the
         * `/users` route, ensuring that the cache is properly refreshed.
         * 
         * @default false
         */
        deleteAllKeys?: boolean;
    };
}

/**
 * Interface used to represent the return of the
 * {@link createSchema} function, which returns a Zod schema
 * and a JSON representation of the same schema.
 */
export interface ZodAndJson {
    /**
     * When true, the zod schema will be considered as documentation and
     * won't be used as a validation schema.
     */
    isDocumentation?: boolean;

    /**
     * Zod schema
     */
    zod: SafeZodType | undefined;

    /**
     * JSON representation of the Zod schema
     */
    json: object;
}
