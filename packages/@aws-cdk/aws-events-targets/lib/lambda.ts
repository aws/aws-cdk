import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');

/**
 * Use an AWS Lambda function as an event rule target.
 */
export class LambdaFunction implements events.IEventRuleTarget {

  /**
   * @param handler The lambda function
   */
  constructor(private readonly handler: lambda.IFunction) {

  }

  /**
   * Returns a RuleTarget that can be used to trigger this Lambda as a
   * result from a CloudWatch event.
   */
  public asEventRuleTarget(ruleArn: string, ruleId: string): events.EventRuleTargetProps {
    const permissionId = `AllowEventRule${ruleId}`;
    if (!this.handler.node.tryFindChild(permissionId)) {
      this.handler.addPermission(permissionId, {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('events.amazonaws.com'),
        sourceArn: ruleArn
      });
    }

    return {
      id: this.handler.node.id,
      arn: this.handler.functionArn,
    };
  }
}
