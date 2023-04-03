"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFormationDeployStackInstancesAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const singleton_policy_1 = require("./private/singleton-policy");
const action_1 = require("../action");
const common_1 = require("../common");
/**
 * CodePipeline action to create/update Stack Instances of a StackSet
 *
 * After the initial creation of a stack set, you can add new stack instances by
 * using CloudFormationStackInstances. Template parameter values can be
 * overridden at the stack instance level during create or update stack set
 * instance operations.
 *
 * Each stack set has one template and set of template parameters. When you
 * update the template or template parameters, you update them for the entire
 * set. Then all instance statuses are set to OUTDATED until the changes are
 * deployed to that instance.
 */
class CloudFormationDeployStackInstancesAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            region: props.stackSetRegion,
            provider: 'CloudFormationStackInstances',
            category: codepipeline.ActionCategory.DEPLOY,
            artifactBounds: {
                minInputs: 0,
                maxInputs: 3,
                minOutputs: 0,
                maxOutputs: 0,
            },
            inputs: [
                ...props.parameterOverrides?._artifactsReferenced ?? [],
                ...props.stackInstances?._artifactsReferenced ?? [],
            ],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_CloudFormationDeployStackInstancesActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudFormationDeployStackInstancesAction);
            }
            throw error;
        }
        this.props = props;
        common_1.validatePercentage('failureTolerancePercentage', props.failureTolerancePercentage);
        common_1.validatePercentage('maxAccountConcurrencyPercentage', props.maxAccountConcurrencyPercentage);
    }
    bound(scope, _stage, options) {
        const singletonPolicy = singleton_policy_1.SingletonPolicy.forRole(options.role);
        singletonPolicy.grantCreateUpdateStackSet(this.props);
        const instancesResult = this.props.stackInstances?._bind(scope);
        if ((this.actionProperties.inputs || []).length > 0) {
            options.bucket.grantRead(singletonPolicy);
        }
        return {
            configuration: {
                StackSetName: this.props.stackSetName,
                ParameterOverrides: this.props.parameterOverrides?._render(),
                FailureTolerancePercentage: this.props.failureTolerancePercentage,
                MaxConcurrentPercentage: this.props.maxAccountConcurrencyPercentage,
                ...instancesResult?.stackSetConfiguration,
            },
        };
    }
}
exports.CloudFormationDeployStackInstancesAction = CloudFormationDeployStackInstancesAction;
_a = JSII_RTTI_SYMBOL_1;
CloudFormationDeployStackInstancesAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.CloudFormationDeployStackInstancesAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2tpbnN0YW5jZXMtYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhY2tpbnN0YW5jZXMtYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDBEQUEwRDtBQUUxRCxpRUFBNkQ7QUFFN0Qsc0NBQW1DO0FBQ25DLHNDQUErQztBQTRCL0M7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBYSx3Q0FBeUMsU0FBUSxlQUFNO0lBR2xFLFlBQVksS0FBb0Q7UUFDOUQsS0FBSyxDQUFDO1lBQ0osR0FBRyxLQUFLO1lBQ1IsTUFBTSxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQzVCLFFBQVEsRUFBRSw4QkFBOEI7WUFDeEMsUUFBUSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTTtZQUM1QyxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLENBQUM7Z0JBQ1osU0FBUyxFQUFFLENBQUM7Z0JBQ1osVUFBVSxFQUFFLENBQUM7Z0JBQ2IsVUFBVSxFQUFFLENBQUM7YUFDZDtZQUNELE1BQU0sRUFBRTtnQkFDTixHQUFHLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsSUFBSSxFQUFFO2dCQUN2RCxHQUFHLEtBQUssQ0FBQyxjQUFjLEVBQUUsb0JBQW9CLElBQUksRUFBRTthQUNwRDtTQUNGLENBQUMsQ0FBQzs7Ozs7OytDQW5CTSx3Q0FBd0M7Ozs7UUFxQmpELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLDJCQUFrQixDQUFDLDRCQUE0QixFQUFFLEtBQUssQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ25GLDJCQUFrQixDQUFDLGlDQUFpQyxFQUFFLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0tBQzlGO0lBRVMsS0FBSyxDQUFDLEtBQWdCLEVBQUUsTUFBMkIsRUFBRSxPQUF1QztRQUNwRyxNQUFNLGVBQWUsR0FBRyxrQ0FBZSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUQsZUFBZSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0RCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUMzQztRQUVELE9BQU87WUFDTCxhQUFhLEVBQUU7Z0JBQ2IsWUFBWSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtnQkFDckMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxPQUFPLEVBQUU7Z0JBQzVELDBCQUEwQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsMEJBQTBCO2dCQUNqRSx1QkFBdUIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLCtCQUErQjtnQkFDbkUsR0FBRyxlQUFlLEVBQUUscUJBQXFCO2FBQzFDO1NBQ0YsQ0FBQztLQUNIOztBQTlDSCw0RkErQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFNpbmdsZXRvblBvbGljeSB9IGZyb20gJy4vcHJpdmF0ZS9zaW5nbGV0b24tcG9saWN5JztcbmltcG9ydCB7IENvbW1vbkNsb3VkRm9ybWF0aW9uU3RhY2tTZXRPcHRpb25zLCBTdGFja0luc3RhbmNlcywgU3RhY2tTZXRQYXJhbWV0ZXJzIH0gZnJvbSAnLi9zdGFja3NldC10eXBlcyc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuaW1wb3J0IHsgdmFsaWRhdGVQZXJjZW50YWdlIH0gZnJvbSAnLi4vY29tbW9uJztcblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciB0aGUgQ2xvdWRGb3JtYXRpb25EZXBsb3lTdGFja0luc3RhbmNlc0FjdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIENsb3VkRm9ybWF0aW9uRGVwbG95U3RhY2tJbnN0YW5jZXNBY3Rpb25Qcm9wcyBleHRlbmRzIGNvZGVwaXBlbGluZS5Db21tb25Bd3NBY3Rpb25Qcm9wcywgQ29tbW9uQ2xvdWRGb3JtYXRpb25TdGFja1NldE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIFN0YWNrU2V0IHdlIGFyZSBhZGRpbmcgaW5zdGFuY2VzIHRvXG4gICAqL1xuICByZWFkb25seSBzdGFja1NldE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogU3BlY2lmeSB3aGVyZSB0byBjcmVhdGUgb3IgdXBkYXRlIFN0YWNrIEluc3RhbmNlc1xuICAgKlxuICAgKiBZb3UgY2FuIHNwZWNpZnkgZWl0aGVyIEFXUyBBY2NvdW50cyBJZHMgb3IgQVdTIE9yZ2FuaXphdGlvbnMgT3JnYW5pemF0aW9uYWwgVW5pdHMuXG4gICAqL1xuICByZWFkb25seSBzdGFja0luc3RhbmNlczogU3RhY2tJbnN0YW5jZXM7XG5cbiAgLyoqXG4gICAqIFBhcmFtZXRlciB2YWx1ZXMgdGhhdCBvbmx5IGFwcGx5IHRvIHRoZSBjdXJyZW50IFN0YWNrIEluc3RhbmNlc1xuICAgKlxuICAgKiBUaGVzZSBwYXJhbWV0ZXJzIGFyZSBzaGFyZWQgYmV0d2VlbiBhbGwgaW5zdGFuY2VzIGFkZGVkIGJ5IHRoaXMgYWN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIHBhcmFtZXRlcnMgd2lsbCBiZSBvdmVycmlkZGVuXG4gICAqL1xuICByZWFkb25seSBwYXJhbWV0ZXJPdmVycmlkZXM/OiBTdGFja1NldFBhcmFtZXRlcnM7XG59XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIGFjdGlvbiB0byBjcmVhdGUvdXBkYXRlIFN0YWNrIEluc3RhbmNlcyBvZiBhIFN0YWNrU2V0XG4gKlxuICogQWZ0ZXIgdGhlIGluaXRpYWwgY3JlYXRpb24gb2YgYSBzdGFjayBzZXQsIHlvdSBjYW4gYWRkIG5ldyBzdGFjayBpbnN0YW5jZXMgYnlcbiAqIHVzaW5nIENsb3VkRm9ybWF0aW9uU3RhY2tJbnN0YW5jZXMuIFRlbXBsYXRlIHBhcmFtZXRlciB2YWx1ZXMgY2FuIGJlXG4gKiBvdmVycmlkZGVuIGF0IHRoZSBzdGFjayBpbnN0YW5jZSBsZXZlbCBkdXJpbmcgY3JlYXRlIG9yIHVwZGF0ZSBzdGFjayBzZXRcbiAqIGluc3RhbmNlIG9wZXJhdGlvbnMuXG4gKlxuICogRWFjaCBzdGFjayBzZXQgaGFzIG9uZSB0ZW1wbGF0ZSBhbmQgc2V0IG9mIHRlbXBsYXRlIHBhcmFtZXRlcnMuIFdoZW4geW91XG4gKiB1cGRhdGUgdGhlIHRlbXBsYXRlIG9yIHRlbXBsYXRlIHBhcmFtZXRlcnMsIHlvdSB1cGRhdGUgdGhlbSBmb3IgdGhlIGVudGlyZVxuICogc2V0LiBUaGVuIGFsbCBpbnN0YW5jZSBzdGF0dXNlcyBhcmUgc2V0IHRvIE9VVERBVEVEIHVudGlsIHRoZSBjaGFuZ2VzIGFyZVxuICogZGVwbG95ZWQgdG8gdGhhdCBpbnN0YW5jZS5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3VkRm9ybWF0aW9uRGVwbG95U3RhY2tJbnN0YW5jZXNBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBDbG91ZEZvcm1hdGlvbkRlcGxveVN0YWNrSW5zdGFuY2VzQWN0aW9uUHJvcHM7XG5cbiAgY29uc3RydWN0b3IocHJvcHM6IENsb3VkRm9ybWF0aW9uRGVwbG95U3RhY2tJbnN0YW5jZXNBY3Rpb25Qcm9wcykge1xuICAgIHN1cGVyKHtcbiAgICAgIC4uLnByb3BzLFxuICAgICAgcmVnaW9uOiBwcm9wcy5zdGFja1NldFJlZ2lvbixcbiAgICAgIHByb3ZpZGVyOiAnQ2xvdWRGb3JtYXRpb25TdGFja0luc3RhbmNlcycsXG4gICAgICBjYXRlZ29yeTogY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LkRFUExPWSxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiB7XG4gICAgICAgIG1pbklucHV0czogMCxcbiAgICAgICAgbWF4SW5wdXRzOiAzLFxuICAgICAgICBtaW5PdXRwdXRzOiAwLFxuICAgICAgICBtYXhPdXRwdXRzOiAwLFxuICAgICAgfSxcbiAgICAgIGlucHV0czogW1xuICAgICAgICAuLi5wcm9wcy5wYXJhbWV0ZXJPdmVycmlkZXM/Ll9hcnRpZmFjdHNSZWZlcmVuY2VkID8/IFtdLFxuICAgICAgICAuLi5wcm9wcy5zdGFja0luc3RhbmNlcz8uX2FydGlmYWN0c1JlZmVyZW5jZWQgPz8gW10sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuXG4gICAgdmFsaWRhdGVQZXJjZW50YWdlKCdmYWlsdXJlVG9sZXJhbmNlUGVyY2VudGFnZScsIHByb3BzLmZhaWx1cmVUb2xlcmFuY2VQZXJjZW50YWdlKTtcbiAgICB2YWxpZGF0ZVBlcmNlbnRhZ2UoJ21heEFjY291bnRDb25jdXJyZW5jeVBlcmNlbnRhZ2UnLCBwcm9wcy5tYXhBY2NvdW50Q29uY3VycmVuY3lQZXJjZW50YWdlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBib3VuZChzY29wZTogQ29uc3RydWN0LCBfc3RhZ2U6IGNvZGVwaXBlbGluZS5JU3RhZ2UsIG9wdGlvbnM6IGNvZGVwaXBlbGluZS5BY3Rpb25CaW5kT3B0aW9ucyk6IGNvZGVwaXBlbGluZS5BY3Rpb25Db25maWcge1xuICAgIGNvbnN0IHNpbmdsZXRvblBvbGljeSA9IFNpbmdsZXRvblBvbGljeS5mb3JSb2xlKG9wdGlvbnMucm9sZSk7XG4gICAgc2luZ2xldG9uUG9saWN5LmdyYW50Q3JlYXRlVXBkYXRlU3RhY2tTZXQodGhpcy5wcm9wcyk7XG5cbiAgICBjb25zdCBpbnN0YW5jZXNSZXN1bHQgPSB0aGlzLnByb3BzLnN0YWNrSW5zdGFuY2VzPy5fYmluZChzY29wZSk7XG5cbiAgICBpZiAoKHRoaXMuYWN0aW9uUHJvcGVydGllcy5pbnB1dHMgfHwgW10pLmxlbmd0aCA+IDApIHtcbiAgICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZChzaW5nbGV0b25Qb2xpY3kpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFN0YWNrU2V0TmFtZTogdGhpcy5wcm9wcy5zdGFja1NldE5hbWUsXG4gICAgICAgIFBhcmFtZXRlck92ZXJyaWRlczogdGhpcy5wcm9wcy5wYXJhbWV0ZXJPdmVycmlkZXM/Ll9yZW5kZXIoKSxcbiAgICAgICAgRmFpbHVyZVRvbGVyYW5jZVBlcmNlbnRhZ2U6IHRoaXMucHJvcHMuZmFpbHVyZVRvbGVyYW5jZVBlcmNlbnRhZ2UsXG4gICAgICAgIE1heENvbmN1cnJlbnRQZXJjZW50YWdlOiB0aGlzLnByb3BzLm1heEFjY291bnRDb25jdXJyZW5jeVBlcmNlbnRhZ2UsXG4gICAgICAgIC4uLmluc3RhbmNlc1Jlc3VsdD8uc3RhY2tTZXRDb25maWd1cmF0aW9uLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=