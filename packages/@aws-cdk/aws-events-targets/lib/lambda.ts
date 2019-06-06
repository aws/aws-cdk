import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');

/**
 * Customize the SNS Topic Event Target
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
  public bind(rule: events.IRule): events.RuleTargetProperties {
    const permissionId = `AllowEventRule${rule.node.uniqueId}`;
    if (!this.handler.node.tryFindChild(permissionId)) {
      this.handler.addPermission(permissionId, {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('events.amazonaws.com'),
        sourceArn: rule.ruleArn
      });
    }
    const id = this.handler.node.uniqueId;

    return {
      id: id.substring(Math.max(id.length - 64, 0), id.length),
      arn: this.handler.functionArn,
      input: this.props.event,
    };
  }
}
