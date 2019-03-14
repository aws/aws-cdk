import cdk = require('@aws-cdk/cdk');
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { arnForDeploymentConfigName } from '../utils';

/**
 * The Deployment Configuration of an EC2/on-premise Deployment Group.
 * The default, pre-defined Configurations are available as constants on the {@link ServerDeploymentConfig} class
 * (`ServerDeploymentConfig.HalfAtATime`, `ServerDeploymentConfig.AllAtOnce`, etc.).
 * To create a custom Deployment Configuration,
 * instantiate the {@link ServerDeploymentConfig} Construct.
 */
export interface IServerDeploymentConfig {
  readonly deploymentConfigName: string;
  deploymentConfigArn(scope: cdk.IConstruct): string;
  export(): ServerDeploymentConfigImportProps;
}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Configuration.
 *
 * @see ServerDeploymentConfig#import
 * @see ServerDeploymentConfig#export
 */
export interface ServerDeploymentConfigImportProps {
  /**
   * The physical, human-readable name of the custom CodeDeploy EC2/on-premise Deployment Configuration
   * that we are referencing.
   */
  deploymentConfigName: string;
}

class ImportedServerDeploymentConfig extends cdk.Construct implements IServerDeploymentConfig {
  public readonly deploymentConfigName: string;

  constructor(scope: cdk.Construct, id: string, private readonly props: ServerDeploymentConfigImportProps) {
    super(scope, id);

    this.deploymentConfigName = props.deploymentConfigName;
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }

  public export() {
    return this.props;
  }
}

class DefaultServerDeploymentConfig implements IServerDeploymentConfig {
  public readonly deploymentConfigName: string;

  constructor(deploymentConfigName: string) {
    this.deploymentConfigName = deploymentConfigName;
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }

  public export(): ServerDeploymentConfigImportProps {
    return {
      deploymentConfigName: this.deploymentConfigName
    };
  }
}

/**
 * Construction properties of {@link ServerDeploymentConfig}.
 */
export interface ServerDeploymentConfigProps {
  /**
   * The physical, human-readable name of the Deployment Configuration.
   *
   * @default a name will be auto-generated
   */
  deploymentConfigName?: string;

  /**
   * The minimum healhty hosts threshold expressed as an absolute number.
   * If you've specified this value,
   * you can't specify {@link #minHealthyHostPercentage},
   * however one of this or {@link #minHealthyHostPercentage} is required.
   */
  minHealthyHostCount?: number;

  /**
   * The minmum healhty hosts threshold expressed as a percentage of the fleet.
   * If you've specified this value,
   * you can't specify {@link #minHealthyHostCount},
   * however one of this or {@link #minHealthyHostCount} is required.
   */
  minHealthyHostPercentage?: number;
}

/**
 * A custom Deployment Configuration for an EC2/on-premise Deployment Group.
 */
export class ServerDeploymentConfig extends cdk.Construct implements IServerDeploymentConfig {
  public static readonly OneAtATime: IServerDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.OneAtATime');
  public static readonly HalfAtATime: IServerDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.HalfAtATime');
  public static readonly AllAtOnce: IServerDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.AllAtOnce');

  /**
   * Import a custom Deployment Configuration for an EC2/on-premise Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static import(scope: cdk.Construct, id: string, props: ServerDeploymentConfigImportProps): IServerDeploymentConfig {
    return new ImportedServerDeploymentConfig(scope, id, props);
  }

  public readonly deploymentConfigName: string;

  constructor(scope: cdk.Construct, id: string, props: ServerDeploymentConfigProps) {
    super(scope, id);

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: props.deploymentConfigName,
      minimumHealthyHosts: this.minimumHealthyHosts(props),
    });

    this.deploymentConfigName = resource.ref.toString();
  }

  public deploymentConfigArn(scope: cdk.IConstruct): string {
    return arnForDeploymentConfigName(this.deploymentConfigName, scope);
  }

  public export(): ServerDeploymentConfigImportProps {
    return {
      deploymentConfigName: new cdk.CfnOutput(this, 'DeploymentConfigName', {
        value: this.deploymentConfigName,
      }).makeImportValue().toString(),
    };
  }

  private minimumHealthyHosts(props: ServerDeploymentConfigProps):
      CfnDeploymentConfig.MinimumHealthyHostsProperty {
    if (props.minHealthyHostCount === undefined && props.minHealthyHostPercentage === undefined) {
      throw new Error('At least one of minHealthyHostCount or minHealthyHostPercentage must be specified when creating ' +
        'a custom Server DeploymentConfig');
    }
    if (props.minHealthyHostCount !== undefined && props.minHealthyHostPercentage !== undefined) {
      throw new Error('Both minHealthyHostCount and minHealthyHostPercentage cannot be specified when creating ' +
        'a custom Server DeploymentConfig');
    }

    return {
      type: props.minHealthyHostCount !== undefined ? 'HOST_COUNT' : 'FLEET_PERCENT',
      value: props.minHealthyHostCount !== undefined  ? props.minHealthyHostCount : props.minHealthyHostPercentage!,
    };
  }
}
