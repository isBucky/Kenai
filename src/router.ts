import { resolvePath } from './functions';
import { Symbols } from './config/utils';

// Types
import type { Controller, RouteStructure, Validation } from './functions/';
import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Use this decorator to create a route manager
 *
 * @param url Path to create the route
 * @param options Route settings options
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#router | Documentation}
 */
function Router(pathRouter?: string | RouterOptions, optionsRoute?: RouterOptions) {
    let url = pathRouter;
    let options = optionsRoute;

    if (typeof pathRouter !== 'string') {
        options = url as RouterOptions;
        url = '/';
    } else if (!pathRouter.length) pathRouter = '/';

    return function <Target extends { new (...args: any[]): {} }>(target: Target) {
        const controllersInRouter: Controller = Reflect.getMetadata(Symbols['controller'], target);
        const routes: Map<string, RouteStructure> = new Map();

        /**
         * Use this function to resolve routes
         *
         * @param routesUnresolved Unresolved routes
         */
        function setRoutes(routesUnresolved: RouteStructure[]) {
            for (const route of routesUnresolved) {
                const routeUrl = resolvePath(url + '/' + route.url);
                const validations = Array.prototype
                    .concat(options?.validations, route.validations)
                    .filter(Boolean);

                routes.set(route.method + ' ' + routeUrl, {
                    ...route,

                    url: routeUrl,
                    validations: validations.length ? validations : undefined,
                } as RouteStructure);
            }
        }

        // Checking if there are defined controllers
        if (options?.controllers?.length) {
            for (const controller of options.controllers) {
                const controllerData: Controller = Reflect.getMetadata(
                    Symbols['controller'],
                    controller,
                );

                if (controllerData && Object.keys(controllerData).length)
                    setRoutes(Object.values(controllerData));
            }
        }

        // Checking if there are controllers in the Router class
        if (controllersInRouter && Object.keys(controllersInRouter).length)
            setRoutes(Object.values(controllersInRouter));

        // Pulling routes from route managers
        if (options?.routes?.length) {
            for (const routerClass of options.routes) {
                const router: RouterStructure = Reflect.getMetadata(Symbols['router'], routerClass);

                if (router && router.routes.size) setRoutes([...router.routes.values()]);
            }
        }

        Reflect.defineMetadata(
            Symbols['router'],
            {
                routes,
            } satisfies RouterStructure,
            target,
        );
    };
}

/**
 * Use this function to pull data contained in the class
 *
 * @param target Router Class
 */
Router.getData = function GetData(
    target: new (...args: any[]) => any,
): RouterStructure | undefined {
    return Reflect.getMetadata(Symbols['router'], target);
};

export { Router };

export interface RouterStructure {
    routes: Map<string, RouteStructure>;
}

export interface RouterOptions {
    /**
     * Controllers responsible for this route
     */
    controllers?: (new (...args: any[]) => unknown)[];

    /**
     * All routes defined in this router will have automatically defined validations
     */
    validations?: Validation[];

    /**
     * Use to make a list of other routes with the current
     */
    routes?: (new (...args: any[]) => unknown)[];
}

export type RouteHandler = (
    request: FastifyRequest,
    reply: FastifyReply,
) => Promise<unknown> | unknown;
