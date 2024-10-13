/* eslint-disable no-undef */
import { Symbols } from '@utils/index';

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
    public static get<Value>(path: string) {
        return this._global.get(path) as Value | undefined;
    }

    /**
     * Use to set global values
     *
     * @param path Path
     */
    public static set(path: string, value: any) {
        return this._global.set(path, value);
    }

    /**
     * Use to delete global values
     *
     * @param path Path
     */
    public static delete(path: string) {
        return this._global.delete(path);
    }

    /**
     * Use to verify that a value exists in global values
     *
     * @param path Path
     */
    public static has(path: string) {
        return this._global.has(path);
    }
}
