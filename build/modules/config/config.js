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
exports.loadConfig = exports.DefConfig = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const validateconfig_1 = require("./validateconfig");
/* note that config object can't have objects of depth > 2,
 * where the config object itself is at depth 0
 */
exports.DefConfig = {
    "defaultHeaders": {},
    "logPath": "/server.log",
    "inlineLogLength": 96,
    "indexFile": "index.jshp.html",
    "timeoutSec": 10,
    "execExtensions": [".jshp.html"],
    "trailingSlashes": true,
    "noExtension": [".jshp.html"],
    "matchConfig": {
        "matchFromStart": true,
        "matchTillEnd": true
    },
    "buildDir": "/.builds/",
    "hotCompile": false,
    "compileOnStart": false,
    "forbidden": [
        "/config\\.json",
        "/server\\.log",
        "/\\.builds/.*"
    ],
    "rewrites": [],
    "redirects": [],
    "errFiles": {},
    "respondInChunks": false,
    "chunkLimit": 200,
    "chunksPerEcho": 2,
};
/**
 * Loads default server configuration data from config.json.
 * If resource root is undefined, returns DefConfig
 * @param {string} resRoot Root to server resources
 */
const loadConfig = function (resRoot) {
    if (!fs.existsSync(path.join(resRoot, 'config.json')))
        return Object.assign(Object.assign({}, exports.DefConfig), { resRoot });
    let configData = {};
    const rawData = fs.readFileSync(path.join(resRoot, 'config.json'));
    try {
        configData = JSON.parse(String(rawData));
    }
    catch (error) {
        throw 'config: error in config.json\n    ' + error;
    }
    const config = Object.assign(Object.assign({ resRoot }, exports.DefConfig), configData);
    (0, validateconfig_1.validateConfig)(config);
    return config;
};
exports.loadConfig = loadConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvY29uZmlnL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUV6QixxREFBa0Q7QUFFbEQ7O0dBRUc7QUFDVSxRQUFBLFNBQVMsR0FBcUI7SUFDdkMsZ0JBQWdCLEVBQUUsRUFBRTtJQUNwQixTQUFTLEVBQUUsYUFBYTtJQUN4QixpQkFBaUIsRUFBRSxFQUFFO0lBQ3JCLFdBQVcsRUFBRSxpQkFBaUI7SUFDOUIsWUFBWSxFQUFFLEVBQUU7SUFDaEIsZ0JBQWdCLEVBQUUsQ0FBRSxZQUFZLENBQUU7SUFDbEMsaUJBQWlCLEVBQUUsSUFBSTtJQUN2QixhQUFhLEVBQUUsQ0FBRSxZQUFZLENBQUU7SUFDL0IsYUFBYSxFQUFFO1FBQ1gsZ0JBQWdCLEVBQUUsSUFBSTtRQUN0QixjQUFjLEVBQUUsSUFBSTtLQUN2QjtJQUNELFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLFlBQVksRUFBRSxLQUFLO0lBQ25CLGdCQUFnQixFQUFFLEtBQUs7SUFDdkIsV0FBVyxFQUFFO1FBQ1QsZ0JBQWdCO1FBQ2hCLGVBQWU7UUFDZixlQUFlO0tBQ2xCO0lBQ0QsVUFBVSxFQUFFLEVBQ1g7SUFDRCxXQUFXLEVBQUUsRUFDWjtJQUNELFVBQVUsRUFBRSxFQUFFO0lBQ2QsaUJBQWlCLEVBQUUsS0FBSztJQUN4QixZQUFZLEVBQUUsR0FBRztJQUNqQixlQUFlLEVBQUUsQ0FBQztDQUNyQixDQUFDO0FBRUY7Ozs7R0FJRztBQUNJLE1BQU0sVUFBVSxHQUFHLFVBQVMsT0FBZTtJQUM5QyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRCx1Q0FBWSxpQkFBUyxLQUFFLE9BQU8sSUFBRztJQUNyQyxJQUFJLFVBQVUsR0FBcUIsRUFBRSxDQUFDO0lBQ3RDLE1BQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUNuRSxJQUFJO1FBQ0EsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDNUM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLE1BQU0sb0NBQW9DLEdBQUcsS0FBSyxDQUFDO0tBQ3REO0lBQ0QsTUFBTSxNQUFNLGlDQUF1QixPQUFPLElBQUssaUJBQVMsR0FBSyxVQUFVLENBQUUsQ0FBQztJQUMxRSxJQUFBLCtCQUFjLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkIsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFBO0FBYlksUUFBQSxVQUFVLGNBYXRCIn0=