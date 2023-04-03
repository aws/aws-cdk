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
__exportStar(require("./cache-policy"), exports);
__exportStar(require("./distribution"), exports);
__exportStar(require("./function"), exports);
__exportStar(require("./geo-restriction"), exports);
__exportStar(require("./key-group"), exports);
__exportStar(require("./origin"), exports);
__exportStar(require("./origin-access-identity"), exports);
__exportStar(require("./origin-request-policy"), exports);
__exportStar(require("./public-key"), exports);
__exportStar(require("./response-headers-policy"), exports);
__exportStar(require("./web-distribution"), exports);
exports.experimental = require("./experimental");
// AWS::CloudFront CloudFormation Resources:
__exportStar(require("./cloudfront.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxpREFBK0I7QUFDL0IsaURBQStCO0FBQy9CLDZDQUEyQjtBQUMzQixvREFBa0M7QUFDbEMsOENBQTRCO0FBQzVCLDJDQUF5QjtBQUN6QiwyREFBeUM7QUFDekMsMERBQXdDO0FBQ3hDLCtDQUE2QjtBQUM3Qiw0REFBMEM7QUFDMUMscURBQW1DO0FBRW5DLGlEQUErQztBQUUvQyw0Q0FBNEM7QUFDNUMseURBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9jYWNoZS1wb2xpY3knO1xuZXhwb3J0ICogZnJvbSAnLi9kaXN0cmlidXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9mdW5jdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2dlby1yZXN0cmljdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2tleS1ncm91cCc7XG5leHBvcnQgKiBmcm9tICcuL29yaWdpbic7XG5leHBvcnQgKiBmcm9tICcuL29yaWdpbi1hY2Nlc3MtaWRlbnRpdHknO1xuZXhwb3J0ICogZnJvbSAnLi9vcmlnaW4tcmVxdWVzdC1wb2xpY3knO1xuZXhwb3J0ICogZnJvbSAnLi9wdWJsaWMta2V5JztcbmV4cG9ydCAqIGZyb20gJy4vcmVzcG9uc2UtaGVhZGVycy1wb2xpY3knO1xuZXhwb3J0ICogZnJvbSAnLi93ZWItZGlzdHJpYnV0aW9uJztcblxuZXhwb3J0ICogYXMgZXhwZXJpbWVudGFsIGZyb20gJy4vZXhwZXJpbWVudGFsJztcblxuLy8gQVdTOjpDbG91ZEZyb250IENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vY2xvdWRmcm9udC5nZW5lcmF0ZWQnO1xuIl19