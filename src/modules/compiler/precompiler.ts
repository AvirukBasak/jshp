'use strict';

import * as path from 'path';
import * as fs from 'fs';

import * as FileSystem from '../common/filesystem';
import * as Compiler from './compiler';

let arrFilePaths: string[] = [];

/**
 * Scans the resource root recursively, compiles any file that matches Config.execExtensions, and saves compiled file in resourseRoot/Config.buildDir/fileName.exec.js
 * @param {NodeJS.Dict<any>} config The config object
 * @param {string} resRoot Root to server resources
 * @return A mapping of request paths and compiled files
 */
const runCompiler = function(config: NodeJS.Dict<any>, verboseFlag?: boolean): NodeJS.Dict<any> {

    let resRoot: string = config.resRoot;
    const buildPath: string = path.join(resRoot, config.buildDir);

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
        let dirname: string = path.dirname(filePath);
        const fileName: string = path.basename(filePath);

        // this is done because next up, resRoot is removed from dirname using String.replace
        if (resRoot.endsWith('/'))
            dirname += dirname.endsWith('/')  ? '' : '/';
        else
            resRoot += '/';

        // replace removes first match of resRoot from dirname, leaving only the part wrt to resRoot
        const writeDir: string = path.join(buildPath, dirname.replace(resRoot, ''));

        // get raw code
        const rawCode: string = String(fs.readFileSync(filePath, 'utf8'));

        let execCode: string = '';

        // compile to executable JavaScript
        execCode = Compiler.compile(rawCode, filePath);

        // if path doesn't exist, create it
        if (!fs.existsSync(writeDir))
            FileSystem.mkdirp(writeDir);

        // write executable to that path, if no error happened
        const writePath: string = path.join(writeDir, fileName + '.exec.js');
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
    const mapPath: string = path.join(buildPath, 'srcMapping.json');
    fs.writeFileSync(mapPath, JSON.stringify(config.srcMapping, null, 4) + '\n');

    return config.srcMapping;
}

/**
 * Scans the resource root, compiles any file that matches Config.execExtensions, and saves compiled file in resourseRoot/Config.buildDir/fileName.exec.js
 * @param {NodeJS.Dict<any>} config The config object, adds srcMapping to it
 * @param {string} resRoot Root to server resources
 * @return A mapping of request paths and compiled files
 */
export const preCompile = function(config: NodeJS.Dict<any>, verboseFlag?: boolean): NodeJS.Dict<any> {
    // list paths to resources recursively
    arrFilePaths = FileSystem.lsRecursively(config.resRoot);
    return runCompiler(config, verboseFlag);
}

/**
 * Compiles a single file of it matches Config.execExtensions, and saves compiled file in resourseRoot/Config.buildDir/fileName.exec.js
 * @param {NodeJS.Dict<any>} config The config object, adds srcMapping to it
 * @param {string} filePath Path to file
 * @return A mapping of request paths and compiled files
 */
export const fileCompile = function(config: NodeJS.Dict<any>, filePath: string, verboseFlag?: boolean): NodeJS.Dict<any> {
    arrFilePaths = [ filePath ];
    return runCompiler(config, verboseFlag);
}
