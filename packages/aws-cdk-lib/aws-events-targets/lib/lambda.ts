import { addLambdaPermission, addToDeadLetterQueueResourcePolicy, TargetBaseProps, bindBaseTargetConfig } from './util';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';

/**
 * Customize the Lambda Event Target
 */
export interface LambdaFunctionProps extends TargetBaseProps {
  /**
   * The event to send to the Lambda
   *
   * This will be the payload sent to the Lambda Function.
   *
   * @default the entire EventBridge event
   */
  readonly event?: events.RuleTargetInput;

  /**
   * Role to be used to publish the event.
   *
   * This is required to publish events cross-account.
   *
   * @default no role is attached.
   */
  readonly role?: iam.IRole;
}

/**
 * Use an AWS Lambda function as an event rule target.
 */
export class LambdaFunction implements events.IRuleTarget {
  constructor(private readonly handler: lambda.IFunction, private readonly props: LambdaFunctionProps = {}) {

  }

  /**
   * Returns a RuleTarget that can be used to trigger this Lambda as a
   * result from an EventBridge event.
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const { deadLetterQueue, event, role } = this.props;

    // Allow handler to be called from rule
    addLambdaPermission(rule, this.handler);

    if (deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, deadLetterQueue);
    }

    if (role) {
      role.addToPrincipalPolicy(this.invokeFunctionStatement());
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: this.handler.functionArn,
      input: event,
      role,
      targetResource: this.handler,
    };
  }

  private invokeFunctionStatement() {
    return new iam.PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: [this.handler.functionArn],
    });
  }
}
