'use strict';

import { HTTPRequest } from '../../@types/all';
/**
 * Can encode '%' '`' '${' and '}' to %XX format
 * @param {string} str The string to be encoded
 * @return {string}
 */
export const encodeToHexChar = function(str: string): string {
    return str.replace(/`/g, '\\x60')
              .replace(/\$/g, '\\x24');
}

/**
 * The string array should contain regular expressions represented in strings.
 * @param {string[]} arr The string array of regular expressions.
 * @param {string} str The test string
 * @returns {string|undefined} The regex that made 1st match, undefined otherwise.
 */
export const regexTestStr = function(arr: string[], str: string, caret: boolean, dollar: boolean): string | undefined {
    for (const item of arr) {
        const regex: RegExp = new RegExp(
            (caret ? '^' : '') + item + (dollar ? '$' : '')
        );
        if (regex.test(str))
            return item;
    }
    return undefined;
}

/**
 * Returns current date and time.
 * @return {string}
 */
export const getLongDateTime = function() {
    const date_ob: Date = new Date();
    const date: string = ('0' + date_ob.getDate()).slice(-2);
    const month: string = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    const year: string = ('' + date_ob.getFullYear());
    const hours: string = ('0' + date_ob.getHours()).slice(-2);
    const minute: string = ('0' + date_ob.getMinutes()).slice(-2);
    const seconds: string = ('0' + date_ob.getSeconds()).slice(-2);
    return `${year}-${month}-${date}@${hours}:${minute}:${seconds}`;
};

export const getRemoteAddress = function(req: HTTPRequest): string {
    return String(req.headers['x-forwarded-for']
               || req?.connection?.remoteAddress
               || req?.socket?.remoteAddress
               || 'N/A');
}
