import { Symbols } from './config/utils';

// Types
import type { Controller } from './functions/';

/**
  * Use this function to define extra data that you want to take along the routes
  *
  * @param data Data to be saved
  * 
  * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#metadata | Documentation}
  */
export function Metadata(data: any) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        const controller: Controller = Reflect.getMetadata(
            Symbols['controller'],
            target.constructor,
        );

        if (!controller || !controller[key]) return descriptor;

        // Saving data in the controller
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
