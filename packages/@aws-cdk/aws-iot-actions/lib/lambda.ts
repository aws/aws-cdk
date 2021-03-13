import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

/**
 * Construction properties for a Lambda action.
 */
export interface LambdaProps {
  /**
   * The Lambda function to invoke
   */
  readonly function: lambda.IFunction;
}

/**
 * Calls an AWS Lambda function
 */
export class Lambda implements iot.ITopicRuleAction {
  constructor(private readonly props: LambdaProps) {
  }

  public bind(rule: iot.ITopicRule): iot.TopicRuleActionConfig {
    // Allow rule to invoke lambda function
    const permissionId = 'AllowIot';
    if (!this.props.function.permissionsNode.tryFindChild(permissionId)) {
      this.props.function.addPermission(permissionId, {
        action: 'lambda:InvokeFunction',
        principal: new iam.ServicePrincipal('iot.amazonaws.com'),
        sourceAccount: cdk.Aws.ACCOUNT_ID,
      });
    }

    // Ensure permission is deployed before rule
    const permission = this.props.function.permissionsNode.tryFindChild(permissionId) as lambda.CfnPermission;
    if (permission) {
      rule.node.addDependency(permission);
    } else {
      // tsling:disable-next-line:max-line-length
      rule.node.addWarning('This rule is using a Lambda action with an imported function. Ensure permssion is given to IOT to invoke that function.');
    }

    return {
      lambda: {
        functionArn: this.props.function.functionArn,
      },
    };
  }
}
