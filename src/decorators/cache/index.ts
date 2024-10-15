import ControllerManager from '@managers/controller.manager';
import { InvalidateOnUpdate } from './delete';

/**
 * Use this decorator to save the values ​​returned by the request, thus
 * reducing the time of answers
 *
 * @param ttl Time in seconds to delete cache data. Default is 300 = 5 minutes
 * 
 * @see {@link https://github.com/isBucky/Kenai?tab=readme-ov-file#cache-1 | Documentation}
 */
export function Cache(ttl?: number) {
    return function (target: object, key: string, descriptor: PropertyDescriptor) {
        new ControllerManager(target.constructor).update(key, {
            options: {
                cache: {
                    ttl: ttl ?? 5 * 60,
                    invalidateOnUpdate: false,
                },
            },
        });

        return descriptor;
    };
}

Cache.InvalidateOnUpdate = InvalidateOnUpdate;
