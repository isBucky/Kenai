import ControllerManager from '@managers/controller.manager';
import { resolvePath } from '@utils/resolve-path';

/**
 * Use this function to create new decorators for parameters
 *
 * @param path Path to obtain request data
 * @param key Value you want to get
 *
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#create-decorators-for-parameters | Documentation}
 */
export function createParamsDecorator(path: string, key?: string) {
    return function (target: object, methodName: string, parameterIndex: number) {
        const controllerManager = new ControllerManager(target.constructor);
        const controller = controllerManager.get(methodName);
        const customHandlerParams = controller?.customHandlerParams || [];

        customHandlerParams.unshift(resolvePath(path + (key ? `/${key}` : '')));
        controllerManager.update(methodName, { customHandlerParams });
    };
}
