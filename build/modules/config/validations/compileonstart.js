'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileOnStart = void 0;
const compileOnStart = function (prop, errMessages) {
    if (prop == undefined)
        errMessages.push('compileOnStart can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`compileOnStart should be boolean`);
};
exports.compileOnStart = compileOnStart;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZW9uc3RhcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvY29tcGlsZW9uc3RhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFTixNQUFNLGNBQWMsR0FBRyxVQUFTLElBQVMsRUFBRSxXQUFxQjtJQUNuRSxJQUFJLElBQUksSUFBSSxTQUFTO1FBQ2pCLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztTQUN0RCxJQUFJLE9BQU8sSUFBSSxLQUFLLFNBQVM7UUFDOUIsV0FBVyxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQzdELENBQUMsQ0FBQTtBQUxZLFFBQUEsY0FBYyxrQkFLMUIifQ==