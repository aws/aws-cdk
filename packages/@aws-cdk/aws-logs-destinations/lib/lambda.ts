import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import { Construct } from '@aws-cdk/cdk';

/**
 * Use a Lamda Function as the destination for a log subscription
 */
export class LambdaDestination implements logs.ILogSubscriptionDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(_scope: Construct, logGroup: logs.ILogGroup): logs.LogSubscriptionDestination {
    const arn = logGroup.logGroupArn;

    const logSubscriptionDestinationPolicyAddedFor: string[] = [];

    if (logSubscriptionDestinationPolicyAddedFor.indexOf(arn) === -1) {
      // NOTE: the use of {AWS::Region} limits this to the same region, which shouldn't really be an issue,
      // since the Lambda must be in the same region as the SubscriptionFilter anyway.
      //
      // (Wildcards in principals are unfortunately not supported.
      this.fn.addPermission('InvokedByCloudWatchLogs', {
        principal: new iam.ServicePrincipal(`logs.amazonaws.com`),
        sourceArn: arn
      });
      logSubscriptionDestinationPolicyAddedFor.push(arn);
    }
    return { arn: this.fn.functionArn };
  }
}