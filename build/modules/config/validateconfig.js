'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = exports.isArray = exports.isObject = void 0;
const builddir_1 = require("./validations/builddir");
const chunklimit_1 = require("./validations/chunklimit");
const chunksperecho_1 = require("./validations/chunksperecho");
const compileonstart_1 = require("./validations/compileonstart");
const defaultheaders_1 = require("./validations/defaultheaders");
const errfiles_1 = require("./validations/errfiles");
const execextensions_1 = require("./validations/execextensions");
const forbidden_1 = require("./validations/forbidden");
const hotcompile_1 = require("./validations/hotcompile");
const indexfile_1 = require("./validations/indexfile");
const inlineloglength_1 = require("./validations/inlineloglength");
const logpath_1 = require("./validations/logpath");
const matchconfig_1 = require("./validations/matchconfig");
const noextension_1 = require("./validations/noextension");
const redirects_1 = require("./validations/redirects");
const respondinchunks_1 = require("./validations/respondinchunks");
const rewrites_1 = require("./validations/rewrites");
const timeoutsec_1 = require("./validations/timeoutsec");
const trailingslashes_1 = require("./validations/trailingslashes");
/**
 * Checks if passed value is an object
 * @param {any} testVar
 */
const isObject = function (testVar) {
    return (typeof testVar).toLowerCase() === 'object'
        && !Array.isArray(testVar)
        && testVar != null;
};
exports.isObject = isObject;
/**
 * Checks if passed value is an array
 * @param {any} testVar
 */
const isArray = function (testVar) {
    return (typeof testVar).toLowerCase() === 'object'
        && Array.isArray(testVar)
        && testVar != null;
};
exports.isArray = isArray;
/**
 * Validates config properties of config object
 * @param {NodeJS.Dict<any>} config Config object
 * @param {boolean} exitFlag Default false, If true, calls process.exit(ErrCodes.EINVLCONF) on error
 */
const validateConfig = function (config) {
    const errMessages = [];
    // run validation checks
    (0, builddir_1.buildDir)(config.buildDir, errMessages);
    (0, chunklimit_1.chunkLimit)(config.chunkLimit, errMessages);
    (0, chunksperecho_1.chunksPerEcho)(config.chunksPerEcho, errMessages);
    (0, compileonstart_1.compileOnStart)(config.compileOnStart, errMessages);
    (0, defaultheaders_1.defaultHeaders)(config.defaultHeaders, errMessages);
    (0, errfiles_1.errFiles)(config.errFiles, errMessages);
    (0, execextensions_1.execExtensions)(config.execExtensions, errMessages);
    (0, forbidden_1.forbidden)(config.forbidden, errMessages);
    (0, hotcompile_1.hotCompile)(config.hotCompile, errMessages);
    (0, indexfile_1.indexFile)(config.indexFile, errMessages);
    (0, inlineloglength_1.inlineLogLength)(config.inlineLogLength, errMessages);
    (0, logpath_1.logPath)(config.logPath, errMessages);
    (0, matchconfig_1.matchConfig)(config.matchConfig, errMessages);
    (0, noextension_1.noExtension)(config.noExtension, errMessages);
    (0, redirects_1.redirects)(config.redirects, errMessages);
    (0, respondinchunks_1.respondInChunks)(config.respondInChunks, errMessages);
    (0, rewrites_1.rewrites)(config.rewrites, errMessages);
    (0, timeoutsec_1.timeoutSec)(config.timeoutSec, errMessages);
    (0, trailingslashes_1.trailingSlashes)(config.trailingSlashes, errMessages);
    for (let i = 0; i < errMessages.length; i++)
        errMessages[i] = '    ' + errMessages[i];
    // if err count is over 0, print and exit
    if (errMessages.length > 0)
        throw 'config: in config.json:\n'
            + errMessages.join('\n') + '\n'
            + `found ${errMessages.length} error(s)`;
};
exports.validateConfig = validateConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGVjb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGVjb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixxREFBa0Q7QUFDbEQseURBQXNEO0FBQ3RELCtEQUE0RDtBQUM1RCxpRUFBOEQ7QUFDOUQsaUVBQThEO0FBQzlELHFEQUFrRDtBQUNsRCxpRUFBOEQ7QUFDOUQsdURBQW9EO0FBQ3BELHlEQUFzRDtBQUN0RCx1REFBb0Q7QUFDcEQsbUVBQWdFO0FBQ2hFLG1EQUFnRDtBQUNoRCwyREFBd0Q7QUFDeEQsMkRBQXdEO0FBQ3hELHVEQUFvRDtBQUNwRCxtRUFBZ0U7QUFDaEUscURBQWtEO0FBQ2xELHlEQUFzRDtBQUN0RCxtRUFBZ0U7QUFFaEU7OztHQUdHO0FBQ0ksTUFBTSxRQUFRLEdBQUcsVUFBUyxPQUFZO0lBQ3pDLE9BQU8sQ0FBQyxPQUFPLE9BQU8sQ0FBQyxDQUFDLFdBQVcsRUFBRSxLQUFLLFFBQVE7V0FDM0MsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztXQUN2QixPQUFPLElBQUksSUFBSSxDQUFDO0FBQzNCLENBQUMsQ0FBQTtBQUpZLFFBQUEsUUFBUSxZQUlwQjtBQUVEOzs7R0FHRztBQUNJLE1BQU0sT0FBTyxHQUFHLFVBQVMsT0FBWTtJQUN4QyxPQUFPLENBQUMsT0FBTyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRO1dBQzNDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1dBQ3RCLE9BQU8sSUFBSSxJQUFJLENBQUM7QUFDM0IsQ0FBQyxDQUFBO0FBSlksUUFBQSxPQUFPLFdBSW5CO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sY0FBYyxHQUFHLFVBQVMsTUFBd0I7SUFFM0QsTUFBTSxXQUFXLEdBQWEsRUFBRSxDQUFDO0lBRWpDLHdCQUF3QjtJQUN4QixJQUFBLG1CQUFRLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN2QyxJQUFBLHVCQUFVLEVBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMzQyxJQUFBLDZCQUFhLEVBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNqRCxJQUFBLCtCQUFjLEVBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRCxJQUFBLCtCQUFjLEVBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRCxJQUFBLG1CQUFRLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN2QyxJQUFBLCtCQUFjLEVBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNuRCxJQUFBLHFCQUFTLEVBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6QyxJQUFBLHVCQUFVLEVBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMzQyxJQUFBLHFCQUFTLEVBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6QyxJQUFBLGlDQUFlLEVBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRCxJQUFBLGlCQUFPLEVBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyQyxJQUFBLHlCQUFXLEVBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM3QyxJQUFBLHlCQUFXLEVBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM3QyxJQUFBLHFCQUFTLEVBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN6QyxJQUFBLGlDQUFlLEVBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUNyRCxJQUFBLG1CQUFRLEVBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN2QyxJQUFBLHVCQUFVLEVBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMzQyxJQUFBLGlDQUFlLEVBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVyRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDdkMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFN0MseUNBQXlDO0lBQ3pDLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ3RCLE1BQU0sMkJBQTJCO2NBQzNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSTtjQUM3QixTQUFTLFdBQVcsQ0FBQyxNQUFNLFdBQVcsQ0FBQztBQUNyRCxDQUFDLENBQUE7QUFqQ1ksUUFBQSxjQUFjLGtCQWlDMUIifQ==