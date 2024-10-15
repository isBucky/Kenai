import type { ControllerMetadata } from '@builders/method/decorator';

/**
 * Creates a response object for a route, using the response from the route
 * options, and transforming it into a format that Fastify can understand.
 *
 * @param route The route metadata
 * @returns The response object
 */
export function makeResponse(route: ControllerMetadata) {
    if (!route?.options?.response) return;

    return Object.fromEntries(
        Object.entries(route.options!.response!).map(([status, { json }]) => [status, json]),
    );
}
