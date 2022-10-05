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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvbG9nZ2VyL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHYix1Q0FBeUI7QUFFekIsK0NBQXNFO0FBQ3RFLDZEQUErQztBQUUvQyxNQUFNLE1BQU07SUFNUjs7Ozs7O09BTUc7SUFDSCxZQUFZLE1BQXdCLEVBQUUsR0FBeUIsRUFBRSxHQUF3QjtRQUNyRixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsR0FBRyxDQUFDLElBQVksRUFBRSxHQUFRLEVBQUUsY0FBdUIsSUFBSTtRQUVuRCxNQUFNLGFBQWEsR0FBVyxJQUFBLDBCQUFnQixFQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV6RCxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sVUFBVSxHQUFXLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUM7UUFDOUYsTUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN0RixJQUFJLEdBQUcsR0FBVyxJQUFJLElBQUEseUJBQWUsR0FBRSxLQUFLLElBQUksSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUVwRSxzQ0FBc0M7UUFDdEMsSUFBSSxXQUFXO1lBQ1gsR0FBRyxJQUFJLElBQUksVUFBVSxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRXBELDREQUE0RDtRQUM1RCxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxRQUFRLElBQUksR0FBRyxDQUFDLEtBQUs7WUFDcEQsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUTtZQUFFLElBQUk7Z0JBQ2xELEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzdCO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ1osR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNyQjthQUFNLElBQUksR0FBRztZQUNWLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRWxCLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFYjs7V0FFRztRQUNILElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ25HLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLEdBQUcsR0FBRyxFQUFFLENBQUM7U0FDWjtRQUVELG9GQUFvRjtRQUNwRixJQUFJLEdBQUc7WUFBRSxHQUFHLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXhELDREQUE0RDtRQUM1RCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsQixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHO1lBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7O1lBRWxCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFckIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87WUFBRSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsVUFBUyxLQUFLO2dCQUNsRixJQUFJLENBQUMsS0FBSztvQkFDTixPQUFPO2dCQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7T0FHRztJQUNILElBQUksQ0FBQyxHQUF5QixFQUFFLEdBQXdCLEVBQUUsTUFBVyxTQUFTLEVBQUUsV0FBcUI7UUFDakcsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsS0FBSyxDQUFDLEdBQXlCLEVBQUUsR0FBd0IsRUFBRSxNQUFXLFNBQVMsRUFBRSxXQUFxQjtRQUNsRyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxJQUFJLENBQUMsR0FBeUIsRUFBRSxHQUF3QixFQUFFLE1BQVcsU0FBUyxFQUFFLFdBQXFCO1FBQ2pHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdkMsQ0FBQztDQUNKO0FBRUQsa0JBQWUsTUFBTSxDQUFDIn0=