"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNoTokens = void 0;
const helpers_internal_1 = require("aws-cdk-lib/core/lib/helpers-internal");
function validateNoTokens(props, context) {
    for (const [key, value] of Object.entries(props)) {
        if (typeof value === 'string') {
            helpers_internal_1.StringSpecializer.validateNoTokens(value, `${context} property '${key}'`);
        }
    }
}
exports.validateNoTokens = validateNoTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm8tdG9rZW5zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm8tdG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRFQUEwRTtBQUUxRSxTQUFnQixnQkFBZ0IsQ0FBbUIsS0FBUSxFQUFFLE9BQWU7SUFDMUUsS0FBSyxNQUFNLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDaEQsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0Isb0NBQWlCLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEdBQUcsT0FBTyxjQUFjLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDM0U7S0FDRjtBQUNILENBQUM7QUFORCw0Q0FNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0cmluZ1NwZWNpYWxpemVyIH0gZnJvbSAnYXdzLWNkay1saWIvY29yZS9saWIvaGVscGVycy1pbnRlcm5hbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZU5vVG9rZW5zPEEgZXh0ZW5kcyBvYmplY3Q+KHByb3BzOiBBLCBjb250ZXh0OiBzdHJpbmcpIHtcbiAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocHJvcHMpKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIFN0cmluZ1NwZWNpYWxpemVyLnZhbGlkYXRlTm9Ub2tlbnModmFsdWUsIGAke2NvbnRleHR9IHByb3BlcnR5ICcke2tleX0nYCk7XG4gICAgfVxuICB9XG59XG4iXX0=