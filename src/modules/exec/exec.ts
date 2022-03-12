'use strict';

import * as WorkerThreads from 'worker_threads';
import { MsgBox, CleanMsg } from '../output/messages';
import { getStatusMessageList, getStatusMessage } from '../common/statuscodes';

import * as HTTP from 'http';
HTTP;

import * as URL from 'url';
URL;

import * as PATH from 'path';
PATH;

import * as FS from 'fs';
FS;

/**
 * Super global variable.
 * Stores OS environment variables.
 * Only holds those variables that were added to the environment before the parser was called.
 * @type {NodeJS.ProcessEnv}
 */
const $_ENV: NodeJS.Dict<any> = process.env;
$_ENV;

/**
 * Super global variable.
 * Holds configuration data from config.json file.
 * @type {NodeJS.Dict<any>}
 */
const $_CONFIG: NodeJS.Dict<any> = WorkerThreads.workerData.config;
$_CONFIG;

/**
 * Suoer global variable.
 * Stores the directory from where server is serving resources.
 * @type {string}
 */
const $_RES_ROOT: string = $_CONFIG.resRoot;
$_RES_ROOT;

/**
 * Stores request data.
 * @type {NodeJS.Dict<any>}
 */
const $_REQUEST: NodeJS.Dict<any> = WorkerThreads.workerData.req;
$_REQUEST;

/**
 * Super global variable.
 * Holds cookies of the request.
 * @type {NodeJS.Dict<any>}
 */
const $_COOKIES: NodeJS.Dict<any> = $_REQUEST.cookies || {};
$_COOKIES;

/**
 * Super global variable.
 * Holds headers of the request.
 * @type {NodeJS.Dict<any>}
 */
const $_HEADERS: NodeJS.Dict<any> = $_REQUEST.headers || {};
$_HEADERS

/**
 * Super global variable.
 * Stores GET query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_GET: NodeJS.Dict<any> = $_REQUEST.query || {};
$_GET;

/**
 * Super global variable.
 * Stores POST query fields and values.
 * For duplicated values, an array of values is returned.
 * @type {NodeJS.Dict<any>}
 */
const $_POST: NodeJS.Dict<any> = $_REQUEST.method === 'POST' ? {} : {};
$_POST;

/**
 * Super global variable.
 * @type {NodeJS.Dict<any>}
 */
const $_SERVER: NodeJS.Dict<any> = {
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
const $_SESSION: NodeJS.Dict<any> = {};
$_SESSION;

/**
 * Gets status code of current page
 * @return {number}
 */
const getStatusCode = function(): Promise<any> {
    WorkerThreads.parentPort?.postMessage({
        func: 'getStatusCode',
    });
    return new Promise(function(resolve, reject) {
        WorkerThreads.parentPort?.once('message', function(message) {
            if (message.func === 'getStatusCode') {
                resolve(message.statusCode);
            }
            reject(new Error('exec: getStatusCode: didn\'t recieve statusCode\n'
                + `    did you 'await ${message.func}()' during the last call?\n`));
        });
    });
}
getStatusCode;

/**
 * Writes status code to response.
 * @param {string} key
 * @param {string} value
 */
const setStatusCode = function(statusCode: number) {
    if ($_SERVER['SENT_HEAD_CHUNK'])
        throw new Error('setStatusCode: function should be placed before all HTML code\n'
            + '    Note: Config.respondInChunks is true');
    if (typeof statusCode !== 'number')
        throw new TypeError('exec: setStatusCode: statusCode should be Number, recieved ' + typeof statusCode);
    WorkerThreads.parentPort?.postMessage({
        func: 'setStatusCode',
        statusCode
    });
}
setStatusCode;

/**
 * Writes headers to response.
 * @param {string} key
 * @param {string} value
 */
const setHeader = function(name: string, value: string) {
    if ($_SERVER['SENT_HEAD_CHUNK'])
        throw new Error('setHeader: function should be placed before all HTML code\n'
            + '    Note: Config.respondInChunks is true');
    if (typeof name !== 'string')
        throw new TypeError('exec: setHeader: name should be String, recieved ' + typeof name);
    if (typeof value !== 'string')
        throw new TypeError('exec: setHeader: value should be String, recieved ' + typeof value);
    WorkerThreads.parentPort?.postMessage({
        func: 'setHeader',
        headerName: name,
        headerValue: value
    });
}
setHeader;

/**
 * Set a cookie to a response.
 * @param {string} name
 * @param {string} value
 */
const setCookie = function(name: string, value: string) {
    if ($_SERVER['SENT_HEAD_CHUNK'])
        throw new Error('setCookie: function should be placed before all HTML code\n'
            + '    Note: Config.respondInChunks is true');
    if (typeof name !== 'string')
        throw new TypeError('exec: setCookie: name should be String, recieved ' + typeof name);
    if (typeof value !== 'string')
        throw new TypeError('exec: setCookie: value should be String, recieved ' + value);
    WorkerThreads.parentPort?.postMessage({
        func: 'setCookie',
        cookieName: name,
        cookieValue: value
    });
}
setCookie;

/**
 * Ends response
 * @param {string | Buffer} data
 * @param {string} encoding
 */
const endResponse = function(data: string | Buffer, encoding?: string) {
    if (typeof data !== 'string' && !(data instanceof Buffer))
        throw new TypeError('exec: endResponse: data should be String or Buffer, recieved ' + typeof data);
    if (![ 'string', 'undefined' ].includes(typeof encoding))
        throw new TypeError('exec: endResponse: encoding should be String, recieved ' + typeof encoding);
    WorkerThreads.parentPort?.postMessage({
        func: 'endResponse',
        data,
        encoding
    });
}
endResponse;

/**
 * Write logs to the console
 */
const Logger = {
    info: function(logMsg: any) {
        WorkerThreads.parentPort?.postMessage({
            func: 'Logger.info',
            logMsg,
        });
    },
    error: function(logMsg: any) {
        WorkerThreads.parentPort?.postMessage({
            func: 'Logger.error',
            logMsg,
        });
    },
    warn: function(logMsg: any) {
        WorkerThreads.parentPort?.postMessage({
            func: 'Logger.warn',
            logMsg,
        });
    },
}
Logger;

/**
 * Displays server information to the webpage.
 */
const nodejsinfo = function() {
    WorkerThreads.parentPort?.postMessage({
        func: 'nodejsinfo',
    });
}
nodejsinfo;

/**
 * Displays server information to the webpage.
 */
const jshpinfo = function() {
    nodejsinfo();
}
jshpinfo;

/**
 * Writes some data directly to response
 * @param {any} buffer Data to write
 */
const writeToResponse = function(data: string | Buffer) {
    if (typeof data !== 'string' && !(data instanceof Buffer))
        throw new TypeError('exec: writeToResponse: data should be String or Buffer, recieved ' + typeof data);
    WorkerThreads.parentPort?.postMessage({
        func: 'writeToResponse',
        body: data
    });
}
writeToResponse;

/**
 * Echoes a string.
 * @param {string} str text/HTML string to echo.
 */
const echo = function(str: any): string {
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
    WorkerThreads.parentPort?.postMessage({
        func: 'echo',
        body: str
    });
    return str;
}
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
    echo: function(str: any, color?: string): string {
        if (typeof str === 'object' && !Array.isArray(str))
            throw new TypeError('exec: Message.echo: output shouldn\'t be an object');
        if (![ 'string', 'undefined' ].includes(typeof color) && !Array.isArray(str))
            throw new TypeError('exec: Message.echo: color should be String, recieved ' + typeof color);
        return echo(MsgBox.info(str, color));
    },

    /**
     * Shows a message highlighted by a 'yellow' colored border.
     * @param {string} str Message.
     * @return {string} HTML string enclosed within a <pre>..
     */
    warn: function(str: any): string {
        if (typeof str === 'object' && !Array.isArray(str))
            throw new TypeError('exec: Message.error: output shouldn\'t be an object');
        return echo(MsgBox.warn(str));
    },

    /**
     * Shows a message highlighted by a 'tomato' colored border.
     * @param {string} str Message.
     * @return {string} HTML string enclosed within a <pre>..
     */
    error: function(str: any): string {
        if (typeof str === 'object' && !Array.isArray(str))
            throw new TypeError('exec: Message.error: output shouldn\'t be an object');
        setStatusCode(500);
        return echo(MsgBox.error(str));
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
    read: function(filePath: string, callback: (error: any) => any): Buffer | null {
        if (typeof filePath !== 'string')
            throw new TypeError('exec: File.read: filePath should be String, recieved ' + typeof filePath);
        if (![ 'function', 'undefined' ].includes(typeof callback))
            throw new TypeError('exec: File.read: callback should be Function, recieved ' + typeof callback);
        if (!filePath.startsWith($_RES_ROOT))
            filePath = PATH.join($_RES_ROOT, filePath);
        try {
            const data: Buffer = FS.readFileSync(filePath);
            return data;
        } catch (error) {
            if (callback) {
                callback(error as any);
                return null;
            }
            Message.error('exec: File.read: jshp file error\n' + (error as Error).stack);
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
    write: function(filePath: string, data: string | Buffer, options: any, callback: (error: any) => void) {
        if (typeof filePath !== 'string')
            throw new TypeError('exec: File.write: filePath should be String, recieved ' + typeof filePath);
        if (typeof filePath !== 'string' && !(data instanceof Buffer))
            throw new TypeError('exec: File.write: data should be String or Buffer, recieved ' + typeof data);
        if (![ 'function', 'undefined' ].includes(typeof callback))
            throw new TypeError('exec: File.write: callback should be Function, recieved ' + typeof callback);
        if (!filePath.startsWith($_RES_ROOT))
            filePath = PATH.join($_RES_ROOT, filePath);
        if (!options)
            options.flag = 'a';
        if (!callback) callback = function(error: any) {
            Message.error('exec: File.write: jshp file error\n' + error.stack);
            setStatusCode(500);
        }
        FS.writeFile(filePath, data, options, callback as FS.NoParamCallback);
    }
};
File;

const ResponseCode = {

    /**
     * Get a list of response codes with their status messages.
     * @return {NodeJS.Dict<any>}
     */
    list: function(): NodeJS.Dict<any> {
        return getStatusMessageList();
    },

    /**
     * Get status messages of a response code.
     * @param {number} statusCode
     * @return {string}
     */
    getMessage: function(statusCode: number): string {
        if (typeof statusCode !== 'number')
            throw new TypeError('exec: ResponseCode.getMessage: statusCode should be Number, recived ' + typeof statusCode);
        return getStatusMessage(statusCode);
    }
}
ResponseCode;

/**
 * Special server functions.
 * These functions have direct control over server operations.
 */
const Server = {

    /**
     * Reloads config data from config.json
     */
    reloadConfig: function(): Promise<any> {
        WorkerThreads.parentPort?.postMessage({
            func: 'Server.reloadConfig',
        });
        return new Promise(function(resolve, reject) {
            WorkerThreads.parentPort?.once('message', function(message) {
                if (message.func === 'Server.reloadConfig') {
                    $_CONFIG.srcMapping = message.config;
                    resolve(message.config);
                } else
                    reject(new Error('exec: Server.reloadConfig: didn\'t recieve config data\n'
                        + `    did you 'await ${message.func}()' during the last call?\n`));
            });
        });
    },

    /**
     * Recompile a single file
     * @param {string} sourcePath Path to source file
     */
    fileCompile: function(sourcePath: string): Promise<any> {
        if (typeof sourcePath !== 'string')
            throw new TypeError('exec: Server.fileCompile: sourcePath should be String, recieved ' + typeof sourcePath);
        WorkerThreads.parentPort?.postMessage({
            func: 'Server.fileCompile',
            path: sourcePath
        });
        return new Promise(function(resolve, reject) {
            WorkerThreads.parentPort?.once('message', function(message) {
                if (message.func === 'Server.fileCompile') {
                    $_CONFIG.srcMapping = message.srcMapping;
                    resolve(message.srcMapping);
                } else
                    reject(new Error('exec: Server.fileCompile: didn\'t recieve srcMapping data\n'
                        + `    did you 'await ${message.func}()' during the last call?\n`));
            });
        });
    },

    /**
     * Recompile sources
     * @param {string} specificPath Optional, path to file that'll get compiled
     */
    recompile: function(): Promise<any> {
        WorkerThreads.parentPort?.postMessage({
            func: 'Server.recompile',
        });
        return new Promise(function(resolve, reject) {
            WorkerThreads.parentPort?.once('message', function(message) {
                if (message.func === 'Server.recompile') {
                    $_CONFIG.srcMapping = message.srcMapping;
                    resolve(message.srcMapping);
                } else
                    reject(new Error('exec: Server.recompile: didn\'t recieve srcMapping data\n'
                        + `    did you 'await ${message.func}()' during the last call?\n`));
            });
        });
    },

    /**
     * Puts response hash to header X-Response-Hash
     * @param {string} func Optional, hashing function to be used
     */
    putResHash: function(func?: string) {
        if (!func)
            func = 'md5';

        WorkerThreads.parentPort?.postMessage({
            func: 'Server.putResHash',
            hashFunc: func,
        });
    },
}
Server;

/**
 * Runs JavaScript code within JSHP tags.
 */
(async function() {

    // stores executable code path
    let codePath: string = '';

    // stores executable code
    let execCode: string = '';

    // get raw code for hot compilation, return on failure
    if ($_CONFIG.hotCompile) try {
        execCode = String(FS.readFileSync($_REQUEST.path));
        try {
            await Server.fileCompile($_REQUEST.path);
            codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
            execCode = String(FS.readFileSync(codePath));
        } catch (error) {
            Message.error('exec: hotCompile: jshp file error\n'
                + CleanMsg.runtimeError(String((error as Error).stack), $_REQUEST.url || ''));
            return;
        }
    } catch (error) {
        Message.error((error as Error).stack || '');
        return;
    }

    // try to get executable code otherwise
    if (!$_CONFIG.hotCompile) try {
        codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
        execCode = String(FS.readFileSync(codePath));
    } catch (error) {
        try {
            // fallback to raw code if compiled code not found
            Logger.warn('fallback to ' + $_REQUEST.path);
            await Server.fileCompile($_REQUEST.path);
            codePath = $_CONFIG.srcMapping[$_SERVER['REQUEST_URI']];
            execCode = String(FS.readFileSync(codePath));
        } catch (error) {
            Message.error('exec: fallback compile: jshp file error\n'
                + CleanMsg.runtimeError(String((error as Error).stack), $_REQUEST.url || ''));
            return;
        }
    }

    try {
        // execute code
        eval(execCode);
    } catch (error) {
        /* on syntax error, require the path, which will throw the syntax
         * error and allow it to be traceable.
         * Then catch the error, and through some string manipulation, create
         * a user-friendly error message.
         */
        const absCodePath: string = PATH.resolve(codePath);
        if (codePath && error instanceof SyntaxError) try {
            require(absCodePath);
        } catch (e) {
            const error: any = e as any;
            let stackTrace: string = error.stack;
            let cutoffIndex: number = stackTrace.indexOf('\n    at');
            if (cutoffIndex < 0)
                cutoffIndex = error.stack.length;
            stackTrace = stackTrace.substring(0, cutoffIndex)

            // replaces certain character with certain others
            stackTrace = CleanMsg.syntaxError(stackTrace, { absCodePath, uri: $_SERVER['REQUEST_URI'] });

            Message.error('exec: eval: jshp file error\n'
                + stackTrace);
            return;
        }
        Message.error('exec: eval: jshp file error\n'
            + CleanMsg.runtimeError(String((error as Error).stack), $_REQUEST.url || ''));
    }
})();
