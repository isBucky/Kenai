import ControllerManager from '@managers/controller.manager';

/**
 * Use this function to invalidate the caches of your routes. Put
 * Example, when a GET request on the route is performed, the data is
 * stored in the cache. When calling this function, any new request
 * on the route to update or remove data will result in the removal of the
 * Cache, ensuring that the values ​​are always up to date.
 */
export function InvalidateOnUpdate() {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        new ControllerManager(target.constructor).update(key, {
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
