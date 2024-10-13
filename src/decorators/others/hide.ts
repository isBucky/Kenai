import ControllerManager from '@managers/controller.manager';

export function Hide(target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
    new ControllerManager(target.constructor).update(key, {
        options: {
            hide: true,
        },
    });

    return descriptor;
}
