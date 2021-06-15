import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as notifs from '@aws-cdk/aws-s3-notifications';

export interface S3EventSourceProps {
  /**
   * The s3 event types that will trigger the notification.
   */
  readonly events: s3.EventType[];

  /**
   * S3 object key filter rules to determine which objects trigger this event.
   * Each filter must include a `prefix` and/or `suffix` that will be matched
   * against the s3 object key. Refer to the S3 Developer Guide for details
   * about allowed filter rules.
   */
  readonly filters?: s3.NotificationKeyFilter[];
}

/**
 * Use S3 bucket notifications as an event source for AWS Lambda.
 */
export class S3EventSource implements lambda.IEventSource {
  constructor(readonly bucket: s3.Bucket, private readonly props: S3EventSourceProps) {

  }

  public bind(target: lambda.IFunction) {
    const filters = this.props.filters || [];
    for (const event of this.props.events) {
      this.bucket.addEventNotification(event, new notifs.LambdaDestination(target), ...filters);
    }
  }
}
