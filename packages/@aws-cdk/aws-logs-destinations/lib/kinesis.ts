import * as iam from '@aws-cdk/aws-iam';
import * as kinesis from '@aws-cdk/aws-kinesis';
import * as logs from '@aws-cdk/aws-logs';
import { Construct } from 'constructs';

/**
 * Customize the Kinesis Logs Destination
 */
export interface KinesisDestinationProps {
  /**
   * The role to assume to write log events to the destination
   *
   * @default - A new Role is created
   */
  readonly role?: iam.IRole;
}

/**
 * Use a Kinesis stream as the destination for a log subscription
 */
export class KinesisDestination implements logs.ILogSubscriptionDestination {
  /**
   * @param stream The Kinesis stream to use as destination
   * @param props The Kinesis Destination properties
   *
   */
  constructor(private readonly stream: kinesis.IStream, private readonly props: KinesisDestinationProps = {}) {
  }

  public bind(scope: Construct, _sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestinationConfig {
    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#DestinationKinesisExample
    // Create a role to be assumed by CWL that can write to this stream and pass itself.
    const id = 'CloudWatchLogsCanPutRecords';
    const role = this.props.role ?? scope.node.tryFindChild(id) as iam.IRole ?? new iam.Role(scope, id, {
      assumedBy: new iam.ServicePrincipal('logs.amazonaws.com'),
    });
    this.stream.grantWrite(role);
    role.grantPassRole(role);
    return { arn: this.stream.streamArn, role };
  }
}
