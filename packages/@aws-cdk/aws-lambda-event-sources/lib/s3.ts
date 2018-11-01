import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');

export interface S3EventSourceProps {
  events: s3.EventType[];
  filters?: s3.NotificationKeyFilter[];
}

export class S3EventSource implements lambda.IEventSource {
  constructor(readonly bucket: s3.Bucket, private readonly props: S3EventSourceProps) {

  }

  public bind(target: lambda.FunctionRef) {
    const filters = this.props.filters || [];
    for (const event of this.props.events) {
      this.bucket.onEvent(event, target, ...filters);
    }
  }
}
