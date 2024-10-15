import { createMethodDecorator, MethodDecoratorParams } from '@builders/method/decorator';

/**
 * Use this decorator to create a Get route
 *
 * @param path Route path
 * @param fastifyRouteOptions Fastify route options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#get | Documentation}
 */
export const Get = (...args: MethodDecoratorParams) => createMethodDecorator('GET', ...args);
