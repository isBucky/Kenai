import { RouterParams } from '@decorators/router';

export function ResolveRouterParams(...args: RouterParams) {
    let [url, options] = args;

    if (!url || (typeof url == 'string' && !url.length)) url = '/';
    if (typeof url == 'object') {
        options = url;
        url = '/';
    }

    return { url, options };
}
