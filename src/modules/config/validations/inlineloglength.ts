'use strict';

export const inlineLogLength = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('inlineLogLength can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`inlineLogLength should be number`);
}
