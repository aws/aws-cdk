import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Types of EC2 actions available
 */
export enum Ec2InstanceAction {
  /**
   * Stop the instance
   */
  STOP = 'stop',
  /**
   * Terminatethe instance
   */
  TERMINATE = 'terminate',
  /**
   * Recover the instance
   */
  RECOVER = 'recover',
  /**
   * Reboot the instance
   */
  REBOOT = 'reboot'
}

/**
 * Use an EC2 action as an Alarm action
 */
export class Ec2Action implements cloudwatch.IAlarmAction {
  private ec2Action: Ec2InstanceAction;

  constructor(instanceAction: Ec2InstanceAction) {
    this.ec2Action = instanceAction;
  }

  /**
   * Returns an alarm action configuration to use an EC2 action as an alarm action
   */
  bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: `arn:${Stack.of(_scope).partition}:automate:${Stack.of(_scope).region}:ec2:${this.ec2Action}` };
  }
}

