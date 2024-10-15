import ControllerManager from '@managers/controller.manager';

/**
 * Decorator to set tags for a route
 *
 * @param tags - Route tags
 * @returns A decorator that adds the tags to the route
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#tags | Documentation}
 */
export function Tags(...tags: string[]) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!tags || !tags.length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                tags,
            },
        });

        return descriptor;
    };
}
