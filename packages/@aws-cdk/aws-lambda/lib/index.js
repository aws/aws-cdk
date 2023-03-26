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
__exportStar(require("./adot-layers"), exports);
__exportStar(require("./alias"), exports);
__exportStar(require("./dlq"), exports);
__exportStar(require("./function-base"), exports);
__exportStar(require("./function"), exports);
__exportStar(require("./handler"), exports);
__exportStar(require("./image-function"), exports);
__exportStar(require("./layers"), exports);
__exportStar(require("./permission"), exports);
__exportStar(require("./runtime"), exports);
__exportStar(require("./code"), exports);
__exportStar(require("./filesystem"), exports);
__exportStar(require("./lambda-version"), exports);
__exportStar(require("./singleton-lambda"), exports);
__exportStar(require("./event-source"), exports);
__exportStar(require("./event-source-mapping"), exports);
__exportStar(require("./event-source-filter"), exports);
__exportStar(require("./destination"), exports);
__exportStar(require("./event-invoke-config"), exports);
__exportStar(require("./scalable-attribute-api"), exports);
__exportStar(require("./code-signing-config"), exports);
__exportStar(require("./lambda-insights"), exports);
__exportStar(require("./log-retention"), exports);
__exportStar(require("./architecture"), exports);
__exportStar(require("./function-url"), exports);
__exportStar(require("./runtime-management"), exports);
// AWS::Lambda CloudFormation Resources:
__exportStar(require("./lambda.generated"), exports);
require("./lambda-augmentations.generated");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxnREFBOEI7QUFDOUIsMENBQXdCO0FBQ3hCLHdDQUFzQjtBQUN0QixrREFBZ0M7QUFDaEMsNkNBQTJCO0FBQzNCLDRDQUEwQjtBQUMxQixtREFBaUM7QUFDakMsMkNBQXlCO0FBQ3pCLCtDQUE2QjtBQUM3Qiw0Q0FBMEI7QUFDMUIseUNBQXVCO0FBQ3ZCLCtDQUE2QjtBQUM3QixtREFBaUM7QUFDakMscURBQW1DO0FBQ25DLGlEQUErQjtBQUMvQix5REFBdUM7QUFDdkMsd0RBQXNDO0FBQ3RDLGdEQUE4QjtBQUM5Qix3REFBc0M7QUFDdEMsMkRBQXlDO0FBQ3pDLHdEQUFzQztBQUN0QyxvREFBa0M7QUFDbEMsa0RBQWdDO0FBQ2hDLGlEQUErQjtBQUMvQixpREFBK0I7QUFDL0IsdURBQXFDO0FBRXJDLHdDQUF3QztBQUN4QyxxREFBbUM7QUFFbkMsNENBQTBDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9hZG90LWxheWVycyc7XG5leHBvcnQgKiBmcm9tICcuL2FsaWFzJztcbmV4cG9ydCAqIGZyb20gJy4vZGxxJztcbmV4cG9ydCAqIGZyb20gJy4vZnVuY3Rpb24tYmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL2Z1bmN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vaGFuZGxlcic7XG5leHBvcnQgKiBmcm9tICcuL2ltYWdlLWZ1bmN0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vbGF5ZXJzJztcbmV4cG9ydCAqIGZyb20gJy4vcGVybWlzc2lvbic7XG5leHBvcnQgKiBmcm9tICcuL3J1bnRpbWUnO1xuZXhwb3J0ICogZnJvbSAnLi9jb2RlJztcbmV4cG9ydCAqIGZyb20gJy4vZmlsZXN5c3RlbSc7XG5leHBvcnQgKiBmcm9tICcuL2xhbWJkYS12ZXJzaW9uJztcbmV4cG9ydCAqIGZyb20gJy4vc2luZ2xldG9uLWxhbWJkYSc7XG5leHBvcnQgKiBmcm9tICcuL2V2ZW50LXNvdXJjZSc7XG5leHBvcnQgKiBmcm9tICcuL2V2ZW50LXNvdXJjZS1tYXBwaW5nJztcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnQtc291cmNlLWZpbHRlcic7XG5leHBvcnQgKiBmcm9tICcuL2Rlc3RpbmF0aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnQtaW52b2tlLWNvbmZpZyc7XG5leHBvcnQgKiBmcm9tICcuL3NjYWxhYmxlLWF0dHJpYnV0ZS1hcGknO1xuZXhwb3J0ICogZnJvbSAnLi9jb2RlLXNpZ25pbmctY29uZmlnJztcbmV4cG9ydCAqIGZyb20gJy4vbGFtYmRhLWluc2lnaHRzJztcbmV4cG9ydCAqIGZyb20gJy4vbG9nLXJldGVudGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2FyY2hpdGVjdHVyZSc7XG5leHBvcnQgKiBmcm9tICcuL2Z1bmN0aW9uLXVybCc7XG5leHBvcnQgKiBmcm9tICcuL3J1bnRpbWUtbWFuYWdlbWVudCc7XG5cbi8vIEFXUzo6TGFtYmRhIENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vbGFtYmRhLmdlbmVyYXRlZCc7XG5cbmltcG9ydCAnLi9sYW1iZGEtYXVnbWVudGF0aW9ucy5nZW5lcmF0ZWQnO1xuIl19