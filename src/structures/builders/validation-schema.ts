/* eslint-disable security/detect-object-injection */
import { KenaiGlobal } from '@managers/kenai-global';

// Types
import type { FastifyValidation } from '@decorators/middlewares';
import type { z } from 'zod';

/**
 * Use this function to create validations with Zod Schema
 *
 * @param param0 Validation configuration options
 */
export function createValidationSchema({
    schema,
    from,
    ...options
}: CreateValidationSchemaOptions): FastifyValidation {
    if (!(from in ValidationFrom))
        throw new Error(`This ${from} option does not exist to apply schema validation`);

    return (request, reply, done) => {
        if (!(from in request))
            throw new Error(`The ${from} option does not exist in the request data`);

        const customZodParser = KenaiGlobal.get<CustomZodParser>('custom-zod-parser');
        try {
            if (customZodParser) customZodParser(schema, request[from]);
            else {
                const data = schema.parse(request[from]);
                if (from !== 'params' && !options?.omitUnknownKeys) request[from] = data;
            }

            return done();
        } catch (error: any) {
            return done(error);
        }
    };
}

export type CustomZodParser = <T extends z.ZodTypeAny>(schema: T, data: unknown) => T['_output'];

export interface CreateValidationSchemaOptions {
    /**
     * Zod Validation Schema
     */
    schema: z.ZodTypeAny;

    /**
     * Define where this Schema will be acted
     */
    from: keyof typeof ValidationFrom;

    /**
     * Responsible for omitting the properties not presented in the
     * Schema, to return yet define as false
     *
     * @default true
     */
    omitUnknownKeys?: boolean;
}

export enum ValidationFrom {
    'body',
    'params',
    'query',
}
