import { createValidationSchema } from '@builders/validation-schema';
import ControllerManager from '@managers/controller.manager';

// Types
import type { z } from 'zod';

export function QuerySchema(schema: z.ZodTypeAny, omitUnknownKeys: boolean = false) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            middlewares: [createValidationSchema({ schema, from: 'body', omitUnknownKeys })],
            options: { querystring: schema },
        });

        return descriptor;
    };
}
