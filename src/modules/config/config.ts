'use strict';

import * as path from 'path';
import * as fs from 'fs';

import { validateConfig } from './validateconfig';

/* note that config object can't have objects of depth > 2,
 * where the config object itself is at depth 0
 */
export const DefConfig: NodeJS.Dict<any> = {
    "defaultHeaders": {},
    "logPath": "/server.log",
    "inlineLogLength": 96,
    "indexFile": "index.jshp.html",
    "timeoutSec": 10,
    "execExtensions": [ ".jshp.html" ],
    "trailingSlashes": true,
    "noExtension": [ ".jshp.html" ],
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
    "rewrites": [
    ],
    "redirects": [
    ],
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
export const loadConfig = function(resRoot: string): NodeJS.Dict<any> {
    if (!fs.existsSync(path.join(resRoot, 'config.json')))
        return { ...DefConfig, resRoot };
    let configData: NodeJS.Dict<any> = {};
    const rawData = fs.readFileSync(path.join(resRoot, 'config.json'));
    try {
        configData = JSON.parse(String(rawData));
    } catch (error) {
        throw 'config: error in config.json\n    ' + error;
    }
    const config: NodeJS.Dict<any> = { resRoot, ...DefConfig, ...configData };
    validateConfig(config);
    return config;
}
