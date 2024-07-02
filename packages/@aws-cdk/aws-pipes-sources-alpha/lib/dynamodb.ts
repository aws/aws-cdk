import { IPipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { ITableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { DynamoDBStartingPosition } from './enums';
import { StreamSource, StreamSourceParameters } from './streamSource';

/**
 * Parameters for the DynamoDB source.
 */
export interface DynamoDBSourceParameters extends StreamSourceParameters {
  /**
   * The position in a stream from which to start reading.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
   */
  readonly startingPosition: DynamoDBStartingPosition;
}

/**
 * A source that reads from an DynamoDB stream.
 */
export class DynamoDBSource extends StreamSource {
  private readonly table: ITableV2;
  private readonly startingPosition: DynamoDBStartingPosition;
  private readonly deadLetterTargetArn?: string;

  constructor(table: ITableV2, parameters: DynamoDBSourceParameters) {
    if (table.tableStreamArn === undefined) {
      throw new Error('Table does not have a stream defined, cannot create pipes source');
    }

    super(table.tableStreamArn, parameters);
    this.table = table;
    this.startingPosition = parameters.startingPosition;
    this.deadLetterTargetArn = this.getDeadLetterTargetArn(this.deadLetterTarget);
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
          startingPosition: this.startingPosition,
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.table.grantStreamRead(grantee);
  }
}
