import { createParamDecorator } from '../../functions/';

/**
 * Use this function to get the fastify query object
 *
 * @param key Name of the parameter you want to get
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#params | Documentation}
 */
export const Query = (key?: string) => createParamDecorator('request/query', key);
