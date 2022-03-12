'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvc2VydmVyL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJYiwyQ0FBNkI7QUFDN0IseUNBQTJCO0FBQzNCLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFFekIsNkNBQThDO0FBQzlDLDhEQUFzQztBQUN0QywrQ0FBa0U7QUFDbEUsdURBQXlDO0FBQ3pDLDZEQUErQztBQUUvQyxJQUFJLElBQUksR0FBVyxFQUFFLENBQUM7QUFDdEIsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFDO0FBRXJCLElBQUksTUFBTSxHQUFxQixFQUFFLENBQUM7QUFDbEMsSUFBSSxJQUFZLENBQUM7QUFDakIsSUFBSSxPQUFPLEdBQVcsRUFBRSxDQUFDO0FBQ3pCLElBQUksT0FBTyxHQUFXLEVBQUUsQ0FBQztBQUV6Qjs7OztHQUlHO0FBQ0gsTUFBTSxTQUFTLEdBQUcsVUFBUyxHQUFXO0lBQ2xDLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3RCxDQUFDLENBQUE7QUFFRDs7Ozs7O0dBTUc7QUFDSCxNQUFNLHNCQUFzQixHQUFHLFVBQVMsR0FBYSxFQUFFLEdBQVc7SUFDOUQsT0FBTyxJQUFBLHNCQUFZLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RHLENBQUMsQ0FBQTtBQUVEOztHQUVHO0FBQ0gsTUFBTSxZQUFZLEdBQUcsVUFBUyxHQUFnQixFQUFFLEdBQXdCLEVBQUUsTUFBZTtJQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUs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