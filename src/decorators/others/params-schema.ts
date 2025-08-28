import { createValidationSchema } from '@builders/validation-schema';
import { ControllerManager } from '@managers/controller.manager';
import { createSchema } from 'zod-openapi';

// Types
import type { $ZodType } from 'zod/v4/core';

/**
 * Decorator to set the request parameter validation schema
 *
 * @param schema The zod schema to validate the request params
 * @param omitUnknownKeys If true, the validator will remove extraneous keys from the object
 * @returns A function that accepts the target object and the key of the method being decorated
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#paramsschema | Documentation}
 */
export function ParamsSchema(schema: $ZodType) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!['object', 'intersection', 'record'].includes(schema._zod.def.type))
            throw new Error('The schema must be a ZodObject');

        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            middlewares: [
                createValidationSchema({ schema, from: 'params', omitUnknownKeys: false }),
            ],
            options: {
                params: {
                    get zod() {
                        return schema;
                    },

                    get json() {
                        return createSchema(schema, { io: 'input' }).schema;
                    },
                },
            },
        });

        return descriptor;
    };
}
