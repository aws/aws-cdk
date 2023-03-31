import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as logs from '../../aws-logs';
import { Construct } from 'constructs';

/**
 * Options that may be provided to LambdaDestination
 */
export interface LambdaDestinationOptions {
  /** Whether or not to add Lambda Permissions.
   * @default true
   */
  readonly addPermissions?: boolean;
}

/**
 * Use a Lambda Function as the destination for a log subscription
 */
export class LambdaDestination implements logs.ILogSubscriptionDestination {
  /**  LambdaDestinationOptions */
  constructor(private readonly fn: lambda.IFunction, private readonly options: LambdaDestinationOptions = {}) {
  }

  public bind(scope: Construct, logGroup: logs.ILogGroup): logs.LogSubscriptionDestinationConfig {
    const arn = logGroup.logGroupArn;
    if (this.options.addPermissions !== false) {
      const permissionId = 'CanInvokeLambda';
      this.fn.addPermission(permissionId, {
        principal: new iam.ServicePrincipal('logs.amazonaws.com'),
        sourceArn: arn,
        // Using SubScription Filter as scope is okay, since every Subscription Filter has only
        // one destination.
        scope,
      });
      // Need to add a dependency, otherwise the SubscriptionFilter can be created before the
      // Permission that allows the interaction.
      const cfnPermission = scope.node.tryFindChild(
        permissionId,
      ) as lambda.CfnPermission;
      if (cfnPermission) {
        scope.node.addDependency(cfnPermission);
      }
    }
    return { arn: this.fn.functionArn };
  }
}
