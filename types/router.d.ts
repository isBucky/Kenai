import { ControllerMetadata } from './controllers';
import { FastifyValidation } from 'types';

export interface RouterOptions {
    /**
     * Controllers responsible for this route
     */
    controllers?: (new (...args: any[]) => unknown)[];

    /**
     * All routes defined in this router will have automatically defined middlewares
     */
    middlewares?: FastifyValidation[];

    /**
     * Use to make a list of other routes with the current
     */
    routers?: (new (...args: any[]) => unknown)[];
}

export type RouterStructure = Map<string, ControllerMetadata>;
