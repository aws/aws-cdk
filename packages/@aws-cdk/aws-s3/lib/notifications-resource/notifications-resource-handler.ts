import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * A Lambda-based custom resource handler that provisions S3 bucket
 * notifications for a bucket.
 *
 * The resource property schema is:
 *
 * {
 *   BucketName: string, NotificationConfiguration: { see
 *   PutBucketNotificationConfiguration }
 * }
 *
 * For 'Delete' operations, we send an empty NotificationConfiguration as
 * required. We propagate errors and results as-is.
 *
 * Sadly, we can't use @aws-cdk/aws-lambda as it will introduce a dependency
 * cycle, so this uses raw `cdk.Resource`s.
 */
export class NotificationsResourceHandler extends Construct {
  /**
   * Defines a stack-singleton lambda function with the logic for a CloudFormation custom
   * resource that provisions bucket notification configuration for a bucket.
   *
   * @returns The ARN of the custom resource lambda function.
   */
  public static singleton(context: Construct) {
    const root = cdk.Stack.of(context);

    // well-known logical id to ensure stack singletonity
    const logicalId = 'BucketNotificationsHandler050a0587b7544547bf325f094a3db834';
    let lambdaNotificationsResourceHandler = root.node.tryFindChild(logicalId) as NotificationsResourceHandler;
    if (!lambdaNotificationsResourceHandler) {
      lambdaNotificationsResourceHandler = new NotificationsResourceHandler(root, logicalId);
    }

    return lambdaNotificationsResourceHandler.functionArn;
  }

  /**
   * The ARN of the handler's lambda function. Used as a service token in the
   * custom resource.
   */
  public readonly functionArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // handler allowed to get existing bucket notification configuration and put bucket notification on s3 buckets.
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:PutBucketNotification', 's3:GetBucketNotification'],
      resources: ['*'],
    }));

    // Shared codebase for the lambdas.
    const code = lambda.Code.fromAsset(path.join(__dirname, 'lambda-source'), {
      exclude: [
        '.coverage',
        '*.pyc',
        '.idea',
      ],
    });

    const resource = new lambda.Function(this, 'Resource', {
      code: code,
      description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
      handler: 'notification.index.handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      timeout: cdk.Duration.minutes(5),
      role: role
    });

    resource.node.addDependency(role);

    this.functionArn = resource.functionArn;
  }
}
