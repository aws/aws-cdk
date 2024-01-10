import { IPredefinedDeploymentConfig } from './predefined-deployment-config';
import * as cloudwatch from '../../../aws-cloudwatch';
import { Token, Stack, ArnFormat, Arn, Fn, Aws, IResource } from '../../../core';
import { IBaseDeploymentConfig } from '../base-deployment-config';
import { CfnDeploymentGroup } from '../codedeploy.generated';
import { AutoRollbackConfig } from '../rollback-config';

export function arnForApplication(stack: Stack, applicationName: string): string {
  return stack.formatArn({
    service: 'codedeploy',
    resource: 'application',
    resourceName: applicationName,
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
  });
}

export function nameFromDeploymentGroupArn(deploymentGroupArn: string): string {
  const components = Arn.split(deploymentGroupArn, ArnFormat.COLON_RESOURCE_NAME);
  return Fn.select(1, Fn.split('/', components.resourceName ?? ''));
}

export function arnForDeploymentConfig(name: string, resource?: IResource): string {
  return Arn.format({
    partition: Aws.PARTITION,
    account: resource?.env.account ?? Aws.ACCOUNT_ID,
    region: resource?.env.region ?? Aws.REGION,
    service: 'codedeploy',
    resource: 'deploymentconfig',
    resourceName: name,
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
  });
}

export interface renderAlarmConfigProps {
  /**
   * Array of Cloudwatch alarms
   */
  readonly alarms: cloudwatch.IAlarm[],
  /**
   * Whether to ignore failure to fetch the status of alarms from CloudWatch
   */
  readonly ignorePollAlarmFailure?: boolean,
  /**
   * When no alarms are provided on an update, removes previously existing alarms from the construct.
   * @see {@link https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/cx-api/FEATURE_FLAGS.md#aws-cdkaws-codedeployremovealarmsfromdeploymentgroup}
   *
   * @default true
   */
  readonly removeAlarms?: boolean,
  /**
   * Whether to skip the step of checking CloudWatch alarms during the deployment process
   *
   * @default false
   */
  ignoreAlarmConfiguration?: boolean
}

export function renderAlarmConfigurationV2(props: renderAlarmConfigProps): CfnDeploymentGroup.AlarmConfigurationProperty | undefined {
  const ignoreAlarmConfiguration = props.ignoreAlarmConfiguration ?? false;
  const removeAlarms = props.removeAlarms ?? true;
  if (removeAlarms) {
    return {
      alarms: props.alarms.length > 0 ? props.alarms.map(a => ({ name: a.alarmName })) : undefined,
      enabled: !ignoreAlarmConfiguration && props.alarms.length > 0,
      ignorePollAlarmFailure: props.ignorePollAlarmFailure,
    };
  }

  return props.alarms.length === 0
    ? undefined
    : {
      alarms: props.alarms.map(a => ({ name: a.alarmName })),
      enabled: !ignoreAlarmConfiguration,
      ignorePollAlarmFailure: props.ignorePollAlarmFailure,
    };
}

/** @deprecated Use renderAlarmConfigurationV2 instead */
export function renderAlarmConfiguration(alarms: cloudwatch.IAlarm[], ignorePollAlarmFailure: boolean | undefined, removeAlarms = true):
CfnDeploymentGroup.AlarmConfigurationProperty | undefined {
  return renderAlarmConfigurationV2({ alarms, ignorePollAlarmFailure, removeAlarms });
}

export function deploymentConfig(name: string): IBaseDeploymentConfig & IPredefinedDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
    bindEnvironment: (resource) => ({
      deploymentConfigName: name,
      deploymentConfigArn: arnForDeploymentConfig(name, resource),
    }),
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
