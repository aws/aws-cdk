import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');

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
  batchSize?: number;

  /**
   * Where to begin consuming the DynamoDB stream.
   */
  startingPosition: lambda.StartingPosition;
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

  public bind(target: lambda.FunctionBase) {
    new lambda.EventSourceMapping(target, `DynamoDBEventSource:${this.table.node.uniqueId}`, {
      target,
      batchSize: this.props.batchSize || 100,
      eventSourceArn: this.table.tableStreamArn,
      startingPosition: this.props.startingPosition
    });

    this.table.grantStreamRead(target.role);
    dynamodb.Table.grantListStreams(target.role);
  }
}
