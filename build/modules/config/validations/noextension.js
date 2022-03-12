'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.noExtension = void 0;
const validateconfig_1 = require("../validateconfig");
const noExtension = function (prop, errMessages) {
    if (!prop)
        errMessages.push('noExtension can\'t be nullish');
    else if (!(0, validateconfig_1.isArray)(prop))
        errMessages.push('noExtension should be an array');
    else
        for (const element of prop) {
            if (typeof element !== 'string')
                errMessages.push(`noExtension can contain only strings`);
            else if (element[0] !== '.')
                errMessages.push(`noExtension -> '${element}' should be '.${element}'`);
        }
};
exports.noExtension = noExtension;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9leHRlbnNpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvbm9leHRlbnNpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixzREFBNEM7QUFFckMsTUFBTSxXQUFXLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDaEUsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7U0FDakQsSUFBSSxDQUFDLElBQUEsd0JBQU8sRUFBQyxJQUFJLENBQUM7UUFDbkIsV0FBVyxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztRQUVuRCxLQUFLLE1BQU0sT0FBTyxJQUFJLElBQUksRUFBRTtZQUN4QixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7Z0JBQzNCLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztpQkFDeEQsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztnQkFDdkIsV0FBVyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsT0FBTyxpQkFBaUIsT0FBTyxHQUFHLENBQUMsQ0FBQztTQUMvRTtBQUNULENBQUMsQ0FBQTtBQVpZLFFBQUEsV0FBVyxlQVl2QiJ9