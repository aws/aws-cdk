import { Construct } from 'constructs';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import { Annotations, FeatureFlags, Names, Stack } from '../../core';
import { LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION } from '../../cx-api';

/**
 * Properties for Lambda Alarm Action
 */
export interface LambdaActionProps {
  /**
   * Whether to generate unique Lambda Permission id
   *
   * Use this parameter to resolve id collision in case of multiple alarms triggering the same action
   *
   * @see https://github.com/aws/aws-cdk/issues/33958
   * @default - false
   */
  readonly useUniquePermissionId?: boolean;
}

/**
 * Use a Lambda action as an Alarm action
 */
export class LambdaAction implements cloudwatch.IAlarmAction {
  private lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction;
  private props?: LambdaActionProps;
  constructor(
    lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction,
    props?: LambdaActionProps,
  ) {
    this.lambdaFunction = lambdaFunction;
    this.props = props;
  }

  /**
   * Returns an alarm action configuration to use a Lambda action as an alarm action.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html
   */
  bind(scope: Construct, alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    let idPrefix = FeatureFlags.of(scope).isEnabled(LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION) ? alarm.node.id : '';

    if (this.props?.useUniquePermissionId) {
      idPrefix = Names.uniqueId(alarm);
    }

    const permissionId = `${idPrefix}AlarmPermission`;
    const permissionNode = this.lambdaFunction.permissionsNode.tryFindChild(permissionId) as lambda.CfnPermission | undefined;

    // If the Lambda permission has already been added to this function
    // we skip adding it to avoid an exception being thrown
    // see https://github.com/aws/aws-cdk/issues/29514
    if (permissionNode?.sourceArn !== alarm.alarmArn) {
      if (!this.props?.useUniquePermissionId) {
        Annotations.of(scope).addWarningV2(permissionId, 'Please use \'useUniquePermissionId\' to generate unique Lambda Permission Id');
      }

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
