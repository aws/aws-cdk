import type { Construct, IDependable } from 'constructs';
import { CfnFleet } from './codebuild.generated';
import { ComputeType } from './compute-type';
import { EnvironmentType } from './environment-type';
import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import type { IResource, Size } from '../../core';
import { Annotations, Arn, ArnFormat, PhysicalName, Resource, Token, UnscopedValidationError, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
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
   * Reserved capacity fleets support only one subnet in a single Availability Zone.
   * If the subnet selection resolves to multiple subnets, the construct uses the
   * first subnet and emits a warning.
   *
   * Cannot be combined with `proxyConfiguration`.
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
   * Reserved capacity fleets support only one subnet in a single Availability Zone.
   * If the selection resolves to multiple subnets, the construct uses the first
   * subnet and emits the warning `@aws-cdk/aws-codebuild:fleetSubnetAutoNarrowed`.
   * If you pin the subnet with an L1 override of `FleetVpcConfig.Subnets`, suppress it with
   * `Annotations.of(fleet).acknowledgeWarning('@aws-cdk/aws-codebuild:fleetSubnetAutoNarrowed')`.
   * The `ec2:CreateNetworkInterfacePermission` grant still covers all selected subnets,
   * so select a single subnet for the narrowest grant.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/vpc-support.html
   *
   * @default - first subnet from private subnets if available, else public subnets
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

  /**
   * The image for the compute fleet instances.
   *
   * Only supported for EC2-based environment types
   * (LINUX_EC2, ARM_EC2, WINDOWS_EC2, MAC_ARM).
   *
   * For a custom AMI, the fleet service role is granted
   * `ec2:DescribeImages` and `ec2:DescribeSnapshots`. A role is created
   * if `role` is not specified.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.custom-ami
   *
   * @default - CodeBuild uses the default image for the environment type
   */
  readonly image?: FleetImage;

  /**
   * The scaling configuration of the compute fleet.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.reserved-capacity-fleets.html
   * @default - no auto-scaling, fleet uses fixed baseCapacity
   */
  readonly scalingConfiguration?: FleetScalingConfiguration;

  /**
   * Proxy configuration that applies network access control to reserved
   * capacity fleet instances.
   *
   * Only supported for Linux container environment types (LINUX_CONTAINER,
   * ARM_CONTAINER, LINUX_GPU_CONTAINER). Not supported for Windows containers,
   * EC2-based environment types, or fleets placed in a VPC.
   *
   * Cannot be combined with `vpc`.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/run-codebuild-in-managed-proxy-server.html
   * @default - no proxy configuration
   */
  readonly proxyConfiguration?: FleetProxyConfiguration;
}

/**
 * The scaling type for a fleet.
 */
export enum FleetScalingType {
  /**
   * Target tracking scaling.
   */
  TARGET_TRACKING_SCALING = 'TARGET_TRACKING_SCALING',
}

/**
 * The metric type used for target tracking scaling.
 */
export enum FleetScalingMetricType {
  /**
   * Fleet utilization rate.
   */
  FLEET_UTILIZATION_RATE = 'FLEET_UTILIZATION_RATE',
}

/**
 * A target tracking scaling configuration for a fleet.
 */
export interface FleetTargetTrackingScalingConfiguration {
  /**
   * The metric type to track.
   */
  readonly metricType: FleetScalingMetricType;

  /**
   * The target value for the metric.
   *
   * Must be between 0 and 100 (inclusive).
   */
  readonly targetValue: number;
}

/**
 * The scaling configuration for a fleet.
 */
export interface FleetScalingConfiguration {
  /**
   * The maximum number of instances in the fleet when auto-scaling.
   *
   * Must be at least 1 and greater than or equal to `baseCapacity`.
   */
  readonly maxCapacity: number;

  /**
   * The scaling type.
   *
   * @default FleetScalingType.TARGET_TRACKING_SCALING
   */
  readonly scalingType?: FleetScalingType;

  /**
   * A list of target tracking scaling configurations.
   *
   * Must contain at least one entry when `scalingType` is `TARGET_TRACKING_SCALING`.
   */
  readonly targetTrackingScalingConfigs: FleetTargetTrackingScalingConfiguration[];
}

/**
 * The default behavior for a fleet proxy when no ordered proxy rules match.
 *
 * This controls what happens to traffic that does not match any of the
 * `orderedProxyRules` in the proxy configuration.
 */
export enum FleetProxyRuleBehavior {
  /**
   * Allow all traffic that does not match any proxy rule.
   */
  ALLOW_ALL = 'ALLOW_ALL',

  /**
   * Deny all traffic that does not match any proxy rule.
   */
  DENY_ALL = 'DENY_ALL',
}

/**
 * The effect of an individual fleet proxy rule.
 *
 * This controls whether traffic matching a specific rule is allowed or denied.
 * Rules are evaluated in order; the first matching rule's effect is applied.
 */
export enum FleetProxyRuleEffect {
  /**
   * Allow traffic matching this rule.
   */
  ALLOW = 'ALLOW',

  /**
   * Deny traffic matching this rule.
   */
  DENY = 'DENY',
}

/**
 * The type of a fleet proxy rule.
 */
export enum FleetProxyRuleType {
  /**
   * Match by domain name.
   */
  DOMAIN = 'DOMAIN',

  /**
   * Match by IP address or CIDR.
   */
  IP = 'IP',
}

/**
 * A proxy rule for a fleet.
 */
export interface FleetProxyRule {
  /**
   * The effect of this rule.
   */
  readonly effect: FleetProxyRuleEffect;

  /**
   * The entities to match (domains or IPs).
   *
   * Must contain at least one entity.
   */
  readonly entities: string[];

  /**
   * The type of rule.
   */
  readonly type: FleetProxyRuleType;
}

/**
 * Proxy configuration for a fleet.
 */
export interface FleetProxyConfiguration {
  /**
   * The default behavior when no proxy rules match.
   */
  readonly defaultBehavior: FleetProxyRuleBehavior;

  /**
   * An ordered list of proxy rules.
   *
   * @default - no proxy rules
   */
  readonly orderedProxyRules?: FleetProxyRule[];
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
 * @stateless
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
        throw new UnscopedValidationError(lit`CannotRetrieveComputeTypeProperty`, 'Cannot retrieve computeType property from an imported Fleet');
      }
      public get environmentType(): EnvironmentType {
        throw new UnscopedValidationError(lit`CannotRetrieveEnvironmentTypeProperty`, 'Cannot retrieve environmentType property from an imported Fleet');
      }
      public get computeConfiguration(): ComputeConfiguration | undefined {
        throw new UnscopedValidationError(lit`CannotRetrieveComputeConfigurationProperty`, 'Cannot retrieve computeConfiguration property from an imported Fleet');
      }
      public get connections(): ec2.Connections {
        throw new UnscopedValidationError(lit`CannotRetrieveConnectionsPropertyImported`, 'Cannot retrieve connections property from an imported Fleet');
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
      throw new ValidationError(lit`OnlyVpcAssociatedFleetsSecurity`, 'Only VPC-associated Fleets have security groups to manage. Supply the "vpc" parameter when creating the Fleet', this);
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
        throw new ValidationError(lit`FleetNameShorterCharacters`, `Fleet name can not be shorter than 2 characters but has ${props.fleetName.length} characters.`, this);
      }
      if (props.fleetName.length > 128) {
        throw new ValidationError(lit`FleetNameLongerCharacters`, `Fleet name can not be longer than 128 characters but has ${props.fleetName.length} characters.`, this);
      }
    }

    if (!Token.isUnresolved(props.baseCapacity) && (props.baseCapacity ?? 1) < 1) {
      throw new ValidationError(lit`BaseCapacityGreaterEqual`, 'baseCapacity must be greater than or equal to 1', this);
    }

    const ec2EnvironmentTypes = [
      EnvironmentType.LINUX_EC2,
      EnvironmentType.ARM_EC2,
      EnvironmentType.WINDOWS_EC2,
      EnvironmentType.MAC_ARM,
    ];
    if (props.image !== undefined && !ec2EnvironmentTypes.includes(props.environmentType)) {
      throw new ValidationError(
        lit`ImageRequiresEc2Environment`,
        `image is only supported for EC2-based environment types (LINUX_EC2, ARM_EC2, WINDOWS_EC2, MAC_ARM), got: ${props.environmentType}`,
        this,
      );
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
        throw new ValidationError(lit`LeastOneComputeConfigurationCriteria`, 'At least one compute configuration criteria must be specified if computeType is ATTRIBUTE_BASED', this);
      } else if (props.computeConfiguration?.instanceType) {
        throw new ValidationError(lit`InstanceTypeSpecifiedComputeConfiguration`, 'instanceType can only be specified in computeConfiguration if computeType is CUSTOM_INSTANCE_TYPE', this);
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
        throw new ValidationError(lit`InstanceTypeSpecifiedComputeConfiguration`, 'instanceType must be specified in computeConfiguration if computeType is CUSTOM_INSTANCE_TYPE', this);
      } else if (props.computeConfiguration.machineType || props.computeConfiguration.memory || props.computeConfiguration.vCpu) {
        throw new ValidationError(lit`ComputeConfigurationAttributesComputeType`, 'computeConfiguration attributes can only be used if computeType is ATTRIBUTE_BASED', this);
      }
      const diskGiB = props.computeConfiguration.disk?.toGibibytes();
      this.validatePositiveInteger(diskGiB, 'disk size');

      computeConfiguration = {
        disk: diskGiB,
        instanceType: props.computeConfiguration.instanceType.toString(),
      };
    } else if (props.computeConfiguration) {
      throw new ValidationError(lit`ComputeConfigurationSpecifiedComputeType`, `computeConfiguration can only be specified if computeType is ATTRIBUTE_BASED or CUSTOM_INSTANCE_TYPE, got: ${props.computeType}`, this);
    }

    if (props.scalingConfiguration) {
      if (!Token.isUnresolved(props.scalingConfiguration.maxCapacity) && props.scalingConfiguration.maxCapacity < 1) {
        throw new ValidationError(lit`ScalingMaxCapacityGreaterEqual`, 'scalingConfiguration.maxCapacity must be greater than or equal to 1', this);
      }
      if (!Token.isUnresolved(props.scalingConfiguration.maxCapacity)
        && !Token.isUnresolved(props.baseCapacity)
        && props.scalingConfiguration.maxCapacity < props.baseCapacity) {
        throw new ValidationError(lit`ScalingMaxCapacityGreaterEqualBase`, 'scalingConfiguration.maxCapacity must be greater than or equal to baseCapacity', this);
      }
      const effectiveScalingType = props.scalingConfiguration.scalingType ?? FleetScalingType.TARGET_TRACKING_SCALING;
      if (effectiveScalingType === FleetScalingType.TARGET_TRACKING_SCALING
        && !Token.isUnresolved(props.scalingConfiguration.targetTrackingScalingConfigs)
        && props.scalingConfiguration.targetTrackingScalingConfigs.length === 0) {
        throw new ValidationError(lit`TargetTrackingScalingConfigsRequired`, 'At least one targetTrackingScalingConfigs entry is required when scalingType is TARGET_TRACKING_SCALING', this);
      }
      for (const config of props.scalingConfiguration.targetTrackingScalingConfigs) {
        if (!Token.isUnresolved(config.targetValue) && (config.targetValue < 0 || config.targetValue > 100)) {
          throw new ValidationError(lit`TargetValueOutOfRange`, `targetValue must be between 0 and 100 (inclusive), got: ${config.targetValue}`, this);
        }
      }
    }

    if (props.proxyConfiguration) {
      // proxyConfiguration is only supported for Linux container-based environment types.
      // Windows containers and all EC2-based types are not supported.
      // Tested via CFN deploy: service returns "Proxy configuration is not supported for {type}"
      const proxyAllowedEnvironmentTypes = [
        EnvironmentType.LINUX_CONTAINER,
        EnvironmentType.ARM_CONTAINER,
        EnvironmentType.LINUX_GPU_CONTAINER,
      ];
      if (!proxyAllowedEnvironmentTypes.includes(props.environmentType)) {
        throw new ValidationError(
          lit`ProxyConfigurationRequiresLinuxContainer`,
          `proxyConfiguration is only supported for Linux container environment types (LINUX_CONTAINER, ARM_CONTAINER, LINUX_GPU_CONTAINER), got: ${props.environmentType}`,
          this,
        );
      }
      // proxyConfiguration is not supported when VPC is configured.
      // Per AWS docs: "running reserved capacity fleets in a managed proxy server is not supported for VPC"
      // CFN accepts the combination but builds fail at PROVISIONING with CLIENT_ERROR.
      if (props.vpc) {
        throw new ValidationError(
          lit`ProxyConfigurationNotSupportedWithVpc`,
          'proxyConfiguration is not supported when vpc is configured. The managed proxy feature requires fleets to run without VPC.',
          this,
        );
      }
      for (const rule of props.proxyConfiguration.orderedProxyRules ?? []) {
        if (!Token.isUnresolved(rule.entities) && rule.entities.length === 0) {
          throw new ValidationError(lit`ProxyRuleEntitiesRequired`, 'Each proxy rule must have at least one entity', this);
        }
      }
    }

    const vpcConfiguration = this.configureVpc(props);
    const imageConfiguration = this.configureImage(props);
    const resource = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
      environmentType: props.environmentType,
      overflowBehavior: props.overflowBehavior,
      computeConfiguration,
      fleetVpcConfig: vpcConfiguration?.fleetVpcConfig,
      fleetServiceRole: this.role?.roleArn,
      imageId: imageConfiguration?.imageId,
      scalingConfiguration: props.scalingConfiguration ? {
        maxCapacity: props.scalingConfiguration.maxCapacity,
        scalingType: props.scalingConfiguration.scalingType ?? FleetScalingType.TARGET_TRACKING_SCALING,
        // Explicit mapping to pin the shape against future L1 drift
        targetTrackingScalingConfigs: props.scalingConfiguration.targetTrackingScalingConfigs.map(config => ({
          metricType: config.metricType,
          targetValue: config.targetValue,
        })),
      } : undefined,
      fleetProxyConfiguration: props.proxyConfiguration ? {
        defaultBehavior: props.proxyConfiguration.defaultBehavior,
        // Explicit mapping to pin the shape against future L1 drift
        orderedProxyRules: props.proxyConfiguration.orderedProxyRules?.map(rule => ({
          effect: rule.effect,
          entities: rule.entities,
          type: rule.type,
        })),
      } : undefined,
    });

    if (vpcConfiguration) {
      // We need to explicitly attach these dependencies as the CfnFleet tries
      // to create network interfaces as a part of creation, if there is a VPC
      // config.
      resource.node.addDependency(...vpcConfiguration.policyDependables);
    }
    if (imageConfiguration) {
      // The AMI permissions must exist before the fleet launches instances.
      resource.node.addDependency(...imageConfiguration.policyDependables);
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
      throw new ValidationError(lit`MustBePositiveInteger`, `${fieldName} must be a positive integer, got: ${value}`, this);
    }
  }

  private configureImage(props: FleetProps): { imageId: string; policyDependables: Array<IDependable> } | undefined {
    if (!props.image) {
      return undefined;
    }
    const { imageId, isCustomAmi } = props.image._bind(this);
    const policyDependables: Array<IDependable> = [];
    if (isCustomAmi) {
      // https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.custom-ami
      const addResult = this.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
        actions: ['ec2:DescribeImages', 'ec2:DescribeSnapshots'],
        resources: ['*'],
      }));
      if (addResult.policyDependable) {
        policyDependables.push(addResult.policyDependable);
      }
    }
    return { imageId, policyDependables };
  }

  private configureVpc(props: FleetProps): { fleetVpcConfig: CfnFleet.VpcConfigProperty; policyDependables: Array<IDependable> } | undefined {
    if (props.securityGroups && !props.vpc) {
      throw new ValidationError(lit`CannotConfigureSecurityGroupsWithout`, 'Cannot configure securityGroups without configuring a VPC', this);
    } else if (props.subnetSelection && !props.vpc) {
      throw new ValidationError(lit`CannotConfigureSubnetSelectionWithout`, 'Cannot configure subnetSelection without configuring a VPC', this);
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

    // Reserved capacity fleets support only one subnet in a single Availability Zone.
    // https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.reserved-capacity-fleets.html
    //
    // If the selection resolves to multiple subnets, we narrow to the first one and warn
    // instead of throwing, so apps that pin a subnet via an L1 override of
    // FleetVpcConfig.Subnets keep synthesizing.

    const originalSubnets = props.vpc.selectSubnets(props.subnetSelection);
    let selectedSubnets = originalSubnets;

    // Skip narrowing during pending lookup. A tokenized subnet list
    // always has length 1, so the length check already excludes it.
    if (!selectedSubnets.isPendingLookup && selectedSubnets.subnetIds.length > 1) {
      const source = props.subnetSelection === undefined ? 'the default subnet selection' : 'subnetSelection';
      Annotations.of(this).addWarningV2('@aws-cdk/aws-codebuild:fleetSubnetAutoNarrowed',
        `Reserved capacity fleets support only one subnet, but ${source} resolves to ${selectedSubnets.subnetIds.length} subnets; ` +
        `using ${selectedSubnets.subnets[0].node.path}. Pass subnetSelection with a single subnet to suppress this warning.`);
      selectedSubnets = props.vpc.selectSubnets({ subnets: [selectedSubnets.subnets[0]] });
    }

    // FleetVpcConfig.Subnets uses the narrowed selection (one subnet).
    // subnetArns for the IAM condition uses the original selection so existing
    // stacks that override FleetVpcConfig.Subnets on the L1 keep their IAM unchanged.
    const { subnetIds } = selectedSubnets;
    const originalSubnetIds = originalSubnets.subnetIds;
    const networkInterfaceArn = Arn.format({ service: 'ec2', resource: 'network-interface', resourceName: '*' }, this.stack);
    const subnetArns = originalSubnetIds.map((subnetId) =>
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

/**
 * The image used by the instances of a CodeBuild Fleet.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.custom-ami
 */
export class FleetImage {
  /**
   * An image managed by CodeBuild.
   *
   * For a custom AMI, use `fromAmiId` or `fromMachineImage` instead.
   *
   * @param id The CodeBuild image identifier
   * @example 'aws/codebuild/macos-arm-base:26'
   */
  public static fromCodeBuildImageId(id: string): FleetImage {
    if (!Token.isUnresolved(id) && id.startsWith('ami-')) {
      throw new UnscopedValidationError(
        lit`FleetImageAmiIdNotCodeBuildImage`,
        `fromCodeBuildImageId expects a CodeBuild image identifier, got AMI ID ${JSON.stringify(id)}; use FleetImage.fromAmiId() for custom AMIs`,
      );
    }
    return new FleetImage(() => id, false);
  }

  /**
   * A custom AMI.
   *
   * The AMI must:
   * - match the architecture of the fleet's environment type
   *   (MAC_ARM: Mac-Arm, LINUX_EC2 and WINDOWS_EC2: x86_64, ARM_EC2: Arm64)
   * - allow the CodeBuild service Organization ARN of the region
   * - if encrypted with a KMS key, have a key policy that allows the CodeBuild service Organization ID
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.custom-ami
   *
   * @param amiId The AMI ID
   * @example 'ami-0123456789abcdef0'
   */
  public static fromAmiId(amiId: string): FleetImage {
    return new FleetImage(() => amiId, true);
  }

  /**
   * A custom AMI from an EC2 machine image.
   *
   * Only the AMI ID of the machine image is used. Its OS type and user data are ignored.
   *
   * The AMI must:
   * - match the architecture of the fleet's environment type
   *   (MAC_ARM: Mac-Arm, LINUX_EC2 and WINDOWS_EC2: x86_64, ARM_EC2: Arm64)
   * - allow the CodeBuild service Organization ARN of the region
   * - if encrypted with a KMS key, have a key policy that allows the CodeBuild service Organization ID
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.custom-ami
   *
   * @param machineImage The machine image, for example `ec2.MachineImage.latestAmazonLinux2023()`
   */
  public static fromMachineImage(machineImage: ec2.IMachineImage): FleetImage {
    return new FleetImage((scope) => machineImage.getImage(scope).imageId, true);
  }

  private constructor(
    private readonly produceImageId: (scope: Construct) => string,
    private readonly isCustomAmi: boolean,
  ) {}

  /**
   * @internal
   */
  public _bind(scope: Construct): { imageId: string; isCustomAmi: boolean } {
    return { imageId: this.produceImageId(scope), isCustomAmi: this.isCustomAmi };
  }
}
