import ControllerManager from '@managers/controller.manager';

// Types
import type { z } from 'zod';

export function BodySchema(schema: z.ZodTypeAny) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                body: schema,
            },
        });

        return descriptor;
    };
}
