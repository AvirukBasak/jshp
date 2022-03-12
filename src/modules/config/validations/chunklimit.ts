'use strict';

export const chunkLimit = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('chunkLimit can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`chunkLimit should be number`);
}
