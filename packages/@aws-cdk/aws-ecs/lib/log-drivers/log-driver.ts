import cdk = require('@aws-cdk/cdk');
import { cloudformation } from '../ecs.generated';

/**
 * Base class for log drivers
 */
export abstract class LogDriver extends cdk.Construct {
  /**
   * Return the log driver CloudFormation JSON
   */
  public abstract renderLogDriver(): cloudformation.TaskDefinitionResource.LogConfigurationProperty;
}
