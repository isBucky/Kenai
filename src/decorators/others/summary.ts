import ControllerManager from '@managers/controller.manager';

/**
 * Sets the summary of the endpoint.
 *
 * @param message The summary to set.
 * @returns A function that will be called by the decorator.
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#summary | Documentation}
 */
export function Summary(message: string) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!message || !message.length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                summary: message,
            },
        });

        return descriptor;
    };
}
