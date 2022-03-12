'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbidden = void 0;
const validateconfig_1 = require("../validateconfig");
const forbidden = function (prop, errMessages) {
    if (!prop)
        errMessages.push('forbidden can\'t be nullish');
    else if (!(0, validateconfig_1.isArray)(prop))
        errMessages.push('forbidden should be an array');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`forbidden can\'t have empty elements`);
            else if (typeof element !== 'string')
                errMessages.push(`forbidden can contain only strings`);
        }
};
exports.forbidden = forbidden;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9yYmlkZGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29uZmlnL3ZhbGlkYXRpb25zL2ZvcmJpZGRlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUViLHNEQUE0QztBQUVyQyxNQUFNLFNBQVMsR0FBRyxVQUFTLElBQVMsRUFBRSxXQUFxQjtJQUM5RCxJQUFJLENBQUMsSUFBSTtRQUNMLFdBQVcsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQztTQUMvQyxJQUFJLENBQUMsSUFBQSx3QkFBTyxFQUFDLElBQUksQ0FBQztRQUNuQixXQUFXLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUM7O1FBRWpELEtBQUssTUFBTSxPQUFPLElBQUksSUFBSSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxPQUFPO2dCQUNSLFdBQVcsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztpQkFDeEQsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRO2dCQUNoQyxXQUFXLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDOUQ7QUFDVCxDQUFDLENBQUE7QUFaWSxRQUFBLFNBQVMsYUFZckIifQ==