'use strict';

export const indexFile = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('indexFile can\'t be empty or undefined');
    else if (typeof prop !== 'string')
        errMessages.push(`indexFile should be string`);
}
