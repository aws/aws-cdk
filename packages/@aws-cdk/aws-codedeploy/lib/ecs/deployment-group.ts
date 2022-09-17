import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentGroup } from '../codedeploy.generated';
import { AutoRollbackConfig } from '../rollback-config';
import { arnForDeploymentGroup, renderAlarmConfiguration, renderAutoRollbackConfiguration, validateName } from '../utils';
import { EcsApplication, IEcsApplication } from './application';
import { EcsDeploymentConfig, IEcsDeploymentConfig } from './deployment-config';

/**
 * Represents a reference to a CodeDeploy Deployment Group deploying to Amazon ECS.
 *
 * If you're managing the Deployment Group alongside the rest of your CDK resources,
 * use the {@link EcsDeploymentGroup} class.
 *
 * If you want to reference an already existing Deployment Group,
 * or one defined in a different CDK Stack,
 * use the {@link EcsDeploymentGroup#fromEcsDeploymentGroupAttributes} method.
 */
export interface IEcsDeploymentGroup extends cdk.IResource {
  /**
   * The reference to the CodeDeploy ECS Application that this Deployment Group belongs to.
   */
  readonly application: IEcsApplication;

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
   * The Deployment Configuration this Group uses.
   */
  readonly deploymentConfig: IEcsDeploymentConfig;
}

/**
 * Construction properties for {@link EcsDeploymentGroup}.
 */
export interface EcsDeploymentGroupProps {
  /**
   * The reference to the ECS Services to deploy.
   *
   * [disable-awslint:ref-via-interface] because the service needs to have the deploy controller changed to Code Deploy
   */
  readonly services: ecs.BaseService[];

  /**
   * The reference to the CodeDeploy ECS Application
   * that this Deployment Group belongs to.
   *
   * @default - One will be created for you.
   */
  readonly application?: IEcsApplication;

  /**
   * The physical, human-readable name of the CodeDeploy ECS Deployment Group
   * that we are referencing.
   *
   * @default an auto-generated name will be used
   */
  readonly deploymentGroupName?: string;

  /**
   * The Deployment Configuration this Deployment Group uses.
   *
   * @default EcsDeploymentConfig.ALL_AT_ONCE
   */
  readonly deploymentConfig?: IEcsDeploymentConfig;

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
   * @default - A new Role will be created.
   */
  readonly role?: iam.IRole;


  /**
   * Whether to continue a deployment even if fetching the alarm status from CloudWatch failed.
   *
   * @default false
   */
  readonly ignorePollAlarmsFailure?: boolean;

  /**
   * The auto-rollback configuration for this Deployment Group.
   *
   * @default - default AutoRollbackConfig.
   */
  readonly autoRollback?: AutoRollbackConfig;

  /**
   * The blue/green deployment configuration
   */
  readonly blueGreenDeploymentConfiguration: EcsBlueGreenDeploymentConfig;
}

/**
 * A CodeDeploy Deployment Group that deploys to an Amazon ECS service.
 *
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
export class EcsDeploymentGroup extends cdk.Resource implements IEcsDeploymentGroup {
  /**
   * Import an ECS Deployment Group defined outside the CDK app.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param attrs the properties of the referenced Deployment Group
   * @returns a Construct representing a reference to an existing Deployment Group
   */
  public static fromEcsDeploymentGroupAttributes(
    scope:Construct,
    id: string,
    attrs: EcsDeploymentGroupAttributes): IEcsDeploymentGroup {
    return new ImportedEcsDeploymentGroup(scope, id, attrs);
  }

  public readonly application: IEcsApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly deploymentConfig: IEcsDeploymentConfig;
  /**
   * The role for this CodeDeploy to use when deploying to this deployment group.
   */
  public readonly role: iam.IRole;
  private readonly alarms: cloudwatch.IAlarm[];

  constructor(scope: Construct, id: string, props: EcsDeploymentGroupProps) {
    super(scope, id, {
      physicalName: props.deploymentGroupName,
    });

    this.application = props.application || new EcsApplication(this, 'Application');
    this.alarms = props.alarms || [];

    this.role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
    });
    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodeDeployRoleForECSLimited'));
    this.deploymentConfig = props.deploymentConfig || EcsDeploymentConfig.ALL_AT_ONCE;

    // Change ECS Service deployment controller to codedeploy
    for (const service of props.services) {
      const cfnService = service.node.defaultChild as ecs.CfnService;
      cfnService.deploymentController = { type: ecs.DeploymentControllerType.CODE_DEPLOY };

      // Remove revision from ECS Service task definition to allow Blue/Green deploys to work
      cfnService.taskDefinition = service.taskDefinition.family;
      service.node.addDependency(service.taskDefinition);
    }

    const resource = new CfnDeploymentGroup(this, 'Resource', {
      applicationName: this.application.applicationName,
      serviceRoleArn: this.role.roleArn,
      deploymentGroupName: this.physicalName,
      deploymentConfigName: this.deploymentConfig.deploymentConfigName,
      deploymentStyle: {
        deploymentType: 'BLUE_GREEN',
        deploymentOption: 'WITH_TRAFFIC_CONTROL',
      },
      ecsServices: props.services.map(s => {
        return {
          clusterName: s.cluster.clusterName,
          serviceName: s.serviceName,
        };
      }),
      loadBalancerInfo: cdk.Lazy.any({
        produce: () => renderLoadBalancerInfo(props.blueGreenDeploymentConfiguration),
      }),
      blueGreenDeploymentConfiguration: cdk.Lazy.any({
        produce: () => renderBlueGreenDeploymentConfiguration( props.blueGreenDeploymentConfiguration ),
      }),
      alarmConfiguration: cdk.Lazy.any({ produce: () => renderAlarmConfiguration(this.alarms, props.ignorePollAlarmsFailure) }),
      autoRollbackConfiguration: cdk.Lazy.any({ produce: () => renderAutoRollbackConfiguration(this.alarms, props.autoRollback) }),
    });

    this.deploymentGroupName = this.getResourceNameAttribute(resource.ref);
    this.deploymentGroupArn = this.getResourceArnAttribute(arnForDeploymentGroup(this.application.applicationName, resource.ref), {
      service: 'codedeploy',
      resource: 'deploymentgroup',
      resourceName: `${this.application.applicationName}/${this.physicalName}`,
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
    });

    // If the deployment config is a construct, add a dependency to ensure the deployment config
    // is created before the deployment group is.
    if (this.deploymentConfig instanceof Construct) {
      this.node.addDependency(this.deploymentConfig);
    }

    this.node.addValidation({ validate: () => validateName('Deployment group', this.physicalName) });
  }

  /**
 * Associates an additional alarm with this Deployment Group.
 *
 * @param alarm the alarm to associate with this Deployment Group
 */
  public addAlarm(alarm: cloudwatch.IAlarm): void {
    this.alarms.push(alarm);
  }
}

/**
 * Properties of a reference to a CodeDeploy ECS Deployment Group.
 *
 * @see EcsDeploymentGroup#fromEcsDeploymentGroupAttributes
 */
export interface EcsDeploymentGroupAttributes {
  /**
   * The reference to the CodeDeploy ECS Application
   * that this Deployment Group belongs to.
   */
  readonly application: IEcsApplication;

  /**
   * The physical, human-readable name of the CodeDeploy ECS Deployment Group
   * that we are referencing.
   */
  readonly deploymentGroupName: string;

  /**
   * The Deployment Configuration this Deployment Group uses.
   *
   * @default EcsDeploymentConfig.ALL_AT_ONCE
   */
  readonly deploymentConfig?: IEcsDeploymentConfig;
}

class ImportedEcsDeploymentGroup extends cdk.Resource implements IEcsDeploymentGroup {
  public readonly application: IEcsApplication;
  public readonly deploymentGroupName: string;
  public readonly deploymentGroupArn: string;
  public readonly deploymentConfig: IEcsDeploymentConfig;

  constructor(scope:Construct, id: string, props: EcsDeploymentGroupAttributes) {
    super(scope, id);
    this.application = props.application;
    this.deploymentGroupName = props.deploymentGroupName;
    this.deploymentGroupArn = arnForDeploymentGroup(props.application.applicationName, props.deploymentGroupName);
    this.deploymentConfig = props.deploymentConfig || EcsDeploymentConfig.ALL_AT_ONCE;
  }
}

/**
 * Configuraiton for blue green deployments.
 */
export interface EcsBlueGreenDeploymentConfig {
  /**
   * The reference to the production listener for the deployment.
   */
  readonly prodListener: elbv2.IApplicationListener | elbv2.INetworkListener;

  /**
   * The reference to the test listener for the deployment.
   *
   * @default - No test listener will be used
   */
  readonly testListener?: elbv2.IApplicationListener | elbv2.INetworkListener;

  /**
   * The target group for the blue task set.
   */
  readonly blueTargetGroup: elbv2.ITargetGroup;

  /**
   * The target group for the green task set.
   */
  readonly greenTargetGroup: elbv2.ITargetGroup;

  /**
   * The time to wait for a ContinueDeployment after the deployment is ready.
   *
   * @default 0 - automatically continue once the deployment is ready.
   */
  readonly waitTimeForContinueDeployment?: cdk.Duration;

  /**
   * The time to wait before terminating old tasks.
   *
   * @default 0 - terminate immediately
   */
  readonly waitTimeForTermination?: cdk.Duration;
}

function renderBlueGreenDeploymentConfiguration(
  blueGreenDeploymentConfig: EcsBlueGreenDeploymentConfig,
): CfnDeploymentGroup.BlueGreenDeploymentConfigurationProperty {
  let deploymentReadyOption: CfnDeploymentGroup.DeploymentReadyOptionProperty;
  if (blueGreenDeploymentConfig.waitTimeForContinueDeployment) {
    deploymentReadyOption = {
      actionOnTimeout: 'STOP_DEPLOYMENT',
      waitTimeInMinutes: blueGreenDeploymentConfig.waitTimeForContinueDeployment.toMinutes(),
    };
  } else {
    deploymentReadyOption = {
      actionOnTimeout: 'CONTINUE_DEPLOYMENT',
    };
  }
  let terminateBlueInstancesOnDeploymentSuccess = {
    action: 'TERMINATE',
    terminationWaitTimeInMinutes: blueGreenDeploymentConfig.waitTimeForTermination ?
      blueGreenDeploymentConfig.waitTimeForTermination.toMinutes() : 0,
  };
  return {
    deploymentReadyOption,
    terminateBlueInstancesOnDeploymentSuccess,
  };
}

function renderLoadBalancerInfo(
  blueGreenDeploymentConfig: EcsBlueGreenDeploymentConfig,
): CfnDeploymentGroup.LoadBalancerInfoProperty {
  const targetGroupPairInfo: CfnDeploymentGroup.TargetGroupPairInfoProperty = {
    targetGroups: [{
      name: blueGreenDeploymentConfig.blueTargetGroup.targetGroupName,
    }, {
      name: blueGreenDeploymentConfig.greenTargetGroup.targetGroupName,
    }],
    prodTrafficRoute: {
      listenerArns: [blueGreenDeploymentConfig.prodListener.listenerArn],
    },
    testTrafficRoute: blueGreenDeploymentConfig.testListener? {
      listenerArns: [blueGreenDeploymentConfig.testListener.listenerArn],
    } : undefined,
  };
  return {
    targetGroupPairInfoList: [targetGroupPairInfo],
  };
}