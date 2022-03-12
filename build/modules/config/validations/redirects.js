'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.redirects = void 0;
const validateconfig_1 = require("../validateconfig");
const validateChild = function (child, errMessages) {
    if (Object.keys(child).length < 3)
        errMessages.push('redirects objects should contain 3 properties');
    else
        for (const key in child) {
            if (!key)
                errMessages.push(`redirects objects can't have empty properties`);
            else if (key !== 'req' && key !== 'src' && key !== 'status')
                errMessages.push(`redirects objects can't have property '${key}'`);
            else if (!child[key])
                errMessages.push(`redirects object -> '${key}' can't be empty or undefined`);
            else if (['req', 'src'].includes(key) && typeof child[key] !== 'string')
                errMessages.push(`redirects object -> '${key}' should be a string`);
            else if (key === 'req' && !child[key].startsWith('/'))
                errMessages.push(`redirects object -> '${key}' should start with '/'`);
            else if (key === 'src' && !child['src'].startsWith('/') && !/^[a-zA-Z0-9\.\+\-]+?:\/{0,2}/.test(child['src']))
                errMessages.push(`redirects object -> '${key}' should start with '/' or a 'scheme://'`);
            else if (key === 'status' && typeof child['status'] !== 'number')
                errMessages.push(`redirects object -> '${key}' should be a number`);
            else if (key === 'status' && (child['status'] < 300 || child['status'] > 399))
                errMessages.push(`redirects object -> '${key}' should be 3xx`);
        }
};
const redirects = function (prop, errMessages) {
    if (!prop)
        errMessages.push('redirects can\'t be nullish');
    else if (!(0, validateconfig_1.isArray)(prop))
        errMessages.push('redirects should be an array');
    else
        for (const element of prop) {
            if (!element)
                errMessages.push(`redirects can\'t have nullish elements`);
            else if (!(0, validateconfig_1.isObject)(element))
                errMessages.push(`redirects can contain only objects`);
            else if (Object.keys(element).length < 1)
                errMessages.push('redirects can\'t have empty objects');
            else
                validateChild(element, errMessages);
        }
};
exports.redirects = redirects;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXJlY3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29uZmlnL3ZhbGlkYXRpb25zL3JlZGlyZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUViLHNEQUFzRDtBQUV0RCxNQUFNLGFBQWEsR0FBRyxVQUFVLEtBQXVCLEVBQUUsV0FBcUI7SUFDMUUsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDO1FBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQzs7UUFFbEUsS0FBSyxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQUU7WUFDckIsSUFBSSxDQUFDLEdBQUc7Z0JBQ0osV0FBVyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO2lCQUNqRSxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksR0FBRyxLQUFLLEtBQUssSUFBSSxHQUFHLEtBQUssUUFBUTtnQkFDdkQsV0FBVyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsR0FBRyxHQUFHLENBQUMsQ0FBQztpQkFDbEUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7Z0JBQ2hCLFdBQVcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsK0JBQStCLENBQUMsQ0FBQztpQkFDNUUsSUFBSSxDQUFFLEtBQUssRUFBRSxLQUFLLENBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUTtnQkFDckUsV0FBVyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO2lCQUNuRSxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztnQkFDakQsV0FBVyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyx5QkFBeUIsQ0FBQyxDQUFDO2lCQUN0RSxJQUFJLEdBQUcsS0FBSyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDekcsV0FBVyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRywwQ0FBMEMsQ0FBQyxDQUFDO2lCQUN2RixJQUFJLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssUUFBUTtnQkFDNUQsV0FBVyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO2lCQUNuRSxJQUFJLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsaUJBQWlCLENBQUMsQ0FBQztTQUN0RTtBQUNULENBQUMsQ0FBQTtBQUVNLE1BQU0sU0FBUyxHQUFHLFVBQVMsSUFBUyxFQUFFLFdBQXFCO0lBQzlELElBQUksQ0FBQyxJQUFJO1FBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1NBQy9DLElBQUksQ0FBQyxJQUFBLHdCQUFPLEVBQUMsSUFBSSxDQUFDO1FBQ25CLFdBQVcsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7UUFFakQsS0FBSyxNQUFNLE9BQU8sSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLE9BQU87Z0JBQ1IsV0FBVyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2lCQUMxRCxJQUFJLENBQUMsSUFBQSx5QkFBUSxFQUFDLE9BQU8sQ0FBQztnQkFDdkIsV0FBVyxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2lCQUN0RCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQzs7Z0JBRXhELGFBQWEsQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7U0FDM0M7QUFDVCxDQUFDLENBQUE7QUFoQlksUUFBQSxTQUFTLGFBZ0JyQiJ9