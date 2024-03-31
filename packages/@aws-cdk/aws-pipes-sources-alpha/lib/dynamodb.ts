import { IPipe, SourceConfig, SourceWithDlq } from '@aws-cdk/aws-pipes-alpha';
import { ITableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { ITopic } from 'aws-cdk-lib/aws-sns';
import { IQueue } from 'aws-cdk-lib/aws-sqs';
import { DynamoDBStartingPosition } from './enums';
import {
  StreamSourceParameters,
  grantDlqPush,
  getDeadLetterTargetArn,
  validateBatchSize,
  validateMaximumBatchingWindow,
  validateMaximumRecordAge,
  validateMaxiumRetryAttemps,
  validateParallelizationFactor,
} from './streamSource';

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
export class DynamoDBSource extends SourceWithDlq {
  private readonly table: ITableV2;
  private sourceParameters: DynamoDBSourceParameters;
  private deadLetterTarget?: IQueue | ITopic;

  constructor(table: ITableV2, parameters: DynamoDBSourceParameters) {
    if (table.tableStreamArn === undefined) {
      throw new Error('Table does not have a stream defined, cannot create pipes source');
    }

    super(table.tableStreamArn, getDeadLetterTargetArn(parameters.deadLetterTarget));

    this.table = table;
    this.sourceParameters = parameters;
    this.deadLetterTarget = this.sourceParameters.deadLetterTarget;

    validateBatchSize(this.sourceParameters.batchSize);
    validateMaximumBatchingWindow(this.sourceParameters.maximumBatchingWindow?.toSeconds());
    validateMaximumRecordAge(this.sourceParameters.maximumRecordAge?.toSeconds());
    validateMaxiumRetryAttemps(this.sourceParameters.maximumRetryAttempts);
    validateParallelizationFactor(this.sourceParameters.parallelizationFactor);
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
    grantDlqPush(grantee, this.deadLetterTarget);
  }
}
