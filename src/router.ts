import { resolvePath } from './functions';
import { Symbols } from './config/utils';

// Types
import type { Controller, RouteStructure, Validation } from './functions/';
import type { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Use esse decorator para criar um gerenciador de rotas
 *
 * @param url Caminho para criar a rota
 * @param options Opções de configurações da rota
 */
function Router(url: string = '/', options?: RouterOptions) {
    if (!url.length) url = '/';

    return function <Target extends { new (...args: any[]): {} }>(target: Target) {
        const controllersInRouter: Controller = Reflect.getMetadata(Symbols['controller'], target);
        const routes: Map<string, RouteStructure> = new Map();

        /**
         * Use essa função para resolver as rotas
         *
         * @param routesUnresolved Rotas não resolvidas
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

        // Verificando se existe controllers definidos
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

        // Verificando se existe controllers na classe do Router
        if (controllersInRouter && Object.keys(controllersInRouter).length)
            setRoutes(Object.values(controllersInRouter));

        // Puxando as rotas dos gerenciadores de rotas
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
 * Use essa função para puxar os dados contidos na classe
 *
 * @param target Classe Router
 */
Router.getData = function GetData(target: object): RouterStructure | undefined {
    return Reflect.getMetadata(Symbols['router'], target);
};

export { Router };

export interface RouterStructure {
    routes: Map<string, RouteStructure>;
}

export interface RouterOptions {
    /**
     * Controladores responsáveis por essa rota
     */
    controllers?: (new (...args: any[]) => unknown)[];

    /**
     * Todas as rotas definidas neste Router terá validações definidas automaticamente
     */
    validations?: Validation[];

    /**
     * Outros controladores de rotas
     */
    routes?: (new (...args: any[]) => unknown)[];
}

export type RouteHandler = (
    request: FastifyRequest,
    reply: FastifyReply,
) => Promise<unknown> | unknown;
