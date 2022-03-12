'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHeaders = void 0;
const validateconfig_1 = require("../validateconfig");
const defaultHeaders = function (prop, errMessages) {
    if (!prop)
        errMessages.push('defaultHeaders can\'t be nullish');
    else if (!(0, validateconfig_1.isObject)(prop))
        errMessages.push('defaultHeaders should be an object');
    else
        for (const key in prop) {
            if (!key)
                errMessages.push(`defaultHeaders can't have empty property names`);
            else if (prop[key] == undefined)
                errMessages.push(`defaultHeaders -> '${key}' can't be undefined`);
            else if (typeof prop[key] !== 'string')
                errMessages.push(`defaultHeaders -> '${key}' should be a string`);
        }
};
exports.defaultHeaders = defaultHeaders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdGhlYWRlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvZGVmYXVsdGhlYWRlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixzREFBNkM7QUFFdEMsTUFBTSxjQUFjLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDbkUsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7U0FDcEQsSUFBSSxDQUFDLElBQUEseUJBQVEsRUFBQyxJQUFJLENBQUM7UUFDcEIsV0FBVyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDOztRQUV2RCxLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLENBQUMsR0FBRztnQkFDSixXQUFXLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7aUJBQ2xFLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLFNBQVM7Z0JBQzNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsc0JBQXNCLENBQUMsQ0FBQztpQkFDakUsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRO2dCQUNsQyxXQUFXLENBQUMsSUFBSSxDQUFDLHNCQUFzQixHQUFHLHNCQUFzQixDQUFDLENBQUM7U0FDekU7QUFDVCxDQUFDLENBQUE7QUFkWSxRQUFBLGNBQWMsa0JBYzFCIn0=