import { createParamDecorator } from '../../functions/';

/**
 * Use this function to get the fastify body object
 *
 * @param key Name of the parameter you want to get
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#params | Documentation}
 */
export const Body = (key?: string) => createParamDecorator('request/body', key);
