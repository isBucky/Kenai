import { z as zod } from 'zod';

/**
 * Use essa função para fazer a validação dos schemas do zod,
 * com mensagens formatadas de fácil entendimento
 *
 * @param schema Schema do zod para ser verificado
 * @param data Valor a ser verificado pelo schema do zod
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
