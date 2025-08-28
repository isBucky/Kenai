import { ControllerManager } from '@managers/controller.manager';
import { createSchema } from 'zod-openapi';

// Types
import type { SafeZodType } from 'types';

/**
 * This decorator is responsible for declaring what a route returns,
 * besides declaring what is returned, it also validates the output
 * of the response.
 *
 * @param status The status of the response
 * @param schema The schema of the response
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#returns | Documentation}
 */
export function Returns(status: HttpCodes, schema?: SafeZodType) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!status || status < 100 || status > 599)
            throw new Error('You did not provide a valid request status');

        new ControllerManager(target.constructor).update(key, {
            options: {
                response: {
                    [status]: {
                        get zod() {
                            return schema;
                        },

                        get json() {
                            try {
                                if (!schema)
                                    return {
                                        description: 'No Response',
                                        type: 'null',
                                    };

                                return createSchema(schema as any, { io: 'output' }).schema;
                            } catch (error: any) {
                                throw new Error(
                                    `The output of the route ${target.constructor.name}.${String(key)} ` +
                                        `does not have a valid Zod schema, please check if the schema is correct`,
                                    { cause: error },
                                );
                            }
                        },
                    },
                },
            },
        });

        return descriptor;
    };
}

type StringAsNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
type CodeClasses = 1 | 2 | 3 | 4 | 5;
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type HttpCodes = StringAsNumber<`${CodeClasses}${Digit}${Digit}`>;
