import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import { Construct } from '@aws-cdk/core';

/**
 * Use a Lamda Function as the destination for a log subscription
 */
export class LambdaDestination implements logs.ILogSubscriptionDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(_scope: Construct, logGroup: logs.ILogGroup): logs.LogSubscriptionDestinationConfig {
    const arn = logGroup.logGroupArn;

    const logSubscriptionDestinationPolicyAddedFor: string[] = [];

    if (logSubscriptionDestinationPolicyAddedFor.indexOf(arn) === -1) {
      this.fn.addPermission('InvokedByCloudWatchLogs', {
        principal: new iam.ServicePrincipal(`logs.amazonaws.com`),
        sourceArn: arn
      });
      logSubscriptionDestinationPolicyAddedFor.push(arn);
    }
    return { arn: this.fn.functionArn };
  }
}
