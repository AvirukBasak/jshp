'use strict';

import {
    initTagOpen,
    finalTagClose,
    initLegacyTagOpen,
    initAltLegacyTagOpen,
    finalLegacyTagClose,
    initAssignTagOpen,
    finalAssignTagClose,
} from '../compiler/compiler';

/**
 * Takes a string and a color and returns an html message.
 * These messages normally report errors and warnings.
 * @param {string} str The message.
 * @param {string} color HTML color for the border.
 */
const generateHTMLMsg = function(str: string, color: string = 'dodgerblue'): string {
    return (
          '<head>'
        +     '<meta name="viewport" content="width=device-width, height=device-height">'
        + '</head>'
        + '<pre style="'
        +     'width: calc(100% - 30px);'
        +     'max-height: 50vh;'
        +     `border: 1.5px solid ${color};`
        +     'border-radius: 5px;'
        +     'font-size: 0.8rem;'
        +     'line-height: 1.2rem;'
        +     'color: #333;'
        +     'background-color: #eee;'
        +     'display: block;'
        +     'margin: 20px auto 20px;'
        +     'padding: 10px;'
        +     'overflow: auto; ">'
        +     str.replace(/[\u00A0-\u9999<>\&]/g, function(ch) {
                  return '&#' + ch.charCodeAt(0) + ';';
              })
        + '</pre>'
    );
}

/**
 * Functions to clean up error messages.
 */
export const CleanMsg: NodeJS.Dict<any> = {

    /**
     * Removes unnecessary information, directory path to the module, etc.
     * @param {string} str The string to be cleaned
     */
    runtimeError: function(str: string, url: string): string {
        url;
        return str.replace(new RegExp(process.cwd() + '/', 'g'), '')
                  .replace(/^ {4}at eval.*\n/gm, '')
                  .replace(/\(eval.*anonymous>/gm, '(<anonymous>')
                  .replace(/\$SLASH\$/gm, '/')
                  .replace(/\$DOT\$/gm, '.')
                  .replace(/^ {4}(((?!at jshp file).)*) \(\/.*\/(.*?)\.js(:\d+:\d+)\)/gm, '    $1 (jshp:$3$4)')
                  .replace(/^ {4}at \/.*\/(.*?)\.js(:\d+:\d+)/gm, '    at <anonymous> (jshp:$1$2)')
    },

    /**
     * Cleans up SyntaxError generated during JS execution, if any.
     * Clean up basically means, it converts the JS code to readable JSHP code at the line where the error occurred.
     * It also removes excess white spaces from beginning of a line.
     * @param {string} errorMsg The SyntaxError message
     * @param {NodeJS.Doct<any>} data Some data necessary for the cleanup. Must include property uri = request.uri and absCodePath = fully resolved path of code where error happened.
     */
    syntaxError: function(errorMsg: string, data: NodeJS.Dict<any>): string {
        if (!data.absCodePath || typeof data.uri !== 'string')
            throw new Error('data.absCodePath should be string, passed: ' + typeof data.absCodePath);
        if (!data.uri || typeof data.uri !== 'string')
            throw new Error('data.uri should be string, passed: ' + typeof data.uri);
        const regexG = function(regexStr: string) {
            regexStr = regexStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return new RegExp(regexStr, 'g');
        }
        errorMsg = errorMsg
            .replace(regexG(data.absCodePath), 'at jshp file: ' + data.uri)
            .replace(regexG(initAssignTagOpen), '        <?( ')
            .replace(regexG(finalAssignTagClose), ' )?>       ')
            .replace(/Missing \} in template expression/g, 'Missing closing \')?>\'')
            .replace(regexG(initLegacyTagOpen), ' <?jshp ')
            .replace(regexG(initAltLegacyTagOpen), ' <? ')
            .replace(regexG(finalLegacyTagClose), ' ?>     ')
            .replace(regexG(initTagOpen), '<script jshp>')
            .replace(regexG(finalTagClose), '</script>')
            .replace(regexG('const .* = async function() { echo(` '), '');

        const firstIndexOfReport: number = errorMsg.indexOf('\n') + 1;
        const nextIndexOfReport: number = errorMsg.indexOf('\n', firstIndexOfReport) + 1;

        let istLineIndexWhereSpacesEnd = firstIndexOfReport,
            sndLineIndexWhereSpacesEnd = nextIndexOfReport;
        for ( ; errorMsg[istLineIndexWhereSpacesEnd] === ' ' && errorMsg[sndLineIndexWhereSpacesEnd] === ' '; istLineIndexWhereSpacesEnd++, sndLineIndexWhereSpacesEnd++) {}
        let output: string = errorMsg.substring(0, firstIndexOfReport) + '    '
                           + errorMsg.substring(istLineIndexWhereSpacesEnd, nextIndexOfReport) + '    '
                           + errorMsg.substring(sndLineIndexWhereSpacesEnd);
        return output;
    },
}

/**
 * Print a clean message to the HTML page.
 * Useful for writing error and warning messages.
 */
export const MsgBox: NodeJS.Dict<any> = {

    /**
     * Generates an info box in HTML from a string.
     * @param {string} str The message.
     * @param {string} color HTML color for the border. Default is Dodgerblue
     */
    info: function(str: string, color?: string): string {
        return generateHTMLMsg(str, color);
    },

    /**
     * Generates a warning box in HTML from a string.
     * @param {string}
     */
    warn: function(str: string): string {
        return generateHTMLMsg(str, '#f28500');
    },

    /**
     * Generates an error box in HTML from a string.
     * @param {string}
     */
    error: function(str: string): string {
        return generateHTMLMsg(str, 'tomato');
    },
}
