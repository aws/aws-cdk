import { CfnTopicRule } from './iot.generated';
import { ITopicRule } from './topic-rule-ref';

/**
 * An abstract action for TopicRule.
 */
export interface IAction {
  /**
   * Returns the topic rule action specification.
   *
   * @param rule The TopicRule that would trigger this action.
   */
  bind(rule: ITopicRule): ActionConfig;
}

/**
 * Properties for an topic rule action
 */
export interface ActionConfig {
  /**
   * An action to set state of an Amazon CloudWatch alarm.
   * @default None
   */
  readonly cloudwatchAlarm?: CfnTopicRule.CloudwatchAlarmActionProperty;
  /**
   * An action to send data to Amazon CloudWatch Logs.
   * @default None
   */
  readonly cloudwatchLogs?: CfnTopicRule.CloudwatchLogsActionProperty;
  /**
   * An action to capture an Amazon CloudWatch metric.
   * @default None
   */
  readonly cloudwatchMetric?: CfnTopicRule.CloudwatchMetricActionProperty;
  /**
   * An action to write all or part of an MQTT message to an Amazon DynamoDB table.
   * @default None
   */
  readonly dynamoDb?: CfnTopicRule.DynamoDBActionProperty;
  /**
   * An action to write all or part of an MQTT message to an Amazon DynamoDB table.
   * @default None
   */
  readonly dynamoDBv2?: CfnTopicRule.DynamoDBv2ActionProperty;
  /**
   * An action to write data from MQTT messages to an Amazon OpenSearch Service domain.
   * @default None
   */
  readonly elasticsearch?: CfnTopicRule.ElasticsearchActionProperty;
  /**
   * An action to send data from an MQTT message to an Amazon Kinesis Data Firehose stream.
   * @default None
   */
  readonly firehose?: CfnTopicRule.FirehoseActionProperty;
  /**
   * An action to send data from an MQTT message to a web application or service.
   * @default None
   */
  readonly http?: CfnTopicRule.HttpActionProperty;
  /**
   * An action to send data from an MQTT message to an AWS IoT Analytics channel.
   * @default None
   */
  readonly iotAnalytics?: CfnTopicRule.IotAnalyticsActionProperty;
  /**
   * An action to send data from an MQTT message to an AWS IoT Events input.
   * @default None
   */
  readonly iotEvents?: CfnTopicRule.IotEventsActionProperty;
  /**
   * An action to send data from an MQTT message to asset properties in AWS IoT SiteWise.
   * @default None
   */
  readonly iotSiteWise?: CfnTopicRule.IotSiteWiseActionProperty;
  /**
   * An action to sends messages directly to your Amazon MSK or self-managed Apache Kafka clusters for data analysis and visualization.
   * @default None
   */
  readonly kafka?: CfnTopicRule.KafkaActionProperty;
  /**
   * An action to write data from an MQTT message to Amazon Kinesis Data Streams.
   * @default None
   */
  readonly kinesis?: CfnTopicRule.KinesisActionProperty;
  /**
   * An action to invoke an AWS Lambda function, passing in an MQTT message.
   * @default None
   */
  readonly lambda?: CfnTopicRule.LambdaActionProperty;
  /**
   * An action to republish an MQTT message to another MQTT topic.
   * @default None
   */
  readonly republish?: CfnTopicRule.RepublishActionProperty;
  /**
   * An action to write the data from an MQTT message to an Amazon S3 bucket.
   * @default None
   */
  readonly s3?: CfnTopicRule.S3ActionProperty;
  /**
   * An action to send the data from an MQTT message as an Amazon SNS push notification.
   * @default None
   */
  readonly sns?: CfnTopicRule.SnsActionProperty;
  /**
   * An action to send data from an MQTT message to an Amazon SQS queue.
   * @default None
   */
  readonly sqs?: CfnTopicRule.SqsActionProperty;
  /**
   * An action to start an AWS Step Functions state machine.
   * @default None
   */
  readonly stepFunctions?: CfnTopicRule.StepFunctionsActionProperty;
  /**
   * An action to write attributes (measures) from an MQTT message into an Amazon Timestream table.
   * @default None
   */
  readonly timestream?: CfnTopicRule.TimestreamActionProperty;
}
