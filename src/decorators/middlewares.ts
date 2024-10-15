import ControllerManager from '@managers/controller.manager';
import { Symbols } from '@utils/index';

// Types
import type { preValidationMetaHookHandler } from 'fastify/types/hooks';
import type { CustomZodParser } from '@builders/validation-schema';
import type { RouteHandler } from 'fastify';

/**
 * Use this decorator to add middleware to your route
 *
 * @param Middlewares Middlewares for the route
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#middlewares | Documentation}
 */
export function Middlewares(...middlewares: FastifyValidation[]) {
    return function (target: object, key: PropertyKey, descriptor: PropertyDescriptor) {
        const controllerManager = new ControllerManager(target.constructor);
        if (!middlewares.length) return descriptor;

        controllerManager.update(key, { middlewares });

        return descriptor;
    };
}

/**
 * Use this function to define a custom zod parser
 *
 * @param parser Its function of parser
 */
Middlewares.setCustomZodParser = function setCustomZodParser(parser: CustomZodParser) {
    return (global[Symbols['global']] ?? {})['custom-zod-parser'] = parser;
};

export type FastifyHandler = RouteHandler;
export type FastifyValidation = preValidationMetaHookHandler;
