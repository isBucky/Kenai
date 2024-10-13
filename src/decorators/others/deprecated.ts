import ControllerManager from '@managers/controller.manager';

export function Deprecated(target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
    new ControllerManager(target.constructor).update(key, {
        options: {
            deprecated: true,
        },
    });

    return descriptor;
}
