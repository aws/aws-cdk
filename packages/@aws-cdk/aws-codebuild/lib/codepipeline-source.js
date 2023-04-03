"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineSource = void 0;
const source_1 = require("./source");
const source_types_1 = require("./source-types");
/**
 * CodePipeline Source definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 */
class CodePipelineSource extends source_1.Source {
    constructor() {
        super({});
        this.type = source_types_1.CODEPIPELINE_SOURCE_ARTIFACTS_TYPE;
    }
}
exports.CodePipelineSource = CodePipelineSource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZXBpcGVsaW5lLXNvdXJjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGVwaXBlbGluZS1zb3VyY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQWtDO0FBQ2xDLGlEQUFvRTtBQUVwRTs7OztHQUlHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxlQUFNO0lBRzVDO1FBQ0UsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBSEksU0FBSSxHQUFHLGlEQUFrQyxDQUFDO0tBSXpEO0NBQ0Y7QUFORCxnREFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNvdXJjZSB9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7IENPREVQSVBFTElORV9TT1VSQ0VfQVJUSUZBQ1RTX1RZUEUgfSBmcm9tICcuL3NvdXJjZS10eXBlcyc7XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIFNvdXJjZSBkZWZpbml0aW9uIGZvciBhIENvZGVCdWlsZCBQcm9qZWN0LlxuICogKk5vdGUqOiB0aGlzIHR5cGUgY2Fubm90IGJlIHVzZWQgYXMgYSBzZWNvbmRhcnkgc291cmNlLFxuICogYW5kIGJlY2F1c2Ugb2YgdGhhdCwgeW91J3JlIG5vdCBhbGxvd2VkIHRvIHNwZWNpZnkgYW4gaWRlbnRpZmllciBmb3IgaXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2RlUGlwZWxpbmVTb3VyY2UgZXh0ZW5kcyBTb3VyY2Uge1xuICBwdWJsaWMgcmVhZG9ubHkgdHlwZSA9IENPREVQSVBFTElORV9TT1VSQ0VfQVJUSUZBQ1RTX1RZUEU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe30pO1xuICB9XG59XG4iXX0=