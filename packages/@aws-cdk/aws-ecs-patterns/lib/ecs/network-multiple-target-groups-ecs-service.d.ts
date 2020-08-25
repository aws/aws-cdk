import { Ec2Service, Ec2TaskDefinition } from '@aws-cdk/aws-ecs';
import { NetworkTargetGroup } from '@aws-cdk/aws-elasticloadbalancingv2';
import { Construct } from '@aws-cdk/core';
import { NetworkMultipleTargetGroupsServiceBase, NetworkMultipleTargetGroupsServiceBaseProps } from '../base/network-multiple-target-groups-service-base';
/**
 * The properties for the NetworkMultipleTargetGroupsEc2Service service.
 */
export interface NetworkMultipleTargetGroupsEc2ServiceProps extends NetworkMultipleTargetGroupsServiceBaseProps {
    /**
     * The task definition to use for tasks in the service. Only one of TaskDefinition or TaskImageOptions must be specified.
     *
     * [disable-awslint:ref-via-interface]
     *
     * @default - none
     */
    readonly taskDefinition?: Ec2TaskDefinition;
    /**
     * The minimum number of CPU units to reserve for the container.
     *
     * Valid values, which determines your range of valid values for the memory parameter:
     *
     * @default - No minimum CPU units reserved.
     */
    readonly cpu?: number;
    /**
     * The amount (in MiB) of memory to present to the container.
     *
     * If your container attempts to exceed the allocated memory, the container
     * is terminated.
     *
     * At least one of memoryLimitMiB and memoryReservationMiB is required.
     *
     * @default - No memory limit.
     */
    readonly memoryLimitMiB?: number;
    /**
     * The soft limit (in MiB) of memory to reserve for the container.
     *
     * When system memory is under heavy contention, Docker attempts to keep the
     * container memory to this soft limit. However, your container can consume more
     * memory when it needs to, up to either the hard limit specified with the memory
     * parameter (if applicable), or all of the available memory on the container
     * instance, whichever comes first.
     *
     * At least one of memoryLimitMiB and memoryReservationMiB is required.
     *
     * Note that this setting will be ignored if TaskImagesOptions is specified.
     *
     * @default - No memory reserved.
     */
    readonly memoryReservationMiB?: number;
}
/**
 * An EC2 service running on an ECS cluster fronted by a network load balancer.
 */
export declare class NetworkMultipleTargetGroupsEc2Service extends NetworkMultipleTargetGroupsServiceBase {
    /**
     * The EC2 service in this construct.
     */
    readonly service: Ec2Service;
    /**
     * The EC2 Task Definition in this construct.
     */
    readonly taskDefinition: Ec2TaskDefinition;
    /**
     * The default target group for the service.
     */
    readonly targetGroup: NetworkTargetGroup;
    /**
     * Constructs a new instance of the NetworkMultipleTargetGroupsEc2Service class.
     */
    constructor(scope: Construct, id: string, props?: NetworkMultipleTargetGroupsEc2ServiceProps);
    private createEc2Service;
}
