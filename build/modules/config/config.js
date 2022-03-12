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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL21vZHVsZXMvY29uZmlnL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLHFEQUFrRDtBQUVsRDs7R0FFRztBQUNVLFFBQUEsU0FBUyxHQUFxQjtJQUN2QyxnQkFBZ0IsRUFBRSxFQUFFO0lBQ3BCLFNBQVMsRUFBRSxhQUFhO0lBQ3hCLGlCQUFpQixFQUFFLEVBQUU7SUFDckIsV0FBVyxFQUFFLGlCQUFpQjtJQUM5QixZQUFZLEVBQUUsRUFBRTtJQUNoQixnQkFBZ0IsRUFBRSxDQUFFLFlBQVksQ0FBRTtJQUNsQyxpQkFBaUIsRUFBRSxJQUFJO0lBQ3ZCLGFBQWEsRUFBRSxDQUFFLFlBQVksQ0FBRTtJQUMvQixhQUFhLEVBQUU7UUFDWCxnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLGNBQWMsRUFBRSxJQUFJO0tBQ3ZCO0lBQ0QsVUFBVSxFQUFFLFdBQVc7SUFDdkIsWUFBWSxFQUFFLEtBQUs7SUFDbkIsZ0JBQWdCLEVBQUUsS0FBSztJQUN2QixXQUFXLEVBQUU7UUFDVCxnQkFBZ0I7UUFDaEIsZUFBZTtRQUNmLGVBQWU7S0FDbEI7SUFDRCxVQUFVLEVBQUUsRUFDWDtJQUNELFdBQVcsRUFBRSxFQUNaO0lBQ0QsVUFBVSxFQUFFLEVBQUU7SUFDZCxpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLFlBQVksRUFBRSxHQUFHO0lBQ2pCLGVBQWUsRUFBRSxDQUFDO0NBQ3JCLENBQUM7QUFFRjs7OztHQUlHO0FBQ0ksTUFBTSxVQUFVLEdBQUcsVUFBUyxPQUFlO0lBQzlDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2pELHVDQUFZLGlCQUFTLEtBQUUsT0FBTyxJQUFHO0lBQ3JDLElBQUksVUFBVSxHQUFxQixFQUFFLENBQUM7SUFDdEMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ25FLElBQUk7UUFDQSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUM1QztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1osTUFBTSxvQ0FBb0MsR0FBRyxLQUFLLENBQUM7S0FDdEQ7SUFDRCxNQUFNLE1BQU0saUNBQXVCLE9BQU8sSUFBSyxpQkFBUyxHQUFLLFVBQVUsQ0FBRSxDQUFDO0lBQzFFLElBQUEsK0JBQWMsRUFBQyxNQUFNLENBQUMsQ0FBQztJQUN2QixPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUE7QUFiWSxRQUFBLFVBQVUsY0FhdEIifQ==