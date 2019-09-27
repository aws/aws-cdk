import kinesis = require('@aws-cdk/aws-kinesis');
import lambda = require('@aws-cdk/aws-lambda');
import {StreamEventSource, StreamEventSourceProps} from './stream';

export interface KinesisEventSourceProps extends StreamEventSourceProps {
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource extends StreamEventSource {
  constructor(readonly stream: kinesis.IStream, props: KinesisEventSourceProps) {
    super(props);
    
    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 10000)) {
      throw new Error(`Maximum batch size must be between 1 and 10000 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(`KinesisEventSource:${this.stream.node.uniqueId}`,
      this.getEventSourceMappingOptions(this.stream.streamArn)
    );

    this.stream.grantRead(target);
  }
}