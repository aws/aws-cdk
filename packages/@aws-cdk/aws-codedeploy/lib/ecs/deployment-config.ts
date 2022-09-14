import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentConfig } from '../codedeploy.generated';
import { ITrafficRoutingConfig } from '../traffic-routing-config';
import { arnForDeploymentConfig, validateName } from '../utils';

/**
 * The Deployment Configuration of an ECS Deployment Group.
 * The default, pre-defined Configurations are available as constants on the {@link EcsDeploymentConfig} class
 * (for example, `EcsDeploymentConfig.AllAtOnce`).
 * To create a custom Deployment Configuration,
 * instantiate the {@link EcsDeploymentConfig} Construct.
 */
export interface IEcsDeploymentConfig {
  /**
   * @attribute
   */
  readonly deploymentConfigName: string;
  /**
   * @attribute
   */
  readonly deploymentConfigArn: string;
}

/**
 * Construction properties of {@link EcsDeploymentConfig}.
 */
export interface EcsDeploymentConfigProps {
  /**
   * The physical, human-readable name of the Deployment Configuration.
   *
   * @default a name will be auto-generated
   */
  readonly deploymentConfigName?: string;

  /**
   * The configuration that specifies how traffic is shifed from one
   * Amazon ECS task set to another during an Amazon ECS deployment.
   *
   * @default a name will be auto-generated
   */
  readonly trafficRoutingConfig?: ITrafficRoutingConfig;

}

/**
 * A custom Deployment Configuration for an ECS Deployment Group.
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export class EcsDeploymentConfig extends cdk.Resource implements IEcsDeploymentConfig {
  public static readonly ALL_AT_ONCE = deploymentConfig('CodeDeployDefault.ECSAllAtOnce');
  public static readonly LINEAR_10_PERCENT_1_MINUTES = deploymentConfig('CodeDeployDefault.ECSLinear10PercentEvery1Minutes');
  public static readonly LINEAR_10_PERCENT_3_MINUTES = deploymentConfig('CodeDeployDefault.ECSLinear10PercentEvery3Minutes');
  public static readonly CANARY_10_PERCENT_5_MINUTES = deploymentConfig('CodeDeployDefault.ECSCanary10Percent5Minutes');
  public static readonly CANARY_10_PERCENT_15_MINUTES = deploymentConfig('CodeDeployDefault.ECSCanary10Percent15Minutes');

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

  public readonly deploymentConfigName: string;
  public readonly deploymentConfigArn: string;

  constructor(scope: Construct, id: string, props: EcsDeploymentConfigProps = {}) {
    super(scope, id, {
      physicalName: props.deploymentConfigName,
    });
    const resource = new CfnDeploymentConfig(this, 'Resource', {
      computePlatform: 'ECS',
      deploymentConfigName: this.physicalName,
      trafficRoutingConfig: props.trafficRoutingConfig?.renderTrafficRoutingConfig(),
    });

    this.deploymentConfigName = resource.ref;
    this.deploymentConfigArn = arnForDeploymentConfig(this.deploymentConfigName);

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