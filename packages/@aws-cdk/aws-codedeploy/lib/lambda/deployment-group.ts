import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');

import { CfnDeploymentGroup } from '../codedeploy.generated';
import { DeploymentOption, DeploymentType, TrafficShiftConfig as TrafficShiftingConfig } from '../config';
import { deploymentGroupNameToArn, renderAlarmConfiguration, renderAutoRollbackConfiguration } from '../utils';
import { ILambdaApplication, LambdaApplication } from './application';

export interface ILambdaDeploymentGroup extends cdk.IConstruct {
  readonly application: ILambdaApplication;
  readonly deploymentGroupName: string;
  readonly deploymentGroupArn: string;

  export(): LambdaDeploymentGroupImportProps;
}

export interface LambdaDeploymentGroupProps {
  application: LambdaApplication;
  deploymentGroupName?: string;
  trafficShiftingConfig: TrafficShiftingConfig;
  alarms?: cloudwatch.Alarm[];

  serviceRole?: iam.Role;
  alias: lambda.Alias;

  preHook?: lambda.IFunction;
  postHook?: lambda.IFunction;
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
