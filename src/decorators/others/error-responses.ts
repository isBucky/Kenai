import { ControllerManager } from '@managers/controller.manager';
import { createSchema } from 'zod-openapi';

import type { HttpCodes } from './returns';
import type { ZodType } from 'zod';

export function ErrorResponses(errors: ErrorResponse[]) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        for (const error of errors) {
            if (!error.status || error.status < 100 || error.status > 599)
                throw new Error('You did not provide a valid request status');

            new ControllerManager(target.constructor).update(key, {
                options: {
                    response: {
                        [error.status]: {
                            isDocumentation: true,

                            get zod() {
                                return error.schema;
                            },

                            get json() {
                                if (!error.schema)
                                    return {
                                        description: 'No Response',
                                        type: 'null',
                                    };
                                return createSchema(error.schema, { io: 'output' }).schema;
                            },
                        },
                    },
                },
            });
        }

        return descriptor;
    };
}

export interface ErrorResponse {
    status: HttpCodes;
    schema: ZodType;
}
