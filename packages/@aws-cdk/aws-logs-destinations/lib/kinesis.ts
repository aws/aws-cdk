import iam = require('@aws-cdk/aws-iam');
import kinesis = require('@aws-cdk/aws-kinesis');
import logs = require('@aws-cdk/aws-logs');
import { Construct } from '@aws-cdk/cdk';

/**
 * Use a Kinesis stream as the destination for a log subscription
 */
export class KinesisDestination implements logs.ILogSubscriptionDestination {
  constructor(private readonly stream: kinesis.IStream) {
  }

  public bind(scope: Construct, _sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestination {
    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#DestinationKinesisExample
    // Create a role to be assumed by CWL that can write to this stream and pass itself.
    const role = new iam.Role(scope, 'CloudWatchLogsCanPutRecords', {
      assumedBy: new iam.ServicePrincipal(`logs.amazonaws.com`)
    });
    this.stream.grantWrite(role);
    role.grantPassRole(role);
    return { arn: this.stream.streamArn, role };
  }
}