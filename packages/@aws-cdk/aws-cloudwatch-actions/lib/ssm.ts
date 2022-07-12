import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Types of OpsItem severity available
 */
export enum OpsItemSeverity {
  /**
   * Set the severity to critical
   */
  CRITICAL = '1',
  /**
   * Set the severity to high
   */
  HIGH = '2',
  /**
   * Set the severity to medium
   */
  MEDIUM = '3',
  /**
   * Set the severity to low
   */
  LOW = '4'
}

/**
 * Types of OpsItem category available
 */
export enum OpsItemCategory {
  /**
   * Set the category to availability
   */
  AVAILABILITY = 'Availability',
  /**
   * Set the category to cost
   */
  COST = 'Cost',
  /**
   * Set the category to performance
   */
  PERFORMANCE = 'Performance',
  /**
   * Set the category to recovery
   */
  RECOVERY = 'Recovery',
  /**
   * Set the category to security
   */
  SECURITY = 'Security'
}

/**
 * Use an SSM OpsItem action as an Alarm action
 */
export class SsmAction implements cloudwatch.IAlarmAction {
  private severity: OpsItemSeverity;
  private category?: OpsItemCategory;

  constructor(severity: OpsItemSeverity, category?: OpsItemCategory) {
    this.severity = severity;
    this.category = category;
  }

  /**
   * Returns an alarm action configuration to use an SSM OpsItem action as an alarm action
   */
  bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    if (this.category === undefined) {
      return { alarmActionArn: `arn:${Stack.of(_scope).partition}:ssm:${Stack.of(_scope).region}:${Stack.of(_scope).account}:opsitem:${this.severity}` };
    } else {
      return { alarmActionArn: `arn:${Stack.of(_scope).partition}:ssm:${Stack.of(_scope).region}:${Stack.of(_scope).account}:opsitem:${this.severity}#CATEGORY=${this.category}` };
    }
  }
}

