import { createParamsDecorator } from '@builders/params';

/**
 * Use this function to get the fastify query object
 *
 * @param key Name of the parameter you want to get
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#query | Documentation}
 */
export const Query = (key?: string) => createParamsDecorator('request/query', key);
