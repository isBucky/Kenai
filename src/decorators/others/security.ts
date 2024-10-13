import ControllerManager from '@managers/controller.manager';

export function Security(security: Record<string, string[]>) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!security || !Object.keys(security).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                security,
            },
        });

        return descriptor;
    };
}
