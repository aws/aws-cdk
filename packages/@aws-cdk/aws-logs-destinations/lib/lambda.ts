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

  public bind(scope: Construct, logGroup: logs.ILogGroup): logs.LogSubscriptionDestinationConfig {
    const arn = logGroup.logGroupArn;

    this.fn.addPermission('CanInvokeLambda', {
      principal: new iam.ServicePrincipal(`logs.amazonaws.com`),
      sourceArn: arn,
      // Using SubScription Filter as scope is okay, since every Subscription Filter has only
      // one destination.
      scope
    });
    return { arn: this.fn.functionArn };
  }
}