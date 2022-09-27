import { ArnFormat, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { TrafficRouting } from '../traffic-routing-config';
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
  /**
   * The physical, human-readable name of the Deployment Configuration.
   * @attribute
   */
  readonly deploymentConfigName: string;

  /**
   * The ARN of the Deployment Configuration.
   * @attribute
   */
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
 * Construction properties of {@link LambdaDeploymentConfig}.
 */
export interface LambdaDeploymentConfigProps {
  /**
   * The physical, human-readable name of the Deployment Configuration.
   * @default - automatically generated name
   */
  readonly deploymentConfigName?: string;

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
export class LambdaDeploymentConfig extends Resource implements ILambdaDeploymentConfig {
  /** CodeDeploy predefined deployment configuration that shifts all traffic to the updated Lambda function at once. */
  public static readonly ALL_AT_ONCE = deploymentConfig('CodeDeployDefault.LambdaAllAtOnce');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 30 minutes later. */
  public static readonly CANARY_10PERCENT_30MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent30Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed five minutes later. */
  public static readonly CANARY_10PERCENT_5MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent5Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 10 minutes later. */
  public static readonly CANARY_10PERCENT_10MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent10Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic in the first increment. The remaining 90 percent is deployed 15 minutes later. */
  public static readonly CANARY_10PERCENT_15MINUTES = deploymentConfig('CodeDeployDefault.LambdaCanary10Percent15Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every 10 minutes until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_10MINUTES = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery10Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every minute until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_1MINUTE = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery1Minute');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every two minutes until all traffic is shifted. */
  public static readonly LINEAR_10PERCENT_EVERY_2MINUTES = deploymentConfig('CodeDeployDefault.LambdaLinear10PercentEvery2Minutes');
  /** CodeDeploy predefined deployment configuration that shifts 10 percent of traffic every three minutes until all traffic is shifted. */
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
    ignore(id);
    const arn = Stack.of(scope).formatArn({
      service: 'codedeploy',
      resource: 'deploymentconfig',
      resourceName: lambdaDeploymentConfigName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
    return {
      deploymentConfigName: lambdaDeploymentConfigName,
      deploymentConfigArn: arn,
    };
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

  public constructor(scope: Construct, id: string, props?: LambdaDeploymentConfigProps) {
    super(scope, id, {
      physicalName: props?.deploymentConfigName,
    });

    // Construct the traffic routing configuration for the deployment group
    const routingConfig = props?.trafficRouting ?? TrafficRouting.allAtOnce();

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: this.physicalName,
      computePlatform: 'Lambda',
      trafficRoutingConfig: routingConfig.bind(this),
    });

    this.deploymentConfigName = this.getResourceNameAttribute(resource.ref);
    this.deploymentConfigArn = this.getResourceArnAttribute(arnForDeploymentConfig(resource.ref), {
      service: 'codedeploy',
      resource: 'deploymentconfig',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.node.addValidation({ validate: () => validateName('Deployment config', this.physicalName) });
  }
}

function deploymentConfig(name: string): ILambdaDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
  };
}

function ignore(_x: any) { return; }
