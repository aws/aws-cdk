import iam = require('@aws-cdk/aws-iam');
import kinesis = require('@aws-cdk/aws-kinesis');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { Construct } from '@aws-cdk/cdk';

/**
 * Use a Kinesis stream as the destination for a log subscription
 */
export class KinesisDestination implements logs.ILogSubscriptionDestination {
  constructor(private readonly stream: kinesis.IStream) {
  }

  public bind(scope: Construct, sourceLogGroup: logs.ILogGroup): logs.LogSubscriptionDestination {
    // Following example from https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/SubscriptionFilters.html#DestinationKinesisExample
    // Create a role to be assumed by CWL that can write to this stream and pass itself.
    const role = new iam.Role(scope, 'CloudWatchLogsCanPutRecords', {
      assumedBy: new iam.ServicePrincipal(`logs.amazonaws.com`)
    });
    this.stream.grantWrite(role);
    role.grantPassRole(role);

    // We've now made it possible for CloudWatch events to write to us. In case the LogGroup is in a
    // different account, we must add a Destination in between as well.
    const sourceStack = sourceLogGroup.node.stack;
    const thisStack = this.stream.node.stack;

    // Case considered: if both accounts are undefined, we can't make any assumptions. Better
    // to assume we don't need to do anything special.
    const sameAccount = sourceStack.env.account === thisStack.env.account;

    if (!sameAccount) {
      return this.crossAccountLogSubscriptionDestination(scope, sourceLogGroup, role);
    }

    return { arn: this.stream.streamArn, role };
  }

  /**
   * Generate a CloudWatch Logs Destination and return the properties in the form o a subscription destination
   */
  private crossAccountLogSubscriptionDestination(scope: Construct, sourceLogGroup: logs.ILogGroup, role: iam.IRole): logs.LogSubscriptionDestination {
    const sourceStack = sourceLogGroup.node.stack;
    const thisStack = this.stream.node.stack;

    if (!sourceStack.env.account || !thisStack.env.account) {
      throw new Error('SubscriptionFilter stack and Destination stack must either both have accounts defined, or both not have accounts');
    }

    // Take some effort to construct a unique ID for the destination that is unique to the
    // combination of (stream, loggroup).
    const uniqueId =  new cdk.HashedAddressingScheme().allocateAddress([
      sourceLogGroup.node.path.replace('/', ''),
      sourceStack.env.account!
    ]);

    // The destination lives in the target account
    const dest = new logs.CrossAccountDestination(scope, `CWLDestination${uniqueId}`, {
      targetArn: this.stream.streamArn,
      role,
    });

    dest.addToPolicy(new iam.PolicyStatement()
      .addAction('logs:PutSubscriptionFilter')
      .addAwsAccountPrincipal(sourceStack.env.account)
      .addAllResources());

    return dest.bind(scope, sourceLogGroup);
  }
}