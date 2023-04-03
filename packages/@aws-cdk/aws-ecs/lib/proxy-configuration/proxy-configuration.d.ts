import { Construct } from 'constructs';
import { TaskDefinition } from '../base/task-definition';
import { CfnTaskDefinition } from '../ecs.generated';
/**
 * The base class for proxy configurations.
 */
export declare abstract class ProxyConfiguration {
    /**
     * Called when the proxy configuration is configured on a task definition.
     */
    abstract bind(_scope: Construct, _taskDefinition: TaskDefinition): CfnTaskDefinition.ProxyConfigurationProperty;
}
