import { ControllerManager } from '@managers/controller.manager';

/**
 * This decorator is responsible for defining the securities that the route has
 * for the openapi
 *
 * @param security - The security of the route
 * @returns A decorator that adds the security to the route
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#security | Documentation}
 */
export function Security(security: Record<string, string[]>) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!security || !Object.keys(security).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                security: [security],
            },
        });

        return descriptor;
    };
}
