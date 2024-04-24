import { createMethodDecorator, type MethodDecoratorParams } from '../functions/';

/**
 * Use this decorator to create a Post type route
 *
 * @param path Route path
 * @param options Route configuration options
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#methods | Documentation}
 */
export const Post = (...args: MethodDecoratorParams) => createMethodDecorator('POST', ...args);
