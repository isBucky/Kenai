import { createParamDecorator } from '../functions';

/**
 * Use this function to get the fastify reply object
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#params | Documentation}
 */
export const Reply = (key?: string) => createParamDecorator('reply', key);
