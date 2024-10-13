import ControllerManager from '@managers/controller.manager';
import { KenaiGlobal } from '@managers/kenai-global';

/**
 * Use this function to invalidate the caches of your routes. Put
 * Example, when a GET request on the route is performed, the data is
 * stored in the cache. When calling this function, any new request
 * on the route to update or remove data will result in the removal of the
 * Cache, ensuring that the values ​​are always up to date.
 */
export function InvalidateOnUpdate() {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controllerManager = new ControllerManager(target.constructor);
        const controller = controllerManager.get(key);

        if (!controller || !KenaiGlobal.has('redis')) return descriptor;

        controllerManager.update(key, {
            options: {
                cache: {
                    ttl: undefined,
                    invalidateOnUpdate: true,
                },
            },
        });

        return descriptor;
    };
}
