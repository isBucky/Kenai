import { Status, Symbols } from '../config/utils';
import { CacheHandler } from '../cache/functions/handler';
import zod from './zod';

import ObjectManager from 'object.mn';

// Types
import type { RouteStructure, RouteOptions } from './create-method-decorator';
import type { RouteHandler } from '../router';

/**
 * Use this function to manage method returns
 *
 * @param target Decorator target
 * @param descriptor Target descriptor
 */
export async function HandlerMethod(
    originalFunction: (...args: any[]) => unknown,
    restFunctionArgs: RestFunctionArgs,
    target: object,
    key: PropertyKey,
) {
    const [request, reply] = restFunctionArgs;
    const handler: RouteStructure = Reflect.getMetadata(Symbols['controller'], target.constructor)[
        key
    ];
    const handlerOptions = handler.options;

    if (!handler || !handlerOptions || !Object.keys(handlerOptions).length)
        return await originalFunction(...restFunctionArgs);
    if (request.socket.closed) return;

    // Checking if this route has a cache in redis, if so, it will return the value
    let cacheData: any | void;
    if (handlerOptions.cache && !handlerOptions.cache.deleteCache) {
        cacheData = await CacheHandler.get(request, handlerOptions.cache);

        if (cacheData)
            return Send(request, reply, {
                reply: handlerOptions.reply,
                data: cacheData,
            });
    }

    const returnedFunctionValue = await originalFunction(
        ...resolveParams(restFunctionArgs, handlerOptions.functionParams),
    );

    // If the route is defined as a delete route, it will check if that route exists in the cache
    if (handlerOptions.cache?.deleteCache) CacheHandler.delete(request, handlerOptions.cache);
    if (request.socket.closed) return;

    // Saving the value returned by the route in the cache
    if (handlerOptions.cache && !cacheData && !handlerOptions.cache.deleteCache)
        CacheHandler.set(request, handlerOptions.cache, returnedFunctionValue);

    return Send(request, reply, {
        reply: handlerOptions.reply,
        data: returnedFunctionValue,
    });
}

/**
 * Use this function to resolve the function parameters
 *
 * @param restFunctionArgs Function parameters
 * @param params Function parameters
 */
function resolveParams(restFunctionArgs: RestFunctionArgs, params?: string[]) {
    if (!params || !params.length) return restFunctionArgs;

    const [request, reply] = restFunctionArgs;
    const data = new ObjectManager({ request, reply });

    return params.map((param) => data.get(param) || undefined);
}

/**
 * Use this function to respond to the request
 *
 * @param reply Request response object
 */
export function Send(
    request: Parameters<RouteHandler>[0],
    reply: Parameters<RouteHandler>[1],
    { reply: replyOptions, data }: SendOptions,
) {
    if (request.socket.closed) return;

    // eslint-disable-next-line prefer-const
    let { status, replySchema } = replyOptions || {};
    if (status === Status.No_Content) data = undefined;
    if (!data && !status) status = 204;

    const finish = (responseData = data) => reply.code(status || 200).send(responseData);
    if (replySchema?.schema) {
        if (status === Status.No_Content) return finish();
        else
            return zod(replySchema?.schema, data, (error, dataParsed) => {
                if (error) throw error;
                return finish(replySchema?.omitUnknownKeys ? dataParsed : undefined);
            });
    } else return finish();
}

export interface SendOptions {
    reply: RouteOptions['reply'];
    data?: any;
}

export type RestFunctionArgs = [
    request: Parameters<RouteHandler>[0],
    reply: Parameters<RouteHandler>[1],
    ...args: any[],
];
