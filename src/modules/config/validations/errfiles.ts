'use strict';

import { isObject } from '../validateconfig';

export const errFiles = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('errFiles can\'t be nullish');
    else if (!isObject(prop))
        errMessages.push('errFiles should be an object');
    else
        for (const key in prop) {
            if (!key)
                errMessages.push(`errFiles can't have empty properties`);
            else if (!prop[key])
                errMessages.push(`errFiles -> '${key}' can't be empty or undefined`);
            else if (typeof prop[key] !== 'string')
                errMessages.push(`errFiles -> '${key}' should be a string`);
        }
}
