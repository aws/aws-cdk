import kinesis = require('@aws-cdk/aws-kinesis');
import lambda = require('@aws-cdk/aws-lambda');
import {StreamEventSource, StreamingEventSourceProps} from "./stream";

export interface KinesisEventSourceProps extends StreamingEventSourceProps {
}

/**
 * Use an Amazon Kinesis stream as an event source for AWS Lambda.
 */
export class KinesisEventSource extends StreamEventSource {
  constructor(readonly stream: kinesis.IStream, props: KinesisEventSourceProps) {
    super(props, 10000);
  }

  public bind(target: lambda.IFunction) {
    target.addEventSourceMapping(`KinesisEventSource:${this.stream.node.uniqueId}`,
      this.getEventSourceMappingOptions(this.stream.streamArn)
    );

    this.stream.grantRead(target);
  }
}