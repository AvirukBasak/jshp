'use strict';

import { isObject } from '../validateconfig';

export const defaultHeaders = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('defaultHeaders can\'t be nullish');
    else if (!isObject(prop))
        errMessages.push('defaultHeaders should be an object');
    else
        for (const key in prop) {
            if (!key)
                errMessages.push(`defaultHeaders can't have empty property names`);
            else if (prop[key] == undefined)
                errMessages.push(`defaultHeaders -> '${key}' can't be undefined`);
            else if (typeof prop[key] !== 'string')
                errMessages.push(`defaultHeaders -> '${key}' should be a string`);
        }
}
