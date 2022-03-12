'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER = exports.VERSION = exports.PACKAGE = void 0;
// Get package properties from package.json
exports.PACKAGE = require('../../../package.json');
// Loads version directly from package.json, which is updated by npm version
exports.VERSION = exports.PACKAGE.version;
exports.SERVER = 'jshp' + '/' + exports.VERSION;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbW1vbi9wYWNrYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRWIsMkNBQTJDO0FBQzlCLFFBQUEsT0FBTyxHQUFxQixPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUUxRSw0RUFBNEU7QUFDL0QsUUFBQSxPQUFPLEdBQVcsZUFBTyxDQUFDLE9BQU8sQ0FBQztBQUVsQyxRQUFBLE1BQU0sR0FBVyxNQUFNLEdBQUcsR0FBRyxHQUFHLGVBQU8sQ0FBQyJ9