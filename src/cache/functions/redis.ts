import { KenaiGlobal } from './global';

import zlib from 'node:zlib';

// Types
import IoRedis from 'ioredis';

export class Redis {
    private static get _redis() {
        return KenaiGlobal.get('redis') as IoRedis;
    }

    private static _prefix = 'kenai:cache:';

    /**
     * Use this function to start connecting to redis
     *
     * @param options Settings options
     *
     * @see
     * {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#cacheinitialize | Documentation}
     */
    static initialize(options?: IoRedis | IoRedis['options'] | string) {
        if (!options) return KenaiGlobal.set('redis', new IoRedis());
        if (options instanceof IoRedis) return KenaiGlobal.set('redis', options);

        return KenaiGlobal.set('redis', new IoRedis(<any>options));
    }

    /**
     * Use this function to get values ​​saved in redis
     *
     * @param path Path
     */
    static async get(path: string) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        const buffer = await this._redis.getBuffer(this._prefix + path);
        if (!buffer) return;

        return JSON.parse(zlib.inflateSync(buffer).toString());
    }

    /**
     * Use this function to set values ​​in redis
     *
     * @param path Path
     * @param value Value to be set
     * @param ttl Time in seconds for the value to expire
     */
    static async set(path: string, value: any, ttl: number = 5 * 60) {
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
    static async delete(path: string) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        return await this._redis.del(this._prefix + path).catch(() => null);
    }
}
