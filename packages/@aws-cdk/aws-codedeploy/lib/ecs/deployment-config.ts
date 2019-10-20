import cdk = require('@aws-cdk/core');
import { arnForDeploymentConfig } from '../utils';

/**
 * The Deployment Configuration of an ECS Deployment Group.
 * The default, pre-defined Configurations are available as constants on the {@link EcsDeploymentConfig} class
 * (for example, `EcsDeploymentConfig.AllAtOnce`).
 *
 * Note: CloudFormation does not currently support creating custom ECS configs outside
 * of using a custom resource. You can import custom deployment config created outside the
 * CDK or via a custom resource with {@link EcsDeploymentConfig#import}.
 */
export interface IEcsDeploymentConfig {
  readonly deploymentConfigName: string;
  readonly deploymentConfigArn: string;
}

/**
 * Properties of a reference to a CodeDeploy ECS Deployment Configuration.
 *
 * @see EcsDeploymentConfig#import
 */
export interface EcsDeploymentConfigImportProps {
  /**
   * The physical, human-readable name of the custom CodeDeploy ECS Deployment Configuration
   * that we are referencing.
   */
  readonly deploymentConfigName: string;
}

/**
 * A custom Deployment Configuration for an ECS Deployment Group.
 *
 * Note: This class currently stands as namespaced container of the default configurations
 * until CloudFormation supports custom ECS Deployment Configs. Until then it is closed
 * (private constructor) and does not extend {@link cdk.Construct}
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class EcsDeploymentConfig {
  public static readonly ALL_AT_ONCE = deploymentConfig('CodeDeployDefault.ECSAllAtOnce');

  /**
   * Import a custom Deployment Configuration for an ECS Deployment Group defined outside the CDK.
   *
   * @param _scope the parent Construct for this new Construct
   * @param _id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static import(_scope: cdk.Construct, _id: string, props: EcsDeploymentConfigImportProps): IEcsDeploymentConfig {
    return deploymentConfig(props.deploymentConfigName);
  }

  private constructor() {
    // nothing to do until CFN supports custom ECS deployment configurations
  }
}

function deploymentConfig(name: string): IEcsDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name)
  };
}
