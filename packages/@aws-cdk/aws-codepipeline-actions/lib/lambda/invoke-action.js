"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaInvokeAction = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const action_1 = require("../action");
/**
 * CodePipeline invoke Action that is provided by an AWS Lambda function.
 *
 * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html
 */
class LambdaInvokeAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            resource: props.lambda,
            category: codepipeline.ActionCategory.INVOKE,
            provider: 'Lambda',
            artifactBounds: {
                minInputs: 0,
                maxInputs: 5,
                minOutputs: 0,
                maxOutputs: 5,
            },
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_LambdaInvokeActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LambdaInvokeAction);
            }
            throw error;
        }
        this.props = props;
        if (props.userParameters && props.userParametersString) {
            throw new Error('Only one of userParameters or userParametersString can be specified');
        }
    }
    /**
     * Reference a CodePipeline variable defined by the Lambda function this action points to.
     * Variables in Lambda invoke actions are defined by calling the PutJobSuccessResult CodePipeline API call
     * with the 'outputVariables' property filled.
     *
     * @param variableName the name of the variable to reference.
     *   A variable by this name must be present in the 'outputVariables' section of the PutJobSuccessResult
     *   request that the Lambda function calls when the action is invoked
     *
     * @see https://docs.aws.amazon.com/codepipeline/latest/APIReference/API_PutJobSuccessResult.html
     */
    variable(variableName) {
        return this.variableExpression(variableName);
    }
    bound(scope, _stage, options) {
        // allow pipeline to list functions
        options.role.addToPolicy(new iam.PolicyStatement({
            actions: ['lambda:ListFunctions'],
            resources: ['*'],
        }));
        // allow pipeline to invoke this lambda functionn
        this.props.lambda.grantInvoke(options.role);
        // allow the Role access to the Bucket, if there are any inputs/outputs
        if ((this.actionProperties.inputs || []).length > 0) {
            options.bucket.grantRead(options.role);
        }
        if ((this.actionProperties.outputs || []).length > 0) {
            options.bucket.grantWrite(options.role);
        }
        // allow lambda to put job results for this pipeline
        // CodePipeline requires this to be granted to '*'
        // (the Pipeline ARN will not be enough)
        this.props.lambda.addToRolePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['codepipeline:PutJobSuccessResult', 'codepipeline:PutJobFailureResult'],
        }));
        return {
            configuration: {
                FunctionName: this.props.lambda.functionName,
                UserParameters: this.props.userParametersString ?? core_1.Stack.of(scope).toJsonString(this.props.userParameters),
            },
        };
    }
}
exports.LambdaInvokeAction = LambdaInvokeAction;
_a = JSII_RTTI_SYMBOL_1;
LambdaInvokeAction[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.LambdaInvokeAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52b2tlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludm9rZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBQzFELHdDQUF3QztBQUV4Qyx3Q0FBc0M7QUFFdEMsc0NBQW1DO0FBd0RuQzs7OztHQUlHO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxlQUFNO0lBRzVDLFlBQVksS0FBOEI7UUFDeEMsS0FBSyxDQUFDO1lBQ0osR0FBRyxLQUFLO1lBQ1IsUUFBUSxFQUFFLEtBQUssQ0FBQyxNQUFNO1lBQ3RCLFFBQVEsRUFBRSxZQUFZLENBQUMsY0FBYyxDQUFDLE1BQU07WUFDNUMsUUFBUSxFQUFFLFFBQVE7WUFDbEIsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFNBQVMsRUFBRSxDQUFDO2dCQUNaLFVBQVUsRUFBRSxDQUFDO2dCQUNiLFVBQVUsRUFBRSxDQUFDO2FBQ2Q7U0FDRixDQUFDLENBQUM7Ozs7OzsrQ0FmTSxrQkFBa0I7Ozs7UUFpQjNCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksS0FBSyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUMsb0JBQW9CLEVBQUU7WUFDdEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO1NBQ3hGO0tBQ0Y7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksUUFBUSxDQUFDLFlBQW9CO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzlDO0lBRVMsS0FBSyxDQUFDLEtBQWdCLEVBQUUsTUFBMkIsRUFBRSxPQUF1QztRQUVwRyxtQ0FBbUM7UUFDbkMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQy9DLE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO1lBQ2pDLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVDLHVFQUF1RTtRQUN2RSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN4QztRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDcEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pDO1FBRUQsb0RBQW9EO1FBQ3BELGtEQUFrRDtRQUNsRCx3Q0FBd0M7UUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN4RCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxFQUFFLENBQUMsa0NBQWtDLEVBQUUsa0NBQWtDLENBQUM7U0FDbEYsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1lBQ0wsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxZQUFZO2dCQUM1QyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsSUFBSSxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQzthQUMzRztTQUNGLENBQUM7S0FDSDs7QUF4RUgsZ0RBeUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi4vYWN0aW9uJztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBvZiB0aGUgYExhbWJkYUludm9rZUFjdGlvbiBMYW1iZGEgaW52b2tlIENvZGVQaXBlbGluZSBBY3Rpb25gLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIExhbWJkYUludm9rZUFjdGlvblByb3BzIGV4dGVuZHMgY29kZXBpcGVsaW5lLkNvbW1vbkF3c0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBvcHRpb25hbCBpbnB1dCBBcnRpZmFjdHMgb2YgdGhlIEFjdGlvbi5cbiAgICogQSBMYW1iZGEgQWN0aW9uIGNhbiBoYXZlIHVwIHRvIDUgaW5wdXRzLlxuICAgKiBUaGUgaW5wdXRzIHdpbGwgYXBwZWFyIGluIHRoZSBldmVudCBwYXNzZWQgdG8gdGhlIExhbWJkYSxcbiAgICogdW5kZXIgdGhlIGAnQ29kZVBpcGVsaW5lLmpvYicuZGF0YS5pbnB1dEFydGlmYWN0c2AgcGF0aC5cbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIEFjdGlvbiB3aWxsIG5vdCBoYXZlIGFueSBpbnB1dHNcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZXBpcGVsaW5lL2xhdGVzdC91c2VyZ3VpZGUvYWN0aW9ucy1pbnZva2UtbGFtYmRhLWZ1bmN0aW9uLmh0bWwjYWN0aW9ucy1pbnZva2UtbGFtYmRhLWZ1bmN0aW9uLWpzb24tZXZlbnQtZXhhbXBsZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRzPzogY29kZXBpcGVsaW5lLkFydGlmYWN0W107XG5cbiAgLyoqXG4gICAqIFRoZSBvcHRpb25hbCBuYW1lcyBvZiB0aGUgb3V0cHV0IEFydGlmYWN0cyBvZiB0aGUgQWN0aW9uLlxuICAgKiBBIExhbWJkYSBBY3Rpb24gY2FuIGhhdmUgdXAgdG8gNSBvdXRwdXRzLlxuICAgKiBUaGUgb3V0cHV0cyB3aWxsIGFwcGVhciBpbiB0aGUgZXZlbnQgcGFzc2VkIHRvIHRoZSBMYW1iZGEsXG4gICAqIHVuZGVyIHRoZSBgJ0NvZGVQaXBlbGluZS5qb2InLmRhdGEub3V0cHV0QXJ0aWZhY3RzYCBwYXRoLlxuICAgKiBJdCBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIExhbWJkYSB0byB1cGxvYWQgWklQIGZpbGVzIHdpdGggdGhlIEFydGlmYWN0IGNvbnRlbnRzIHRvIHRoZSBwcm92aWRlZCBsb2NhdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRoZSBBY3Rpb24gd2lsbCBub3QgaGF2ZSBhbnkgb3V0cHV0c1xuICAgKi9cbiAgcmVhZG9ubHkgb3V0cHV0cz86IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdO1xuXG4gIC8qKlxuICAgKiBBIHNldCBvZiBrZXktdmFsdWUgcGFpcnMgdGhhdCB3aWxsIGJlIGFjY2Vzc2libGUgdG8gdGhlIGludm9rZWQgTGFtYmRhXG4gICAqIGluc2lkZSB0aGUgZXZlbnQgdGhhdCB0aGUgUGlwZWxpbmUgd2lsbCBjYWxsIGl0IHdpdGguXG4gICAqXG4gICAqIE9ubHkgb25lIG9mIGB1c2VyUGFyYW1ldGVyc2Agb3IgYHVzZXJQYXJhbWV0ZXJzU3RyaW5nYCBjYW4gYmUgc3BlY2lmaWVkLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jb2RlcGlwZWxpbmUvbGF0ZXN0L3VzZXJndWlkZS9hY3Rpb25zLWludm9rZS1sYW1iZGEtZnVuY3Rpb24uaHRtbCNhY3Rpb25zLWludm9rZS1sYW1iZGEtZnVuY3Rpb24tanNvbi1ldmVudC1leGFtcGxlXG4gICAqIEBkZWZhdWx0IC0gbm8gdXNlciBwYXJhbWV0ZXJzIHdpbGwgYmUgcGFzc2VkXG4gICAqL1xuICByZWFkb25seSB1c2VyUGFyYW1ldGVycz86IHsgW2tleTogc3RyaW5nXTogYW55IH07XG5cbiAgLyoqXG4gICAqIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHVzZXIgcGFyYW1ldGVycyB0aGF0IHdpbGwgYmVcbiAgICogYWNjZXNzaWJsZSB0byB0aGUgaW52b2tlZCBMYW1iZGEgaW5zaWRlIHRoZSBldmVudFxuICAgKiB0aGF0IHRoZSBQaXBlbGluZSB3aWxsIGNhbGwgaXQgd2l0aC5cbiAgICpcbiAgICogT25seSBvbmUgb2YgYHVzZXJQYXJhbWV0ZXJzU3RyaW5nYCBvciBgdXNlclBhcmFtZXRlcnNgIGNhbiBiZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gdXNlciBwYXJhbWV0ZXJzIHdpbGwgYmUgcGFzc2VkXG4gICAqL1xuICByZWFkb25seSB1c2VyUGFyYW1ldGVyc1N0cmluZz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGxhbWJkYSBmdW5jdGlvbiB0byBpbnZva2UuXG4gICAqL1xuICByZWFkb25seSBsYW1iZGE6IGxhbWJkYS5JRnVuY3Rpb247XG59XG5cbi8qKlxuICogQ29kZVBpcGVsaW5lIGludm9rZSBBY3Rpb24gdGhhdCBpcyBwcm92aWRlZCBieSBhbiBBV1MgTGFtYmRhIGZ1bmN0aW9uLlxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVwaXBlbGluZS9sYXRlc3QvdXNlcmd1aWRlL2FjdGlvbnMtaW52b2tlLWxhbWJkYS1mdW5jdGlvbi5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBMYW1iZGFJbnZva2VBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBMYW1iZGFJbnZva2VBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogTGFtYmRhSW52b2tlQWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICAuLi5wcm9wcyxcbiAgICAgIHJlc291cmNlOiBwcm9wcy5sYW1iZGEsXG4gICAgICBjYXRlZ29yeTogY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LklOVk9LRSxcbiAgICAgIHByb3ZpZGVyOiAnTGFtYmRhJyxcbiAgICAgIGFydGlmYWN0Qm91bmRzOiB7XG4gICAgICAgIG1pbklucHV0czogMCxcbiAgICAgICAgbWF4SW5wdXRzOiA1LFxuICAgICAgICBtaW5PdXRwdXRzOiAwLFxuICAgICAgICBtYXhPdXRwdXRzOiA1LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgIGlmIChwcm9wcy51c2VyUGFyYW1ldGVycyAmJiBwcm9wcy51c2VyUGFyYW1ldGVyc1N0cmluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBvZiB1c2VyUGFyYW1ldGVycyBvciB1c2VyUGFyYW1ldGVyc1N0cmluZyBjYW4gYmUgc3BlY2lmaWVkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBhIENvZGVQaXBlbGluZSB2YXJpYWJsZSBkZWZpbmVkIGJ5IHRoZSBMYW1iZGEgZnVuY3Rpb24gdGhpcyBhY3Rpb24gcG9pbnRzIHRvLlxuICAgKiBWYXJpYWJsZXMgaW4gTGFtYmRhIGludm9rZSBhY3Rpb25zIGFyZSBkZWZpbmVkIGJ5IGNhbGxpbmcgdGhlIFB1dEpvYlN1Y2Nlc3NSZXN1bHQgQ29kZVBpcGVsaW5lIEFQSSBjYWxsXG4gICAqIHdpdGggdGhlICdvdXRwdXRWYXJpYWJsZXMnIHByb3BlcnR5IGZpbGxlZC5cbiAgICpcbiAgICogQHBhcmFtIHZhcmlhYmxlTmFtZSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUgdG8gcmVmZXJlbmNlLlxuICAgKiAgIEEgdmFyaWFibGUgYnkgdGhpcyBuYW1lIG11c3QgYmUgcHJlc2VudCBpbiB0aGUgJ291dHB1dFZhcmlhYmxlcycgc2VjdGlvbiBvZiB0aGUgUHV0Sm9iU3VjY2Vzc1Jlc3VsdFxuICAgKiAgIHJlcXVlc3QgdGhhdCB0aGUgTGFtYmRhIGZ1bmN0aW9uIGNhbGxzIHdoZW4gdGhlIGFjdGlvbiBpcyBpbnZva2VkXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVwaXBlbGluZS9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9QdXRKb2JTdWNjZXNzUmVzdWx0Lmh0bWxcbiAgICovXG4gIHB1YmxpYyB2YXJpYWJsZSh2YXJpYWJsZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFyaWFibGVFeHByZXNzaW9uKHZhcmlhYmxlTmFtZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgYm91bmQoc2NvcGU6IENvbnN0cnVjdCwgX3N0YWdlOiBjb2RlcGlwZWxpbmUuSVN0YWdlLCBvcHRpb25zOiBjb2RlcGlwZWxpbmUuQWN0aW9uQmluZE9wdGlvbnMpOlxuICBjb2RlcGlwZWxpbmUuQWN0aW9uQ29uZmlnIHtcbiAgICAvLyBhbGxvdyBwaXBlbGluZSB0byBsaXN0IGZ1bmN0aW9uc1xuICAgIG9wdGlvbnMucm9sZS5hZGRUb1BvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2xhbWJkYTpMaXN0RnVuY3Rpb25zJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcblxuICAgIC8vIGFsbG93IHBpcGVsaW5lIHRvIGludm9rZSB0aGlzIGxhbWJkYSBmdW5jdGlvbm5cbiAgICB0aGlzLnByb3BzLmxhbWJkYS5ncmFudEludm9rZShvcHRpb25zLnJvbGUpO1xuXG4gICAgLy8gYWxsb3cgdGhlIFJvbGUgYWNjZXNzIHRvIHRoZSBCdWNrZXQsIGlmIHRoZXJlIGFyZSBhbnkgaW5wdXRzL291dHB1dHNcbiAgICBpZiAoKHRoaXMuYWN0aW9uUHJvcGVydGllcy5pbnB1dHMgfHwgW10pLmxlbmd0aCA+IDApIHtcbiAgICAgIG9wdGlvbnMuYnVja2V0LmdyYW50UmVhZChvcHRpb25zLnJvbGUpO1xuICAgIH1cbiAgICBpZiAoKHRoaXMuYWN0aW9uUHJvcGVydGllcy5vdXRwdXRzIHx8IFtdKS5sZW5ndGggPiAwKSB7XG4gICAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFdyaXRlKG9wdGlvbnMucm9sZSk7XG4gICAgfVxuXG4gICAgLy8gYWxsb3cgbGFtYmRhIHRvIHB1dCBqb2IgcmVzdWx0cyBmb3IgdGhpcyBwaXBlbGluZVxuICAgIC8vIENvZGVQaXBlbGluZSByZXF1aXJlcyB0aGlzIHRvIGJlIGdyYW50ZWQgdG8gJyonXG4gICAgLy8gKHRoZSBQaXBlbGluZSBBUk4gd2lsbCBub3QgYmUgZW5vdWdoKVxuICAgIHRoaXMucHJvcHMubGFtYmRhLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgYWN0aW9uczogWydjb2RlcGlwZWxpbmU6UHV0Sm9iU3VjY2Vzc1Jlc3VsdCcsICdjb2RlcGlwZWxpbmU6UHV0Sm9iRmFpbHVyZVJlc3VsdCddLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEZ1bmN0aW9uTmFtZTogdGhpcy5wcm9wcy5sYW1iZGEuZnVuY3Rpb25OYW1lLFxuICAgICAgICBVc2VyUGFyYW1ldGVyczogdGhpcy5wcm9wcy51c2VyUGFyYW1ldGVyc1N0cmluZyA/PyBTdGFjay5vZihzY29wZSkudG9Kc29uU3RyaW5nKHRoaXMucHJvcHMudXNlclBhcmFtZXRlcnMpLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=