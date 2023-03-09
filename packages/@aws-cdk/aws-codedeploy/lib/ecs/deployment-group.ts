import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { IEcsApplication, EcsApplication } from './application';
import { EcsDeploymentConfig, IEcsDeploymentConfig } from './deployment-config';
import { CfnDeploymentGroup } from '../codedeploy.generated';
import { ImportedDeploymentGroupBase, DeploymentGroupBase } from '../private/base-deployment-group';
import { renderAlarmConfiguration, renderAutoRollbackConfiguration } from '../private/utils';
import { AutoRollbackConfig } from '../rollback-config';

/**
 * Interface for an ECS deployment group.
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
 * Specify how the deployment behaves and how traffic is routed to the ECS service during a blue-green ECS deployment.
 *
 * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-steps-ecs.html#deployment-steps-what-happens
 * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-hooks.html#appspec-hooks-ecs
 */
export interface EcsBlueGreenDeploymentConfig {
  /**
   * The target group that will be associated with the 'blue' ECS task set during a blue-green deployment.
   */
  readonly blueTargetGroup: elbv2.ITargetGroup;

  /**
   * The target group that will be associated with the 'green' ECS task set during a blue-green deployment.
   */
  readonly greenTargetGroup: elbv2.ITargetGroup;

  /**
   * The load balancer listener used to serve production traffic and to shift production traffic from the
   * 'blue' ECS task set to the 'green' ECS task set during a blue-green deployment.
   */
  readonly listener: elbv2.IListener;

  /**
   * The load balancer listener used to route test traffic to the 'green' ECS task set during a blue-green deployment.
   *
   * During a blue-green deployment, validation can occur after test traffic has been re-routed and before production
   * traffic has been re-routed to the 'green' ECS task set.  You can specify one or more Lambda funtions in the
   * deployment's AppSpec file that run during the AfterAllowTestTraffic hook. The functions can run validation tests.
   * If a validation test fails, a deployment rollback is triggered. If the validation tests succeed, the next hook in
   * the deployment lifecycle, BeforeAllowTraffic, is triggered.
   *
   * If a test listener is not specified, the deployment will proceed to routing the production listener to the 'green' ECS task set
   * and will skip the AfterAllowTestTraffic hook.
   *
   * @default No test listener will be added
   */
  readonly testListener?: elbv2.IListener;

  /**
   * Specify how long CodeDeploy waits for approval to continue a blue-green deployment before it stops the deployment.
   *
   * After provisioning the 'green' ECS task set and re-routing test traffic, CodeDeploy can wait for approval before
   * continuing the deployment and re-routing production traffic.  During this wait time, validation such as manual
   * testing or running integration tests can occur using the test traffic port, prior to exposing the new 'green' task
   * set to production traffic.  To approve the deployment, validation steps use the CodeDeploy
   * [ContinueDeployment API(https://docs.aws.amazon.com/codedeploy/latest/APIReference/API_ContinueDeployment.html).
   * If the ContinueDeployment API is not called within the wait time period, CodeDeploy will stop the deployment.
   *
   * By default, CodeDeploy will not wait for deployment approval.  After re-routing test traffic to the 'green' ECS task set
   * and running any 'AfterAllowTestTraffic' and 'BeforeAllowTraffic' lifecycle hooks, the deployment will immediately
   * re-route production traffic to the 'green' ECS task set.
   *
   * @default 0
   */
  readonly deploymentApprovalWaitTime?: cdk.Duration;

  /**
    * Specify how long CodeDeploy waits before it terminates the original 'blue' ECS task set when a blue-green deployment is complete.
    *
    * During this wait time, CodeDeploy will continue to monitor any CloudWatch alarms specified for the deployment group,
    * and the deployment group can be configured to automatically roll back if those alarms fire.  Once CodeDeploy begins to
    * terminate the 'blue' ECS task set, the deployment can no longer be rolled back, manually or automatically.
    *
    * By default, the deployment will immediately terminate the 'blue' ECS task set after production traffic is successfully
    * routed to the 'green' ECS task set.
    *
    * @default 0
    */
  readonly terminationWaitTime?: cdk.Duration;
}

/**
 * Construction properties for `EcsDeploymentGroup`.
 */
export interface EcsDeploymentGroupProps {
  /**
   * The reference to the CodeDeploy ECS Application that this Deployment Group belongs to.
   *
   * @default One will be created for you.
   */
  readonly application?: IEcsApplication;

  /**
   * The physical, human-readable name of the CodeDeploy Deployment Group.
   *
   * @default An auto-generated name will be used.
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
   * Alarms can also be added after the Deployment Group is created using the `#addAlarm` method.
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
   * The ECS service to deploy with this Deployment Group.
   */
  readonly service: ecs.IBaseService;

  /**
   * The configuration options for blue-green ECS deployments
   */
  readonly blueGreenDeploymentConfig: EcsBlueGreenDeploymentConfig;

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
}

/**
 * A CodeDeploy deployment group that orchestrates ECS blue-green deployments.
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
export class EcsDeploymentGroup extends DeploymentGroupBase implements IEcsDeploymentGroup {
  /**
   * Reference an ECS Deployment Group defined outside the CDK app.
   *
   * Account and region for the DeploymentGroup are taken from the application.
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
  public readonly deploymentConfig: IEcsDeploymentConfig;
  /**
   * The service Role of this Deployment Group.
   */
  public readonly role: iam.IRole;

  private readonly alarms: cloudwatch.IAlarm[];

  constructor(scope: Construct, id: string, props: EcsDeploymentGroupProps) {
    super(scope, id, {
      deploymentGroupName: props.deploymentGroupName,
      role: props.role,
      roleConstructId: 'ServiceRole',
    });
    this.role = this._role;

    this.application = props.application || new EcsApplication(this, 'Application');
    this.alarms = props.alarms || [];

    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AWSCodeDeployRoleForECS'));
    this.deploymentConfig = this._bindDeploymentConfig(props.deploymentConfig || EcsDeploymentConfig.ALL_AT_ONCE);

    if (cdk.Resource.isOwnedResource(props.service)) {
      const cfnSvc = (props.service as ecs.BaseService).node.defaultChild as ecs.CfnService;
      if (cfnSvc.deploymentController === undefined ||
        (cfnSvc.deploymentController! as ecs.CfnService.DeploymentControllerProperty).type !== ecs.DeploymentControllerType.CODE_DEPLOY) {
        throw new Error(
          'The ECS service associated with the deployment group must use the CODE_DEPLOY deployment controller type',
        );
      }

      if (cfnSvc.taskDefinition !== (props.service as ecs.BaseService).taskDefinition.family) {
        throw new Error(
          'The ECS service associated with the deployment group must specify the task definition using the task definition family name only. Otherwise, the task definition cannot be updated in the stack',
        );
      }
    }

    const removeAlarmsFromDeploymentGroup = cdk.FeatureFlags.of(this).isEnabled(CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP);

    const resource = new CfnDeploymentGroup(this, 'Resource', {
      applicationName: this.application.applicationName,
      serviceRoleArn: this.role.roleArn,
      deploymentGroupName: this.physicalName,
      deploymentConfigName: this.deploymentConfig.deploymentConfigName,
      deploymentStyle: {
        deploymentType: 'BLUE_GREEN',
        deploymentOption: 'WITH_TRAFFIC_CONTROL',
      },
      ecsServices: [{
        clusterName: props.service.cluster.clusterName,
        serviceName: props.service.serviceName,
      }],
      blueGreenDeploymentConfiguration: cdk.Lazy.any({
        produce: () => this.renderBlueGreenDeploymentConfiguration(props.blueGreenDeploymentConfig),
      }),
      loadBalancerInfo: cdk.Lazy.any({ produce: () => this.renderLoadBalancerInfo(props.blueGreenDeploymentConfig) }),
      alarmConfiguration: cdk.Lazy.any({
        produce: () => renderAlarmConfiguration(this.alarms, props.ignorePollAlarmsFailure, removeAlarmsFromDeploymentGroup),
      }),
      autoRollbackConfiguration: cdk.Lazy.any({ produce: () => renderAutoRollbackConfiguration(this.alarms, props.autoRollback) }),
    });

    this._setNameAndArn(resource, this.application);

    // If the deployment config is a construct, add a dependency to ensure the deployment config
    // is created before the deployment group is.
    if (Construct.isConstruct(this.deploymentConfig)) {
      this.node.addDependency(this.deploymentConfig);
    }
  }

  /**
   * Associates an additional alarm with this Deployment Group.
   *
   * @param alarm the alarm to associate with this Deployment Group
   */
  public addAlarm(alarm: cloudwatch.IAlarm): void {
    this.alarms.push(alarm);
  }

  private renderBlueGreenDeploymentConfiguration(options: EcsBlueGreenDeploymentConfig):
  CfnDeploymentGroup.BlueGreenDeploymentConfigurationProperty {
    return {
      deploymentReadyOption: {
        actionOnTimeout: options.deploymentApprovalWaitTime ? 'STOP_DEPLOYMENT' : 'CONTINUE_DEPLOYMENT',
        waitTimeInMinutes: options.deploymentApprovalWaitTime?.toMinutes() ?? 0,
      },
      terminateBlueInstancesOnDeploymentSuccess: {
        action: 'TERMINATE',
        terminationWaitTimeInMinutes: options.terminationWaitTime?.toMinutes() ?? 0,
      },
    };
  }

  private renderLoadBalancerInfo(options: EcsBlueGreenDeploymentConfig): CfnDeploymentGroup.LoadBalancerInfoProperty {
    return {
      targetGroupPairInfoList: [
        {
          targetGroups: [
            {
              name: options.blueTargetGroup.targetGroupName,
            },
            {
              name: options.greenTargetGroup.targetGroupName,
            },
          ],
          prodTrafficRoute: {
            listenerArns: [
              options.listener.listenerArn,
            ],
          },
          testTrafficRoute: options.testListener ? {
            listenerArns: [
              options.testListener.listenerArn,
            ],
          } : undefined,
        },
      ],
    };
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

class ImportedEcsDeploymentGroup extends ImportedDeploymentGroupBase implements IEcsDeploymentGroup {
  public readonly application: IEcsApplication;
  public readonly deploymentConfig: IEcsDeploymentConfig;

  constructor(scope: Construct, id: string, props: EcsDeploymentGroupAttributes) {
    super(scope, id, {
      application: props.application,
      deploymentGroupName: props.deploymentGroupName,
    });

    this.application = props.application;
    this.deploymentConfig = this._bindDeploymentConfig(props.deploymentConfig || EcsDeploymentConfig.ALL_AT_ONCE);
  }
}
