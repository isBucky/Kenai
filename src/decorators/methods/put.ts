import { createMethodDecorator } from '@builders/method/decorator';

/**
 * Use this decorator to create a Put route
 *
 * @param path Route path
 * @param options Route configuration options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#methods | Documentation}
 */
export const Put = (path?: string) => createMethodDecorator('PUT', path);
