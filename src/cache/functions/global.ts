import { Symbols } from '../../config/utils';

import ObjectManager from 'object.mn';

export class KenaiGlobal {
    private static get _global(): ObjectManager {
        if (!global[Symbols['global']]) global[Symbols['global']] = {};
        return new ObjectManager(global[Symbols['global']]);
    }

    /**
     * Use this function to get global values
     *
     * @param path Path
     */
    static get(path: string) {
        return this._global.get(path);
    }

    /**
     * Use to set global values
     *
     * @param path Path
     */
    static set(path: string, value: any) {
        return this._global.set(path, value);
    }

    /**
     * Use to delete global values
     *
     * @param path Path
     */
    static delete(path: string) {
        return this._global.delete(path);
    }
}
