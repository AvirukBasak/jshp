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
        url;
        return str.replace(new RegExp(process.cwd() + '/', 'g'), '')
            .replace(/^ {4}at eval.*\n/gm, '')
            .replace(/\(eval.*anonymous>/gm, '(<anonymous>')
            .replace(/\$SLASH\$/gm, '/')
            .replace(/\$DOT\$/gm, '.')
            .replace(/^ {4}(((?!at jshp file).)*) \(\/.*\/(.*?)\.js(:\d+:\d+)\)/gm, '    $1 (jshp:$3$4)')
            .replace(/^ {4}at \/.*\/(.*?)\.js(:\d+:\d+)/gm, '    at <anonymous> (jshp:$1$2)');
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
            .replace(regexG('const .* = async function() { echo(` '), '');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9vdXRwdXQvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixtREFROEI7QUFFOUI7Ozs7O0dBS0c7QUFDSCxNQUFNLGVBQWUsR0FBRyxVQUFTLEdBQVcsRUFBRSxRQUFnQixZQUFZO0lBQ3RFLE9BQU8sQ0FDRCxRQUFRO1VBQ0osMkVBQTJFO1VBQy9FLFNBQVM7VUFDVCxjQUFjO1VBQ1YsMkJBQTJCO1VBQzNCLG1CQUFtQjtVQUNuQix1QkFBdUIsS0FBSyxHQUFHO1VBQy9CLHFCQUFxQjtVQUNyQixvQkFBb0I7VUFDcEIsc0JBQXNCO1VBQ3RCLGNBQWM7VUFDZCx5QkFBeUI7VUFDekIsaUJBQWlCO1VBQ2pCLHlCQUF5QjtVQUN6QixnQkFBZ0I7VUFDaEIsb0JBQW9CO1VBQ3BCLEdBQUcsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsVUFBUyxFQUFFO1lBQzNDLE9BQU8sSUFBSSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3pDLENBQUMsQ0FBQztVQUNOLFFBQVEsQ0FDYixDQUFDO0FBQ04sQ0FBQyxDQUFBO0FBRUQ7O0dBRUc7QUFDVSxRQUFBLFFBQVEsR0FBcUI7SUFFdEM7OztPQUdHO0lBQ0gsWUFBWSxFQUFFLFVBQVMsR0FBVyxFQUFFLEdBQVc7UUFDM0MsR0FBRyxDQUFDO1FBQ0osT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDO2FBQ2pELE9BQU8sQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLENBQUM7YUFDakMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLGNBQWMsQ0FBQzthQUMvQyxPQUFPLENBQUMsYUFBYSxFQUFF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