import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as eks from 'aws-cdk-lib/aws-eks';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration, ITaggable, TagManager } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { IComputeEnvironment, ComputeEnvironmentBase, ComputeEnvironmentProps } from './compute-environment-base';
/**
 * Represents a Managed ComputeEnvironment. Batch will provision EC2 Instances to
 * meet the requirements of the jobs executing in this ComputeEnvironment.
 */
export interface IManagedComputeEnvironment extends IComputeEnvironment, ec2.IConnectable, ITaggable {
    /**
     * The maximum vCpus this `ManagedComputeEnvironment` can scale up to.
     *
     * *Note*: if this Compute Environment uses EC2 resources (not Fargate) with either `AllocationStrategy.BEST_FIT_PROGRESSIVE` or
     * `AllocationStrategy.SPOT_CAPACITY_OPTIMIZED`, or `AllocationStrategy.BEST_FIT` with Spot instances,
     * The scheduler may exceed this number by at most one of the instances specified in `instanceTypes`
     * or `instanceClasses`.
     */
    readonly maxvCpus: number;
    /**
     * Specifies whether this Compute Environment is replaced if an update is made that requires
     * replacing its instances. To enable more properties to be updated,
     * set this property to `false`. When changing the value of this property to false,
     * do not change any other properties at the same time.
     * If other properties are changed at the same time,
     * and the change needs to be rolled back but it can't,
     * it's possible for the stack to go into the UPDATE_ROLLBACK_FAILED state.
     * You can't update a stack that is in the UPDATE_ROLLBACK_FAILED state.
     * However, if you can continue to roll it back,
     * you can return the stack to its original settings and then try to update it again.
     *
     * The properties which require a replacement of the Compute Environment are:
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html
     */
    readonly replaceComputeEnvironment?: boolean;
    /**
     * Whether or not to use spot instances.
     * Spot instances are less expensive EC2 instances that can be
     * reclaimed by EC2 at any time; your job will be given two minutes
     * of notice before reclamation.
     *
     * @default false
     */
    readonly spot?: boolean;
    /**
     * Only meaningful if `terminateOnUpdate` is `false`. If so,
     * when an infrastructure update is triggered, any running jobs
     * will be allowed to run until `updateTimeout` has expired.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
     * @default 30 minutes
     */
    readonly updateTimeout?: Duration;
    /**
     * Whether or not any running jobs will be immediately terminated when an infrastructure update
     * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
     * retry policy.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
     *
     * @default false
     */
    readonly terminateOnUpdate?: boolean;
    /**
     * The security groups this Compute Environment will launch instances in.
     */
    readonly securityGroups: ec2.ISecurityGroup[];
    /**
     * The VPC Subnets this Compute Environment will launch instances in.
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
     * Whether or not the AMI is updated to the latest one supported by Batch
     * when an infrastructure update occurs.
     *
     * If you specify a specific AMI, this property will be ignored.
     *
     * @default true
     */
    readonly updateToLatestImageVersion?: boolean;
}
/**
 * Props for a ManagedComputeEnvironment
 */
export interface ManagedComputeEnvironmentProps extends ComputeEnvironmentProps {
    /**
    * The maximum vCpus this `ManagedComputeEnvironment` can scale up to.
    * Each vCPU is equivalent to 1024 CPU shares.
    *
    * *Note*: if this Compute Environment uses EC2 resources (not Fargate) with either `AllocationStrategy.BEST_FIT_PROGRESSIVE` or
    * `AllocationStrategy.SPOT_CAPACITY_OPTIMIZED`, or `AllocationStrategy.BEST_FIT` with Spot instances,
    * The scheduler may exceed this number by at most one of the instances specified in `instanceTypes`
    * or `instanceClasses`.
    *
    * @default 256
    */
    readonly maxvCpus?: number;
    /**
    * Specifies whether this Compute Environment is replaced if an update is made that requires
    * replacing its instances. To enable more properties to be updated,
    * set this property to `false`. When changing the value of this property to false,
    * do not change any other properties at the same time.
    * If other properties are changed at the same time,
    * and the change needs to be rolled back but it can't,
    * it's possible for the stack to go into the UPDATE_ROLLBACK_FAILED state.
    * You can't update a stack that is in the UPDATE_ROLLBACK_FAILED state.
    * However, if you can continue to roll it back,
    * you can return the stack to its original settings and then try to update it again.
    *
    * The properties which require a replacement of the Compute Environment are:
    *
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html
    *
    * @default false
    */
    readonly replaceComputeEnvironment?: boolean;
    /**
     * Whether or not to use spot instances.
     * Spot instances are less expensive EC2 instances that can be
     * reclaimed by EC2 at any time; your job will be given two minutes
     * of notice before reclamation.
     *
     * @default false
     */
    readonly spot?: boolean;
    /**
     * Only meaningful if `terminateOnUpdate` is `false`. If so,
     * when an infrastructure update is triggered, any running jobs
     * will be allowed to run until `updateTimeout` has expired.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
     *
     * @default 30 minutes
     */
    readonly updateTimeout?: Duration;
    /**
     * Whether or not any running jobs will be immediately terminated when an infrastructure update
     * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
     * retry policy.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
     *
     * @default false
     */
    readonly terminateOnUpdate?: boolean;
    /**
     * VPC in which this Compute Environment will launch Instances
     */
    readonly vpc: ec2.IVpc;
    /**
    * The security groups this Compute Environment will launch instances in.
    *
    * @default new security groups will be created
    */
    readonly securityGroups?: ec2.ISecurityGroup[];
    /**
    * The VPC Subnets this Compute Environment will launch instances in.
    *
    * @default new subnets will be created
    */
    readonly vpcSubnets?: ec2.SubnetSelection;
    /**
    * Whether or not the AMI is updated to the latest one supported by Batch
    * when an infrastructure update occurs.
    *
    * If you specify a specific AMI, this property will be ignored.
    *
    * @default true
    */
    readonly updateToLatestImageVersion?: boolean;
}
/**
 * Abstract base class for ManagedComputeEnvironments
 * @internal
 */
export declare abstract class ManagedComputeEnvironmentBase extends ComputeEnvironmentBase implements IManagedComputeEnvironment {
    readonly maxvCpus: number;
    readonly replaceComputeEnvironment?: boolean;
    readonly spot?: boolean;
    readonly updateTimeout?: Duration;
    readonly terminateOnUpdate?: boolean;
    readonly securityGroups: ec2.ISecurityGroup[];
    readonly updateToLatestImageVersion?: boolean;
    readonly tags: TagManager;
    readonly connections: ec2.Connections;
    constructor(scope: Construct, id: string, props: ManagedComputeEnvironmentProps);
}
/**
 * A ManagedComputeEnvironment that uses ECS orchestration on EC2 instances.
 */
export interface IManagedEc2EcsComputeEnvironment extends IManagedComputeEnvironment {
    /**
     * Configure which AMIs this Compute Environment can launch.
     *
     * Leave this `undefined` to allow Batch to choose the latest AMIs it supports for each instance that it launches.
     *
     * @default
     * - ECS_AL2 compatible AMI ids for non-GPU instances, ECS_AL2_NVIDIA compatible AMI ids for GPU instances
     */
    readonly images?: EcsMachineImage[];
    /**
     * The allocation strategy to use if not enough instances of
     * the best fitting instance type can be allocated.
     *
     * @default - `BEST_FIT_PROGRESSIVE` if not using Spot instances,
     * `SPOT_CAPACITY_OPTIMIZED` if using Spot instances.
     */
    readonly allocationStrategy?: AllocationStrategy;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the
     * On-Demand price for that instance type before instances are launched.
     * For example, if your maximum percentage is 20%, the Spot price must be
     * less than 20% of the current On-Demand price for that Instance.
     * You always pay the lowest market price and never more than your maximum percentage.
     * For most use cases, Batch recommends leaving this field empty.
     *
     * @default - 100%
     */
    readonly spotBidPercentage?: number;
    /**
     * The service-linked role that Spot Fleet needs to launch instances on your behalf.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/spot_fleet_IAM_role.html
     *
     * @default - a new Role will be created
     */
    readonly spotFleetRole?: iam.IRole;
    /**
     * The instance types that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     */
    readonly instanceTypes: ec2.InstanceType[];
    /**
     * The instance classes that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     * Batch will automatically choose the size.
     */
    readonly instanceClasses: ec2.InstanceClass[];
    /**
     * Whether or not to use batch's optimal instance type.
     * The optimal instance type is equivalent to adding the
     * C4, M4, and R4 instance classes. You can specify other instance classes
     * (of the same architecture) in addition to the optimal instance classes.
     *
     * @default true
     */
    readonly useOptimalInstanceClasses?: boolean;
    /**
     * The execution Role that instances launched by this Compute Environment will use.
     *
     * @default - a role will be created
     */
    readonly instanceRole?: iam.IRole;
    /**
     * The Launch Template that this Compute Environment
     * will use to provision EC2 Instances.
     *
     * *Note*: if `securityGroups` is specified on both your
     * launch template and this Compute Environment, **the
     * `securityGroup`s on the Compute Environment override the
     * ones on the launch template.
     *
     * @default no launch template
     */
    readonly launchTemplate?: ec2.ILaunchTemplate;
    /**
     * The minimum vCPUs that an environment should maintain,
     * even if the compute environment is DISABLED.
     *
     * @default 0
     */
    readonly minvCpus?: number;
    /**
     * The EC2 placement group to associate with your compute resources.
     * If you intend to submit multi-node parallel jobs to this Compute Environment,
     * you should consider creating a cluster placement group and associate it with your compute resources.
     * This keeps your multi-node parallel job on a logical grouping of instances
     * within a single Availability Zone with high network flow potential.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
     *
     * @default - no placement group
     */
    readonly placementGroup?: ec2.IPlacementGroup;
    /**
     * Add an instance type to this compute environment
     */
    addInstanceType(instanceType: ec2.InstanceType): void;
    /**
     * Add an instance class to this compute environment
     */
    addInstanceClass(instanceClass: ec2.InstanceClass): void;
}
/**
 * Base interface for containing all information needed to
 * configure a MachineImage in Batch
 */
interface MachineImage {
    /**
     * The machine image to use
     *
     * @default - chosen by batch
     */
    readonly image?: ec2.IMachineImage;
}
/**
 * A Batch MachineImage that is compatible with ECS
 */
export interface EcsMachineImage extends MachineImage {
    /**
     * Tells Batch which instance type to launch this image on
     *
     * @default - 'ECS_AL2' for non-gpu instances, 'ECS_AL2_NVIDIA' for gpu instances
     */
    readonly imageType?: EcsMachineImageType;
}
/**
 * A Batch MachineImage that is compatible with EKS
 */
export interface EksMachineImage extends MachineImage {
    /**
     * Tells Batch which instance type to launch this image on
     *
     * @default - 'EKS_AL2' for non-gpu instances, 'EKS_AL2_NVIDIA' for gpu instances
     */
    readonly imageType?: EksMachineImageType;
}
/**
 * Maps the image to instance types
 */
export declare enum EcsMachineImageType {
    /**
     * Tells Batch that this machine image runs on non-GPU instances
     */
    ECS_AL2 = "ECS_AL2",
    /**
     * Tells Batch that this machine image runs on GPU instances
     */
    ECS_AL2_NVIDIA = "ECS_AL2_NVIDIA"
}
/**
 * Maps the image to instance types
 */
export declare enum EksMachineImageType {
    /**
     * Tells Batch that this machine image runs on non-GPU instances
     */
    EKS_AL2 = "EKS_AL2",
    /**
     * Tells Batch that this machine image runs on GPU instances
     */
    EKS_AL2_NVIDIA = "EKS_AL2_NVIDIA"
}
/**
 * Determines how this compute environment chooses instances to spawn
 *
 * @see https://aws.amazon.com/blogs/compute/optimizing-for-cost-availability-and-throughput-by-selecting-your-aws-batch-allocation-strategy/
 */
export declare enum AllocationStrategy {
    /**
     * Batch chooses the lowest-cost instance type that fits all the jobs in the queue.
     * If instances of that type are not available, the queue will not choose a new type;
     * instead, it will wait for the instance to become available.
     * This can stall your `Queue`, with your compute environment only using part of its max capacity
     * (or none at all) until the `BEST_FIT` instance becomes available.
     * This allocation strategy keeps costs lower but can limit scaling.
     * `BEST_FIT` isn't supported when updating compute environments
     */
    BEST_FIT = "BEST_FIT",
    /**
     * This is the default Allocation Strategy if `spot` is `false` or unspecified.
     * This strategy will examine the Jobs in the queue and choose whichever instance type meets the requirements
     * of the jobs in the queue and with the lowest cost per vCPU, just as `BEST_FIT`.
     * However, if not all of the capacity can be filled with this instance type,
     * it will choose a new next-best instance type to run any jobs that couldn’t fit into the `BEST_FIT` capacity.
     * To make the most use of this allocation strategy,
     * it is recommended to use as many instance classes as is feasible for your workload.
     */
    BEST_FIT_PROGRESSIVE = "BEST_FIT_PROGRESSIVE",
    /**
     * If your workflow tolerates interruptions, you should enable `spot` on your `ComputeEnvironment`
     * and use `SPOT_CAPACITY_OPTIMIZED` (this is the default if `spot` is enabled).
     * This will tell Batch to choose the instance types from the ones you’ve specified that have
     * the most spot capacity available to minimize the chance of interruption.
     * To get the most benefit from your spot instances,
     * you should allow Batch to choose from as many different instance types as possible.
     */
    SPOT_CAPACITY_OPTIMIZED = "SPOT_CAPACITY_OPTIMIZED",
    /**
     * The price and capacity optimized allocation strategy looks at both price and capacity
     * to select the Spot Instance pools that are the least likely to be interrupted
     * and have the lowest possible price.
     *
     * The Batch team recommends this over `SPOT_CAPACITY_OPTIMIZED` in most instances.
     */
    SPOT_PRICE_CAPACITY_OPTIMIZED = "SPOT_PRICE_CAPACITY_OPTIMIZED"
}
/**
 * Props for a ManagedEc2EcsComputeEnvironment
 */
export interface ManagedEc2EcsComputeEnvironmentProps extends ManagedComputeEnvironmentProps {
    /**
     * Whether or not to use batch's optimal instance type.
     * The optimal instance type is equivalent to adding the
     * C4, M4, and R4 instance classes. You can specify other instance classes
     * (of the same architecture) in addition to the optimal instance classes.
     *
     * @default true
     */
    readonly useOptimalInstanceClasses?: boolean;
    /**
     * Configure which AMIs this Compute Environment can launch.
     * If you specify this property with only `image` specified, then the
     * `imageType` will default to `ECS_AL2`. *If your image needs GPU resources,
     * specify `ECS_AL2_NVIDIA`; otherwise, the instances will not be able to properly
     * join the ComputeEnvironment*.
     *
     * @default
     * - ECS_AL2 for non-GPU instances, ECS_AL2_NVIDIA for GPU instances
     */
    readonly images?: EcsMachineImage[];
    /**
     * The allocation strategy to use if not enough instances of
     * the best fitting instance type can be allocated.
     *
     * @default - `BEST_FIT_PROGRESSIVE` if not using Spot instances,
     * `SPOT_CAPACITY_OPTIMIZED` if using Spot instances.
     */
    readonly allocationStrategy?: AllocationStrategy;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the
     * On-Demand price for that instance type before instances are launched.
     * For example, if your maximum percentage is 20%, the Spot price must be
     * less than 20% of the current On-Demand price for that Instance.
     * You always pay the lowest market price and never more than your maximum percentage.
     * For most use cases, Batch recommends leaving this field empty.
     *
     * Implies `spot == true` if set
     *
     * @default 100%
     */
    readonly spotBidPercentage?: number;
    /**
     * The service-linked role that Spot Fleet needs to launch instances on your behalf.
     *
     * @see https://docs.aws.amazon.com/batch/latest/userguide/spot_fleet_IAM_role.html
     *
     * @default - a new role will be created
     */
    readonly spotFleetRole?: iam.IRole;
    /**
     * The instance types that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     *
     * @default - the instances Batch considers will be used (currently C4, M4, and R4)
     */
    readonly instanceTypes?: ec2.InstanceType[];
    /**
     * The instance classes that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     * Batch will automatically choose the instance size.
     *
     * @default - the instances Batch considers will be used (currently C4, M4, and R4)
     */
    readonly instanceClasses?: ec2.InstanceClass[];
    /**
     * The execution Role that instances launched by this Compute Environment will use.
     *
     * @default - a role will be created
     */
    readonly instanceRole?: iam.IRole;
    /**
     * The Launch Template that this Compute Environment
     * will use to provision EC2 Instances.
     *
     * *Note*: if `securityGroups` is specified on both your
     * launch template and this Compute Environment, **the
     * `securityGroup`s on the Compute Environment override the
     * ones on the launch template.
     *
     * @default no launch template
     */
    readonly launchTemplate?: ec2.ILaunchTemplate;
    /**
     * The minimum vCPUs that an environment should maintain,
     * even if the compute environment is DISABLED.
     *
     * @default 0
     */
    readonly minvCpus?: number;
    /**
     * The EC2 placement group to associate with your compute resources.
     * If you intend to submit multi-node parallel jobs to this Compute Environment,
     * you should consider creating a cluster placement group and associate it with your compute resources.
     * This keeps your multi-node parallel job on a logical grouping of instances
     * within a single Availability Zone with high network flow potential.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
     *
     * @default - no placement group
     */
    readonly placementGroup?: ec2.IPlacementGroup;
}
/**
 * A ManagedComputeEnvironment that uses ECS orchestration on EC2 instances.
 *
 * @resource AWS::Batch::ComputeEnvironment
 */
export declare class ManagedEc2EcsComputeEnvironment extends ManagedComputeEnvironmentBase implements IManagedEc2EcsComputeEnvironment {
    /**
     * refer to an existing ComputeEnvironment by its arn.
     */
    static fromManagedEc2EcsComputeEnvironmentArn(scope: Construct, id: string, managedEc2EcsComputeEnvironmentArn: string): IManagedEc2EcsComputeEnvironment;
    readonly computeEnvironmentArn: string;
    readonly computeEnvironmentName: string;
    readonly images?: EcsMachineImage[];
    readonly allocationStrategy?: AllocationStrategy;
    readonly spotBidPercentage?: number;
    readonly spotFleetRole?: iam.IRole;
    readonly instanceTypes: ec2.InstanceType[];
    readonly instanceClasses: ec2.InstanceClass[];
    readonly instanceRole?: iam.IRole;
    readonly launchTemplate?: ec2.ILaunchTemplate;
    readonly minvCpus?: number;
    readonly placementGroup?: ec2.IPlacementGroup;
    private readonly instanceProfile;
    constructor(scope: Construct, id: string, props: ManagedEc2EcsComputeEnvironmentProps);
    addInstanceType(instanceType: ec2.InstanceType): void;
    addInstanceClass(instanceClass: ec2.InstanceClass): void;
}
/**
 * A ManagedComputeEnvironment that uses EKS orchestration on EC2 instances.
 */
interface IManagedEc2EksComputeEnvironment extends IManagedComputeEnvironment {
    /**
     * The namespace of the Cluster
     *
     * Cannot be 'default', start with 'kube-', or be longer than 64 characters.
     *
     * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/
     */
    readonly kubernetesNamespace?: string;
    /**
     * The cluster that backs this Compute Environment. Required
     * for Compute Environments running Kubernetes jobs.
     *
     * Please ensure that you have followed the steps at
     *
     * https://docs.aws.amazon.com/batch/latest/userguide/getting-started-eks.html
     *
     * before attempting to deploy a `ManagedEc2EksComputeEnvironment` that uses this cluster.
     * If you do not follow the steps in the link, the deployment fail with a message that the
     * compute environment did not stabilize.
     */
    readonly eksCluster: eks.ICluster;
    /**
     * Configure which AMIs this Compute Environment can launch.
     *
     * @default
     * EKS_AL2 for non-GPU instances, EKS_AL2_NVIDIA for GPU instances,
     */
    readonly images?: EksMachineImage[];
    /**
     * The allocation strategy to use if not enough instances of
     * the best fitting instance type can be allocated.
     *
     * @default - `BEST_FIT_PROGRESSIVE` if not using Spot instances,
     * `SPOT_CAPACITY_OPTIMIZED` if using Spot instances.
     */
    readonly allocationStrategy?: AllocationStrategy;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the
     * On-Demand price for that instance type before instances are launched.
     * For example, if your maximum percentage is 20%, the Spot price must be
     * less than 20% of the current On-Demand price for that Instance.
     * You always pay the lowest market price and never more than your maximum percentage.
     * For most use cases, Batch recommends leaving this field empty.
     *
     * Implies `spot == true` if set
     *
     * @default - 100%
     */
    readonly spotBidPercentage?: number;
    /**
     * The instance types that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     */
    readonly instanceTypes: ec2.InstanceType[];
    /**
     * The instance types that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     */
    readonly instanceClasses: ec2.InstanceClass[];
    /**
     * The execution Role that instances launched by this Compute Environment will use.
     *
     * @default - a role will be created
     */
    readonly instanceRole?: iam.IRole;
    /**
     * The Launch Template that this Compute Environment
     * will use to provision EC2 Instances.
     *
     * *Note*: if `securityGroups` is specified on both your
     * launch template and this Compute Environment, **the
     * `securityGroup`s on the Compute Environment override the
     * ones on the launch template.
     *
     * @default - no launch template
     */
    readonly launchTemplate?: ec2.ILaunchTemplate;
    /**
     * The minimum vCPUs that an environment should maintain,
     * even if the compute environment is DISABLED.
     *
     * @default 0
     */
    readonly minvCpus?: number;
    /**
     * The EC2 placement group to associate with your compute resources.
     * If you intend to submit multi-node parallel jobs to this Compute Environment,
     * you should consider creating a cluster placement group and associate it with your compute resources.
     * This keeps your multi-node parallel job on a logical grouping of instances
     * within a single Availability Zone with high network flow potential.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
     *
     * @default - no placement group
     */
    readonly placementGroup?: ec2.IPlacementGroup;
    /**
     * Add an instance type to this compute environment
     */
    addInstanceType(instanceType: ec2.InstanceType): void;
    /**
     * Add an instance class to this compute environment
     */
    addInstanceClass(instanceClass: ec2.InstanceClass): void;
}
/**
 * Props for a ManagedEc2EksComputeEnvironment
 */
export interface ManagedEc2EksComputeEnvironmentProps extends ManagedComputeEnvironmentProps {
    /**
     * The namespace of the Cluster
     */
    readonly kubernetesNamespace: string;
    /**
     * The cluster that backs this Compute Environment. Required
     * for Compute Environments running Kubernetes jobs.
     *
     * Please ensure that you have followed the steps at
     *
     * https://docs.aws.amazon.com/batch/latest/userguide/getting-started-eks.html
     *
     * before attempting to deploy a `ManagedEc2EksComputeEnvironment` that uses this cluster.
     * If you do not follow the steps in the link, the deployment fail with a message that the
     * compute environment did not stabilize.
     */
    readonly eksCluster: eks.ICluster;
    /**
     * Whether or not to use batch's optimal instance type.
     * The optimal instance type is equivalent to adding the
     * C4, M4, and R4 instance classes. You can specify other instance classes
     * (of the same architecture) in addition to the optimal instance classes.
     *
     * @default true
     */
    readonly useOptimalInstanceClasses?: boolean;
    /**
     * Configure which AMIs this Compute Environment can launch.
     *
     * @default
     * If `imageKubernetesVersion` is specified,
     * - EKS_AL2 for non-GPU instances, EKS_AL2_NVIDIA for GPU instances,
     * Otherwise,
     * - ECS_AL2 for non-GPU instances, ECS_AL2_NVIDIA for GPU instances,
     */
    readonly images?: EksMachineImage[];
    /**
     * The allocation strategy to use if not enough instances of
     * the best fitting instance type can be allocated.
     *
     * @default - `BEST_FIT_PROGRESSIVE` if not using Spot instances,
     * `SPOT_CAPACITY_OPTIMIZED` if using Spot instances.
     */
    readonly allocationStrategy?: AllocationStrategy;
    /**
     * The maximum percentage that a Spot Instance price can be when compared with the
     * On-Demand price for that instance type before instances are launched.
     * For example, if your maximum percentage is 20%, the Spot price must be
     * less than 20% of the current On-Demand price for that Instance.
     * You always pay the lowest market price and never more than your maximum percentage.
     * For most use cases, Batch recommends leaving this field empty.
     *
     * Implies `spot == true` if set
     *
     * @default - 100%
     */
    readonly spotBidPercentage?: number;
    /**
     * The instance types that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     *
     * @default - the instances Batch considers will be used (currently C4, M4, and R4)
     */
    readonly instanceTypes?: ec2.InstanceType[];
    /**
     * The instance types that this Compute Environment can launch.
     * Which one is chosen depends on the `AllocationStrategy` used.
     * Batch will automatically choose the instance size.
     *
     * @default - the instances Batch considers will be used (currently C4, M4, and R4)
     */
    readonly instanceClasses?: ec2.InstanceClass[];
    /**
     * The execution Role that instances launched by this Compute Environment will use.
     *
     * @default - a role will be created
     */
    readonly instanceRole?: iam.IRole;
    /**
     * The Launch Template that this Compute Environment
     * will use to provision EC2 Instances.
     *
     * *Note*: if `securityGroups` is specified on both your
     * launch template and this Compute Environment, **the
     * `securityGroup`s on the Compute Environment override the
     * ones on the launch template.**
     *
     * @default - no launch template
     */
    readonly launchTemplate?: ec2.ILaunchTemplate;
    /**
     * The minimum vCPUs that an environment should maintain,
     * even if the compute environment is DISABLED.
     *
     * @default 0
     */
    readonly minvCpus?: number;
    /**
     * The EC2 placement group to associate with your compute resources.
     * If you intend to submit multi-node parallel jobs to this Compute Environment,
     * you should consider creating a cluster placement group and associate it with your compute resources.
     * This keeps your multi-node parallel job on a logical grouping of instances
     * within a single Availability Zone with high network flow potential.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
     *
     * @default - no placement group
     */
    readonly placementGroup?: ec2.IPlacementGroup;
}
/**
 * A ManagedComputeEnvironment that uses ECS orchestration on EC2 instances.
 *
 * @resource AWS::Batch::ComputeEnvironment
 */
export declare class ManagedEc2EksComputeEnvironment extends ManagedComputeEnvironmentBase implements IManagedEc2EksComputeEnvironment {
    readonly kubernetesNamespace?: string;
    readonly eksCluster: eks.ICluster;
    readonly computeEnvironmentName: string;
    readonly computeEnvironmentArn: string;
    readonly images?: EksMachineImage[];
    readonly allocationStrategy?: AllocationStrategy;
    readonly spotBidPercentage?: number;
    readonly instanceTypes: ec2.InstanceType[];
    readonly instanceClasses: ec2.InstanceClass[];
    readonly instanceRole?: iam.IRole;
    readonly launchTemplate?: ec2.ILaunchTemplate;
    readonly minvCpus?: number;
    readonly placementGroup?: ec2.IPlacementGroup;
    private readonly instanceProfile;
    constructor(scope: Construct, id: string, props: ManagedEc2EksComputeEnvironmentProps);
    addInstanceType(instanceType: ec2.InstanceType): void;
    addInstanceClass(instanceClass: ec2.InstanceClass): void;
}
/**
 * A ManagedComputeEnvironment that uses ECS orchestration on Fargate instances.
 */
export interface IFargateComputeEnvironment extends IManagedComputeEnvironment {
}
/**
 * Props for a FargateComputeEnvironment
 */
export interface FargateComputeEnvironmentProps extends ManagedComputeEnvironmentProps {
}
/**
 * A ManagedComputeEnvironment that uses ECS orchestration on Fargate instances.
 *
 * @resource AWS::Batch::ComputeEnvironment
 */
export declare class FargateComputeEnvironment extends ManagedComputeEnvironmentBase implements IFargateComputeEnvironment {
    /**
     * Reference an existing FargateComputeEnvironment by its arn
     */
    static fromFargateComputeEnvironmentArn(scope: Construct, id: string, fargateComputeEnvironmentArn: string): IFargateComputeEnvironment;
    readonly computeEnvironmentName: string;
    readonly computeEnvironmentArn: string;
    constructor(scope: Construct, id: string, props: FargateComputeEnvironmentProps);
}
export {};
