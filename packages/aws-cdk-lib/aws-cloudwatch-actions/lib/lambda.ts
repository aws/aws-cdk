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
  private lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction
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
  bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    const idPrefix = FeatureFlags.of(_scope).isEnabled(LAMBDA_PERMISSION_LOGICAL_ID_FOR_LAMBDA_ACTION) ? _alarm.node.id : '';
    this.lambdaFunction.addPermission(`${idPrefix}AlarmPermission`, {
      sourceAccount: Stack.of(_scope).account,
      action: 'lambda:InvokeFunction',
      sourceArn: _alarm.alarmArn,
      principal: new iam.ServicePrincipal('lambda.alarms.cloudwatch.amazonaws.com'),
    });

    return {
      alarmActionArn: this.lambdaFunction.functionArn,
    };
  }
}
