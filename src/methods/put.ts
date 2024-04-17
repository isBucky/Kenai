import { createMethodDecorator, type MethodDecoratorParams } from '../functions/';

/**
 * Use esse decorator para criar uma rota do tipo Put
 *
 * @param path Caminho da rota
 * @param options Opções de configuração da rota
 */
export const Put = (...args: MethodDecoratorParams) => createMethodDecorator('PUT', ...args);
