import { createValidationSchema } from '@builders/validation-schema';
import { ControllerManager } from '@managers/controller.manager';
import { createSchema } from 'zod-openapi';

// Types
import type { $ZodType } from 'zod/v4/core';

/**
 * Decorator to set the request querystring validation schema
 *
 * @param schema The zod schema to validate the request querystring
 * @param omitUnknownKeys If true, the validator will remove extraneous keys from the object
 * @returns A function that accepts the target object and the key of the method being decorated
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#queryschema | Documentation}
 */
export function QuerySchema(schema: $ZodType, omitUnknownKeys: boolean = false) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!['object', 'intersection', 'record'].includes(schema._zod.def.type)) throw new Error('The schema must be a ZodObject');

        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            middlewares: [createValidationSchema({ schema, from: 'query', omitUnknownKeys })],
            options: {
                querystring: {
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
