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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9jb21waWxlci9wcmVjb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCLGlFQUFtRDtBQUNuRCxxREFBdUM7QUFFdkMsSUFBSSxZQUFZLEdBQWEsRUFBRSxDQUFDO0FBRWhDOzs7OztHQUtHO0FBQ0gsTUFBTSxXQUFXLEdBQUcsVUFBUyxNQUF3QixFQUFFLFdBQXFCO0lBRXhFLElBQUksT0FBTyxHQUFXLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDckMsTUFBTSxTQUFTLEdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRTlELE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7SUFFNUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFakMsd0NBQXdDO0lBQ3hDLEtBQUssTUFBTSxRQUFRLElBQUksWUFBWSxFQUFFO1FBRWpDLCtEQUErRDtRQUMvRCxJQUFJLENBQUMsQ0FBQztZQUNGLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLGNBQWM7Z0JBQ25DLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7b0JBQ3RCLE9BQU8sSUFBSSxDQUFDO1lBQ3BCLE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDRixJQUFJLFdBQVc7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFDeEMsU0FBUztTQUNaO1FBRUQsNkJBQTZCO1FB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