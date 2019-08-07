import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { singletonEventRole } from './util';

/**
 * Customize the Step Functions State Machine target
 */
export interface SfnStateMachineProps {
  /**
   * The input to the state machine execution
   *
   * @default the entire CloudWatch event
   */
  readonly input?: events.RuleTargetInput;
}

/**
 * Use a StepFunctions state machine as a target for AWS CloudWatch event rules.
 */
export class SfnStateMachine implements events.IRuleTarget {
  constructor(public readonly machine: sfn.IStateMachine, private readonly props: SfnStateMachineProps = {}) {
  }

  /**
   * Returns a properties that are used in an Rule to trigger this State Machine
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/resource-based-policies-cwe.html#sns-permissions
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    return {
        id: '',
        arn: this.machine.stateMachineArn,
        role: singletonEventRole(this.machine, [new iam.PolicyStatement({
            actions: ['states:StartExecution'],
            resources: [this.machine.stateMachineArn]
        })]),
        input: this.props.input,
        targetResource: this.machine,
    };
  }
}
