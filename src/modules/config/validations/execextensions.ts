'use strict';

import { isArray } from '../validateconfig';

export const execExtensions = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('execExtensions can\'t be nullish');
    else if (!isArray(prop))
        errMessages.push('execExtensions should be an array');
    else if (prop.length < 1)
        errMessages.push('execExtensions array can\'t be empty');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`execExtensions can\'t have empty elements`);
            else if (typeof element !== 'string')
                errMessages.push(`execExtensions can contain only strings`);
            else if (element[0] !== '.')
                errMessages.push(`execExtensions -> '${element}' should be '.${element}'`);
        }
}
