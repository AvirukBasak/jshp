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
exports.OPTIONS = exports.DELETE = exports.PUT = exports.POST = exports.GET = exports.initMethods = void 0;
const n_static = __importStar(require("node-static"));
const Runner = __importStar(require("./runner"));
let Config = {};
let ResRoot = '';
let Logs;
let NodeStaticServer;
const initMethods = function (config, logs) {
    Config = config;
    ResRoot = config.resRoot;
    Logs = logs;
    NodeStaticServer = new n_static.Server(ResRoot);
    Runner.initRunner(Config, Logs);
};
exports.initMethods = initMethods;
const GET = function (req, res) {
    const reqPath = req.path;
    /* If a jshp file is requested parse it and respond with the result.
     */
    if ((function () {
        for (const ext of Config.execExtensions)
            if (reqPath.endsWith(ext))
                return true;
        return false;
    })()) {
        Runner.startExec(req, res);
        return;
    }
    // Serves static files, i.e. files that cannot be executed.
    NodeStaticServer.serve(req, res);
    Logs.info(req, res);
};
exports.GET = GET;
const POST = function (req, res) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
};
exports.POST = POST;
const PUT = function (req, res) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
};
exports.PUT = PUT;
const DELETE = function (req, res) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
};
exports.DELETE = DELETE;
const OPTIONS = function (req, res) {
    res.statusCode = 405;
    res.end();
    Logs.info(req, res);
};
exports.OPTIONS = OPTIONS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL3NlcnZlci9tZXRob2RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJYixzREFBd0M7QUFJeEMsaURBQW1DO0FBRW5DLElBQUksTUFBTSxHQUFxQixFQUFFLENBQUM7QUFDbEMsSUFBSSxPQUFPLEdBQVcsRUFBRSxDQUFDO0FBQ3pCLElBQUksSUFBWSxDQUFDO0FBRWpCLElBQUksZ0JBQWlDLENBQUM7QUFFL0IsTUFBTSxXQUFXLEdBQUcsVUFBUyxNQUF3QixFQUFFLElBQVk7SUFDdEUsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNoQixPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUN6QixJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ1osZ0JBQWdCLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQTtBQU5ZLFFBQUEsV0FBVyxlQU12QjtBQUVNLE1BQU0sR0FBRyxHQUFHLFVBQVMsR0FBZ0IsRUFBRSxHQUF3QjtJQUVsRSxNQUFNLE9BQU8sR0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDO0lBRWpDO09BQ0c7SUFDSCxJQUFJLENBQUM7UUFDRCxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjO1lBQ25DLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7UUFDM0MsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQyxDQUFDLEVBQUUsRUFBRTtRQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLE9BQU87S0FDVjtJQUNELDJEQUEyRDtJQUMzRCxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQWpCWSxRQUFBLEdBQUcsT0FpQmY7QUFFTSxNQUFNLElBQUksR0FBRyxVQUFTLEdBQWdCLEVBQUUsR0FBd0I7SUFDbkUsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDckIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBSlksUUFBQSxJQUFJLFFBSWhCO0FBRU0sTUFBTSxHQUFHLEdBQUcsVUFBUyxHQUFnQixFQUFFLEdBQXdCO0lBQ2xFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQUpZLFFBQUEsR0FBRyxPQUlmO0FBRU0sTUFBTSxNQUFNLEdBQUcsVUFBUyxHQUFnQixFQUFFLEdBQXdCO0lBQ3JFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQUpZLFFBQUEsTUFBTSxVQUlsQjtBQUVNLE1BQU0sT0FBTyxHQUFHLFVBQVMsR0FBZ0IsRUFBRSxHQUF3QjtJQUN0RSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUNyQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QixDQUFDLENBQUE7QUFKWSxRQUFBLE9BQU8sV0FJbkIifQ==