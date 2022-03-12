'use strict';

export const buildDir = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('buildDir can\'t be empty or undefined');
    else if (typeof prop !== 'string')
        errMessages.push(`buildDir should be string`);
}
