import { CfnTopicRule } from './iot.generated';
import { ITopicRule } from './topic-rule';

/**
 * An abstract action for TopicRule.
 */
export interface IAction {
  /**
   * Returns the topic rule action specification.
   *
   * @param topicRule The TopicRule that would trigger this action.
   * @internal
   */
  _bind(topicRule: ITopicRule): ActionConfig;
}

/**
 * Properties for an topic rule action
 */
export interface ActionConfig {
  /**
   * The configuration for this action.
   */
  readonly configuration: CfnTopicRule.ActionProperty;
}
