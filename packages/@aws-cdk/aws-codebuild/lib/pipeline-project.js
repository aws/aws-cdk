"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineProject = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline_artifacts_1 = require("./codepipeline-artifacts");
const codepipeline_source_1 = require("./codepipeline-source");
const project_1 = require("./project");
/**
 * A convenience class for CodeBuild Projects that are used in CodePipeline.
 */
class PipelineProject extends project_1.Project {
    constructor(scope, id, props) {
        super(scope, id, {
            source: new codepipeline_source_1.CodePipelineSource(),
            artifacts: new codepipeline_artifacts_1.CodePipelineArtifacts(),
            ...props,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codebuild_PipelineProjectProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, PipelineProject);
            }
            throw error;
        }
    }
}
exports.PipelineProject = PipelineProject;
_a = JSII_RTTI_SYMBOL_1;
PipelineProject[_a] = { fqn: "@aws-cdk/aws-codebuild.PipelineProject", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZWxpbmUtcHJvamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBpcGVsaW5lLXByb2plY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EscUVBQWlFO0FBQ2pFLCtEQUEyRDtBQUMzRCx1Q0FBd0Q7QUFLeEQ7O0dBRUc7QUFDSCxNQUFhLGVBQWdCLFNBQVEsaUJBQU87SUFDMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLE1BQU0sRUFBRSxJQUFJLHdDQUFrQixFQUFFO1lBQ2hDLFNBQVMsRUFBRSxJQUFJLDhDQUFxQixFQUFFO1lBQ3RDLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQzs7Ozs7OytDQU5NLGVBQWU7Ozs7S0FPekI7O0FBUEgsMENBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENvZGVQaXBlbGluZUFydGlmYWN0cyB9IGZyb20gJy4vY29kZXBpcGVsaW5lLWFydGlmYWN0cyc7XG5pbXBvcnQgeyBDb2RlUGlwZWxpbmVTb3VyY2UgfSBmcm9tICcuL2NvZGVwaXBlbGluZS1zb3VyY2UnO1xuaW1wb3J0IHsgQ29tbW9uUHJvamVjdFByb3BzLCBQcm9qZWN0IH0gZnJvbSAnLi9wcm9qZWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVByb2plY3RQcm9wcyBleHRlbmRzIENvbW1vblByb2plY3RQcm9wcyB7XG59XG5cbi8qKlxuICogQSBjb252ZW5pZW5jZSBjbGFzcyBmb3IgQ29kZUJ1aWxkIFByb2plY3RzIHRoYXQgYXJlIHVzZWQgaW4gQ29kZVBpcGVsaW5lLlxuICovXG5leHBvcnQgY2xhc3MgUGlwZWxpbmVQcm9qZWN0IGV4dGVuZHMgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogUGlwZWxpbmVQcm9qZWN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHNvdXJjZTogbmV3IENvZGVQaXBlbGluZVNvdXJjZSgpLFxuICAgICAgYXJ0aWZhY3RzOiBuZXcgQ29kZVBpcGVsaW5lQXJ0aWZhY3RzKCksXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxufVxuIl19