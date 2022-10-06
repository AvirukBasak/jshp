'use strict';

import { HTTPRequest } from '../../@types/all';

import * as WorkerThreads from 'worker_threads';
import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import { SERVER } from '../common/package';
import Logger from '../logger/logger';
import { getRemoteAddress } from '../common/general';
import { MsgBox, CleanMsg } from '../output/messages';
import * as PreCompiler from '../compiler/precompiler';
import { reloadConfig } from './server';

let Config: NodeJS.Dict<any> = {};
let Logs: Logger;

export const initRunner = function(config: NodeJS.Dict<any>, logs: Logger) {
    Config = config;
    Logs = logs;
}

/**
 * Writes data to body in chunks and sends them off.
 * @param {http.ServerResponse} res Response to be sent
 * @param {string} data Data to be written
 */
// TODO: implement compression
const writeChunkedData = function(res: http.ServerResponse, data: string) {
    const chunkLength: number = data.length > Config.chunkLimit ? Math.trunc(data.length / Config.chunksPerEcho) : Config.chunkLimit;
    const chunkingRegex: RegExp = new RegExp('(.|\\t|\\n|\\r|\\s|\\f){1,' + chunkLength + '}', 'g');
    const dataArray: RegExpMatchArray | null = data.match(chunkingRegex);
    if (!dataArray)
        return;
    for (const chunk of dataArray)
        res.write(String(chunk));
}

/**
 * Starts the parser in a seperate thread.
 * @param {HTTP.IncomingMessage} req The http request object. This object MUST contain 'method' and 'url' attributes.
 * @param {HTTP.ServerResponse} res The server response.
 */
export const startExec = function(req: HTTPRequest, res: http.ServerResponse) {

    const reqPath: string = req.path;
    let responseBody: string = '';

    // if true, certain functions will not run
    let sentHeadChunk: boolean = false;

    // puts hash of response to X-Response-Hash header before ending the response
    let putResHash: string | undefined = '' || undefined;

    // This is the data that is to be sent to the thread.
    const workerData: NodeJS.Dict<any> = {
        config: Config,
        req: {
            cookies: {},
            headers: req.headers,
            method: req.method,
            path: reqPath,
            uri: url.parse(req.url || '', true).pathname || '/',
            query: req.query,
            queryString: req.queryString,
            remoteAddress: getRemoteAddress(req),
            url: req.url,
        }
    };

    const worker: WorkerThreads.Worker = new WorkerThreads.Worker(path.join(__dirname, '../exec/exec.js'), { workerData });  undefined;

    // This timeout terminates the worker after 10s and echoes an error message.
    const timeout: NodeJS.Timeout = setTimeout(function() {
        worker.terminate();
        res.statusCode = 500;
        const errorMsg: string = 'runner: jshp file error\n'
            + `    execution timed out after ${Config.timeoutSec} seconds\n`
            + '    please check your jshp code for lengthy operations';
        responseBody += MsgBox.error(errorMsg);
        Logs.error(req, res, errorMsg);
    }, Config.timeoutSec * 1000);

    // necessary headers
    res.setHeader('Server', SERVER);
    res.setHeader('Content-Type', 'text/html');

    // An interface for communication b/w runner and worker
    worker.on('message', function(message: NodeJS.Dict<any>) {
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
                console.error = function() {};
                const data: string = require('nodejs-info')(req) + '<br>';
                if (Config.respondInChunks)
                    writeChunkedData(res, data);
                else
                    responseBody += data;
                console.error = consoleErrBkp;
                break;
            }
            case 'Server.reloadConfig': {
                const configBackup: NodeJS.Dict<any> = Config;
                try {
                    reloadConfig();
                    Logs.warn(req, res, 'runner: config data reloaded', false);
                } catch (error) {
                    res.statusCode = 500;
                    const errorMsg: string = 'runner: Server.reloadConfig: reload failed\n'
                        + CleanMsg.runtimeError((error as Error).stack || String(error), req.url || '')
                        + '\nfallback to previous config data';
                    Logs.error(req, res, errorMsg);
                    responseBody += MsgBox.error(errorMsg);
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
                        const errorMsg: string = 'runner: Server.fileCompile: specified path is a directory';
                        Logs.error(req, res, errorMsg);
                        responseBody += MsgBox.error(errorMsg);
                    } else try {
                        PreCompiler.fileCompile(Config, message.path);
                        Logs.warn(req, res, 'runner: recompiled ' + message.path, false);
                    } catch (error) {
                        res.statusCode = 500;
                        const errorMsg: string = 'runner: Server.fileCompile: jshp file error\n'
                            + CleanMsg.runtimeError((error as Error).stack || String(error), req.url || '');
                        Logs.error(req, res, errorMsg);
                        responseBody += MsgBox.error(errorMsg);
                    }
                } catch (error) {
                    res.statusCode = 500;
                    const errorMsg: string = 'runner: Server.fileCompile: compilation failed\n'
                        + CleanMsg.runtimeError((error as Error).stack || String(error), req.url || '');
                    Logs.error(req, res, errorMsg);
                    responseBody += MsgBox.error(errorMsg);
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
                } catch (error) {
                    res.statusCode = 500;
                    const errorMsg: string = 'runner: Server.recompile: jshp file error\n'
                        + CleanMsg.runtimeError((error as Error).stack || String(error), req.url || '');
                    Logs.error(req, res, errorMsg);
                    responseBody += MsgBox.error(errorMsg);
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

    worker.on('error', function(error: Error) {
        res.statusCode = 500;
        const errorMsg: string = 'runner: jshp file error\n'
            + CleanMsg.runtimeError((error as Error).stack, req.url || '');
        Logs.error(req, res, errorMsg);
        if (Config.respondInChunks)
            res.write(errorMsg);
        else
            responseBody += MsgBox.error(errorMsg);
    });

    // On worker exit, clear the timeout.
    worker.on('exit', function(exitcode: number) {

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

        if (putResHash) try {
            const MD5: any = require('crypto').createHash(putResHash);
            const hash: string = String(MD5.update(responseBody).digest('hex'));
            res.setHeader('X-Response-Hash', hash);
        } catch (error) {
            res.statusCode = 500;
            responseBody += MsgBox.error('runner: Server.putResHash: jshp file error\n'
                + error);
        }
        res.end(responseBody);
    });
}
