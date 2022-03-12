'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondInChunks = void 0;
const respondInChunks = function (prop, errMessages) {
    if (prop == undefined)
        errMessages.push('respondInChunks can\'t be undefined');
    else if (typeof prop !== 'boolean')
        errMessages.push(`respondInChunks should be boolean`);
};
exports.respondInChunks = respondInChunks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uZGluY2h1bmtzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29uZmlnL3ZhbGlkYXRpb25zL3Jlc3BvbmRpbmNodW5rcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUVOLE1BQU0sZUFBZSxHQUFHLFVBQVMsSUFBUyxFQUFFLFdBQXFCO0lBQ3BFLElBQUksSUFBSSxJQUFJLFNBQVM7UUFDakIsV0FBVyxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1NBQ3ZELElBQUksT0FBTyxJQUFJLEtBQUssU0FBUztRQUM5QixXQUFXLENBQUMsSUFBSSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFBO0FBTFksUUFBQSxlQUFlLG1CQUszQiJ9