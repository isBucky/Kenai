import { jsonReviver } from '@utils/json-reviver';
import { KenaiGlobal } from './kenai-global';

import IoRedis, { type RedisOptions } from 'ioredis';

import zlib from 'node:zlib';

export class RedisManager {
    private static _prefix = 'kenai:cache:';
    private static _prefix_buffer = 'kenai:buffer_cache:';

    /**
     * Return the IoRedis instance.
     *
     * @returns IoRedis instance
     */
    private static get _redis() {
        return KenaiGlobal.get('redis') as IoRedis;
    }

    /**
     * If true, Redis will store data in a buffer,
     * which can help to reduce memory usage.
     *
     * @param value If true, Redis will store data in a buffer
     * @returns The value of the variable
     */

    public static setBufferRedisData(value: boolean) {
        return KenaiGlobal.set('useBufferRedisData', value);
    }

    /**
     * Check if Redis is configured to store data in a buffer.
     *
     * @returns If true, Redis is configured to store data in a buffer
     */
    private static get useBufferRedisData() {
        return KenaiGlobal.has('useBufferRedisData');
    }

    /**
     * Initialize the Redis connection.
     *
     * @param options IoRedis instance, Redis connection options or a connection string
     */
    public static initialize(options: RedisOptions | IoRedis | string) {
        if (options instanceof IoRedis) return KenaiGlobal.set('redis', options);
        return KenaiGlobal.set('redis', new IoRedis(<any>options));
    }

    /**
     * Retrieve a value from Redis using a specified path.
     *
     * @param path The key path to retrieve the value from Redis.
     * @returns The parsed JSON value if retrieval is successful, otherwise the raw value.
     * @throws Error if the Redis instance is not initialized.
     */
    public static async get(path: string) {
        if (!this._redis) {
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );
        }

        let value: string;

        if (this.useBufferRedisData) {
            // Retrieve the buffer data from Redis
            const buffer = await this._redis.getBuffer(this.resolvePath(path));
            if (!buffer) return; // Return undefined if buffer is not found

            // Decompress the buffer data
            value = zlib.inflateSync(buffer).toString();
        } else {
            // Retrieve the cached value as a string
            const valueCached = await this._redis.get(this.resolvePath(path));
            if (!valueCached) return; // Return undefined if value is not found

            value = valueCached;
        }

        try {
            // Attempt to parse the retrieved value as JSON
            return JSON.parse(value, jsonReviver);
        } catch (error) {
            // Return the raw value if JSON parsing fails
            return value;
        }
    }

    /**
     * Set a value in Redis with a specified time-to-live (TTL).
     *
     * @param path The key path to store the value under in Redis.
     * @param value The value to store in Redis. If the value is not provided, the function will return without setting anything.
     * @param ttl The time-to-live in seconds for the stored value. Defaults to 5 minutes.
     *
     * @throws Error if Redis has not been initialized.
     */
    public static async set(path: string, value: any, ttl: number = 5 * 60) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        if (!value) return;

        return await this._redis.setex(
            this.resolvePath(path),
            ttl,
            this.useBufferRedisData
                ? zlib.deflateSync(JSON.stringify(value))
                : JSON.stringify(value, null, 0),
        );
    }

    /**
     * Deletes a value from Redis.
     *
     * @param path The key path of the value to delete in Redis.
     *
     * @throws Error if Redis has not been initialized.
     */
    public static async delete(path: string, deleteAllKeys: boolean = false) {
        if (!this._redis)
            throw new Error(
                'You chose to use Redis as a cache, but did not use the Initialize function.',
            );

        if (deleteAllKeys) {
            const scan = this._redis.scanStream({ match: this.resolvePath(path) + '*' });

            for await (const keys of scan) {
                if (!keys?.length) continue;

                await this._redis.del(...keys).catch(() => null);
            }

            return;
        }

        return await this._redis.del(this.resolvePath(path)).catch(() => null);
    }

    private static resolvePath(path: string) {
        path = (this.useBufferRedisData ? this._prefix_buffer : this._prefix) + path;
        path = path.replace(/\//g, ':');
        path = path.replace(/:+/g, ':');

        return path.replace(/^:|:$/g, '');
    }
}
