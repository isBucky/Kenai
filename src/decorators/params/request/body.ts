import { createParamsDecorator } from '@builders/params';

/**
 * Use this function to get the fastify body object
 *
 * @param key Name of the parameter you want to get
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#body | Documentation}
 */
export const Body = (key?: string) => createParamsDecorator('request/body', key);
