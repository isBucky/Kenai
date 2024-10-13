import ControllerManager from '@managers/controller.manager';
import { z } from 'zod';

export function ParamsSchema(schema: z.ZodTypeAny) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            options: {
                params: schema,
            },
        });

        return descriptor;
    };
}
