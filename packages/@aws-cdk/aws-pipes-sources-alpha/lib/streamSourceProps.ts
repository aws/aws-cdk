import { Duration } from 'aws-cdk-lib';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { OnPartialBatchItemFailure } from './enums';

/**
 * Base parameters for streaming sources.
 */
export interface StreamSourceParameters {
  /**
   * The maximum number of records to include in each batch.
   *
   * Minumum: 1
   * Maxiumum: 10000
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-batchsize
   * @default 1
   */
  readonly batchSize?: number;

  /**
    * Define the target queue to send dead-letter queue events to.
    *
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-deadletterconfig
    * @default - no dead-letter queue or topic
    */
  readonly deadLetterTarget?: IQueue | ITopic;

  /**
   * The maximum length of a time to wait for events.
   *
   * Minumum: Duration.seconds(0)
   * Maxiumum: Duration.seconds(300)
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumbatchingwindowinseconds
   * @default - the events will be handled immediately
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * (Streams only) Discard records older than the specified age. The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * Minumum: Duration.seconds(60) (leave undefined to set the maximum age to -1)
   * Maxiumum: Duration.seconds(604800)
   *
   *  @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumrecordageinseconds
   * @default -1 - EventBridge won't discard old records
   */
  readonly maximumRecordAge?: Duration;

  /**
   * (Streams only) Discard records after the specified number of retries. The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * Minumum: -1
   * Maxiumum: 10000
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumretryattempts
   * @default -1 - EventBridge will retry failed records until the record expires in the event source
   */
  readonly maximumRetryAttempts?: number;

  /**
   * (Streams only) Define how to handle item process failures. {@link OnPartialBatchItemFailure.AUTOMATIC_BISECT} halves each batch and will retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-onpartialbatchitemfailure
   * @default off - EventBridge will retry the entire batch
   */
  readonly onPartialBatchItemFailure?: OnPartialBatchItemFailure;

  /**
   * (Streams only) The number of batches to process concurrently from each shard.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-parallelizationfactor
   * @default 1
   */
  readonly parallelizationFactor?: number;
}

export function validateBatchSize(batchSize?: number) {
  if (batchSize !== undefined) {
    if (batchSize < 1 || batchSize > 10000) {
      throw new Error(`Batch size must be between 1 and 10000, received ${batchSize}`);
    }
  }
}

export function validateMaximumBatchingWindow(window?: number) {
  if (window !== undefined) {
    // only need to check upper bound since Duration amounts cannot be negative
    if (window > 300) {
      throw new Error(`Maximum batching window must be between 0 and 300, received ${window}`);
    }
  }
}

export function validateMaximumRecordAge(age?: number) {
  if (age !== undefined) {
    if (age < 60 || age > 604800) {
      throw new Error(`Maximum record age in seconds must be between 60 and 604800 (leave undefined for infinite), received ${age}`);
    }
  }
}

export function validateMaxiumRetryAttemps(attempts?: number) {
  if (attempts !== undefined) {
    if (attempts < -1 || attempts > 10000) {
      throw new Error(`Maximum retry attempts must be between -1 and 10000, received ${attempts}`);
    }
  }
}

export function validateParallelizationFactor(factor?: number) {
  if (factor !== undefined) {
    if (factor < 1 || factor > 10) {
      throw new Error(`Parallelization factor must be between 1 and 10, received ${factor}`);
    }
  }
}

export function getDeadLetterTargetArn(dlq?: IQueue | ITopic): string | undefined {
  if (dlq instanceof Queue) {
    return dlq.queueArn;
  } else if (dlq instanceof Topic) {
    return dlq.topicArn;
  }
  return undefined;
}
