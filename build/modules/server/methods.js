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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0aG9kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL3NlcnZlci9tZXRob2RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUliLHNEQUF3QztBQUl4QyxpREFBbUM7QUFFbkMsSUFBSSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztBQUNsQyxJQUFJLE9BQU8sR0FBVyxFQUFFLENBQUM7QUFDekIsSUFBSSxJQUFZLENBQUM7QUFFakIsSUFBSSxnQkFBaUMsQ0FBQztBQUUvQixNQUFNLFdBQVcsR0FBRyxVQUFTLE1BQXdCLEVBQUUsSUFBWTtJQUN0RSxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2hCLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ3pCLElBQUksR0FBRyxJQUFJLENBQUM7SUFDWixnQkFBZ0IsR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFBO0FBTlksUUFBQSxXQUFXLGVBTXZCO0FBRU0sTUFBTSxHQUFHLEdBQUcsVUFBUyxHQUFnQixFQUFFLEdBQXdCO0lBRWxFLE1BQU0sT0FBTyxHQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUM7SUFFakM7T0FDRztJQUNILElBQUksQ0FBQztRQUNELEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWM7WUFDbkMsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFBRSxPQUFPLElBQUksQ0FBQztRQUMzQyxPQUFPLEtBQUssQ0FBQztJQUNqQixDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0IsT0FBTztLQUNWO0lBQ0QsMkRBQTJEO0lBQzNELGdCQUFnQixDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBakJZLFFBQUEsR0FBRyxPQWlCZjtBQUVNLE1BQU0sSUFBSSxHQUFHLFVBQVMsR0FBZ0IsRUFBRSxHQUF3QjtJQUNuRSxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQztJQUNyQixHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDVixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN4QixDQUFDLENBQUE7QUFKWSxRQUFBLElBQUksUUFJaEI7QUFFTSxNQUFNLEdBQUcsR0FBRyxVQUFTLEdBQWdCLEVBQUUsR0FBd0I7SUFDbEUsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDckIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBSlksUUFBQSxHQUFHLE9BSWY7QUFFTSxNQUFNLE1BQU0sR0FBRyxVQUFTLEdBQWdCLEVBQUUsR0FBd0I7SUFDckUsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUM7SUFDckIsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDeEIsQ0FBQyxDQUFBO0FBSlksUUFBQSxNQUFNLFVBSWxCO0FBRU0sTUFBTSxPQUFPLEdBQUcsVUFBUyxHQUFnQixFQUFFLEdBQXdCO0lBQ3RFLEdBQUcsQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNWLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3hCLENBQUMsQ0FBQTtBQUpZLFFBQUEsT0FBTyxXQUluQiJ9