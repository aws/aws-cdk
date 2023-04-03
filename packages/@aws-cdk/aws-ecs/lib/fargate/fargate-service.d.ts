import * as ec2 from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
import { BaseService, BaseServiceOptions, IBaseService, IService } from '../base/base-service';
import { TaskDefinition } from '../base/task-definition';
import { ICluster } from '../cluster';
/**
 * The properties for defining a service using the Fargate launch type.
 */
export interface FargateServiceProps extends BaseServiceOptions {
    /**
     * The task definition to use for tasks in the service.
     *
     * [disable-awslint:ref-via-interface]
     */
    readonly taskDefinition: TaskDefinition;
    /**
     * Specifies whether the task's elastic network interface receives a public IP address.
     *
     * If true, each task will receive a public IP address.
     *
     * @default false
     */
    readonly assignPublicIp?: boolean;
    /**
     * The subnets to associate with the service.
     *
     * @default - Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
     *
     * @default - A new security group is created.
     * @deprecated use securityGroups instead.
     */
    readonly securityGroup?: ec2.ISecurityGroup;
    /**
     * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
     *
     * @default - A new security group is created.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
     * The platform version on which to run your service.
     *
     * If one is not specified, the LATEST platform version is used by default. For more information, see
     * [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html)
     * in the Amazon Elastic Container Service Developer Guide.
     *
     * @default Latest
     */
    readonly platformVersion?: FargatePlatformVersion;
}
/**
 * The interface for a service using the Fargate launch type on an ECS cluster.
 */
export interface IFargateService extends IService {
}
/**
 * The properties to import from the service using the Fargate launch type.
 */
export interface FargateServiceAttributes {
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
 * This creates a service using the Fargate launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export declare class FargateService extends BaseService implements IFargateService {
    /**
     * Imports from the specified service ARN.
     */
    static fromFargateServiceArn(scope: Construct, id: string, fargateServiceArn: string): IFargateService;
    /**
     * Imports from the specified service attributes.
     */
    static fromFargateServiceAttributes(scope: Construct, id: string, attrs: FargateServiceAttributes): IBaseService;
    /**
     * Constructs a new instance of the FargateService class.
     */
    constructor(scope: Construct, id: string, props: FargateServiceProps);
}
/**
 * The platform version on which to run your service.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
 */
export declare enum FargatePlatformVersion {
    /**
     * The latest, recommended platform version.
     */
    LATEST = "LATEST",
    /**
     * Version 1.4.0
     *
     * Supports EFS endpoints, CAP_SYS_PTRACE Linux capability,
     * network performance metrics in CloudWatch Container Insights,
     * consolidated 20 GB ephemeral volume.
     */
    VERSION1_4 = "1.4.0",
    /**
     * Version 1.3.0
     *
     * Supports secrets, task recycling.
     */
    VERSION1_3 = "1.3.0",
    /**
     * Version 1.2.0
     *
     * Supports private registries.
     */
    VERSION1_2 = "1.2.0",
    /**
     * Version 1.1.0
     *
     * Supports task metadata, health checks, service discovery.
     */
    VERSION1_1 = "1.1.0",
    /**
     * Initial release
     *
     * Based on Amazon Linux 2017.09.
     */
    VERSION1_0 = "1.0.0"
}
