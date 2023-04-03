import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IEcsApplication } from './application';
import { IEcsDeploymentConfig } from './deployment-config';
import { DeploymentGroupBase } from '../private/base-deployment-group';
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
export declare class EcsDeploymentGroup extends DeploymentGroupBase implements IEcsDeploymentGroup {
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
    static fromEcsDeploymentGroupAttributes(scope: Construct, id: string, attrs: EcsDeploymentGroupAttributes): IEcsDeploymentGroup;
    readonly application: IEcsApplication;
    readonly deploymentConfig: IEcsDeploymentConfig;
    /**
     * The service Role of this Deployment Group.
     */
    readonly role: iam.IRole;
    private readonly alarms;
    constructor(scope: Construct, id: string, props: EcsDeploymentGroupProps);
    /**
     * Associates an additional alarm with this Deployment Group.
     *
     * @param alarm the alarm to associate with this Deployment Group
     */
    addAlarm(alarm: cloudwatch.IAlarm): void;
    private renderBlueGreenDeploymentConfiguration;
    private renderLoadBalancerInfo;
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
