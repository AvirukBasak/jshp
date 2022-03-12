'use strict';

export const timeoutSec = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('timeoutSec can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`timeoutSec should be number`);
}
