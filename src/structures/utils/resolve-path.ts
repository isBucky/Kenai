/**
 * Use this function to resolve route paths, but it can be used for other purposes.
 *
 * @param path Path you will use
 * @returns The correct way
 */
export function resolvePath(path: string) {
    return path?.length ? '/' + path?.split('/').filter(Boolean).join('/') : '/';
}
