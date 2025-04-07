import { Construct } from 'constructs';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import { FeatureFlags, Stack } from '../../core';
import { LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION } from '../../cx-api';

/**
 * Use a Lambda action as an Alarm action
 */
export class LambdaAction implements cloudwatch.IAlarmAction {
  private lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction;
  constructor(
    lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction,
  ) {
    this.lambdaFunction = lambdaFunction;
  }

  /**
   * Returns an alarm action configuration to use a Lambda action as an alarm action.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html
   */
  bind(scope: Construct, alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    const idPrefix = FeatureFlags.of(scope).isEnabled(LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION) ? alarm.node.id : '';
    const permissionId = `${idPrefix}AlarmPermission`;
    const permissionNode = this.lambdaFunction.permissionsNode.tryFindChild(permissionId) as lambda.CfnPermission | undefined;

    // If the Lambda permission has already been added to this function
    // we skip adding it to avoid an exception being thrown
    // see https://github.com/aws/aws-cdk/issues/29514
    if (permissionNode?.sourceArn !== alarm.alarmArn) {
      this.lambdaFunction.addPermission(permissionId, {
        sourceAccount: Stack.of(scope).account,
        action: 'lambda:InvokeFunction',
        sourceArn: alarm.alarmArn,
        principal: new iam.ServicePrincipal('lambda.alarms.cloudwatch.amazonaws.com'),
      });
    }

    return {
      alarmActionArn: this.lambdaFunction.functionArn,
    };
  }
}
