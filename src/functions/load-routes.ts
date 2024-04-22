import { Router, type RouterStructure } from '../router';
import { Symbols } from '../config/utils';

import NodePath from 'node:path';

// Types
import type { FastifyInstance, RouteOptions } from 'fastify';

/**
 * Use essa função para carregar as rotas automaticamente
 *
 * @param options Opções de configuração
 */
export async function LoadRoutes(options: LoadRoutesOptions) {
    if (!options.mainRoute) throw new Error('You did not define a main route.');

    if (!isClass(options.mainRoute) || !Reflect.hasMetadata(Symbols['router'], options.mainRoute))
        throw new Error('The informed main route does not have a signature of our decorators.');

    return await makeRoutes(
        options.app,
        Router.getData(options.mainRoute),
        options.controllerParameters,
    );
}

async function makeRoutes(
    app: FastifyInstance,
    data?: RouterStructure,
    controllerParameters?: any[],
) {
    if (!data)
        throw new Error(
            "The informed main route is invalidated, make sure it used the 'router ' function correctly",
        );

    const { routes } = data;
    if (!routes.size) return null;

    for (const [, route] of routes.entries()) {
        app.route({
            url: route.url,
            method: route.method,

            preValidation: route.validations,
            handler: (<RouteOptions['handler']>route.handler).bind(
                new route.controller(...(controllerParameters || [])),
            ),
        });
    }

    return routes;
}

function isClass(route: LoadRoutesOptions['mainRoute']) {
    return typeof route === 'function' && typeof route.prototype !== 'undefined';
}

export interface LoadRoutesOptions {
    /**
     * Fastify application instance
     */
    app: FastifyInstance;

    /**
     * Main route of your application
     */
    mainRoute?: new (...args: any[]) => any;

    /**
     * This option is used to define the parameters of all routes
     */
    controllerParameters?: any[];
}
