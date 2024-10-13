import ControllerManager from '@managers/controller.manager';

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
