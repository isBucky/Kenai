import { KenaiGlobal } from './global';

import zlib from 'node:zlib';

export class MemoryCache {
    private static _cache = KenaiGlobal;

    /**
     * Use to get cached values ​​in memory
     *
     * @param path Path
     */
    static get(path: string): any {
        const value = this._cache.get('cache/' + path)?.value;
        if (!value) return;

        return JSON.parse(zlib.inflateSync(value).toString());
    }

    /**
     * Use to set values ​​in the in-memory cache
     *
     * @param path Path
     * @param value Value to set
     * @param ttl Time in seconds to delete the value. Standard: 5m
     */
    static set(path: string, value: any, ttl: number = 5 * 60) {
        if (!value) return;

        setTimeout(() => this.delete(path), ttl * 1e3);

        return this._cache.set('cache/' + path, {
            value: zlib.deflateSync(typeof value == 'object' ? JSON.stringify(value) : value),
            ttl,

            expiresIn: Date.now() + ttl * 1e3,
        } as CacheData);
    }

    /**
     * Use to delete values ​​from the in-memory cache
     *
     * @param path Path
     */
    static delete(path: string) {
        return this._cache.delete('cache/' + path);
    }
}

export interface CacheData {
    /**
     *  Value saved in cache
     */
    value: any;

    /**
     * Time in seconds to delete the value
     */
    ttl?: number;

    /**
     * Expiration time
     */
    expiresIn: number;
}
