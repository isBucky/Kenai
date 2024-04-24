import { Symbols } from '../config/utils';
import { DeleteCache } from './functions/delete';
import { Redis } from './functions/redis';

// Types
import type { Controller } from '../functions/';

/**
 *
 * @param options
 * @returns
 */
export function Cache(optionsCache: CacheOptions) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controller: Controller = Reflect.getMetadata(
            Symbols['controller'],
            target.constructor,
        );

        // Verificando se a classe é um controller válido
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
 * Use essa função para denominar qual rota vai ser a que apaga os dados
 *
 * @param redis Conexão redis
 */
Cache.Delete = DeleteCache;

/**
 * Use essa função para iniciar a conexão com redis
 *
 * @param options Opções de configurações
 */
Cache.initialize = Redis.initialize;
