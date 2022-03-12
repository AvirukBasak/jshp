'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgBox = exports.CleanMsg = void 0;
const compiler_1 = require("../compiler/compiler");
/**
 * Takes a string and a color and returns an html message.
 * These messages normally report errors and warnings.
 * @param {string} str The message.
 * @param {string} color HTML color for the border.
 */
const generateHTMLMsg = function (str, color = 'dodgerblue') {
    return ('<head>'
        + '<meta name="viewport" content="width=device-width, height=device-height">'
        + '</head>'
        + '<pre style="'
        + 'width: calc(100% - 30px);'
        + 'max-height: 50vh;'
        + `border: 1.5px solid ${color};`
        + 'border-radius: 5px;'
        + 'font-size: 0.8rem;'
        + 'line-height: 1.2rem;'
        + 'color: #333;'
        + 'background-color: #eee;'
        + 'display: block;'
        + 'margin: 20px auto 20px;'
        + 'padding: 10px;'
        + 'overflow: auto; ">'
        + str.replace(/[\u00A0-\u9999<>\&]/g, function (ch) {
            return '&#' + ch.charCodeAt(0) + ';';
        })
        + '</pre>');
};
/**
 * Functions to clean up error messages.
 */
exports.CleanMsg = {
    /**
     * Removes unnecessary information, directory path to the module, etc.
     * @param {string} str The string to be cleaned
     */
    runtimeError: function (str, url) {
        return str.replace(new RegExp(process.cwd() + '/', 'g'), '')
            .replace(/^ {4}at.*eval.*(:\d+:\d+).*(\n)?/gm, '    at jshp file (' + url.split('?')[0] + '$1)$2')
            .replace(/^ {4}at( .*)? [^(jshp file)]*.*\/(.*)\.js(:\d+:\d+).*(\n)?/gm, '    at$1 (jshp:$2$3)$4');
    },
    /**
     * Cleans up SyntaxError generated during JS execution, if any.
     * Clean up basically means, it converts the JS code to readable JSHP code at the line where the error occurred.
     * It also removes excess white spaces from beginning of a line.
     * @param {string} errorMsg The SyntaxError message
     * @param {NodeJS.Doct<any>} data Some data necessary for the cleanup. Must include property uri = request.uri and absCodePath = fully resolved path of code where error happened.
     */
    syntaxError: function (errorMsg, data) {
        if (!data.absCodePath || typeof data.uri !== 'string')
            throw new Error('data.absCodePath should be string, passed: ' + typeof data.absCodePath);
        if (!data.uri || typeof data.uri !== 'string')
            throw new Error('data.uri should be string, passed: ' + typeof data.uri);
        const regexG = function (regexStr) {
            regexStr = regexStr.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            return new RegExp(regexStr, 'g');
        };
        errorMsg = errorMsg
            .replace(regexG(data.absCodePath), 'at jshp file: ' + data.uri)
            .replace(regexG(compiler_1.initAssignTagOpen), '        <?( ')
            .replace(regexG(compiler_1.finalAssignTagClose), ' )?>       ')
            .replace(/Missing \} in template expression/g, 'Missing closing \')?>\'')
            .replace(regexG(compiler_1.initLegacyTagOpen), ' <?jshp ')
            .replace(regexG(compiler_1.initAltLegacyTagOpen), ' <? ')
            .replace(regexG(compiler_1.finalLegacyTagClose), ' ?>     ')
            .replace(regexG(compiler_1.initTagOpen), '<script jshp>')
            .replace(regexG(compiler_1.finalTagClose), '</script>')
            .replace(regexG('(async function() { echo(` '), '                           ');
        const firstIndexOfReport = errorMsg.indexOf('\n') + 1;
        const nextIndexOfReport = errorMsg.indexOf('\n', firstIndexOfReport) + 1;
        let istLineIndexWhereSpacesEnd = firstIndexOfReport, sndLineIndexWhereSpacesEnd = nextIndexOfReport;
        for (; errorMsg[istLineIndexWhereSpacesEnd] === ' ' && errorMsg[sndLineIndexWhereSpacesEnd] === ' '; istLineIndexWhereSpacesEnd++, sndLineIndexWhereSpacesEnd++) { }
        let output = errorMsg.substring(0, firstIndexOfReport) + '    '
            + errorMsg.substring(istLineIndexWhereSpacesEnd, nextIndexOfReport) + '    '
            + errorMsg.substring(sndLineIndexWhereSpacesEnd);
        return output;
    },
};
/**
 * Print a clean message to the HTML page.
 * Useful for writing error and warning messages.
 */
exports.MsgBox = {
    /**
     * Generates an info box in HTML from a string.
     * @param {string} str The message.
     * @param {string} color HTML color for the border. Default is Dodgerblue
     */
    info: function (str, color) {
        return generateHTMLMsg(str, color);
    },
    /**
     * Generates a warning box in HTML from a string.
     * @param {string}
     */
    warn: function (str) {
        return generateHTMLMsg(str, '#f28500');
    },
    /**
     * Generates an error box in HTML from a string.
     * @param {string}
     */
    error: function (str) {
        return generateHTMLMsg(str, 'tomato');
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9vdXRwdXQvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixtREFROEI7QUFFOUI7Ozs7O0dBS0c7QUFDSCxNQUFNLGVBQWUsR0FBRyxVQUFTLEdBQVcsRUFBRSxRQUFnQixZQUFZO0lBQ3RFLE9BQU8sQ0FDRCxRQUFRO1VBQ0osMkVBQTJFO1VBQy9FLFNBQVM7VUFDVCxjQUFjO1VBQ1YsMkJBQTJCO1VBQzNCLG1CQUFtQjtVQUNuQix1QkFBdUIsS0FBSyxHQUFHO1VBQy9CLHFCQUFxQjtVQUNyQixvQkFBb0I7VUFDcEIsc0JBQXNCO1VBQ3RCLGNBQWM7VUFDZCx5QkFBeUI7VUFDekIsaUJBQWlCO1VBQ2pCLHlCQUF5QjtVQUN6QixnQkFBZ0I7VUFDaEIsb0JBQW9CO1VBQ3BCLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsVUFBUyxFQUFFO1lBQzNDLE9BQU8sSUFBSSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3pDLENBQUMsQ0FBQztVQUNOLFFBQVEsQ0FDYixDQUFDO0FBQ04sQ0FBQyxDQUFBO0FBR0Q7O0dBRUc7QUFDVSxRQUFBLFFBQVEsR0FBcUI7SUFFdEM7OztPQUdHO0lBQ0gsWUFBWSxFQUFFLFVBQVMsR0FBVyxFQUFFLEdBQVc7UUFDM0MsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ2pELE9BQU8sQ0FBQyxvQ0FBb0MsRUFBRSxvQkFBb0IsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQzthQUNqRyxPQUFPLENBQUMs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