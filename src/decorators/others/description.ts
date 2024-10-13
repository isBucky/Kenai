import ControllerManager from '@managers/controller.manager';

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
