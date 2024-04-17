import { Router } from '../router';

import { isFile } from 'bucky.js';

import NodePath from 'node:path';

// Types
import type { FastifyInstance, RouteOptions } from 'fastify';

/**
 * Use essa função para carregar as rotas automaticamente
 *
 * @param options Opções de configuração
 */
export function LoadRoutes(options: LoadRoutesOptions) {
    const file = NodePath.join(options.mainPath);
    if (!isFile(file)) throw new Error('The path informed for the routes are invalidated');

    const mainRoute = require(file);
    if (!mainRoute) throw new Error('The path informed for the routes are invalidated');

    const routesData = Router.getData(mainRoute.default ? mainRoute.default : mainRoute);
    if (!routesData)
        throw new Error(
            "The informed main route is invalidated, make sure it used the 'router ' function correctly",
        );

    const { routes } = routesData;
    if (!routes.size) return null;

    for (const [, route] of routes.entries()) {
        options.app.route({
            url: route.url,
            method: route.method,

            preValidation: route.validations,
            handler: (<RouteOptions['handler']>route.handler).bind(
                new route.controller(...(options.controllerParameters || [])),
            ),
        });
    }

    return routes;
}

export interface LoadRoutesOptions {
    app: FastifyInstance;
    mainPath: string;
    controllerParameters?: any[];
}
