import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
import { BaseService, BaseServiceOptions, IBaseService, IService } from '../base/base-service';
import { TaskDefinition } from '../base/task-definition';
import { ICluster } from '../cluster';
import { PlacementConstraint, PlacementStrategy } from '../placement';
/**
 * The properties for defining a service using the EC2 launch type.
 */
export interface Ec2ServiceProps extends BaseServiceOptions {
    /**
     * The task definition to use for tasks in the service.
     *
     * [disable-awslint:ref-via-interface]
     */
    readonly taskDefinition: TaskDefinition;
    /**
     * Specifies whether the task's elastic network interface receives a public IP address.
     * If true, each task will receive a public IP address.
     *
     * This property is only used for tasks that use the awsvpc network mode.
     *
     * @default false
     */
    readonly assignPublicIp?: boolean;
    /**
     * The subnets to associate with the service.
     *
     * This property is only used for tasks that use the awsvpc network mode.
     *
     * @default - Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
     *
     * This property is only used for tasks that use the awsvpc network mode.
     *
     * @default - A new security group is created.
     * @deprecated use securityGroups instead.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
     *
     * This property is only used for tasks that use the awsvpc network mode.
     *
     * @default - A new security group is created.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
     * The placement constraints to use for tasks in the service. For more information, see
     * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
     *
     * @default - No constraints.
     */
    readonly placementConstraints?: PlacementConstraint[];
    /**
     * The placement strategies to use for tasks in the service. For more information, see
     * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
     *
     * @default - No strategies.
     */
    readonly placementStrategies?: PlacementStrategy[];
    /**
     * Specifies whether the service will use the daemon scheduling strategy.
     * If true, the service scheduler deploys exactly one task on each container instance in your cluster.
     *
     * When you are using this strategy, do not specify a desired number of tasks orany task placement strategies.
     *
     * @default false
     */
    readonly daemon?: boolean;
}
/**
 * The interface for a service using the EC2 launch type on an ECS cluster.
 */
export interface IEc2Service extends IService {
}
/**
 * The properties to import from the service using the EC2 launch type.
 */
export interface Ec2ServiceAttributes {
    /**
     * The cluster that hosts the service.
     */
    readonly cluster: ICluster;
    /**
     * The service ARN.
     *
     * @default - either this, or `serviceName`, is required
     */
    readonly serviceArn?: string;
    /**
     * The name of the service.
     *
     * @default - either this, or `serviceArn`, is required
     */
    readonly serviceName?: string;
}
/**
 * This creates a service using the EC2 launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export declare class Ec2Service extends BaseService implements IEc2Service {
    /**
     * Imports from the specified service ARN.
     */
    static fromEc2ServiceArn(scope: Construct, id: string, ec2ServiceArn: string): IEc2Service;
    /**
     * Imports from the specified service attributes.
     */
    static fromEc2ServiceAttributes(scope: Construct, id: string, attrs: Ec2ServiceAttributes): IBaseService;
    private readonly constraints;
    private readonly strategies;
    private readonly daemon;
    /**
     * Constructs a new instance of the Ec2Service class.
     */
    constructor(scope: Construct, id: string, props: Ec2ServiceProps);
    /**
     * Adds one or more placement strategies to use for tasks in the service. For more information, see
     * [Amazon ECS Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html).
     */
    addPlacementStrategies(...strategies: PlacementStrategy[]): void;
    /**
     * Adds one or more placement constraints to use for tasks in the service. For more information, see
     * [Amazon ECS Task Placement Constraints](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-constraints.html).
     */
    addPlacementConstraints(...constraints: PlacementConstraint[]): void;
    /**
     * Validates this Ec2Service.
     */
    private validateEc2Service;
}
/**
 * The built-in container instance attributes
 */
export declare class BuiltInAttributes {
    /**
     * The id of the instance.
     */
    static readonly INSTANCE_ID = "instanceId";
    /**
     * The AvailabilityZone where the instance is running in.
     */
    static readonly AVAILABILITY_ZONE = "attribute:ecs.availability-zone";
    /**
     * The AMI id the instance is using.
     */
    static readonly AMI_ID = "attribute:ecs.ami-id";
    /**
     * The EC2 instance type.
     */
    static readonly INSTANCE_TYPE = "attribute:ecs.instance-type";
    /**
     * The operating system of the instance.
     *
     * Either 'linux' or 'windows'.
     */
    static readonly OS_TYPE = "attribute:ecs.os-type";
}
