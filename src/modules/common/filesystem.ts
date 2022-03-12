'use strict';

import * as path from 'path';
import * as fs from 'fs';

/**
 * List everything in a directory
 * @param {string} directory
 */
export const ls = function(directory: string) {
    return fs.readdirSync(directory);
}

/**
 * Recursively list all files in a directory
 * @param {string} directory
 */
export const lsRecursively = function(directory: string, listOfPaths: string[] = []) {
    const lsDir: string[] = fs.readdirSync(directory);
    for (const file of lsDir) {
        const filePath: string = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory())
            lsRecursively(filePath, listOfPaths);
        else
            listOfPaths.push(filePath);
    }
    return listOfPaths;
}

/**
 * Recursively create directories
 * @param {string} dirPath Path to directory
 */
export const mkdirp = function(dirPath: string) {
    const dirname: string = path.dirname(dirPath);
    if (!fs.existsSync(dirname))
        mkdirp(dirname);
    if (!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath);
}

/**
 * Create an empty file
 * @param {string} filePath Path to file
 */
export const touch = function(filePath: string) {
    if (!fs.existsSync(filePath))
        writeFile(filePath, '');
}

/**
 * Overwrite a file
 * @param {string} filePath Path to file
 * @param {string|Buffer} data Data to write
 */
export const writeFile = function(filePath: string, data: Buffer | string = '') {
    const dirPath: string = path.dirname(filePath);
    mkdirp(dirPath);
    fs.writeFileSync(filePath, data);
}

/**
 * Append to a file
 * @param {string} filePath Path to file
 * @param {string|Buffer} data Data to write
 */
export const appendFile = function(filePath: string, data: Buffer | string = '') {
    const dirPath: string = path.dirname(filePath);
    mkdirp(dirPath);
    fs.appendFileSync(filePath, data);
}
