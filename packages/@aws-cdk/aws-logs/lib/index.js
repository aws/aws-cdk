"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./cross-account-destination"), exports);
__exportStar(require("./log-group"), exports);
__exportStar(require("./log-stream"), exports);
__exportStar(require("./metric-filter"), exports);
__exportStar(require("./pattern"), exports);
__exportStar(require("./subscription-filter"), exports);
__exportStar(require("./log-retention"), exports);
__exportStar(require("./policy"), exports);
__exportStar(require("./query-definition"), exports);
// AWS::Logs CloudFormation Resources:
__exportStar(require("./logs.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw4REFBNEM7QUFDNUMsOENBQTRCO0FBQzVCLCtDQUE2QjtBQUM3QixrREFBZ0M7QUFDaEMsNENBQTBCO0FBQzFCLHdEQUFzQztBQUN0QyxrREFBZ0M7QUFDaEMsMkNBQXlCO0FBQ3pCLHFEQUFtQztBQUVuQyxzQ0FBc0M7QUFDdEMsbURBQWlDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9jcm9zcy1hY2NvdW50LWRlc3RpbmF0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vbG9nLWdyb3VwJztcbmV4cG9ydCAqIGZyb20gJy4vbG9nLXN0cmVhbSc7XG5leHBvcnQgKiBmcm9tICcuL21ldHJpYy1maWx0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9wYXR0ZXJuJztcbmV4cG9ydCAqIGZyb20gJy4vc3Vic2NyaXB0aW9uLWZpbHRlcic7XG5leHBvcnQgKiBmcm9tICcuL2xvZy1yZXRlbnRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9wb2xpY3knO1xuZXhwb3J0ICogZnJvbSAnLi9xdWVyeS1kZWZpbml0aW9uJztcblxuLy8gQVdTOjpMb2dzIENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vbG9ncy5nZW5lcmF0ZWQnO1xuIl19