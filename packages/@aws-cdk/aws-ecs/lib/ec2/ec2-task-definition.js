"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2TaskDefinition = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const _imported_task_definition_1 = require("../base/_imported-task-definition");
const task_definition_1 = require("../base/task-definition");
/**
 * The details of a task definition run on an EC2 cluster.
 *
 * @resource AWS::ECS::TaskDefinition
 */
class Ec2TaskDefinition extends task_definition_1.TaskDefinition {
    /**
     * Constructs a new instance of the Ec2TaskDefinition class.
     */
    constructor(scope, id, props = {}) {
        super(scope, id, {
            ...props,
            compatibility: task_definition_1.Compatibility.EC2,
            placementConstraints: props.placementConstraints,
            ipcMode: props.ipcMode,
            pidMode: props.pidMode,
            inferenceAccelerators: props.inferenceAccelerators,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Ec2TaskDefinitionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Ec2TaskDefinition);
            }
            throw error;
        }
    }
    /**
     * Imports a task definition from the specified task definition ARN.
     */
    static fromEc2TaskDefinitionArn(scope, id, ec2TaskDefinitionArn) {
        return new _imported_task_definition_1.ImportedTaskDefinition(scope, id, {
            taskDefinitionArn: ec2TaskDefinitionArn,
        });
    }
    /**
     * Imports an existing Ec2 task definition from its attributes
     */
    static fromEc2TaskDefinitionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_Ec2TaskDefinitionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEc2TaskDefinitionAttributes);
            }
            throw error;
        }
        return new _imported_task_definition_1.ImportedTaskDefinition(scope, id, {
            taskDefinitionArn: attrs.taskDefinitionArn,
            compatibility: task_definition_1.Compatibility.EC2,
            networkMode: attrs.networkMode,
            taskRole: attrs.taskRole,
        });
    }
}
exports.Ec2TaskDefinition = Ec2TaskDefinition;
_a = JSII_RTTI_SYMBOL_1;
Ec2TaskDefinition[_a] = { fqn: "@aws-cdk/aws-ecs.Ec2TaskDefinition", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWMyLXRhc2stZGVmaW5pdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjMi10YXNrLWRlZmluaXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsaUZBQTJFO0FBQzNFLDZEQVVpQztBQW1FakM7Ozs7R0FJRztBQUNILE1BQWEsaUJBQWtCLFNBQVEsZ0NBQWM7SUEyQm5EOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFnQyxFQUFFO1FBQzFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsR0FBRyxLQUFLO1lBQ1IsYUFBYSxFQUFFLCtCQUFhLENBQUMsR0FBRztZQUNoQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsb0JBQW9CO1lBQ2hELE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIscUJBQXFCLEVBQUUsS0FBSyxDQUFDLHFCQUFxQjtTQUNuRCxDQUFDLENBQUM7Ozs7OzsrQ0F0Q00saUJBQWlCOzs7O0tBdUMzQjtJQXJDRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxvQkFBNEI7UUFDL0YsT0FBTyxJQUFJLGtEQUFzQixDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDM0MsaUJBQWlCLEVBQUUsb0JBQW9CO1NBQ3hDLENBQUMsQ0FBQztLQUNKO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsK0JBQStCLENBQzNDLEtBQWdCLEVBQ2hCLEVBQVUsRUFDVixLQUFrQzs7Ozs7Ozs7OztRQUVsQyxPQUFPLElBQUksa0RBQXNCLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUMzQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO1lBQzFDLGFBQWEsRUFBRSwrQkFBYSxDQUFDLEdBQUc7WUFDaEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQzlCLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtTQUN6QixDQUFDLENBQUM7S0FDSjs7QUF6QkgsOENBd0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJbXBvcnRlZFRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi4vYmFzZS9faW1wb3J0ZWQtdGFzay1kZWZpbml0aW9uJztcbmltcG9ydCB7XG4gIENvbW1vblRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyxcbiAgQ29tbW9uVGFza0RlZmluaXRpb25Qcm9wcyxcbiAgQ29tcGF0aWJpbGl0eSxcbiAgSXBjTW9kZSxcbiAgSVRhc2tEZWZpbml0aW9uLFxuICBOZXR3b3JrTW9kZSxcbiAgUGlkTW9kZSxcbiAgVGFza0RlZmluaXRpb24sXG4gIEluZmVyZW5jZUFjY2VsZXJhdG9yLFxufSBmcm9tICcuLi9iYXNlL3Rhc2stZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBQbGFjZW1lbnRDb25zdHJhaW50IH0gZnJvbSAnLi4vcGxhY2VtZW50JztcblxuLyoqXG4gKiBUaGUgcHJvcGVydGllcyBmb3IgYSB0YXNrIGRlZmluaXRpb24gcnVuIG9uIGFuIEVDMiBjbHVzdGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjMlRhc2tEZWZpbml0aW9uUHJvcHMgZXh0ZW5kcyBDb21tb25UYXNrRGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBEb2NrZXIgbmV0d29ya2luZyBtb2RlIHRvIHVzZSBmb3IgdGhlIGNvbnRhaW5lcnMgaW4gdGhlIHRhc2suXG4gICAqXG4gICAqIFRoZSB2YWxpZCB2YWx1ZXMgYXJlIE5PTkUsIEJSSURHRSwgQVdTX1ZQQywgYW5kIEhPU1QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTmV0d29ya01vZGUuQlJJREdFIGZvciBFQzIgdGFza3MsIEFXU19WUEMgZm9yIEZhcmdhdGUgdGFza3MuXG4gICAqL1xuICByZWFkb25seSBuZXR3b3JrTW9kZT86IE5ldHdvcmtNb2RlO1xuXG4gIC8qKlxuICAgKiBBbiBhcnJheSBvZiBwbGFjZW1lbnQgY29uc3RyYWludCBvYmplY3RzIHRvIHVzZSBmb3IgdGhlIHRhc2suIFlvdSBjYW5cbiAgICogc3BlY2lmeSBhIG1heGltdW0gb2YgMTAgY29uc3RyYWludHMgcGVyIHRhc2sgKHRoaXMgbGltaXQgaW5jbHVkZXNcbiAgICogY29uc3RyYWludHMgaW4gdGhlIHRhc2sgZGVmaW5pdGlvbiBhbmQgdGhvc2Ugc3BlY2lmaWVkIGF0IHJ1biB0aW1lKS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBwbGFjZW1lbnQgY29uc3RyYWludHMuXG4gICAqL1xuICByZWFkb25seSBwbGFjZW1lbnRDb25zdHJhaW50cz86IFBsYWNlbWVudENvbnN0cmFpbnRbXTtcblxuICAvKipcbiAgICogVGhlIElQQyByZXNvdXJjZSBuYW1lc3BhY2UgdG8gdXNlIGZvciB0aGUgY29udGFpbmVycyBpbiB0aGUgdGFzay5cbiAgICpcbiAgICogTm90IHN1cHBvcnRlZCBpbiBGYXJnYXRlIGFuZCBXaW5kb3dzIGNvbnRhaW5lcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSXBjTW9kZSB1c2VkIGJ5IHRoZSB0YXNrIGlzIG5vdCBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IGlwY01vZGU/OiBJcGNNb2RlO1xuXG4gIC8qKlxuICAgKiBUaGUgcHJvY2VzcyBuYW1lc3BhY2UgdG8gdXNlIGZvciB0aGUgY29udGFpbmVycyBpbiB0aGUgdGFzay5cbiAgICpcbiAgICogTm90IHN1cHBvcnRlZCBpbiBGYXJnYXRlIGFuZCBXaW5kb3dzIGNvbnRhaW5lcnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gUGlkTW9kZSB1c2VkIGJ5IHRoZSB0YXNrIGlzIG5vdCBzcGVjaWZpZWRcbiAgICovXG4gIHJlYWRvbmx5IHBpZE1vZGU/OiBQaWRNb2RlO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5mZXJlbmNlIGFjY2VsZXJhdG9ycyB0byB1c2UgZm9yIHRoZSBjb250YWluZXJzIGluIHRoZSB0YXNrLlxuICAgKlxuICAgKiBOb3Qgc3VwcG9ydGVkIGluIEZhcmdhdGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gaW5mZXJlbmNlIGFjY2VsZXJhdG9ycy5cbiAgICovXG4gIHJlYWRvbmx5IGluZmVyZW5jZUFjY2VsZXJhdG9ycz86IEluZmVyZW5jZUFjY2VsZXJhdG9yW107XG59XG5cbi8qKlxuICogVGhlIGludGVyZmFjZSBvZiBhIHRhc2sgZGVmaW5pdGlvbiBydW4gb24gYW4gRUMyIGNsdXN0ZXIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUVjMlRhc2tEZWZpbml0aW9uIGV4dGVuZHMgSVRhc2tEZWZpbml0aW9uIHtcblxufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgdXNlZCB0byBpbXBvcnQgYW4gZXhpc3RpbmcgRUMyIHRhc2sgZGVmaW5pdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjMlRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyBleHRlbmRzIENvbW1vblRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyB7XG5cbn1cblxuLyoqXG4gKiBUaGUgZGV0YWlscyBvZiBhIHRhc2sgZGVmaW5pdGlvbiBydW4gb24gYW4gRUMyIGNsdXN0ZXIuXG4gKlxuICogQHJlc291cmNlIEFXUzo6RUNTOjpUYXNrRGVmaW5pdGlvblxuICovXG5leHBvcnQgY2xhc3MgRWMyVGFza0RlZmluaXRpb24gZXh0ZW5kcyBUYXNrRGVmaW5pdGlvbiBpbXBsZW1lbnRzIElFYzJUYXNrRGVmaW5pdGlvbiB7XG5cbiAgLyoqXG4gICAqIEltcG9ydHMgYSB0YXNrIGRlZmluaXRpb24gZnJvbSB0aGUgc3BlY2lmaWVkIHRhc2sgZGVmaW5pdGlvbiBBUk4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FYzJUYXNrRGVmaW5pdGlvbkFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBlYzJUYXNrRGVmaW5pdGlvbkFybjogc3RyaW5nKTogSUVjMlRhc2tEZWZpbml0aW9uIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkVGFza0RlZmluaXRpb24oc2NvcGUsIGlkLCB7XG4gICAgICB0YXNrRGVmaW5pdGlvbkFybjogZWMyVGFza0RlZmluaXRpb25Bcm4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0cyBhbiBleGlzdGluZyBFYzIgdGFzayBkZWZpbml0aW9uIGZyb20gaXRzIGF0dHJpYnV0ZXNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUVjMlRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyhcbiAgICBzY29wZTogQ29uc3RydWN0LFxuICAgIGlkOiBzdHJpbmcsXG4gICAgYXR0cnM6IEVjMlRhc2tEZWZpbml0aW9uQXR0cmlidXRlcyxcbiAgKTogSUVjMlRhc2tEZWZpbml0aW9uIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydGVkVGFza0RlZmluaXRpb24oc2NvcGUsIGlkLCB7XG4gICAgICB0YXNrRGVmaW5pdGlvbkFybjogYXR0cnMudGFza0RlZmluaXRpb25Bcm4sXG4gICAgICBjb21wYXRpYmlsaXR5OiBDb21wYXRpYmlsaXR5LkVDMixcbiAgICAgIG5ldHdvcmtNb2RlOiBhdHRycy5uZXR3b3JrTW9kZSxcbiAgICAgIHRhc2tSb2xlOiBhdHRycy50YXNrUm9sZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBFYzJUYXNrRGVmaW5pdGlvbiBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFYzJUYXNrRGVmaW5pdGlvblByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgY29tcGF0aWJpbGl0eTogQ29tcGF0aWJpbGl0eS5FQzIsXG4gICAgICBwbGFjZW1lbnRDb25zdHJhaW50czogcHJvcHMucGxhY2VtZW50Q29uc3RyYWludHMsXG4gICAgICBpcGNNb2RlOiBwcm9wcy5pcGNNb2RlLFxuICAgICAgcGlkTW9kZTogcHJvcHMucGlkTW9kZSxcbiAgICAgIGluZmVyZW5jZUFjY2VsZXJhdG9yczogcHJvcHMuaW5mZXJlbmNlQWNjZWxlcmF0b3JzLFxuICAgIH0pO1xuICB9XG59XG4iXX0=