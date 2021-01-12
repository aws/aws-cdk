import * as ec2 from '@aws-cdk/aws-ec2';
import { IResource, Lazy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IInstanceEngine } from './instance-engine';
import { CfnOptionGroup } from './rds.generated';

/**
 * An option group
 */
export interface IOptionGroup extends IResource {
  /**
   * The name of the option group.
   *
   * @attribute
   */
  readonly optionGroupName: string;

  /**
   * Adds a configuration to this OptionGroup.
   * This method is a no-op for an imported OptionGroup.
   *
   * @returns true if the OptionConfiguration was successfully added.
   */
  addConfiguration(configuration: OptionConfiguration): boolean;
}

/**
 * Configuration properties for an option.
 */
export interface OptionConfiguration {
  /**
   * The name of the option.
   */
  readonly name: string;

  /**
   * The settings for the option.
   *
   * @default - no settings
   */
  readonly settings?: { [name: string]: string };

  /**
   * The version for the option.
   *
   * @default - no version
   */
  readonly version?: string;

  /**
   * The port number that this option uses. If `port` is specified then `vpc`
   * must also be specified.
   *
   * @default - no port
   */
  readonly port?: number;

  /**
   * The VPC where a security group should be created for this option. If `vpc`
   * is specified then `port` must also be specified.
   *
   * @default - no VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Optional list of security groups to use for this option, if `vpc` is specified.
   * If no groups are provided, a default one will be created.
   *
   * @default - a default group will be created if `port` or `vpc` are specified.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * Construction properties for an OptionGroup.
 */
export interface OptionGroupProps {
  /**
   * The database engine that this option group is associated with.
   */
  readonly engine: IInstanceEngine;

  /**
   * A description of the option group.
   *
   * @default a CDK generated description
   */
  readonly description?: string;

  /**
   * The configurations for this option group.
   */
  readonly configurations: OptionConfiguration[];
}

/**
 * An option group
 */
export class OptionGroup extends Resource implements IOptionGroup {
  /**
   * Import an existing option group.
   */
  public static fromOptionGroupName(scope: Construct, id: string, optionGroupName: string): IOptionGroup {
    class Import extends Resource {
      public readonly optionGroupName = optionGroupName;
      public addConfiguration(_: OptionConfiguration) { return false; }
    }
    return new Import(scope, id);
  }

  /**
   * The name of the option group.
   */
  public readonly optionGroupName: string;

  /**
   * The connections object for the options.
   */
  public readonly optionConnections: { [key: string]: ec2.Connections } = {};

  private readonly configurations: OptionConfiguration[] = [];

  constructor(scope: Construct, id: string, props: OptionGroupProps) {
    super(scope, id);

    const majorEngineVersion = props.engine.engineVersion?.majorVersion;
    if (!majorEngineVersion) {
      throw new Error("OptionGroup cannot be used with an engine that doesn't specify a version");
    }

    props.configurations.forEach(config => this.addConfiguration(config));

    const optionGroup = new CfnOptionGroup(this, 'Resource', {
      engineName: props.engine.engineType,
      majorEngineVersion,
      optionGroupDescription: props.description || `Option group for ${props.engine.engineType} ${majorEngineVersion}`,
      optionConfigurations: Lazy.any({ produce: () => this.renderConfigurations(this.configurations) }),
    });

    this.optionGroupName = optionGroup.ref;
  }

  public addConfiguration(configuration: OptionConfiguration) {
    this.configurations.push(configuration);

    if (configuration.port) {
      if (!configuration.vpc) {
        throw new Error('`port` and `vpc` must be specified together.');
      }

      const securityGroups = configuration.securityGroups && configuration.securityGroups.length > 0
        ? configuration.securityGroups
        : [new ec2.SecurityGroup(this, `SecurityGroup${configuration.name}`, {
          description: `Security group for ${configuration.name} option`,
          vpc: configuration.vpc,
        })];

      this.optionConnections[configuration.name] = new ec2.Connections({
        securityGroups: securityGroups,
        defaultPort: ec2.Port.tcp(configuration.port),
      });
    }

    return true;
  }

  /**
   * Renders the option configurations specifications.
   */
  private renderConfigurations(configurations: OptionConfiguration[]): CfnOptionGroup.OptionConfigurationProperty[] {
    const configs: CfnOptionGroup.OptionConfigurationProperty[] = [];
    for (const config of configurations) {
      const securityGroups = config.vpc
        ? this.optionConnections[config.name].securityGroups.map(sg => sg.securityGroupId)
        : undefined;

      configs.push({
        optionName: config.name,
        optionSettings: config.settings && Object.entries(config.settings).map(([name, value]) => ({ name, value })),
        optionVersion: config.version,
        port: config.port,
        vpcSecurityGroupMemberships: securityGroups,
      });
    }

    return configs;
  }
}
