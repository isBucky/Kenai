import { MemoryCache } from './memory';
import { Redis } from './redis';

// Types
import type { RouteOptions } from '../../functions';
import type { FastifyRequest } from 'fastify';

/**
 * 
 */
export class CacheHandler {
    /**
     * 
     * @param request 
     * @param cache 
     */
    static async get(request: FastifyRequest, cache: NonNullable<RouteOptions['cache']>) {
        if (request?.socket?.closed) return;

        if (cache.cacheIn == 'memory') return MemoryCache.get(request.url);
        else return await Redis.get(request.url);
    }

    /**
     * 
     * @param request 
     * @param cache 
     * @param value 
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
     * 
     * @param request 
     * @param cache 
     */
    static async delete(request: FastifyRequest, cache: NonNullable<RouteOptions['cache']>) {
        if (request?.socket?.closed) return;

        if (cache.cacheIn == 'memory') return MemoryCache.delete(request.url);
        else return await Redis.delete(request.url);
    }
}
