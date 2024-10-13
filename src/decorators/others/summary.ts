import ControllerManager from '@managers/controller.manager';

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
