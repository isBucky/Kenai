import ControllerManager from '@managers/controller.manager';

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
