'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.execExtensions = void 0;
const validateconfig_1 = require("../validateconfig");
const execExtensions = function (prop, errMessages) {
    if (!prop)
        errMessages.push('execExtensions can\'t be nullish');
    else if (!(0, validateconfig_1.isArray)(prop))
        errMessages.push('execExtensions should be an array');
    else if (prop.length < 1)
        errMessages.push('execExtensions array can\'t be empty');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`execExtensions can\'t have empty elements`);
            else if (typeof element !== 'string')
                errMessages.push(`execExtensions can contain only strings`);
            else if (element[0] !== '.')
                errMessages.push(`execExtensions -> '${element}' should be '.${element}'`);
        }
};
exports.execExtensions = execExtensions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY2V4dGVuc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvZXhlY2V4dGVuc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixzREFBNEM7QUFFckMsTUFBTSxjQUFjLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDbkUsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDcEQsSUFBSSxDQUFDLElBQUEsd0JBQU8sRUFBQyxJQUFJLENBQUM7UUFDbkIsV0FBVyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1NBQ3JELElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQ3BCLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQzs7UUFFekQsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE9BQU87Z0JBQ1IsV0FBVyxDQUFDLElBQUksQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO2lCQUM3RCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7Z0JBQ2hDLFdBQVcsQ0FBQyxJQUFJLENBQUMseUNBQXlDLENBQUMsQ0FBQztpQkFDM0QsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztnQkFDdkIsV0FBVyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsT0FBTyxpQkFBaUIsT0FBTyxHQUFHLENBQUMsQ0FBQztTQUNsRjtBQUNULENBQUMsQ0FBQTtBQWhCWSxRQUFBLGNBQWMsa0JBZ0IxQiJ9