import ControllerManager from '@managers/controller.manager';
import { KenaiGlobal } from '@managers/kenai-global';
import { InvalidateOnUpdate } from './delete';

/**
 * Use this decorator to save the values ​​returned by the request, thus
 * reducing the time of answers
 *
 * @param ttl Time in seconds to delete cache data. Default is 300 = 5 minutes
 */
export function Cache(ttl?: number) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controllerManager = new ControllerManager(target.constructor);
        const controller = controllerManager.get(key);

        if (!controller || !KenaiGlobal.has('redis')) return descriptor;

        controllerManager.update(key, {
            options: {
                cache: {
                    ttl: ttl ?? 5 * 60,
                    invalidateOnUpdate: false,
                },
            },
        });

        return descriptor;
    };
}

Cache.InvalidateOnUpdate = InvalidateOnUpdate;
