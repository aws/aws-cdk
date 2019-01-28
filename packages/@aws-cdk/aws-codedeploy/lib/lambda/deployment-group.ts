import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');

import { CfnDeploymentGroup } from '../codedeploy.generated';
import { DeploymentOption, DeploymentType, TrafficShiftConfig as TrafficShiftingConfig } from '../config';
import { deploymentGroupNameToArn, renderAlarmConfiguration, renderAutoRollbackConfiguration } from '../utils';
import { LambdaApplication } from './application';

export interface LambdaDeploymentGroupProps {
  application: LambdaApplication;
  deploymentGroupName?: string;
  trafficShiftingConfig: TrafficShiftingConfig;
  alarms?: cloudwatch.Alarm[];

  serviceRole?: iam.Role;
  alias: lambda.Alias;

  preHook?: lambda.Function;
  postHook?: lambda.Function;
}
export class LambdaDeploymentGroup extends cdk.Construct {
  public readonly application: LambdaApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly alias: lambda.Alias;

  constructor(scope: cdk.Construct, id: string, props: LambdaDeploymentGroupProps) {
    super(scope, id);
    this.alias = props.alias;

    let serviceRole: iam.Role | undefined = props.serviceRole;
    if (serviceRole) {
      if (serviceRole.assumeRolePolicy) {
        serviceRole.assumeRolePolicy.addStatement(new iam.PolicyStatement()
          .addAction('sts:AssumeRole')
          .addServicePrincipal('codedeploy.amazonaws.com'));
      }
    } else {
      serviceRole = new iam.Role(this, 'ServiceRole', {
        assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com')
      });
    }
    serviceRole.attachManagedPolicy('arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda');

    const alarms = props.alarms || [];

    const resource = new CfnDeploymentGroup(this, 'Resource', {
      applicationName: props.application.applicationName,
      serviceRoleArn: serviceRole.roleArn,
      deploymentGroupName: props.deploymentGroupName,
      deploymentConfigName: `CodeDeployDefault.Lambda${props.trafficShiftingConfig}`,
      deploymentStyle: {
        deploymentType: props.trafficShiftingConfig === TrafficShiftingConfig.AllAtOnce ?
          DeploymentType.InPlace : DeploymentType.BlueGreen,
        deploymentOption: props.trafficShiftingConfig === TrafficShiftingConfig.AllAtOnce ?
          DeploymentOption.WithoutTrafficControl : DeploymentOption.WithTrafficControl
      },

      alarmConfiguration: new cdk.Token(() => renderAlarmConfiguration(alarms)),
      autoRollbackConfiguration: new cdk.Token(() => renderAutoRollbackConfiguration(alarms)),
    });

    this.application = props.application;
    this.deploymentGroupName = resource.deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupNameToArn(this.application.applicationName, this.deploymentGroupName, this);

    if (props.preHook) {
      this.grantPutLifecycleEventHookExecutionStatus(props.preHook.role);
      props.preHook.grantInvoke(serviceRole);
    }
    if (props.postHook) {
      this.grantPutLifecycleEventHookExecutionStatus(props.postHook.role);
      props.postHook.grantInvoke(serviceRole);
    }

    (this.alias.node.findChild('Resource') as lambda.CfnAlias).options.updatePolicy = {
      codeDeployLambdaAliasUpdate: {
        applicationName: props.application.applicationName,
        deploymentGroupName: resource.deploymentGroupName,
        beforeAllowTrafficHook: props.preHook === undefined ? undefined : props.preHook.functionName,
        afterAllowTrafficHook: props.postHook === undefined ? undefined : props.postHook.functionName
      }
    };
  }

  public grantPutLifecycleEventHookExecutionStatus(principal?: iam.IPrincipal) {
    if (principal) {
      principal.addToPolicy(new iam.PolicyStatement()
        .addResource(this.deploymentGroupArn)
        .addAction('codedeploy:PutLifecycleEventHookExecutionStatus'));
    }
  }
}
