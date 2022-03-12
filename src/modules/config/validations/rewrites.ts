'use strict';

import { isObject, isArray } from '../validateconfig';

const validateChild = function (child: NodeJS.Dict<any>, errMessages: string[]) {
    if (Object.keys(child).length < 2)
        errMessages.push('rewrites objects should contain 2 properties');
    else
        for (const key in child) {
            if (!key)
                errMessages.push(`rewrites objects can't have empty properties`);
            else if (key !== 'req' && key !== 'src')
                errMessages.push(`rewrites objects can't have property '${key}'`);
            else if (!child[key])
                errMessages.push(`rewrites object -> '${key}' can't be empty or undefined`);
            else if ([ 'req', 'src' ].includes(key) && typeof child[key] !== 'string')
                errMessages.push(`rewrites object -> '${key}' should be a string`);
            else if ([ 'req', 'src' ].includes(key) && !child[key].startsWith('/'))
                errMessages.push(`rewrites object -> '${key}' should start with '/'`);
        }
}

export const rewrites = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('rewrites can\'t be nullish');
    else if (!isArray(prop))
        errMessages.push('rewrites should be an array');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`rewrites can\'t have nullish elements`);
            else if (!isObject(element))
                errMessages.push(`rewrites can contain only objects`);
            else if (Object.keys(element).length < 1)
                errMessages.push('rewrites can\'t have empty objects');
            else
                validateChild(element, errMessages);
        }
}
