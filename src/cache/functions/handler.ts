import { MemoryCache } from './memory';
import { Redis } from './redis';

// Types
import type { RouteOptions } from '../../functions';
import type { FastifyRequest } from 'fastify';

export class CacheHandler {
    /**
     * Use this function to get a value from the cache
     * 
     * @param request Request body
     * @param cache Cache data
     */
    static async get(request: FastifyRequest, cache: NonNullable<RouteOptions['cache']>) {
        if (request?.socket?.closed) return;

        if (cache.cacheIn == 'memory') return MemoryCache.get(request.url);
        else return await Redis.get(request.url);
    }

    /**
     * Use this function to save new values ​​to the cache
     * 
     * @param request Request body
     * @param cache Cache data
     * @param value Value to save in cache
     */
    static async set(
        request: FastifyRequest,
        cache: NonNullable<RouteOptions['cache']>,
        value: unknown,
    ) {
        if (request?.socket?.closed || !value) return;

        if (cache.cacheIn == 'memory') return MemoryCache.set(request.url, value, cache.ttl);
        else return await Redis.set(request.url, value, cache.ttl);
    }

    /**
     * Use this function to delete values ​​from the cache
     * 
     * @param request Request body
     * @param cache Cache data
     */
    static async delete(request: FastifyRequest, cache: NonNullable<RouteOptions['cache']>) {
        if (request?.socket?.closed) return;

        if (cache.cacheIn == 'memory') return MemoryCache.delete(request.url);
        else return await Redis.delete(request.url);
    }
}
