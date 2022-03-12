#!/usr/bin/env node

'use strict';

// Installs souce map support to map JS runtime line numbers to TS file.
import * as SourceMapSupport from 'source-map-support';
SourceMapSupport.install();

import * as path from 'path';
import * as fs from 'fs';

import { PACKAGE } from './modules/common/package';
import * as PreCompiler from './modules/compiler/precompiler';
import * as Config from './modules/config/config';
import * as Server from './modules/server/server';
import * as ErrCodes from './modules/common/errcodes';
import * as FileSystem from './modules/common/filesystem';

let DEBUG: boolean = false;

/**
 * validates resRoot by checking if it exists. Then cleans up the resource root.
 * @param {string} resRoot
 * @return {string} Cleaned up resRoot
 */
const validateAndCleanResRoot = function(resRoot: string): string {
    if (!resRoot) {
        console.error('jshp: unspecified path');
        process.exit(ErrCodes.ENSPCFDPATH);
    }
    if (!fs.lstatSync(resRoot).isDirectory()) {
        console.error('jshp: path isn\'t a directory');
        process.exit(ErrCodes.EPISNTDIR);
    }
    resRoot = resRoot.endsWith('/') ? resRoot : resRoot + '/';
    return path.normalize(resRoot);
}

/**
 * Evaluates and executes CLI args.
 * @param {string[]} args CLI arguments.
 */
const runInCLI = function(args: string[]) {

    // If option is empty, 'h' or 'help'.
    if ([ , 'h', 'help' ].includes(args[2]))
        console.log('USAGE: jshp [option] [args]\n'
            + '  help                      Display this message\n'
            + '  init [path]               Create default server files\n'
            + '  compile [path]            Parse JSHP codes to JS from [path]\n'
            + '  compile --verbose [path]  List source files\n'
            + '  serve [host:port] [path]  Serve files from [path]\n'
            + '  serve [:port] [path]      [host] defauts to 0.0.0.0\n'
            + '  version                   Display version information');

    // If option is 'v' or 'version'.
    else if ([ 'v', 'version' ].includes(args[2]))
        console.log(`JSHP - JavaScript Hypertext Preprocessor\n`
            + `Authors: ${PACKAGE.author}\n`
            + `Version: ${PACKAGE.version}\n`
            + `License: ${PACKAGE.license}`);

    else if ([ 'i', 'init' ].includes(args[2])) {

        if (!args[3]) {
            console.error('jshp: compile: no arguments provided\n'
                + '    try using \'help\' option');
            process.exit(ErrCodes.ENOARG);
        }

        const resRoot: string = validateAndCleanResRoot(args[3]);
        const config: NodeJS.Dict<any> = Config.loadConfig(resRoot);

        // generate config file
        const configPath: string = path.join(resRoot, 'config.json');
        if (!fs.existsSync(configPath))
            FileSystem.writeFile(configPath, JSON.stringify(Config.DefConfig, null, 4) + '\n');

        // generate src map path
        const srcMapPath: string = path.join(resRoot, '.builds/srcMapping.json');
        if (!fs.existsSync(srcMapPath))
            FileSystem.writeFile(srcMapPath, '{}');

        // generate index file
        const indexFilePath: string = path.join(resRoot, config.indexFile);
        if (!fs.existsSync(indexFilePath))
            FileSystem.writeFile(indexFilePath,
                  '<!DOCTYPE html>\n'
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
                + '</html>\n'
            );

        // generate server log
        const logPath = path.join(resRoot, config.logPath);
        if (!fs.existsSync(logPath))
            FileSystem.touch(logPath);
    }

    // If option is 'c' or 'compile'.
    else if ([ 'c', 'compile' ].includes(args[2])) {

        if (!args[3]) {
            console.error('jshp: compile: no arguments provided\n'
                + '    try using \'help\' option');
            process.exit(ErrCodes.ENOARG);
        }

        let verboseFlag: boolean = false;
        let resRoot: string = '';

        for (let i = 3; i <= 5; i++) {
            if (args[i]?.startsWith('-')) {
                if ([ '-v', '--verbose' ].includes(args[i]))
                    verboseFlag = true;
                else if ([ '-d', '--debug' ].includes(args[i]))
                    DEBUG = true;
                else {
                    console.error(`jshp: compile: invalid option '${args[i]}'\n`
                        + `    try using 'help' option`);
                    process.exit(ErrCodes.EINVLOPT);
                }
            } else if (args[i])
                resRoot = args[i];
        }

        resRoot = validateAndCleanResRoot(resRoot);
        const config: NodeJS.Dict<any> = Config.loadConfig(resRoot);

        // a source mapping maps requested paths to corresponding compiled code paths
        PreCompiler.preCompile(config, verboseFlag);
    }

    // If option is 's' or 'server'.
    else if ([ 's', 'serve' ].includes(args[2])) {

        if (!args[3]) {
            console.error('jshp: serve: no arguments provided\n'
                + '    try using \'help\' option');
            process.exit(ErrCodes.ENOARG);
        }

        let verboseFlag: boolean = false;

        let hostname: string = '';
        let host: string = '';
        let port: number = 0;
        let resRoot: string = '';

        for (let i = 3; i <= 5; i++) {
            if (args[i]?.startsWith('-')) {
                if ([ '-v', '--verbose' ].includes(args[i]))
                    verboseFlag = true;
                else if ([ '-d', '--debug' ].includes(args[i]))
                    DEBUG = true;
                else {
                    console.error(`jshp: serve: invalid option '${args[i]}'\n`
                        + `    try using 'help' option`);
                    process.exit(ErrCodes.EINVLOPT);
                }
            } else if (args[i]?.includes(':') && (args[i]?.match(/:/g) || []).length === 1) {
                hostname = args[i];
                host = hostname.split(':')[0];
                port = Number(hostname.split(':')[1]);
            } else if (args[i])
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
        const config: NodeJS.Dict<any> = { host: host || '0.0.0.0', port, ...Config.loadConfig(resRoot) };

        // compiles code if required config value is set
        if (config.compileOnStart)
            // a source mapping maps requested paths to corresponding compiled code paths
            PreCompiler.preCompile(config, verboseFlag);

        const srcMapPath: string = path.join(config.resRoot, config.buildDir, 'srcMapping.json')

        try {
            const data: Buffer = fs.readFileSync(srcMapPath);
            config.srcMapping = JSON.parse(String(data));
        } catch (error) {
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
}

// This checks if script was run from the shell.
const runsInShell = require.main === module;
if (runsInShell) try {
    runInCLI(process.argv);
} catch (error) {
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
export const jshp = function(arg2: string, arg3: string, arg4: string, arg5: string) {
    try {
        runInCLI([ '', '', arg2, arg3, arg4, arg5 ]);
    } catch (error) {
        if (DEBUG)
            console.error(error);
        else
            console.error('jshp: ' + String(error));
        process.exit(ErrCodes.EGENFAIL);
    }
}
