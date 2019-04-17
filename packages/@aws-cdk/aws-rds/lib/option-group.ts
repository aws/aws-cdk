import ec2 = require('@aws-cdk/aws-ec2');
import { CfnOutput, Construct, IResource, Resource } from '@aws-cdk/cdk';
import { DatabaseInstanceEngine } from './instance';
import { CfnOptionGroup } from './rds.generated';

/**
 * An option group
 */
export interface IOptionGroup extends IResource {
  /**
   * The name of the option group.
   */
  readonly optionGroupName: string;

  /**
   * Exports this option group from the stack.
   */
  export(): OptionGroupImportProps;
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
   * @default no settings
   */
  readonly settings?: { [name: string]: string };

  /**
   * The version for the option.
   *
   * @default no version
   */
  readonly version?: string;

  /**
   * The port number that this option uses. If `port` is specified then `vpc`
   * must also be specified.
   *
   * @default no port
   */
  readonly port?: number;

  /**
   * The VPC where a security group should be created for this option. If `vpc`
   * is specified then `port` must also be specified.
   */
  readonly vpc?: ec2.IVpcNetwork;
}

/**
 * Construction properties for an OptionGroup.
 */
export interface OptionGroupProps {
  /**
   * The name of the database engine that this option group is associated with.
   */
  readonly engineName: DatabaseInstanceEngine

  /**
   * The major version number of the database engine that this option group
   * is associated with.
   */
  readonly majorEngineVersion: string;

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

export class OptionGroup extends Resource implements IOptionGroup {
  /**
   * Import an existing option group.
   */
  public static import(scope: Construct, id: string, props: OptionGroupImportProps): IOptionGroup {
    return new ImportedOptionGroup(scope, id, props);
  }

  /**
   * The name of the option group.
   */
  public readonly optionGroupName: string;

  /**
   * The connections object for the options.
   */
  public readonly optionConnections: { [key: string]: ec2.Connections } = {};

  constructor(scope: Construct, id: string, props: OptionGroupProps) {
    super(scope, id);

    const optionGroup = new CfnOptionGroup(this, 'Resource', {
      engineName: props.engineName.engine,
      majorEngineVersion: props.majorEngineVersion,
      optionGroupDescription: props.description || `Option group for ${props.engineName.engine} ${props.majorEngineVersion}`,
      optionConfigurations: this.renderConfigurations(props.configurations)
    });

    this.optionGroupName = optionGroup.optionGroupName;
  }

  public export(): OptionGroupImportProps {
    return {
      optionGroupName: new CfnOutput(this, 'OptionGroupName', { value: this.optionGroupName }).makeImportValue().toString(),
    };
  }

  /**
   * Renders the option configurations specifications.
   */
  private renderConfigurations(configurations: OptionConfiguration[]): CfnOptionGroup.OptionConfigurationProperty[] {
    const configs: CfnOptionGroup.OptionConfigurationProperty[] = [];
    for (const config of configurations) {
      let configuration: CfnOptionGroup.OptionConfigurationProperty = {
        optionName: config.name,
        optionSettings: config.settings && Object.entries(config.settings).map(([name, value]) => ({ name, value })),
        optionVersion: config.version
      };

      if (config.port) {
        if (!config.vpc) {
          throw new Error('`port` and `vpc` must be specified together.');
        }

        const securityGroup = new ec2.SecurityGroup(this, `SecurityGroup${config.name}`, {
          description: `Security group for ${config.name} option`,
          vpc: config.vpc
        });

        this.optionConnections[config.name] = new ec2.Connections({
          securityGroups: [securityGroup],
          defaultPortRange: new ec2.TcpPort(config.port)
        });

        configuration = {
          ...configuration,
          port: config.port,
          vpcSecurityGroupMemberships: [securityGroup.securityGroupId]
        };
      }

      configs.push(configuration);
    }

    return configs;
  }
}

export interface OptionGroupImportProps {
  /**
   * The name of the option group.
   */
  readonly optionGroupName: string;
}

class ImportedOptionGroup extends Construct implements IOptionGroup {
  public readonly optionGroupName: string;

  constructor(scope: Construct, id: string, private readonly props: OptionGroupImportProps) {
    super(scope, id);

    this.optionGroupName = props.optionGroupName;
  }

  public export() {
    return this.props;
  }
}
