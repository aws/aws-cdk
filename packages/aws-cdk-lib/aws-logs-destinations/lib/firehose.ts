import { Construct } from 'constructs';
import * as iam from '../../aws-iam';
import * as firehose from '../../aws-kinesisfirehose';
import * as logs from '../../aws-logs';
import { Stack } from '../../core';

/**
 * Customize the Amazon Data Firehose Logs Destination
 */
export interface FirehoseDestinationProps {
  /**
   * The role to assume to write log events to the destination
   *
   * @default - A new Role is created
   */
  readonly role?: iam.IRole;
}

/**
 * Use a Data Firehose delivery stream as the destination for a log subscription
 */
export class FirehoseDestination implements logs.ILogSubscriptionDestination {
  /**
   * @param stream The Data Firehose delivery stream to use as destination
   * @param props The Data Firehose Destination properties
   *
   */
  constructor(private readonly stream: firehose.IDeliveryStream, private readonly props: FirehoseDestinationProps = {}) {
  }

  public bind(scope: Construct, _sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestinationConfig {
    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#FirehoseExample
    // Create a role to be assumed by CWL that can write to this stream.
    const id = 'CloudWatchLogsCanPutRecords';
    const role = this.props.role ?? scope.node.tryFindChild(id) as iam.IRole ?? new iam.Role(scope, id, {
      assumedBy: new iam.ServicePrincipal('logs.amazonaws.com', {
        conditions: {
          StringLike: {
            'aws:SourceArn': Stack.of(scope).formatArn({ service: 'logs', resource: '*' }),
          },
        },
      }),
    });
    this.stream.grantPutRecords(role);

    const policy = role.node.tryFindChild('DefaultPolicy') as iam.CfnPolicy;
    if (policy) {
      // Remove circular dependency
      const cfnRole = role.node.defaultChild as iam.CfnRole;
      cfnRole.addOverride('DependsOn', undefined);

      // Ensure policy is created before subscription filter
      scope.node.addDependency(policy);
    }

    return { arn: this.stream.deliveryStreamArn, role };
  }
}
