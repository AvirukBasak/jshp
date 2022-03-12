'use strict';

export const logPath = function(prop: any, errMessages: string[]) {
    if (typeof prop !== 'string')
        errMessages.push(`logPath should be string`);
}
