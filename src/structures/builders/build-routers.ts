import { removeUndefinedProperties } from '@utils/remove-undefined-props';
import { makeResponse } from '@utils/make-response';
import { HandlerMethod } from './method/handler';
import { Router } from '@decorators/router';

// Types
import type { FastifyInstance, FastifySchema, RouteOptions } from 'fastify';
import type { PluginOptions } from './plugin';

/**
 * Builds all routes defined by the user in the main route.
 *
 * @param options - Options to build the routes.
 * @param options.fastify - Fastify instance.
 * @param options.unresolvedRoute - Main route class.
 * @param options.controllerParameters - Parameters to be passed to the controller constructor.
 */
export function buildRouters({ fastify, unresolvedRoute, controllerParameters }: CreateRoutersOptions) {
    // Get all routes from the main route
    const routes = Router.getData(unresolvedRoute);
    if (!routes || !routes.size) return;

    for (const route of routes.values()) {
        try {
            // Create the route with the options informed by the user
            fastify.route(
                removeUndefinedProperties({
                    ...route.options?.fastifyRouteOptions,

                    url: route.url,
                    method: route.method,

                    schema: removeUndefinedProperties({
                        ...route.options?.fastifyRouteOptions?.schema,

                        description: route.options?.description,
                        summary: route.options?.summary,
                        operationId: route.options?.operationId,
                        tags: route.options?.tags,
                        consumes: route.options?.consumes,
                        deprecated: route.options?.deprecated,
                        hide: route.options?.hide,
                        produces: route.options?.produces,
                        security: route.options?.security,

                        response: makeResponse(route),

                        body: route.options?.body?.json,
                        params: route.options?.params?.json,
                        querystring: route.options?.querystring?.json,
                    } as FastifySchema),

                    validatorCompiler: () => (data) => ({ value: data }),
                    serializerCompiler: () => (data) => JSON.stringify(data),

                    preValidation: route.middlewares,
                    onSend: HandlerMethod.onSend(route),

                    handler: route.handler.bind(
                        new route.constructorController(...(controllerParameters || [])),
                    ),
                } as RouteOptions),
            );
        } catch (error: any) {
            // If an error occurs, add the route to the error and throw it
            error.route = route;

            throw error;
        }
    }

    return;
}

/**
 * Interface of the options to create the routers.
 */
interface CreateRoutersOptions {
    /**
     * Fastify instance.
     */
    fastify: FastifyInstance;

    /**
     * Main route class.
     */
    unresolvedRoute: new (...args: any[]) => any;

    /**
     * Parameters to be passed to the controller constructor.
     */
    controllerParameters?: PluginOptions['controllerParameters'];
}
