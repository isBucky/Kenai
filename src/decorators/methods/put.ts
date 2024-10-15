import { createMethodDecorator, MethodDecoratorParams } from '@builders/method/decorator';

/**
 * Use this decorator to create a Put route
 *
 * @param path Route path
 * @param fastifyRouteOptions Fastify route options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#put | Documentation}
 */
export const Put = (...args: MethodDecoratorParams) => createMethodDecorator('PUT', ...args);
