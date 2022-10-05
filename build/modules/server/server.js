'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.reloadConfig = void 0;
const http = __importStar(require("http"));
const url = __importStar(require("url"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const config_1 = require("../config/config");
const logger_1 = __importDefault(require("../logger/logger"));
const general_1 = require("../common/general");
const HTTPMethods = __importStar(require("./methods"));
const ErrCodes = __importStar(require("../common/errcodes"));
let Host = '';
let Port = 0;
let Config = {};
let Logs;
let ResRoot = '';
let LogPath = '';
/**
 * Removes ../ and multiple //////
 * @param {string} str The path
 * @return {string}
 */
const cleanPath = function (str) {
    return str.replace(/\.{2,}/g, '').replace(/\/{2,}/, '/');
};
/**
 * A wrapper around regexTestStr.
 * This function passes the caret and dollar flags to the function.
 * @param {string[]} arr Array of regex strings
 * @param {string} string to match
 * @returns {string|undefined} The regex that made 1st match, undefined otherwise.
 */
const configuredRegexTestStr = function (arr, str) {
    return (0, general_1.regexTestStr)(arr, str, Config.matchConfig.matchFromStart, Config.matchConfig.matchTillEnd);
};
/**
 * Get path to errFile if it exists, otherwise res.end with error code.
 */
const putHTTPError = function (req, res, logmsg) {
    Logs.error(req, res, logmsg);
    const errFilepath = Config.errFiles[String(res.statusCode)];
    if (Config.errFiles[String(res.statusCode)]
        && fs.existsSync(path.join(ResRoot, errFilepath))) {
        req.url = errFilepath + req.queryString;
        req.path = path.join(ResRoot, errFilepath);
        HTTPMethods.initMethods(Config, Logs);
        HTTPMethods.GET(req, res);
    }
    else
        res.end();
};
const serverCallback = function (req, res) {
    let reqPath = '';
    let reqQueryString = '';
    let reqSysPath = '';
    // loads pathname from request
    reqPath = url.parse(req.url || '', true).pathname || '/';
    // get query string from request
    reqQueryString = (function () {
        var _a, _b, _c;
        if (((_a = req.url) === null || _a === void 0 ? void 0 : _a.indexOf('?')) === -1)
            return '';
        return ((_b = req.url) === null || _b === void 0 ? void 0 : _b.substring((_c = req.url) === null || _c === void 0 ? void 0 : _c.indexOf('?'))) || '';
    })();
    // replaces ../ with /, and excess ///// with a single /
    reqPath = cleanPath(reqPath);
    res.statusCode = NaN;
    // custom properties
    req.query = url.parse(req.url || '', true).query;
    req.queryString = reqQueryString;
    // new Logger instance
    Logs = new logger_1.default(Config, req, res);
    Logs.info(req, res);
    /* This prevents server from crashing
     * for paths containing %00, response is 'Bad Request'.
     */
    if (reqPath.includes('%00')) {
        res.statusCode = 400;
        putHTTPError(req, res, 'server: error: invalid request\n'
            + "character 0 or '%00' is not allowed in requests");
        return;
    }
    if (reqPath.includes('\\u')) {
        res.statusCode = 400;
        putHTTPError(req, res, 'server: error: invalid request\n'
            + "'\\u' is not allowed in requests");
        return;
    }
    /* If requested path is blacklisted
     */
    if (configuredRegexTestStr(Config.forbidden, reqPath)) {
        res.statusCode = 403;
        req.url = reqPath + reqQueryString;
        putHTTPError(req, res);
        return;
    }
    {
        /* This block localises the variable regex
         */
        let regex = '';
        /* If rewrite exist in Config, change reqPath to rewritten name
         * This will cause the server to respond with data from the rewritten path
         */
        if (regex = configuredRegexTestStr(Config.rewriteList, reqPath)) {
            const rwrt = Config.rewrites[Config.rewriteList.indexOf(regex)];
            reqPath = rwrt.src;
            req.url = reqPath + reqQueryString;
        }
        /* If redirect exist in Config, change reqPath to redirected name
         */
        else if (regex = configuredRegexTestStr(Config.redirectList, reqPath)) {
            const rdir = Config.redirects[Config.redirectList.indexOf(regex)];
            reqPath = rdir.src;
            res.statusCode = rdir.status;
            res.setHeader('Location', reqPath + reqQueryString);
            res.end();
            req.url = reqPath + reqQueryString;
            Logs.info(req, res);
            return;
        }
    }
    // noExtension files
    if (!reqPath.endsWith('/'))
        for (const ext of Config.noExtension) {
            let possiblePath = reqPath + ext;
            if (fs.existsSync(path.join(ResRoot, possiblePath))) {
                reqPath = possiblePath;
                req.url = reqPath + reqQueryString;
                break;
            }
        }
    // always rewrites / to index value from Config
    if (reqPath.endsWith('/')) {
        reqPath = path.join(reqPath, Config.indexFile);
        req.url = reqPath + reqQueryString;
    }
    /* If requested path is blacklisted
     */
    if (configuredRegexTestStr(Config.forbidden, reqPath)) {
        res.statusCode = 403;
        req.url = reqPath + reqQueryString;
        putHTTPError(req, res);
        return;
    }
    // Generate system path to resource from the requested path
    reqSysPath = path.join(ResRoot, reqPath);
    // checking if path exists and is not a directory
    try {
        if (fs.lstatSync(reqSysPath).isDirectory()) {
            res.statusCode = 400;
            putHTTPError(req, res, 'path is a directory');
            return;
        }
    }
    catch (err) {
        const error = err;
        req.url = reqPath + reqQueryString;
        if (error.code === 'ENOENT') {
            res.statusCode = 404;
            putHTTPError(req, res, error);
            return;
        }
        res.statusCode = 500;
        putHTTPError(req, res, error);
        return;
    }
    res.statusCode = 200;
    req.url = reqPath + reqQueryString;
    reqPath = reqSysPath;
    // custom properties
    req.path = reqPath;
    HTTPMethods.initMethods(Config, Logs);
    switch (req.method) {
        case 'GET': {
            HTTPMethods.GET(req, res);
            break;
        }
        case 'POST': {
            HTTPMethods.POST(req, res);
            break;
        }
        case 'PUT': {
            HTTPMethods.PUT(req, res);
            break;
        }
        case 'DELETE': {
            HTTPMethods.DELETE(req, res);
            break;
        }
        case 'OPTIONS': {
            HTTPMethods.OPTIONS(req, res);
            break;
        }
        default: {
            res.statusCode = 405;
            putHTTPError(req, res);
            break;
        }
    }
};
const listenerCallback = function () {
    const log = `[${(0, general_1.getLongDateTime)()}] JSHP Server (${Host || '0.0.0.0'}:${Port}) started`;
    console.log(log);
    if (Config.logPath)
        fs.appendFile(LogPath, log + '\n', function (error) {
            if (!error)
                return;
            console.error(error);
            process.exit(ErrCodes.ELOGRFAIL);
        });
};
/**
 * Reloads config data from config.json
 * @param {boolean} loadFile Used internally, default true, if false, loads config data from file and overwrites current Config object.
 */
const reloadConfig = function (loadFile = true) {
    const configBackup = Config;
    if (loadFile)
        Config = (0, config_1.loadConfig)(ResRoot);
    /* this prevents LogPath = 'Public/server.log' from becoming 'Public/Public/server.log'
     * if the value of Config.logPath wasn't changed in the previous step.
     */
    if (LogPath !== Config.logPath && Config.logPath) {
        LogPath = path.normalize(path.join(ResRoot, Config.logPath));
        Config.logPath = LogPath;
    }
    // if set to false
    if (!Config.trailingSlashes)
        // insert '/' to beginning of array, directories always gain preference over file extensions
        Config.noExtension.splice(0, 0, '/');
    // indexes rewrites
    Config.rewriteList = [];
    for (const rwrt of Config.rewrites)
        Config.rewriteList.push(rwrt.req);
    // indexes redirects
    Config.redirectList = [];
    for (const rdir of Config.redirects)
        Config.redirectList.push(rdir.req);
    Config.srcMapping = configBackup.srcMapping;
};
exports.reloadConfig = reloadConfig;
const start = function (config) {
    Config = config;
    Host = config.host;
    Port = config.port;
    ResRoot = config.resRoot;
    // loadFile value is passed false as file was already loaded in index.ts
    (0, exports.reloadConfig)(false);
    const server = http.createServer(serverCallback);
    if (Host)
        server.listen(Port, Host, listenerCallback);
    else
        server.listen(Port, listenerCallback);
};
exports.start = start;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvc2VydmVyL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSWIsMkNBQTZCO0FBQzdCLHlDQUEyQjtBQUMzQiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLDZDQUE4QztBQUM5Qyw4REFBc0M7QUFDdEMsK0NBQWtFO0FBQ2xFLHVEQUF5QztBQUN6Qyw2REFBK0M7QUFFL0MsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO0FBQ3RCLElBQUksSUFBSSxHQUFXLENBQUMsQ0FBQztBQUVyQixJQUFJLE1BQU0sR0FBcUIsRUFBRSxDQUFDO0FBQ2xDLElBQUksSUFBWSxDQUFDO0FBQ2pCLElBQUksT0FBTyxHQUFXLEVBQUUsQ0FBQztBQUN6QixJQUFJLE9BQU8sR0FBVyxFQUFFLENBQUM7QUFFekI7Ozs7R0FJRztBQUNILE1BQU0sU0FBUyxHQUFHLFVBQVMsR0FBVztJQUNsQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0QsQ0FBQyxDQUFBO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxzQkFBc0IsR0FBRyxVQUFTLEdBQWEsRUFBRSxHQUFXO0lBQzlELE9BQU8sSUFBQSxzQkFBWSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUN0RyxDQUFDLENBQUE7QUFFRDs7R0FFRztBQUNILE1BQU0sWUFBWSxHQUFHLFVBQVMsR0FBZ0IsRUFBRSxHQUF3QixFQUFFLE1BQWU7SUFDckYsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxF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