import { createMethodDecorator } from '@builders/method/decorator';

/**
 * Use this decorator to create a route of type Patch
 *
 * @param path Route path
 * @param options Route configuration options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#methods | Documentation}
 */
export const Patch = (path?: string) => createMethodDecorator('PATCH', path);
