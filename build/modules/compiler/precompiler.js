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
exports.fileCompile = exports.preCompile = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const FileSystem = __importStar(require("../common/filesystem"));
const Compiler = __importStar(require("./compiler"));
let arrFilePaths = [];
/**
 * Scans the resource root recursively, compiles any file that matches Config.execExtensions, and saves compiled file in resourseRoot/Config.buildDir/fileName.exec.js
 * @param {NodeJS.Dict<any>} config The config object
 * @param {string} resRoot Root to server resources
 * @return A mapping of request paths and compiled files
 */
const runCompiler = function (config, verboseFlag) {
    let resRoot = config.resRoot;
    const buildPath = path.join(resRoot, config.buildDir);
    config.srcMapping = config.srcMapping || {};
    if (!fs.existsSync(buildPath))
        FileSystem.mkdirp(buildPath);
    // Loop through all those resource paths
    for (const filePath of arrFilePaths) {
        // if extension isn't present in execExtensions, skip iteration
        if (!(function () {
            for (const ext of config.execExtensions)
                if (filePath.endsWith(ext))
                    return true;
            return false;
        })()) {
            if (verboseFlag)
                console.log('ignoring ' + filePath);
            continue;
        }
        // get necessary path details
        let dirname = path.dirname(filePath);
        const fileName = path.basename(filePath);
        // this is done because next up, resRoot is removed from dirname using String.replace
        if (resRoot.endsWith('/'))
            dirname += dirname.endsWith('/') ? '' : '/';
        else
            resRoot += '/';
        // replace removes first match of resRoot from dirname, leaving only the part wrt to resRoot
        const writeDir = path.join(buildPath, dirname.replace(resRoot, ''));
        // get raw code
        const rawCode = String(fs.readFileSync(filePath, 'utf8'));
        let execCode = '';
        // compile to executable JavaScript
        execCode = Compiler.compile(rawCode, filePath);
        // if path doesn't exist, create it
        if (!fs.existsSync(writeDir))
            FileSystem.mkdirp(writeDir);
        // write executable to that path, if no error happened
        const writePath = path.join(writeDir, fileName + '.exec.js');
        fs.writeFileSync(writePath, execCode);
        config.srcMapping[filePath.replace(resRoot, '/')] = writePath;
        if (verboseFlag)
            console.log('compiled ' + filePath);
    }
    // clear the list
    arrFilePaths = [];
    if (Object.keys(config.srcMapping).length < 1)
        console.warn('compiler warning: no source file found\n'
            + '    have you specified your source file extensions in config.json execExtensions?');
    // writes config.srcMapping to srcMapping.json
    const mapPath = path.join(buildPath, 'srcMapping.json');
    fs.writeFileSync(mapPath, JSON.stringify(config.srcMapping, null, 4) + '\n');
    return config.srcMapping;
};
/**
 * Scans the resource root, compiles any file that matches Config.execExtensions, and saves compiled file in resourseRoot/Config.buildDir/fileName.exec.js
 * @param {NodeJS.Dict<any>} config The config object, adds srcMapping to it
 * @param {string} resRoot Root to server resources
 * @return A mapping of request paths and compiled files
 */
const preCompile = function (config, verboseFlag) {
    // list paths to resources recursively
    arrFilePaths = FileSystem.lsRecursively(config.resRoot);
    return runCompiler(config, verboseFlag);
};
exports.preCompile = preCompile;
/**
 * Compiles a single file of it matches Config.execExtensions, and saves compiled file in resourseRoot/Config.buildDir/fileName.exec.js
 * @param {NodeJS.Dict<any>} config The config object, adds srcMapping to it
 * @param {string} filePath Path to file
 * @return A mapping of request paths and compiled files
 */
const fileCompile = function (config, filePath, verboseFlag) {
    arrFilePaths = [filePath];
    return runCompiler(config, verboseFlag);
};
exports.fileCompile = fileCompile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9jb21waWxlci9wcmVjb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsMkNBQTZCO0FBQzdCLHVDQUF5QjtBQUV6QixpRUFBbUQ7QUFDbkQscURBQXVDO0FBRXZDLElBQUksWUFBWSxHQUFhLEVBQUUsQ0FBQztBQUVoQzs7Ozs7R0FLRztBQUNILE1BQU0sV0FBVyxHQUFHLFVBQVMsTUFBd0IsRUFBRSxXQUFxQjtJQUV4RSxJQUFJLE9BQU8sR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ3JDLE1BQU0sU0FBUyxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUU5RCxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDO0lBRTVDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQztRQUN6QixVQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRWpDLHdDQUF3QztJQUN4QyxLQUFLLE1BQU0sUUFBUSxJQUFJLFlBQVksRUFBRTtRQUVqQywrREFBK0Q7UUFDL0QsSUFBSSxDQUFDLENBQUM7WUFDRixLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxjQUFjO2dCQUNuQyxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDO29CQUN0QixPQUFPLElBQUksQ0FBQztZQUNwQixPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ0YsSUFBSSxXQUFXO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQ3hDLFNBQVM7U0FDWjtRQUVELDZCQUE2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