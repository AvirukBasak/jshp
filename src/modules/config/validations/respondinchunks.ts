'use strict';

export const respondInChunks = function(prop: any, errMessages: string[]) {
    if (prop == undefined)
        errMessages.push('respondInChunks can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`respondInChunks should be boolean`);
}
