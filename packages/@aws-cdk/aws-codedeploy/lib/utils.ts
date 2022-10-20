import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Aws, Token } from '@aws-cdk/core';
import { IBaseDeploymentConfig } from './base-deployment-config';
import { CfnDeploymentGroup } from './codedeploy.generated';
import { AutoRollbackConfig } from './rollback-config';

export function arnForApplication(applicationName: string): string {
  return `arn:${Aws.PARTITION}:codedeploy:${Aws.REGION}:${Aws.ACCOUNT_ID}:application:${applicationName}`;
}

export function arnForDeploymentGroup(applicationName: string, deploymentGroupName: string): string {
  return `arn:${Aws.PARTITION}:codedeploy:${Aws.REGION}:${Aws.ACCOUNT_ID}:deploymentgroup:${applicationName}/${deploymentGroupName}`;
}

export function arnForDeploymentConfig(name: string): string {
  return `arn:${Aws.PARTITION}:codedeploy:${Aws.REGION}:${Aws.ACCOUNT_ID}:deploymentconfig:${name}`;
}

export function renderAlarmConfiguration(alarms: cloudwatch.IAlarm[], ignorePollAlarmFailure?: boolean):
CfnDeploymentGroup.AlarmConfigurationProperty | undefined {
  return alarms.length === 0
    ? undefined
    : {
      alarms: alarms.map(a => ({ name: a.alarmName })),
      enabled: true,
      ignorePollAlarmFailure,
    };
}

export function deploymentConfig(name: string): IBaseDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
  };
}

enum AutoRollbackEvent {
  DEPLOYMENT_FAILURE = 'DEPLOYMENT_FAILURE',
  DEPLOYMENT_STOP_ON_ALARM = 'DEPLOYMENT_STOP_ON_ALARM',
  DEPLOYMENT_STOP_ON_REQUEST = 'DEPLOYMENT_STOP_ON_REQUEST'
}

export function renderAutoRollbackConfiguration(alarms: cloudwatch.IAlarm[], autoRollbackConfig: AutoRollbackConfig = {}):
CfnDeploymentGroup.AutoRollbackConfigurationProperty | undefined {
  const events = new Array<string>();

  // we roll back failed deployments by default
  if (autoRollbackConfig.failedDeployment !== false) {
    events.push(AutoRollbackEvent.DEPLOYMENT_FAILURE);
  }

  // we _do not_ roll back stopped deployments by default
  if (autoRollbackConfig.stoppedDeployment === true) {
    events.push(AutoRollbackEvent.DEPLOYMENT_STOP_ON_REQUEST);
  }

  // we _do not_ roll back alarm-triggering deployments by default
  // unless the Deployment Group has at least one alarm
  if (autoRollbackConfig.deploymentInAlarm !== false) {
    if (alarms.length > 0) {
      events.push(AutoRollbackEvent.DEPLOYMENT_STOP_ON_ALARM);
    } else if (autoRollbackConfig.deploymentInAlarm === true) {
      throw new Error(
        "The auto-rollback setting 'deploymentInAlarm' does not have any effect unless you associate " +
        'at least one CloudWatch alarm with the Deployment Group');
    }
  }

  if (autoRollbackConfig.failedDeployment === false
    && autoRollbackConfig.stoppedDeployment !== true
    && autoRollbackConfig.deploymentInAlarm === false) {
    return {
      enabled: false,
    };
  }

  return events.length > 0
    ? {
      enabled: true,
      events,
    }
    : undefined;
}

export function validateName(type: 'Application' | 'Deployment group' | 'Deployment config', name: string): string[] {
  const ret = [];

  if (!Token.isUnresolved(name) && name !== undefined) {
    if (name.length > 100) {
      ret.push(`${type} name: "${name}" can be a max of 100 characters.`);
    }
    if (!/^[a-z0-9._+=,@-]+$/i.test(name)) {
      ret.push(`${type} name: "${name}" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).`);
    }
  }

  return ret;
}