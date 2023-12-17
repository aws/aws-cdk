import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { IResolvable } from 'aws-cdk-lib/core';
/**
 * Source properties
 */
export interface IPipeSourceProperties {
  /**
   * `CfnPipe.PipeSourceParametersProperty.ActiveMQBrokerParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-activemqbrokerparameters
   *
   * @default - none
   */
  readonly activeMqBrokerParameters?: CfnPipe.PipeSourceActiveMQBrokerParametersProperty | IResolvable;
  /**
   * `CfnPipe.PipeSourceParametersProperty.DynamoDBStreamParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-dynamodbstreamparameters
   *
   * @default - none
   */
  readonly dynamoDbStreamParameters?: CfnPipe.PipeSourceDynamoDBStreamParametersProperty | IResolvable;

  /**
   * `CfnPipe.PipeSourceParametersProperty.KinesisStreamParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-kinesisstreamparameters
   *
   * @default - none
   */
  readonly kinesisStreamParameters?: CfnPipe.PipeSourceKinesisStreamParametersProperty | IResolvable;
  /**
   * `CfnPipe.PipeSourceParametersProperty.ManagedStreamingKafkaParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-managedstreamingkafkaparameters
   *
   * @default - none
   */
  readonly managedStreamingKafkaParameters?: CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty | IResolvable;
  /**
   * `CfnPipe.PipeSourceParametersProperty.RabbitMQBrokerParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-rabbitmqbrokerparameters
   *
   * @default - none
   */
  readonly rabbitMqBrokerParameters?: CfnPipe.PipeSourceRabbitMQBrokerParametersProperty | IResolvable;
  /**
   * `CfnPipe.PipeSourceParametersProperty.SelfManagedKafkaParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-selfmanagedkafkaparameters
   *
   * @default - none
   */
  readonly selfManagedKafkaParameters?: CfnPipe.PipeSourceSelfManagedKafkaParametersProperty | IResolvable;
  /**
   * `CfnPipe.PipeSourceParametersProperty.SqsQueueParameters`
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceparameters.html#cfn-pipes-pipe-pipesourceparameters-sqsqueueparameters
   *
   * @default - none
   */
  readonly sqsQueueParameters?: CfnPipe.PipeSourceSqsQueueParametersProperty | IResolvable;
}

// /**
//  * Shared parameters that are available on all sources.
//  */
// interface IPipeSourceCommonParameters {
//   /**
//     * The maximum number of records to include in each batch.
//     *
//     * @default - 1
//     */
//   readonly batchSize?: Duration;

//   /**
//      * The maximum length of a time to wait for events.
//      * Must be between 0 and 300 seconds.
//      * TODO: check what is the default
//      * @default - 300
//      */
//   readonly maximumBatchingWindow?: Duration;
// }

/**
 * Source interface
 */
export interface IPipeSource {
  /**
   * The ARN of the source resource.
   */
  sourceArn: string;

  /**
   * The parameters required to set up a source for your pipe.
   */
  sourceParameters?: IPipeSourceProperties;

  /**
   * Grant the pipe role read access to the source.
   */
  grantRead(grantee: IRole): void;
}

