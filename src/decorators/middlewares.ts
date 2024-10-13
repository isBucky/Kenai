import {
    createValidationSchema,
    type CustomZodParser,
    type CreateValidationSchemaOptions,
} from '@builders/validation-schema';
import ControllerManager from '@managers/controller.manager';
import { KenaiGlobal } from '@managers/kenai-global';

// Types
import type { FastifyValidation } from 'types';

/**
 * Use this decorator to add middleware to your route
 *
 * @param Middlewares Middlewares for the route
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
    return KenaiGlobal.set('custom-zod-parser', parser);
};