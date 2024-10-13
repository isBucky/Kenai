import { getMetadata, Symbols } from '@utils/index';

// Types
import type { ControllerMetadata, Controllers } from '@builders/method/decorator';

export default class ControllerManager {
    constructor(public target: Function) {}

    public get controllers() {
        return getMetadata<Controllers>('controllers', this.target) ?? new Map();
    }

    /**
     * Use to pull controllers
     *
     * @param name Controller name
     */
    public get(name: PropertyKey) {
        return this.controllers.get(name);
    }

    /**
     * Use this function to create new controllers
     *
     * @param name Controller name
     * @param values Controller configuration data
     */
    public create(name: PropertyKey, values: ControllerMetadata) {
        if (this.controllers.has(name)) return this.update(name, values);

        return this.save(this.controllers.set(name, values));
    }

    /**
     * Use this function to update/add values ​​to an existing controller
     *
     * @param name Controller name
     * @param newValues New values ​​for insertion
     */
    public update(name: PropertyKey, newValues: Partial<ControllerMetadata>) {
        const controller = this.controllers.get(name);
        if (!controller) return this.create(name, newValues as any);

        /**
         * Saving the values ​​in this way ensures that a value can be
         * changed/added, without losing other predefined values
         */
        return this.save(
            this.controllers.set(name, {
                ...controller,
                ...newValues,

                middlewares: Array.prototype.concat(
                    controller.middlewares || [],
                    newValues.middlewares || [],
                ),

                options: {
                    ...controller.options,
                    ...newValues.options,

                    response: {
                        ...controller.options?.response,
                        ...newValues.options?.response,
                    },

                    cache: {
                        ...controller.options?.cache,
                        ...newValues.options?.cache,
                    },
                },
            } as ControllerMetadata),
        );
    }

    /**
     * Use to save controller data in the target class
     */
    private save(controllers: Controllers) {
        return Reflect.defineMetadata(Symbols['controllers'], controllers, this.target);
    }
}
