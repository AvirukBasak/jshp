'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotCompile = void 0;
const hotCompile = function (prop, errMessages) {
    if (prop == undefined)
        errMessages.push('hotCompile can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`hotCompile should be boolean`);
};
exports.hotCompile = hotCompile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG90Y29tcGlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbmZpZy92YWxpZGF0aW9ucy9ob3Rjb21waWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRU4sTUFBTSxVQUFVLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDL0QsSUFBSSxJQUFJLElBQUksU0FBUztRQUNqQixXQUFXLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7U0FDbEQsSUFBSSxPQUFPLElBQUksS0FBSyxTQUFTO1FBQzlCLFdBQVcsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUN6RCxDQUFDLENBQUE7QUFMWSxRQUFBLFVBQVUsY0FLdEIifQ==