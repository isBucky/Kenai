import { createMethodDecorator, type MethodDecoratorParams } from '../functions/';

/**
 * Use esse decorator para criar uma rota do tipo Delete
 *
 * @param path Caminho da rota
 * @param options Opções de configuração da rota
 */
export const Delete = (...args: MethodDecoratorParams) => createMethodDecorator('DELETE', ...args);
