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
                            PreCompiler.fileCompile(Config, message.path);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVubmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvc2VydmVyL3J1bm5lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSWIsOERBQWdEO0FBRWhELHlDQUEyQjtBQUMzQiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLCtDQUEyQztBQUUzQywrQ0FBcUQ7QUFDckQsaURBQXNEO0FBQ3RELHFFQUF1RDtBQUN2RCxxQ0FBd0M7QUFFeEMsSUFBSSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztBQUNsQyxJQUFJLElBQVksQ0FBQztBQUVWLE1BQU0sVUFBVSxHQUFHLFVBQVMsTUFBd0IsRUFBRSxJQUFZO0lBQ3JFLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDaEIsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUE7QUFIWSxRQUFBLFVBQVUsY0FHdEI7QUFFRDs7OztHQUlHO0FBQ0gsOEJBQThCO0FBQzlCLE1BQU0sZ0JBQWdCLEdBQUcsVUFBUyxHQUF3QixFQUFFLElBQVk7SUFDcEUsTUFBTSxXQUFXLEdBQVcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ2pJLE1BQU0sYUFBYSxHQUFXLElBQUksTUFBTSxDQUFDLDRCQUE0QixHQUFHLFdBQVcsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEcsTUFBTSxTQUFTLEdBQTRCLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDckUsSUFBSSxDQUFDLFNBQVM7UUFDVixPQUFPO0lBQ1gsS0FBSyxNQUFNLEtBQUssSUFBSSxTQUFTO1FB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