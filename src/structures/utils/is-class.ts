/**
 * Checks if the given value is a class (i.e. a function with a prototype).
 *
 * @param route The value to check
 * @returns True if the value is a class, false otherwise
 */
export function isClass(route: new (...args: any[]) => any) {
    return typeof route === 'function' && typeof route.prototype !== 'undefined';
}
