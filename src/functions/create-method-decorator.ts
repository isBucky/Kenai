import { HandlerMethod, type RestFunctionArgs } from './handler-method';
import {
    type Methods,
    MethodsEnum,
    Symbols,
    Status,
    ReplySchema,
    RequestSchema,
} from '../config/utils';

import { resolvePath } from './resolve-path';
import trycatch from 'try-catch';

// Types
import type { HookHandlerDoneFunction } from 'fastify';
import type { DocsDecoratorOptions } from '../docs';
import type { RouteHandler } from '../router';
import type { CacheOptions } from '../cache';

/**
 * Use this function to create a decorator for the request methods
 *
 * @param method Method that will be created
 * @param url Route path
 * @param options Route configuration options
 */
export function createMethodDecorator(
    method: Methods,
    url: string = '/',
    options?: MethodDecoratorOptions,
) {
    if (!MethodsEnum[method.toUpperCase()])
        throw new Error('This request method does not exist. ' + method);
    if (!url.length) url = '/';

    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const originalFunction = descriptor.value;

        descriptor.value = async function Handler(...args: RestFunctionArgs) {
            if (!args[0]) throw new Error('The first parameter must be the object of the request');
            if (!args[1]) throw new Error('The second argument must be reply');

            const [RequestInvalid, ReplyInvalid] = [
                trycatch(RequestSchema.parse, args[0])[0],
                trycatch(ReplySchema.parse, args[1])[0],
            ];

            if (RequestInvalid)
                throw new Error('The first parameter is not a valid request object');
            if (ReplyInvalid)
                throw new Error('The second parameter of the request response is not valid');

            return await HandlerMethod(
                (...args: any[]) => originalFunction.call(this, ...args),
                args,
                target,
                key,
            );
        };

        const controller = Reflect.getMetadata(Symbols['controller'], target.constructor);

        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [key as string]: {
                    ...controller?.[key],

                    url: resolvePath(url),
                    method: method.toUpperCase() as Methods,
                    handler: descriptor.value,
                    controller: target.constructor,

                    options: {
                        ...controller?.[key]?.options,

                        reply: {
                            status:
                                typeof options?.status === 'string'
                                    ? Status[options.status]
                                    : options?.status,

                            replySchema: options?.replySchema,
                        },
                    },

                    validations: options?.validations,
                } as RouteStructure,
            } satisfies Controller,
            target.constructor,
        );

        return descriptor;
    };
}

export type MethodDecoratorParams = [path?: string, options?: MethodDecoratorOptions];

export interface MethodDecoratorOptions {
    /**
     * Use to set the request response status
     *
     * @default 200 = OK
     */
    status?: number | keyof typeof Status;

    /**
     * Use to define the request response validation scheme
     */
    replySchema?: {
        /**
         * Scheme to validate the response
         */
        schema: any;

        /**
         * If you want it to not remove extraneous keys from the object, set it to false
         *
         * @default false
         */
        omitUnknownKeys?: boolean;
    };

    /**
     * Use to set route validations
     */
    validations?: Validation[];
}

export type Validation = (
    request: any,
    reply: any,
    done: HookHandlerDoneFunction,
) => Promise<unknown> | unknown;

export interface RouteStructure {
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
    handler: RouteHandler;

    controller: any;

    /**
     * Here you will find all the route definition options, such as response status, cache, etc.
     */
    options?: RouteOptions;

    /**
     * Here will be the information that the person wants to save on the route, something that is relevant
     */
    metadata: any;

    /**
     * Validations for the route before it is responded to by the main function
     */
    validations?: Validation[];
}

export interface RouteOptions {
    /**
     * Route Docs
     */
    docs?: DocsDecoratorOptions;

    /**
     * Main function parameters
     */
    functionParams?: string[];

    /**
     * Request response options
     */
    reply?: {
        /**
         * Status of the request that the route will return
         *
         * @default 200
         */
        status?: number;

        /**
         * Request response validation scheme
         */
        replySchema?: MethodDecoratorOptions['replySchema'];
    };

    /**
     * If defined, the route has a cache where the request return will be saved
     */
    cache?: CacheOptions & { deleteCache?: boolean; };
}

export type Controller = {
    [k: PropertyKey]: RouteStructure;
};
