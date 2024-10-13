import ControllerManager from '@managers/controller.manager';

// Types
import type { z } from 'zod';

export function Return(status: HttpCodes, schema: z.ZodTypeAny) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        if (!status || status < 100 || status > 599)
            throw new Error('You did not provide a valid request status');

        new ControllerManager(target.constructor).update(key, {
            options: {
                response: {
                    [status]: schema,
                },
            },
        });

        return descriptor;
    };
}

export interface ResponseOptions {
    description?: string;
    status: HttpCodes;
    contentType: keyof typeof ContentType;
    schema: z.ZodTypeAny;
}

type StringAsNumber<T extends string> = T extends `${infer N extends number}` ? N : never;
type CodeClasses = 1 | 2 | 3 | 4 | 5;
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type HttpCodes = StringAsNumber<`${CodeClasses}${Digit}${Digit}`>;

export enum ContentType {
    'application/json',
    'text/plain',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'application/octet-stream',
}
