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
__exportStar(require("./bucket"), exports);
__exportStar(require("./bucket-policy"), exports);
__exportStar(require("./destination"), exports);
__exportStar(require("./location"), exports);
__exportStar(require("./rule"), exports);
// AWS::S3 CloudFormation Resources:
__exportStar(require("./s3.generated"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXlCO0FBQ3pCLGtEQUFnQztBQUNoQyxnREFBOEI7QUFDOUIsNkNBQTJCO0FBQzNCLHlDQUF1QjtBQUV2QixvQ0FBb0M7QUFDcEMsaURBQStCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0ICogZnJvbSAnLi9idWNrZXQnO1xuZXhwb3J0ICogZnJvbSAnLi9idWNrZXQtcG9saWN5JztcbmV4cG9ydCAqIGZyb20gJy4vZGVzdGluYXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9sb2NhdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL3J1bGUnO1xuXG4vLyBBV1M6OlMzIENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vczMuZ2VuZXJhdGVkJztcbiJdfQ==