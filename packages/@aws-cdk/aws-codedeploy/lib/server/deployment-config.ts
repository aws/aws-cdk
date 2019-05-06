import cdk = require('@aws-cdk/cdk');
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { arnForDeploymentConfig } from '../utils';

/**
 * The Deployment Configuration of an EC2/on-premise Deployment Group.
 * The default, pre-defined Configurations are available as constants on the {@link ServerDeploymentConfig} class
 * (`ServerDeploymentConfig.HalfAtATime`, `ServerDeploymentConfig.AllAtOnce`, etc.).
 * To create a custom Deployment Configuration,
 * instantiate the {@link ServerDeploymentConfig} Construct.
 */
export interface IServerDeploymentConfig {
  /**
   * @attribute
   */
  readonly deploymentConfigName: string;

  /**
   * @attribute
   */
  readonly deploymentConfigArn: string;

  export(): ServerDeploymentConfigAttributes;
}

/**
 * Properties of a reference to a CodeDeploy EC2/on-premise Deployment Configuration.
 *
 * @see ServerDeploymentConfig#import
 * @see ServerDeploymentConfig#export
 */
export interface ServerDeploymentConfigAttributes {
  /**
   * The physical, human-readable name of the custom CodeDeploy EC2/on-premise Deployment Configuration
   * that we are referencing.
   */
  readonly deploymentConfigName: string;
}

/**
 * Minimum number of healthy hosts for a server deployment.
 */
export class MinimumHealthyHosts {

  /**
   * The minimum healhty hosts threshold expressed as an absolute number.
   */
  public static count(value: number): MinimumHealthyHosts {
    return new MinimumHealthyHosts({
      type: 'HOST_COUNT',
      value
    });
  }

  /**
   * The minmum healhty hosts threshold expressed as a percentage of the fleet.
   */
  public static percentage(value: number): MinimumHealthyHosts {
    return new MinimumHealthyHosts({
      type: 'FLEET_PERCENT',
      value
    });
  }

  private constructor(private readonly json: CfnDeploymentConfig.MinimumHealthyHostsProperty) { }

  /**
   * @internal
   */
  public get _json() {
    return this.json;
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
  readonly deploymentConfigName?: string;

  /**
   * Minimum number of healthy hosts.
   */
  readonly minimumHealthyHosts: MinimumHealthyHosts;
}

/**
 * A custom Deployment Configuration for an EC2/on-premise Deployment Group.
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class ServerDeploymentConfig extends cdk.Resource implements IServerDeploymentConfig {
  public static readonly OneAtATime  = deploymentConfig('CodeDeployDefault.OneAtATime');
  public static readonly HalfAtATime = deploymentConfig('CodeDeployDefault.HalfAtATime');
  public static readonly AllAtOnce   = deploymentConfig('CodeDeployDefault.AllAtOnce');

  /**
   * Import a custom Deployment Configuration for an EC2/on-premise Deployment Group defined either outside the CDK,
   * or in a different CDK Stack and exported using the {@link #export} method.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param serverDeploymentConfigName the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static fromServerDeploymentConfigName(
      scope: cdk.Construct,
      id: string,
      serverDeploymentConfigName: string): IServerDeploymentConfig {

    ignore(scope);
    ignore(id);
    return deploymentConfig(serverDeploymentConfigName);
  }

  public readonly deploymentConfigName: string;
  public readonly deploymentConfigArn: string;

  constructor(scope: cdk.Construct, id: string, props: ServerDeploymentConfigProps) {
    super(scope, id);

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: props.deploymentConfigName,
      minimumHealthyHosts: props.minimumHealthyHosts._json,
    });

    this.deploymentConfigName = resource.ref.toString();
    this.deploymentConfigArn = arnForDeploymentConfig(this.deploymentConfigName);
  }

  public export(): ServerDeploymentConfigAttributes {
    return {
      deploymentConfigName: new cdk.CfnOutput(this, 'DeploymentConfigName', {
        value: this.deploymentConfigName,
      }).makeImportValue().toString(),
    };
  }
}

function deploymentConfig(name: string): IServerDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
    export() { return { deploymentConfigName: name }; }
  };
}

function ignore(_x: any) { return; }