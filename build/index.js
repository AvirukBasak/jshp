#!/usr/bin/env node
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
exports.jshp = void 0;
// Installs souce map support to map JS runtime line numbers to TS file.
const SourceMapSupport = __importStar(require("source-map-support"));
SourceMapSupport.install();
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const package_1 = require("./modules/common/package");
const PreCompiler = __importStar(require("./modules/compiler/precompiler"));
const Config = __importStar(require("./modules/config/config"));
const Server = __importStar(require("./modules/server/server"));
const ErrCodes = __importStar(require("./modules/common/errcodes"));
const FileSystem = __importStar(require("./modules/common/filesystem"));
let DEBUG = false;
/**
 * validates resRoot by checking if it exists. Then cleans up the resource root.
 * @param {string} resRoot
 * @return {string} Cleaned up resRoot
 */
const validateAndCleanResRoot = function (resRoot) {
    if (!resRoot) {
        console.error('jshp: unspecified path');
        process.exit(ErrCodes.ENSPCFDPATH);
    }
    if (resRoot === '.' || resRoot === './') {
        const basename = path.basename(process.cwd());
        process.chdir('../');
        resRoot = basename;
    }
    if (!fs.lstatSync(resRoot).isDirectory()) {
        console.error('jshp: path isn\'t a directory');
        process.exit(ErrCodes.EPISNTDIR);
    }
    resRoot = resRoot.endsWith('/') ? resRoot : resRoot + '/';
    return path.normalize(resRoot);
};
/**
 * Evaluates and executes CLI args.
 * @param {string[]} args CLI arguments.
 */
const runInCLI = function (args) {
    var _a, _b, _c, _d;
    // If option is empty, 'h' or 'help'.
    if ([, 'h', 'help'].includes(args[2]))
        console.log('USAGE: jshp [option] [args]\n'
            + '  help                      Display this message\n'
            + '  init [path]               Create default server files\n'
            + '  compile [path]            Parse JSHP codes to JS from [path]\n'
            + '  compile --verbose [path]  List source files\n'
            + '  serve [host:port] [path]  Serve files from [path]\n'
            + '  serve [:port] [path]      [host] defauts to 0.0.0.0\n'
            + '  version                   Display version information');
    // If option is 'v' or 'version'.
    else if (['v', 'version'].includes(args[2]))
        console.log(`JSHP - JavaScript Hypertext Preprocessor\n`
            + `Authors: ${package_1.PACKAGE.author}\n`
            + `Version: ${package_1.PACKAGE.version}\n`
            + `License: ${package_1.PACKAGE.license}`);
    else if (['i', 'init'].includes(args[2])) {
        if (!args[3]) {
            console.error('jshp: compile: no arguments provided\n'
                + '    try using \'help\' option');
            process.exit(ErrCodes.ENOARG);
        }
        const resRoot = validateAndCleanResRoot(args[3]);
        const config = Config.loadConfig(resRoot);
        // generate config file
        const configPath = path.join(resRoot, 'config.json');
        if (!fs.existsSync(configPath))
            FileSystem.writeFile(configPath, JSON.stringify(Config.DefConfig, null, 4) + '\n');
        // generate src map path
        const srcMapPath = path.join(resRoot, '.builds/srcMapping.json');
        if (!fs.existsSync(srcMapPath))
            FileSystem.writeFile(srcMapPath, '{}');
        // generate index file
        const indexFilePath = path.join(resRoot, config.indexFile);
        if (!fs.existsSync(indexFilePath))
            FileSystem.writeFile(indexFilePath, '<!DOCTYPE html>\n'
                + '<html>\n'
                + '    <head>\n'
                + '        <meta charset="utf-8">\n'
                + '        <meta http-equiv="X-UA-Compatible" content="IE=edge">\n'
                + '        <meta name="keywords" content="<?( keywords )?>">\n'
                + '        <meta name="description" content="<?( description )?>">\n'
                + '        <link rel="manifest" href="<?( manifestPath )?>">\n'
                + '        <meta name="viewport" content="width=device-width, height=device-height, user-scalable=no">\n'
                + '        <meta name="theme-color" content="<?( themeColor )?>">\n'
                + '        <meta name="msapplication-navbutton-color" content="<?( themeColor )?>">\n'
                + '        <meta name="apple-mobile-web-app-capable" content="yes">\n'
                + '        <meta name="apple-mobile-web-app-status-bar-style" content="#075E54">\n'
                + '        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico"/>\n'
                + '        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>\n'
                + '        <title><?( title )?></title>\n'
                + '        <link rel="stylesheet" href="/styles.css">\n'
                + '        <script src="/script.js"></script>\n'
                + '    </head>\n'
                + '    <body>\n'
                + '        <p>Hello, World!</p>\n'
                + '    </body>\n'
                + '</html>\n');
        // generate server log
        const logPath = path.join(resRoot, config.logPath);
        if (!fs.existsSync(logPath))
            FileSystem.touch(logPath);
    }
    // If option is 'c' or 'compile'.
    else if (['c', 'compile'].includes(args[2])) {
        if (!args[3]) {
            console.error('jshp: compile: no arguments provided\n'
                + '    try using \'help\' option');
            process.exit(ErrCodes.ENOARG);
        }
        let verboseFlag = false;
        let resRoot = '';
        for (let i = 3; i <= 5; i++) {
            if ((_a = args[i]) === null || _a === void 0 ? void 0 : _a.startsWith('-')) {
                if (['-v', '--verbose'].includes(args[i]))
                    verboseFlag = true;
                else if (['-d', '--debug'].includes(args[i]))
                    DEBUG = true;
                else {
                    console.error(`jshp: compile: invalid option '${args[i]}'\n`
                        + `    try using 'help' option`);
                    process.exit(ErrCodes.EINVLOPT);
                }
            }
            else if (args[i])
                resRoot = args[i];
        }
        resRoot = validateAndCleanResRoot(resRoot);
        const config = Config.loadConfig(resRoot);
        // a source mapping maps requested paths to corresponding compiled code paths
        PreCompiler.preCompile(config, verboseFlag);
    }
    // If option is 's' or 'server'.
    else if (['s', 'serve'].includes(args[2])) {
        if (!args[3]) {
            console.error('jshp: serve: no arguments provided\n'
                + '    try using \'help\' option');
            process.exit(ErrCodes.ENOARG);
        }
        let verboseFlag = false;
        let hostname = '';
        let host = '';
        let port = 0;
        let resRoot = '';
        for (let i = 3; i <= 5; i++) {
            if ((_b = args[i]) === null || _b === void 0 ? void 0 : _b.startsWith('-')) {
                if (['-v', '--verbose'].includes(args[i]))
                    verboseFlag = true;
                else if (['-d', '--debug'].includes(args[i]))
                    DEBUG = true;
                else {
                    console.error(`jshp: serve: invalid option '${args[i]}'\n`
                        + `    try using 'help' option`);
                    process.exit(ErrCodes.EINVLOPT);
                }
            }
            else if (((_c = args[i]) === null || _c === void 0 ? void 0 : _c.includes(':')) && (((_d = args[i]) === null || _d === void 0 ? void 0 : _d.match(/:/g)) || []).length === 1) {
                hostname = args[i];
                host = hostname.split(':')[0];
                port = Number(hostname.split(':')[1]);
            }
            else if (args[i])
                resRoot = args[i];
        }
        if (!hostname) {
            console.error('jshp: serve: invalid argument\n'
                + '    expected [host:port] or [:port]');
            process.exit(ErrCodes.EINVLARG);
        }
        if (!port) {
            console.error('jshp: serve: unspecified port');
            process.exit(ErrCodes.ENSPCFDPORT);
        }
        resRoot = validateAndCleanResRoot(resRoot);
        const config = Object.assign({ host: host || '0.0.0.0', port }, Config.loadConfig(resRoot));
        // compiles code if required config value is set
        if (config.compileOnStart)
            // a source mapping maps requested paths to corresponding compiled code paths
            PreCompiler.preCompile(config, verboseFlag);
        const srcMapPath = path.join(config.resRoot, config.buildDir, 'srcMapping.json');
        try {
            const data = fs.readFileSync(srcMapPath);
            config.srcMapping = JSON.parse(String(data));
        }
        catch (error) {
            if (config.compileOnStart) {
                console.error('jshp: serve: couldn\'t find srcMapping: ' + srcMapPath + '\n'
                    + '    have you compiled your code?');
                process.exit(ErrCodes.ELOADMAP);
            }
        }
        Server.start(config);
    }
    // For invalid options.
    else {
        console.error(`jshp: error: invalid option '${args[2]}'\n`
            + `    try using 'help' option`);
        process.exit(ErrCodes.EINVLOPT);
    }
};
// This checks if script was run from the shell.
const runsInShell = require.main === module;
if (runsInShell)
    try {
        runInCLI(process.argv);
    }
    catch (error) {
        if (DEBUG)
            console.error(error);
        else
            console.error('jshp: ' + String(error));
        process.exit(ErrCodes.EGENFAIL);
    }
/**
 * If no CLI is present, this function can be imported by another script.
 * This function basically wraps around the actual CLI script, allowing function parameters
 * to be sent to that script.
 * As a result, this function behaves exactly like the CLI.
 *
 * @param {string} option The corresponding CLI option. Valid values are 'help' or 'h', 'serve' or 's' and 'version' or 'v'.
 * @param {string} hostname Use format 'host:port' or ':port'. Example: localhost:8080.
 * @param {string} path The path to server resources
 */
const jshp = function (arg2, arg3, arg4, arg5) {
    try {
        runInCLI(['', '', arg2, arg3, arg4, arg5]);
    }
    catch (error) {
        if (DEBUG)
            console.error(error);
        else
            console.error('jshp: ' + String(error));
        process.exit(ErrCodes.EGENFAIL);
    }
};
exports.jshp = jshp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYix3RUFBd0U7QUFDeEUscUVBQXVEO0FBQ3ZELGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO0FBRTNCLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFFekIsc0RBQW1EO0FBQ25ELDRFQUE4RDtBQUM5RCxnRUFBa0Q7QUFDbEQsZ0VBQWtEO0FBQ2xELG9FQUFzRDtBQUN0RCx3RUFBMEQ7QUFFMUQsSUFBSSxLQUFLLEdBQVksS0FBSyxDQUFDO0FBRTNCOzs7O0dBSUc7QUFDSCxNQUFNLHVCQUF1QixHQUFHLFVBQVMsT0FBZTtJQUNwRCxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3RDO0lBQ0QsSUFBSSxPQUFPLEtBQUssR0FBRyxJQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7UUFDckMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUM5QyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU8sR0FBRyxRQUFRLENBQUM7S0FDdEI7SUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUN0QyxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDcEM7SUFDRCxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxH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