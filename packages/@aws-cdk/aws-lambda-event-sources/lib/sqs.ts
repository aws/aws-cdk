import lambda = require('@aws-cdk/aws-lambda');
import sqs = require('@aws-cdk/aws-sqs');

export interface SqsEventSourceProps {
  batchSize?: number;
}

export class SqsEventSource implements lambda.IEventSource {
  constructor(readonly queue: sqs.QueueRef, private readonly props: SqsEventSourceProps = { }) {
    if (this.props.batchSize !== undefined && (this.props.batchSize < 1 || this.props.batchSize > 10)) {
      throw new Error(`Maximum batch size must be between 1 and 10 inclusive (given ${this.props.batchSize})`);
    }
  }

  public bind(target: lambda.FunctionRef) {
    new lambda.EventSourceMapping(target, `SqsEventSource:${this.queue.uniqueId}`, {
      target,
      batchSize: this.props.batchSize,
      eventSourceArn: this.queue.queueArn,
    });

    this.queue.grantConsumeMessages(target.role);
  }
}