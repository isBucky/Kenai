import { createParamDecorator } from '../../functions/';

/**
 * Use essa função para obter o objeto params do fastify
 *
 * @param key Nome do parâmetro que você deseja obter
 */
export const Params = (key?: string) => createParamDecorator('request/params', key);
