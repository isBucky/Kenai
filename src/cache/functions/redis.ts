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
     * Use essa função para iniciar a conexão com redis
     *
     * @param options Opções de configurações
     */
    static initialize(options?: IoRedis | IoRedis['options'] | string) {
        if (!options) return KenaiGlobal.set('redis', new IoRedis());
        if (options instanceof IoRedis) return KenaiGlobal.set('redis', options);

        return KenaiGlobal.set('redis', new IoRedis(<any>options));
    }

    /**
     * Usa essa função para obter valores salvos no redis
     *
     * @param path Caminho
     */
    static async get(path: string) {
        const buffer = await this._redis.getBuffer(this._prefix + path);
        if (!buffer) return;

        return JSON.parse(zlib.inflateSync(buffer).toString());
    }

    /**
     * Usa essa função para definir valores no redis
     *
     * @param path Caminho
     * @param value Valor para ser definido
     * @param ttl Tempo em segundos para expirar o valor
     */
    static async set(path: string, value: any, ttl: number = 5 * 60) {
        if (!value) return;

        return await this._redis.setex(
            this._prefix + path,
            ttl,
            zlib.deflateSync(JSON.stringify(value)),
        );
    }

    /**
     * Use para deletar um valor do redis
     *
     * @param path Caminho
     */
    static async delete(path: string) {
        return await this._redis.del(this._prefix + path).catch(() => null);
    }
}
