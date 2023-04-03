"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelineArtifacts = void 0;
const artifacts_1 = require("./artifacts");
/**
 * CodePipeline Artifact definition for a CodeBuild Project.
 * *Note*: this type cannot be used as a secondary artifact,
 * and because of that, you're not allowed to specify an identifier for it.
 */
class CodePipelineArtifacts extends artifacts_1.Artifacts {
    constructor() {
        super({});
        this.type = 'CODEPIPELINE';
    }
}
exports.CodePipelineArtifacts = CodePipelineArtifacts;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZXBpcGVsaW5lLWFydGlmYWN0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGVwaXBlbGluZS1hcnRpZmFjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXdDO0FBRXhDOzs7O0dBSUc7QUFDSCxNQUFhLHFCQUFzQixTQUFRLHFCQUFTO0lBR2xEO1FBQ0UsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBSEksU0FBSSxHQUFHLGNBQWMsQ0FBQztLQUlyQztDQUNGO0FBTkQsc0RBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcnRpZmFjdHMgfSBmcm9tICcuL2FydGlmYWN0cyc7XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIEFydGlmYWN0IGRlZmluaXRpb24gZm9yIGEgQ29kZUJ1aWxkIFByb2plY3QuXG4gKiAqTm90ZSo6IHRoaXMgdHlwZSBjYW5ub3QgYmUgdXNlZCBhcyBhIHNlY29uZGFyeSBhcnRpZmFjdCxcbiAqIGFuZCBiZWNhdXNlIG9mIHRoYXQsIHlvdSdyZSBub3QgYWxsb3dlZCB0byBzcGVjaWZ5IGFuIGlkZW50aWZpZXIgZm9yIGl0LlxuICovXG5leHBvcnQgY2xhc3MgQ29kZVBpcGVsaW5lQXJ0aWZhY3RzIGV4dGVuZHMgQXJ0aWZhY3RzIHtcbiAgcHVibGljIHJlYWRvbmx5IHR5cGUgPSAnQ09ERVBJUEVMSU5FJztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7fSk7XG4gIH1cbn1cbiJdfQ==