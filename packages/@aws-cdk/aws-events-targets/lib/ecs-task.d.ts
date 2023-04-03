import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import { ContainerOverride } from './ecs-task-properties';
import { TargetBaseProps } from './util';
/**
 * Properties to define an ECS Event Task
 */
export interface EcsTaskProps extends TargetBaseProps {
    /**
     * Cluster where service will be deployed
     */
    readonly cluster: ecs.ICluster;
    /**
     * Task Definition of the task that should be started
     */
    readonly taskDefinition: ecs.ITaskDefinition;
    /**
     * How many tasks should be started when this event is triggered
     *
     * @default 1
     */
    readonly taskCount?: number;
    /**
     * Container setting overrides
     *
     * Key is the name of the container to override, value is the
     * values you want to override.
     */
    readonly containerOverrides?: ContainerOverride[];
    /**
     * In what subnets to place the task's ENIs
     *
     * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
     *
     * @default Private subnets
     */
    readonly subnetSelection?: ec2.SubnetSelection;
    /**
     * Existing security group to use for the task's ENIs
     *
     * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
     *
     * @default A new security group is created
     * @deprecated use securityGroups instead
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * Existing security groups to use for the task's ENIs
     *
     * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
     *
     * @default A new security group is created
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
     * Existing IAM role to run the ECS task
     *
     * @default A new IAM role is created
     */
    readonly role?: iam.IRole;
    /**
     * The platform version on which to run your task
     *
     * Unless you have specific compatibility requirements, you don't need to specify this.
     *
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
     *
     * @default - ECS will set the Fargate platform version to 'LATEST'
     */
    readonly platformVersion?: ecs.FargatePlatformVersion;
}
/**
 * Start a task on an ECS cluster
 */
export declare class EcsTask implements events.IRuleTarget {
    private readonly props;
    /**
     * The security group associated with the task. Only applicable with awsvpc network mode.
     *
     * @default - A new security group is created.
     * @deprecated use securityGroups instead.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * The security groups associated with the task. Only applicable with awsvpc network mode.
     *
     * @default - A new security group is created.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    private readonly cluster;
    private readonly taskDefinition;
    private readonly taskCount;
    private readonly role;
    private readonly platformVersion?;
    constructor(props: EcsTaskProps);
    /**
     * Allows using tasks as target of EventBridge events
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
    private createEventRolePolicyStatements;
}
