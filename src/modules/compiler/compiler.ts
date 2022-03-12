'use strict';

import { encodeToHexChar } from '../common/general';

// tags of type <script jshp> </script>
const initTag: string = '<script jshp>';
const finalTag: string = '</script>';

// tags of type <?jshp ?> or <?\s ?>
const initLegacyTag: string = '<?jshp';
const initAltLegacyTag: string = '<?';
const finalLegacyTag: string = '?>';

// tags of type <?( )?>
const initAssignTag: string = '<?(';
const finalAssignTag: string = ')?>';

// replacement strings
export const initTagOpen: string = '`) ; ; ; ; ; ';
export const finalTagClose: string = ';  echo(`';

export const initLegacyTagOpen: string = '`); ; ; ';
export const initAltLegacyTagOpen: string = '`); ';
export const finalLegacyTagClose: string = '; echo(`';

export const initAssignTagOpen: string = '`); echo(`${';
export const finalAssignTagClose: string = '}`); echo(`';

export const ComplementTagCode: NodeJS.Dict<any> = {
    [initTag]: [initTagOpen],
    [finalTag]: [finalTagClose],
    [initLegacyTag]: [initLegacyTagOpen],
    [initAltLegacyTag]: [initAltLegacyTagOpen],
    [finalLegacyTag]: [finalLegacyTagClose],
    [initAssignTag]: [initAssignTagOpen],
    [finalAssignTag]: [finalAssignTagClose],
}

/**
 * Compiles JSHP file into executable JavaScript.
 * Doing so reduces precious parsing time when responding to requests.
 * Warnings get printed immediately, errors are thrown.
 * @param {string} jshpCode The code taken directly from JSHP file.
 * @param {string} filePath The path to the file that will be blamed for the errors.
 * @return {string} Executable JavaScript code, can be passed directly to eval.
 * @throws {SyntaxError} Error messages during compilation.
 */
export const compile = function(jshpCode: string, filePath?: string): string {

    const compilerWarnings: string[] = [];
    const compilerErrors: string[] = [];

    // Splitting file into codes and non-codes, convert CRLF to LF
    const rawBuffer: string = jshpCode.trimEnd().replace(/\r\n/g, '\n');

    // constains executable JS
    let execBuffer: string = 'echo(`';

    let lineNumber: number = 1;

    // specialised string functions for counting line numbers
    const moddedSubstring = function(str: string, init: number, final?: number) {
        let result: string = '';
        final = final || str.length;
        for (let i: number = init; i < final; i++) {
            if (rawBuffer[i] === '\n')
                lineNumber++;
            result += str[i];
        }
        return result;
    }

    // get index of next opening tag
    const findNextOpeningTag = function(offset: number): number {
        const nextTagIndex: number = rawBuffer.indexOf('<script', offset);
        const nextLegacyTagIndex: number = rawBuffer.indexOf('<?', offset);
        let nextIndex: number = -1;
        if (nextTagIndex !== -1 && nextLegacyTagIndex !== -1)
            nextIndex = nextTagIndex < nextLegacyTagIndex ? nextTagIndex : nextLegacyTagIndex;
        else if (nextTagIndex < 0 && nextLegacyTagIndex !== -1)
            nextIndex = nextLegacyTagIndex;
        else if (nextLegacyTagIndex < 0 && nextTagIndex !== -1)
            nextIndex = nextTagIndex;
        return nextIndex;
    }

    const getCodeFromTag = function(index: number, openingTag: string, closingTag: string): number {
        index += openingTag.length;
        const openingTagCode: string = ComplementTagCode[openingTag];
        const closingTagCode: string = ComplementTagCode[closingTag];
        const finalIndex: number = rawBuffer.indexOf(closingTag, index);
        const indexOfNextOpeningTag: number = findNextOpeningTag(index);
        const strayTagFound: boolean = indexOfNextOpeningTag !== -1 && indexOfNextOpeningTag < finalIndex;
        // if finalIndex doesn't exist or next tag opens before finalIndex
        if (finalIndex < 0 || strayTagFound) {
            let errorMsg: string = `compiler error: couldn\'t find closing '${closingTag}'\n`
                + `    found opening '${openingTag}' in line: ${lineNumber}`;
            if (strayTagFound) {
                moddedSubstring(rawBuffer, index, indexOfNextOpeningTag)
                const openingTagUnknown: string = rawBuffer.substr(indexOfNextOpeningTag, 3);
                let openingTag: string = '<script>';
                if (openingTagUnknown === '<?(')
                    openingTag = '<?(';
                else if (openingTagUnknown === '<?j')
                    openingTag = rawBuffer.substr(index, 6);
                else if (openingTagUnknown === '<? ')
                    openingTag = '<? ';
                errorMsg += `\n    found new opening '${openingTag}' in line: ${lineNumber}`;
            } else
                errorMsg += `\n    unexpected end of file`;
            compilerErrors.push(errorMsg);
            return -1;
        }
        execBuffer += openingTagCode + moddedSubstring(rawBuffer, index, finalIndex) + closingTagCode;
        return index = finalIndex + closingTag.length - 1;
    }

    // Loop through code and convert it to executable JavaScript
    for (let i: number = 0; i < rawBuffer.length; i++) {

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
            execBuffer += encodeToHexChar(rawBuffer[i]);
    }

    // report errors and warnings
    let reportWarnings: string = filePath ? 'file: ' + filePath + '\n    ' : '';
    let reportErrors: string = filePath ? 'file: ' + filePath + '\n    ' : '';

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
}
