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
const fs = __importStar(require("fs"));
const general_1 = require("../common/general");
const ErrCodes = __importStar(require("../common/errcodes"));
class Logger {
    /**
     * A logger instance is meant to be created for every new server request.
     * A logger instance can't be passed to worker_threads, nor can it be stringified.
     * @param {NodeJS.Dict<any>} this.CONFIG Server this.CONFIG object
     * @param {http.IncomingMessage} req Server request
     * @param {http.ServerResponse} res Server response
     */
    constructor(config, req, res) {
        this.CONFIG = config;
        this.REQ = req;
        this.RES = res;
    }
    /**
     * @param {string} type Type of log (info, error, warn)
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    log(type, msg, nextLineLog = true) {
        const remoteAddress = (0, general_1.getRemoteAddress)(this.REQ);
        type = type.toUpperCase();
        const statusCode = Number.isNaN(this.RES.statusCode) ? '' : `${this.RES.statusCode} `;
        const method = Number.isNaN(this.RES.statusCode) ? this.REQ.method + ' ' : '';
        let log = `[${(0, general_1.getLongDateTime)()}] ${type} ${remoteAddress}`;
        // flag that hides req/res information
        if (nextLineLog)
            log += ` ${statusCode}${method}${this.REQ.url}`;
        // all this coz objects need to be serialized before writing
        if ((typeof msg).toLowerCase() === 'object' && msg.stack)
            msg = String(msg.stack);
        else if ((typeof msg).toLowerCase() === 'object')
            try {
                msg = JSON.stringify(msg);
            }
            catch (error) {
                msg = String(msg);
            }
        else if (msg)
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
        if (msg)
            log += '\n    ' + msg.replace(/\n/g, '\n    ');
        // prints log based on what type it is, info, error, warning
        if (type[0] === 'E')
            console.error(log);
        else if (type[0] === 'W')
            console.warn(log);
        else
            console.log(log);
        if (this.CONFIG.logPath)
            fs.appendFile(this.CONFIG.logPath, log + '\n', function (error) {
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
    info(req, res, msg = undefined, nextLineLog) {
        this.REQ = req;
        this.RES = res;
        this.log('info', msg, nextLineLog);
    }
    /**
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    error(req, res, msg = undefined, nextLineLog) {
        this.REQ = req;
        this.RES = res;
        this.log('error', msg, nextLineLog);
    }
    /**
     * @param {any} msg Log to print
     * @param {boolean} nextLineLog If true (default), shows request information and displays logs in next line. If false, displays message in 1 line.
     */
    warn(req, res, msg = undefined, nextLineLog) {
        this.REQ = req;
        this.RES = res;
        this.log('warn', msg, nextLineLog);
    }
}
exports.default = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvbG9nZ2VyL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdiLHVDQUF5QjtBQUV6QiwrQ0FBc0U7QUFDdEUsNkRBQStDO0FBRS9DLE1BQU0sTUFBTTtJQU1SOzs7Ozs7T0FNRztJQUNILFlBQVksTUFBd0IsRUFBRSxHQUF5QixFQUFFLEdBQXdCO1FBQ3JGLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDbkIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxHQUFHLENBQUMsSUFBWSxFQUFFLEdBQVEsRUFBRSxjQUF1QixJQUFJO1FBRW5ELE1BQU0sYUFBYSxHQUFXLElBQUEsMEJBQWdCLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpELElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDMUIsTUFBTSxVQUFVLEdBQVcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsQ0FBQztRQUM5RixNQUFNLE1BQU0sR0FBVyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RGLElBQUksR0FBRyxHQUFXLElBQUksSUFBQSx5QkFBZSxHQUFFLEtBQUssSUFBSSxJQUFJLGFBQWEs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