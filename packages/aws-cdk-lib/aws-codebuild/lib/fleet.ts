import { Construct } from 'constructs';
import { CfnFleet } from './codebuild.generated';
import { Arn, ArnFormat, IResource, Resource, Stack, Token } from '../../core';

/**
 * The properties of a CodeBuild Fleet.
 */
export interface FleetProps {
  /**
   * The name of the Fleet.
   *
   * @default - CloudFormation generated name
   */
  readonly fleetName?: string;

  /**
   * The initial number of machines allocated to the compute ﬂeet.
   * Deﬁnes the number of builds that can run in parallel.
   *
   * Minimum value of 1.
   *
   * @default 1
   */
  readonly baseCapacity?: number;

  /**
   * The instance type of the compute fleet.
   *
   * @default - TODO
   */
  readonly computeType?: FleetComputeType;

  /**
   * The environment type of the fleet.
   *
   * @default - TODO
   */
  readonly environmentType?: FleetEnvironmentType;
}

/**
 * The interface representing a CodeBuild Fleet.
 */
export interface IFleet extends IResource {
  /**
   * The ARN of the fleet
   * @attribute
   */
  readonly fleetArn: string;

  /**
   * The name of the fleet
   * @attribute
   */
  readonly fleetName: string;
}

/**
 * The CodeBuild Fleet.
 */
export class Fleet extends Resource implements IFleet {
  /**
   * Creates a Fleet construct that represents an external fleet.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param fleetArn arn of external fleet.
   */
  public static fromFleetArn(scope: Construct, id: string, fleetArn: string): IFleet {
    class Import extends Resource implements IFleet {
      public readonly fleetName = Arn.extractResourceName(fleetArn, 'fleet');
      public readonly fleetArn = fleetArn;
    }

    return new Import(scope, id);
  }

  /**
   * Creates a Fleet construct that represents an external fleet.
   *
   * @param scope The scope creating construct (usually `this`).
   * @param id The construct's id.
   * @param fleetName name of external fleet.
   */
  public static fromFleetName(scope: Construct, id: string, fleetName: string): IFleet {
    class Import extends Resource implements IFleet {
      public readonly fleetName = fleetName;
      public readonly fleetArn = Fleet.buildFleetArn(scope, fleetName);
    }

    return new Import(scope, id);
  }

  // TODO see Alias.fromAliasAttributes

  private static buildFleetArn(scope: Construct, fleetName: string) : string {
    return Stack.of(scope).formatArn({
      service: 'codebuild',
      resource: 'fleet',
      resourceName: fleetName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  /**
   * The ARN of the fleet
   */
  public readonly fleetArn: string;

  /**
   * The name of the fleet
   */
  public readonly fleetName: string;

  constructor(scope: Construct, id: string, props: FleetProps = {}) {
    super(scope, id, {
      physicalName: props.fleetName,
    });

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

    const { ref } = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
      environmentType: props.environmentType,
    });

    const resourceName = this.getResourceNameAttribute(ref);
    this.fleetArn = Fleet.buildFleetArn(this, resourceName);
    this.fleetName = resourceName;
  }
}

/**
 * The environment type of the fleet
 */
export enum FleetEnvironmentType {
  /**
   * ARM container environment
   */
  ARM_CONTAINER = 'ARM_CONTAINER',

  /**
   * Linux container environment
   */
  LINUX_CONTAINER = 'LINUX_CONTAINER',

  /**
   * Linux GPU container environment
   */
  LINUX_GPU_CONTAINER = 'LINUX_GPU_CONTAINER',

  /**
   * Windows Server 2019 container environment
   */
  WINDOWS_SERVER_2019_CONTAINER = 'WINDOWS_SERVER_2019_CONTAINER',

  /**
   * Windows Server 2022 container environment
   */
  WINDOWS_SERVER_2022_CONTAINER = 'WINDOWS_SERVER_2022_CONTAINER',
}

/**
 * Build machine compute type.
 */
export enum FleetComputeType {
  /**
   * TODO
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  SMALL = 'BUILD_GENERAL1_SMALL',

  /**
   * TODO
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  MEDIUM = 'BUILD_GENERAL1_MEDIUM',

  /**
   * TODO
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  LARGE = 'BUILD_GENERAL1_LARGE',

  /**
   * TODO
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  X_LARGE = 'BUILD_GENERAL1_XLARGE',

  /**
   * TODO
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-compute-types.html#environment.types
   */
  X2_LARGE = 'BUILD_GENERAL1_2XLARGE',

}
