import { Construct } from 'constructs';
import { BaseDeploymentConfig, BaseDeploymentConfigOptions, ComputePlatform, IBaseDeploymentConfig } from '../base-deployment-config';
import { deploymentConfig } from '../private/utils';
import { TrafficRouting } from '../traffic-routing-config';

/**
 * The Deployment Configuration of a Lambda Deployment Group.
 *
 * If you're managing the Deployment Configuration alongside the rest of your CDK resources,
 * use the `LambdaDeploymentConfig` class.
 *
 * If you want to reference an already existing deployment configuration,
 * or one defined in a different CDK Stack,
 * use the `LambdaDeploymentConfig#fromLambdaDeploymentConfigName` method.
 *
 * The default, pre-defined Configurations are available as constants on the `LambdaDeploymentConfig` class
 * (`LambdaDeploymentConfig.AllAtOnce`, `LambdaDeploymentConfig.Canary10Percent30Minutes`, etc.).
 */
export interface ILambdaDeploymentConfig extends IBaseDeploymentConfig {
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
 * Construction properties of `LambdaDeploymentConfig`.
 */
export interface LambdaDeploymentConfigProps extends BaseDeploymentConfigOptions {
  /**
   * The configuration that specifies how traffic is shifted from the 'blue'
   * target group to the 'green' target group during a deployment.
   * @default AllAtOnce
   */
  readonly trafficRouting?: TrafficRouting;
}

/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class LambdaDeploymentConfig extends BaseDeploymentConfig implements ILambdaDeploymentConfig {
  /** CodeDeploy predefined deployment configuration that shifts all traffic to the updated Lambda function at once. */
  public static readonly ALL_AT_ONCE = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaAllAtOnce');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 30 minutes later. */
  public static readonly CANARY_10PERCENT_30MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaCanary10Percent30Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed five minutes later. */
  public static readonly CANARY_10PERCENT_5MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaCanary10Percent5Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 10 minutes later. */
  public static readonly CANARY_10PERCENT_10MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaCanary10Percent10Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 15 minutes later. */
  public static readonly CANARY_10PERCENT_15MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaCanary10Percent15Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every 10 minutes until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_10MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery10Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every minute until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_1MINUTE = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery1Minute');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every two minutes until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_2MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery2Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every three minutes until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_3MINUTES = LambdaDeploymentConfig.deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery3Minutes');

  /**
   * Import a Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param lambdaDeploymentConfigName the name of the Lambda Deployment Configuration to import
   * @returns a Construct representing a reference to an existing Lambda Deployment Configuration
   */
  public static fromLambdaDeploymentConfigName(scope: Construct, id: string, lambdaDeploymentConfigName: string): ILambdaDeploymentConfig {
    return this.fromDeploymentConfigName(scope, id, lambdaDeploymentConfigName);
  }

  /**
   * Import a Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
   *
   * @param _scope the parent Construct for this new Construct
   * @param _id the logical ID of this new Construct
   * @param props the properties of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   * @deprecated use `fromLambdaDeploymentConfigName`
   */
  public static import(_scope: Construct, _id: string, props: LambdaDeploymentConfigImportProps): ILambdaDeploymentConfig {
    return this.fromLambdaDeploymentConfigName(_scope, _id, props.deploymentConfigName);
  }

  private static deploymentConfig(name: string): ILambdaDeploymentConfig {
    return deploymentConfig(name);
  }

  public constructor(scope: Construct, id: string, props?: LambdaDeploymentConfigProps) {
    super(scope, id, {
      ...props,
      computePlatform: ComputePlatform.LAMBDA,
      trafficRouting: props?.trafficRouting ?? TrafficRouting.allAtOnce(),
    });
  }
}
