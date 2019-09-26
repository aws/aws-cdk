import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import { Duration } from "@aws-cdk/core";

export interface DynamoEventSourceProps {
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range: Minimum value of 1. Maximum value of 1000.
   *
   * @default 100
   */
  readonly batchSize?: number;

  /**
   * Where to begin consuming the DynamoDB stream.
   */
  readonly startingPosition: lambda.StartingPosition;

  /**
   * The maximum amount of time to gather records before invoking the function.
   * Maximum of Duration.minutes(5)
   *
   * @default Duration.seconds(0)
   */
  readonly maximumBatchingWindow?: Duration;
}

/**
 * Use an Amazon DynamoDB stream as an event source for AWS Lambda.
 */
export class DynamoEventSource implements lambda.IEventSource {
  constructor(private readonly table: dynamodb.Table, private readonly props: DynamoEventSourceProps) {
    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 1000)) {
      throw new Error(`Maximum batch size must be between 1 and 1000 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.IFunction) {
    if (!this.table.tableStreamArn) {
      throw new Error(`DynamoDB Streams must be enabled on the table ${this.table.node.path}`);
    }

    target.addEventSourceMapping(`DynamoDBEventSource:${this.table.node.uniqueId}`, {
      batchSize: this.props.batchSize || 100,
      eventSourceArn: this.table.tableStreamArn,
      startingPosition: this.props.startingPosition,
      maximumBatchingWindow: this.props.maximumBatchingWindow,
    });

    this.table.grantStreamRead(target);
    dynamodb.Table.grantListStreams(target);
  }
}
