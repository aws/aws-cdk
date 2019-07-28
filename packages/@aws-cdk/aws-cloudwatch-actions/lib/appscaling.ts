import appscaling = require('@aws-cdk/aws-applicationautoscaling');
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/core');

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
