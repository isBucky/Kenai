import { createParamDecorator } from '../../functions/';

/**
 * Use essa função para obter o objeto query do fastify
 *
 * @param key Nome do parâmetro que você deseja obter
 */
export const Query = (key?: string) => createParamDecorator('request/query', key);
