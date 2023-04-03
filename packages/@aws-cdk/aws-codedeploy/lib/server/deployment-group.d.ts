import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IServerApplication } from './application';
import { IServerDeploymentConfig } from './deployment-config';
import { LoadBalancer } from './load-balancer';
import { DeploymentGroupBase } from '../private/base-deployment-group';
import { AutoRollbackConfig } from '../rollback-config';
export interface IServerDeploymentGroup extends cdk.IResource {
    readonly application: IServerApplication;
    readonly role?: iam.IRole;
    /**
     * @attribute
     */
    readonly deploymentGroupName: string;
    /**
     * @attribute
     */
    readonly deploymentGroupArn: string;
    readonly deploymentConfig: IServerDeploymentConfig;
    readonly autoScalingGroups?: autoscaling.IAutoScalingGroup[];
}
/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Group.
 *
 * @see ServerDeploymentGroup#import
 */
export interface ServerDeploymentGroupAttributes {
    /**
     * The reference to the CodeDeploy EC2/on-premise Application
     * that this Deployment Group belongs to.
     */
    readonly application: IServerApplication;
    /**
     * The physical, human-readable name of the CodeDeploy EC2/on-premise Deployment Group
     * that we are referencing.
     */
    readonly deploymentGroupName: string;
    /**
     * The Deployment Configuration this Deployment Group uses.
     *
     * @default ServerDeploymentConfig#OneAtATime
     */
    readonly deploymentConfig?: IServerDeploymentConfig;
}
/**
 * Represents a group of instance tags.
 * An instance will match a group if it has a tag matching
 * any of the group's tags by key and any of the provided values -
 * in other words, tag groups follow 'or' semantics.
 * If the value for a given key is an empty array,
 * an instance will match when it has a tag with the given key,
 * regardless of the value.
 * If the key is an empty string, any tag,
 * regardless of its key, with any of the given values, will match.
 */
export declare type InstanceTagGroup = {
    [key: string]: string[];
};
/**
 * Represents a set of instance tag groups.
 * An instance will match a set if it matches all of the groups in the set -
 * in other words, sets follow 'and' semantics.
 * You can have a maximum of 3 tag groups inside a set.
 */
export declare class InstanceTagSet {
    private readonly _instanceTagGroups;
    constructor(...instanceTagGroups: InstanceTagGroup[]);
    get instanceTagGroups(): InstanceTagGroup[];
}
/**
 * Construction properties for `ServerDeploymentGroup`.
 */
export interface ServerDeploymentGroupProps {
    /**
     * The CodeDeploy EC2/on-premise Application this Deployment Group belongs to.
     *
     * @default - A new Application will be created.
     */
    readonly application?: IServerApplication;
    /**
     * The service Role of this Deployment Group.
     *
     * @default - A new Role will be created.
     */
    readonly role?: iam.IRole;
    /**
     * The physical, human-readable name of the CodeDeploy Deployment Group.
     *
     * @default - An auto-generated name will be used.
     */
    readonly deploymentGroupName?: string;
    /**
     * The EC2/on-premise Deployment Configuration to use for this Deployment Group.
     *
     * @default ServerDeploymentConfig#OneAtATime
     */
    readonly deploymentConfig?: IServerDeploymentConfig;
    /**
     * The auto-scaling groups belonging to this Deployment Group.
     *
     * Auto-scaling groups can also be added after the Deployment Group is created
     * using the `#addAutoScalingGroup` method.
     *
     * [disable-awslint:ref-via-interface] is needed because we update userdata
     * for ASGs to install the codedeploy agent.
     *
     * @default []
     */
    readonly autoScalingGroups?: autoscaling.IAutoScalingGroup[];
    /**
     * If you've provided any auto-scaling groups with the `#autoScalingGroups` property,
     * you can set this property to add User Data that installs the CodeDeploy agent on the instances.
     *
     * @default true
     * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/codedeploy-agent-operations-install.html
     */
    readonly installAgent?: boolean;
    /**
     * The load balancer to place in front of this Deployment Group.
     * Can be created from either a classic Elastic Load Balancer,
     * or an Application Load Balancer / Network Load Balancer Target Group.
     *
     * @default - Deployment Group will not have a load balancer defined.
     */
    readonly loadBalancer?: LoadBalancer;
    /**
     * All EC2 instances matching the given set of tags when a deployment occurs will be added to this Deployment Group.
     *
     * @default - No additional EC2 instances will be added to the Deployment Group.
     */
    readonly ec2InstanceTags?: InstanceTagSet;
    /**
     * All on-premise instances matching the given set of tags when a deployment occurs will be added to this Deployment Group.
     *
     * @default - No additional on-premise instances will be added to the Deployment Group.
     */
    readonly onPremiseInstanceTags?: InstanceTagSet;
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
 * A CodeDeploy Deployment Group that deploys to EC2/on-premise instances.
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
export declare class ServerDeploymentGroup extends DeploymentGroupBase implements IServerDeploymentGroup {
    /**
     * Import an EC2/on-premise Deployment Group defined either outside the CDK app,
     * or in a different region.
     *
     * @param scope the parent Construct for this new Construct
     * @param id the logical ID of this new Construct
     * @param attrs the properties of the referenced Deployment Group
     * @returns a Construct representing a reference to an existing Deployment Group
     */
    static fromServerDeploymentGroupAttributes(scope: Construct, id: string, attrs: ServerDeploymentGroupAttributes): IServerDeploymentGroup;
    readonly application: IServerApplication;
    readonly deploymentConfig: IServerDeploymentConfig;
    /**
     * The service Role of this Deployment Group.
     */
    readonly role?: iam.IRole;
    private readonly _autoScalingGroups;
    private readonly installAgent;
    private readonly codeDeployBucket;
    private readonly alarms;
    constructor(scope: Construct, id: string, props?: ServerDeploymentGroupProps);
    /**
     * Adds an additional auto-scaling group to this Deployment Group.
     *
     * @param asg the auto-scaling group to add to this Deployment Group.
     * [disable-awslint:ref-via-interface] is needed in order to install the code
     * deploy agent by updating the ASGs user data.
     */
    addAutoScalingGroup(asg: autoscaling.AutoScalingGroup): void;
    /**
     * Associates an additional alarm with this Deployment Group.
     *
     * @param alarm the alarm to associate with this Deployment Group
     */
    addAlarm(alarm: cloudwatch.IAlarm): void;
    get autoScalingGroups(): autoscaling.IAutoScalingGroup[] | undefined;
    private addCodeDeployAgentInstallUserData;
    private loadBalancerInfo;
    private ec2TagSet;
    private onPremiseTagSet;
    private tagGroup2TagsArray;
}
