import { createParamsDecorator } from '@builders/params';

/**
 * Use this function to get the fastify request object
 *
 * @param key Name of the parameter you want to get
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#request | Documentation}
 */
export const Request = (key?: string) => createParamsDecorator('request', key);
