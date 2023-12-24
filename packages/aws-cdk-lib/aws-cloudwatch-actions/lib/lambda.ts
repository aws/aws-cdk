import { Construct } from 'constructs';
import * as cloudwatch from '../../aws-cloudwatch';
import * as lambda from '../../aws-lambda';
import { Stack } from '../../core';

/**
 * Use an Lambda action as an Alarm action
 */
export class LambdaAction implements cloudwatch.IAlarmAction {
  private lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction
  constructor(
    lambdaFunction: lambda.IAlias | lambda.IVersion | lambda.IFunction,
  ) {
    this.lambdaFunction = lambdaFunction;
  }

  /**
   * Returns an alarm action configuration to use an Lambda action as an alarm action
   *
   * @see: https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_PutMetricAlarm.html
   *
   */
  bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    if (this.lambdaFunction.stack.account === Stack.of(_scope).account) {
      new lambda.CfnPermission(_scope, 'AlarmPermission', {
        sourceAccount: Stack.of(_scope).account,
        action: 'lambda:InvokeFunction',
        sourceArn: _alarm.alarmArn,
        principal: 'lambda.alarms.cloudwatch.amazonaws.com',
        functionName: this.lambdaFunction.functionName,
      });
    }
    if ((this.lambdaFunction as lambda.IAlias).aliasName) {
      return {
        alarmActionArn: `arn:${Stack.of(this.lambdaFunction.stack).partition}:lambda:${Stack.of(this.lambdaFunction.stack).region}:${Stack.of(this.lambdaFunction.stack).account}:function:${this.lambdaFunction.functionName}:${(this.lambdaFunction as lambda.IAlias).aliasName}`,
      };
    } else if ((this.lambdaFunction as lambda.IAlias).version) {
      return {
        alarmActionArn: `arn:${Stack.of(this.lambdaFunction.stack).partition}:lambda:${Stack.of(this.lambdaFunction.stack).region}:${Stack.of(this.lambdaFunction.stack).account}:function:${this.lambdaFunction.functionName}:${(this.lambdaFunction as lambda.IVersion).version}`,
      };
    } else {
      return {
        alarmActionArn: `arn:${Stack.of(this.lambdaFunction.stack).partition}:lambda:${Stack.of(this.lambdaFunction.stack).region}:${Stack.of(this.lambdaFunction.stack).account}:function:${this.lambdaFunction.functionName}`,
      };
    }
  }
}
