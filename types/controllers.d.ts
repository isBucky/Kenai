import { Methods, Status } from '../src/structures/utils/index';
import { MethodDecoratorOptions } from './method-decorators';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyHandler, FastifyValidation } from '.';
import { ContentType, HttpCodes } from '@decorators/others';
import { z } from 'zod';

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
