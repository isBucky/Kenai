import { createParamDecorator } from '../../functions/';

/**
 * Use essa função para obter o objeto body do fastify
 *
 * @param key Nome do parâmetro que você deseja obter
 */
export const Body = (key?: string) => createParamDecorator('request/body', key);
