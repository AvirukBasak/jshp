'use strict';

export const hotCompile = function(prop: any, errMessages: string[]) {
    if (prop == undefined)
        errMessages.push('hotCompile can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`hotCompile should be boolean`);
}
