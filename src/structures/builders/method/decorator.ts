import ControllerManager from '@managers/controller.manager';
import { resolvePath } from '@utils/resolve-path';
import { type Methods } from '@utils/index';
import { HandlerMethod } from './handler';

// Types
import type { FastifyHandler } from 'types';

/**
 * Use this function to create a decorator for the request methods
 *
 * @param method Method that will be created
 */
export function createMethodDecorator(method: Methods, url: string = '/') {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const controllerManager = new ControllerManager(target.constructor);
        const originalFunction: Function = descriptor.value;

        /**
         * Function used to create a route manipulator
         *
         * @param args Arguments
         */
        descriptor.value = async function MaoriHandler(...args: Parameters<FastifyHandler>) {
            if (!args.length || typeof args[0] !== 'object' || typeof args[1] !== 'object')
                throw new Error('Os parâmetros Request e Reply não foram definidos corretamente');

            const handlerMethod = new HandlerMethod(target.constructor, key);
            return await handlerMethod.run((...args) => originalFunction.call(this, ...args), args);
        };

        // Assigning the defined values ​​for the controller
        controllerManager.create(key as string, {
            url: resolvePath(url),
            method,
            handler: descriptor.value,
            constructorController: <any>target.constructor,
            key,
        });

        return descriptor;
    };
}
