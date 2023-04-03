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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxvREFBa0M7QUFDbEMscURBQW1DO0FBQ25DLG1EQUFpQztBQUNqQyx5Q0FBdUI7QUFDdkIsMkNBQXlCO0FBQ3pCLHlDQUF1QjtBQUN2QiwwQ0FBd0I7QUFDeEIsOENBQTRCO0FBQzVCLCtDQUE2QjtBQUM3QixrREFBZ0M7QUFDaEMsMENBQXdCO0FBQ3hCLHNEQUFvQztBQUNwQyxrREFBZ0M7QUFDaEMseURBQXVDO0FBQ3ZDLGtEQUFnQztBQUNoQywrQ0FBNkI7QUFDN0IsMENBQXdCO0FBRXhCLHFDQUFxQztBQUNyQyxrREFBZ0MiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgKiBmcm9tICcuL3BvbGljeS1kb2N1bWVudCc7XG5leHBvcnQgKiBmcm9tICcuL3BvbGljeS1zdGF0ZW1lbnQnO1xuZXhwb3J0ICogZnJvbSAnLi9tYW5hZ2VkLXBvbGljeSc7XG5leHBvcnQgKiBmcm9tICcuL3JvbGUnO1xuZXhwb3J0ICogZnJvbSAnLi9wb2xpY3knO1xuZXhwb3J0ICogZnJvbSAnLi91c2VyJztcbmV4cG9ydCAqIGZyb20gJy4vZ3JvdXAnO1xuZXhwb3J0ICogZnJvbSAnLi9sYXp5LXJvbGUnO1xuZXhwb3J0ICogZnJvbSAnLi9wcmluY2lwYWxzJztcbmV4cG9ydCAqIGZyb20gJy4vaWRlbnRpdHktYmFzZSc7XG5leHBvcnQgKiBmcm9tICcuL2dyYW50JztcbmV4cG9ydCAqIGZyb20gJy4vdW5rbm93bi1wcmluY2lwYWwnO1xuZXhwb3J0ICogZnJvbSAnLi9vaWRjLXByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vcGVybWlzc2lvbnMtYm91bmRhcnknO1xuZXhwb3J0ICogZnJvbSAnLi9zYW1sLXByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vYWNjZXNzLWtleSc7XG5leHBvcnQgKiBmcm9tICcuL3V0aWxzJztcblxuLy8gQVdTOjpJQU0gQ2xvdWRGb3JtYXRpb24gUmVzb3VyY2VzOlxuZXhwb3J0ICogZnJvbSAnLi9pYW0uZ2VuZXJhdGVkJztcbiJdfQ==