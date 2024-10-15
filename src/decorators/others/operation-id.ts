import ControllerManager from '@managers/controller.manager';

/**
 * Use to set the operation id for a controller.
 *
 * The operation id is the unique identifier for an operation. It is used
 * to identify the operation in the OpenAPI specification.
 *
 * @param id The operation id.
 *
 * @returns A decorator function that sets the operation id for the controller.
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#operationid | Documentation}
 */
export function OperationId(id: string) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!id || !id.length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                operationId: id,
            },
        });

        return descriptor;
    };
}
