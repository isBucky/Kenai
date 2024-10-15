import { createMethodDecorator, MethodDecoratorParams } from '@builders/method/decorator';

/**
 * Use this decorator to create a Delete route
 *
 * @param path Route path
 * @param fastifyRouteOptions Fastify route options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#delete | Documentation}
 */
export const Delete = (...args: MethodDecoratorParams) => createMethodDecorator('DELETE', ...args);
