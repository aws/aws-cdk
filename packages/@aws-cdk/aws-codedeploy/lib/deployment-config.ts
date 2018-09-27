import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './codedeploy.generated';

/**
 * The Deployment Configuration of an EC2/on-premise Deployment Group.
 * The default, pre-defined Configurations are available as constants on the {@link ServerDeploymentConfig} class
 * (`ServerDeploymentConfig.HalfAtATime`, `ServerDeploymentConfig.AllAtOnce`, etc.).
 * To create a custom Deployment Configuration,
 * instantiate the {@link ServerDeploymentConfig} Construct.
 */
export interface IServerDeploymentConfig {
  readonly deploymentConfigName: string;
  readonly deploymentConfigArn: string;
}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Configuration.
 *
 * @see ServerDeploymentConfigRef#import
 * @see ServerDeploymentConfigRef#export
 */
export interface ServerDeploymentConfigRefProps {
  /**
   * The physical, human-readable name of the custom CodeDeploy EC2/on-premise Deployment Configuration
   * that we are referencing.
   */
  deploymentConfigName: string;
}

/**
 * Reference to a custom Deployment Configuration for an EC2/on-premise Deployment Group.
 */
export abstract class ServerDeploymentConfigRef extends cdk.Construct implements IServerDeploymentConfig {
  /**
   * Import a custom Deployment Configuration for an EC2/on-premise Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param parent the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static import(parent: cdk.Construct, id: string, props: ServerDeploymentConfigRefProps):
      ServerDeploymentConfigRef {
    return new ImportedServerDeploymentConfigRef(parent, id, props);
  }

  public abstract readonly deploymentConfigName: string;
  public abstract readonly deploymentConfigArn: string;

  public export(): ServerDeploymentConfigRefProps {
    return {
      deploymentConfigName: new cdk.Output(this, 'DeploymentConfigName', {
        value: this.deploymentConfigName,
      }).makeImportValue().toString(),
    };
  }
}

class ImportedServerDeploymentConfigRef extends ServerDeploymentConfigRef {
  public readonly deploymentConfigName: string;
  public readonly deploymentConfigArn: string;

  constructor(parent: cdk.Construct, id: string, props: ServerDeploymentConfigRefProps) {
    super(parent, id);

    this.deploymentConfigName = props.deploymentConfigName;
    this.deploymentConfigArn = arnForDeploymentConfigName(this.deploymentConfigName);
  }
}

class DefaultServerDeploymentConfig implements IServerDeploymentConfig {
  public readonly deploymentConfigName: string;
  public readonly deploymentConfigArn: string;

  constructor(deploymentConfigName: string) {
    this.deploymentConfigName = deploymentConfigName;
    this.deploymentConfigArn = arnForDeploymentConfigName(this.deploymentConfigName);
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
export class ServerDeploymentConfig extends ServerDeploymentConfigRef {
  public static readonly OneAtATime: IServerDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.OneAtATime');
  public static readonly HalfAtATime: IServerDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.HalfAtATime');
  public static readonly AllAtOnce: IServerDeploymentConfig = new DefaultServerDeploymentConfig('CodeDeployDefault.AllAtOnce');

  public readonly deploymentConfigName: string;
  public readonly deploymentConfigArn: string;

  constructor(parent: cdk.Construct, id: string, props: ServerDeploymentConfigProps) {
    super(parent, id);

    const resource = new cloudformation.DeploymentConfigResource(this, 'Resource', {
      deploymentConfigName: props.deploymentConfigName,
      minimumHealthyHosts: this.minimumHealthyHosts(props),
    });

    this.deploymentConfigName = resource.ref.toString();
    this.deploymentConfigArn = arnForDeploymentConfigName(this.deploymentConfigName);
  }

  private minimumHealthyHosts(props: ServerDeploymentConfigProps):
      cloudformation.DeploymentConfigResource.MinimumHealthyHostsProperty {
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

function arnForDeploymentConfigName(name: string): string {
  return cdk.ArnUtils.fromComponents({
    service: 'codedeploy',
    resource: 'deploymentconfig',
    resourceName: name,
    sep: ':',
  });
}
