import { resolvePath } from './resolve-path';
import { Symbols } from '../config/utils';

// Types
import type { Controller } from './create-method-decorator.ts';

/**
 * Use this function to create new decorators for parameters
 * 
 * @param path Path to obtain request data
 * @param key Value you want to get
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#create-decorators-for-parameters | Documentation}
 */
export function createParamDecorator(path: string, key?: string) {
    return function (target: object, methodName: string, parameterIndex: number) {
        const controller = Reflect.getMetadata(Symbols['controller'], target.constructor) || {};
        const params = controller[methodName]?.options?.functionParams || [];

        params.unshift(resolvePath(path + (key ? `/${key}` : '')));

        Reflect.defineMetadata(
            Symbols['controller'],
            {
                ...controller,

                [methodName]: {
                    ...controller[methodName],

                    options: {
                        ...controller[methodName]?.options,

                        functionParams: params,
                    },
                },
            } satisfies Controller,
            target.constructor,
        );
    };
}
