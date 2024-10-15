import { createMethodDecorator, MethodDecoratorParams } from '@builders/method/decorator';

/**
 * Use this decorator to create a Patch route
 *
 * @param path Route path
 * @param fastifyRouteOptions Fastify route options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#patch | Documentation}
 */
export const Patch = (...args: MethodDecoratorParams) => createMethodDecorator('PATCH', ...args);
