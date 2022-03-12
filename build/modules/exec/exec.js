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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WorkerThreads = __importStar(require("worker_threads"));
const messages_1 = require("../output/messages");
const statuscodes_1 = require("../common/statuscodes");
const HTTP = __importStar(require("http"));
HTTP;
const URL = __importStar(require("url"));
URL;
const PATH = __importStar(require("path"));
PATH;
const FS = __importStar(require("fs"));
FS;
/**
 * Super global variable.
 * Stores OS environment variables.
 * Only holds those variables that were added to the environment before the parser was called.
 * @type {NodeJS.ProcessEnv}
 */
const $_ENV = process.env;
$_ENV;
/**
 * Super global variable.
 * Holds configuration data from config.json file.
 * @type {NodeJS.Dict<any>}
 */
const $_CONFIG = WorkerThreads.workerData.config;
$_CONFIG;
/**
 * Suoer global variable.
 * Stores the directory from where server is serving resources.
 * @type {string}
 */
const $_RES_ROOT = $_CONFIG.resRoot;
$_RES_ROOT;
/**
 * Stores request data.
 * @type {NodeJS.Dict<any>}
 */
const $_REQUEST = WorkerThreads.workerData.req;
$_REQUEST;
/**
 * Super global variable.
 * Holds cookies of the request.
 * @type {NodeJS.Dict<any>}
 */
const $_COOKIES = $_REQUEST.cookies || {};
$_COOKIES;
/**
 * Super global variable.
 * Holds headers of the request.
 * @type {NodeJS.Dict<any>}
 */
const $_HEADERS = $_REQUEST.headers || {};
$_HEADERS;
/**
 * Super global variable.
 * Stores GET query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_GET = $_REQUEST.query || {};
$_GET;
/**
 * Super global variable.
 * Stores POST query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_POST = $_REQUEST.method === 'POST' ? {} : {};
$_POST;
/**
 * Super global variable.
 * @type {NodeJS.Dict<any>}
 */
const $_SERVER = {
    'QUERY_STRING': $_REQUEST.queryString,
    'REMOTE_ADDRESS': $_REQUEST.remoteAddress,
    'REQUEST_METHOD': $_REQUEST.method,
    'REQUEST_URI': $_REQUEST.uri,
    'SENT_HEAD_CHUNK': false,
};
$_SERVER;
/**
 * Super global variable.
 * Not yet implemented.
 * @type {NodeJS.Dict<any>}
 */
const $_SESSION = {};
$_SESSION;
/**
 * Gets status code of current page
 * @return {number}
 */
const getStatusCode = function () {
    var _a;
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'getStatusCode',
    });
    return new Promise(function (resolve, reject) {
        var _a;
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.once('message', function (message) {
            if (message.func === 'getStatusCode') {
                resolve(message.statusCode);
            }
            reject(new Error('exec: getStatusCode: didn\'t recieve statusCode\n'
                + `    did you 'await ${message.func}()' during the last call?\n`));
        });
    });
};
getStatusCode;
/**
 * Writes status code to response.
 * @param {string} key
 * @param {string} value
 */
const setStatusCode = function (statusCode) {
    var _a;
    if ($_SERVER['SENT_HEAD_CHUNK'])
        throw new Error('setStatusCode: function should be placed before all HTML code\n'
            + '    Note: Config.respondInChunks is true');
    if (typeof statusCode !== 'number')
        throw new TypeError('exec: setStatusCode: statusCode should be Number, recieved ' + typeof statusCode);
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'setStatusCode',
        statusCode
    });
};
setStatusCode;
/**
 * Writes headers to response.
 * @param {string} key
 * @param {string} value
 */
const setHeader = function (name, value) {
    var _a;
    if ($_SERVER['SENT_HEAD_CHUNK'])
        throw new Error('setHeader: function should be placed before all HTML code\n'
            + '    Note: Config.respondInChunks is true');
    if (typeof name !== 'string')
        throw new TypeError('exec: setHeader: name should be String, recieved ' + typeof name);
    if (typeof value !== 'string')
        throw new TypeError('exec: setHeader: value should be String, recieved ' + typeof value);
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'setHeader',
        headerName: name,
        headerValue: value
    });
};
setHeader;
/**
 * Set a cookie to a response.
 * @param {string} name
 * @param {string} value
 */
const setCookie = function (name, value) {
    var _a;
    if ($_SERVER['SENT_HEAD_CHUNK'])
        throw new Error('setCookie: function should be placed before all HTML code\n'
            + '    Note: Config.respondInChunks is true');
    if (typeof name !== 'string')
        throw new TypeError('exec: setCookie: name should be String, recieved ' + typeof name);
    if (typeof value !== 'string')
        throw new TypeError('exec: setCookie: value should be String, recieved ' + value);
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'setCookie',
        cookieName: name,
        cookieValue: value
    });
};
setCookie;
/**
 * Ends response
 * @param {string | Buffer} data
 * @param {string} encoding
 */
const endResponse = function (data, encoding) {
    var _a;
    if (typeof data !== 'string' && !(data instanceof Buffer))
        throw new TypeError('exec: endResponse: data should be String or Buffer, recieved ' + typeof data);
    if (!['string', 'undefined'].includes(typeof encoding))
        throw new TypeError('exec: endResponse: encoding should be String, recieved ' + typeof encoding);
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'endResponse',
        data,
        encoding
    });
};
endResponse;
/**
 * Write logs to the console
 */
const Logger = {
    info: function (logMsg) {
        var _a;
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Logger.info',
            logMsg,
        });
    },
    error: function (logMsg) {
        var _a;
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Logger.error',
            logMsg,
        });
    },
    warn: function (logMsg) {
        var _a;
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Logger.warn',
            logMsg,
        });
    },
};
Logger;
/**
 * Displays server information to the webpage.
 */
const nodejsinfo = function () {
    var _a;
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'nodejsinfo',
    });
};
nodejsinfo;
/**
 * Displays server information to the webpage.
 */
const jshpinfo = function () {
    nodejsinfo();
};
jshpinfo;
/**
 * Writes some data directly to response
 * @param {any} buffer Data to write
 */
const writeToResponse = function (data) {
    var _a;
    if (typeof data !== 'string' && !(data instanceof Buffer))
        throw new TypeError('exec: writeToResponse: data should be String or Buffer, recieved ' + typeof data);
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'writeToResponse',
        body: data
    });
};
writeToResponse;
/**
 * Echoes a string.
 * @param {string} str text/HTML string to echo.
 */
const echo = function (str) {
    var _a;
    if (str === '')
        return str;
    else if (!str)
        str = '\n';
    if ($_CONFIG.respondInChunks)
        $_SERVER['SENT_HEAD_CHUNK'] = true;
    if (typeof str === 'object' && !Array.isArray(str))
        throw new TypeError('exec: echo: argument shouldn\'t be an object');
    str = String(str);
    str = str.substring(0, str.length - 1) + (str[str.length - 1] === '\n' ? '<br>' : str[str.length - 1]);
    (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
        func: 'echo',
        body: str
    });
    return str;
};
echo;
/**
 * Displays a message, some text in a <pre>, with a rounded border.
 * Functions: Message.echo() & Message.error()
 */
const Message = {
    /**
     * Shows a message highlighted by a colored border.
     * @param {string} str Message.
     * @param {string} color Border color, optional. Default is dodgerblue
     * @return {string} HTML string enclosed within a <pre>.
     */
    echo: function (str, color) {
        if (typeof str === 'object' && !Array.isArray(str))
            throw new TypeError('exec: Message.echo: output shouldn\'t be an object');
        if (!['string', 'undefined'].includes(typeof color) && !Array.isArray(str))
            throw new TypeError('exec: Message.echo: color should be String, recieved ' + typeof color);
        return echo(messages_1.MsgBox.info(str, color));
    },
    /**
     * Shows a message highlighted by a 'yellow' colored border.
     * @param {string} str Message.
     * @return {string} HTML string enclosed within a <pre>..
     */
    warn: function (str) {
        if (typeof str === 'object' && !Array.isArray(str))
            throw new TypeError('exec: Message.error: output shouldn\'t be an object');
        return echo(messages_1.MsgBox.warn(str));
    },
    /**
     * Shows a message highlighted by a 'tomato' colored border.
     * @param {string} str Message.
     * @return {string} HTML string enclosed within a <pre>..
     */
    error: function (str) {
        if (typeof str === 'object' && !Array.isArray(str))
            throw new TypeError('exec: Message.error: output shouldn\'t be an object');
        setStatusCode(500);
        return echo(messages_1.MsgBox.error(str));
    },
};
Message;
/**
 * Functions: File.read(path, callback) and File.write(path, buffer, callback)
 */
const File = {
    /**
     * Reads a file and returns the data.
     * This function reads files synchronously.
     * @param {string} filePath URL or path to file
     * @param {(error: Error) => any} callback(error) Optional. The function to run if an error occurs when reading. By default, error will appear on the page as an error message.
     * @return {Buffer | null}
     */
    read: function (filePath, callback) {
        if (typeof filePath !== 'string')
            throw new TypeError('exec: File.read: filePath should be String, recieved ' + typeof filePath);
        if (!['function', 'undefined'].includes(typeof callback))
            throw new TypeError('exec: File.read: callback should be Function, recieved ' + typeof callback);
        if (!filePath.startsWith($_RES_ROOT))
            filePath = PATH.join($_RES_ROOT, filePath);
        try {
            const data = FS.readFileSync(filePath);
            return data;
        }
        catch (error) {
            if (callback) {
                callback(error);
                return null;
            }
            Message.error('exec: File.read: jshp file error\n' + error.stack);
            setStatusCode(500);
        }
        return null;
    },
    /**
     * Writes a file asynchronously. If file exists, data will get appended by default.
     * @param {string} filePath URL or path to file.
     * @param {Buffer} data Data to write.
     * @param {NodeJS.Dict<any>} options Write options object.
     * @param {(error: Error) => void} callback(error) Optional. The function to run if an error occurs when writing. By default, error will appear on the page as an error message.
     */
    write: function (filePath, data, options, callback) {
        if (typeof filePath !== 'string')
            throw new TypeError('exec: File.write: filePath should be String, recieved ' + typeof filePath);
        if (typeof filePath !== 'string' && !(data instanceof Buffer))
            throw new TypeError('exec: File.write: data should be String or Buffer, recieved ' + typeof data);
        if (!['function', 'undefined'].includes(typeof callback))
            throw new TypeError('exec: File.write: callback should be Function, recieved ' + typeof callback);
        if (!filePath.startsWith($_RES_ROOT))
            filePath = PATH.join($_RES_ROOT, filePath);
        if (!options)
            options.flag = 'a';
        if (!callback)
            callback = function (error) {
                Message.error('exec: File.write: jshp file error\n' + error.stack);
                setStatusCode(500);
            };
        FS.writeFile(filePath, data, options, callback);
    }
};
File;
const ResponseCode = {
    /**
     * Get a list of response codes with their status messages.
     * @return {NodeJS.Dict<any>}
     */
    list: function () {
        return (0, statuscodes_1.getStatusMessageList)();
    },
    /**
     * Get status messages of a response code.
     * @param {number} statusCode
     * @return {string}
     */
    getMessage: function (statusCode) {
        if (typeof statusCode !== 'number')
            throw new TypeError('exec: ResponseCode.getMessage: statusCode should be Number, recived ' + typeof statusCode);
        return (0, statuscodes_1.getStatusMessage)(statusCode);
    }
};
ResponseCode;
/**
 * Special server functions.
 * These functions have direct control over server operations.
 */
const Server = {
    /**
     * Reloads config data from config.json
     */
    reloadConfig: function () {
        var _a;
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Server.reloadConfig',
        });
        return new Promise(function (resolve, reject) {
            var _a;
            (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.once('message', function (message) {
                if (message.func === 'Server.reloadConfig') {
                    $_CONFIG.srcMapping = message.config;
                    resolve(message.config);
                }
                else
                    reject(new Error('exec: Server.reloadConfig: didn\'t recieve config data\n'
                        + `    did you 'await ${message.func}()' during the last call?\n`));
            });
        });
    },
    /**
     * Recompile a single file
     * @param {string} sourcePath Path to source file
     */
    fileCompile: function (sourcePath) {
        var _a;
        if (typeof sourcePath !== 'string')
            throw new TypeError('exec: Server.fileCompile: sourcePath should be String, recieved ' + typeof sourcePath);
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Server.fileCompile',
            path: sourcePath
        });
        return new Promise(function (resolve, reject) {
            var _a;
            (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.once('message', function (message) {
                if (message.func === 'Server.fileCompile') {
                    $_CONFIG.srcMapping = message.srcMapping;
                    resolve(message.srcMapping);
                }
                else
                    reject(new Error('exec: Server.fileCompile: didn\'t recieve srcMapping data\n'
                        + `    did you 'await ${message.func}()' during the last call?\n`));
            });
        });
    },
    /**
     * Recompile sources
     * @param {string} specificPath Optional, path to file that'll get compiled
     */
    recompile: function () {
        var _a;
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Server.recompile',
        });
        return new Promise(function (resolve, reject) {
            var _a;
            (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.once('message', function (message) {
                if (message.func === 'Server.recompile') {
                    $_CONFIG.srcMapping = message.srcMapping;
                    resolve(message.srcMapping);
                }
                else
                    reject(new Error('exec: Server.recompile: didn\'t recieve srcMapping data\n'
                        + `    did you 'await ${message.func}()' during the last call?\n`));
            });
        });
    },
    /**
     * Puts response hash to header X-Response-Hash
     * @param {string} func Optional, hashing function to be used
     */
    putResHash: function (func) {
        var _a;
        if (!func)
            func = 'md5';
        (_a = WorkerThreads.parentPort) === null || _a === void 0 ? void 0 : _a.postMessage({
            func: 'Server.putResHash',
            hashFunc: func,
        });
    },
};
Server;
/**
 * Runs JavaScript code within JSHP tags.
 */
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // stores executable code path
        let codePath = '';
        // stores executable code
        let execCode = '';
        // get raw code for hot compilation, return on failure
        if ($_CONFIG.hotCompile)
            try {
                execCode = String(FS.readFileSync($_REQUEST.path));
                try {
                    yield Server.fileCompile($_REQUEST.path);
                    codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
                    execCode = String(FS.readFileSync(codePath));
                }
                catch (error) {
                    Message.error('exec: hotCompile: jshp file error\n'
                        + messages_1.CleanMsg.runtimeError(String(error.stack), $_REQUEST.url || ''));
                    return;
                }
            }
            catch (error) {
                Message.error(error.stack || '');
                return;
            }
        // try to get executable code otherwise
        if (!$_CONFIG.hotCompile)
            try {
                codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
                execCode = String(FS.readFileSync(codePath));
            }
            catch (error) {
                try {
                    // fallback to raw code if compiled code not found
                    Logger.warn('fallback to ' + $_REQUEST.path);
                    yield Server.fileCompile($_REQUEST.path);
                    codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
                    execCode = String(FS.readFileSync(codePath));
                }
                catch (error) {
                    Message.error('exec: fallback compile: jshp file error\n'
                        + messages_1.CleanMsg.runtimeError(String(error.stack), $_REQUEST.url || ''));
                    return;
                }
            }
        try {
            // execute code
            eval(execCode);
        }
        catch (error) {
            /* on syntax error, require the path, which will throw the syntax
             * error and allow it to be traceable.
             * Then catch the error, and through some string manipulation, create
             * a user-friendly error message.
             */
            const absCodePath = PATH.resolve(codePath);
            if (codePath && error instanceof SyntaxError)
                try {
                    require(absCodePath);
                }
                catch (e) {
                    const error = e;
                    let stackTrace = error.stack;
                    let cutoffIndex = stackTrace.indexOf('\n    at');
                    if (cutoffIndex < 0)
                        cutoffIndex = error.stack.length;
                    stackTrace = stackTrace.substring(0, cutoffIndex);
                    // replaces certain character with certain others
                    stackTrace = messages_1.CleanMsg.syntaxError(stackTrace, { absCodePath, uri: $_SERVER['REQUEST_URI'] });
                    Message.error('exec: eval: jshp file error\n'
                        + stackTrace);
                    return;
                }
            Message.error('exec: eval: jshp file error\n'
                + messages_1.CleanMsg.runtimeError(String(error.stack), $_REQUEST.url || ''));
        }
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2V4ZWMvZXhlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLDhEQUFnRDtBQUNoRCxpREFBc0Q7QUFDdEQsdURBQStFO0FBRS9FLDJDQUE2QjtBQUM3QixJQUFJLENBQUM7QUFFTCx5Q0FBMkI7QUFDM0IsR0FBRyxDQUFDO0FBRUosMkNBQTZCO0FBQzdCLElBQUksQ0FBQztBQUVMLHVDQUF5QjtBQUN6QixFQUFFLENBQUM7QUFFSDs7Ozs7R0FLRztBQUNILE1BQU0sS0FBSyxHQUFxQixPQUFPLENBQUMsR0FBRyxDQUFDO0FBQzVDLEtBQUssQ0FBQztBQUVOOzs7O0dBSUc7QUFDSCxNQUFNLFFBQVEsR0FBcUIsYUFBYSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUM7QUFDbkUsUUFBUSxDQUFDO0FBRVQ7Ozs7R0FJRztBQUNILE1BQU0sVUFBVSxHQUFXLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDNUMsVUFBVSxDQUFDO0FBRVg7OztHQUdHO0FBQ0gsTUFBTSxTQUFTLEdBQXFCLGFBQWEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO0FBQ2pFLFNBQVMsQ0FBQztBQUVWOzs7O0dBSUc7QUFDSCxNQUFNLFNBQVMsR0FBcUIsU0FBUyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDNUQsU0FBUyxDQUFDO0FBRVY7Ozs7R0FJRztBQUNILE1BQU0sU0FBUyxHQUFxQixTQUFTLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUM1RCxTQUFTLENBQUE7QUFFVDs7Ozs7R0FLRztBQUNILE1BQU0sS0FBSyxHQUFxQixTQUFTLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztBQUN0RCxLQUFLLENBQUM7QUFFTjs7Ozs7R0FLRztBQUNILE1BQU0sTUFBTSxHQUFxQixTQUFTLENBQUMsTUFB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