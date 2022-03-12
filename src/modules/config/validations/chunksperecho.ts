'use strict';

export const chunksPerEcho = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('chunksPerEcho can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`chunksPerEcho should be number`);
}
