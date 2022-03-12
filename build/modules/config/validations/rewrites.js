'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewrites = void 0;
const validateconfig_1 = require("../validateconfig");
const validateChild = function (child, errMessages) {
    if (Object.keys(child).length < 2)
        errMessages.push('rewrites objects should contain 2 properties');
    else
        for (const key in child) {
            if (!key)
                errMessages.push(`rewrites objects can't have empty properties`);
            else if (key !== 'req' && key !== 'src')
                errMessages.push(`rewrites objects can't have property '${key}'`);
            else if (!child[key])
                errMessages.push(`rewrites object -> '${key}' can't be empty or undefined`);
            else if (['req', 'src'].includes(key) && typeof child[key] !== 'string')
                errMessages.push(`rewrites object -> '${key}' should be a string`);
            else if (['req', 'src'].includes(key) && !child[key].startsWith('/'))
                errMessages.push(`rewrites object -> '${key}' should start with '/'`);
        }
};
const rewrites = function (prop, errMessages) {
    if (!prop)
        errMessages.push('rewrites can\'t be nullish');
    else if (!(0, validateconfig_1.isArray)(prop))
        errMessages.push('rewrites should be an array');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`rewrites can\'t have nullish elements`);
            else if (!(0, validateconfig_1.isObject)(element))
                errMessages.push(`rewrites can contain only objects`);
            else if (Object.keys(element).length < 1)
                errMessages.push('rewrites can\'t have empty objects');
            else
                validateChild(element, errMessages);
        }
};
exports.rewrites = rewrites;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV3cml0ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9jb25maWcvdmFsaWRhdGlvbnMvcmV3cml0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7QUFFYixzREFBc0Q7QUFFdEQsTUFBTSxhQUFhLEdBQUcsVUFBVSxLQUF1QixFQUFFLFdBQXFCO0lBQzFFLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUM3QixXQUFXLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUM7O1FBRWpFLEtBQUssTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxHQUFHO2dCQUNKLFdBQVcsQ0FBQyxJQUFJLENBQUMsOENBQThDLENBQUMsQ0FBQztpQkFDaEUsSUFBSSxHQUFHLEtBQUssS0FBSyxJQUFJLEdBQUcsS0FBSyxLQUFLO2dCQUNuQyxXQUFXLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2lCQUNqRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQztnQkFDaEIsV0FBVyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsR0FBRywrQkFBK0IsQ0FBQyxDQUFDO2lCQUMzRSxJQUFJLENBQUUsS0FBSyxFQUFFLEtBQUssQ0FBRSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRO2dCQUNyRSxXQUFXLENBQUMsSUFBSSxDQUFDLHVCQUF1QixHQUFHLHNCQUFzQixDQUFDLENBQUM7aUJBQ2xFLElBQUksQ0FBRSxLQUFLLEVBQUUsS0FBSyxDQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7Z0JBQ2xFLFdBQVcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcseUJBQXlCLENBQUMsQ0FBQztTQUM3RTtBQUNULENBQUMsQ0FBQTtBQUVNLE1BQU0sUUFBUSxHQUFHLFVBQVMsSUFBUyxFQUFFLFdBQXFCO0lBQzdELElBQUksQ0FBQyxJQUFJO1FBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1NBQzlDLElBQUksQ0FBQyxJQUFBLHdCQUFPLEVBQUMsSUFBSSxDQUFDO1FBQ25CLFdBQVcsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs7UUFFaEQsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE9BQU87Z0JBQ1IsV0FBVyxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO2lCQUN6RCxJQUFJLENBQUMsSUFBQSx5QkFBUSxFQUFDLE9BQU8sQ0FBQztnQkFDdkIsV0FBVyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO2lCQUNyRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQzs7Z0JBRXZELGFBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDM0M7QUFDVCxDQUFDLENBQUE7QUFoQlksUUFBQSxRQUFRLFlBZ0JwQiJ9