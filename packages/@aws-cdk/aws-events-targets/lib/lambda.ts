import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import { addLambdaPermission } from './util';

/**
 * Customize the Lambda Event Target
 */
export interface LambdaFunctionProps {
  /**
   * The event to send to the Lambda
   *
   * This will be the payload sent to the Lambda Function.
   *
   * @default the entire CloudWatch event
   */
  readonly event?: events.RuleTargetInput;
}

/**
 * Use an AWS Lambda function as an event rule target.
 */
export class LambdaFunction implements events.IRuleTarget {
  constructor(private readonly handler: lambda.IFunction, private readonly props: LambdaFunctionProps = {}) {

  }

  /**
   * Returns a RuleTarget that can be used to trigger this Lambda as a
   * result from a CloudWatch event.
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    // Allow handler to be called from rule
    addLambdaPermission(rule, this.handler);

    return {
      id: '',
      arn: this.handler.functionArn,
      input: this.props.event,
      targetResource: this.handler,
    };
  }
}
