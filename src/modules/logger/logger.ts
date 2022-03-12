'use strict';

import * as http from 'http';
import * as fs from 'fs';

import { getLongDateTime, getRemoteAddress } from '../common/general';
import * as ErrCodes from '../common/errcodes';

class Logger {

    CONFIG: NodeJS.Dict<any>;
    REQ: http.IncomingMessage;
    RES: http.ServerResponse;

    /**
     * A logger instance is meant to be created for every new server request.
     * A logger instance can't be passed to worker_threads, nor can it be stringified.
     * @param {NodeJS.Dict<any>} this.CONFIG Server this.CONFIG object
     * @param {http.IncomingMessage} req Server request
     * @param {http.ServerResponse} res Server response
     */
    constructor(config: NodeJS.Dict<any>, req: http.IncomingMessage, res: http.ServerResponse) {
        this.CONFIG = config;
        this.REQ = req;
        this.RES = res;
    }

    /**
     * @param {string} type Type of log (info, error, warn)
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    log(type: string, msg: any, nextLineLog: boolean = true) {

        const remoteAddress: string = getRemoteAddress(this.REQ);

        type = type.toUpperCase();
        const statusCode: string = Number.isNaN(this.RES.statusCode) ? '' : `${this.RES.statusCode} `;
        const method: string = Number.isNaN(this.RES.statusCode) ? this.REQ.method + ' ' : '';
        let log: string = `[${getLongDateTime()}] ${type} ${remoteAddress}`;

        // flag that hides req/res information
        if (nextLineLog)
            log += ` ${statusCode}${method}${this.REQ.url}`;

        // all this coz objects need to be serialized before writing
        if ((typeof msg).toLowerCase() === 'object' && msg.stack)
            msg = String(msg.stack);
        else if ((typeof msg).toLowerCase() === 'object') try {
            msg = JSON.stringify(msg);
        } catch (error) {
            msg = String(msg);
        } else if (msg)
            msg = String(msg);
        else
            msg = '';

        /* appends msg to log if nextLineLog is disabled and msg is short,
         * then clears msg so that it doesn't get printed again.
         */
        if (msg && !nextLineLog && msg.length <= this.CONFIG.inlineLogLength && !/[\r\n\f]/.test(String(msg))) {
            log += ' ' + msg;
            msg = '';
        }

        // if msg still is truthy, add a tab to the start of each line of msg and create log
        if (msg) log += '\n    ' + msg.replace(/\n/g, '\n    ');

        // prints log based on what type it is, info, error, warning
        if (type[0] === 'E')
            console.error(log);
        else if (type[0] === 'W')
            console.warn(log);
        else
            console.log(log);

        if (this.CONFIG.logPath) fs.appendFile(this.CONFIG.logPath, log + '\n', function(error) {
            if (!error)
                return;
            console.error(error);
            process.exit(ErrCodes.ELOGRFAIL);
        });
    }

    /**
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    info(req: http.IncomingMessage, res: http.ServerResponse, msg: any = undefined, nextLineLog?: boolean) {
        this.REQ = req;
        this.RES = res;
        this.log('info', msg, nextLineLog);
    }

    /**
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    error(req: http.IncomingMessage, res: http.ServerResponse, msg: any = undefined, nextLineLog?: boolean) {
        this.REQ = req;
        this.RES = res;
        this.log('error', msg, nextLineLog);
    }

    /**
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    warn(req: http.IncomingMessage, res: http.ServerResponse, msg: any = undefined, nextLineLog?: boolean) {
        this.REQ = req;
        this.RES = res;
        this.log('warn', msg, nextLineLog);
    }
}

export default Logger;
