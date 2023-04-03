"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalTaskDefinition = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const _imported_task_definition_1 = require("../../lib/base/_imported-task-definition");
const task_definition_1 = require("../base/task-definition");
/**
 * The details of a task definition run on an External cluster.
 *
 * @resource AWS::ECS::TaskDefinition
 */
class ExternalTaskDefinition extends task_definition_1.TaskDefinition {
    /**
     * Constructs a new instance of the ExternalTaskDefinition class.
     */
    constructor(scope, id, props = {}) {
        super(scope, id, {
            ...props,
            compatibility: task_definition_1.Compatibility.EXTERNAL,
            networkMode: props.networkMode ?? task_definition_1.NetworkMode.BRIDGE,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ExternalTaskDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ExternalTaskDefinition);
            }
            throw error;
        }
    }
    /**
     * Imports a task definition from the specified task definition ARN.
     */
    static fromEc2TaskDefinitionArn(scope, id, externalTaskDefinitionArn) {
        return new _imported_task_definition_1.ImportedTaskDefinition(scope, id, {
            taskDefinitionArn: externalTaskDefinitionArn,
        });
    }
    /**
     * Imports an existing External task definition from its attributes
     */
    static fromExternalTaskDefinitionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_ExternalTaskDefinitionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromExternalTaskDefinitionAttributes);
            }
            throw error;
        }
        return new _imported_task_definition_1.ImportedTaskDefinition(scope, id, {
            taskDefinitionArn: attrs.taskDefinitionArn,
            compatibility: task_definition_1.Compatibility.EXTERNAL,
            networkMode: attrs.networkMode,
            taskRole: attrs.taskRole,
        });
    }
    /**
     * Overriden method to throw error as interface accelerators are not supported for external tasks
     */
    addInferenceAccelerator(_inferenceAccelerator) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_InferenceAccelerator(_inferenceAccelerator);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addInferenceAccelerator);
            }
            throw error;
        }
        throw new Error('Cannot use inference accelerators on tasks that run on External service');
    }
}
exports.ExternalTaskDefinition = ExternalTaskDefinition;
_a = JSII_RTTI_SYMBOL_1;
ExternalTaskDefinition[_a] = { fqn: "@aws-cdk/aws-ecs.ExternalTaskDefinition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZXJuYWwtdGFzay1kZWZpbml0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXh0ZXJuYWwtdGFzay1kZWZpbml0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdGQUFrRjtBQUNsRiw2REFRaUM7QUE4QmpDOzs7O0dBSUc7QUFDSCxNQUFhLHNCQUF1QixTQUFRLGdDQUFjO0lBMEJ4RDs7T0FFRztJQUNILFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBcUMsRUFBRTtRQUMvRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLEdBQUcsS0FBSztZQUNSLGFBQWEsRUFBRSwrQkFBYSxDQUFDLFFBQVE7WUFDckMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLElBQUksNkJBQVcsQ0FBQyxNQUFNO1NBQ3JELENBQUMsQ0FBQzs7Ozs7OytDQWxDTSxzQkFBc0I7Ozs7S0FtQ2hDO0lBbENEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLHdCQUF3QixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLHlCQUFpQztRQUNwRyxPQUFPLElBQUksa0RBQXNCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUMzQyxpQkFBaUIsRUFBRSx5QkFBeUI7U0FDN0MsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxvQ0FBb0MsQ0FDaEQsS0FBZ0IsRUFDaEIsRUFBVSxFQUNWLEtBQXVDOzs7Ozs7Ozs7O1FBRXZDLE9BQU8sSUFBSSxrREFBc0IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQzNDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDMUMsYUFBYSxFQUFFLCtCQUFhLENBQUMsUUFBUTtZQUNyQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDOUIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1NBQ3pCLENBQUMsQ0FBQztLQUNKO0lBYUQ7O09BRUc7SUFDSSx1QkFBdUIsQ0FBQyxxQkFBMkM7Ozs7Ozs7Ozs7UUFDeEUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO0tBQzVGOztBQTFDSCx3REEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEltcG9ydGVkVGFza0RlZmluaXRpb24gfSBmcm9tICcuLi8uLi9saWIvYmFzZS9faW1wb3J0ZWQtdGFzay1kZWZpbml0aW9uJztcbmltcG9ydCB7XG4gIENvbW1vblRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyxcbiAgQ29tbW9uVGFza0RlZmluaXRpb25Qcm9wcyxcbiAgQ29tcGF0aWJpbGl0eSxcbiAgSW5mZXJlbmNlQWNjZWxlcmF0b3IsXG4gIElUYXNrRGVmaW5pdGlvbixcbiAgTmV0d29ya01vZGUsXG4gIFRhc2tEZWZpbml0aW9uLFxufSBmcm9tICcuLi9iYXNlL3Rhc2stZGVmaW5pdGlvbic7XG5cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgZm9yIGEgdGFzayBkZWZpbml0aW9uIHJ1biBvbiBhbiBFeHRlcm5hbCBjbHVzdGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4dGVybmFsVGFza0RlZmluaXRpb25Qcm9wcyBleHRlbmRzIENvbW1vblRhc2tEZWZpbml0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5ldHdvcmtpbmcgbW9kZSB0byB1c2UgZm9yIHRoZSBjb250YWluZXJzIGluIHRoZSB0YXNrLlxuICAgKlxuICAgKiBXaXRoIEVDUyBBbnl3aGVyZSwgc3VwcG9ydGVkIG1vZGVzIGFyZSBicmlkZ2UsIGhvc3QgYW5kIG5vbmUuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5ldHdvcmtNb2RlLkJSSURHRVxuICAgKi9cbiAgcmVhZG9ubHkgbmV0d29ya01vZGU/OiBOZXR3b3JrTW9kZTtcbn1cblxuLyoqXG4gKiBUaGUgaW50ZXJmYWNlIG9mIGEgdGFzayBkZWZpbml0aW9uIHJ1biBvbiBhbiBFeHRlcm5hbCBjbHVzdGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElFeHRlcm5hbFRhc2tEZWZpbml0aW9uIGV4dGVuZHMgSVRhc2tEZWZpbml0aW9uIHtcblxufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgdXNlZCB0byBpbXBvcnQgYW4gZXhpc3RpbmcgRXh0ZXJuYWwgdGFzayBkZWZpbml0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMgZXh0ZW5kcyBDb21tb25UYXNrRGVmaW5pdGlvbkF0dHJpYnV0ZXMge1xuXG59XG5cbi8qKlxuICogVGhlIGRldGFpbHMgb2YgYSB0YXNrIGRlZmluaXRpb24gcnVuIG9uIGFuIEV4dGVybmFsIGNsdXN0ZXIuXG4gKlxuICogQHJlc291cmNlIEFXUzo6RUNTOjpUYXNrRGVmaW5pdGlvblxuICovXG5leHBvcnQgY2xhc3MgRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbiBleHRlbmRzIFRhc2tEZWZpbml0aW9uIGltcGxlbWVudHMgSUV4dGVybmFsVGFza0RlZmluaXRpb24ge1xuICAvKipcbiAgICogSW1wb3J0cyBhIHRhc2sgZGVmaW5pdGlvbiBmcm9tIHRoZSBzcGVjaWZpZWQgdGFzayBkZWZpbml0aW9uIEFSTi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUVjMlRhc2tEZWZpbml0aW9uQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGV4dGVybmFsVGFza0RlZmluaXRpb25Bcm46IHN0cmluZyk6IElFeHRlcm5hbFRhc2tEZWZpbml0aW9uIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkVGFza0RlZmluaXRpb24oc2NvcGUsIGlkLCB7XG4gICAgICB0YXNrRGVmaW5pdGlvbkFybjogZXh0ZXJuYWxUYXNrRGVmaW5pdGlvbkFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIGV4aXN0aW5nIEV4dGVybmFsIHRhc2sgZGVmaW5pdGlvbiBmcm9tIGl0cyBhdHRyaWJ1dGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FeHRlcm5hbFRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyhcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgYXR0cnM6IEV4dGVybmFsVGFza0RlZmluaXRpb25BdHRyaWJ1dGVzLFxuICApOiBJRXh0ZXJuYWxUYXNrRGVmaW5pdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZFRhc2tEZWZpbml0aW9uKHNjb3BlLCBpZCwge1xuICAgICAgdGFza0RlZmluaXRpb25Bcm46IGF0dHJzLnRhc2tEZWZpbml0aW9uQXJuLFxuICAgICAgY29tcGF0aWJpbGl0eTogQ29tcGF0aWJpbGl0eS5FWFRFUk5BTCxcbiAgICAgIG5ldHdvcmtNb2RlOiBhdHRycy5uZXR3b3JrTW9kZSxcbiAgICAgIHRhc2tSb2xlOiBhdHRycy50YXNrUm9sZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBFeHRlcm5hbFRhc2tEZWZpbml0aW9uIGNsYXNzLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEV4dGVybmFsVGFza0RlZmluaXRpb25Qcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIGNvbXBhdGliaWxpdHk6IENvbXBhdGliaWxpdHkuRVhURVJOQUwsXG4gICAgICBuZXR3b3JrTW9kZTogcHJvcHMubmV0d29ya01vZGUgPz8gTmV0d29ya01vZGUuQlJJREdFLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlbiBtZXRob2QgdG8gdGhyb3cgZXJyb3IgYXMgaW50ZXJmYWNlIGFjY2VsZXJhdG9ycyBhcmUgbm90IHN1cHBvcnRlZCBmb3IgZXh0ZXJuYWwgdGFza3NcbiAgICovXG4gIHB1YmxpYyBhZGRJbmZlcmVuY2VBY2NlbGVyYXRvcihfaW5mZXJlbmNlQWNjZWxlcmF0b3I6IEluZmVyZW5jZUFjY2VsZXJhdG9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgdXNlIGluZmVyZW5jZSBhY2NlbGVyYXRvcnMgb24gdGFza3MgdGhhdCBydW4gb24gRXh0ZXJuYWwgc2VydmljZScpO1xuICB9XG59XG4iXX0=