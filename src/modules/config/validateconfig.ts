'use strict';

import { buildDir } from './validations/builddir';
import { chunkLimit } from './validations/chunklimit';
import { chunksPerEcho } from './validations/chunksperecho';
import { compileOnStart } from './validations/compileonstart';
import { defaultHeaders } from './validations/defaultheaders';
import { errFiles } from './validations/errfiles';
import { execExtensions } from './validations/execextensions';
import { forbidden } from './validations/forbidden';
import { hotCompile } from './validations/hotcompile';
import { indexFile } from './validations/indexfile';
import { inlineLogLength } from './validations/inlineloglength';
import { logPath } from './validations/logpath';
import { matchConfig } from './validations/matchconfig';
import { noExtension } from './validations/noextension';
import { redirects } from './validations/redirects';
import { respondInChunks } from './validations/respondinchunks';
import { rewrites } from './validations/rewrites';
import { timeoutSec } from './validations/timeoutsec';
import { trailingSlashes } from './validations/trailingslashes';

/**
 * Checks if passed value is an object
 * @param {any} testVar
 */
export const isObject = function(testVar: any): boolean {
    return (typeof testVar).toLowerCase() === 'object'
        && !Array.isArray(testVar)
        && testVar != null;
}

/**
 * Checks if passed value is an array
 * @param {any} testVar
 */
export const isArray = function(testVar: any): boolean {
    return (typeof testVar).toLowerCase() === 'object'
        && Array.isArray(testVar)
        && testVar != null;
}

/**
 * Validates config properties of config object
 * @param {NodeJS.Dict<any>} config Config object
 * @param {boolean} exitFlag Default false, If true, calls process.exit(ErrCodes.EINVLCONF) on error
 */
export const validateConfig = function(config: NodeJS.Dict<any>) {

    const errMessages: string[] = [];

    // run validation checks
    buildDir(config.buildDir, errMessages);
    chunkLimit(config.chunkLimit, errMessages);
    chunksPerEcho(config.chunksPerEcho, errMessages);
    compileOnStart(config.compileOnStart, errMessages);
    defaultHeaders(config.defaultHeaders, errMessages);
    errFiles(config.errFiles, errMessages);
    execExtensions(config.execExtensions, errMessages);
    forbidden(config.forbidden, errMessages);
    hotCompile(config.hotCompile, errMessages);
    indexFile(config.indexFile, errMessages);
    inlineLogLength(config.inlineLogLength, errMessages);
    logPath(config.logPath, errMessages);
    matchConfig(config.matchConfig, errMessages);
    noExtension(config.noExtension, errMessages);
    redirects(config.redirects, errMessages);
    respondInChunks(config.respondInChunks, errMessages);
    rewrites(config.rewrites, errMessages);
    timeoutSec(config.timeoutSec, errMessages);
    trailingSlashes(config.trailingSlashes, errMessages);

    for (let i = 0; i < errMessages.length; i++)
        errMessages[i] = '    ' + errMessages[i];

    // if err count is over 0, print and exit
    if (errMessages.length > 0)
        throw 'config: in config.json:\n'
            + errMessages.join('\n') + '\n'
            + `found ${errMessages.length} error(s)`;
}
