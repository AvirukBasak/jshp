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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExec = exports.initRunner = void 0;
const WorkerThreads = __importStar(require("worker_threads"));
const url = __importStar(require("url"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const package_1 = require("../common/package");
const general_1 = require("../common/general");
const messages_1 = require("../output/messages");
const PreCompiler = __importStar(require("../compiler/precompiler"));
const server_1 = require("./server");
let Config = {};
let Logs;
const initRunner = function (config, logs) {
    Config = config;
    Logs = logs;
};
exports.initRunner = initRunner;
/**
 * Writes data to body in chunks and sends them off.
 * @param {http.ServerResponse} res Response to be sent
 * @param {string} data Data to be written
 */
// TODO: implement compression
const writeChunkedData = function (res, data) {
    const chunkLength = data.length > Config.chunkLimit ? Math.trunc(data.length / Config.chunksPerEcho) : Config.chunkLimit;
    const chunkingRegex = new RegExp('(.|\\t|\\n|\\r|\\s|\\f){1,' + chunkLength + '}', 'g');
    const dataArray = data.match(chunkingRegex);
    if (!dataArray)
        return;
    for (const chunk of dataArray)
        res.write(String(chunk));
};
/**
 * Starts the parser in a seperate thread.
 * @param {HTTP.IncomingMessage} req The http request object. This object MUST contain 'method' and 'url' attributes.
 * @param {HTTP.ServerResponse} res The server response.
 */
const startExec = function (req, res) {
    const reqPath = req.path;
    let responseBody = '';
    // if true, certain functions will not run
    let sentHeadChunk = false;
    // puts hash of response to X-Response-Hash header before ending the response
    let putResHash = '' || undefined;
    // This is the data that is to be sent to the thread.
    const workerData = {
        config: Config,
        req: {
            cookies: {},
            headers: req.headers,
            method: req.method,
            path: reqPath,
            uri: url.parse(req.url || '', true).pathname || '/',
            query: req.query,
            queryString: req.queryString,
            remoteAddress: (0, general_1.getRemoteAddress)(req),
            url: req.url,
        }
    };
    const worker = new WorkerThreads.Worker(path.join(__dirname, '../exec/exec.js'), { workerData });
    undefined;
    // This timeout terminates the worker after 10s and echoes an error message.
    const timeout = setTimeout(function () {
        worker.terminate();
        res.statusCode = 500;
        const errorMsg = 'runner: jshp file error\n'
            + `    execution timed out after ${Config.timeoutSec} seconds\n`
            + '    please check your jshp code for lengthy operations';
        responseBody += messages_1.MsgBox.error(errorMsg);
        Logs.error(req, res, errorMsg);
    }, Config.timeoutSec * 1000);
    // necessary headers
    res.setHeader('Server', package_1.SERVER);
    res.setHeader('Content-Type', 'text/html');
    // An interface for communication b/w runner and worker
    worker.on('message', function (message) {
        switch (message.func) {
            case 'getStatusCode': {
                worker.postMessage({
                    func: 'getStatusCode',
                    statusCode: res.statusCode,
                });
                break;
            }
            case 'echo': {
                if (!Config.respondInChunks) {
                    responseBody += message.body;
                    break;
                }
                // sends head and disables further writes to head
                if (!sentHeadChunk) {
                    res.writeHead(res.statusCode);
                    sentHeadChunk = true;
                }
                writeChunkedData(res, message.body);
                break;
            }
            case 'setHeader': {
                if (sentHeadChunk)
                    break;
                res.setHeader(message.headerName, message.headerValue);
                break;
            }
            case 'setCookie': {
                if (sentHeadChunk)
                    break;
                message.cookieName;
                message.cookieValue;
                break;
            }
            case 'setStatusCode': {
                if (sentHeadChunk)
                    break;
                res.statusCode = message.statusCode;
                break;
            }
            case 'writeToResponse': {
                if (!message.body)
                    break;
                writeChunkedData(res, message.body);
                break;
            }
            case 'endResponse': {
                res.end(message.data, message.encoding);
                break;
            }
            case 'Logger.info': {
                Logs.info(req, res, message.logMsg, false);
                break;
            }
            case 'Logger.error': {
                Logs.error(req, res, message.logMsg, false);
                break;
            }
            case 'Logger.warn': {
                Logs.warn(req, res, message.logMsg, false);
                break;
            }
            case 'nodejsinfo': {
                /* If func is jshpinfo, respond with data returned by 'nodejs-info' module.
                 * The wierd backup of console.error is taken to hide the following error message:
                 *
                 * Handlebars: Access has been denied to resolve the property "headers" because it is not an "own property" of its parent.
                 *     You can add a runtime option to disable the check or this warning:
                 *     See https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access for details.
                 *
                 * The error message comes from the 'handlebars' module, which is used by 'nodejs-info' module,
                 * which inturn is used by this function. The error isn't anything serious.
                 */
                const consoleErrBkp = console.error;
                console.error = function () { };
                const data = require('nodejs-info')(req) + '<br>';
                if (Config.respondInChunks)
                    writeChunkedData(res, data);
                else
                    responseBody += data;
                console.error = consoleErrBkp;
                break;
            }
            case 'Server.reloadConfig': {
                const configBackup = Config;
                try {
                    (0, server_1.reloadConfig)();
                    Logs.warn(req, res, 'runner: config data reloaded', false);
                }
                catch (error) {
                    res.statusCode = 500;
                    const errorMsg = 'runner: Server.reloadConfig: reload failed\n'
                        + error + '\n'
                        + 'fallback to previous config data';
                    Logs.error(req, res, errorMsg);
                    responseBody += messages_1.MsgBox.error(messages_1.CleanMsg.runtimeError(errorMsg, req.url || ''));
                    Config = configBackup;
                }
                worker.postMessage({
                    func: 'Server.reloadConfig',
                    config: Config,
                });
                break;
            }
            case 'Server.fileCompile': {
                if (!message.path)
                    break;
                try {
                    if (fs.lstatSync(message.path).isDirectory()) {
                        const errorMsg = 'runner: Server.fileCompile: specified path is a directory';
                        Logs.error(req, res, errorMsg);
                        responseBody += messages_1.MsgBox.error(messages_1.CleanMsg.runtimeError(errorMsg, req.url || ''));
                    }
                    else
                        try {
                            PreCompiler.preCompile(Config);
                            Logs.warn(req, res, 'runner: recompiled ' + message.path, false);
                        }
                        catch (error) {
                            res.statusCode = 500;
                            const errorMsg = 'runner: Server.recompile: jshp file error\n'
                                + error;
                            Logs.error(req, res, errorMsg);
                            responseBody += messages_1.MsgBox.error(messages_1.CleanMsg.runtimeError(errorMsg, req.url || ''));
                        }
                }
                catch (error) {
                    res.statusCode = 500;
                    const errorMsg = 'runner: Server.recompile: compilation failed\n'
                        + error;
                    Logs.error(req, res, errorMsg);
                    responseBody += messages_1.MsgBox.error(messages_1.CleanMsg.runtimeError(errorMsg, req.url || ''));
                }
                worker.postMessage({
                    func: 'Server.fileCompile',
                    srcMapping: Config.srcMapping,
                });
                break;
            }
            case 'Server.recompile': {
                try {
                    PreCompiler.preCompile(Config);
                    Logs.warn(req, res, 'runner: recompiled all sources', false);
                }
                catch (error) {
                    res.statusCode = 500;
                    const errorMsg = 'runner: Server.recompile: jshp file error\n'
                        + error;
                    Logs.error(req, res, errorMsg);
                    responseBody += messages_1.MsgBox.error(messages_1.CleanMsg.runtimeError(errorMsg, req.url || ''));
                }
                worker.postMessage({
                    func: 'Server.recompile',
                    srcMapping: Config.srcMapping,
                });
                break;
            }
            case 'Server.putResHash': {
                putResHash = message.hashFunc;
                break;
            }
            default: {
                throw new Error('runner: invalid message function: ' + message.func);
            }
        }
    });
    worker.on('error', function (error) {
        res.statusCode = 500;
        const errorMsg = 'runner: jshp file error\n'
            + error.stack;
        Logs.error(req, res, errorMsg);
        if (Config.respondInChunks)
            res.write(errorMsg);
        else
            responseBody += messages_1.MsgBox.error(messages_1.CleanMsg.runtimeError(errorMsg, req.url || ''));
    });
    // On worker exit, clear the timeout.
    worker.on('exit', function (exitcode) {
        clearTimeout(timeout);
        if (exitcode) {
            res.statusCode = 500;
            Logs.error(req, res, 'parser exited with ' + exitcode);
        }
        else {
            Logs.info(req, res);
        }
        // end response and return without setting Content-Length as head has already been sent
        if (Config.respondInChunks) {
            res.end();
            return;
        }
        // put content length
        res.setHeader('Content-Length', responseBody.length);
        if (putResHash)
            try {
                const MD5 = require('crypto').createHash(putResHash);
                const hash = String(MD5.update(responseBody).digest('hex'));
                res.setHeader('X-Response-Hash', hash);
            }
            catch (error) {
                res.statusCode = 500;
                responseBody += messages_1.MsgBox.error('runner: Server.putResHash: jshp file error\n'
                    + error);
            }
        res.end(responseBody);
    });
};
exports.startExec = startExec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvc2VydmVyL3J1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJYiw4REFBZ0Q7QUFFaEQseUNBQTJCO0FBQzNCLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFFekIsK0NBQTJDO0FBRTNDLCtDQUFxRDtBQUNyRCxpREFBc0Q7QUFDdEQscUVBQXVEO0FBQ3ZELHFDQUF3QztBQUV4QyxJQUFJLE1BQU0sR0FBcUIsRUFBRSxDQUFDO0FBQ2xDLElBQUksSUFBWSxDQUFDO0FBRVYsTUFBTSxVQUFVLEdBQUcsVUFBUyxNQUF3QixFQUFFLElBQVk7SUFDckUsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQixJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQTtBQUhZLFFBQUEsVUFBVSxjQUd0QjtBQUVEOzs7O0dBSUc7QUFDSCw4QkFBOEI7QUFDOUIsTUFBTSxnQkFBZ0IsR0FBRyxVQUFTLEdBQXdCLEVBQUUsSUFBWTtJQUNwRSxNQUFNLFdBQVcsR0FBVyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDakksTUFBTSxhQUFhLEdBQVcsSUFBSSxNQUFNLENBQUMsNEJBQTRCLEdBQUcsV0FBVyxHQUFHLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNoRyxNQUFNLFNBQVMsR0FBNEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNyRSxJQUFJLENBQUMsU0FBUztRQUNWLE9BQU87SUFDWCxLQUFLLE1BQU0sS0FBSyxJQUFJLFNBQVM7UUFDekIs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