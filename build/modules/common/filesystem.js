'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9maWxlc3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYiwyQ0FBNkI7QUFDN0IsdUNBQXlCO0FBRXpCOzs7R0FHRztBQUNJLE1BQU0sRUFBRSxHQUFHLFVBQVMsU0FBaUI7SUFDeEMsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQTtBQUZZLFFBQUEsRUFBRSxNQUVkO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxhQUFhLEdBQUcsVUFBUyxTQUFpQixFQUFFLGNBQXdCLEVBQUU7SUFDL0UsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNsRCxLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtRQUN0QixNQUFNLFFBQVEsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwRCxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFO1lBQ25DLElBQUEscUJBQWEsRUFBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7O1lBRXJDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDbEM7SUFDRCxPQUFPLFdBQVcsQ0FBQztBQUN2QixDQUFDLENBQUE7QUFWWSxRQUFBLGFBQWEsaUJBVXpCO0FBRUQ7OztHQUdHO0FBQ0ksTUFBTSxNQUFNLEdBQUcsVUFBUyxPQUFlO0lBQzFDLE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ3ZCLElBQUEsY0FBTSxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQztRQUN2QixFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlCLENBQUMsQ0FBQTtBQU5ZLFFBQUEsTUFBTSxVQU1sQjtBQUVEOzs7R0FHRztBQUNJLE1BQU0sS0FBSyxHQUFHLFVBQVMsUUFBZ0I7SUFDMUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3hCLElBQUEsaUJBQVMsRUFBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEMsQ0FBQyxDQUFBO0FBSFksUUFBQSxLQUFLLFNBR2pCO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sU0FBUyxHQUFHLFVBQVMsUUFBZ0IsRUFBRSxPQUF3QixFQUFFO0lBQzFFLE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0MsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckMsQ0FBQyxDQUFBO0FBSlksUUFBQSxTQUFTLGFBSXJCO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sVUFBVSxHQUFHLFVBQVMsUUFBZ0IsRUFBRSxPQUF3QixFQUFFO0lBQzNFLE1BQU0sT0FBTyxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDL0MsSUFBQSxjQUFNLEVBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEIsRUFBRSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFBO0FBSlksUUFBQSxVQUFVLGNBSXRCIn0=