import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { TargetBaseProps } from './util';
/**
 * Customize the Step Functions State Machine target
 */
export interface SfnStateMachineProps extends TargetBaseProps {
    /**
     * The input to the state machine execution
     *
     * @default the entire EventBridge event
     */
    readonly input?: events.RuleTargetInput;
    /**
     * The IAM role to be assumed to execute the State Machine
     *
     * @default - a new role will be created
     */
    readonly role?: iam.IRole;
}
/**
 * Use a StepFunctions state machine as a target for Amazon EventBridge rules.
 */
export declare class SfnStateMachine implements events.IRuleTarget {
    readonly machine: sfn.IStateMachine;
    private readonly props;
    private readonly role;
    constructor(machine: sfn.IStateMachine, props?: SfnStateMachineProps);
    /**
     * Returns a properties that are used in an Rule to trigger this State Machine
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sns-permissions
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
