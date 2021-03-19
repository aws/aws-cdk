import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { addToDeadLetterQueueResourcePolicy, singletonEventRole } from './util';

/**
 * Customize the Step Functions State Machine target
 */
export interface SfnStateMachineProps {
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

  /**
   * The SQS queue to be used as deadLetterQueue.
   * Check out the [considerations for using a dead-letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html#dlq-considerations).
   *
   * The events not successfully delivered are automatically retried for a specified period of time,
   * depending on the retry policy of the target.
   * If an event is not delivered before all retry attempts are exhausted, it will be sent to the dead letter queue.
   *
   * @default - no dead-letter queue
   */
  readonly deadLetterQueue?: sqs.IQueue;
}

/**
 * Use a StepFunctions state machine as a target for Amazon EventBridge rules.
 */
export class SfnStateMachine implements events.IRuleTarget {
  private readonly role: iam.IRole;

  constructor(public readonly machine: sfn.IStateMachine, private readonly props: SfnStateMachineProps = {}) {
    if (props.role) {
      props.role.grant(new iam.ServicePrincipal('events.amazonaws.com'));
    }
    // no statements are passed because we are configuring permissions by using grant* helper below
    this.role = props.role ?? singletonEventRole(machine, []);
    machine.grantStartExecution(this.role);
  }

  /**
   * Returns a properties that are used in an Rule to trigger this State Machine
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sns-permissions
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(_rule, this.props.deadLetterQueue);
    }

    return {
      arn: this.machine.stateMachineArn,
      deadLetterConfig: this.props.deadLetterQueue ? { arn: this.props.deadLetterQueue?.queueArn } : undefined,
      role: this.role,
      input: this.props.input,
      targetResource: this.machine,
    };
  }
}
