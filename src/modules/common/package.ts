'use strict';

// Get package properties from package.json
export const PACKAGE: NodeJS.Dict<any> = require('../../../package.json');

// Loads version directly from package.json, which is updated by npm version
export const VERSION: string = PACKAGE.version;

export const SERVER: string = 'jshp' + '/' + VERSION;
