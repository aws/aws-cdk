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
__exportStar(require("./aspects"), exports);
__exportStar(require("./auto-scaling-group"), exports);
__exportStar(require("./schedule"), exports);
__exportStar(require("./lifecycle-hook"), exports);
__exportStar(require("./lifecycle-hook-target"), exports);
__exportStar(require("./scheduled-action"), exports);
__exportStar(require("./step-scaling-action"), exports);
__exportStar(require("./step-scaling-policy"), exports);
__exportStar(require("./target-tracking-scaling-policy"), exports);
__exportStar(require("./termination-policy"), exports);
__exportStar(require("./volume"), exports);
__exportStar(require("./warm-pool"), exports);
// AWS::AutoScaling CloudFormation Resources:
__exportStar(require("./autoscaling.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBMEI7QUFDMUIsdURBQXFDO0FBQ3JDLDZDQUEyQjtBQUMzQixtREFBaUM7QUFDakMsMERBQXdDO0FBQ3hDLHFEQUFtQztBQUNuQyx3REFBc0M7QUFDdEMsd0RBQXNDO0FBQ3RDLG1FQUFpRDtBQUNqRCx1REFBcUM7QUFDckMsMkNBQXlCO0FBQ3pCLDhDQUE0QjtBQUU1Qiw2Q0FBNkM7QUFDN0MsMERBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9hc3BlY3RzJztcbmV4cG9ydCAqIGZyb20gJy4vYXV0by1zY2FsaW5nLWdyb3VwJztcbmV4cG9ydCAqIGZyb20gJy4vc2NoZWR1bGUnO1xuZXhwb3J0ICogZnJvbSAnLi9saWZlY3ljbGUtaG9vayc7XG5leHBvcnQgKiBmcm9tICcuL2xpZmVjeWNsZS1ob29rLXRhcmdldCc7XG5leHBvcnQgKiBmcm9tICcuL3NjaGVkdWxlZC1hY3Rpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9zdGVwLXNjYWxpbmctYWN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vc3RlcC1zY2FsaW5nLXBvbGljeSc7XG5leHBvcnQgKiBmcm9tICcuL3RhcmdldC10cmFja2luZy1zY2FsaW5nLXBvbGljeSc7XG5leHBvcnQgKiBmcm9tICcuL3Rlcm1pbmF0aW9uLXBvbGljeSc7XG5leHBvcnQgKiBmcm9tICcuL3ZvbHVtZSc7XG5leHBvcnQgKiBmcm9tICcuL3dhcm0tcG9vbCc7XG5cbi8vIEFXUzo6QXV0b1NjYWxpbmcgQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2VzOlxuZXhwb3J0ICogZnJvbSAnLi9hdXRvc2NhbGluZy5nZW5lcmF0ZWQnO1xuIl19