import { Construct } from 'constructs';
import { CfnFleet } from './codebuild.generated';
import { ComputeType } from './compute-type';
import { EnvironmentType } from './environment-type';
import { Arn, ArnFormat, IResource, Resource, Token } from '../../core';

/**
 * Set of custom requirements that will be used to select the fleet's instance type.
 * CodeBuild will select the cheapest instance that matches all given requirements.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.attribute-compute
 */
export interface FleetComputeConfiguration {
  /**
   * The machine type of the compute fleet, including general usage or I/O optimized.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly machineType?: FleetComputeConfigurationMachineType;

  /**
   * The minimum amount of disk space (in GiB) to be allocated to the selected instance type.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly disk?: number;

  /**
   * The minimum amount of memory (in GiB) to be allocated to the selected instance type.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly memory?: number;

  /**
   * The minimum number of vCPUs to be allocated to the selected instance type.
   *
   * @default - No requirement, the actual value will be based on the other selected configuration properties
   */
  readonly vCpu?: number;
}

// Despite what the CloudFormation schema says, the numeric properties are not optional.
// An undefined value will cause the CloudFormation deployment to fail, e.g.
// > Cannot invoke "java.lang.Integer.intValue()" because the return value of "software.amazon.codebuild.fleet.ComputeConfiguration.getMemory()" is null
const DEFAULT_FLEET_COMPUTE_CONFIGURATION: FleetComputeConfiguration = {
  disk: 0, memory: 0, vCpu: 0,
};

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
   * Set of custom requirements that will be used to select the fleet's instance type.
   * CodeBuild will select the cheapest instance that matches all given requirements.
   *
   * May only and must be used if the {@link computeType} is {@link FleetComputeType.ATTRIBUTE_BASED}.
   *
   * @default - No custom requirements, only the {@link computeType} will be considered.
   */
  readonly computeConfiguration?: FleetComputeConfiguration;

  /**
   * The build environment (operating system/architecture/accelerator) type
   * made available to projects using this fleet
   */
  readonly environmentType: EnvironmentType;
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
   * Set of custom requirements that will be used to select the fleet's instance type.
   * CodeBuild will select the cheapest instance that matches all given requirements.
   *
   * May only and must be used if the {@link computeType} is {@link FleetComputeType.ATTRIBUTE_BASED}.
   *
   * @default - No custom requirements, only the {@link computeType} will be considered.
   */
  readonly computeConfiguration?: FleetComputeConfiguration;

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
        throw new Error('Cannot retrieve computeType property from an imported Fleet');
      }
      public get computeConfiguration(): FleetComputeConfiguration | undefined {
        throw new Error('Cannot retrieve computeConfiguration property from an imported Fleet');
      }
      public get environmentType(): EnvironmentType {
        throw new Error('Cannot retrieve environmentType property from an imported Fleet');
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
    if (props.fleetName && !Token.isUnresolved(props.fleetName)) {
      if (props.fleetName.length < 2) {
        throw new Error(`Fleet name can not be shorter than 2 characters but has ${props.fleetName.length} characters.`);
      }
      if (props.fleetName.length > 128) {
        throw new Error(`Fleet name can not be longer than 128 characters but has ${props.fleetName.length} characters.`);
      }
    }

    if ((props.baseCapacity ?? 1) < 1) {
      throw new Error('baseCapacity must be greater than or equal to 1');
    }

    if (props.computeConfiguration && props.computeType !== FleetComputeType.ATTRIBUTE_BASED) {
      throw new Error('computeConfiguration can only be specified if computeType is "ATTRIBUTE_BASED"');
    }

    if (props.computeType === FleetComputeType.ATTRIBUTE_BASED &&
      (!props.computeConfiguration || Object.keys(props.computeConfiguration).length === 0)) {
      throw new Error('At least one compute configuration criteria must be specified if computeType is "ATTRIBUTE_BASED"');
    }

    super(scope, id, { physicalName: props.fleetName });

    const resource = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
      computeConfiguration: props.computeConfiguration ?
        { ...DEFAULT_FLEET_COMPUTE_CONFIGURATION, ...props.computeConfiguration } :
        undefined,
      environmentType: props.environmentType,
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
   * Customizable compute type. The instance type will be selected based on a given set of attribute requirements.
   * If selected, a {@link FleetComputeConfiguration} must be specified in the fleet properties.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/fleets.html#fleets.attribute-compute
   */
  ATTRIBUTE_BASED = 'ATTRIBUTE_BASED_COMPUTE',
}

/**
 * The machine type of the compute fleet, including general usage or I/O optimized.
 */
export enum FleetComputeConfigurationMachineType {
  /**
   * General usage instance type
   */
  GENERAL = 'GENERAL',
  /**
   * I/O optimized instance type with NVMe SSD storage
   */
  NVME = 'NVME',
}
