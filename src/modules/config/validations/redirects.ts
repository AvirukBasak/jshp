'use strict';

import { isObject, isArray } from '../validateconfig';

const validateChild = function (child: NodeJS.Dict<any>, errMessages: string[]) {
    if (Object.keys(child).length < 3)
        errMessages.push('redirects objects should contain 3 properties');
    else
        for (const key in child) {
            if (!key)
                errMessages.push(`redirects objects can't have empty properties`);
            else if (key !== 'req' && key !== 'src' && key !== 'status')
                errMessages.push(`redirects objects can't have property '${key}'`);
            else if (!child[key])
                errMessages.push(`redirects object -> '${key}' can't be empty or undefined`);
            else if ([ 'req', 'src' ].includes(key) && typeof child[key] !== 'string')
                errMessages.push(`redirects object -> '${key}' should be a string`);
            else if (key === 'req' && !child[key].startsWith('/'))
                errMessages.push(`redirects object -> '${key}' should start with '/'`);
            else if (key === 'src' && !child['src'].startsWith('/') && !/^[a-zA-Z0-9\.\+\-]+?:\/{0,2}/.test(child['src']))
                errMessages.push(`redirects object -> '${key}' should start with '/' or a 'scheme://'`);
            else if (key === 'status' && typeof child['status'] !== 'number')
                errMessages.push(`redirects object -> '${key}' should be a number`);
            else if (key === 'status' && (child['status'] < 300 || child['status'] > 399))
                errMessages.push(`redirects object -> '${key}' should be 3xx`);
        }
}

export const redirects = function(prop: any, errMessages: string[]) {
    if (!prop)
        errMessages.push('redirects can\'t be nullish');
    else if (!isArray(prop))
        errMessages.push('redirects should be an array');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`redirects can\'t have nullish elements`);
            else if (!isObject(element))
                errMessages.push(`redirects can contain only objects`);
            else if (Object.keys(element).length < 1)
                errMessages.push('redirects can\'t have empty objects');
            else
                validateChild(element, errMessages);
        }
}
