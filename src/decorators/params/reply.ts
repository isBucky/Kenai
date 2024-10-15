import { createParamsDecorator } from '@builders/params';

/**
 * Use this function to get the fastify reply object
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#reply | Documentation}
 */
export const Reply = (key?: string) => createParamsDecorator('reply', key);
