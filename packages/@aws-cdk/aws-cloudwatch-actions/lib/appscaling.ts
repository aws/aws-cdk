import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as cdk from '@aws-cdk/core';

/**
 * Use an ApplicationAutoScaling StepScalingAction as an Alarm Action
 */
export class ApplicationScalingAction implements cloudwatch.IAlarmAction {
  constructor(private readonly stepScalingAction: appscaling.StepScalingAction) {
  }

  public bind(_scope: cdk.Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this.stepScalingAction.scalingPolicyArn };
  }
}
