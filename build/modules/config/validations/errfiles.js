'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.errFiles = void 0;
const validateconfig_1 = require("../validateconfig");
const errFiles = function (prop, errMessages) {
    if (!prop)
        errMessages.push('errFiles can\'t be nullish');
    else if (!(0, validateconfig_1.isObject)(prop))
        errMessages.push('errFiles should be an object');
    else
        for (const key in prop) {
            if (!key)
                errMessages.push(`errFiles can't have empty properties`);
            else if (!prop[key])
                errMessages.push(`errFiles -> '${key}' can't be empty or undefined`);
            else if (typeof prop[key] !== 'string')
                errMessages.push(`errFiles -> '${key}' should be a string`);
        }
};
exports.errFiles = errFiles;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvZXJyZmlsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixzREFBNkM7QUFFdEMsTUFBTSxRQUFRLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDN0QsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLENBQUM7U0FDOUMsSUFBSSxDQUFDLElBQUEseUJBQVEsRUFBQyxJQUFJLENBQUM7UUFDcEIsV0FBVyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztRQUVqRCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLENBQUMsR0FBRztnQkFDSixXQUFXLENBQUMsSUFBSSxDQUFDLHNDQUFzQyxDQUFDLENBQUM7aUJBQ3hELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNmLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsK0JBQStCLENBQUMsQ0FBQztpQkFDcEUsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRO2dCQUNsQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLHNCQUFzQixDQUFDLENBQUM7U0FDbkU7QUFDVCxDQUFDLENBQUE7QUFkWSxRQUFBLFFBQVEsWUFjcEIifQ==