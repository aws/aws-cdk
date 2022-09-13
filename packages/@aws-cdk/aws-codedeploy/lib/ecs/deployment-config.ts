import { ArnFormat, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { AllAtOnceTrafficRoutingConfig, ITrafficRoutingConfig } from '../traffic-routing-config';
import { arnForDeploymentConfig, validateName } from '../utils';

/**
 * The Deployment Configuration of an ECS Deployment Group.
 *
 * If you're managing the Deployment Configuration alongside the rest of your CDK resources,
 * use the {@link EcsDeploymentConfig} class.
 *
 * If you want to reference an already existing deployment configuration,
 * or one defined in a different CDK Stack,
 * use the {@link EcsDeploymentConfig#fromEcsDeploymentConfigName} method.
 *
 * The default, pre-defined Configurations are available as constants on the {@link EcsDeploymentConfig} class
 * (for example, `EcsDeploymentConfig.AllAtOnce`).
 */
export interface IEcsDeploymentConfig {
  /** @attribute */
  readonly deploymentConfigName: string;

  /** @attribute */
  readonly deploymentConfigArn: string;
}

/**
 * Construction properties of {@link EcsDeploymentConfig}.
 */
export interface EcsDeploymentConfigProps {
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
  readonly trafficRoutingConfig?: ITrafficRoutingConfig;
}

/**
 * A custom Deployment Configuration for an ECS Deployment Group.
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class EcsDeploymentConfig extends Resource implements IEcsDeploymentConfig {
  public static readonly ALL_AT_ONCE = deploymentConfig('CodeDeployDefault.ECSAllAtOnce');
  public static readonly LINEAR_10PERCENT_EVERY_1MINUTES = deploymentConfig('CodeDeployDefault.ECSLinear10PercentEvery1Minutes');
  public static readonly LINEAR_10PERCENT_EVERY_3MINUTES = deploymentConfig('CodeDeployDefault.ECSLinear10PercentEvery3Minutes');
  public static readonly CANARY_10PERCENT_5MINUTES = deploymentConfig('CodeDeployDefault.ECSCanary10Percent5Minutes');
  public static readonly CANARY_10PERCENT_15MINUTES = deploymentConfig('CodeDeployDefault.ECSCanary10Percent15Minutes');

  /**
   * Import a custom Deployment Configuration for an ECS Deployment Group defined outside the CDK.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param ecsDeploymentConfigName the name of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  public static fromEcsDeploymentConfigName(scope: Construct, id: string, ecsDeploymentConfigName: string): IEcsDeploymentConfig {
    ignore(scope);
    ignore(id);
    return deploymentConfig(ecsDeploymentConfigName);
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

  public constructor(scope: Construct, id: string, props?: EcsDeploymentConfigProps) {
    super(scope, id, {
      physicalName: props?.deploymentConfigName,
    });

    // Construct the traffic routing configuration for the deployment group
    const routingConfig = props && props.trafficRoutingConfig ? props.trafficRoutingConfig : new AllAtOnceTrafficRoutingConfig();

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: this.physicalName,
      computePlatform: 'ECS',
      trafficRoutingConfig: routingConfig.renderTrafficRoutingConfig(),
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

function deploymentConfig(name: string): IEcsDeploymentConfig {
  return {
    deploymentConfigName: name,
    deploymentConfigArn: arnForDeploymentConfig(name),
  };
}

function ignore(_x: any) { return; }
