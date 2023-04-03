"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./policy-document"), exports);
__exportStar(require("./policy-statement"), exports);
__exportStar(require("./managed-policy"), exports);
__exportStar(require("./role"), exports);
__exportStar(require("./policy"), exports);
__exportStar(require("./user"), exports);
__exportStar(require("./group"), exports);
__exportStar(require("./lazy-role"), exports);
__exportStar(require("./principals"), exports);
__exportStar(require("./identity-base"), exports);
__exportStar(require("./grant"), exports);
__exportStar(require("./unknown-principal"), exports);
__exportStar(require("./oidc-provider"), exports);
__exportStar(require("./permissions-boundary"), exports);
__exportStar(require("./saml-provider"), exports);
__exportStar(require("./access-key"), exports);
__exportStar(require("./utils"), exports);
// AWS::IAM CloudFormation Resources:
__exportStar(require("./iam.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQWtDO0FBQ2xDLHFEQUFtQztBQUNuQyxtREFBaUM7QUFDakMseUNBQXVCO0FBQ3ZCLDJDQUF5QjtBQUN6Qix5Q0FBdUI7QUFDdkIsMENBQXdCO0FBQ3hCLDhDQUE0QjtBQUM1QiwrQ0FBNkI7QUFDN0Isa0RBQWdDO0FBQ2hDLDBDQUF3QjtBQUN4QixzREFBb0M7QUFDcEMsa0RBQWdDO0FBQ2hDLHlEQUF1QztBQUN2QyxrREFBZ0M7QUFDaEMsK0NBQTZCO0FBQzdCLDBDQUF3QjtBQUV4QixxQ0FBcUM7QUFDckMsa0RBQWdDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9wb2xpY3ktZG9jdW1lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9wb2xpY3ktc3RhdGVtZW50JztcbmV4cG9ydCAqIGZyb20gJy4vbWFuYWdlZC1wb2xpY3knO1xuZXhwb3J0ICogZnJvbSAnLi9yb2xlJztcbmV4cG9ydCAqIGZyb20gJy4vcG9saWN5JztcbmV4cG9ydCAqIGZyb20gJy4vdXNlcic7XG5leHBvcnQgKiBmcm9tICcuL2dyb3VwJztcbmV4cG9ydCAqIGZyb20gJy4vbGF6eS1yb2xlJztcbmV4cG9ydCAqIGZyb20gJy4vcHJpbmNpcGFscyc7XG5leHBvcnQgKiBmcm9tICcuL2lkZW50aXR5LWJhc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9ncmFudCc7XG5leHBvcnQgKiBmcm9tICcuL3Vua25vd24tcHJpbmNpcGFsJztcbmV4cG9ydCAqIGZyb20gJy4vb2lkYy1wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL3Blcm1pc3Npb25zLWJvdW5kYXJ5JztcbmV4cG9ydCAqIGZyb20gJy4vc2FtbC1wcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL2FjY2Vzcy1rZXknO1xuZXhwb3J0ICogZnJvbSAnLi91dGlscyc7XG5cbi8vIEFXUzo6SUFNIENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vaWFtLmdlbmVyYXRlZCc7XG4iXX0=