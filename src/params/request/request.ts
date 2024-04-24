import { createParamDecorator } from '../../functions/';

/**
 * Use this function to get the fastify request object
 *
 * @param key Name of the parameter you want to get
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#params | Documentation}
 */
export const Request = (key?: string) => createParamDecorator('request', key);
