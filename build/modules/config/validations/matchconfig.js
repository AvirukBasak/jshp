'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchConfig = void 0;
const validateconfig_1 = require("../validateconfig");
const matchConfig = function (prop, errMessages) {
    if (!prop)
        errMessages.push('matchConfig can\'t be nullish');
    else if (!(0, validateconfig_1.isObject)(prop))
        errMessages.push('matchConfig should be an object');
    else if (Object.keys(prop).length < 2)
        errMessages.push('matchConfig should contain 2 properties');
    else
        for (const key in prop) {
            if (!key)
                errMessages.push(`matchConfig can't have empty properties`);
            else if (key !== 'matchFromStart' && key !== 'matchTillEnd')
                errMessages.push(`matchConfig can't have property '${key}'`);
            else if (prop[key] == undefined)
                errMessages.push(`matchConfig -> '${key}' can't be undefined`);
            else if (typeof prop[key] !== 'boolean')
                errMessages.push(`matchConfig -> '${key}' should be a boolean`);
        }
};
exports.matchConfig = matchConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0Y2hjb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvbWF0Y2hjb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixzREFBNkM7QUFFdEMsTUFBTSxXQUFXLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDaEUsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDakQsSUFBSSxDQUFDLElBQUEseUJBQVEsRUFBQyxJQUFJLENBQUM7UUFDcEIsV0FBVyxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ25ELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUNqQyxXQUFXLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUM7O1FBRTVELEtBQUssTUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxHQUFHO2dCQUNKLFdBQVcsQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztpQkFDM0QsSUFBSSxHQUFHLEtBQUssZ0JBQWdCLElBQUksR0FBRyxLQUFLLGNBQWM7Z0JBQ3ZELFdBQVcsQ0FBQyxJQUFJLENBQUMsb0NBQW9DLEdBQUcsR0FBRyxDQUFDLENBQUM7aUJBQzVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVM7Z0JBQzNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztpQkFDOUQsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTO2dCQUNuQyxXQUFXLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLHVCQUF1QixDQUFDLENBQUM7U0FDdkU7QUFDVCxDQUFDLENBQUE7QUFsQlksUUFBQSxXQUFXLGVBa0J2QiJ9