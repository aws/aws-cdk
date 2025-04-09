import { Construct } from 'constructs';
import { CfnDeploymentConfig } from './codedeploy.generated';
import { MinimumHealthyHosts, MinimumHealthyHostsPerZone } from './host-health-config';
import { arnForDeploymentConfig, validateName } from './private/utils';
import { TrafficRouting } from './traffic-routing-config';
import { ArnFormat, Duration, Resource, Stack, ValidationError } from '../../core';

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
  ECS = 'ECS',
}

/**
 * Configuration for CodeDeploy to deploy your application to one Availability Zone at a time within an AWS Region.
 */
export interface ZonalConfig {
  /**
   * The period of time that CodeDeploy must wait after completing a deployment to an Availability Zone.
   *
   * Accepted Values:
   *  * 0
   *  * Greater than or equal to 1
   *
   * @default - CodeDeploy starts deploying to the next Availability Zone immediately
   */
  readonly monitorDuration?: Duration;

  /**
   * The period of time that CodeDeploy must wait after completing a deployment to the first Availability Zone.
   *
   * Accepted Values:
   *  * 0
   *  * Greater than or equal to 1
   *
   * @default - the same value as `monitorDuration`
   */
  readonly firstZoneMonitorDuration?: Duration;

  /**
   * The number or percentage of instances that must remain available per Availability Zone during a deployment.
   * This option works in conjunction with the `minimumHealthyHosts` option.
   *
   * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/instances-health.html#minimum-healthy-hosts-az
   *
   * @default - 0 percent
   */
  readonly minimumHealthyHostsPerZone?: MinimumHealthyHostsPerZone;
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

  /**
   * Configure CodeDeploy to deploy your application to one Availability Zone at a time within an AWS Region.
   *
   * @see https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html#zonal-config
   *
   * @default - deploy your application to a random selection of hosts across a Region
   */
  readonly zonalConfig?: ZonalConfig;
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
      throw new ValidationError('Traffic routing config must not be specified for a Server-base deployment configuration', this);
    }

    // Minimum healthy hosts is only applicable to Server-based deployment configs
    if (props?.minimumHealthyHosts && props?.computePlatform && props?.computePlatform !== ComputePlatform.SERVER) {
      throw new ValidationError('Minimum healthy hosts config must only be specified for a Server-base deployment configuration', this);
    }

    if (props?.zonalConfig) {
      if (props.zonalConfig.monitorDuration) {
        this.validateMinimumDuration(props.zonalConfig.monitorDuration, 'monitorDuration');
      }
      if (props.zonalConfig.firstZoneMonitorDuration) {
        this.validateMinimumDuration(props.zonalConfig.firstZoneMonitorDuration, 'firstZoneMonitorDuration');
      }
    }

    const resource = new CfnDeploymentConfig(this, 'Resource', {
      deploymentConfigName: this.physicalName,
      computePlatform: props?.computePlatform,
      trafficRoutingConfig: props?.trafficRouting?.bind(this),
      minimumHealthyHosts: props?.minimumHealthyHosts?._json,
      zonalConfig: props?.zonalConfig ? {
        monitorDurationInSeconds: props.zonalConfig.monitorDuration?.toSeconds(),
        firstZoneMonitorDurationInSeconds: props.zonalConfig.firstZoneMonitorDuration?.toSeconds(),
        minimumHealthyHostsPerZone: props.zonalConfig.minimumHealthyHostsPerZone?._json,
      } : undefined,
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

  private validateMinimumDuration(duration: Duration, name: string) {
    const milliseconds = duration.toMilliseconds();
    if (milliseconds > 0 && milliseconds < 1000) {
      throw new ValidationError(`${name} must be greater than or equal to 1 second or be equal to 0, got ${milliseconds}ms`, this);
    }
  }
}

function ignore(_x: any) { return; }
