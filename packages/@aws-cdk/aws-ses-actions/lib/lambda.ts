import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import ses = require('@aws-cdk/aws-ses');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/core');

/**
 * The type of invocation to use for a Lambda Action.
 */
export enum LambdaInvocationType {
  /**
   * The function will be invoked asynchronously.
   */
  EVENT = 'Event',

  /**
   * The function will be invoked sychronously. Use RequestResponse only when
   * you want to make a mail flow decision, such as whether to stop the receipt
   * rule or the receipt rule set.
   */
  REQUEST_RESPONSE = 'RequestResponse',
}

/**
 * Construction properties for a Lambda action.
 */
export interface LambdaProps {
  /**
   * The Lambda function to invoke.
   */
  readonly function: lambda.IFunction

  /**
   * The invocation type of the Lambda function.
   *
   * @default Event
   */
  readonly invocationType?: LambdaInvocationType;

  /**
   * The SNS topic to notify when the Lambda action is taken.
   *
   * @default no notification
   */
  readonly topic?: sns.ITopic;
}

/**
 * Calls an AWS Lambda function, and optionally, publishes a notification to
 * Amazon SNS.
 */
export class Lambda implements ses.IReceiptRuleAction {
  constructor(private readonly props: LambdaProps) {
  }

  public bind(rule: ses.IReceiptRule): ses.ReceiptRuleActionConfig {
    // Allow SES to invoke Lambda function
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-permissions.html#receiving-email-permissions-lambda
    const permissionId = 'AllowSes';
    if (!this.props.function.permissionsNode.tryFindChild(permissionId)) {
      this.props.function.addPermission(permissionId, {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('ses.amazonaws.com'),
        sourceAccount: cdk.Aws.ACCOUNT_ID
      });
    }

    // Ensure permission is deployed before rule
    const permission = this.props.function.permissionsNode.tryFindChild(permissionId) as lambda.CfnPermission;
    if (permission) { // The Lambda could be imported
      rule.node.addDependency(permission);
    } else {
      // tslint:disable-next-line:max-line-length
      rule.node.addWarning('This rule is using a Lambda action with an imported function. Ensure permission is given to SES to invoke that function.');
    }

    return {
      lambdaAction: {
        functionArn: this.props.function.functionArn,
        invocationType: this.props.invocationType,
        topicArn: this.props.topic ? this.props.topic.topicArn : undefined
      }
    };
  }
}
