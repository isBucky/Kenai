import { createParamDecorator } from '../../functions/';

/**
 * Use essa função para obter o objeto request do fastify
 *
 * @param key Nome do parâmetro que você deseja obter
 */
export const Request = (key?: string) => createParamDecorator('request', key);
