import type { Construct } from 'constructs';
import type { Stack, IEnvironmentAware } from '../../../core';
import { Token, ArnFormat, Arn, Fn, Aws, ValidationError } from '../../../core';
import { DetachedConstruct } from '../../../core/lib/private/detached-construct';
import type { IAlarmRef } from '../../../interfaces/generated/aws-cloudwatch-interfaces.generated';
import type { IBaseDeploymentConfig, IBindableDeploymentConfig } from '../base-deployment-config';
import type { CfnDeploymentGroup, IDeploymentConfigRef, IDeploymentGroupRef } from '../codedeploy.generated';
import type { AutoRollbackConfig } from '../rollback-config';

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

export function arnForDeploymentConfig(name: string, resource?: IEnvironmentAware): string {
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
  readonly alarms: IAlarmRef[];

  /**
   * Whether to ignore failure to fetch the status of alarms from CloudWatch
   */
  readonly ignorePollAlarmFailure?: boolean;

  /**
   * When no alarms are provided on an update, removes previously existing alarms from the construct.
   * @see {@link https://github.com/aws/aws-cdk/blob/main/packages/%40aws-cdk/cx-api/FEATURE_FLAGS.md#aws-cdkaws-codedeployremovealarmsfromdeploymentgroup}
   *
   * @default true
   */
  readonly removeAlarms?: boolean;

  /**
   * Whether to skip the step of checking CloudWatch alarms during the deployment process
   *
   * @default false
   */
  ignoreAlarmConfiguration?: boolean;
}

export function renderAlarmConfiguration(props: renderAlarmConfigProps): CfnDeploymentGroup.AlarmConfigurationProperty | undefined {
  const ignoreAlarmConfiguration = props.ignoreAlarmConfiguration ?? false;
  const removeAlarms = props.removeAlarms ?? true;
  if (removeAlarms) {
    return {
      alarms: props.alarms.length > 0 ? props.alarms.map(a => ({ name: a.alarmRef.alarmName })) : undefined,
      enabled: !ignoreAlarmConfiguration && props.alarms.length > 0,
      ignorePollAlarmFailure: props.ignorePollAlarmFailure,
    };
  }

  return props.alarms.length === 0
    ? undefined
    : {
      alarms: props.alarms.map(a => ({ name: a.alarmRef.alarmName })),
      enabled: !ignoreAlarmConfiguration,
      ignorePollAlarmFailure: props.ignorePollAlarmFailure,
    };
}

export function deploymentConfig(name: string): IBaseDeploymentConfig & IBindableDeploymentConfig {
  return new class extends DetachedConstruct implements IBindableDeploymentConfig, IBaseDeploymentConfig {
    public readonly deploymentConfigName = name;
    public readonly deploymentConfigArn = arnForDeploymentConfig(name);
    public readonly deploymentConfigRef = { deploymentConfigName: name };
    bindEnvironment(resource: IDeploymentGroupRef): IDeploymentConfigRef {
      return new class extends DetachedConstruct {
        public readonly deploymentConfigName = name;
        public readonly deploymentConfigArn = arnForDeploymentConfig(name, resource);
        public readonly deploymentConfigRef = { deploymentConfigName: name };
      }('Objects returned by \'deploymentConfig()\' cannot be used in this API: they are not real constructs and do not have a construct tree');
    }
  }('Objects returned by \'deploymentConfig()\' cannot be used in this API: they are not real constructs and do not have a construct tree');
}

enum AutoRollbackEvent {
  DEPLOYMENT_FAILURE = 'DEPLOYMENT_FAILURE',
  DEPLOYMENT_STOP_ON_ALARM = 'DEPLOYMENT_STOP_ON_ALARM',
  DEPLOYMENT_STOP_ON_REQUEST = 'DEPLOYMENT_STOP_ON_REQUEST',
}

export function renderAutoRollbackConfiguration(scope: Construct, alarms: IAlarmRef[], autoRollbackConfig: AutoRollbackConfig = {}):
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
      throw new ValidationError(
        "The auto-rollback setting 'deploymentInAlarm' does not have any effect unless you associate " +
        'at least one CloudWatch alarm with the Deployment Group', scope);
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
