import { ControllerManager } from '@managers/controller.manager';

/**
 * Use this route to delete caches for routes where values need to be updated.
 * For example, if you have cache stored for the route `/user/{id}` and set this
 * function for a route with the same URL, the corresponding cache will be
 * automatically deleted. This ensures that the route caches are always kept up
 * to date, maintaining consistency of the data.
 *
 * @param deleteAllKeys You can use the deleteAllKeys parameter, which is
 * responsible for deleting all cache keys associated with a specific URL. For
 * example, imagine you have a users route where user information is cached.
 * When fetching a user's details, they are stored in the cache under the path
 * `/users/{id}`. However, if you have a route that deletes all users from the
 * database, using this parameter allows you to clear all cached values for the
 * `/users` route, ensuring that the cache is properly refreshed. Default is
 * false.
 *
 * @see
 * {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#cacheinvalidateonupdate | Documentation}
 */
export function InvalidateOnUpdate(deleteAllKeys: boolean = false) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        new ControllerManager(target.constructor).update(key, {
            options: {
                cache: {
                    ttl: undefined,
                    invalidateOnUpdate: true,
                    deleteAllKeys,
                },
            },
        });

        return descriptor;
    };
}
