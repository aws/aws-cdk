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
// AWS::Batch CloudFormation Resources:
__exportStar(require("./ecs-job-definition"), exports);
__exportStar(require("./eks-job-definition"), exports);
__exportStar(require("./ecs-container-definition"), exports);
__exportStar(require("./eks-container-definition"), exports);
__exportStar(require("./job-definition-base"), exports);
__exportStar(require("./job-queue"), exports);
__exportStar(require("./linux-parameters"), exports);
__exportStar(require("./managed-compute-environment"), exports);
__exportStar(require("./multinode-job-definition"), exports);
__exportStar(require("./scheduling-policy"), exports);
__exportStar(require("./unmanaged-compute-environment"), exports);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXVDO0FBQ3ZDLHVEQUFxQztBQUVyQyx1REFBcUM7QUFDckMsNkRBQTJDO0FBQzNDLDZEQUEyQztBQUMzQyx3REFBc0M7QUFDdEMsOENBQTRCO0FBQzVCLHFEQUFtQztBQUNuQyxnRUFBOEM7QUFDOUMsNkRBQTJDO0FBQzNDLHNEQUFvQztBQUNwQyxrRUFBZ0QiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBV1M6OkJhdGNoIENsb3VkRm9ybWF0aW9uIFJlc291cmNlczpcbmV4cG9ydCAqIGZyb20gJy4vZWNzLWpvYi1kZWZpbml0aW9uJztcbmV4cG9ydCB7IElDb21wdXRlRW52aXJvbm1lbnQsIENvbXB1dGVFbnZpcm9ubWVudFByb3BzIH0gZnJvbSAnLi9jb21wdXRlLWVudmlyb25tZW50LWJhc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9la3Mtam9iLWRlZmluaXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9lY3MtY29udGFpbmVyLWRlZmluaXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9la3MtY29udGFpbmVyLWRlZmluaXRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9qb2ItZGVmaW5pdGlvbi1iYXNlJztcbmV4cG9ydCAqIGZyb20gJy4vam9iLXF1ZXVlJztcbmV4cG9ydCAqIGZyb20gJy4vbGludXgtcGFyYW1ldGVycyc7XG5leHBvcnQgKiBmcm9tICcuL21hbmFnZWQtY29tcHV0ZS1lbnZpcm9ubWVudCc7XG5leHBvcnQgKiBmcm9tICcuL211bHRpbm9kZS1qb2ItZGVmaW5pdGlvbic7XG5leHBvcnQgKiBmcm9tICcuL3NjaGVkdWxpbmctcG9saWN5JztcbmV4cG9ydCAqIGZyb20gJy4vdW5tYW5hZ2VkLWNvbXB1dGUtZW52aXJvbm1lbnQnOyJdfQ==