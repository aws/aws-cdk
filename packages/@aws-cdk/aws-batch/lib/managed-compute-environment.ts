import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnComputeEnvironment } from './batch.generated';
import { IComputeEnvironment, ComputeEnvironmentBase, ComputeEnvironmentProps } from './compute-environment-base';


export interface IManagedComputeEnvironment extends IComputeEnvironment, ec2.IConnectable {
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
   * Only meaningful if `terminateOnUpdate` is `false`. If so,
   * when an infrastructure update is triggered, any running jobs
   * will be allowed to run until `updateTimeout` has expired.
   *
   * @see - https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
   * @default 30 minutes
   */
  readonly updateTimeout?: Duration;

  /**
   * Whether or not any running jobs will be immediately terminated when an infrastructure update
   * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
   * retry policy.
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
  readonly subnets?: ec2.SubnetSelection;

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
   * Only meaningful if `terminateOnUpdate` is `false`. If so,
   * when an infrastructure update is triggered, any running jobs
   * will be allowed to run until `updateTimeout` has expired.
   *
   * @see - https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
   * @default 30 minutes
   */
  readonly updateTimeout?: Duration;

  /**
   * Whether or not any running jobs will be immediately terminated when an infrastructure update
   * occurs. If this is enabled, any terminated jobs may be retried, depending on the job's
   * retry policy.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/updating-compute-environments.html
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
  readonly subnets?: ec2.SubnetSelection;

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
  readonly maxvCpus: number;
  readonly replaceComputeEnvironment?: boolean;
  readonly spot?: boolean;
  readonly updateTimeout?: Duration;
  readonly terminateOnUpdate?: boolean;
  readonly securityGroups?: ec2.ISecurityGroup[];
  readonly subnets?: ec2.SubnetSelection;
  readonly updateToLatestImageVersion?: boolean;

  readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: ManagedComputeEnvironmentProps) {
    super(scope, id, props);

    this.maxvCpus = props.maxvCpus ?? DEFAULT_MAX_VCPUS;
    this.replaceComputeEnvironment = props.replaceComputeEnvironment;
    this.spot = props.spot;
    this.updateTimeout = props.updateTimeout;
    this.terminateOnUpdate = props.terminateOnUpdate;
    this.subnets = props.subnets;
    this.updateToLatestImageVersion = props.updateToLatestImageVersion ?? true;
    this.securityGroups = props.securityGroups ?? [
      new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
      }),
    ];
    this.connections = new ec2.Connections({
      securityGroups: this.securityGroups,
    });
    const { subnetIds } = props.vpc.selectSubnets(props.subnets);

    this.resourceProps = {
      ...this.resourceProps,
      computeResources: {
        maxvCpus: this.maxvCpus,
        type: 'dummy',
        updateToLatestImageVersion: this.updateToLatestImageVersion,
        securityGroupIds: this.securityGroups.map((securityGroup) => securityGroup.securityGroupId),
        subnets: subnetIds,
      },
      updatePolicy: {
        terminateJobsOnUpdate: this.terminateOnUpdate,
        jobExecutionTimeoutMinutes: this.updateTimeout?.toMinutes(),
      },
      replaceComputeEnvironment: this.replaceComputeEnvironment,
      type: 'managed',
    };
  }
}

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
   * blah
   *
   * @default - a new Role will be created
   */
  readonly spotIamFleetRole?: iam.IRole;

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

interface MachineImage {
  readonly image?: ec2.IMachineImage;
}

export interface EcsMachineImage extends MachineImage {
  readonly imageType?: EcsMachineImageType;
}

export interface EksMachineImage extends MachineImage{
  readonly imageType?: EksMachineImageType;
}

export enum EcsMachineImageType {
  ECS_AL2 = 'ECS_AL2',
  ECS_AL2_NVIDIA = 'ECS_AL2_NVIDIA',
}

export enum EksMachineImageType {
  EKS_AL2 = 'EKS_AL2',
  EKS_AL2_NVIDIA = 'EKS_AL2_NVIDIA',
}

export enum AllocationStrategy {
  BEST_FIT = 'BEST_FIT',
  BEST_FIT_PROGRESSIVE = 'BEST_FIT_PROGRESSIVE',
  SPOT_CAPACITY_OPTIMIZED = 'SPOT_CAPACITY_OPTIMIZED',
}

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
    * @default - 100%
    */
  readonly spotBidPercentage?: number;

  /**
   * blah
   *
   * @default - a new role will be created
   */
  readonly spotFleetRole?: iam.IRole;

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
}

export class ManagedEc2EcsComputeEnvironment extends ManagedComputeEnvironmentBase implements IManagedEc2EcsComputeEnvironment {
  readonly images?: EcsMachineImage[];
  readonly allocationStrategy?: AllocationStrategy;
  readonly spotBidPercentage?: number;
  readonly spotFleetRole?: iam.IRole | undefined;
  readonly instanceTypes?: ec2.InstanceType[];
  readonly instanceClasses?: ec2.InstanceClass[];
  readonly instanceRole?: iam.IRole;
  readonly launchTemplate?: ec2.ILaunchTemplate;
  readonly minvCpus?: number;
  readonly placementGroup?: ec2.IPlacementGroup;

  private readonly instances: string[];
  private readonly instanceProfile: iam.CfnInstanceProfile;

  constructor(scope: Construct, id: string, props: ManagedEc2EcsComputeEnvironmentProps) {
    super(scope, id, props);

    this.images = props.images;
    this.allocationStrategy = determineAllocationStrategy(id, props.allocationStrategy, this.spot);
    this.spotBidPercentage = props.spotBidPercentage;
    this.spotFleetRole = props.spotFleetRole ?? createSpotFleetRole(this);
    this.instanceTypes = props.instanceTypes;
    this.instanceClasses = props.instanceClasses;

    const { instanceRole, instanceProfile } = createInstanceRoleAndProfile(this, props.instanceRole);
    this.instanceRole = instanceRole;
    this.instanceProfile = instanceProfile;

    this.launchTemplate = props.launchTemplate;
    this.minvCpus = props.minvCpus ?? DEFAULT_MIN_VCPUS;
    this.placementGroup = props.placementGroup;

    this.instances = determineInstances(this.instanceTypes, this.instanceClasses, props.useOptimalInstanceClasses);

    validateVCpus(id, this.minvCpus, this.maxvCpus);
    validateSpotBidPercentage(id, this.spot, this.spotBidPercentage);

    new CfnComputeEnvironment(this, 'Resource', {
      ...this.resourceProps,
      computeResources: {
        ...this.resourceProps.computeResources as CfnComputeEnvironment.ComputeResourcesProperty,
        minvCpus: this.minvCpus,
        instanceRole: this.instanceProfile.attrArn, // this is not a typo; this property actually takes a profile, not a standard role
        instanceTypes: this.instances,
        type: this.spot ? 'SPOT' : 'EC2',
        spotIamFleetRole: this.spotFleetRole?.roleArn,
        allocationStrategy: this.allocationStrategy,
        bidPercentage: this.spotBidPercentage,
        launchTemplate: this.launchTemplate,
        ec2Configuration: this.images?.map((image) => {
          return {
            imageIdOverride: image.image?.getImage(this).imageId,
            imageType: image.imageType ?? EcsMachineImageType.ECS_AL2,
          };
        }),
      },
    });
  }

  public addInstanceType() {}
  public addInstanceClass() {}
}

interface IManagedEc2EksComputeEnvironment extends IManagedComputeEnvironment {
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
}

export interface ManagedEc2EksComputeEnvironmentProps extends ManagedComputeEnvironmentProps {
  /**
   * The namespace of the Cluster
   *
   * @default 'batch-eks-default' + construct id
   */
  readonly kubernetesNamespace?: string;

  /**
   * The cluster that backs this Compute Environment. Required
   * for Compute Environments running Kubernetes jobs.
   *
   * @default - an EKS Cluster will be created
   */
  readonly eksCluster?: eks.ICluster;

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
   * blah
   *
   * @default - a new role will be created
   */
  readonly spotFleetRole?: iam.IRole;

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

export class ManagedEc2EksComputeEnvironment extends ManagedComputeEnvironmentBase implements IManagedEc2EksComputeEnvironment {
  readonly kubernetesNamespace?: string;
  readonly eksCluster?: eks.ICluster;

  readonly images?: EksMachineImage[];
  readonly allocationStrategy?: AllocationStrategy;
  readonly spotBidPercentage?: number;
  readonly spotFleetRole?: iam.IRole | undefined;
  readonly instanceTypes?: ec2.InstanceType[];
  readonly instanceClasses?: ec2.InstanceClass[];
  readonly instanceRole?: iam.IRole;
  readonly launchTemplate?: ec2.ILaunchTemplate;
  readonly minvCpus?: number;
  readonly placementGroup?: ec2.IPlacementGroup;

  private readonly instances: string[];
  private readonly instanceProfile: iam.CfnInstanceProfile;

  constructor(scope: Construct, id: string, props: ManagedEc2EksComputeEnvironmentProps) {
    super(scope, id, props);

    this.kubernetesNamespace = props.kubernetesNamespace ?? 'batch-eks-cluster-' + id;
    this.eksCluster = props.eksCluster ?? new eks.Cluster(this, 'EKSCluster', {
      version: eks.KubernetesVersion.V1_24,
    });

    this.images = props.images;
    this.allocationStrategy = determineAllocationStrategy(id, props.allocationStrategy, this.spot);
    this.spotBidPercentage = props.spotBidPercentage;
    this.spotFleetRole = props.spotFleetRole ?? createSpotFleetRole(this);
    this.instanceTypes = props.instanceTypes;
    this.instanceClasses = props.instanceClasses;

    const { instanceRole, instanceProfile } = createInstanceRoleAndProfile(this, props.instanceRole);
    this.instanceRole = instanceRole;
    this.instanceProfile = instanceProfile;

    this.launchTemplate = props.launchTemplate;
    this.minvCpus = props.minvCpus ?? DEFAULT_MIN_VCPUS;
    this.placementGroup = props.placementGroup;

    this.instances = determineInstances(this.instanceTypes, this.instanceClasses, props.useOptimalInstanceClasses);

    validateVCpus(id, this.minvCpus, this.maxvCpus);
    validateSpotBidPercentage(id, this.spot, this.spotBidPercentage);

    new CfnComputeEnvironment(this, 'Resource', {
      ...this.resourceProps,
      eksConfiguration: {
        eksClusterArn: this.eksCluster.clusterArn,
        kubernetesNamespace: this.kubernetesNamespace,
      },
      computeResources: {
        ...this.resourceProps.computeResources as CfnComputeEnvironment.ComputeResourcesProperty,
        minvCpus: this.minvCpus,
        instanceRole: this.instanceProfile.attrArn, // this is not a typo; this property actually takes a profile, not a standard role
        instanceTypes: this.instances,
        type: this.spot ? 'SPOT' : 'EC2',
        spotIamFleetRole: this.spotFleetRole?.roleArn,
        allocationStrategy: this.allocationStrategy,
        bidPercentage: this.spotBidPercentage,
        launchTemplate: this.launchTemplate,
        ec2Configuration: this.images?.map((image) => {
          return {
            imageIdOverride: image.image?.getImage(this).imageId,
            imageType: image.imageType ?? EksMachineImageType.EKS_AL2,
          };
        }),
      },
    });
  }
}

export interface IFargateComputeEnvironment extends IManagedComputeEnvironment {}

export interface FargateComputeEnvironmentProps extends ManagedComputeEnvironmentProps {}

export class FargateComputeEnvironment extends ManagedComputeEnvironmentBase implements IFargateComputeEnvironment {
  constructor(scope: Construct, id: string, props: FargateComputeEnvironmentProps) {
    super(scope, id, props);
  }
}

function determineInstances(types?: ec2.InstanceType[], classes?: ec2.InstanceClass[], useOptimalInstanceClasses?: boolean): string[] {
  const instances = [];

  for (const instanceType of types ?? []) {
    instances.push(instanceType.toString());
  }
  for (const instanceClass of classes ?? []) {
    instances.push(instanceClass);
  }
  if (useOptimalInstanceClasses || useOptimalInstanceClasses === undefined) {
    instances.push('optimal');
  }

  return instances;
}

function createInstanceRoleAndProfile(scope: Construct, instanceRole?: iam.IRole) {
  const result: any = {};

  result.instanceRole = instanceRole ?? new iam.Role(scope, 'InstanceProfileRole', {
    assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
  });

  result.instanceProfile = new iam.CfnInstanceProfile(scope, 'InstanceProfile', {
    roles: [result.instanceRole.roleName],
  });

  return result;
}

function createSpotFleetRole(scope: Construct) {
  return new iam.Role(scope, 'SpotFleetRole', {
    assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
  });
}

function determineAllocationStrategy(id: string, allocationStrategy?: AllocationStrategy, spot?: boolean) {
  let result = allocationStrategy;
  if (!allocationStrategy) {
    result = spot ? AllocationStrategy.SPOT_CAPACITY_OPTIMIZED : AllocationStrategy.BEST_FIT_PROGRESSIVE;
  } else if (allocationStrategy === AllocationStrategy.SPOT_CAPACITY_OPTIMIZED && !spot) {
    throw new Error(`Managed ComputeEnvironment '${id}' specifies 'AllocationStrategy.SPOT_CAPACITY_OPTIMIZED' without using spot instances`);
  }

  return result;
}

function validateSpotBidPercentage(id: string, spot?: boolean, spotBidPercentage?: number) {
  if (spotBidPercentage) {
    if (!spot) {
      throw new Error(`Managed ComputeEnvironment '${id}' specifies 'spotBidPercentage' without specifying 'spot'`);
    } else if (spotBidPercentage > 100) {
      throw new Error(`Managed ComputeEnvironment '${id}' specifies 'spotBidPercentage' > 100`);
    } else if (spotBidPercentage < 0) {
      throw new Error(`Managed ComputeEnvironment '${id}' specifies 'spotBidPercentage' < 0`);
    }
  }
}

function validateVCpus(id: string, minvCpus: number, maxvCpus: number) {
  if (minvCpus < 0) {
    throw new Error(`Managed ComputeEnvironment '${id}' has 'minvCpus' = ${minvCpus} < 0; 'minvCpus' cannot be less than zero`);
  }
  if (minvCpus > maxvCpus) {
    throw new Error(`Managed ComputeEnvironment '${id}' has 'minvCpus' = ${minvCpus} > 'maxvCpus' = ${maxvCpus}; 'minvCpus' cannot be greater than 'maxvCpus'`);
  }
}

const DEFAULT_MIN_VCPUS = 0;
const DEFAULT_MAX_VCPUS = 256;
