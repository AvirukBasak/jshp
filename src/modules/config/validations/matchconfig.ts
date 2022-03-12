'use strict';

import { isObject } from '../validateconfig';

export const matchConfig = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('matchConfig can\'t be nullish');
    else if (!isObject(prop))
        errMessages.push('matchConfig should be an object');
    else if (Object.keys(prop).length < 2)
        errMessages.push('matchConfig should contain 2 properties');
    else
        for (const key in prop) {
            if (!key)
                errMessages.push(`matchConfig can't have empty properties`);
            else if (key !== 'matchFromStart' && key !== 'matchTillEnd')
                errMessages.push(`matchConfig can't have property '${key}'`);
            else if (prop[key] == undefined)
                errMessages.push(`matchConfig -> '${key}' can't be undefined`);
            else if (typeof prop[key] !== 'boolean')
                errMessages.push(`matchConfig -> '${key}' should be a boolean`);
        }
}
