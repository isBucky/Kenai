/**
 * Removes all properties from an object which have an undefined value.
 *
 * @example
 * const input = { a: 1, b: undefined, c: 3 };
 * const output = removeUndefinedProperties(input);
 * // output is { a: 1, c: 3 }
 *
 * @param data The object to remove undefined properties from
 * @returns The object with all undefined properties removed
 */
export function removeUndefinedProperties<T extends object>(data: T): T {
    return Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined),
    ) as T;
}
