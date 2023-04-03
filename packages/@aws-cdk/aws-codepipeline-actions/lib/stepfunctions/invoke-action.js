"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepFunctionInvokeAction = exports.StateMachineInput = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const action_1 = require("../action");
/**
 * Represents the input for the StateMachine.
 */
class StateMachineInput {
    constructor(input, inputArtifact, inputType) {
        this.input = input;
        this.inputArtifact = inputArtifact;
        this.inputType = inputType;
    }
    /**
     * When the input type is FilePath, input artifact and
     * filepath must be specified.
     */
    static filePath(inputFile) {
        return new StateMachineInput(inputFile.location, inputFile.artifact, 'FilePath');
    }
    /**
     * When the input type is Literal, input value is passed
     * directly to the state machine input.
     */
    static literal(object) {
        return new StateMachineInput(JSON.stringify(object), undefined, 'Literal');
    }
}
exports.StateMachineInput = StateMachineInput;
_a = JSII_RTTI_SYMBOL_1;
StateMachineInput[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.StateMachineInput", version: "0.0.0" };
/**
 * StepFunctionInvokeAction that is provided by an AWS CodePipeline.
 */
class StepFunctionInvokeAction extends action_1.Action {
    constructor(props) {
        super({
            ...props,
            resource: props.stateMachine,
            category: codepipeline.ActionCategory.INVOKE,
            provider: 'StepFunctions',
            artifactBounds: {
                minInputs: 0,
                maxInputs: 1,
                minOutputs: 0,
                maxOutputs: 1,
            },
            inputs: (props.stateMachineInput && props.stateMachineInput.inputArtifact) ? [props.stateMachineInput.inputArtifact] : [],
            outputs: (props.output) ? [props.output] : [],
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_codepipeline_actions_StepFunctionsInvokeActionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, StepFunctionInvokeAction);
            }
            throw error;
        }
        this.props = props;
    }
    bound(_scope, _stage, options) {
        // allow pipeline to invoke this step function
        options.role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['states:StartExecution', 'states:DescribeStateMachine'],
            resources: [this.props.stateMachine.stateMachineArn],
        }));
        // allow state machine executions to be inspected
        options.role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['states:DescribeExecution'],
            resources: [cdk.Stack.of(this.props.stateMachine).formatArn({
                    service: 'states',
                    resource: 'execution',
                    resourceName: `${cdk.Stack.of(this.props.stateMachine).splitArn(this.props.stateMachine.stateMachineArn, cdk.ArnFormat.COLON_RESOURCE_NAME).resourceName}:${this.props.executionNamePrefix ?? ''}*`,
                    arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
                })],
        }));
        // allow the Role access to the Bucket, if there are any inputs/outputs
        if ((this.actionProperties.inputs ?? []).length > 0) {
            options.bucket.grantRead(options.role);
        }
        if ((this.actionProperties.outputs ?? []).length > 0) {
            options.bucket.grantWrite(options.role);
        }
        return {
            configuration: {
                StateMachineArn: this.props.stateMachine.stateMachineArn,
                Input: this.props.stateMachineInput?.input,
                InputType: this.props.stateMachineInput?.inputType,
                ExecutionNamePrefix: this.props.executionNamePrefix,
            },
        };
    }
}
exports.StepFunctionInvokeAction = StepFunctionInvokeAction;
_b = JSII_RTTI_SYMBOL_1;
StepFunctionInvokeAction[_b] = { fqn: "@aws-cdk/aws-codepipeline-actions.StepFunctionInvokeAction", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52b2tlLWFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludm9rZS1hY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQTBEO0FBQzFELHdDQUF3QztBQUV4QyxxQ0FBcUM7QUFFckMsc0NBQW1DO0FBRW5DOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUErQzVCLFlBQW9CLEtBQVUsRUFBRSxhQUFnRCxFQUFFLFNBQWlCO1FBQ2pHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0tBQzVCO0lBbEREOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBb0M7UUFDekQsT0FBTyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNsRjtJQUVEOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBYztRQUNsQyxPQUFPLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDNUU7O0FBZkgsOENBb0RDOzs7QUFzQ0Q7O0dBRUc7QUFDSCxNQUFhLHdCQUF5QixTQUFRLGVBQU07SUFHbEQsWUFBWSxLQUFxQztRQUMvQyxLQUFLLENBQUM7WUFDSixHQUFHLEtBQUs7WUFDUixRQUFRLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDNUIsUUFBUSxFQUFFLFlBQVksQ0FBQyxjQUFjLENBQUMsTUFBTTtZQUM1QyxRQUFRLEVBQUUsZUFBZTtZQUN6QixjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLENBQUM7Z0JBQ1osU0FBUyxFQUFFLENBQUM7Z0JBQ1osVUFBVSxFQUFFLENBQUM7Z0JBQ2IsVUFBVSxFQUFFLENBQUM7YUFDZDtZQUNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pILE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7U0FDOUMsQ0FBQyxDQUFDOzs7Ozs7K0NBakJNLHdCQUF3Qjs7OztRQWtCakMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7SUFFUyxLQUFLLENBQUMsTUFBaUIsRUFBRSxNQUEyQixFQUFFLE9BQXVDO1FBRXJHLDhDQUE4QztRQUM5QyxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN4RCxPQUFPLEVBQUUsQ0FBQyx1QkFBdUIsRUFBRSw2QkFBNkIsQ0FBQztZQUNqRSxTQUFTLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUM7U0FDckQsQ0FBQyxDQUFDLENBQUM7UUFFSixpREFBaUQ7UUFDakQsT0FBTyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDeEQsT0FBTyxFQUFFLENBQUMsMEJBQTBCLENBQUM7WUFDckMsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQzFELE9BQU8sRUFBRSxRQUFRO29CQUNqQixRQUFRLEVBQUUsV0FBVztvQkFDckIsWUFBWSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsSUFBSSxFQUFFLEdBQUc7b0JBQ25NLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLG1CQUFtQjtpQkFDN0MsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSix1RUFBdUU7UUFDdkUsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuRCxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEM7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3BELE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6QztRQUVELE9BQU87WUFDTCxhQUFhLEVBQUU7Z0JBQ2IsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLGVBQWU7Z0JBQ3hELEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUs7Z0JBQzFDLFNBQVMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLFNBQVM7Z0JBQ2xELG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CO2FBQ3BEO1NBQ0YsQ0FBQztLQUNIOztBQXhESCw0REF5REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzdGVwZnVuY3Rpb24gZnJvbSAnQGF3cy1jZGsvYXdzLXN0ZXBmdW5jdGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuLi9hY3Rpb24nO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgdGhlIGlucHV0IGZvciB0aGUgU3RhdGVNYWNoaW5lLlxuICovXG5leHBvcnQgY2xhc3MgU3RhdGVNYWNoaW5lSW5wdXQge1xuICAvKipcbiAgICogV2hlbiB0aGUgaW5wdXQgdHlwZSBpcyBGaWxlUGF0aCwgaW5wdXQgYXJ0aWZhY3QgYW5kXG4gICAqIGZpbGVwYXRoIG11c3QgYmUgc3BlY2lmaWVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmaWxlUGF0aChpbnB1dEZpbGU6IGNvZGVwaXBlbGluZS5BcnRpZmFjdFBhdGgpOiBTdGF0ZU1hY2hpbmVJbnB1dCB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU1hY2hpbmVJbnB1dChpbnB1dEZpbGUubG9jYXRpb24sIGlucHV0RmlsZS5hcnRpZmFjdCwgJ0ZpbGVQYXRoJyk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgaW5wdXQgdHlwZSBpcyBMaXRlcmFsLCBpbnB1dCB2YWx1ZSBpcyBwYXNzZWRcbiAgICogZGlyZWN0bHkgdG8gdGhlIHN0YXRlIG1hY2hpbmUgaW5wdXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxpdGVyYWwob2JqZWN0OiBvYmplY3QpOiBTdGF0ZU1hY2hpbmVJbnB1dCB7XG4gICAgcmV0dXJuIG5ldyBTdGF0ZU1hY2hpbmVJbnB1dChKU09OLnN0cmluZ2lmeShvYmplY3QpLCB1bmRlZmluZWQsICdMaXRlcmFsJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG9wdGlvbmFsIGlucHV0IEFydGlmYWN0IG9mIHRoZSBBY3Rpb24uXG4gICAqIElmIElucHV0VHlwZSBpcyBzZXQgdG8gRmlsZVBhdGgsIHRoaXMgYXJ0aWZhY3QgaXMgcmVxdWlyZWRcbiAgICogYW5kIGlzIHVzZWQgdG8gc291cmNlIHRoZSBpbnB1dCBmb3IgdGhlIHN0YXRlIG1hY2hpbmUgZXhlY3V0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBBY3Rpb24gd2lsbCBub3QgaGF2ZSBhbnkgaW5wdXRzXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVwaXBlbGluZS9sYXRlc3QvdXNlcmd1aWRlL2FjdGlvbi1yZWZlcmVuY2UtU3RlcEZ1bmN0aW9ucy5odG1sI2FjdGlvbi1yZWZlcmVuY2UtU3RlcEZ1bmN0aW9ucy1leGFtcGxlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5wdXRBcnRpZmFjdD86IGNvZGVwaXBlbGluZS5BcnRpZmFjdDtcblxuICAvKipcbiAgICogT3B0aW9uYWwgU3RhdGVNYWNoaW5lIElucHV0VHlwZVxuICAgKiBJbnB1dFR5cGUgY2FuIGJlIExpdGVyYWwgb3IgRmlsZVBhdGhcbiAgICpcbiAgICogQGRlZmF1bHQgLSBMaXRlcmFsXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5wdXRUeXBlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGVuIElucHV0VHlwZSBpcyBzZXQgdG8gTGl0ZXJhbCAoZGVmYXVsdCksIHRoZSBJbnB1dCBmaWVsZCBpcyB1c2VkXG4gICAqIGRpcmVjdGx5IGFzIHRoZSBpbnB1dCBmb3IgdGhlIHN0YXRlIG1hY2hpbmUgZXhlY3V0aW9uLlxuICAgKiBPdGhlcndpc2UsIHRoZSBzdGF0ZSBtYWNoaW5lIGlzIGludm9rZWQgd2l0aCBhbiBlbXB0eSBKU09OIG9iamVjdCB7fS5cbiAgICpcbiAgICogV2hlbiBJbnB1dFR5cGUgaXMgc2V0IHRvIEZpbGVQYXRoLCB0aGlzIGZpZWxkIGlzIHJlcXVpcmVkLlxuICAgKiBBbiBpbnB1dCBhcnRpZmFjdCBpcyBhbHNvIHJlcXVpcmVkIHdoZW4gSW5wdXRUeXBlIGlzIHNldCB0byBGaWxlUGF0aC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgaW5wdXQ6IGFueTtcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKGlucHV0OiBhbnksIGlucHV0QXJ0aWZhY3Q6IGNvZGVwaXBlbGluZS5BcnRpZmFjdCB8IHVuZGVmaW5lZCwgaW5wdXRUeXBlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5pbnB1dEFydGlmYWN0ID0gaW5wdXRBcnRpZmFjdDtcbiAgICB0aGlzLmlucHV0VHlwZSA9IGlucHV0VHlwZTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdGlvbiBwcm9wZXJ0aWVzIG9mIHRoZSBgU3RlcEZ1bmN0aW9uc0ludm9rZUFjdGlvbiBTdGVwRnVuY3Rpb24gSW52b2tlIEFjdGlvbmAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RlcEZ1bmN0aW9uc0ludm9rZUFjdGlvblByb3BzIGV4dGVuZHMgY29kZXBpcGVsaW5lLkNvbW1vbkF3c0FjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBvcHRpb25hbCBvdXRwdXQgQXJ0aWZhY3Qgb2YgdGhlIEFjdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgdGhlIEFjdGlvbiB3aWxsIG5vdCBoYXZlIGFueSBvdXRwdXRzXG4gICAqL1xuICByZWFkb25seSBvdXRwdXQ/OiBjb2RlcGlwZWxpbmUuQXJ0aWZhY3Q7XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0ZSBtYWNoaW5lIHRvIGludm9rZS5cbiAgICovXG4gIHJlYWRvbmx5IHN0YXRlTWFjaGluZTogc3RlcGZ1bmN0aW9uLklTdGF0ZU1hY2hpbmU7XG5cbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgdGhlIGlucHV0IHRvIHRoZSBTdGF0ZU1hY2hpbmUuXG4gICAqIFRoaXMgaW5jbHVkZXMgaW5wdXQgYXJ0aWZhY3QsIGlucHV0IHR5cGUgYW5kIHRoZSBzdGF0ZW1hY2hpbmUgaW5wdXQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RhdGVNYWNoaW5lSW5wdXQ/OiBTdGF0ZU1hY2hpbmVJbnB1dDtcblxuICAvKipcbiAgICogUHJlZml4IChvcHRpb25hbClcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIGFjdGlvbiBleGVjdXRpb24gSUQgaXMgdXNlZCBhcyB0aGUgc3RhdGUgbWFjaGluZSBleGVjdXRpb24gbmFtZS5cbiAgICogSWYgYSBwcmVmaXggaXMgcHJvdmlkZWQsIGl0IGlzIHByZXBlbmRlZCB0byB0aGUgYWN0aW9uIGV4ZWN1dGlvbiBJRCB3aXRoIGEgaHlwaGVuIGFuZFxuICAgKiB0b2dldGhlciB1c2VkIGFzIHRoZSBzdGF0ZSBtYWNoaW5lIGV4ZWN1dGlvbiBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGFjdGlvbiBleGVjdXRpb24gSURcbiAgICovXG4gIHJlYWRvbmx5IGV4ZWN1dGlvbk5hbWVQcmVmaXg/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogU3RlcEZ1bmN0aW9uSW52b2tlQWN0aW9uIHRoYXQgaXMgcHJvdmlkZWQgYnkgYW4gQVdTIENvZGVQaXBlbGluZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0ZXBGdW5jdGlvbkludm9rZUFjdGlvbiBleHRlbmRzIEFjdGlvbiB7XG4gIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFN0ZXBGdW5jdGlvbnNJbnZva2VBY3Rpb25Qcm9wcztcblxuICBjb25zdHJ1Y3Rvcihwcm9wczogU3RlcEZ1bmN0aW9uc0ludm9rZUFjdGlvblByb3BzKSB7XG4gICAgc3VwZXIoe1xuICAgICAgLi4ucHJvcHMsXG4gICAgICByZXNvdXJjZTogcHJvcHMuc3RhdGVNYWNoaW5lLFxuICAgICAgY2F0ZWdvcnk6IGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5JTlZPS0UsXG4gICAgICBwcm92aWRlcjogJ1N0ZXBGdW5jdGlvbnMnLFxuICAgICAgYXJ0aWZhY3RCb3VuZHM6IHtcbiAgICAgICAgbWluSW5wdXRzOiAwLFxuICAgICAgICBtYXhJbnB1dHM6IDEsXG4gICAgICAgIG1pbk91dHB1dHM6IDAsXG4gICAgICAgIG1heE91dHB1dHM6IDEsXG4gICAgICB9LFxuICAgICAgaW5wdXRzOiAocHJvcHMuc3RhdGVNYWNoaW5lSW5wdXQgJiYgcHJvcHMuc3RhdGVNYWNoaW5lSW5wdXQuaW5wdXRBcnRpZmFjdCkgPyBbcHJvcHMuc3RhdGVNYWNoaW5lSW5wdXQuaW5wdXRBcnRpZmFjdF0gOiBbXSxcbiAgICAgIG91dHB1dHM6IChwcm9wcy5vdXRwdXQpID8gW3Byb3BzLm91dHB1dF0gOiBbXSxcbiAgICB9KTtcbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIH1cblxuICBwcm90ZWN0ZWQgYm91bmQoX3Njb3BlOiBDb25zdHJ1Y3QsIF9zdGFnZTogY29kZXBpcGVsaW5lLklTdGFnZSwgb3B0aW9uczogY29kZXBpcGVsaW5lLkFjdGlvbkJpbmRPcHRpb25zKTpcbiAgY29kZXBpcGVsaW5lLkFjdGlvbkNvbmZpZyB7XG4gICAgLy8gYWxsb3cgcGlwZWxpbmUgdG8gaW52b2tlIHRoaXMgc3RlcCBmdW5jdGlvblxuICAgIG9wdGlvbnMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3N0YXRlczpTdGFydEV4ZWN1dGlvbicsICdzdGF0ZXM6RGVzY3JpYmVTdGF0ZU1hY2hpbmUnXSxcbiAgICAgIHJlc291cmNlczogW3RoaXMucHJvcHMuc3RhdGVNYWNoaW5lLnN0YXRlTWFjaGluZUFybl0sXG4gICAgfSkpO1xuXG4gICAgLy8gYWxsb3cgc3RhdGUgbWFjaGluZSBleGVjdXRpb25zIHRvIGJlIGluc3BlY3RlZFxuICAgIG9wdGlvbnMucm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ3N0YXRlczpEZXNjcmliZUV4ZWN1dGlvbiddLFxuICAgICAgcmVzb3VyY2VzOiBbY2RrLlN0YWNrLm9mKHRoaXMucHJvcHMuc3RhdGVNYWNoaW5lKS5mb3JtYXRBcm4oe1xuICAgICAgICBzZXJ2aWNlOiAnc3RhdGVzJyxcbiAgICAgICAgcmVzb3VyY2U6ICdleGVjdXRpb24nLFxuICAgICAgICByZXNvdXJjZU5hbWU6IGAke2Nkay5TdGFjay5vZih0aGlzLnByb3BzLnN0YXRlTWFjaGluZSkuc3BsaXRBcm4odGhpcy5wcm9wcy5zdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lQXJuLCBjZGsuQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZX06JHt0aGlzLnByb3BzLmV4ZWN1dGlvbk5hbWVQcmVmaXggPz8gJyd9KmAsXG4gICAgICAgIGFybkZvcm1hdDogY2RrLkFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgICAgfSldLFxuICAgIH0pKTtcblxuICAgIC8vIGFsbG93IHRoZSBSb2xlIGFjY2VzcyB0byB0aGUgQnVja2V0LCBpZiB0aGVyZSBhcmUgYW55IGlucHV0cy9vdXRwdXRzXG4gICAgaWYgKCh0aGlzLmFjdGlvblByb3BlcnRpZXMuaW5wdXRzID8/IFtdKS5sZW5ndGggPiAwKSB7XG4gICAgICBvcHRpb25zLmJ1Y2tldC5ncmFudFJlYWQob3B0aW9ucy5yb2xlKTtcbiAgICB9XG4gICAgaWYgKCh0aGlzLmFjdGlvblByb3BlcnRpZXMub3V0cHV0cyA/PyBbXSkubGVuZ3RoID4gMCkge1xuICAgICAgb3B0aW9ucy5idWNrZXQuZ3JhbnRXcml0ZShvcHRpb25zLnJvbGUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFN0YXRlTWFjaGluZUFybjogdGhpcy5wcm9wcy5zdGF0ZU1hY2hpbmUuc3RhdGVNYWNoaW5lQXJuLFxuICAgICAgICBJbnB1dDogdGhpcy5wcm9wcy5zdGF0ZU1hY2hpbmVJbnB1dD8uaW5wdXQsXG4gICAgICAgIElucHV0VHlwZTogdGhpcy5wcm9wcy5zdGF0ZU1hY2hpbmVJbnB1dD8uaW5wdXRUeXBlLFxuICAgICAgICBFeGVjdXRpb25OYW1lUHJlZml4OiB0aGlzLnByb3BzLmV4ZWN1dGlvbk5hbWVQcmVmaXgsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==