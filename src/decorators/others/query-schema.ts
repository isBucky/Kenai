import { createValidationSchema } from '@builders/validation-schema';
import { ControllerManager } from '@managers/controller.manager';
import { toJSONSchema, type z } from 'zod';

/**
 * Decorator to set the request querystring validation schema
 *
 * @param schema The zod schema to validate the request querystring
 * @param omitUnknownKeys If true, the validator will remove extraneous keys from the object
 * @returns A function that accepts the target object and the key of the method being decorated
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#queryschema | Documentation}
 */
export function QuerySchema(schema: z.ZodType, omitUnknownKeys: boolean = false) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (
            !['ZodObject', 'ZodIntersection', 'ZodRecord'].includes(
                <string>schema.def?.['typeName'],
            )
        )
            throw new Error('The schema must be a ZodObject');

        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            middlewares: [createValidationSchema({ schema, from: 'query', omitUnknownKeys })],
            options: {
                querystring: {
                    get zod() {
                        return schema;
                    },

                    get json() {
                        return toJSONSchema(schema, { io: 'input' });
                    },
                },
            },
        });

        return descriptor;
    };
}
