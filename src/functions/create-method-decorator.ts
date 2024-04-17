import { HandlerMethod, type RestFunctionArgs } from './handler-method';
import {
    type Methods,
    MethodsEnum,
    Symbols,
    Status,
    ReplySchema,
    RequestSchema,
} from '../config/utils';

import { resolvePath } from './resolve-path';
import trycatch from 'try-catch';

// Types
import type { HookHandlerDoneFunction } from 'fastify';
import type { DocsDecoratorOptions } from '../docs';
import type { RouteHandler } from '../router';
import type { CacheOptions } from '../cache';

/**
 * Use essa função para criar um decorator para os métodos de requisição
 *
 * @param method Método que vai ser criado
 * @param url Caminho da rota
 * @param options Opções de configuração da rota
 */
export function createMethodDecorator(
    method: Methods,
    url: string = '/',
    options?: MethodDecoratorOptions,
) {
    if (!MethodsEnum[method.toUpperCase()])
        throw new Error('This request method does not exist. ' + method);
    if (!url.length) url = '/';

    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const originalFunction = descriptor.value;

        descriptor.value = async function Handler(...args: RestFunctionArgs) {
            if (!args[0]) throw new Error('The first parameter must be the object of the request');
            if (!args[1]) throw new Error('The second argument must be reply');

            const [RequestInvalid, ReplyInvalid] = [
                trycatch(RequestSchema.parse, args[0])[0],
                trycatch(ReplySchema.parse, args[1])[0],
            ];

            if (RequestInvalid)
                throw new Error('The first parameter is not a valid request object');
            if (ReplyInvalid)
                throw new Error('The second parameter of the request response is not valid');

            return await HandlerMethod(
                (...args: any[]) => originalFunction.call(this, ...args),
                args,
                target,
                key,
            );
        };

        const controller = Reflect.getMetadata(Symbols['controller'], target.constructor);

        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [key as string]: {
                    ...controller?.[key],

                    url: resolvePath(url),
                    method: method.toUpperCase() as Methods,
                    handler: descriptor.value,
                    controller: target.constructor,

                    options: {
                        ...controller?.[key]?.options,

                        reply: {
                            status:
                                typeof options?.status === 'string'
                                    ? Status[options.status]
                                    : options?.status,

                            replySchema: options?.replySchema,
                        },
                    },

                    validations: options?.validations,
                } as RouteStructure,
            } satisfies Controller,
            target.constructor,
        );

        return descriptor;
    };
}

export type MethodDecoratorParams = [path?: string, options?: MethodDecoratorOptions];

export interface MethodDecoratorOptions {
    /**
     * Use para definir o status da resposta da requisição
     *
     * @default 200 = OK
     */
    status?: number | keyof typeof Status;

    /**
     * Use para definir o esquema de validação da resposta da requisição
     */
    replySchema?: {
        /**
         * Esquema para validar a resposta
         */
        schema: any;

        /**
         * Se você deseja que ele não remova as chaves estranhas do objeto, define como false
         *
         * @default false
         */
        omitUnknownKeys?: boolean;
    };

    /**
     * Use para definir as validações da rota
     */
    validations?: Validation[];
}

export type Validation = (
    request: any,
    reply: any,
    done: HookHandlerDoneFunction,
) => Promise<unknown> | unknown;

export interface RouteStructure {
    /**
     * Caminho que a rota é responsável
     */
    url: string;

    /**
     * Método da requisição da rota
     */
    method: Methods;

    /**
     * Função repensável por responder a requisição
     */
    handler: RouteHandler;

    controller: any;

    /**
     * Aqui vai ficar todas as opções de definição da rota, como qual status de resposta, cache, etc.
     */
    options?: RouteOptions;

    /**
     * Aqui vai ficar as informações que a pessoa quiser salvar na rota, algo que seja relevante
     */
    metadata: any;

    /**
     * Validações para a rota antes que ela seja respondida pela função principal
     */
    validations?: Validation[];
}

export interface RouteOptions {
    /**
     * Docs da rota
     */
    docs?: DocsDecoratorOptions;

    /**
     * Parâmetros da função principal
     */
    functionParams?: string[];

    /**
     * Opções de resposta da requisição
     */
    reply?: {
        /**
         * Status da requisição que a rota vai retornar
         *
         * @default 200
         */
        status?: number;

        /**
         * Esquema de validação da resposta da requisição
         */
        replySchema?: MethodDecoratorOptions['replySchema'];
    };

    /**
     * Se definido a rota possui uma cache aonde o retorno da requisição sera salvo
     */
    cache?: CacheOptions & { deleteCache?: boolean; };
}

export type Controller = {
    [k: PropertyKey]: RouteStructure;
};
