import { ResolveRouterParams } from '@utils/router-params';
import { getMetadata, Symbols } from '@utils/index';
import { resolvePath } from '@utils/resolve-path';

// Types
import type { ControllerMetadata, Controllers } from '@builders/method/decorator';
import type { FastifyValidation } from './middlewares';

/**
 * Use this decorator to create a route manager
 *
 * @param url Path to create the route
 * @param options Route settings options
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#router | Documentation}
 */
export function Router(...args: RouterParams) {
    const { url, options } = ResolveRouterParams(...args);

    return function (target: RouterTarget) {
        const controllersInTarget = getMetadata<Controllers>('controllers', target) ?? new Map();
        const routes = new Map<string, ControllerMetadata>();

        // Checking if there are controllers in the Router class
        if (controllersInTarget.size) saveInRoutes(Array.from(controllersInTarget.values()));

        // Checking if there are defined controllers
        if (options?.controllers?.length) {
            for (const controllerClass of options.controllers) {
                const controllers = getMetadata<Controllers>('controllers', controllerClass);
                if (controllers.size) saveInRoutes(Array.from(controllers.values()));
            }
        }

        // Pulling routes from route managers
        if (options?.routers?.length) {
            for (const routerClass of options.routers) {
                const routers = getMetadata<RouterStructure>('router', routerClass);
                if (routers.size) saveInRoutes(Array.from(routers.values()));
            }
        }

        Reflect.defineMetadata(Symbols['router'], routes, target);

        function saveInRoutes(controllers: ControllerMetadata[]) {
            // Saving the routes in the MAP
            for (const controller of controllers) {
                const controllerUrl = resolvePath(`${url}/${controller.url}`);
                const unifiedMiddlewares = Array.prototype
                    .concat(options?.middlewares, controller.middlewares)
                    .filter(Boolean);

                routes.set(`${controller.method} ${controllerUrl}`, {
                    ...controller,

                    url: controllerUrl,
                    middlewares: unifiedMiddlewares,
                });
            }
        }

        Reflect.defineMetadata(Symbols['router'], routes, target);
    };
}

/**
 * Use this function to pull data contained in the class
 *
 * @param target Router Class
 */
Router.getData = function GetData(target: new (...args: any[]) => any) {
    return getMetadata<RouterStructure | undefined>('router', target);
};

export type RouterTarget = new (...args: any[]) => object;

export type RouterParams = [url?: string | RouterOptions, options?: RouterOptions];

export interface RouterOptions {
    /**
     * Controllers responsible for this route
     */
    controllers?: (new (...args: any[]) => unknown)[];

    /**
     * All routes defined in this router will have automatically defined middlewares
     */
    middlewares?: FastifyValidation[];

    /**
     * Use to make a list of other routes with the current
     */
    routers?: (new (...args: any[]) => unknown)[];
}

export type RouterStructure = Map<string, ControllerMetadata>;
