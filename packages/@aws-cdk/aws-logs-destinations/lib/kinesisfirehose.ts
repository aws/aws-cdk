import * as iam from '@aws-cdk/aws-iam';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
import * as logs from '@aws-cdk/aws-logs';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Use a Kinesis Firehose as the destination for a log subscription
 */
export class KinesisFirehoseDestination implements logs.ILogSubscriptionDestination {
  constructor(private readonly deliveryStream: firehose.IDeliveryStream) {
  }

  public bind(scope: Construct, _sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestinationConfig {
    const region = this.deliveryStream.env.region;

    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#FirehoseExample
    // Create a role to be assumed by CWL that can write to this Firehose.
    const role = new iam.Role(scope, 'CloudWatchLogsCanPutRecordsIntoKinesisFirehose', {
      assumedBy: new iam.ServicePrincipal(`logs.${region}.amazonaws.com`),
    });

    this.deliveryStream.grantPutRecords(role);

    return {
      arn: this.deliveryStream.deliveryStreamArn,
      role,
    };
  }
}
