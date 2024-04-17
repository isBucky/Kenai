import { Symbols } from '../../config/utils';

import ObjectManager from 'object.mn';

export class KenaiGlobal {
    private static get _global(): ObjectManager {
        if (!global[Symbols['global']]) global[Symbols['global']] = {};
        return new ObjectManager(global[Symbols['global']]);
    }

    /**
     * Use essa função para obter valores globais
     *
     * @param path Caminho
     */
    static get(path: string) {
        return this._global.get(path);
    }

    /**
     * Use para definir valores globais
     *
     * @param path Caminho
     */
    static set(path: string, value: any) {
        return this._global.set(path, value);
    }

    /**
     * Use para deletar valores globais
     *
     * @param path Caminho
     */
    static delete(path: string) {
        return this._global.delete(path);
    }
}
