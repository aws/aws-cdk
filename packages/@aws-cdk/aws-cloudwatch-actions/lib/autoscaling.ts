import autoscaling = require('@aws-cdk/aws-autoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/core');

/**
 * Use an AutoScaling StepScalingAction as an Alarm Action
 */
export class AutoScalingAction implements cloudwatch.IAlarmAction {
  constructor(private readonly stepScalingAction: autoscaling.StepScalingAction) {
  }

  public bind(_scope: cdk.Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this.stepScalingAction.scalingPolicyArn };
  }
}
