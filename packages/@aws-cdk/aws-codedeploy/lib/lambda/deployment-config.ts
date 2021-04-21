import { Construct } from 'constructs';
import { arnForDeploymentConfig } from '../utils';

/**
 * The Deployment Configuration of a Lambda Deployment Group.
 * The default, pre-defined Configurations are available as constants on the {@link LambdaDeploymentConfig} class
 * (`LambdaDeploymentConfig.AllAtOnce`, `LambdaDeploymentConfig.Canary10Percent30Minutes`, etc.).
 *
 * Note: CloudFormation does not currently support creating custom lambda configs outside
 * of using a custom resource. You can import custom deployment config created outside the
 * CDK or via a custom resource with {@link LambdaDeploymentConfig#import}.
 */
export interface ILambdaDeploymentConfig {
  readonly deploymentConfigName: string;
  readonly deploymentConfigArn: string;
}

/**
 * Properties of a reference to a CodeDeploy Lambda Deployment Configuration.
 *
 * @see LambdaDeploymentConfig#import
 */
export interface LambdaDeploymentConfigImportProps {
  /**
   * The physical, human-readable name of the custom CodeDeploy Lambda Deployment Configuration
   * that we are referencing.
   */
  readonly deploymentConfigName: string;
}

/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 *
 * Note: This class currently stands as namespaced container of the default configurations
 * until CloudFormation supports custom Lambda Deployment Configs. Until then it is closed
 * (private constructor) and does not extend {@link Construct}
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class LambdaDeploymentConfig {
  public static readonly ALL_AT_ONCE = deploymentConfig('CodeDeployDefault.LambdaAllAtOnce');
  public static readonly CANARY_10PERCENT_30MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent30Minutes');
  public static readonly CANARY_10PERCENT_5MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent5Minutes');
  public static readonly CANARY_10PERCENT_10MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent10Minutes');
  public static readonly CANARY_10PERCENT_15MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent15Minutes');
  public static readonly LINEAR_10PERCENT_EVERY_10MINUTES = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery10Minutes');
  public static readonly LINEAR_10PERCENT_EVERY_1MINUTE = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery1Minute');
  public static readonly LINEAR_10PERCENT_EVERY_2MINUTES = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery2Minutes');
  public static readonly LINEAR_10PERCENT_EVERY_3MINUTES = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery3Minutes');

  /**
   * Import a custom Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
   *
   * @param _scope the parent Construct for this new Construct
   * @param _id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static import(_scope:Construct, _id: string, props: LambdaDeploymentConfigImportProps): ILambdaDeploymentConfig {
    return deploymentConfig(props.deploymentConfigName);
  }

  private constructor() {
    // nothing to do until CFN supports custom lambda deployment configurations
  }
}

function deploymentConfig(name: string): ILambdaDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
  };
}
