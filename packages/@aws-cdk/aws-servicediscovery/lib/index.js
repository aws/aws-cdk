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
__exportStar(require("./instance"), exports);
__exportStar(require("./alias-target-instance"), exports);
__exportStar(require("./cname-instance"), exports);
__exportStar(require("./ip-instance"), exports);
__exportStar(require("./non-ip-instance"), exports);
__exportStar(require("./namespace"), exports);
__exportStar(require("./http-namespace"), exports);
__exportStar(require("./private-dns-namespace"), exports);
__exportStar(require("./public-dns-namespace"), exports);
__exportStar(require("./service"), exports);
// AWS::ServiceDiscovery CloudFormation Resources:
__exportStar(require("./servicediscovery.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBMkI7QUFDM0IsMERBQXdDO0FBQ3hDLG1EQUFpQztBQUNqQyxnREFBOEI7QUFDOUIsb0RBQWtDO0FBQ2xDLDhDQUE0QjtBQUM1QixtREFBaUM7QUFDakMsMERBQXdDO0FBQ3hDLHlEQUF1QztBQUN2Qyw0Q0FBMEI7QUFDMUIsa0RBQWtEO0FBQ2xELCtEQUE2QyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vaW5zdGFuY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9hbGlhcy10YXJnZXQtaW5zdGFuY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9jbmFtZS1pbnN0YW5jZSc7XG5leHBvcnQgKiBmcm9tICcuL2lwLWluc3RhbmNlJztcbmV4cG9ydCAqIGZyb20gJy4vbm9uLWlwLWluc3RhbmNlJztcbmV4cG9ydCAqIGZyb20gJy4vbmFtZXNwYWNlJztcbmV4cG9ydCAqIGZyb20gJy4vaHR0cC1uYW1lc3BhY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9wcml2YXRlLWRucy1uYW1lc3BhY2UnO1xuZXhwb3J0ICogZnJvbSAnLi9wdWJsaWMtZG5zLW5hbWVzcGFjZSc7XG5leHBvcnQgKiBmcm9tICcuL3NlcnZpY2UnO1xuLy8gQVdTOjpTZXJ2aWNlRGlzY292ZXJ5IENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vc2VydmljZWRpc2NvdmVyeS5nZW5lcmF0ZWQnO1xuIl19