'use strict';

export const compileOnStart = function(prop: any, errMessages: string[]) {
    if (prop == undefined)
        errMessages.push('compileOnStart can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`compileOnStart should be boolean`);
}
