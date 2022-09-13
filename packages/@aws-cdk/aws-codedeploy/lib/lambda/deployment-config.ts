import { Duration, Names, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { arnForDeploymentConfig, validateName } from '../utils';

/**
 * The Deployment Configuration of a Lambda Deployment Group.
 *
 * If you're managing the Deployment Configuration alongside the rest of your CDK resources,
 * use the {@link LambdaDeploymentConfig} class.
 *
 * If you want to reference an already existing deployment configuration,
 * or one defined in a different CDK Stack,
 * use the {@link LambdaDeploymentConfig#fromLambdaDeploymentConfigName} method.
 *
 * The default, pre-defined Configurations are available as constants on the {@link LambdaDeploymentConfig} class
 * (`LambdaDeploymentConfig.AllAtOnce`, `LambdaDeploymentConfig.Canary10Percent30Minutes`, etc.).
 */
export interface ILambdaDeploymentConfig {
  /** @attribute */
  readonly deploymentConfigName: string;

  /** @attribute */
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
 * Lambda Deployment config type
 */
export enum LambdaDeploymentConfigType {
  /**
   * Canary deployment type
   */
  CANARY = 'Canary',

  /**
   * Linear deployment type
   */
  LINEAR = 'Linear'
}

/**
 * Construction properties of {@link LambdaDeploymentConfig}.
 */
export interface LambdaDeploymentConfigProps {

  /**
   * The type of deployment config, either CANARY or LINEAR
   */
  readonly type: LambdaDeploymentConfigType;

  /**
   * The integer percentage of traffic to shift:
   * - For LINEAR, the percentage to shift every interval
   * - For CANARY, the percentage to shift until the interval passes, before the full deployment
   */
  readonly percentage: number;

  /**
   * The interval, in number of minutes:
   * - For LINEAR, how frequently additional traffic is shifted
   * - For CANARY, how long to shift traffic before the full deployment
   */
  readonly interval: Duration;

  /**
   * The verbatim name of the deployment config. Must be unique per account/region.
   * Other parameters cannot be updated if this name is provided.
   * @default - automatically generated name
   */
  readonly deploymentConfigName?: string;
}

/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class LambdaDeploymentConfig extends Resource implements ILambdaDeploymentConfig {
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
   * Import a Deployment Configuration for a Lambda Deployment Group defined outside the CDK.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param lambdaDeploymentConfigName the name of the Lambda Deployment Configuration to import
   * @returns a Construct representing a reference to an existing Lambda Deployment Configuration
   */
  public static fromLambdaDeploymentConfigName(scope: Construct, id: string, lambdaDeploymentConfigName: string): ILambdaDeploymentConfig {
    ignore(scope);
    ignore(id);
    return deploymentConfig(lambdaDeploymentConfigName);
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

  /**
   * The name of the deployment config
   * @attribute
   */
  public readonly deploymentConfigName: string;

  /**
    * The arn of the deployment config
    * @attribute
    */
  public readonly deploymentConfigArn: string;

  public constructor(scope: Construct, id: string, props: LambdaDeploymentConfigProps) {
    super(scope, id);
    this.validateParameters(props);

    // Construct the traffic routing configuration for the deployment group
    const deploymentType = 'TimeBased' + props.type.toString();
    let routingConfig : CfnDeploymentConfig.TrafficRoutingConfigProperty;
    if (props.type == LambdaDeploymentConfigType.CANARY) {
      routingConfig = {
        type: deploymentType,
        timeBasedCanary: {
          canaryInterval: props.interval.toMinutes(),
          canaryPercentage: props.percentage,
        },
      };
    } else { // LambdaDeploymentConfigType.LINEAR
      routingConfig = {
        type: deploymentType,
        timeBasedLinear: {
          linearInterval: props.interval.toMinutes(),
          linearPercentage: props.percentage,
        },
      };
    }

    // Generates the name of the deployment config. It's also what you'll see in the AWS console
    // The name of the config is <construct unique id>.Lambda<deployment type><percentage>Percent<interval>Minutes
    // Unless the user provides an explicit name
    this.deploymentConfigName = props.deploymentConfigName
      ?? `${Names.uniqueId(this)}.Lambda${props.type}${props.percentage}Percent${props.type === LambdaDeploymentConfigType.LINEAR
        ? 'Every'
        : ''}${props.interval.toMinutes()}Minutes`;
    this.deploymentConfigArn = arnForDeploymentConfig(this.deploymentConfigName);

    new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: this.deploymentConfigName,
      computePlatform: 'Lambda',
      trafficRoutingConfig: routingConfig,
    });

    this.node.addValidation({ validate: () => validateName('Deployment config', this.deploymentConfigName) });
  }

  // Validate the inputs. The percentage/interval limits come from CodeDeploy
  private validateParameters(props: LambdaDeploymentConfigProps): void {
    if ( !(1 <= props.percentage && props.percentage <= 99) ) {
      throw new Error(
        `Invalid deployment config percentage "${props.percentage.toString()}". \
        Step percentage must be an integer between 1 and 99.`);
    }
    if (props.interval.toMinutes() > 2880) {
      throw new Error(
        `Invalid deployment config interval "${props.interval.toString()}". \
        Traffic shifting intervals must be positive integers up to 2880 (2 days).`);
    }
  }
}

function deploymentConfig(name: string): ILambdaDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
  };
}

function ignore(_x: any) { return; }
