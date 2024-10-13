/* eslint-disable security/detect-object-injection */

/**
 * Use this function to obtain values ​from a constructor
 *
 * @param symbol Symbol
 * @param target Target
 */
export function getMetadata<T>(symbol: keyof typeof Symbols, target: Function) {
    return Reflect.getMetadata(Symbols[symbol], target) as T;
}

export const Symbols = {
    router: Symbol('Kenai-Routers'),
    controllers: Symbol('Kenai-Controllers'),
    global: Symbol('Kenai'),
};

export function getObjectValue(path: string, data: object): any | undefined {
    return path
        .split('/')
        .filter(Boolean)
        .reduce((acc, key) => acc?.[key], data);
}

export enum MethodsEnum {
    'GET' = 'GET',
    'POST' = 'POST',
    'PATCH' = 'PATCH',
    'DELETE' = 'DELETE',
    'PUT' = 'PUT',
}

export type Methods = keyof typeof MethodsEnum | Lowercase<keyof typeof MethodsEnum>;
