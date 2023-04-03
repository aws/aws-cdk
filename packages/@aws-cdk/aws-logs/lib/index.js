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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQTRDO0FBQzVDLDhDQUE0QjtBQUM1QiwrQ0FBNkI7QUFDN0Isa0RBQWdDO0FBQ2hDLDRDQUEwQjtBQUMxQix3REFBc0M7QUFDdEMsa0RBQWdDO0FBQ2hDLDJDQUF5QjtBQUN6QixxREFBbUM7QUFFbkMsc0NBQXNDO0FBQ3RDLG1EQUFpQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vY3Jvc3MtYWNjb3VudC1kZXN0aW5hdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL2xvZy1ncm91cCc7XG5leHBvcnQgKiBmcm9tICcuL2xvZy1zdHJlYW0nO1xuZXhwb3J0ICogZnJvbSAnLi9tZXRyaWMtZmlsdGVyJztcbmV4cG9ydCAqIGZyb20gJy4vcGF0dGVybic7XG5leHBvcnQgKiBmcm9tICcuL3N1YnNjcmlwdGlvbi1maWx0ZXInO1xuZXhwb3J0ICogZnJvbSAnLi9sb2ctcmV0ZW50aW9uJztcbmV4cG9ydCAqIGZyb20gJy4vcG9saWN5JztcbmV4cG9ydCAqIGZyb20gJy4vcXVlcnktZGVmaW5pdGlvbic7XG5cbi8vIEFXUzo6TG9ncyBDbG91ZEZvcm1hdGlvbiBSZXNvdXJjZXM6XG5leHBvcnQgKiBmcm9tICcuL2xvZ3MuZ2VuZXJhdGVkJztcbiJdfQ==