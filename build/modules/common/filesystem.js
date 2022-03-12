'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendFile = exports.writeFile = exports.touch = exports.mkdirp = exports.lsRecursively = exports.ls = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
/**
 * List everything in a directory
 * @param {string} directory
 */
const ls = function (directory) {
    return fs.readdirSync(directory);
};
exports.ls = ls;
/**
 * Recursively list all files in a directory
 * @param {string} directory
 */
const lsRecursively = function (directory, listOfPaths = []) {
    const lsDir = fs.readdirSync(directory);
    for (const file of lsDir) {
        const filePath = path.join(directory, file);
        if (fs.statSync(filePath).isDirectory())
            (0, exports.lsRecursively)(filePath, listOfPaths);
        else
            listOfPaths.push(filePath);
    }
    return listOfPaths;
};
exports.lsRecursively = lsRecursively;
/**
 * Recursively create directories
 * @param {string} dirPath Path to directory
 */
const mkdirp = function (dirPath) {
    const dirname = path.dirname(dirPath);
    if (!fs.existsSync(dirname))
        (0, exports.mkdirp)(dirname);
    if (!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath);
};
exports.mkdirp = mkdirp;
/**
 * Create an empty file
 * @param {string} filePath Path to file
 */
const touch = function (filePath) {
    if (!fs.existsSync(filePath))
        (0, exports.writeFile)(filePath, '');
};
exports.touch = touch;
/**
 * Overwrite a file
 * @param {string} filePath Path to file
 * @param {string|Buffer} data Data to write
 */
const writeFile = function (filePath, data = '') {
    const dirPath = path.dirname(filePath);
    (0, exports.mkdirp)(dirPath);
    fs.writeFileSync(filePath, data);
};
exports.writeFile = writeFile;
/**
 * Append to a file
 * @param {string} filePath Path to file
 * @param {string|Buffer} data Data to write
 */
const appendFile = function (filePath, data = '') {
    const dirPath = path.dirname(filePath);
    (0, exports.mkdirp)(dirPath);
    fs.appendFileSync(filePath, data);
};
exports.appendFile = appendFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9maWxlc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUViLDJDQUE2QjtBQUM3Qix1Q0FBeUI7QUFFekI7OztHQUdHO0FBQ0ksTUFBTSxFQUFFLEdBQUcsVUFBUyxTQUFpQjtJQUN4QyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFBO0FBRlksUUFBQSxFQUFFLE1BRWQ7QUFFRDs7O0dBR0c7QUFDSSxNQUFNLGFBQWEsR0FBRyxVQUFTLFNBQWlCLEVBQUUsY0FBd0IsRUFBRTtJQUMvRSxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xELEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1FBQ3RCLE1BQU0sUUFBUSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BELElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDbkMsSUFBQSxxQkFBYSxFQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQzs7WUFFckMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQztJQUNELE9BQU8sV0FBVyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQTtBQVZZLFFBQUEsYUFBYSxpQkFVekI7QUFFRDs7O0dBR0c7QUFDSSxNQUFNLE1BQU0sR0FBRyxVQUFTLE9BQWU7SUFDMUMsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7UUFDdkIsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUIsQ0FBQyxDQUFBO0FBTlksUUFBQSxNQUFNLFVBTWxCO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxLQUFLLEdBQUcsVUFBUyxRQUFnQjtJQUMxQyxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUM7UUFDeEIsSUFBQSxpQkFBUyxFQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxDQUFDLENBQUE7QUFIWSxRQUFBLEtBQUssU0FHakI7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxTQUFTLEdBQUcsVUFBUyxRQUFnQixFQUFFLE9BQXdCLEVBQUU7SUFDMUUsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQztJQUNoQixFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyQyxDQUFDLENBQUE7QUFKWSxRQUFBLFNBQVMsYUFJckI7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxVQUFVLEdBQUcsVUFBUyxRQUFnQixFQUFFLE9BQXdCLEVBQUU7SUFDM0UsTUFBTSxPQUFPLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMvQyxJQUFBLGNBQU0sRUFBQyxPQUFPLENBQUMsQ0FBQztJQUNoQixFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUE7QUFKWSxRQUFBLFVBQVUsY0FJdEIifQ==