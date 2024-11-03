import { ControllerManager } from '@managers/controller.manager';

/**
 * Decorator to hide a route from the OpenAPI documentation.
 *
 * @remarks
 * Routes decorated with this decorator will not appear in the OpenAPI documentation.
 *
 * @param target The target object (class or object) on which the decorated method is defined.
 * @param key The property key of the method.
 * @param descriptor The property descriptor of the method.
 * @returns The same property descriptor, but with the `hide: true` option set.
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#hide | Documentation}
 */
export function Hide(target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
    new ControllerManager(target.constructor).update(key, {
        options: {
            hide: true,
        },
    });

    return descriptor;
}
