import { Construct } from 'constructs';
import { CfnFleet } from './codebuild.generated';
import { ComputeType } from './compute-type';
import { EnvironmentType } from './environment-type';
import { Arn, ArnFormat, IResource, Resource, Token } from '../../core';
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
        throw new Error('Cannot retrieve computeType property from an imported Fleet');
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

    super(scope, id, { physicalName: props.fleetName });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
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
}
