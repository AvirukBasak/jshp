'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeoutSec = void 0;
const timeoutSec = function (prop, errMessages) {
    if (!prop)
        errMessages.push('timeoutSec can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`timeoutSec should be number`);
};
exports.timeoutSec = timeoutSec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dHNlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbmZpZy92YWxpZGF0aW9ucy90aW1lb3V0c2VjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRU4sTUFBTSxVQUFVLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDL0QsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7U0FDdkQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1FBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUN4RCxDQUFDLENBQUE7QUFMWSxRQUFBLFVBQVUsY0FLdEIifQ==