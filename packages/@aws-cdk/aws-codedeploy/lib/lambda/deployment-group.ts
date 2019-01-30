import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');

import { CfnDeploymentGroup } from '../codedeploy.generated';
import { AutoRollbackConfig, DeploymentOption, DeploymentType } from '../config';
import { deploymentGroupNameToArn, renderAlarmConfiguration, renderAutoRollbackConfiguration } from '../utils';
import { ILambdaApplication, LambdaApplication } from './application';
import { LambdaDeploymentConfig } from './deployment-config';

export interface ILambdaDeploymentGroup extends cdk.IConstruct {
  readonly application: ILambdaApplication;
  readonly deploymentGroupName: string;
  readonly deploymentGroupArn: string;

  export(): LambdaDeploymentGroupImportProps;
}

export interface LambdaDeploymentGroupProps {
  application: LambdaApplication;
  deploymentGroupName?: string;
  deploymentConfig: LambdaDeploymentConfig;

  alarms?: cloudwatch.Alarm[];

  serviceRole?: iam.Role;
  alias: lambda.Alias;

  preHook?: lambda.IFunction;
  postHook?: lambda.IFunction;

  /**
   * Whether to continue a deployment even if fetching the alarm status from CloudWatch failed.
   *
   * @default false
   */
  ignorePollAlarmsFailure?: boolean;

  /**
   * The auto-rollback configuration for this Deployment Group.
   */
  autoRollback?: AutoRollbackConfig;
}
export class LambdaDeploymentGroup extends cdk.Construct implements ILambdaDeploymentGroup {
  /**
   * Import an Lambda Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param parent the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced Deployment Group
   * @returns a Construct representing a reference to an existing Deployment Group
   */
  public static import(scope: cdk.Construct, id: string, props: LambdaDeploymentGroupImportProps): ILambdaDeploymentGroup {
    return new ImportedLambdaDeploymentGroup(scope, id, props);
  }

  public readonly application: ILambdaApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;

  constructor(scope: cdk.Construct, id: string, props: LambdaDeploymentGroupProps) {
    super(scope, id);

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
    // Narrow re-implementation of arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda
    serviceRole.addToPolicy(new iam.PolicyStatement()
      .addResource('arn:aws:s3:::*/CodeDeploy/*')
      .addActions('s3:GetObject', 's3:GetObjectVersion'));
    serviceRole.addToPolicy(new iam.PolicyStatement()
      .addResource('*')
      .addCondition('StringEquals', {
        's3:ExistingObjectTag/UseWithCodeDeploy': 'true'
      })
      .addActions('s3:GetObject', 's3:GetObjectVersion'));
    serviceRole.addToPolicy(new iam.PolicyStatement()
      .addResource(props.alias.functionArn)
      .addActions('lambda:UpdateAlias', 'lambda:GetAlias'));
    if (props.alarms) {
      serviceRole.addToPolicy(new iam.PolicyStatement()
        .addResources(...props.alarms.map(alarm => alarm.alarmArn))
        .addAction('cloudwatch:DescribeAlarms'));
    }

    const alarms = props.alarms || [];

    const resource = new CfnDeploymentGroup(this, 'Resource', {
      applicationName: props.application.applicationName,
      serviceRoleArn: serviceRole.roleArn,
      deploymentGroupName: props.deploymentGroupName,
      deploymentConfigName: `CodeDeployDefault.Lambda${props.deploymentConfig}`,
      deploymentStyle: {
        deploymentType: DeploymentType.BlueGreen,
        deploymentOption: DeploymentOption.WithTrafficControl
      },

      alarmConfiguration: new cdk.Token(() => renderAlarmConfiguration(alarms, props.ignorePollAlarmsFailure)),
      autoRollbackConfiguration: new cdk.Token(() => renderAutoRollbackConfiguration(alarms, props.autoRollback)),
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

    (props.alias.node.findChild('Resource') as lambda.CfnAlias).options.updatePolicy = {
      codeDeployLambdaAliasUpdate: {
        applicationName: props.application.applicationName,
        deploymentGroupName: resource.deploymentGroupName,
        beforeAllowTrafficHook: props.preHook === undefined ? undefined : props.preHook.functionName,
        afterAllowTrafficHook: props.postHook === undefined ? undefined : props.postHook.functionName
      }
    };
  }

  /**
   * Grant a principal permission to codedeploy:PutLifecycleEventHookExecutionStatus
   * on this deployment group resource.
   * @param principal to grant permission to
   */
  public grantPutLifecycleEventHookExecutionStatus(principal?: iam.IPrincipal) {
    if (principal) {
      principal.addToPolicy(new iam.PolicyStatement()
        .addResource(this.deploymentGroupArn)
        .addAction('codedeploy:PutLifecycleEventHookExecutionStatus'));
    }
  }

  public export(): LambdaDeploymentGroupImportProps {
    return {
      application: this.application,
      deploymentGroupName: new cdk.Output(this, 'DeploymentGroupName', {
        value: this.deploymentGroupName
      }).makeImportValue().toString()
    };
  }
}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * @see ServerDeploymentGroup#import
 * @see IServerDeploymentGroup#export
 */
export interface LambdaDeploymentGroupImportProps {
  /**
   * The reference to the CodeDeploy EC2/on-premise Application
   * that this Deployment Group belongs to.
   */
  application: ILambdaApplication;

  /**
   * The physical, human-readable name of the CodeDeploy EC2/on-premise Deployment Group
   * that we are referencing.
   */
  deploymentGroupName: string;
}

class ImportedLambdaDeploymentGroup extends cdk.Construct implements ILambdaDeploymentGroup {
  public readonly application: ILambdaApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaDeploymentGroupImportProps) {
    super(scope, id);
    this.application = props.application;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentGroupArn = deploymentGroupNameToArn(props.application.applicationName,
      props.deploymentGroupName, this);
  }

  public export() {
    return this.props;
  }
}
