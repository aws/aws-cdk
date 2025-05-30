import { StreamEventSource, StreamEventSourceProps } from './stream';
import * as dynamodb from '../../aws-dynamodb';
import * as lambda from '../../aws-lambda';
import { Names, Token, ValidationError } from '../../core';

export interface DynamoEventSourceProps extends StreamEventSourceProps {
}

/**
 * Use an Amazon DynamoDB stream as an event source for AWS Lambda.
 */
export class DynamoEventSource extends StreamEventSource {
  private _eventSourceMappingId?: string = undefined;
  private _eventSourceMappingArn?: string = undefined;

  constructor(private readonly table: dynamodb.ITable, props: DynamoEventSourceProps) {
    super(props);

    if (this.props.batchSize !== undefined
      && !Token.isUnresolved(this.props.batchSize)
      && (this.props.batchSize < 1 || this.props.batchSize > 10000)) {
      throw new ValidationError(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`, table);
    }
  }

  public bind(target: lambda.IFunction) {
    if (!this.table.tableStreamArn) {
      throw new ValidationError(`DynamoDB Streams must be enabled on the table ${this.table.node.path}`, this.table);
    }

    const eventSourceMapping = target.addEventSourceMapping(`DynamoDBEventSource:${Names.nodeUniqueId(this.table.node)}`,
      this.enrichMappingOptions({
        eventSourceArn: this.table.tableStreamArn,
        metricsConfig: this.props.metricsConfig,
        supportS3OnFailureDestination: true,
      }),
    );
    this._eventSourceMappingId = eventSourceMapping.eventSourceMappingId;
    this._eventSourceMappingArn = eventSourceMapping.eventSourceMappingArn;

    this.table.grantStreamRead(target);
  }

  /**
   * The identifier for this EventSourceMapping
   */
  public get eventSourceMappingId(): string {
    if (!this._eventSourceMappingId) {
      throw new ValidationError('DynamoEventSource is not yet bound to an event source mapping', this.table);
    }
    return this._eventSourceMappingId;
  }

  /**
   * The ARN for this EventSourceMapping
   */
  public get eventSourceMappingArn(): string {
    if (!this._eventSourceMappingArn) {
      throw new ValidationError('DynamoEventSource is not yet bound to an event source mapping', this.table);
    }
    return this._eventSourceMappingArn;
  }
}
