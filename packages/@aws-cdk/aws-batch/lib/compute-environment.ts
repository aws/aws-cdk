import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Aws, Construct, IResource, Resource, Stack, Tag } from '@aws-cdk/core';
import { CfnComputeEnvironment } from './batch.generated';

/**
 * Property to specify if the compute environment
 * uses On-Demand or SpotFleet compute resources.
 */
export enum ComputeResourceType {
  /**
   * Resources will be EC2 On-Demand resources.
   */
  ON_DEMAND  = 'EC2',

  /**
   * Resources will be EC2 SpotFleet resources.
   */
  SPOT = 'SPOT',
}

/**
 * Properties for how to prepare compute resources
 * that are provisioned for a compute environment.
 */
export enum AllocationStrategy {
  /**
   * Batch will use the best fitting instance type will be used
   * when assigning a batch job in this compute environment.
   */
  BEST_FIT = 'BEST_FIT',

  /**
   * Batch will select additional instance types that are large enough to
   * meet the requirements of the jobs in the queue, with a preference for
   * instance types with a lower cost per unit vCPU.
   */
  BEST_FIT_PROGRESSIVE = 'BEST_FIT_PROGRESSIVE',

  /**
   * This is only available for Spot Instance compute resources and will select
   * additional instance types that are large enough to meet the requirements of
   * the jobs in the queue, with a preference for instance types that are less
   * likely to be interrupted.
   */
  SPOT_CAPACITY_OPTIMIZED = 'SPOT_CAPACITY_OPTIMIZED',
}

/**
 * Properties for defining the structure of the batch compute cluster.
 */
export interface ComputeResources {
  /**
   * The IAM role applied to EC2 resources in the compute environment.
   *
   * @default - a new role will be created.
   */
  readonly instanceRole?: iam.IRole;

  /**
   * The types of EC2 instances that may be launched in the compute environment. You can specify instance
   * families to launch any instance type within those families (for example, c4 or p3), or you can specify
   * specific sizes within a family (such as c4.8xlarge). You can also choose optimal to pick instance types
   * (from the C, M, and R instance families) on the fly that match the demand of your job queues.
   *
   * @default optimal
   */
  readonly instanceTypes?: ec2.InstanceType[];

  /**
   * The EC2 security group(s) associated with instances launched in the compute environment.
   *
   * @default AWS default security group.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The VPC network that all compute resources will be connected to.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The VPC subnets into which the compute resources are launched.
   *
   * @default - private subnets of the supplied VPC.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The type of compute environment: ON_DEMAND or SPOT.
   *
   * @default ON_DEMAND
   */
  readonly type?: ComputeResourceType;

  /**
   * This property will be ignored if you set the environment type to ON_DEMAND.
   *
   * The maximum percentage that a Spot Instance price can be when compared with the On-Demand price for
   * that instance type before instances are launched. For example, if your maximum percentage is 20%,
   * then the Spot price must be below 20% of the current On-Demand price for that EC2 instance. You always
   * pay the lowest (market) price and never more than your maximum percentage. If you leave this field empty,
   * the default value is 100% of the On-Demand price.
   *
   * @default 100
   */
  readonly bidPercentage?: number;

  /**
   * The desired number of EC2 vCPUS in the compute environment.
   *
   * @default - no desired vcpu value will be used.
   */
  readonly desiredvCpus?: number;

  /**
   * The maximum number of EC2 vCPUs that an environment can reach. Each vCPU is equivalent to
   * 1,024 CPU shares. You must specify at least one vCPU.
   *
   * @default 256
   */
  readonly maxvCpus?: number;

  /**
   * The minimum number of EC2 vCPUs that an environment should maintain (even if the compute environment state is DISABLED).
   * Each vCPU is equivalent to 1,024 CPU shares. You must specify at least one vCPU.
   *
   * @default 1
   */
  readonly minvCpus?: number;

  /**
   * The EC2 key pair that is used for instances launched in the compute environment.
   * If no key is defined, then SSH access is not allowed to provisioned compute resources.
   *
   * @default - No SSH access will be possible.
   */
  readonly ec2KeyPair?: string;

  /**
   * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment.
   *
   * @default - no image will be used.
   */
  readonly image?: ec2.IMachineImage;

  /**
   * This property will be ignored if you set the environment type to ON_DEMAND.
   *
   * The Amazon Resource Name (ARN) of the Amazon EC2 Spot Fleet IAM role applied to a SPOT compute environment.
   * For more information, see Amazon EC2 Spot Fleet Role in the AWS Batch User Guide.
   *
   * @link https://docs.aws.amazon.com/batch/latest/userguide/spot_fleet_IAM_role.html
   * @default - no fleet role will be used.
   */
  readonly spotFleetRole?: iam.IRole;

  /**
   * Key-value pair tags to be applied to resources that are launched in the compute environment.
   * For AWS Batch, these take the form of "String1": "String2", where String1 is the tag key and
   * String2 is the tag value—for example, { "Name": "AWS Batch Instance - C4OnDemand" }.
   *
   * @default - no tags will be assigned on compute resources.
   */
  readonly computeResourcesTags?: Tag;
}

/**
 * Properties for creating a new Compute Environment
 */
export interface ComputeEnvironmentProps {
  /**
   * The allocation strategy to use for the compute resource in case not enough instances ofthe best
   * fitting instance type can be allocated. This could be due to availability of the instance type in
   * the region or Amazon EC2 service limits. If this is not specified, the default is BEST_FIT, which
   * will use only the best fitting instance type, waiting for additional capacity if it's not available.
   * This allocation strategy keeps costs lower but can limit scaling. If you are using Spot Fleets with
   * BEST_FIT then the Spot Fleet IAM Role must be specified. BEST_FIT_PROGRESSIVE will select an additional
   * instance type that is large enough to meet the requirements of the jobs in the queue, with a preference
   * for an instance type with a lower cost. SPOT_CAPACITY_OPTIMIZED is only available for Spot Instance
   * compute resources and will select an additional instance type that is large enough to meet the requirements
   * of the jobs in the queue, with a preference for an instance type that is less likely to be interrupted.
   *
   * @default AllocationStrategy.BEST_FIT
   */
  readonly allocationStrategy?: AllocationStrategy;

  /**
   * A name for the compute environment.
   *
   * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
   *
   * @default Cloudformation-generated name
   */
  readonly computeEnvironmentName?: string;

  /**
   * The details of the compute resources managed by this environment.
   *
   * If specified, and this is an managed compute environment, the property will be ignored.
   *
   * By default, AWS Batch managed compute environments use a recent, approved version of the
   * Amazon ECS-optimized AMI for compute resources.
   *
   * @default - AWS-managed compute resources
   */
  readonly computeResources?: ComputeResources;

  /**
   * The state of the compute environment. If the state is set to true, then the compute
   * environment accepts jobs from a queue and can scale out automatically based on queues.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The IAM role used by Batch to make calls to other AWS services on your behalf for managing
   * the resources that you use with the service. By default, this role is created for you using
   * the AWS managed service policy for Batch.
   *
   * @link https://docs.aws.amazon.com/batch/latest/userguide/service_IAM_role.html
   *
   * @default - Role using the 'service-role/AWSBatchServiceRole' policy.
   */
  readonly serviceRole?: iam.IRole,

  /**
   * Determines if AWS should manage the allocation of compute resources for processing jobs.
   * If set to false, then you are in charge of providing the compute resource details.
   *
   * @default true
   */
  readonly managed?: boolean;
}

/**
 * Properties of a compute environment.
 */
export interface IComputeEnvironment extends IResource {
  /**
   * The ARN of this compute environment.
   *
   * @attribute
   */
  readonly computeEnvironmentArn: string;

  /**
   * The name of this compute environment.
   *
   * @attribute
   */
  readonly computeEnvironmentName: string;
}

/**
 * Batch Compute Environment.
 *
 * Defines a batch compute environment to run batch jobs on.
 */
export class ComputeEnvironment extends Resource implements IComputeEnvironment {
  /**
   * Fetches an existing batch compute environment by its amazon resource name.
   *
   * @param scope
   * @param id
   * @param computeEnvironmentArn
   */
  public static fromComputeEnvironmentArn(scope: Construct, id: string, computeEnvironmentArn: string): IComputeEnvironment {
    const stack = Stack.of(scope);
    const computeEnvironmentName = stack.parseArn(computeEnvironmentArn).resourceName!;

    class Import extends Resource implements IComputeEnvironment {
      public readonly computeEnvironmentArn = computeEnvironmentArn;
      public readonly computeEnvironmentName = computeEnvironmentName;
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of this compute environment.
   *
   * @attribute
   */
  public readonly computeEnvironmentArn: string;

  /**
   * The name of this compute environment.
   *
   * @attribute
   */
  public readonly computeEnvironmentName: string;

  constructor(scope: Construct, id: string, props: ComputeEnvironmentProps = { enabled: true, managed: true }) {
    super(scope, id, {
      physicalName: props.computeEnvironmentName,
    });

    this.validateProps(props);

    const spotFleetRole = this.getSpotFleetRole(props);
    let computeResources: CfnComputeEnvironment.ComputeResourcesProperty | undefined;

    // Only allow compute resources to be set when using UNMANAGED type
    if (props.computeResources && !this.isManaged(props)) {
      computeResources = {
        allocationStrategy: props.allocationStrategy || AllocationStrategy.BEST_FIT,
        bidPercentage: props.computeResources.bidPercentage,
        desiredvCpus: props.computeResources.desiredvCpus,
        ec2KeyPair: props.computeResources.ec2KeyPair,
        imageId: props.computeResources.image && props.computeResources.image.getImage(this).imageId,
        instanceRole: props.computeResources.instanceRole
          ? props.computeResources.instanceRole.roleArn
          : new iam.Role(this, 'Resource-Instance-Role', {
            assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
          }).roleArn,
        instanceTypes: this.buildInstanceTypes(props.computeResources.instanceTypes),
        maxvCpus: props.computeResources.maxvCpus || 256,
        minvCpus: props.computeResources.minvCpus || 0,
        securityGroupIds: this.buildSecurityGroupIds(props.computeResources.vpc, props.computeResources.securityGroups),
        spotIamFleetRole: spotFleetRole ? spotFleetRole.roleArn : undefined,
        subnets: props.computeResources.vpc.selectSubnets(props.computeResources.vpcSubnets).subnetIds,
        tags: props.computeResources.computeResourcesTags,
        type: props.computeResources.type || ComputeResourceType.ON_DEMAND,
      };
    }

    const computeEnvironment = new CfnComputeEnvironment(this, 'Resource', {
      computeEnvironmentName: this.physicalName,
      computeResources,
      serviceRole: props.serviceRole
        ? props.serviceRole.roleArn
        : new iam.Role(this, 'Resource-Service-Instance-Role', {
          managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSBatchServiceRole'),
          ],
          assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
        }).roleArn,
      state: props.enabled === undefined ? 'ENABLED' : (props.enabled ? 'ENABLED' : 'DISABLED'),
      type: this.isManaged(props) ? 'UNMANAGED' : 'MANAGED',
    });

    if (props.computeResources && props.computeResources.vpc) {
      this.node.addDependency(props.computeResources.vpc);
    }

    this.computeEnvironmentArn = this.getResourceArnAttribute(computeEnvironment.ref, {
      service: 'batch',
      resource: 'compute-environment',
      resourceName: this.physicalName,
    });
    this.computeEnvironmentName = this.getResourceNameAttribute(computeEnvironment.ref);
  }

  private isManaged(props: ComputeEnvironmentProps): boolean {
    return props.managed === undefined ? true : props.managed;
  }

  /**
   * Validates the properties provided for a new batch compute environment.
   */
  private validateProps(props: ComputeEnvironmentProps) {
    if (props === undefined) {
      return;
    }

    if (this.isManaged(props) && props.computeResources !== undefined) {
      throw new Error('It is not allowed to set computeResources on an AWS managed compute environment');
    }

    if (!this.isManaged(props) && props.computeResources === undefined) {
      throw new Error('computeResources is missing but required on an unmanaged compute environment');
    }

    // Setting a bid percentage is only allowed on SPOT resources +
    // Cannot use SPOT_CAPACITY_OPTIMIZED when using ON_DEMAND
    if (props.computeResources) {
      if (props.computeResources.type === ComputeResourceType.ON_DEMAND) {
        // VALIDATE FOR ON_DEMAND

        // Bid percentage is not allowed
        if (props.computeResources.bidPercentage !== undefined) {
          throw new Error('Setting the bid percentage is only allowed for SPOT type resources on a batch compute environment');
        }

        // SPOT_CAPACITY_OPTIMIZED allocation is not allowed
        if (props.allocationStrategy && props.allocationStrategy === AllocationStrategy.SPOT_CAPACITY_OPTIMIZED) {
          throw new Error('The SPOT_CAPACITY_OPTIMIZED allocation strategy is only allowed if the environment is a SPOT type compute environment');
        }
      } else {
        // VALIDATE FOR SPOT

        // Bid percentage must be from 0 - 100
        if (props.computeResources.bidPercentage !== undefined &&
          (props.computeResources.bidPercentage < 0 || props.computeResources.bidPercentage > 100)) {
            throw new Error('Bid percentage can only be a value between 0 and 100');
        }
      }

      if (props.computeResources.minvCpus) {
        // minvCpus cannot be less than 0
        if (props.computeResources.minvCpus < 0) {
          throw new Error('Minimum vCpus for a batch compute environment cannot be less than 0');
        }

        // minvCpus cannot exceed max vCpus
        if (props.computeResources.maxvCpus &&
          props.computeResources.minvCpus > props.computeResources.maxvCpus) {
            throw new Error('Minimum vCpus cannot be greater than the maximum vCpus');
        }
      }
    }
  }

  private buildInstanceTypes(instanceTypes?: ec2.InstanceType[]): string[] {
    if (instanceTypes === undefined) {
      return [
        'optimal',
      ];
    }

    return instanceTypes.map((type: ec2.InstanceType) => type.toString());
  }

  private buildSecurityGroupIds(vpc: ec2.IVpc, securityGroups?: ec2.ISecurityGroup[]): string[] | undefined {
    if (securityGroups === undefined) {
      return [
        new ec2.SecurityGroup(this, 'Resource-Security-Group', { vpc }).securityGroupId,
      ];
    }

    return securityGroups.map((group: ec2.ISecurityGroup) => group.securityGroupId);
  }

  /**
   * Generates an AWS IAM role for provisioning spotfleet resources
   * if the allocation strategy is set to BEST_FIT or not defined.
   *
   * @param props - the compute environment construct properties
   */
  private getSpotFleetRole(props: ComputeEnvironmentProps): iam.IRole | undefined {
    if (props.allocationStrategy && props.allocationStrategy !== AllocationStrategy.BEST_FIT) {
      return undefined;
    }

    if (props.computeResources) {
      if (props.computeResources.spotFleetRole) {
        return props.computeResources.spotFleetRole;
      } else if (props.computeResources.type === ComputeResourceType.SPOT) {
        return iam.Role.fromRoleArn(this, 'Resource-SpotFleet-Role',
          `arn${Aws.PARTITION}iam::${this.stack.account}:role/aws-service-role/spotfleet.amazonaws.com/AWSServiceRoleForEC2SpotFleet`);
      }
    }

    return undefined;
  }
}
