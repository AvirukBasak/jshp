'use strict';

export const trailingSlashes = function(prop: any, errMessages: string[]) {
    if (prop == undefined)
        errMessages.push('trailingSlashes can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`trailingSlashes should be boolean`);
}
