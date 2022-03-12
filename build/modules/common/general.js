'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemoteAddress = exports.getLongDateTime = exports.regexTestStr = exports.encodeToHexChar = void 0;
/**
 * Can encode '%' '`' '${' and '}' to %XX format
 * @param {string} str The string to be encoded
 * @return {string}
 */
const encodeToHexChar = function (str) {
    return str.replace(/`/g, '\\x60')
        .replace(/\$/g, '\\x24');
};
exports.encodeToHexChar = encodeToHexChar;
/**
 * The string array should contain regular expressions represented in strings.
 * @param {string[]} arr The string array of regular expressions.
 * @param {string} str The test string
 * @returns {string|undefined} The regex that made 1st match, undefined otherwise.
 */
const regexTestStr = function (arr, str, caret, dollar) {
    for (const item of arr) {
        const regex = new RegExp((caret ? '^' : '') + item + (dollar ? '$' : ''));
        if (regex.test(str))
            return item;
    }
    return undefined;
};
exports.regexTestStr = regexTestStr;
/**
 * Returns current date and time.
 * @return {string}
 */
const getLongDateTime = function () {
    const date_ob = new Date();
    const date = ('0' + date_ob.getDate()).slice(-2);
    const month = ('0' + (date_ob.getMonth() + 1)).slice(-2);
    const year = ('' + date_ob.getFullYear());
    const hours = ('0' + date_ob.getHours()).slice(-2);
    const minute = ('0' + date_ob.getMinutes()).slice(-2);
    const seconds = ('0' + date_ob.getSeconds()).slice(-2);
    return `${year}-${month}-${date}@${hours}:${minute}:${seconds}`;
};
exports.getLongDateTime = getLongDateTime;
const getRemoteAddress = function (req) {
    var _a, _b;
    return String(req.headers['x-forwarded-for']
        || ((_a = req === null || req === void 0 ? void 0 : req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress)
        || ((_b = req === null || req === void 0 ? void 0 : req.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress)
        || 'N/A');
};
exports.getRemoteAddress = getRemoteAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9nZW5lcmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBR2I7Ozs7R0FJRztBQUNJLE1BQU0sZUFBZSxHQUFHLFVBQVMsR0FBVztJQUMvQyxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztTQUN0QixPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQTtBQUhZLFFBQUEsZUFBZSxtQkFHM0I7QUFFRDs7Ozs7R0FLRztBQUNJLE1BQU0sWUFBWSxHQUFHLFVBQVMsR0FBYSxFQUFFLEdBQVcsRUFBRSxLQUFjLEVBQUUsTUFBZTtJQUM1RixLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsRUFBRTtRQUNwQixNQUFNLEtBQUssR0FBVyxJQUFJLE1BQU0sQ0FDNUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUNsRCxDQUFDO1FBQ0YsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQztZQUNmLE9BQU8sSUFBSSxDQUFDO0tBQ25CO0lBQ0QsT0FBTyxTQUFTLENBQUM7QUFDckIsQ0FBQyxDQUFBO0FBVFksUUFBQSxZQUFZLGdCQVN4QjtBQUVEOzs7R0FHRztBQUNJLE1BQU0sZUFBZSxHQUFHO0lBQzNCLE1BQU0sT0FBTyxHQUFTLElBQUksSUFBSSxFQUFFLENBQUM7SUFDakMsTUFBTSxJQUFJLEdBQVcsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsTUFBTSxLQUFLLEdBQVcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRSxNQUFNLElBQUksR0FBVyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztJQUNsRCxNQUFNLEtBQUssR0FBVyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMzRCxNQUFNLE1BQU0sR0FBVyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RCxNQUFNLE9BQU8sR0FBVyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvRCxPQUFPLEdBQUcsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNwRSxDQUFDLENBQUM7QUFUVyxRQUFBLGVBQWUsbUJBUzFCO0FBRUssTUFBTSxnQkFBZ0IsR0FBRyxVQUFTLEdBQWdCOztJQUNyRCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDO1lBQzlCLE1BQUEsR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLFVBQVUsMENBQUUsYUFBYSxDQUFBO1lBQzlCLE1BQUEsR0FBRyxhQUFILEdBQUcsdUJBQUgsR0FBRyxDQUFFLE1BQU0sMENBQUUsYUFBYSxDQUFBO1dBQzFCLEtBQUssQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQTtBQUxZLFFBQUEsZ0JBQWdCLG9CQUs1QiJ9