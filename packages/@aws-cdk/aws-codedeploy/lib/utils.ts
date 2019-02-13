import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { CfnDeploymentGroup } from './codedeploy.generated';
import { AutoRollbackConfig } from './rollback-config';

export function applicationNameToArn(applicationName: string, scope: cdk.IConstruct): string {
  return scope.node.stack.formatArn({
    service: 'codedeploy',
    resource: 'application',
    resourceName: applicationName,
    sep: ':',
  });
}

export function deploymentGroupNameToArn(applicationName: string, deploymentGroupName: string, scope: cdk.IConstruct): string {
  return scope.node.stack.formatArn({
    service: 'codedeploy',
    resource: 'deploymentgroup',
    resourceName: `${applicationName}/${deploymentGroupName}`,
    sep: ':',
  });
}

export function arnForDeploymentConfigName(name: string, scope: cdk.IConstruct): string {
  return scope.node.stack.formatArn({
    service: 'codedeploy',
    resource: 'deploymentconfig',
    resourceName: name,
    sep: ':',
  });
}

export function renderAlarmConfiguration(alarms: cloudwatch.Alarm[], ignorePollAlarmFailure?: boolean):
      CfnDeploymentGroup.AlarmConfigurationProperty | undefined {
  return alarms.length === 0
    ? undefined
    : {
      alarms: alarms.map(a => ({ name: a.alarmName })),
      enabled: true,
      ignorePollAlarmFailure,
    };
}

enum AutoRollbackEvent {
  DeploymentFailure = 'DEPLOYMENT_FAILURE',
  DeploymentStopOnAlarm = 'DEPLOYMENT_STOP_ON_ALARM',
  DeploymentStopOnRequest = 'DEPLOYMENT_STOP_ON_REQUEST'
}

export function renderAutoRollbackConfiguration(alarms: cloudwatch.Alarm[], autoRollbackConfig: AutoRollbackConfig = {}):
    CfnDeploymentGroup.AutoRollbackConfigurationProperty | undefined {
  const events = new Array<string>();

  // we roll back failed deployments by default
  if (autoRollbackConfig.failedDeployment !== false) {
    events.push(AutoRollbackEvent.DeploymentFailure);
  }

  // we _do not_ roll back stopped deployments by default
  if (autoRollbackConfig.stoppedDeployment === true) {
    events.push(AutoRollbackEvent.DeploymentStopOnRequest);
  }

  // we _do not_ roll back alarm-triggering deployments by default
  // unless the Deployment Group has at least one alarm
  if (autoRollbackConfig.deploymentInAlarm !== false) {
    if (alarms.length > 0) {
      events.push(AutoRollbackEvent.DeploymentStopOnAlarm);
    } else if (autoRollbackConfig.deploymentInAlarm === true) {
      throw new Error(
        "The auto-rollback setting 'deploymentInAlarm' does not have any effect unless you associate " +
        "at least one CloudWatch alarm with the Deployment Group");
    }
  }

  return events.length > 0
    ? {
      enabled: true,
      events,
    }
    : undefined;
}
