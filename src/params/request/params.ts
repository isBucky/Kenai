import { createParamDecorator } from '../../functions/';

/**
 * Use this function to get the fastify params object
 *
 * @param key Name of the parameter you want to get
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#params | Documentation}
 */
export const Params = (key?: string) => createParamDecorator('request/params', key);
