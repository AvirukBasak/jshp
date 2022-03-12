'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDir = void 0;
const buildDir = function (prop, errMessages) {
    if (!prop)
        errMessages.push('buildDir can\'t be empty or undefined');
    else if (typeof prop !== 'string')
        errMessages.push(`buildDir should be string`);
};
exports.buildDir = buildDir;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVpbGRkaXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvYnVpbGRkaXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFTixNQUFNLFFBQVEsR0FBRyxVQUFTLElBQVMsRUFBRSxXQUFxQjtJQUM3RCxJQUFJLENBQUMsSUFBSTtRQUNMLFdBQVcsQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQztTQUN6RCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVE7UUFDN0IsV0FBVyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQTtBQUxZLFFBQUEsUUFBUSxZQUtwQiJ9