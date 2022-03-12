'use strict';

import { isArray } from '../validateconfig';

export const noExtension = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('noExtension can\'t be nullish');
    else if (!isArray(prop))
        errMessages.push('noExtension should be an array');
    else
        for (const element of prop) {
            if (typeof element !== 'string')
                errMessages.push(`noExtension can contain only strings`);
            else if (element[0] !== '.')
                errMessages.push(`noExtension -> '${element}' should be '.${element}'`);
        }
}
