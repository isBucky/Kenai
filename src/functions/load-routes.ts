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
    if ((!options.mainPath || !options.mainPath.length) && !options.mainRoute)
        throw new Error('You must define at least one of the "mainPath" or "mainRoute" options.');

    if (
        options.mainRoute &&
        (!isClass(options.mainRoute) || !Reflect.hasMetadata(Symbols['router'], options.mainRoute))
    )
        throw new Error('The informed main route does not have a signature of our decorators.');

    let mainRoute: any;

    if (options.mainRoute) mainRoute = options.mainRoute;
    else if (options.mainPath) {
        const file = NodePath.resolve(options.mainPath);

        try {
            mainRoute = require(removeTsExtension(file));
        } catch (error) {
            throw new Error('The path informed for the routes are invalidated');
        }
    }

    return await makeRoutes(
        options.app,
        Router.getData(mainRoute.default ? mainRoute.default : mainRoute),
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

function removeTsExtension(path: string) {
    return path.replace(/.ts/gi, '');
}

export interface LoadRoutesOptions {
    app: FastifyInstance;
    mainPath?: string;
    mainRoute?: new (...args: any[]) => any;
    controllerParameters?: any[];
}
