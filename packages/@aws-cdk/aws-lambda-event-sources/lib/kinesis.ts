import kinesis = require('@aws-cdk/aws-kinesis');
import lambda = require('@aws-cdk/aws-lambda');

export interface KinesisEventSourceProps {
  /**
   * The largest number of records that AWS Lambda will retrieve from your event
   * source at the time of invoking your function. Your function receives an
   * event with all the retrieved records.
   *
   * Valid Range: Minimum value of 1. Maximum value of 10000.
   *
   * @default 100
   */
  batchSize?: number;

  /**
   * Where to begin consuming the Kinesis stream.
   */
  startingPosition: lambda.StartingPosition;
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource implements lambda.IEventSource {
  constructor(readonly stream: kinesis.IStream, private readonly props: KinesisEventSourceProps) {
    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 10000)) {
      throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.FunctionBase) {
    new lambda.EventSourceMapping(target, `KinesisEventSource:${this.stream.node.uniqueId}`, {
      target,
      batchSize: this.props.batchSize || 100,
      startingPosition: this.props.startingPosition,
      eventSourceArn: this.stream.streamArn,
    });

    this.stream.grantRead(target.role);
  }
}