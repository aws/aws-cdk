import { ArnFormat, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnDeploymentConfig } from './codedeploy.generated';
import { MinimumHealthyHosts } from './host-health-config';
import { arnForDeploymentConfig, validateName } from './private/utils';
import { TrafficRouting } from './traffic-routing-config';

/**
 * The base class for ServerDeploymentConfig, EcsDeploymentConfig,
 * and LambdaDeploymentConfig deployment configurations.
 */
export interface IBaseDeploymentConfig {
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
 * Construction properties of `BaseDeploymentConfig`.
 */
export interface BaseDeploymentConfigOptions {
  /**
   * The physical, human-readable name of the Deployment Configuration.
   * @default - automatically generated name
   */
  readonly deploymentConfigName?: string;
}

/**
 * The compute platform of a deployment configuration
 */
export enum ComputePlatform {
  /**
   * The deployment will target EC2 instances or on-premise servers
   */
  SERVER = 'Server',

  /**
   * The deployment will target a Lambda function
   */
  LAMBDA = 'Lambda',

  /**
   * The deployment will target an ECS server
   */
  ECS = 'ECS'
}

/**
 * Complete base deployment config properties that are required to be supplied by the implementation
 * of the BaseDeploymentConfig class.
 */
export interface BaseDeploymentConfigProps extends BaseDeploymentConfigOptions {
  /**
   * The destination compute platform for the deployment.
   *
   * @default ComputePlatform.Server
   */
  readonly computePlatform?: ComputePlatform;

  /**
   * The configuration that specifies how traffic is shifted during a deployment.
   * Only applicable to ECS and Lambda deployments, and must not be specified for Server deployments.
   * @default None
   */
  readonly trafficRouting?: TrafficRouting;

  /**
   * Minimum number of healthy hosts.
   * @default None
   */
  readonly minimumHealthyHosts?: MinimumHealthyHosts;
}

/**
 * The base class for ServerDeploymentConfig, EcsDeploymentConfig,
 * and LambdaDeploymentConfig deployment configurations.
 *
 * @resource AWS::CodeDeploy::DeploymentConfig
 */
export abstract class BaseDeploymentConfig extends Resource implements IBaseDeploymentConfig {
  /**
   * Import a custom Deployment Configuration for a Deployment Group defined outside the CDK.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param deploymentConfigName the name of the referenced custom Deployment Configuration
   * @returns a Construct representing a reference to an existing custom Deployment Configuration
   */
  protected static fromDeploymentConfigName(scope: Construct, id: string, deploymentConfigName: string): IBaseDeploymentConfig {
    ignore(id);
    const arn = Stack.of(scope).formatArn({
      service: 'codedeploy',
      resource: 'deploymentconfig',
      resourceName: deploymentConfigName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
    return {
      deploymentConfigName: deploymentConfigName,
      deploymentConfigArn: arn,
    };
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

  public constructor(scope: Construct, id: string, props?: BaseDeploymentConfigProps) {
    super(scope, id, {
      physicalName: props?.deploymentConfigName,
    });

    // Traffic routing is not applicable to Server-based deployment configs
    if (props?.trafficRouting && (props?.computePlatform === undefined || props?.computePlatform === ComputePlatform.SERVER)) {
      throw new Error('Traffic routing config must not be specified for a Server-base deployment configuration');
    }

    // Minimum healthy hosts is only applicable to Server-based deployment configs
    if (props?.minimumHealthyHosts && props?.computePlatform && props?.computePlatform !== ComputePlatform.SERVER) {
      throw new Error('Minimum healthy hosts config must only be specified for a Server-base deployment configuration');
    }

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: this.physicalName,
      computePlatform: props?.computePlatform,
      trafficRoutingConfig: props?.trafficRouting?.bind(this),
      minimumHealthyHosts: props?.minimumHealthyHosts?._json,
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

function ignore(_x: any) { return; }
