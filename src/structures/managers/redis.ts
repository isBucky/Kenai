import { KenaiGlobal } from './kenai-global';

import IoRedis, { type RedisOptions } from 'ioredis';

import zlib from 'node:zlib';

export class RedisManager {
    private static get _redis() {
        return KenaiGlobal.get('redis') as IoRedis;
    }

    private static _prefix = 'kenai:cache:';

    /**
     * Use this function to start connecting to redis
     *
     * @param options Settings options
     */
    public static initialize(options: RedisOptions | IoRedis | string) {
        if (options instanceof IoRedis) return KenaiGlobal.set('redis', options);
        return KenaiGlobal.set('redis', new IoRedis(<any>options));
    }

    /**
     * Use this function to get values ​​saved in redis
     *
     * @param path Path
     */
    public static async get(path: string) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        const buffer = await this._redis.getBuffer(this._prefix + path);
        if (!buffer) return;

        const value = zlib.inflateSync(buffer);
        try {
            return JSON.parse(value.toString());
        } catch (error) {
            return value;
        }
    }

    /**
     * Use this function to set values ​​in redis
     *
     * @param path Path
     * @param value Value to be set
     * @param ttl Time in seconds for the value to expire
     */
    public static async set(path: string, value: any, ttl: number = 5 * 60) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        if (!value) return;

        return await this._redis.setex(
            this._prefix + path,
            ttl,
            zlib.deflateSync(JSON.stringify(value)),
        );
    }

    /**
     * Use to delete a value from redis
     *
     * @param path Path
     */
    public static async delete(path: string) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        return await this._redis.del(this._prefix + path).catch(() => null);
    }
}
