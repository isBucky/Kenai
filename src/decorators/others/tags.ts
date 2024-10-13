import ControllerManager from '@managers/controller.manager';

export function Tags(tags: string[]) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!tags || !tags.length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                tags,
            },
        });

        return descriptor;
    };
}
