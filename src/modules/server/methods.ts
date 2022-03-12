'use strict';

import { HTTPRequest } from '../../@types/all';

import * as n_static from 'node-static';
import * as http from 'http';

import Logger from '../logger/logger';
import * as Runner from './runner';

let Config: NodeJS.Dict<any> = {};
let ResRoot: string = '';
let Logs: Logger;

let NodeStaticServer: n_static.Server;

export const initMethods = function(config: NodeJS.Dict<any>, logs: Logger) {
    Config = config;
    ResRoot = config.resRoot;
    Logs = logs;
    NodeStaticServer = new n_static.Server(ResRoot);
    Runner.initRunner(Config, Logs);
}

export const GET = function(req: HTTPRequest, res: http.ServerResponse) {

    const reqPath: string = req.path;

    /* If a jshp file is requested parse it and respond with the result.
     */
    if ((function() {
        for (const ext of Config.execExtensions)
            if (reqPath.endsWith(ext)) return true;
        return false;
    })()) {
        Runner.startExec(req, res);
        return;
    }
    // Serves static files, i.e. files that cannot be executed.
    NodeStaticServer.serve(req, res);
    Logs.info(req, res);
}

export const POST = function(req: HTTPRequest, res: http.ServerResponse) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
}

export const PUT = function(req: HTTPRequest, res: http.ServerResponse) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
}

export const DELETE = function(req: HTTPRequest, res: http.ServerResponse) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
}

export const OPTIONS = function(req: HTTPRequest, res: http.ServerResponse) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
}
