import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import { Names, Token } from '@aws-cdk/core';
import { StreamEventSource, StreamEventSourceProps } from './stream';

export interface DynamoEventSourceProps extends StreamEventSourceProps {
  /**
   * A list of event filtering criteria to control which events Lambda sends to
   * your function for processing. You can define up to five different filters
   * for a single event source. If an event satisfies any one of these five
   * filters, Lambda sends the event to your function. Otherwise, Lambda
   * discards the event. An event either satisfies the filter criteria or it
   * doesn't. If you're using batching windows, Lambda applies your filter
   * criteria to each new event to determine whether to add it to the current
   * batch.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventfiltering.html
   *
   * @default - none
   *
   * @example
   * import * as dynamodb from '@aws-cdk/aws-dynamodb';
   * import * as sources from '@aws-cdk/aws-lambda-event-sources';
   * declare const table: dynamodb.ITable;
   * new sources.DynamoEventSource(table, {
   *   startingPosition: lambda.StartingPosition.TRIM_HORIZON,
   *   filterPatterns: [
   *     { dynamodb: { balance: [ { numeric: [ '>', 500 ] } ] } }
   *   ]
   * });
   */
  readonly filterPatterns?: lambda.FilterPattern[];
}

/**
 * Use an Amazon DynamoDB stream as an event source for AWS Lambda.
 */
export class DynamoEventSource extends StreamEventSource {
  private _eventSourceMappingId?: string = undefined;
  private innerProps: DynamoEventSourceProps;

  constructor(private readonly table: dynamodb.ITable, props: DynamoEventSourceProps) {
    super(props);

    if (this.props.batchSize !== undefined
      && !Token.isUnresolved(this.props.batchSize)
      && (this.props.batchSize < 1 || this.props.batchSize > 1000)) {
      throw new Error(`Maximum batch size must be between 1 and 1000 inclusive (given ${this.props.batchSize})`);
    }
    if ((props.filterPatterns?.length ?? 0) > 5) {
      throw new Error(`Maximum number of filter criteria for a single event source is five (given ${props.filterPatterns?.length}).`);
    }
    this.innerProps = props;
  }

  protected enrichMappingOptions(options: lambda.EventSourceMappingOptions): lambda.EventSourceMappingOptions {
    const eventSourceMapping = super.enrichMappingOptions(options);
    return {
      ...eventSourceMapping,
      filterPatterns: this.innerProps.filterPatterns,
    };
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
