import { createParamDecorator } from '../functions';

/**
 * Use essa função para obter o objeto reply do fastify
 */
export const Reply = (key?: string) => createParamDecorator('reply', key);
