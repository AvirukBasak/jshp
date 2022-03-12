'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.chunksPerEcho = void 0;
const chunksPerEcho = function (prop, errMessages) {
    if (!prop)
        errMessages.push('chunksPerEcho can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`chunksPerEcho should be number`);
};
exports.chunksPerEcho = chunksPerEcho;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2h1bmtzcGVyZWNoby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL2NvbmZpZy92YWxpZGF0aW9ucy9jaHVua3NwZXJlY2hvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBRU4sTUFBTSxhQUFhLEdBQUcsVUFBUyxJQUFTLEVBQUUsV0FBcUI7SUFDbEUsSUFBSSxDQUFDLElBQUk7UUFDTCxXQUFXLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDMUQsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO1FBQzdCLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUMzRCxDQUFDLENBQUE7QUFMWSxRQUFBLGFBQWEsaUJBS3pCIn0=