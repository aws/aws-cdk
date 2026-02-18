import type { Construct, IDependable } from 'constructs';
import { CfnFleet } from './codebuild.generated';
import { ComputeType } from './compute-type';
import type { EnvironmentType } from './environment-type';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import type { IResource, Size } from '../../core';
import { Arn, ArnFormat, PhysicalName, Resource, Token, UnscopedValidationError, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IFleetRef, FleetReference } from '../../interfaces/generated/aws-codebuild-interfaces.generated';

/**
 * Construction properties of a CodeBuild Fleet.
 */
export interface FleetProps {
  /**
   * The name of the Fleet.
   *
   * @default - CloudFormation generated name
   */
  readonly fleetName?: string;

  /**
   * The number of machines allocated to the compute ﬂeet.
   * Deﬁnes the number of builds that can run in parallel.
   *
   * Minimum value of 1.
   */
  readonly baseCapacity: number;

  /**
   * The instance type of the compute fleet.
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild.ComputeType.html
   */
  readonly computeType: FleetComputeType;

  /**
   * The build environment (operating system/architecture/accelerator) type
   * made available to projects using this fleet
   */
  readonly environmentType: EnvironmentType;

  /**
   * The compute configuration of the compute fleet.
   *
   * This is only permitted if `computeType` is set to ATTRIBUTE_BASED or
   * CUSTOM_INSTANCE_TYPE. In such cases, this is required.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment-reserved-capacity.types
   *
   * @default - do not specify compute configuration
   */
  readonly computeConfiguration?: ComputeConfiguration;

  /**
   * The compute fleet overflow behavior.
   *
   * For overflow behavior `QUEUE`, overflow builds need to wait on the existing fleet instances to become available.
   *
   * For overflow behavior `ON_DEMAND`, overflow builds run on CodeBuild on-demand.
   *
   * @default undefined - AWS CodeBuild default behavior is QUEUE
   */
  readonly overflowBehavior?: FleetOverflowBehavior;

  /**
   * Service Role assumed by Fleet instances.
   *
   * This Role is not used by Project builds running on Fleet instances; Project
   * builds assume the `role` on Project instead.
   *
   * @default - A role will be created if any permissions are granted
   */
  readonly role?: iam.IRole;

  /**
   * VPC network to place fleet instance network interfaces.
   *
   * Specify this if the fleet needs to access resources in a VPC.
   *
   * @default - No VPC is specified.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the network interfaces within the VPC.
   *
   * To access AWS services, your fleet needs to be in one of the following types of subnets:
   *
   * 1. Subnets with access to the internet (of type PRIVATE_WITH_EGRESS).
   * 2. Private subnets unconnected to the internet, but with [VPC endpoints](https://docs.aws.amazon.com/codebuild/latest/userguide/use-vpc-endpoints-with-codebuild.html) for the necessary services.
   *
   * If you don't specify a subnet selection, the default behavior is to use PRIVATE_WITH_EGRESS subnets first if they exist,
   * then PRIVATE_WITHOUT_EGRESS, and finally PUBLIC subnets. If your VPC doesn't have PRIVATE_WITH_EGRESS subnets but you need
   * AWS service access, add VPC Endpoints to your private subnets.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html
   *
   * @default - private subnets if available else public subnets
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * What security groups to associate with the fleet's network interfaces.
   * If none are provided, one will be created automatically.
   *
   * Only used if `vpc` is supplied.
   *
   * @default - A security group will be automatically created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * The compute type of the fleet.
 */
export enum MachineType {
  /**
   * General purpose compute type.
   */
  GENERAL = 'GENERAL',
  /**
   * Non-Volatile Memory Express (NVMe) storage optimized compute type.
   */
  NVME = 'NVME',
}

/**
 * The compute configuration for the fleet.
 */
export interface ComputeConfiguration {
  /**
   * When using ATTRIBUTE_BASED, the amount of disk
   * space of the instance type included in your fleet. When using CUSTOM_INSTANCE_TYPE,
   * the additional amount of disk space to provision over the 64GB included by
   * default.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly disk?: Size;

  /**
   * When using ATTRIBUTE_BASED, the machine type of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly machineType?: MachineType;

  /**
   * When using ATTRIBUTE_BASED, the amount of memory of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly memory?: Size;

  /**
   * When using ATTRIBUTE_BASED, the number of vCPUs of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly vCpu?: number;

  /**
   * When using CUSTOM_INSTANCE_TYPE, the EC2 instance type to use for fleet instances.
   *
   * Not all instance types are supported by CodeBuild. If you use a disallowed type, the
   * CloudFormation deployment will fail.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment-reserved-capacity.instance-types
   * @default none
   */
  readonly instanceType?: ec2.InstanceType;
}

/**
 * Represents a Fleet for a reserved capacity CodeBuild project.
 */
export interface IFleet extends IResource, iam.IGrantable, ec2.IConnectable, IFleetRef {
  /**
   * The ARN of the fleet.
   * @attribute
   */
  readonly fleetArn: string;

  /**
   * The name of the fleet.
   * @attribute
   */
  readonly fleetName: string;

  /**
   * The compute type of the fleet.
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild.ComputeType.html
   */
  readonly computeType: FleetComputeType;

  /**
   * The build environment (operating system/architecture/accelerator) type
   * made available to projects using this fleet
   */
  readonly environmentType: EnvironmentType;
}

/**
 * Fleet for a reserved capacity CodeBuild project.
 *
 * Fleets allow for process builds or tests to run immediately and reduces build durations,
 * by reserving compute resources for your projects.
 *
 * You will be charged for the resources in the fleet, even if they are idle.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html
 */
@propertyInjectable
export class Fleet extends Resource implements IFleet {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codebuild.Fleet';

  /**
   * Creates a Fleet construct that represents an external fleet.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param fleetArn The ARN of the fleet.
   */
  public static fromFleetArn(scope: Construct, id: string, fleetArn: string): IFleet {
    class Import extends Resource implements IFleet {
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });
      public readonly fleetName = Arn.split(fleetArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!.split(':')[0];
      public readonly fleetArn = fleetArn;

      public get fleetRef(): FleetReference {
        return {
          fleetArn: this.fleetArn,
        };
      }

      public get computeType(): FleetComputeType {
        throw new UnscopedValidationError('Cannot retrieve computeType property from an imported Fleet');
      }
      public get environmentType(): EnvironmentType {
        throw new UnscopedValidationError('Cannot retrieve environmentType property from an imported Fleet');
      }
      public get computeConfiguration(): ComputeConfiguration | undefined {
        throw new UnscopedValidationError('Cannot retrieve computeConfiguration property from an imported Fleet');
      }
      public get connections(): ec2.Connections {
        throw new UnscopedValidationError('Cannot retrieve connections property from an imported Fleet');
      }
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of the fleet.
   */
  @memoizedGetter
  get fleetArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'codebuild',
      resource: 'fleet',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * The name of the fleet.
   */
  @memoizedGetter
  get fleetName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  /**
   * The compute type of the fleet.
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild.ComputeType.html
   */
  public readonly computeType: FleetComputeType;

  /**
   * The build environment (operating system/architecture/accelerator) type
   * made available to projects using this fleet
   */
  public readonly environmentType: EnvironmentType;

  public get fleetRef(): FleetReference {
    return {
      fleetArn: this.fleetArn,
    };
  }

  // Lazily created connections. Only created if `vpc` is provided in props.
  private _connections?: ec2.Connections;
  private readonly resource: CfnFleet;

  /**
   * The network connections associated with this Fleet's security group(s) in
   * the configured VPC.
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new ValidationError('Only VPC-associated Fleets have security groups to manage. Supply the "vpc" parameter when creating the Fleet', this);
    }
    return this._connections;
  }

  // Lazily created service role. Only created if `grantPrincipal` is accessed,
  // to maintain compatibility with previous behavior - the `fleetServiceRole`
  // on the L1 construct is optional.
  private role: iam.IRole | undefined;

  /**
   * The grant principal for this Fleet's service role.
   */
  public get grantPrincipal(): iam.IPrincipal {
    if (!this.role) {
      this.role = new iam.Role(this, 'Role', {
        roleName: PhysicalName.GENERATE_IF_NEEDED,
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      });
    }
    return this.role;
  }

  constructor(scope: Construct, id: string, props: FleetProps) {
    super(scope, id, { ...props, physicalName: props.fleetName });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.role = props.role;

    if (props.fleetName && !Token.isUnresolved(props.fleetName)) {
      if (props.fleetName.length < 2) {
        throw new ValidationError(`Fleet name can not be shorter than 2 characters but has ${props.fleetName.length} characters.`, this);
      }
      if (props.fleetName.length > 128) {
        throw new ValidationError(`Fleet name can not be longer than 128 characters but has ${props.fleetName.length} characters.`, this);
      }
    }

    if ((props.baseCapacity ?? 1) < 1) {
      throw new ValidationError('baseCapacity must be greater than or equal to 1', this);
    }

    let computeConfiguration: CfnFleet.ComputeConfigurationProperty | undefined;
    if (
      props.computeType === FleetComputeType.ATTRIBUTE_BASED
    ) {
      if (!props.computeConfiguration ||
        !(props.computeConfiguration.disk ||
          props.computeConfiguration.machineType ||
          props.computeConfiguration.memory ||
          props.computeConfiguration.vCpu !== undefined)) {
        throw new ValidationError('At least one compute configuration criteria must be specified if computeType is ATTRIBUTE_BASED', this);
      } else if (props.computeConfiguration?.instanceType) {
        throw new ValidationError('instanceType can only be specified in computeConfiguration if computeType is CUSTOM_INSTANCE_TYPE', this);
      }

      // Despite what the CloudFormation schema says, the numeric properties are not optional.
      // An undefined value will cause the CloudFormation deployment to fail, e.g.
      // > Cannot invoke "java.lang.Integer.intValue()" because the return value of "software.amazon.codebuild.fleet.ComputeConfiguration.getMemory()" is null
      const computeConfig = props.computeConfiguration;
      const diskGiB = computeConfig?.disk?.toGibibytes() ?? 0;
      const memoryGiB = computeConfig?.memory?.toGibibytes() ?? 0;
      const vCpu = computeConfig?.vCpu ?? 0;
      this.validatePositiveInteger(diskGiB, 'disk size');
      this.validatePositiveInteger(memoryGiB, 'memory size');
      this.validatePositiveInteger(vCpu, 'vCPU count');

      computeConfiguration = {
        disk: diskGiB,
        machineType: computeConfig.machineType,
        memory: memoryGiB,
        vCpu,
      };
    } else if (props.computeType === FleetComputeType.CUSTOM_INSTANCE_TYPE) {
      if (!props.computeConfiguration?.instanceType) {
        throw new ValidationError('instanceType must be specified in computeConfiguration if computeType is CUSTOM_INSTANCE_TYPE', this);
      } else if (props.computeConfiguration.machineType || props.computeConfiguration.memory || props.computeConfiguration.vCpu) {
        throw new ValidationError('computeConfiguration attributes can only be used if computeType is ATTRIBUTE_BASED', this);
      }
      const diskGiB = props.computeConfiguration.disk?.toGibibytes();
      this.validatePositiveInteger(diskGiB, 'disk size');

      computeConfiguration = {
        disk: diskGiB,
        instanceType: props.computeConfiguration.instanceType.toString(),
      };
    } else if (props.computeConfiguration) {
      throw new ValidationError(`computeConfiguration can only be specified if computeType is ATTRIBUTE_BASED or CUSTOM_INSTANCE_TYPE, got: ${props.computeType}`, this);
    }

    const vpcConfiguration = this.configureVpc(props);
    const resource = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
      environmentType: props.environmentType,
      overflowBehavior: props.overflowBehavior,
      computeConfiguration,
      fleetVpcConfig: vpcConfiguration?.fleetVpcConfig,
      fleetServiceRole: this.role?.roleArn,
    });

    if (vpcConfiguration) {
      // We need to explicitly attach these dependencies as the CfnFleet tries
      // to create network interfaces as a part of creation, if there is a VPC
      // config.
      resource.node.addDependency(...vpcConfiguration.policyDependables);
    }
    if (props.vpc) {
      // Similarly, we should not try to create the fleet until all the
      // resources created by the VPC are created. Otherwise fleet instances may
      // fail to initialize because they can't talk to any AWS APIs.
      resource.node.addDependency(...props.vpc.node.findAll());
    }

    this.resource = resource;
    this.computeType = props.computeType;
    this.environmentType = props.environmentType;
  }

  private validatePositiveInteger(value: number | undefined, fieldName: string) {
    if (value !== undefined && !Token.isUnresolved(value) && (value < 0 || !Number.isInteger(value))) {
      throw new ValidationError(`${fieldName} must be a positive integer, got: ${value}`, this);
    }
  }

  private configureVpc(props: FleetProps): { fleetVpcConfig: CfnFleet.VpcConfigProperty; policyDependables: Array<IDependable> } | undefined {
    if (props.securityGroups && !props.vpc) {
      throw new ValidationError('Cannot configure securityGroups without configuring a VPC', this);
    } else if (props.subnetSelection && !props.vpc) {
      throw new ValidationError('Cannot configure subnetSelection without configuring a VPC', this);
    } else if (!props.vpc) {
      return undefined;
    }

    let securityGroups: ec2.ISecurityGroup[];
    if (props.securityGroups && props.securityGroups.length > 0) {
      securityGroups = props.securityGroups;
    } else {
      const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
      });
      securityGroups = [securityGroup];
    }
    this._connections = new ec2.Connections({ securityGroups });

    // Grant permissions necessary to manage network interfaces within the
    // user's VPC. Notably, the reserved EC2 instances are in a managed AWS
    // account, so this is a kind of cross-account permissions grant that needs
    // `ec2:CreateNetworkInterfacePermission`.
    // https://docs.aws.amazon.com/codebuild/latest/userguide/auth-and-access-control-iam-identity-based-access-control.html#customer-managed-policies-example-create-vpc-network-interface
    const { subnetIds } = props.vpc.selectSubnets(props.subnetSelection);
    const networkInterfaceArn = Arn.format({ service: 'ec2', resource: 'network-interface', resourceName: '*' }, this.stack);
    const subnetArns = subnetIds.map((subnetId) =>
      Arn.format({ service: 'ec2', resource: 'subnet', resourceName: subnetId }, this.stack),
    );
    const policyDependables: Array<IDependable> = [];
    let addResult = this.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['ec2:CreateNetworkInterfacePermission'],
      resources: [networkInterfaceArn],
      conditions: {
        // The docs linked above suggest this should work, but somehow it does
        // not. It is singlehandedly what makes integ tests fail with:
        // > The fleet service role is not authorized to perform ec2:CreateNetworkInterfacePermission
        //
        // We are not the only ones experiencing this problem:
        // https://github.com/aws-cloudformation/cloudformation-coverage-roadmap/issues/2047#issuecomment-2134558258
        //
        // StringEquals: {
        //   'ec2:AuthorizedService': 'codebuild.amazonaws.com',
        // },
        ArnEquals: {
          'ec2:Subnet': subnetArns,
        },
      },
    }));
    if (addResult.policyDependable) {
      policyDependables.push(addResult.policyDependable);
    }
    addResult = this.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'ec2:DescribeDhcpOptions',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DescribeSecurityGroups',
        'ec2:DescribeSubnets',
        'ec2:DescribeVpcs',
        // The documentation here:
        // https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonec2.html
        // suggests that we should be able to use various conditions/resources
        // to restrict these three actions to the appropriate subnets and/or
        // security groups, however they practically do not work - you get
        // errors at deployment time or later saying that the fleet's service
        // role lacks permissions to do these actions. I think it might be
        // because this is a cross-account grant into an AWS-managed account.
        // The `ec2:CreateNetworkInterfacePermission` grant above is the only
        // practical restriction we seem to be able to do.
        'ec2:CreateNetworkInterface',
        'ec2:DeleteNetworkInterface',
        'ec2:ModifyNetworkInterfaceAttribute',
      ],
      resources: ['*'],
    }));
    if (addResult.policyDependable) {
      policyDependables.push(addResult.policyDependable);
    }

    return {
      fleetVpcConfig: {
        vpcId: props.vpc.vpcId,
        subnets: subnetIds,
        securityGroupIds: securityGroups.map((s) => s.securityGroupId),
      },
      policyDependables,
    };
  }
}

/**
 * Fleet build machine compute type. Subset of Fleet compatible ComputeType values.
 *
 * The allocated memory, vCPU count and disk space of the build machine for a
 * given compute type are dependent on the environment type.
 * Some compute types may also not be available for all environment types.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
 */
export enum FleetComputeType {
  /**
   * Small compute type
   *
   * May not be available for all environment types.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  SMALL = ComputeType.SMALL,
  /**
   * Medium compute type
   *
   * May not be available for all environment types.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  MEDIUM = ComputeType.MEDIUM,
  /** Large compute type */
  LARGE = ComputeType.LARGE,
  /**
   * Extra Large compute type
   *
   * May not be available for all environment types.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  X_LARGE = ComputeType.X_LARGE,
  /**
   * Extra, Extra Large compute type
   *
   * May not be available for all environment types.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  X2_LARGE = ComputeType.X2_LARGE,

  /**
   * Specify the amount of vCPUs, memory, disk space, and the type of machine.
   *
   * AWS CodeBuild will select the cheapest instance that satisfies your specified attributes from `computeConfiguration`.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment-reserved-capacity.types
   */
  ATTRIBUTE_BASED = ComputeType.ATTRIBUTE_BASED,

  /**
   * Specify a specific EC2 instance type to use for compute.
   *
   * You must set `instanceType` on `computeConfiguration`, and optionally set a
   * `disk` size if the provided 64GB is insufficient.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment-reserved-capacity.instance-types
   */
  CUSTOM_INSTANCE_TYPE = ComputeType.CUSTOM_INSTANCE_TYPE,
}

/**
 * The compute fleet overflow behavior.
 */
export enum FleetOverflowBehavior {
  /**
   * Overflow builds wait for existing fleet instances to become available.
   */
  QUEUE = 'QUEUE',

  /**
   * Overflow builds run on CodeBuild on-demand instances.
   */
  ON_DEMAND = 'ON_DEMAND',
}
