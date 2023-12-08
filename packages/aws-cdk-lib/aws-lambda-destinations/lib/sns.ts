import { Construct } from 'constructs';
import * as lambda from '../../aws-lambda';
import * as sns from '../../aws-sns';

/**
 * Use a SNS topic as a Lambda destination
 */
export class SnsDestination implements lambda.IDestination {
  private readonly _topic: sns.ITopic;

  constructor(topic: sns.ICfnTopic) {
    this._topic = sns.Topic.fromCfnTopic(topic);
  }

  /**
   * Returns a destination configuration
   */
  public bind(_scope: Construct, fn: lambda.IFunction, _options?: lambda.DestinationOptions): lambda.DestinationConfig {
    // deduplicated automatically
    this._topic.grantPublish(fn);

    return {
      destination: this._topic.attrTopicArn,
    };
  }
}
