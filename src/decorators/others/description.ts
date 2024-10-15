import ControllerManager from '@managers/controller.manager';

/**
 * Sets the description of the endpoint.
 *
 * @param description The description to set.
 * @returns A function that will be called by the decorator.
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#description | Documentation}
 */
export function Description(description: string) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!description || !description.length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                description,
            },
        });

        return descriptor;
    };
}
