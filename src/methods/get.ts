import { createMethodDecorator, type MethodDecoratorParams } from '../functions/';

/**
 * Use esse decorator para criar uma rota do tipo Get
 *
 * @param path Caminho da rota
 * @param options Opções de configuração da rota
 */
export const Get = (...args: MethodDecoratorParams) => createMethodDecorator('GET', ...args);
