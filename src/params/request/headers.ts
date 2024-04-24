import { createParamDecorator } from '../../functions/';

/**
 * Use this function to get the request header
 *
 * @param key Name of the parameter you want to get
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#params | Documentation}
 */
export const Headers = (key?: string) => createParamDecorator('request/headers', key);
