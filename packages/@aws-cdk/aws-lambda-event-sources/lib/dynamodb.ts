import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import {StreamEventSource, StreamEventSourceProps} from "./stream";

export interface DynamoEventSourceProps extends StreamEventSourceProps {
}

/**
 * Use an Amazon DynamoDB stream as an event source for AWS Lambda.
 */
export class DynamoEventSource extends StreamEventSource {
  constructor(private readonly table: dynamodb.Table, props: DynamoEventSourceProps) {
    super(props);

    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 1000)) {
      throw new Error(`Maximum batch size must be between 1 and 1000 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.IFunction) {
    if (!this.table.tableStreamArn) {
      throw new Error(`DynamoDB Streams must be enabled on the table ${this.table.node.path}`);
    }

    target.addEventSourceMapping(`DynamoDBEventSource:${this.table.node.uniqueId}`,
      this.getEventSourceMappingOptions(this.table.tableStreamArn)
    );

    this.table.grantStreamRead(target);
    dynamodb.Table.grantListStreams(target);
  }
}
