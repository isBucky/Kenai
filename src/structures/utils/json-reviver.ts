/**
 * Reviver function for JSON.parse() that converts strings in ISO 8601
 * format to Date objects.
 *
 * @param key - The key of the property being processed.
 * @param value - The value of the property being processed.
 *
 * @returns The value of the property being processed, which could be a Date
 * object if the value is a string in ISO 8601 format.
 */
export function jsonReviver(key: string, value: any) {
    const regexDate = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    if (typeof value == 'string' && regexDate.test(value)) {
        return new Date(value);
    }

    return value;
}
