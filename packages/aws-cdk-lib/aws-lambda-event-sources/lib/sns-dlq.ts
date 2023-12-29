import { DlqDestinationConfig, IEventSourceDlq, IEventSourceMapping, IFunction } from '../../aws-lambda';
import * as sns from '../../aws-sns';

/**
 * An SNS dead letter queue destination configuration for a Lambda event source
 */
export class SnsDlq implements IEventSourceDlq {
  private readonly _topic: sns.ITopic;

  constructor(topic: sns.ICfnTopic) {
    this._topic = sns.Topic.fromCfnTopic(topic);
  }

  /**
   * Returns a destination configuration for the DLQ
   */
  public bind(_target: IEventSourceMapping, targetHandler: IFunction): DlqDestinationConfig {
    this._topic.grantPublish(targetHandler);

    return {
      destination: this._topic.attrTopicArn,
    };
  }
}
