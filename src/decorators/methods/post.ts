import { createMethodDecorator, MethodDecoratorParams } from '@builders/method/decorator';

/**
 * Use this decorator to create a Post route
 *
 * @param path Route path
 * @param fastifyRouteOptions Fastify route options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#post | Documentation}
 */
export const Post = (...args: MethodDecoratorParams) => createMethodDecorator('POST', ...args);
