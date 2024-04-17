import { createMethodDecorator, type MethodDecoratorParams } from '../functions/';

/**
 * Use esse decorator para criar uma rota do tipo Patch
 *
 * @param path Caminho da rota
 * @param options Opções de configuração da rota
 */
export const Patch = (...args: MethodDecoratorParams) => createMethodDecorator('PATCH', ...args);
