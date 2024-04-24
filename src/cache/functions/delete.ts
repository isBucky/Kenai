import { Symbols } from '../../config/utils';

// Types
import type { Controller } from '../../functions';

export function DeleteCache(cacheIn: 'memory' | 'redis' = 'memory') {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controller: Controller = Reflect.getMetadata(
            Symbols['controller'],
            target.constructor,
        );

        if (!controller || !controller[key]) return descriptor;

        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [key]: {
                    ...controller[key],

                    options: {
                        ...controller[key].options,

                        cache: {
                            cacheIn,
                            deleteCache: true,
                        },
                    },
                },
            } as Controller,
            target.constructor,
        );

        return descriptor;
    };
}
