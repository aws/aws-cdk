import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnComputeEnvironment } from './batch.generated';
import { IComputeEnvironment, ComputeEnvironmentBase, ComputeEnvironmentProps } from './compute-environment-base';


export interface IManagedComputeEnvironment extends IComputeEnvironment {
  /**
   * The maximum vCpus this `ManagedComputeEnvironment` can scale up to.
   *
   * *Note*: if this Compute Environment uses EC2 resources (not Fargate) with either `AllocationStrategy.BEST_FIT_PROGRESSIVE` or
   * `AllocationStrategy.SPOT_CAPACITY_OPTIMIZED`, or `AllocationStrategy.BEST_FIT` with Spot instances,
   * The scheduler may exceed this number by at most one of the instances specified in `instanceTypes`
   * or `instanceClasses`.
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
   * `allocationStrategy`, `spotBidPercentage`, // TODO
   * @see: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment
   * @see: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html
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
   * Only meaningful if `terminateOnUpdate` is `true`. If so,
   * when an infrastructure update is triggered, any jobs will be
   * terminated and may be retried on the updated infrastructure,
   * depending on the job's retry policy. If the job is retried,
   * then it will be allowed to run for the duration specified by
   * `updateTimeout`;
   * once the timer expires, the job will be terminated again, but not
   * retried.
   *
   * @see - https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
   * @default 30 minutes
   */
  readonly updateTimeout?: Duration;

  /**
   * Whether or not any running jobs will be terminated when an infrastructure update
   * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
   * retry policy. If the job is retried,
   * then it will be allowed to run for the duration specified by
   * `updateTimeout`;
   * once the timer expires, the job will be terminated again, but not
   * retried.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
   */
  readonly terminateOnUpdate?: boolean;

  /**
   * The security groups this Compute Environment will launch instances in.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The VPC Subnets this Compute Environment will launch instances in.
   */
  readonly subnets?: ec2.ISubnet[];

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
  * `allocationStrategy`, `spotBidPercentage`, // TODO
  * @see: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment
  * @see: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html
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
  * Only meaningful if `terminateOnUpdate` is `true`. If so,
  * when an infrastructure update is triggered, any jobs will be
  * terminated and may be retried on the updated infrastructure,
  * depending on the job's retry policy. If the job is retried,
  * then it will be allowed to run for the duration specified by
  * `updateTimeout`;
  * once the timer expires, the job will be terminated again, but not
  * retried.
  *
  * @see - https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
  * @default 30 minutes
  */
  readonly updateTimeout?: Duration;

  /**
  * Whether or not any running jobs will be terminated when an infrastructure update
  * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
  * retry policy. If the job is retried,
  * then it will be allowed to run for the duration specified by
  * `updateTimeout`;
  * once the timer expires, the job will be terminated again, but not
  * retried.
  *
  * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
  *
  * @default true
  */
  readonly terminateOnUpdate?: boolean;

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
  readonly subnets?: ec2.ISubnet[];

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

export abstract class ManagedComputeEnvironmentBase extends ComputeEnvironmentBase implements IManagedComputeEnvironment {
  /**
  * The maximum vCpus this `ManagedComputeEnvironment` can scale up to.
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
  * `allocationStrategy`, `spotBidPercentage`, // TODO
  * @see: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-computeenvironment.html#cfn-batch-computeenvironment-replacecomputeenvironment
  * @see: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-continueupdaterollback.html
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
  * Only meaningful if `terminateOnUpdate` is `true`. If so,
  * when an infrastructure update is triggered, any jobs will be
  * terminated and may be retried on the updated infrastructure,
  * depending on the job's retry policy. If the job is retried,
  * then it will be allowed to run for the duration specified by
  * `updateTimeout`;
  * once the timer expires, the job will be terminated again, but not
  * retried.
  *
  * @see - https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
  * @default 30 minutes
  */
  readonly updateTimeout?: Duration;

  /**
  * Whether or not any running jobs will be terminated when an infrastructure update
  * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
  * retry policy. If the job is retried,
  * then it will be allowed to run for the duration specified by
  * `updateTimeout`;
  * once the timer expires, the job will be terminated again, but not
  * retried.
  *
  * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
  */
  readonly terminateOnUpdate?: boolean;

  /**
  * The security groups this Compute Environment will launch instances in.
  *
  * *Note*: On Fargate, specifying an empty array will result in no change
  * in the security groups.
  * On Ec2, specifying an empty array will result in the security groups
  * being deleted.
  *
  * @default: will be created
  */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
  * The VPC Subnets this Compute Environment will launch instances in.
  *
  * *Note*: On Fargate, specifying an empty array will result in no change
  * in the subnets.
  * On Ec2, specifying an empty array will result in the subnets
  * being deleted.
  *
  * @default: will be created
  */
  readonly subnets?: ec2.ISubnet[];

  /**
  * Whether or not the AMI is updated to the latest one supported by Batch
  * when an infrastructure update occurs.
  *
  * If you specify a specific AMI, this property will be ignored.
  *
  * @default true
  */
  readonly updateToLatestImageVersion?: boolean;

  constructor(scope: Construct, id: string, props?: ManagedComputeEnvironmentProps) {
    super(scope, id, props);

    this.maxvCpus = props?.maxvCpus ?? 256;
    this.replaceComputeEnvironment = props?.replaceComputeEnvironment;
    this.spot = props?.spot;
    this.updateTimeout = props?.updateTimeout;
    this.terminateOnUpdate = props?.terminateOnUpdate;
    this.securityGroups = props?.securityGroups;
    this.subnets = props?.subnets;
    this.updateToLatestImageVersion = props?.updateToLatestImageVersion;

    /*const computeResources: CfnComputeEnvironment.ComputeResourcesProperty = {
      maxvCpus: this.maxvCpus,
      subnets: ['TODO!'],
      type: 'foo',
    }*/
  }
}

export interface IManagedEc2ComputeEnvironment extends IManagedComputeEnvironment {
  /**
   * Configure which AMIs this Compute Environment can launch.
   * @default
   * If `imageKubernetesVersion` is specified,
   * - EKS_AL2 for non-GPU instances, EKS_AL2_NVIDIA for GPU instances,
   * Otherwise,
   * - ECS_AL2 for non-GPU instances, ECS_AL2_NVIDIA for GPU instances,
   */
  readonly images?: IBatchMachineImage[];

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
   * The instance types that this Compute Environment can launch.
   * Which one is chosen depends on the `AllocationStrategy` used.
   */
  readonly instanceTypes?: ec2.InstanceType[];

  /**
   * The instance types that this Compute Environment can launch.
   * Which one is chosen depends on the `AllocationStrategy` used.
   */
  readonly instanceClasses?: ec2.InstanceClass[];

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
   * @see: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
   */
  readonly placementGroup?: ec2.IPlacementGroup;
}

export interface IBatchMachineImage {
  image: ec2.IMachineImage;
  imageType: BatchMachineImageType;
  imageKubernetesVersion?: string;
}

export enum BatchMachineImageType {
  ECS_AL2 = 'ECS_AL2',
  ECS_AL2_NVIDIA = 'ECS_AL2_NVIDIA',
  EKS_AL2 = 'EKS_AL2',
  EKS_AL2_NVIDIA = 'EKS_AL2_NVIDIA',
}

export enum AllocationStrategy {
  BEST_FIT = 'BEST_FIT',
  BEST_FIT_PROGRESSIVE = 'BEST_FIT_PROGRESSIVE',
  SPOT_CAPACITY_OPTIMIZED = 'SPOT_CAPACITY_OPTIMIZED',
}

export interface ManagedEc2ComputeEnvironmentProps extends ManagedComputeEnvironmentProps {
  readonly images?: IBatchMachineImage[];
  readonly allocationStrategy?: AllocationStrategy;
  readonly spotBidPercentage?: number;
  readonly desiredvCpus?: number;
  readonly instanceTypes?: ec2.InstanceType[];
  readonly instanceClasses?: ec2.InstanceClass[];
  /**
    * Whether or not to use batch's optimal instance type.
    * The optimal instance type is equivalent to adding the
    * C4, M4, and R4 instance classes. You can specify other instance classes
    * (of the same architecture) in addition to the optimal instance classes.
    *
    * @default true
    */
  readonly useOptimalInstanceClasses?: boolean;
  readonly instanceRole?: iam.IRole;
  readonly launchTemplate?: ec2.ILaunchTemplate;
  readonly minvCpus?: number;
  readonly placementGroup?: ec2.IPlacementGroup;
}

export class ManagedEc2ComputeEnvironment extends ManagedComputeEnvironmentBase implements IManagedEc2ComputeEnvironment {
  /**
  * Configure which AMIs this Compute Environment can launch.
  * @default
  * If `imageKubernetesVersion` is specified,
  * - EKS_AL2 for non-GPU instances, EKS_AL2_NVIDIA for GPU instances,
  * Otherwise,
  * - ECS_AL2 for non-GPU instances, ECS_AL2_NVIDIA for GPU instances,
  */
  readonly images?: IBatchMachineImage[];

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
  readonly instanceTypes?: ec2.InstanceType[];

  /**
    * The instance types that this Compute Environment can launch.
    * Which one is chosen depends on the `AllocationStrategy` used.
    */
  readonly instanceClasses?: ec2.InstanceClass[];

  /**
    * The execution Role that instances launched by this Compute Environment will use.
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
    * @see: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
    */
  readonly placementGroup?: ec2.IPlacementGroup;

  constructor(scope: Construct, id: string, props?: ManagedEc2ComputeEnvironmentProps) {
    super(scope, id, props);

    this.images = props?.images;
    this.allocationStrategy = props?.allocationStrategy;
    this.spotBidPercentage = props?.spotBidPercentage;
    this.instanceTypes = props?.instanceTypes;
    this.instanceClasses = props?.instanceClasses;
    // TODO: useOptimalInstanceClasses needs to be used when setting instance types
    this.instanceRole = props?.instanceRole;
    this.launchTemplate = props?.launchTemplate;
    this.minvCpus = props?.minvCpus;
    this.placementGroup = props?.placementGroup;
  }
  public addInstanceType() {}
  public addInstanceClass() {}
}

interface IEksComputeEnvironment extends IManagedEc2ComputeEnvironment {
  /**
   * The namespace of the Cluster
   *
   * @default 'default'
   */
  readonly kubernetesNamespace?: string;

  /**
   * The cluster that backs this Compute Environment. Required
   * for Compute Environments running Kubernetes jobs.
   *
   * @default - an EKS Cluster will be created
   */
  readonly eksCluster?: eks.ICluster;
}

export interface EksComputeEnvironmentProps extends ManagedEc2ComputeEnvironmentProps {
  /**
   * The namespace of the Cluster
   *
   * @default 'default'
   */
  readonly kubernetesNamespace?: string;

  /**
   * The cluster that backs this Compute Environment. Required
   * for Compute Environments running Kubernetes jobs.
   *
   * @default - an EKS Cluster will be created
   */
  readonly eksCluster?: eks.ICluster;
}

export class EksComputeEnvironment extends ManagedEc2ComputeEnvironment implements IEksComputeEnvironment {
  /**
   * The namespace of the Cluster
   *
   * @default 'default'
   */
  readonly kubernetesNamespace?: string;

  /**
   * The cluster that backs this Compute Environment. Required
   * for Compute Environments running Kubernetes jobs.
   *
   * @default - an EKS Cluster will be created
   */
  readonly eksCluster?: eks.ICluster;

  constructor(scope: Construct, id: string, props?: EksComputeEnvironmentProps) {
    super(scope, id, props);

    this.kubernetesNamespace = props?.kubernetesNamespace ?? 'default';
    this.eksCluster = props?.eksCluster ?? new eks.Cluster(this, 'EKSCluster', {
      version: eks.KubernetesVersion.V1_24,
    });

    const resource = super.node.tryFindChild('Resource') as CfnComputeEnvironment;

    resource.eksConfiguration = {
      eksClusterArn: this.eksCluster.clusterArn,
      kubernetesNamespace: this.kubernetesNamespace,
    };
  }
}

export interface IFargateComputeEnvironment extends IManagedComputeEnvironment {}

export interface FargateComputeEnvironmentProps extends ComputeEnvironmentProps {}

export class FargateComputeEnvironment extends ManagedComputeEnvironmentBase implements IFargateComputeEnvironment {
  constructor(scope: Construct, id: string, props?: FargateComputeEnvironmentProps) {
    super(scope, id, props);
  }
}
