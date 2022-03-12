'use strict';

import { isArray } from '../validateconfig';

export const forbidden = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('forbidden can\'t be nullish');
    else if (!isArray(prop))
        errMessages.push('forbidden should be an array');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`forbidden can\'t have empty elements`);
            else if (typeof element !== 'string')
                errMessages.push(`forbidden can contain only strings`);
        }
}
