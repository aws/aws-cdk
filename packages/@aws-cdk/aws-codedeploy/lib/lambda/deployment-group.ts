import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');

import { CfnDeploymentGroup } from '../codedeploy.generated';
import { AutoRollbackConfig } from '../rollback-config';
import { arnForDeploymentGroup, renderAlarmConfiguration, renderAutoRollbackConfiguration } from '../utils';
import { ILambdaApplication, LambdaApplication } from './application';
import { ILambdaDeploymentConfig, LambdaDeploymentConfig } from './deployment-config';

/**
 * Interface for a Lambda deployment groups.
 */
export interface ILambdaDeploymentGroup extends cdk.IResource {
  /**
   * The reference to the CodeDeploy Lambda Application that this Deployment Group belongs to.
   */
  readonly application: ILambdaApplication;

  /**
   * The physical name of the CodeDeploy Deployment Group.
   * @attribute
   */
  readonly deploymentGroupName: string;

  /**
   * The ARN of this Deployment Group.
   * @attribute
   */
  readonly deploymentGroupArn: string;

  /**
   * Export this Deployment Group for use in another stack or application.
   */
  export(): LambdaDeploymentGroupAttributes;
}

/**
 * Construction properties for {@link LambdaDeploymentGroup}.
 */
export interface LambdaDeploymentGroupProps {
  /**
   * The reference to the CodeDeploy Lambda Application that this Deployment Group belongs to.
   *
   * @default one will be created for you
   */
  readonly application?: ILambdaApplication;

  /**
   * The physical, human-readable name of the CodeDeploy Deployment Group.
   *
   * @default an auto-generated name will be used
   */
  readonly deploymentGroupName?: string;

  /**
   * The Deployment Configuration this Deployment Group uses.
   *
   * @default LambdaDeploymentConfig#AllAtOnce
   */
  readonly deploymentConfig?: ILambdaDeploymentConfig;

  /**
   * The CloudWatch alarms associated with this Deployment Group.
   * CodeDeploy will stop (and optionally roll back)
   * a deployment if during it any of the alarms trigger.
   *
   * Alarms can also be added after the Deployment Group is created using the {@link #addAlarm} method.
   *
   * @default []
   * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/monitoring-create-alarms.html
   */
  readonly alarms?: cloudwatch.IAlarm[];

  /**
   * The service Role of this Deployment Group.
   *
   * @default a new Role will be created.
   */
  readonly role?: iam.IRole;

  /**
   * Lambda Alias to shift traffic. Updating the version
   * of the alias will trigger a CodeDeploy deployment.
   *
   * [disable-awslint:ref-via-interface] since we need to modify the alias CFN resource update policy
   */
  readonly alias: lambda.Alias;

  /**
   * The Lambda function to run before traffic routing starts.
   */
  readonly preHook?: lambda.IFunction;

  /**
   * The Lambda function to run after traffic routing starts.
   */
  readonly postHook?: lambda.IFunction;

  /**
   * Whether to continue a deployment even if fetching the alarm status from CloudWatch failed.
   *
   * @default false
   */
  readonly ignorePollAlarmsFailure?: boolean;

  /**
   * The auto-rollback configuration for this Deployment Group.
   */
  readonly autoRollback?: AutoRollbackConfig;
}

/**
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
export class LambdaDeploymentGroup extends cdk.Resource implements ILambdaDeploymentGroup {
  /**
   * Import an Lambda Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param attrs the properties of the referenced Deployment Group
   * @returns a Construct representing a reference to an existing Deployment Group
   */
  public static fromLambdaDeploymentGroupAttributes(
      scope: cdk.Construct,
      id: string,
      attrs: LambdaDeploymentGroupAttributes): ILambdaDeploymentGroup {
    return new ImportedLambdaDeploymentGroup(scope, id, attrs);
  }

  public readonly application: ILambdaApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly role: iam.IRole;

  private readonly alarms: cloudwatch.IAlarm[];
  private preHook?: lambda.IFunction;
  private postHook?: lambda.IFunction;

  constructor(scope: cdk.Construct, id: string, props: LambdaDeploymentGroupProps) {
    super(scope, id);

    this.application = props.application || new LambdaApplication(this, 'Application');
    this.alarms = props.alarms || [];

    this.role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com')
    });

    this.role.attachManagedPolicy('arn:aws:iam::aws:policy/service-role/AWSCodeDeployRoleForLambda');

    const resource = new CfnDeploymentGroup(this, 'Resource', {
      applicationName: this.application.applicationName,
      serviceRoleArn: this.role.roleArn,
      deploymentGroupName: props.deploymentGroupName,
      deploymentConfigName: (props.deploymentConfig || LambdaDeploymentConfig.AllAtOnce).deploymentConfigName,
      deploymentStyle: {
        deploymentType: 'BLUE_GREEN',
        deploymentOption: 'WITH_TRAFFIC_CONTROL'
      },
      alarmConfiguration: new cdk.Token(() => renderAlarmConfiguration(this.alarms, props.ignorePollAlarmsFailure)),
      autoRollbackConfiguration: new cdk.Token(() => renderAutoRollbackConfiguration(this.alarms, props.autoRollback)),
    });

    this.deploymentGroupName = resource.deploymentGroupName;
    this.deploymentGroupArn = arnForDeploymentGroup(this.application.applicationName, this.deploymentGroupName);

    if (props.preHook) {
      this.onPreHook(props.preHook);
    }
    if (props.postHook) {
      this.onPostHook(props.postHook);
    }

    (props.alias.node.findChild('Resource') as lambda.CfnAlias).options.updatePolicy = {
      codeDeployLambdaAliasUpdate: {
        applicationName: this.application.applicationName,
        deploymentGroupName: resource.deploymentGroupName,
        beforeAllowTrafficHook: new cdk.Token(() => this.preHook === undefined ? undefined : this.preHook.functionName).toString(),
        afterAllowTrafficHook: new cdk.Token(() => this.postHook === undefined ? undefined : this.postHook.functionName).toString()
      }
    };
  }

  /**
   * Associates an additional alarm with this Deployment Group.
   *
   * @param alarm the alarm to associate with this Deployment Group
   */
  public addAlarm(alarm: cloudwatch.IAlarm): void {
    this.alarms.push(alarm);
  }

  /**
   * Associate a function to run before deployment begins.
   * @param preHook function to run before deployment beings
   * @throws an error if a pre-hook function is already configured
   */
  public onPreHook(preHook: lambda.IFunction): void {
    if (this.preHook !== undefined) {
      throw new Error('A pre-hook function is already defined for this deployment group');
    }
    this.preHook = preHook;
    this.grantPutLifecycleEventHookExecutionStatus(this.preHook);
    this.preHook.grantInvoke(this.role);
  }

  /**
   * Associate a function to run after deployment completes.
   * @param postHook function to run after deployment completes
   * @throws an error if a post-hook function is already configured
   */
  public onPostHook(postHook: lambda.IFunction): void {
    if (this.postHook !== undefined) {
      throw new Error('A post-hook function is already defined for this deployment group');
    }
    this.postHook = postHook;
    this.grantPutLifecycleEventHookExecutionStatus(this.postHook);
    this.postHook.grantInvoke(this.role);
  }

  /**
   * Grant a principal permission to codedeploy:PutLifecycleEventHookExecutionStatus
   * on this deployment group resource.
   * @param grantee to grant permission to
   */
  public grantPutLifecycleEventHookExecutionStatus(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.deploymentGroupArn],
      actions: ['codedeploy:PutLifecycleEventHookExecutionStatus'],
    });
  }

  public export(): LambdaDeploymentGroupAttributes {
    return {
      application: this.application,
      deploymentGroupName: new cdk.CfnOutput(this, 'DeploymentGroupName', {
        value: this.deploymentGroupName
      }).makeImportValue().toString()
    };
  }
}

/**
 * Properties of a reference to a CodeDeploy Lambda Deployment Group.
 *
 * @see LambdaDeploymentGroup#import
 * @see ILambdaDeploymentGroup#export
 */
export interface LambdaDeploymentGroupAttributes {
  /**
   * The reference to the CodeDeploy Lambda Application
   * that this Deployment Group belongs to.
   */
  readonly application: ILambdaApplication;

  /**
   * The physical, human-readable name of the CodeDeploy Lambda Deployment Group
   * that we are referencing.
   */
  readonly deploymentGroupName: string;
}

class ImportedLambdaDeploymentGroup extends cdk.Construct implements ILambdaDeploymentGroup {
  public readonly application: ILambdaApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaDeploymentGroupAttributes) {
    super(scope, id);
    this.application = props.application;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentGroupArn = arnForDeploymentGroup(props.application.applicationName, props.deploymentGroupName);
  }

  public export() {
    return this.props;
  }
}
