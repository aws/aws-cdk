import { IPipe, ISource, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { Duration } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

/**
 * Parameters for the SQS source.
 */
export interface SqsSourceParameters {
  /**
    * The maximum number of records to include in each batch.
    *
    * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-batchsize
    * @default 10
    */
  readonly batchSize?: number;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-maximumbatchingwindowinseconds
   * @default 1
   */
  readonly maximumBatchingWindow?: Duration;
}

/**
 * A source that reads from an SQS queue.
 */
export class SqsSource implements ISource {
  private readonly queue: IQueue;
  readonly sourceArn;
  private sourceParameters;

  constructor(queue: IQueue, parameters?: SqsSourceParameters) {
    this.queue = queue;
    this.sourceArn = queue.queueArn;
    if (parameters) {
      this.sourceParameters = parameters;
    }
  }

  bind(_pipe: IPipe): SourceConfig {
    if (!this.sourceParameters) {
      return {};
    }

    return {
      sourceParameters: {
        sqsQueueParameters: {
          batchSize: this.sourceParameters?.batchSize,
          maximumBatchingWindowInSeconds: this.sourceParameters?.maximumBatchingWindow?.toSeconds(),
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.queue.grantConsumeMessages(grantee);
  }

}

