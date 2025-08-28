import { createValidationSchema } from '@builders/validation-schema';
import { ControllerManager } from '@managers/controller.manager';
import { createSchema } from 'zod-openapi';

// Types
import type { SafeZodType } from 'types';

/**
 * Decorator to set the request querystring validation schema
 *
 * @param schema The zod schema to validate the request querystring
 * @param omitUnknownKeys If true, the validator will remove extraneous keys from the object
 * @returns A function that accepts the target object and the key of the method being decorated
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#queryschema | Documentation}
 */
export function QuerySchema(schema: SafeZodType, omitUnknownKeys: boolean = false) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!['object', 'intersection', 'record'].includes(schema.def.type))
            throw new Error(
                `The body schema of the route ${target.constructor.name}.${String(key)} is empty or invalid`,
            );

        if (!schema || !Object.keys(schema).length) return descriptor;

        new ControllerManager(target.constructor).update(key, {
            middlewares: [createValidationSchema({ schema, from: 'query', omitUnknownKeys })],
            options: {
                querystring: {
                    get zod() {
                        return schema;
                    },

                    get json() {
                        try {
                            return createSchema(schema as any, { io: 'input' }).schema;
                        } catch (error) {
                            throw new Error(
                                `The output of the route ${target.constructor.name}.${String(key)} ` +
                                    `does not have a valid Zod schema, please check if the schema is correct`,
                                { cause: error },
                            );
                        }
                    },
                },
            },
        });

        return descriptor;
    };
}
