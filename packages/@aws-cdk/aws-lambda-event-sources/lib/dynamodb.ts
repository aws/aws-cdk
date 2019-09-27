import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import {StreamEventSource, StreamingEventSourceProps} from "./stream";

export interface DynamoEventSourceProps extends StreamingEventSourceProps {
}

/**
 * Use an Amazon DynamoDB stream as an event source for AWS Lambda.
 */
export class DynamoEventSource extends StreamEventSource {
  constructor(private readonly table: dynamodb.Table, props: DynamoEventSourceProps) {
    super(props, 1000);
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
