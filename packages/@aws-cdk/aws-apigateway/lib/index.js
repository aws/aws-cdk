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
__exportStar(require("./restapi"), exports);
__exportStar(require("./resource"), exports);
__exportStar(require("./method"), exports);
__exportStar(require("./integration"), exports);
__exportStar(require("./deployment"), exports);
__exportStar(require("./stage"), exports);
__exportStar(require("./integrations"), exports);
__exportStar(require("./lambda-api"), exports);
__exportStar(require("./api-key"), exports);
__exportStar(require("./usage-plan"), exports);
__exportStar(require("./vpc-link"), exports);
__exportStar(require("./methodresponse"), exports);
__exportStar(require("./model"), exports);
__exportStar(require("./requestvalidator"), exports);
__exportStar(require("./authorizer"), exports);
__exportStar(require("./json-schema"), exports);
__exportStar(require("./domain-name"), exports);
__exportStar(require("./base-path-mapping"), exports);
__exportStar(require("./cors"), exports);
__exportStar(require("./authorizers"), exports);
__exportStar(require("./access-log"), exports);
__exportStar(require("./api-definition"), exports);
__exportStar(require("./gateway-response"), exports);
__exportStar(require("./stepfunctions-api"), exports);
// AWS::ApiGateway CloudFormation Resources:
__exportStar(require("./apigateway.generated"), exports);
// AWS::ApiGatewayV2 CloudFormation resources:
__exportStar(require("./apigatewayv2"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBMEI7QUFDMUIsNkNBQTJCO0FBQzNCLDJDQUF5QjtBQUN6QixnREFBOEI7QUFDOUIsK0NBQTZCO0FBQzdCLDBDQUF3QjtBQUN4QixpREFBK0I7QUFDL0IsK0NBQTZCO0FBQzdCLDRDQUEwQjtBQUMxQiwrQ0FBNkI7QUFDN0IsNkNBQTJCO0FBQzNCLG1EQUFpQztBQUNqQywwQ0FBd0I7QUFDeEIscURBQW1DO0FBQ25DLCtDQUE2QjtBQUM3QixnREFBOEI7QUFDOUIsZ0RBQThCO0FBQzlCLHNEQUFvQztBQUNwQyx5Q0FBdUI7QUFDdkIsZ0RBQThCO0FBQzlCLCtDQUE2QjtBQUM3QixtREFBaUM7QUFDakMscURBQW1DO0FBQ25DLHNEQUFvQztBQUVwQyw0Q0FBNEM7QUFDNUMseURBQXVDO0FBQ3ZDLDhDQUE4QztBQUM5QyxpREFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICcuL3Jlc3RhcGknO1xuZXhwb3J0ICogZnJvbSAnLi9yZXNvdXJjZSc7XG5leHBvcnQgKiBmcm9tICcuL21ldGhvZCc7XG5leHBvcnQgKiBmcm9tICcuL2ludGVncmF0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vZGVwbG95bWVudCc7XG5leHBvcnQgKiBmcm9tICcuL3N0YWdlJztcbmV4cG9ydCAqIGZyb20gJy4vaW50ZWdyYXRpb25zJztcbmV4cG9ydCAqIGZyb20gJy4vbGFtYmRhLWFwaSc7XG5leHBvcnQgKiBmcm9tICcuL2FwaS1rZXknO1xuZXhwb3J0ICogZnJvbSAnLi91c2FnZS1wbGFuJztcbmV4cG9ydCAqIGZyb20gJy4vdnBjLWxpbmsnO1xuZXhwb3J0ICogZnJvbSAnLi9tZXRob2RyZXNwb25zZSc7XG5leHBvcnQgKiBmcm9tICcuL21vZGVsJztcbmV4cG9ydCAqIGZyb20gJy4vcmVxdWVzdHZhbGlkYXRvcic7XG5leHBvcnQgKiBmcm9tICcuL2F1dGhvcml6ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9qc29uLXNjaGVtYSc7XG5leHBvcnQgKiBmcm9tICcuL2RvbWFpbi1uYW1lJztcbmV4cG9ydCAqIGZyb20gJy4vYmFzZS1wYXRoLW1hcHBpbmcnO1xuZXhwb3J0ICogZnJvbSAnLi9jb3JzJztcbmV4cG9ydCAqIGZyb20gJy4vYXV0aG9yaXplcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9hY2Nlc3MtbG9nJztcbmV4cG9ydCAqIGZyb20gJy4vYXBpLWRlZmluaXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9nYXRld2F5LXJlc3BvbnNlJztcbmV4cG9ydCAqIGZyb20gJy4vc3RlcGZ1bmN0aW9ucy1hcGknO1xuXG4vLyBBV1M6OkFwaUdhdGV3YXkgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2VzOlxuZXhwb3J0ICogZnJvbSAnLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG4vLyBBV1M6OkFwaUdhdGV3YXlWMiBDbG91ZEZvcm1hdGlvbiByZXNvdXJjZXM6XG5leHBvcnQgKiBmcm9tICcuL2FwaWdhdGV3YXl2Mic7XG4iXX0=