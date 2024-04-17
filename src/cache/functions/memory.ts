import { KenaiGlobal } from './global';

import zlib from 'node:zlib';

export class MemoryCache {
    private static _cache = KenaiGlobal;

    /**
     * Use para obter valores salvos em cache na memória
     *
     * @param path Caminho
     */
    static get(path: string): any {
        const value = this._cache.get('cache/' + path)?.value;
        if (!value) return;

        return zlib.inflateSync(value);
    }

    /**
     * Use para definir valores no cache em memória
     *
     * @param path Caminho
     * @param value Valor para definir
     * @param ttl Tempo em segundos para excluir o valor. Padrão: 5m
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
     * Use para deletar valores no cache em memória
     *
     * @param path Caminho
     */
    static delete(path: string) {
        return this._cache.delete('cache/' + path);
    }
}

export interface CacheData {
    /**
     *  Valor salvo em cache
     */
    value: any;

    /***
     * Tempo em segundos para excluir o valor
     */
    ttl?: number;

    /**
     * Tempo de expiração
     */
    expiresIn: number;
}
