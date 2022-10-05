'use strict';

import { HTTPRequest } from '../../@types/all';

import * as http from 'http';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';

import { loadConfig } from '../config/config';
import Logger from '../logger/logger';
import { getLongDateTime, regexTestStr } from '../common/general';
import * as HTTPMethods from './methods';
import * as ErrCodes from '../common/errcodes';

let Host: string = '';
let Port: number = 0;

let Config: NodeJS.Dict<any> = {};
let Logs: Logger;
let ResRoot: string = '';
let LogPath: string = '';

/**
 * Removes ../ and multiple //////
 * @param {string} str The path
 * @return {string}
 */
const cleanPath = function(str: string): string {
    return str.replace(/\.{2,}/g, '').replace(/\/{2,}/, '/');
}

/**
 * A wrapper around regexTestStr.
 * This function passes the caret and dollar flags to the function.
 * @param {string[]} arr Array of regex strings
 * @param {string} string to match
 * @returns {string|undefined} The regex that made 1st match, undefined otherwise.
 */
const configuredRegexTestStr = function(arr: string[], str: string): string | undefined {
    return regexTestStr(arr, str, Config.matchConfig.matchFromStart, Config.matchConfig.matchTillEnd);
}

/**
 * Get path to errFile if it exists, otherwise res.end with error code.
 */
const putHTTPError = function(req: HTTPRequest, res: http.ServerResponse, logmsg?: string) {
    Logs.error(req, res, logmsg);
    const errFilepath: string = Config.errFiles[String(res.statusCode)];
    if (Config.errFiles[String(res.statusCode)]
    &&  fs.existsSync(path.join(ResRoot, errFilepath))) {
        req.url = errFilepath + req.queryString;
        req.path = path.join(ResRoot, errFilepath);
        HTTPMethods.initMethods(Config, Logs);
        HTTPMethods.GET(req, res);
    } else
        res.end();
}

const serverCallback = function(req: HTTPRequest, res: http.ServerResponse) {

    let reqPath: string = '';
    let reqQueryString: string = '';
    let reqSysPath: string = '';

    // loads pathname from request
    reqPath = url.parse(req.url || '', true).pathname || '/';

    // get query string from request
    reqQueryString = (function(): string {
        if (req.url?.indexOf('?') === -1)
            return '';
        return req.url?.substring(req.url?.indexOf('?')) || '';
    })();

    // replaces ../ with /, and excess ///// with a single /
    reqPath = cleanPath(reqPath);

    res.statusCode = NaN;

    // custom properties
    req.query = url.parse(req.url || '', true).query;
    req.queryString = reqQueryString;

    // new Logger instance
    Logs = new Logger(Config, req, res);

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
        let regex: string | undefined = '';

        /* If rewrite exist in Config, change reqPath to rewritten name
         * This will cause the server to respond with data from the rewritten path
         */
        if (regex = configuredRegexTestStr(Config.rewriteList, reqPath)) {
            const rwrt: NodeJS.Dict<any> = Config.rewrites[Config.rewriteList.indexOf(regex)]
            reqPath = rwrt.src;
            req.url = reqPath + reqQueryString;
        }

        /* If redirect exist in Config, change reqPath to redirected name
         */
        else if (regex = configuredRegexTestStr(Config.redirectList, reqPath)) {
            const rdir: NodeJS.Dict<any> = Config.redirects[Config.redirectList.indexOf(regex)]
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
            let possiblePath: string = reqPath + ext;
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
    } catch (err) {
        const error: any = err;
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
}

const listenerCallback = function() {
    const log: string = `[${getLongDateTime()}] JSHP Server (${Host || '0.0.0.0'}:${Port}) started`;
    console.log(log);
    if (Config.logPath) fs.appendFile(LogPath, log + '\n', function(error) {
        if (!error)
            return;
        console.error(error);
        process.exit(ErrCodes.ELOGRFAIL);
    });
}

/**
 * Reloads config data from config.json
 * @param {boolean} loadFile Used internally, default true, if false, loads config data from file and overwrites current Config object.
 */
export const reloadConfig = function(loadFile: boolean = true) {

    const configBackup: NodeJS.Dict<any> = Config;

    if (loadFile)
        Config = loadConfig(ResRoot);

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
}

export const start = function(config: NodeJS.Dict<any>) {

    Config = config;
    Host = config.host;
    Port = config.port;
    ResRoot = config.resRoot;

    // loadFile value is passed false as file was already loaded in index.ts
    reloadConfig(false);
    const server: http.Server = http.createServer(serverCallback);
    if (Host)
        server.listen(Port, Host, listenerCallback);
    else
        server.listen(Port, listenerCallback);
}
