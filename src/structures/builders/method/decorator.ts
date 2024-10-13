import ControllerManager from '@managers/controller.manager';
import { resolvePath } from '@utils/resolve-path';
import { HandlerMethod } from './handler';

// Types
import type { FastifyHandler, FastifyValidation } from '@decorators/middlewares';
import type { Methods } from '@utils/index';
import type { z } from 'zod';

/**
 * Use this function to create a decorator for the request methods
 *
 * @param method Method that will be created
 */
export function createMethodDecorator(method: Methods, url: string = '/') {
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
        });

        return descriptor;
    };
}

export type Controllers = Map<PropertyKey, ControllerMetadata>;

export interface ControllerMetadata {
    /**
     * Path that the route is responsible for
     */
    url: string;

    /**
     * Route request method
     */
    method: Methods;

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
    description?: string;
    summary?: string;
    tags?: string[];
    operationId?: string;

    consumes?: string[];
    produces?: string[];
    security?: Record<string, string[]>;
    deprecated?: boolean;
    hide?: boolean;

    body?: z.ZodTypeAny;
    querystring?: z.ZodTypeAny;
    params?: z.ZodTypeAny;

    response?: {
        [status: number]: z.ZodTypeAny;
    };

    /**
     * If defined, the route has a cache where the request return will be saved
     */
    cache?: {
        /**
         * Use to define how long the data will remain in cache
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
    };
}
