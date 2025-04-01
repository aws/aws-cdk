import { Construct } from 'constructs';
import { CfnFleet } from './codebuild.generated';
import { ComputeType } from './compute-type';
import { EnvironmentType } from './environment-type';
import { Arn, ArnFormat, IResource, Resource, Size, Token, UnscopedValidationError, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * Construction properties of a CodeBuild {@link Fleet}.
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
   * This is only required if `computeType` is set to ATTRIBUTE_BASED.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment-reserved-capacity.types
   *
   * @default - do not specify compute configuration
   */
  readonly computeConfiguration?: ComputeConfiguration;
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
 *
 *  Despite what the CloudFormation schema says, the numeric properties (disk, memory, vCpu) are not optional.
 *  An `undefined` value will cause the CloudFormation deployment to fail, e.g.
 *  > Cannot invoke "java.lang.Integer.intValue()" because the return value of "software.amazon.codebuild.fleet.ComputeConfiguration.getMemory()" is null
 * Therefore, these properties default value is set to 0.
 */
export interface ComputeConfiguration {
  /**
   * The amount of disk space of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly disk?: Size;

  /**
   * The machine type of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly machineType?: MachineType;

  /**
   * The amount of memory of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly memory?: Size;

  /**
   * The number of vCPUs of the instance type included in your fleet.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly vCpu?: number;
}

/**
 * Represents a {@link Fleet} for a reserved capacity CodeBuild project.
 */
export interface IFleet extends IResource {
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
export class Fleet extends Resource implements IFleet {
  /**
   * Creates a Fleet construct that represents an external fleet.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param fleetArn The ARN of the fleet.
   */
  public static fromFleetArn(scope: Construct, id: string, fleetArn: string): IFleet {
    class Import extends Resource implements IFleet {
      public readonly fleetName = Arn.split(fleetArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!.split(':')[0];
      public readonly fleetArn = fleetArn;

      public get computeType(): FleetComputeType {
        throw new UnscopedValidationError('Cannot retrieve computeType property from an imported Fleet');
      }
      public get environmentType(): EnvironmentType {
        throw new UnscopedValidationError('Cannot retrieve environmentType property from an imported Fleet');
      }
      public get computeConfiguration(): ComputeConfiguration | undefined {
        throw new UnscopedValidationError('Cannot retrieve computeConfiguration property from an imported Fleet');
      }
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of the fleet.
   */
  public readonly fleetArn: string;

  /**
   * The name of the fleet.
   */
  public readonly fleetName: string;

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

  constructor(scope: Construct, id: string, props: FleetProps) {
    super(scope, id, { ...props, physicalName: props.fleetName });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

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

    if (
      props.computeType === FleetComputeType.ATTRIBUTE_BASED &&
      (!props.computeConfiguration || Object.keys(props.computeConfiguration).length === 0)
    ) {
      throw new ValidationError('At least one compute configuration criteria must be specified if computeType is "ATTRIBUTE_BASED"', this);
    }
    if (props.computeConfiguration && props.computeType !== FleetComputeType.ATTRIBUTE_BASED) {
      throw new ValidationError(`'computeConfiguration' can only be specified if 'computeType' is 'ATTRIBUTE_BASED', got: ${props.computeType}`, this);
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

    const resource = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
      environmentType: props.environmentType,
      computeConfiguration: props.computeConfiguration ? {
        disk: diskGiB,
        machineType: props.computeConfiguration.machineType,
        memory: memoryGiB,
        vCpu,
      } : undefined,
    });

    this.fleetArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'codebuild',
      resource: 'fleet',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
    this.fleetName = this.getResourceNameAttribute(resource.ref);
    this.computeType = props.computeType;
    this.environmentType = props.environmentType;
  }

  private validatePositiveInteger(value: number, fieldName: string) {
    if (!Token.isUnresolved(value) && (value < 0 || !Number.isInteger(value))) {
      throw new ValidationError(`${fieldName} must be a positive integer, got: ${value}`, this);
    }
  }
}

/**
 * Fleet build machine compute type. Subset of Fleet compatible {@link ComputeType} values.
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
   * May not be available for all environment types, see
   * {@link https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types docs}
   * for more information.
   */
  SMALL = ComputeType.SMALL,
  /**
   * Medium compute type
   *
   * May not be available for all environment types, see
   * {@link https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types docs}
   * for more information.
   **/
  MEDIUM = ComputeType.MEDIUM,
  /** Large compute type */
  LARGE = ComputeType.LARGE,
  /**
   * Extra Large compute type
   *
   * May not be available for all environment types, see
   * {@link https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types docs}
   * for more information.
   **/
  X_LARGE = ComputeType.X_LARGE,
  /**
   * Extra, Extra Large compute type
   *
   * May not be available for all environment types, see
   * {@link https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types docs}
   * for more information.
   **/
  X2_LARGE = ComputeType.X2_LARGE,

  /**
   * Specify the amount of vCPUs, memory, disk space, and the type of machine.
   *
   * AWS CodeBuild will select the cheapest instance that satisfies your specified attributes from `computeConfiguration`.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment-reserved-capacity.types
   */
  ATTRIBUTE_BASED = ComputeType.ATTRIBUTE_BASED,
}
