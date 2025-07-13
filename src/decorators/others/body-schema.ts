import { createValidationSchema } from '@builders/validation-schema';
import { ControllerManager } from '@managers/controller.manager';
import { createSchema } from 'zod-openapi';

// Types
import type { z } from 'zod';

/**
 * Decorator to set the request body validation schema
 *
 * @param schema The zod schema to validate the request body
 * @param omitUnknownKeys If true, the validator will remove extraneous keys from the object
 * @returns A function that accepts the target object and the key of the method being decorated
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#bodyschema | Documentation}
 */
export function BodySchema(schema: z.ZodType, omitUnknownKeys: boolean = true) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            middlewares: [createValidationSchema({ schema, from: 'body', omitUnknownKeys })],
            options: {
                body: {
                    get zod() {
                        return schema;
                    },

                    get json() {
                        return createSchema(schema).schema;
                    },
                }
            },
        });

        return descriptor;
    };
}
