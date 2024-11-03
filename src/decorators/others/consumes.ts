import { ControllerManager } from '@managers/controller.manager';

/**
 * Decorator to set the consumes of a route.
 *
 * @param consumes The accepted mime types.
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#consumes | Documentation}
 */
export function Consumes(consumes: string[]) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!consumes || !consumes.length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                consumes,
            },
        });

        return descriptor;
    };
}
