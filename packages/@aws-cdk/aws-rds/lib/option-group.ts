import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { DatabaseInstanceEngine } from './instance';
import { CfnOptionGroup } from './rds.generated';

/**
 * An option group
 */
export interface IOptionGroup extends cdk.IConstruct {
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
   * The port number that this option uses.
   *
   * @default no port
   */
  readonly port?: number;

  /**
   * A list of VPC security group for this option.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
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

export class OptionGroup extends cdk.Construct implements IOptionGroup {
  /**
   * Import an existing option group.
   */
  public static import(scope: cdk.Construct, id: string, props: OptionGroupImportProps): IOptionGroup {
    return new ImportedOptionGroup(scope, id, props);
  }

  public readonly optionGroupName: string;

  constructor(scope: cdk.Construct, id: string, props: OptionGroupProps) {
    super(scope, id);

    const optionGroup = new CfnOptionGroup(this, 'Resource', {
      engineName: props.engineName,
      majorEngineVersion: props.majorEngineVersion,
      optionGroupDescription: props.description || `Option group for ${props.engineName} ${props.majorEngineVersion}`,
      optionConfigurations: renderConfigurations(props.configurations)
    });

    this.optionGroupName = optionGroup.optionGroupName;
  }

  public export(): OptionGroupImportProps {
    return {
      optionGroupName: new cdk.CfnOutput(this, 'OptionGroupName', { value: this.optionGroupName }).makeImportValue().toString(),
    };
  }
}

export interface OptionGroupImportProps {
  /**
   * The name of the option group.
   */
  readonly optionGroupName: string;
}

class ImportedOptionGroup extends cdk.Construct implements IOptionGroup {
  public readonly optionGroupName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: OptionGroupImportProps) {
    super(scope, id);

    this.optionGroupName = props.optionGroupName;
  }

  public export() {
    return this.props;
  }
}

/**
 * Renders the option configurations specifications.
 *
 * @param configs a list of configurations
 */
function renderConfigurations(configs: OptionConfiguration[]): CfnOptionGroup.OptionConfigurationProperty[] {
  return configs.map(config => ({
    optionName: config.name,
    optionSettings: config.settings && Object.entries(config.settings).map(([name, value]) => ({ name, value })),
    optionVersion: config.version,
    port: config.port,
    vpcSecurityGroupMemberships: config.securityGroups && config.securityGroups.map(s => s.securityGroupId)
  }));
}
