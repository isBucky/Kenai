import { Symbols } from './config/utils';

// Types
import type { Controller } from './functions/';

/**
 * Usa essa função para definir dados extras que você quer levar junto as rotas
 *
 * @param data Dados para ser salvo
 */
export function Metadata(data: any) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controller: Controller = Reflect.getMetadata(
            Symbols['controller'],
            target.constructor,
        );

        if (!controller || !controller[key]) return descriptor;

        // Salvando os dados no controller
        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [key]: {
                    ...controller[key],
                    metadata: data,
                },
            } as Controller,
            target.constructor,
        );

        return descriptor;
    };
}
