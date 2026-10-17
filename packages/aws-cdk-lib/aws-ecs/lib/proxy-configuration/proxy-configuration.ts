import type { Construct } from 'constructs';
import type { TaskDefinition } from '../base/task-definition';
import type { CfnTaskDefinition } from '../ecs.generated';

/**
 * The base class for proxy configurations.
 */
export abstract class ProxyConfiguration {
  /**
   * Called when the proxy configuration is configured on a task definition.
   */
  public abstract bind(_scope: Construct, _taskDefinition: TaskDefinition): CfnTaskDefinition.ProxyConfigurationProperty;
}
