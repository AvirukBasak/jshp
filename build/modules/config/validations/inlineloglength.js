'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineLogLength = void 0;
const inlineLogLength = function (prop, errMessages) {
    if (!prop)
        errMessages.push('inlineLogLength can\'t be 0 or undefined');
    else if (typeof prop !== 'number')
        errMessages.push(`inlineLogLength should be number`);
};
exports.inlineLogLength = inlineLogLength;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5saW5lbG9nbGVuZ3RoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvY29uZmlnL3ZhbGlkYXRpb25zL2lubGluZWxvZ2xlbmd0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7OztBQUVOLE1BQU0sZUFBZSxHQUFHLFVBQVMsSUFBUyxFQUFFLFdBQXFCO0lBQ3BFLElBQUksQ0FBQyxJQUFJO1FBQ0wsV0FBVyxDQUFDLElBQUksQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1NBQzVELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUTtRQUM3QixXQUFXLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDN0QsQ0FBQyxDQUFBO0FBTFksUUFBQSxlQUFlLG1CQUszQiJ9