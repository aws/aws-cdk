import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { Construct } from 'constructs';
import { AssociateCloudMapServiceOptions, BaseService, BaseServiceOptions, CloudMapOptions, EcsTarget, IBaseService, IEcsLoadBalancerTarget, IService } from '../base/base-service';
import { ScalableTaskCount } from '../base/scalable-task-count';
import { LoadBalancerTargetOptions, TaskDefinition } from '../base/task-definition';
import { ICluster } from '../cluster';
/**
 * The properties for defining a service using the External launch type.
 */
export interface ExternalServiceProps extends BaseServiceOptions {
    /**
     * The task definition to use for tasks in the service.
     *
     * [disable-awslint:ref-via-interface]
     */
    readonly taskDefinition: TaskDefinition;
    /**
     * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
     *
     *
     * @default - A new security group is created.
     */
    readonly securityGroups?: ec2.ISecurityGroup[];
}
/**
 * The interface for a service using the External launch type on an ECS cluster.
 */
export interface IExternalService extends IService {
}
/**
 * The properties to import from the service using the External launch type.
 */
export interface ExternalServiceAttributes {
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
 * This creates a service using the External launch type on an ECS cluster.
 *
 * @resource AWS::ECS::Service
 */
export declare class ExternalService extends BaseService implements IExternalService {
    /**
     * Imports from the specified service ARN.
     */
    static fromExternalServiceArn(scope: Construct, id: string, externalServiceArn: string): IExternalService;
    /**
     * Imports from the specified service attributes.
     */
    static fromExternalServiceAttributes(scope: Construct, id: string, attrs: ExternalServiceAttributes): IBaseService;
    /**
     * Constructs a new instance of the ExternalService class.
     */
    constructor(scope: Construct, id: string, props: ExternalServiceProps);
    /**
     * Overriden method to throw error as `attachToApplicationTargetGroup` is not supported for external service
     */
    attachToApplicationTargetGroup(_targetGroup: elbv2.IApplicationTargetGroup): elbv2.LoadBalancerTargetProps;
    /**
     * Overriden method to throw error as `loadBalancerTarget` is not supported for external service
     */
    loadBalancerTarget(_options: LoadBalancerTargetOptions): IEcsLoadBalancerTarget;
    /**
     * Overriden method to throw error as `registerLoadBalancerTargets` is not supported for external service
     */
    registerLoadBalancerTargets(..._targets: EcsTarget[]): void;
    /**
     * Overriden method to throw error as `configureAwsVpcNetworkingWithSecurityGroups` is not supported for external service
     */
    protected configureAwsVpcNetworkingWithSecurityGroups(_vpc: ec2.IVpc, _assignPublicIp?: boolean, _vpcSubnets?: ec2.SubnetSelection, _securityGroups?: ec2.ISecurityGroup[]): void;
    /**
     * Overriden method to throw error as `autoScaleTaskCount` is not supported for external service
     */
    autoScaleTaskCount(_props: appscaling.EnableScalingProps): ScalableTaskCount;
    /**
     * Overriden method to throw error as `enableCloudMap` is not supported for external service
     */
    enableCloudMap(_options: CloudMapOptions): cloudmap.Service;
    /**
     * Overriden method to throw error as `associateCloudMapService` is not supported for external service
     */
    associateCloudMapService(_options: AssociateCloudMapServiceOptions): void;
}
