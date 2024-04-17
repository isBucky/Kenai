import { createMethodDecorator, type MethodDecoratorParams } from '../functions/';

/**
 * Use esse decorator para criar uma rota do tipo Post
 *
 * @param path Caminho da rota
 * @param options Opções de configuração da rota
 */
export const Post = (...args: MethodDecoratorParams) => createMethodDecorator('POST', ...args);
