import { IPipe, ISource, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ITableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
import { DynamoDBStartingPosition } from './enums';
import {
  StreamSourceParameters,
  getDeadLetterTargetArn,
  validateBatchSize,
  validateMaximumBatchingWindow,
  validateMaximumRecordAge,
  validateMaxiumRetryAttemps,
  validateParallelizationFactor,
} from './streamSourceProps';

/**
 * Parameters for the DynamoDB source.
 */
export interface DynamoDBSourceParameters extends StreamSourceParameters {
  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
   */
  readonly startingPosition: DynamoDBStartingPosition;
}

/**
 * A source that reads from an DynamoDB stream.
 */
export class DynamoDBSource implements ISource {
  private readonly table: ITableV2;
  readonly sourceArn: string;
  private sourceParameters: DynamoDBSourceParameters;

  private deadLetterTarget?: IQueue | ITopic;
  private deadLetterTargetArn?: string;

  constructor(table: ITableV2, parameters: DynamoDBSourceParameters) {
    this.table = table;

    if (table.tableStreamArn === undefined) {
      throw new Error('Table does not have a stream defined, cannot create pipes source');
    }

    this.sourceArn = table.tableStreamArn;
    this.sourceParameters = parameters;
    this.deadLetterTarget = this.sourceParameters.deadLetterTarget;

    validateBatchSize(this.sourceParameters.batchSize);
    validateMaximumBatchingWindow(this.sourceParameters.maximumBatchingWindow?.toSeconds());
    validateMaximumRecordAge(this.sourceParameters.maximumRecordAge?.toSeconds());
    validateMaxiumRetryAttemps(this.sourceParameters.maximumRetryAttempts);
    validateParallelizationFactor(this.sourceParameters.parallelizationFactor);

    this.deadLetterTargetArn = getDeadLetterTargetArn(this.sourceParameters.deadLetterTarget);
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: {
        dynamoDbStreamParameters: {
          batchSize: this.sourceParameters.batchSize,
          deadLetterConfig: this.deadLetterTargetArn ? { arn: this.deadLetterTargetArn } : undefined,
          maximumBatchingWindowInSeconds: this.sourceParameters.maximumBatchingWindow?.toSeconds(),
          maximumRecordAgeInSeconds: this.sourceParameters.maximumRecordAge?.toSeconds(),
          maximumRetryAttempts: this.sourceParameters.maximumRetryAttempts,
          onPartialBatchItemFailure: this.sourceParameters.onPartialBatchItemFailure,
          parallelizationFactor: this.sourceParameters.parallelizationFactor,
          startingPosition: this.sourceParameters.startingPosition,
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.table.grantStreamRead(grantee);
  }

  grantDlqPush(grantee: IRole): void {
    if (this.deadLetterTarget instanceof Queue) {
      this.deadLetterTarget.grantSendMessages(grantee);
    } else if (this.deadLetterTarget instanceof Topic) {
      this.deadLetterTarget.grantPublish(grantee);
    }
  }
}
