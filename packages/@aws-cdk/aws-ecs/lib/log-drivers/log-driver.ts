import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from '../container-definition';
import { CfnTaskDefinition } from '../ecs.generated';

/**
 * Base class for log drivers
 */
export abstract class LogDriver extends cdk.Construct {
  /**
   * Return the log driver CloudFormation JSON
   */
  public abstract renderLogDriver(): CfnTaskDefinition.LogConfigurationProperty;

  /**
   * Called when the log driver is configured on a container
   */
  public abstract bind(containerDefinition: ContainerDefinition): void;
}
