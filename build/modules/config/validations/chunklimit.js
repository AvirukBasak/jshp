'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunkLimit = void 0;
const chunkLimit = function (prop, errMessages) {
    if (!prop)
        errMessages.push('chunkLimit can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`chunkLimit should be number`);
};
exports.chunkLimit = chunkLimit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmtsaW1pdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbmZpZy92YWxpZGF0aW9ucy9jaHVua2xpbWl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRU4sTUFBTSxVQUFVLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDL0QsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDdkQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1FBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUFMWSxRQUFBLFVBQVUsY0FLdEIifQ==