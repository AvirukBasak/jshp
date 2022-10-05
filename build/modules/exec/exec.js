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
 * An alternative to JS require by default imports module from the $_RES_ROOT
 * @param {string} modPath The path to module
 * @return {module}
 */
const prequire = function (codePath) {
    let exports = {};
    if (codePath.startsWith('jshp::')
        || codePath.startsWith('js:')
        || codePath.startsWith('./'))
        try {
            if (codePath.startsWith('jshp::'))
                codePath = codePath.substring(6);
            else {
                if (codePath.startsWith('js:')) {
                    codePath = codePath.substring(3);
                    if (!codePath.endsWith('.js'))
                        codePath += '.js';
                }
                else
                    codePath = codePath.substring(2);
                codePath = PATH.join($_RES_ROOT, codePath);
            }
            const execCode = String(FS.readFileSync(codePath));
            eval(execCode);
            return exports;
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
                    return {};
                }
            Message.error('exec: eval: jshp file error\n'
                + messages_1.CleanMsg.runtimeError(String(error.stack), $_REQUEST.url || ''));
            return {};
        }
    else
        return require(codePath);
};
prequire;
/**
 * Runs JavaScript code within JSHP tags.
 */
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // stores executable code path
        let codePath = '';
        // get raw code for hot compilation, return on failure
        if ($_CONFIG.hotCompile)
            try {
                codePath = $_REQUEST.path;
                if (!FS.existsSync(codePath))
                    throw 'ENOENT: no such file or directory: ' + codePath;
                try {
                    yield Server.fileCompile($_REQUEST.path);
                    codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
                    if (!FS.existsSync(codePath))
                        throw 'ENOENT: no such file or directory: ' + codePath;
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
                if (!FS.existsSync(codePath))
                    throw 'ENOENT: no such file or directory: ' + codePath;
            }
            catch (error) {
                try {
                    // fallback to raw code if compiled code not found
                    Logger.warn('fallback to ' + $_REQUEST.path);
                    yield Server.fileCompile($_REQUEST.path);
                    codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
                    if (!FS.existsSync(codePath))
                        throw 'ENOENT: no such file or directory: ' + codePath;
                }
                catch (error) {
                    Message.error('exec: fallback compile: jshp file error\n'
                        + messages_1.CleanMsg.runtimeError(String(error.stack), $_REQUEST.url || ''));
                    return;
                }
            }
        prequire('jshp::' + codePath);
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2V4ZWMvZXhlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYiw4REFBZ0Q7QUFDaEQsaURBQXNEO0FBQ3RELHVEQUErRTtBQUUvRSwyQ0FBNkI7QUFDN0IsSUFBSSxDQUFDO0FBRUwseUNBQTJCO0FBQzNCLEdBQUcsQ0FBQztBQUVKLDJDQUE2QjtBQUM3QixJQUFJLENBQUM7QUFFTCx1Q0FBeUI7QUFDekIsRUFBRSxDQUFDO0FBRUg7Ozs7O0dBS0c7QUFDSCxNQUFNLEtBQUssR0FBcUIsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUM1QyxLQUFLLENBQUM7QUFFTjs7OztHQUlHO0FBQ0gsTUFBTSxRQUFRLEdBQXFCLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBQ25FLFFBQVEsQ0FBQztBQUVUOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsR0FBVyxRQUFRLENBQUMsT0FBTyxDQUFDO0FBQzVDLFVBQVUsQ0FBQztBQUVYOzs7R0FHRztBQUNILE1BQU0sU0FBUyxHQUFxQixhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztBQUNqRSxTQUFTLENBQUM7QUFFVjs7OztHQUlHO0FBQ0gsTUFBTSxTQUFTLEdBQXFCLFNBQVMsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzVELFNBQVMsQ0FBQztBQUVWOzs7O0dBSUc7QUFDSCxNQUFNLFNBQVMsR0FBcUIsU0FBUyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDNUQsU0FBUyxDQUFBO0FBRVQ7Ozs7O0dBS0c7QUFDSCxNQUFNLEtBQUssR0FBcUIsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7QUFDdEQsS0FBSyxDQUFDO0FBRU47Ozs7O0dBS0c7QUFDSCxNQUFNLE1BQU0sR0FBcUIsU0FBUyxDQUFD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