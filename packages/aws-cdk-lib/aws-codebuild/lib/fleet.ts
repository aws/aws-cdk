import { Construct } from 'constructs';
import * as ec2 from '../../aws-ec2';
import { Arn, ArnFormat, IResource, Resource, Token } from '../../core';
import { CfnFleet } from './codebuild.generated';
import { ComputeType } from './compute-type';
import { EnvironmentType } from './environment-type';

/**
 * FleetProxyConfiguration helper class
 */
export class FleetProxyConfiguration {
  private readonly _rules: CfnFleet.FleetProxyRuleProperty[] = [];

  /**
   * FleetProxyConfiguration helper constructor.
   * @param defaultBehavior The default behavior for the fleet proxy configuration.
   */
  constructor(public readonly defaultBehavior: FleetProxyDefaultBehavior) {
  }

  /**
   * The proxy configuration for the fleet.
   */
  public get configuration(): CfnFleet.ProxyConfigurationProperty {
    return {
      defaultBehavior: this.defaultBehavior,
      orderedProxyRules: this._rules,
    };
  }

  /**
   * Important: The order of rules is significant. The first rule that matches the traffic is applied.
   *
   * @param effect Whether the rule allows or denies traffic
   * @param ipAddresses IPv4 and IPv6 addresses in CIDR notation
   * @returns the current FleetProxyConfiguration to allow method chaining
   */
  public addIpRule(effect: FleetProxyRuleEffect, ...ipAddresses: string[]): FleetProxyConfiguration {
    this._rules.push({
      effect,
      entities: ipAddresses,
      type: 'IP',
    });

    return this;
  }

  /**
   * Important: The order of rules is significant. The first rule that matches the traffic is applied.
   *
   * @param effect Whether the rule allows or denies traffic
   * @param domains Domain names
   * @returns the current FleetProxyConfiguration to allow method chaining
   */
  public addDomainRule(effect: FleetProxyRuleEffect, ...domains: string[]): FleetProxyConfiguration {
    this._rules.push({
      effect,
      entities: domains,
      type: 'DOMAIN',
    });

    return this;
  }
}

/**
 * TODO
 */
export interface FleetVpcConfiguration {
  /**
   * TODO
   */
  readonly vpc: ec2.IVpc;

  /**
   * TODO
   */
  readonly subnets: ec2.ISubnet[];

  /**
   * TODO
   */
  readonly securityGroups: ec2.ISecurityGroup[];
}

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
   * TODO
   */
  readonly proxyConfiguration?: FleetProxyConfiguration;

  /**
   * TODO
   */
  readonly vpcConfiguration?: FleetVpcConfiguration;
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

  /**
   * TODO
   */
  readonly proxyConfiguration?: FleetProxyConfiguration;

  /**
   * TODO
   */
  readonly vpcConfiguration?: FleetVpcConfiguration;
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

    if (props.proxyConfiguration) {
      if (![EnvironmentType.LINUX_CONTAINER, EnvironmentType.LINUX_GPU_CONTAINER].includes(props.environmentType)) {
        throw new Error('proxyConfiguration can only be used if environmentType is "LINUX_CONTAINER" or "LINUX_GPU_CONTAINER"');
      }

      if (props.vpcConfiguration) {
        throw new Error('proxyConfiguration and vpcConfiguration cannot be used concurrently');
      }
    }

    super(scope, id, { physicalName: props.fleetName });

    let fleetVpcConfig: CfnFleet.VpcConfigProperty | undefined;
    if (props.vpcConfiguration) {
      const { vpc, subnets, securityGroups } = props.vpcConfiguration;
      if (!Token.isUnresolved(vpc.stack.account) && !Token.isUnresolved(this.stack.account) &&
        vpc.stack.account !== this.stack.account) {
        throw new Error('VPC must be in the same account as its associated fleet');
      }

      fleetVpcConfig = {
        vpcId: vpc.vpcId,
        subnets: subnets.map(({ subnetId }) => subnetId),
        securityGroupIds: securityGroups.map(({ securityGroupId }) => securityGroupId),
      };
    }

    const resource = new CfnFleet(this, 'Resource', {
      name: props.fleetName,
      baseCapacity: props.baseCapacity,
      computeType: props.computeType,
      environmentType: props.environmentType,
      fleetProxyConfiguration: props.proxyConfiguration?.configuration,
      fleetVpcConfig,
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

/**
 * TODO
 */
export enum FleetProxyDefaultBehavior {
  /**
   * TODO
   */
  ALLOW_ALL = 'ALLOW_ALL',
  /**
   * TODO
   */
  DENY_ALL = 'DENY_ALL',
}

/**
 * TODO
 */
export enum FleetProxyRuleEffect {
  /**
   * TODO
   */
  ALLOW = 'ALLOW',
  /**
   * TODO
   */
  DENY = 'DENY',
}
