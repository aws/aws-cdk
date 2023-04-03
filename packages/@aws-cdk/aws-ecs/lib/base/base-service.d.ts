import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elb from '@aws-cdk/aws-elasticloadbalancing';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cloudmap from '@aws-cdk/aws-servicediscovery';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ScalableTaskCount } from './scalable-task-count';
import { LoadBalancerTargetOptions, TaskDefinition } from '../base/task-definition';
import { ICluster, CapacityProviderStrategy } from '../cluster';
import { ContainerDefinition, Protocol } from '../container-definition';
import { CfnService } from '../ecs.generated';
import { LogDriver } from '../log-drivers/log-driver';
/**
 * The interface for a service.
 */
export interface IService extends IResource {
    /**
     * The Amazon Resource Name (ARN) of the service.
     *
     * @attribute
     */
    readonly serviceArn: string;
    /**
     * The name of the service.
     *
     * @attribute
     */
    readonly serviceName: string;
}
/**
 * The deployment controller to use for the service.
 */
export interface DeploymentController {
    /**
     * The deployment controller type to use.
     *
     * @default DeploymentControllerType.ECS
     */
    readonly type?: DeploymentControllerType;
}
/**
 * The deployment circuit breaker to use for the service
 */
export interface DeploymentCircuitBreaker {
    /**
     * Whether to enable rollback on deployment failure
     * @default false
     */
    readonly rollback?: boolean;
}
export interface EcsTarget {
    /**
     * The name of the container.
     */
    readonly containerName: string;
    /**
     * The port number of the container. Only applicable when using application/network load balancers.
     *
     * @default - Container port of the first added port mapping.
     */
    readonly containerPort?: number;
    /**
     * The protocol used for the port mapping. Only applicable when using application load balancers.
     *
     * @default Protocol.TCP
     */
    readonly protocol?: Protocol;
    /**
     * ID for a target group to be created.
     */
    readonly newTargetGroupId: string;
    /**
     * Listener and properties for adding target group to the listener.
     */
    readonly listener: ListenerConfig;
}
/**
 * Interface for ECS load balancer target.
 */
export interface IEcsLoadBalancerTarget extends elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget, elb.ILoadBalancerTarget {
}
/**
 * Interface for Service Connect configuration.
 */
export interface ServiceConnectProps {
    /**
     * The cloudmap namespace to register this service into.
     *
     * @default the cloudmap namespace specified on the cluster.
     */
    readonly namespace?: string;
    /**
     * The list of Services, including a port mapping, terse client alias, and optional intermediate DNS name.
     *
     * This property may be left blank if the current ECS service does not need to advertise any ports via Service Connect.
     *
     * @default none
     */
    readonly services?: ServiceConnectService[];
    /**
     * The log driver configuration to use for the Service Connect agent logs.
     *
     * @default - none
     */
    readonly logDriver?: LogDriver;
}
/**
 * Interface for service connect Service props.
 */
export interface ServiceConnectService {
    /**
     * portMappingName specifies which port and protocol combination should be used for this
     * service connect service.
     */
    readonly portMappingName: string;
    /**
     * Optionally specifies an intermediate dns name to register in the CloudMap namespace.
     * This is required if you wish to use the same port mapping name in more than one service.
     *
     * @default - port mapping name
     */
    readonly discoveryName?: string;
    /**
     * The terse DNS alias to use for this port mapping in the service connect mesh.
     * Service Connect-enabled clients will be able to reach this service at
     * http://dnsName:port.
     *
     * @default - No alias is created. The service is reachable at `portMappingName.namespace:port`.
     */
    readonly dnsName?: string;
    /**
     The port for clients to use to communicate with this service via Service Connect.
     *
     * @default the container port specified by the port mapping in portMappingName.
     */
    readonly port?: number;
    /**
     * Optional. The port on the Service Connect agent container to use for traffic ingress to this service.
     *
     * @default - none
     */
    readonly ingressPortOverride?: number;
}
/**
 * The properties for the base Ec2Service or FargateService service.
 */
export interface BaseServiceOptions {
    /**
     * The name of the cluster that hosts the service.
     */
    readonly cluster: ICluster;
    /**
     * The desired number of instantiations of the task definition to keep running on the service.
     *
     * @default - When creating the service, default is 1; when updating the service, default uses
     * the current task number.
     */
    readonly desiredCount?: number;
    /**
     * The name of the service.
     *
     * @default - CloudFormation-generated name.
     */
    readonly serviceName?: string;
    /**
     * The maximum number of tasks, specified as a percentage of the Amazon ECS
     * service's DesiredCount value, that can run in a service during a
     * deployment.
     *
     * @default - 100 if daemon, otherwise 200
     */
    readonly maxHealthyPercent?: number;
    /**
     * The minimum number of tasks, specified as a percentage of
     * the Amazon ECS service's DesiredCount value, that must
     * continue to run and remain healthy during a deployment.
     *
     * @default - 0 if daemon, otherwise 50
     */
    readonly minHealthyPercent?: number;
    /**
     * The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy
     * Elastic Load Balancing target health checks after a task has first started.
     *
     * @default - defaults to 60 seconds if at least one load balancer is in-use and it is not already set
     */
    readonly healthCheckGracePeriod?: Duration;
    /**
     * The options for configuring an Amazon ECS service to use service discovery.
     *
     * @default - AWS Cloud Map service discovery is not enabled.
     */
    readonly cloudMapOptions?: CloudMapOptions;
    /**
     * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service
     *
     * Valid values are: PropagatedTagSource.SERVICE, PropagatedTagSource.TASK_DEFINITION or PropagatedTagSource.NONE
     *
     * @default PropagatedTagSource.NONE
     */
    readonly propagateTags?: PropagatedTagSource;
    /**
     * Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.
     * Tags can only be propagated to the tasks within the service during service creation.
     *
     * @deprecated Use `propagateTags` instead.
     * @default PropagatedTagSource.NONE
     */
    readonly propagateTaskTagsFrom?: PropagatedTagSource;
    /**
     * Specifies whether to enable Amazon ECS managed tags for the tasks within the service. For more information, see
     * [Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)
     *
     * @default false
     */
    readonly enableECSManagedTags?: boolean;
    /**
     * Specifies which deployment controller to use for the service. For more information, see
     * [Amazon ECS Deployment Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
     *
     * @default - Rolling update (ECS)
     */
    readonly deploymentController?: DeploymentController;
    /**
     * Whether to enable the deployment circuit breaker. If this property is defined, circuit breaker will be implicitly
     * enabled.
     * @default - disabled
     */
    readonly circuitBreaker?: DeploymentCircuitBreaker;
    /**
     * A list of Capacity Provider strategies used to place a service.
     *
     * @default - undefined
     *
     */
    readonly capacityProviderStrategies?: CapacityProviderStrategy[];
    /**
     * Whether to enable the ability to execute into a container
     *
     *  @default - undefined
     */
    readonly enableExecuteCommand?: boolean;
    /**
     * Configuration for Service Connect.
     *
     * @default No ports are advertised via Service Connect on this service, and the service
     * cannot make requests to other services via Service Connect.
     */
    readonly serviceConnectConfiguration?: ServiceConnectProps;
}
/**
 * Complete base service properties that are required to be supplied by the implementation
 * of the BaseService class.
 */
export interface BaseServiceProps extends BaseServiceOptions {
    /**
     * The launch type on which to run your service.
     *
     * LaunchType will be omitted if capacity provider strategies are specified on the service.
     *
     * @see - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html#cfn-ecs-service-capacityproviderstrategy
     *
     * Valid values are: LaunchType.ECS or LaunchType.FARGATE or LaunchType.EXTERNAL
     */
    readonly launchType: LaunchType;
}
/**
 * Base class for configuring listener when registering targets.
 */
export declare abstract class ListenerConfig {
    /**
     * Create a config for adding target group to ALB listener.
     */
    static applicationListener(listener: elbv2.ApplicationListener, props?: elbv2.AddApplicationTargetsProps): ListenerConfig;
    /**
     * Create a config for adding target group to NLB listener.
     */
    static networkListener(listener: elbv2.NetworkListener, props?: elbv2.AddNetworkTargetsProps): ListenerConfig;
    /**
     * Create and attach a target group to listener.
     */
    abstract addTargets(id: string, target: LoadBalancerTargetOptions, service: BaseService): void;
}
/**
 * The interface for BaseService.
 */
export interface IBaseService extends IService {
    /**
     * The cluster that hosts the service.
     */
    readonly cluster: ICluster;
}
/**
 * The base class for Ec2Service and FargateService services.
 */
export declare abstract class BaseService extends Resource implements IBaseService, elbv2.IApplicationLoadBalancerTarget, elbv2.INetworkLoadBalancerTarget, elb.ILoadBalancerTarget {
    /**
     * Import an existing ECS/Fargate Service using the service cluster format.
     * The format is the "new" format "arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name".
     * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids
     */
    static fromServiceArnWithCluster(scope: Construct, id: string, serviceArn: string): IBaseService;
    private static MIN_PORT;
    private static MAX_PORT;
    /**
     * The security groups which manage the allowed network traffic for the service.
     */
    readonly connections: ec2.Connections;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    readonly serviceArn: string;
    /**
     * The name of the service.
     *
     * @attribute
     */
    readonly serviceName: string;
    /**
     * The task definition to use for tasks in the service.
     */
    readonly taskDefinition: TaskDefinition;
    /**
     * The cluster that hosts the service.
     */
    readonly cluster: ICluster;
    /**
     * The details of the AWS Cloud Map service.
     */
    protected cloudmapService?: cloudmap.Service;
    /**
     * A list of Elastic Load Balancing load balancer objects, containing the load balancer name, the container
     * name (as it appears in a container definition), and the container port to access from the load balancer.
     */
    protected loadBalancers: CfnService.LoadBalancerProperty[];
    /**
     * A list of Elastic Load Balancing load balancer objects, containing the load balancer name, the container
     * name (as it appears in a container definition), and the container port to access from the load balancer.
     */
    protected networkConfiguration?: CfnService.NetworkConfigurationProperty;
    /**
     * The details of the service discovery registries to assign to this service.
     * For more information, see Service Discovery.
     */
    protected serviceRegistries: CfnService.ServiceRegistryProperty[];
    /**
     * The service connect configuration for this service.
     * @internal
     */
    protected _serviceConnectConfig?: CfnService.ServiceConnectConfigurationProperty;
    private readonly resource;
    private scalableTaskCount?;
    /**
     * Constructs a new instance of the BaseService class.
     */
    constructor(scope: Construct, id: string, props: BaseServiceProps, additionalProps: any, taskDefinition: TaskDefinition);
    /**   * Enable Service Connect
     */
    enableServiceConnect(config?: ServiceConnectProps): void;
    /**
     * Validate Service Connect Configuration
     */
    private validateServiceConnectConfiguration;
    /**
     * Determines if a port is valid
     *
     * @param port: The port number
     * @returns boolean whether the port is valid
     */
    private isValidPort;
    /**
     * The CloudMap service created for this service, if any.
     */
    get cloudMapService(): cloudmap.IService | undefined;
    private getDeploymentController;
    private executeCommandLogConfiguration;
    private enableExecuteCommandEncryption;
    /**
     * This method is called to attach this service to an Application Load Balancer.
     *
     * Don't call this function directly. Instead, call `listener.addTargets()`
     * to add this service to a load balancer.
     */
    attachToApplicationTargetGroup(targetGroup: elbv2.IApplicationTargetGroup): elbv2.LoadBalancerTargetProps;
    /**
     * Registers the service as a target of a Classic Load Balancer (CLB).
     *
     * Don't call this. Call `loadBalancer.addTarget()` instead.
     */
    attachToClassicLB(loadBalancer: elb.LoadBalancer): void;
    /**
     * Return a load balancing target for a specific container and port.
     *
     * Use this function to create a load balancer target if you want to load balance to
     * another container than the first essential container or the first mapped port on
     * the container.
     *
     * Use the return value of this function where you would normally use a load balancer
     * target, instead of the `Service` object itself.
     *
     * @example
     *
     * declare const listener: elbv2.ApplicationListener;
     * declare const service: ecs.BaseService;
     * listener.addTargets('ECS', {
     *   port: 80,
     *   targets: [service.loadBalancerTarget({
     *     containerName: 'MyContainer',
     *     containerPort: 1234,
     *   })],
     * });
     */
    loadBalancerTarget(options: LoadBalancerTargetOptions): IEcsLoadBalancerTarget;
    /**
     * Use this function to create all load balancer targets to be registered in this service, add them to
     * target groups, and attach target groups to listeners accordingly.
     *
     * Alternatively, you can use `listener.addTargets()` to create targets and add them to target groups.
     *
     * @example
     *
     * declare const listener: elbv2.ApplicationListener;
     * declare const service: ecs.BaseService;
     * service.registerLoadBalancerTargets(
     *   {
     *     containerName: 'web',
     *     containerPort: 80,
     *     newTargetGroupId: 'ECS',
     *     listener: ecs.ListenerConfig.applicationListener(listener, {
     *       protocol: elbv2.ApplicationProtocol.HTTPS
     *     }),
     *   },
     * )
     */
    registerLoadBalancerTargets(...targets: EcsTarget[]): void;
    /**
     * This method is called to attach this service to a Network Load Balancer.
     *
     * Don't call this function directly. Instead, call `listener.addTargets()`
     * to add this service to a load balancer.
     */
    attachToNetworkTargetGroup(targetGroup: elbv2.INetworkTargetGroup): elbv2.LoadBalancerTargetProps;
    /**
     * An attribute representing the minimum and maximum task count for an AutoScalingGroup.
     */
    autoScaleTaskCount(props: appscaling.EnableScalingProps): ScalableTaskCount;
    /**
     * Enable CloudMap service discovery for the service
     *
     * @returns The created CloudMap service
     */
    enableCloudMap(options: CloudMapOptions): cloudmap.Service;
    /**
     * Associates this service with a CloudMap service
     */
    associateCloudMapService(options: AssociateCloudMapServiceOptions): void;
    /**
     * This method returns the specified CloudWatch metric name for this service.
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method returns the CloudWatch metric for this service's memory utilization.
     *
     * @default average over 5 minutes
     */
    metricMemoryUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method returns the CloudWatch metric for this service's CPU utilization.
     *
     * @default average over 5 minutes
     */
    metricCpuUtilization(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * This method is called to create a networkConfiguration.
     * @deprecated use configureAwsVpcNetworkingWithSecurityGroups instead.
     */
    protected configureAwsVpcNetworking(vpc: ec2.IVpc, assignPublicIp?: boolean, vpcSubnets?: ec2.SubnetSelection, securityGroup?: ec2.ISecurityGroup): void;
    /**
     * This method is called to create a networkConfiguration.
     */
    protected configureAwsVpcNetworkingWithSecurityGroups(vpc: ec2.IVpc, assignPublicIp?: boolean, vpcSubnets?: ec2.SubnetSelection, securityGroups?: ec2.ISecurityGroup[]): void;
    private renderServiceRegistry;
    /**
     * Shared logic for attaching to an ELB
     */
    private attachToELB;
    /**
     * Shared logic for attaching to an ELBv2
     */
    private attachToELBv2;
    private get defaultLoadBalancerTarget();
    /**
     * Generate the role that will be used for autoscaling this service
     */
    private makeAutoScalingRole;
    /**
     * Associate Service Discovery (Cloud Map) service
     */
    private addServiceRegistry;
    /**
     *  Return the default grace period when load balancers are configured and
     *  healthCheckGracePeriod is not already set
     */
    private evaluateHealthGracePeriod;
    private enableExecuteCommand;
}
/**
 * The options to enabling AWS Cloud Map for an Amazon ECS service.
 */
export interface CloudMapOptions {
    /**
     * The name of the Cloud Map service to attach to the ECS service.
     *
     * @default CloudFormation-generated name
     */
    readonly name?: string;
    /**
     * The service discovery namespace for the Cloud Map service to attach to the ECS service.
     *
     * @default - the defaultCloudMapNamespace associated to the cluster
     */
    readonly cloudMapNamespace?: cloudmap.INamespace;
    /**
     * The DNS record type that you want AWS Cloud Map to create. The supported record types are A or SRV.
     *
     * @default - DnsRecordType.A if TaskDefinition.networkMode = AWS_VPC, otherwise DnsRecordType.SRV
     */
    readonly dnsRecordType?: cloudmap.DnsRecordType.A | cloudmap.DnsRecordType.SRV;
    /**
     * The amount of time that you want DNS resolvers to cache the settings for this record.
     *
     * @default Duration.minutes(1)
     */
    readonly dnsTtl?: Duration;
    /**
     * The number of 30-second intervals that you want Cloud Map to wait after receiving an UpdateInstanceCustomHealthStatus
     * request before it changes the health status of a service instance.
     *
     * NOTE: This is used for HealthCheckCustomConfig
     */
    readonly failureThreshold?: number;
    /**
     * The container to point to for a SRV record.
     * @default - the task definition's default container
     */
    readonly container?: ContainerDefinition;
    /**
     * The port to point to for a SRV record.
     * @default - the default port of the task definition's default container
     */
    readonly containerPort?: number;
}
/**
 * The options for using a cloudmap service.
 */
export interface AssociateCloudMapServiceOptions {
    /**
     * The cloudmap service to register with.
     */
    readonly service: cloudmap.IService;
    /**
     * The container to point to for a SRV record.
     * @default - the task definition's default container
     */
    readonly container?: ContainerDefinition;
    /**
     * The port to point to for a SRV record.
     * @default - the default port of the task definition's default container
     */
    readonly containerPort?: number;
}
/**
 * The launch type of an ECS service
 */
export declare enum LaunchType {
    /**
     * The service will be launched using the EC2 launch type
     */
    EC2 = "EC2",
    /**
     * The service will be launched using the FARGATE launch type
     */
    FARGATE = "FARGATE",
    /**
     * The service will be launched using the EXTERNAL launch type
     */
    EXTERNAL = "EXTERNAL"
}
/**
 * The deployment controller type to use for the service.
 */
export declare enum DeploymentControllerType {
    /**
     * The rolling update (ECS) deployment type involves replacing the current
     * running version of the container with the latest version.
     */
    ECS = "ECS",
    /**
     * The blue/green (CODE_DEPLOY) deployment type uses the blue/green deployment model powered by AWS CodeDeploy
     */
    CODE_DEPLOY = "CODE_DEPLOY",
    /**
     * The external (EXTERNAL) deployment type enables you to use any third-party deployment controller
     */
    EXTERNAL = "EXTERNAL"
}
/**
 * Propagate tags from either service or task definition
 */
export declare enum PropagatedTagSource {
    /**
     * Propagate tags from service
     */
    SERVICE = "SERVICE",
    /**
     * Propagate tags from task definition
     */
    TASK_DEFINITION = "TASK_DEFINITION",
    /**
     * Do not propagate
     */
    NONE = "NONE"
}
