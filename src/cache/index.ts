import { Symbols } from '../config/utils';
import { DeleteCache } from './functions/delete';
import { Redis } from './functions/redis';

// Types
import type { Controller } from '../functions/';

/**
 * Use this decorator to create a cache in your route
 *
 * @param options Cache configuration options
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#cache | Documentation}
 */
export function Cache(optionsCache: CacheOptions) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controller: Controller = Reflect.getMetadata(
            Symbols['controller'],
            target.constructor,
        );

        // Checking if the class is a valid controller
        if (!controller || !controller[key]) return descriptor;

        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [key]: {
                    ...controller[key],

                    options: {
                        ...controller[key].options,

                        cache: {
                            ...optionsCache,

                            cacheIn: optionsCache.cacheIn ?? 'memory',
                        },
                    },
                },
            } as Controller,
            target.constructor,
        );

        return descriptor;
    };
}

export interface CacheOptions {
    cacheIn: 'memory' | 'redis';
    ttl?: number;
}

/**
 * Use this function to designate which route will be the one that erases the data
 *
 * @param redis Redis connection
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#cachedelete | Documentation}
 */
Cache.Delete = DeleteCache;

/**
 * Use essa função para iniciar a conexão com redis
 *
 * @param options Opções de configurações
 *
 * @see
 * {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#cacheinitialize | Documentation}
 */
Cache.initialize = Redis.initialize;
