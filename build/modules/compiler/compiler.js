'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.ComplementTagCode = exports.finalAssignTagClose = exports.initAssignTagOpen = exports.finalLegacyTagClose = exports.initAltLegacyTagOpen = exports.initLegacyTagOpen = exports.finalTagClose = exports.initTagOpen = void 0;
const general_1 = require("../common/general");
// tags of type <script jshp> </script>
const initTag = '<script jshp>';
const finalTag = '</script>';
// tags of type <?jshp ?> or <?\s ?>
const initLegacyTag = '<?jshp';
const initAltLegacyTag = '<?';
const finalLegacyTag = '?>';
// tags of type <?( )?>
const initAssignTag = '<?(';
const finalAssignTag = ')?>';
// replacement strings
exports.initTagOpen = '`) ; ; ; ; ; ';
exports.finalTagClose = ';  echo(`';
exports.initLegacyTagOpen = '`); ; ; ';
exports.initAltLegacyTagOpen = '`); ';
exports.finalLegacyTagClose = '; echo(`';
exports.initAssignTagOpen = '`); echo(`${';
exports.finalAssignTagClose = '}`); echo(`';
exports.ComplementTagCode = {
    [initTag]: [exports.initTagOpen],
    [finalTag]: [exports.finalTagClose],
    [initLegacyTag]: [exports.initLegacyTagOpen],
    [initAltLegacyTag]: [exports.initAltLegacyTagOpen],
    [finalLegacyTag]: [exports.finalLegacyTagClose],
    [initAssignTag]: [exports.initAssignTagOpen],
    [finalAssignTag]: [exports.finalAssignTagClose],
};
/**
 * Compiles JSHP file into executable JavaScript.
 * Doing so reduces precious parsing time when responding to requests.
 * Warnings get printed immediately, errors are thrown.
 * @param {string} jshpCode The code taken directly from JSHP file.
 * @param {string} filePath The path to the file that will be blamed for the errors.
 * @return {string} Executable JavaScript code, can be passed directly to eval.
 * @throws {SyntaxError} Error messages during compilation.
 */
const compile = function (jshpCode, filePath) {
    const compilerWarnings = [];
    const compilerErrors = [];
    // Splitting file into codes and non-codes, convert CRLF to LF
    const rawBuffer = jshpCode.trimEnd().replace(/\r\n/g, '\n');
    // constains executable JS
    let execBuffer = 'echo(`';
    let lineNumber = 1;
    // specialised string functions for counting line numbers
    const moddedSubstring = function (str, init, final) {
        let result = '';
        final = final || str.length;
        for (let i = init; i < final; i++) {
            if (rawBuffer[i] === '\n')
                lineNumber++;
            result += str[i];
        }
        return result;
    };
    // get index of next opening tag
    const findNextOpeningTag = function (offset) {
        const nextTagIndex = rawBuffer.indexOf('<script', offset);
        const nextLegacyTagIndex = rawBuffer.indexOf('<?', offset);
        let nextIndex = -1;
        if (nextTagIndex !== -1 && nextLegacyTagIndex !== -1)
            nextIndex = nextTagIndex < nextLegacyTagIndex ? nextTagIndex : nextLegacyTagIndex;
        else if (nextTagIndex < 0 && nextLegacyTagIndex !== -1)
            nextIndex = nextLegacyTagIndex;
        else if (nextLegacyTagIndex < 0 && nextTagIndex !== -1)
            nextIndex = nextTagIndex;
        return nextIndex;
    };
    const getCodeFromTag = function (index, openingTag, closingTag) {
        index += openingTag.length;
        const openingTagCode = exports.ComplementTagCode[openingTag];
        const closingTagCode = exports.ComplementTagCode[closingTag];
        const finalIndex = rawBuffer.indexOf(closingTag, index);
        const indexOfNextOpeningTag = findNextOpeningTag(index);
        const strayTagFound = indexOfNextOpeningTag !== -1 && indexOfNextOpeningTag < finalIndex;
        // if finalIndex doesn't exist or next tag opens before finalIndex
        if (finalIndex < 0 || strayTagFound) {
            let errorMsg = `compiler error: couldn\'t find closing '${closingTag}'\n`
                + `    found opening '${openingTag}' in line: ${lineNumber}`;
            if (strayTagFound) {
                moddedSubstring(rawBuffer, index, indexOfNextOpeningTag);
                const openingTagUnknown = rawBuffer.substr(indexOfNextOpeningTag, 3);
                let openingTag = '<script>';
                if (openingTagUnknown === '<?(')
                    openingTag = '<?(';
                else if (openingTagUnknown === '<?j')
                    openingTag = rawBuffer.substr(index, 6);
                else if (openingTagUnknown === '<? ')
                    openingTag = '<? ';
                errorMsg += `\n    found new opening '${openingTag}' in line: ${lineNumber}`;
            }
            else
                errorMsg += `\n    unexpected end of file`;
            compilerErrors.push(errorMsg);
            return -1;
        }
        execBuffer += openingTagCode + moddedSubstring(rawBuffer, index, finalIndex) + closingTagCode;
        return index = finalIndex + closingTag.length - 1;
    };
    // Loop through code and convert it to executable JavaScript
    for (let i = 0; i < rawBuffer.length; i++) {
        if (rawBuffer[i] === '\n')
            lineNumber++;
        // tags of type <script jshp> </script>
        if (rawBuffer[i] === '<' && rawBuffer.substr(i, initTag.length) === initTag) {
            i = getCodeFromTag(i, initTag, finalTag);
            if (i < 0)
                break;
        }
        // tags of type <?jshp ?>
        else if (rawBuffer[i] === '<' && rawBuffer.substr(i, initLegacyTag.length) === initLegacyTag) {
            i = getCodeFromTag(i, initLegacyTag, finalLegacyTag);
            if (i < 0)
                break;
        }
        // tags of type <?( )?>
        else if (rawBuffer[i] === '<' && rawBuffer.substr(i, initAssignTag.length) === initAssignTag) {
            i = getCodeFromTag(i, initAssignTag, finalAssignTag);
            if (i < 0)
                break;
        }
        // tags of type <? ?>
        else if (rawBuffer[i] === '<' && rawBuffer.substr(i, initAltLegacyTag.length) === initAltLegacyTag) {
            i = getCodeFromTag(i, initAltLegacyTag, finalLegacyTag);
            if (i < 0)
                break;
        }
        // non codes
        else
            execBuffer += (0, general_1.encodeToHexChar)(rawBuffer[i]);
    }
    // report errors and warnings
    let reportWarnings = filePath ? 'file: ' + filePath + '\n    ' : '';
    let reportErrors = filePath ? 'file: ' + filePath + '\n    ' : '';
    if (compilerErrors.length > 0) {
        reportErrors += compilerErrors.join('\n') + '\n';
        reportErrors += `found ${compilerWarnings.length} warning(s) and ${compilerErrors.length} error(s)`;
    }
    if (compilerWarnings.length > 0) {
        reportWarnings += compilerWarnings.join('\n') + '\n';
        if (compilerErrors.length === 0)
            reportWarnings += `found ${compilerWarnings.length} warning(s) and no errors`;
        console.warn(reportWarnings);
    }
    if (compilerErrors.length > 0)
        throw new SyntaxError(reportErrors);
    return '(async function() { ' + execBuffer + '`); })();';
};
exports.compile = compile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbW9kdWxlcy9jb21waWxlci9jb21waWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUViLCtDQUFvRDtBQUVwRCx1Q0FBdUM7QUFDdkMsTUFBTSxPQUFPLEdBQVcsZUFBZSxDQUFDO0FBQ3hDLE1BQU0sUUFBUSxHQUFXLFdBQVcsQ0FBQztBQUVyQyxvQ0FBb0M7QUFDcEMsTUFBTSxhQUFhLEdBQVcsUUFBUSxDQUFDO0FBQ3ZDLE1BQU0sZ0JBQWdCLEdBQVcsSUFBSSxDQUFDO0FBQ3RDLE1BQU0sY0FBYyxHQUFXLElBQUksQ0FBQztBQUVwQyx1QkFBdUI7QUFDdkIsTUFBTSxhQUFhLEdBQVcsS0FBSyxDQUFDO0FBQ3BDLE1BQU0sY0FBYyxHQUFXLEtBQUssQ0FBQztBQUVyQyxzQkFBc0I7QUFDVCxRQUFBLFdBQVcsR0FBVyxlQUFlLENBQUM7QUFDdEMsUUFBQSxhQUFhLEdBQVcsV0FBVyxDQUFDO0FBRXBDLFFBQUEsaUJBQWlCLEdBQVcsVUFBVSxDQUFDO0FBQ3ZDLFFBQUEsb0JBQW9CLEdBQVcsTUFBTSxDQUFDO0FBQ3RDLFFBQUEsbUJBQW1CLEdBQVcsVUFBVSxDQUFDO0FBRXpDLFFBQUEsaUJBQWlCLEdBQVcsY0FBYyxDQUFDO0FBQzNDLFFBQUEsbUJBQW1CLEdBQVcsYUFBYSxDQUFDO0FBRTVDLFFBQUEsaUJBQWlCLEdBQXFCO0lBQy9DLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxtQkFBVyxDQUFDO0lBQ3hCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxxQkFBYSxDQUFDO0lBQzNCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyx5QkFBaUIsQ0FBQztJQUNwQyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsQ0FBQyw0QkFBb0IsQ0FBQztJQUMxQyxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsMkJBQW1CLENBQUM7SUFDdkMs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