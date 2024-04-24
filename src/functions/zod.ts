import { z as zod } from 'zod';

/**
 * Use this function to validate zod schemas,
 * with messages formatted for easy understanding
 *
 * @param schema Zod schema to be checked
 * @param data Value to be checked by the zod schema
 */
export default function parse<T extends zod.ZodTypeAny>(
    schema: T,
    data: unknown,
    callback?: CallbackFunction<T>,
): T['_output'] {
    const schemaParsed = schema.safeParse(data);
    if (schemaParsed.success) {
        if (callback) return callback(null, schemaParsed.data);
        return schemaParsed.data;
    }

    const error = schemaParsed.error;
    error['isReplySchemaError'] = true;

    if (callback) return callback(error, null);
    throw error;
}

type CallbackFunction<T extends zod.ZodTypeAny> = (error: Error | null, data: T['_output']) => void;
