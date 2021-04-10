import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { Names } from '@aws-cdk/core';
import { StreamEventSource, StreamEventSourceProps } from './stream';

export interface DynamoEventSourceProps extends StreamEventSourceProps {
}

/**
 * Use an Amazon DynamoDB stream as an event source for AWS Lambda.
 */
export class DynamoEventSource extends StreamEventSource {
  private _eventSourceMappingId?: string = undefined;

  constructor(private readonly table: dynamodb.ITable, props: DynamoEventSourceProps) {
    super(props);

    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 1000)) {
      throw new Error(`Maximum batch size must be between 1 and 1000 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.IFunction) {
    if (!this.table.tableStreamArn) {
      throw new Error(`DynamoDB Streams must be enabled on the table ${this.table.node.path}`);
    }

    const eventSourceMapping = target.addEventSourceMapping(`DynamoDBEventSource:${Names.nodeUniqueId(this.table.node)}`,
      this.enrichMappingOptions({ eventSourceArn: this.table.tableStreamArn }),
    );
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;

    this.table.grantStreamRead(target);
  }

  /**
   * The identifier for this EventSourceMapping
   */
  public get eventSourceMappingId(): string {
    if (!this._eventSourceMappingId) {
      throw new Error('DynamoEventSource is not yet bound to an event source mapping');
    }
    return this._eventSourceMappingId;
  }
}
