import { ControllerManager } from '@managers/controller.manager';

/**
 * Decorator to mark a route as deprecated.
 *
 * @remarks
 * This decorator is used to indicate that a route is deprecated and should not be used.
 * The route will still be available and will still work as expected, but it will be marked
 * as deprecated in the OpenAPI documentation.
 *
 * @param target The target object (class or object) on which the decorated method is defined.
 * @param key The property key of the method.
 * @param descriptor The property descriptor of the method.
 * @returns The same property descriptor, but with the `deprecated: true` option set.
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#deprecated | Documentation}
 */
export function Deprecated(target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
    new ControllerManager(target.constructor).update(key, {
        options: {
            deprecated: true,
        },
    });

    return descriptor;
}
