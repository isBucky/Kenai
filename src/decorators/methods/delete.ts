import { createMethodDecorator } from '@builders/method/decorator';

/**
 * Use this decorator to create a Delete route
 *
 * @param path Route path
 * @param options Route configuration options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#methods | Documentation}
 */
export const Delete = (path?: string) => createMethodDecorator('DELETE', path);
