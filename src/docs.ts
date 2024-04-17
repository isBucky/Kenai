import { Symbols } from './config/utils';

// Types
import type { Controller } from './functions/';

/**
 * Use essa função para definir as docs dessa rota
 *
 * @param options Dados pata
 */
export function Docs(options: DocsDecoratorOptions) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const controller: Controller = Reflect.getMetadata(
            Symbols['controller'],
            target.constructor,
        );
        if (!controller || !controller[key]) return descriptor;

        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [key as string]: {
                    ...controller[key],

                    options: {
                        ...controller[key].options,

                        docs: options,
                    },
                },
            } satisfies Controller,
            target.constructor,
        );

        return descriptor;
    };
}

export interface DocsDecoratorOptions {
    path: string;
    method: string;

    description?: string;
    consumes?: string[];
    permissions?: string[];
    security?: string[];
    tag?: string;

    request?: {
        query?: object;
        body?: any;
    };

    responses?: {
        status?: number;
        produce?: string;
        content?: any;
    }[];
}
