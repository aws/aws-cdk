import { Duration, Resource } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';
import { Construct } from 'constructs';
import { arnForDeploymentConfig } from '../utils';
import { ILambdaDeploymentConfig } from './deployment-config';

/**
 * Lambda Deployment config type
 */
export enum CustomLambdaDeploymentConfigType {
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
 * Properties of a reference to a CodeDeploy Lambda Deployment Configuration.
 */
export interface CustomLambdaDeploymentConfigProps {

  /**
   * The type of deployment config, either CANARY or LINEAR
   */
  readonly type: CustomLambdaDeploymentConfigType;

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
}

/**
 * A custom Deployment Configuration for a Lambda Deployment Group.
 * @resource AWS::CodeDeploy::DeploymentGroup
 */
export class CustomLambdaDeploymentConfig extends Resource implements ILambdaDeploymentConfig {

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

  public constructor(scope: Construct, id: string, props: CustomLambdaDeploymentConfigProps) {
    super(scope, id);
    this.validateParameters(props);

    const deploymentType = 'TimeBased' + props.type.toString();
    const intervalMinutes = props.interval.toMinutes().toString();
    const percentage = props.percentage.toString();

    let routingConfig;
    let customDeploymentConfigName = `${percentage}Percent${intervalMinutes}Minutes`;
    if (props.type == CustomLambdaDeploymentConfigType.CANARY) {
      routingConfig = {
        type: deploymentType,
        timeBasedCanary: {
          canaryInterval: intervalMinutes,
          canaryPercentage: percentage,
        },
      };
      customDeploymentConfigName = `LambdaCanary${customDeploymentConfigName}`;
    } else if (props.type == CustomLambdaDeploymentConfigType.LINEAR) {
      routingConfig = {
        type: deploymentType,
        timeBasedLinear: {
          linearInterval: intervalMinutes,
          linearPercentage: percentage,
        },
      };
      customDeploymentConfigName = `LambdaLinear${customDeploymentConfigName}`;
    }

    // What the config is called in the AWS console
    // We tack the id on so that, if the user has multiple configs with identical settings,
    // deleting one will not affect the other
    const resourceName = id + customDeploymentConfigName;
    this.deploymentConfigName = resourceName;
    this.deploymentConfigArn = arnForDeploymentConfig(resourceName);

    // The AWS Custom Resource that calls CodeDeploy to create and delete the resource
    new AwsCustomResource(this, 'DeploymentConfig', {
      onCreate: { // Run on creation only, to make the resource
        service: 'CodeDeploy',
        action: 'createDeploymentConfig',
        parameters: {
          deploymentConfigName: resourceName,
          computePlatform: 'Lambda',
          trafficRoutingConfig: routingConfig,
        },
        // This `resourceName` is the initial physical ID of the config
        physicalResourceId: PhysicalResourceId.of(resourceName),
      },
      onUpdate: { // Run on stack update
        service: 'CodeDeploy',
        action: 'createDeploymentConfig',
        parameters: {
          deploymentConfigName: resourceName,
          computePlatform: 'Lambda',
          trafficRoutingConfig: routingConfig,
        },
        // If `resourceName` is different from the last stack update (or creation),
        // the old config gets deleted and the new one is created
        physicalResourceId: PhysicalResourceId.of(resourceName),
      },
      onDelete: { // Run on deletion, or on resource replacement
        service: 'CodeDeploy',
        action: 'deleteDeploymentConfig',
        parameters: {
          deploymentConfigName: resourceName,
        },
      },
      // Least permissions, only have permission to create or delete this exact config
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [this.deploymentConfigArn],
      }),
    });
  }

  private validateParameters(props: CustomLambdaDeploymentConfigProps): void {
    if ( !(1 <= props.percentage && props.percentage <= 99) ) {
      throw new Error('Invalid deployment config percentage "' + props.percentage.toString()
        + '". Step percentage must be an integer between 1 and 99.');
    }
    if (props.interval.toMinutes() > 2880) {
      throw new Error('Invalid deployment config interval "' + props.interval.toString()
        + '". Traffic shifting intervals must be positive integers up to 2880 (2 days).');
    }
  }
}
