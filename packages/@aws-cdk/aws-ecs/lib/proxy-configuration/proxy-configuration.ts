import { TaskDefinition } from '../base/task-definition';
import { CfnTaskDefinition } from '../ecs.generated';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * The base class for proxy configurations.
 */
export abstract class ProxyConfiguration {
  /**
   * Called when the proxy configuration is configured on a task definition.
   */
  public abstract bind(_scope: CoreConstruct, _taskDefinition: TaskDefinition): CfnTaskDefinition.ProxyConfigurationProperty;
}