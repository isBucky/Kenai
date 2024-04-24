import { Symbols } from './config/utils';

// Types
import type { Controller } from './functions/';

/**
 * Use this function to define the docs for this route
 *
 * @param options Data for documentation
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#docs | Documentation}
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
