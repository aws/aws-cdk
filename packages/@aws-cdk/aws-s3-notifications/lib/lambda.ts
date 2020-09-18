import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { CfnResource, Construct, Stack } from '@aws-cdk/core';

/**
 * Use a Lambda function as a bucket notification destination
 */
export class LambdaDestination implements s3.IBucketNotificationDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(_scope: Construct, bucket: s3.IBucket): s3.BucketNotificationDestinationConfig {
    const permissionId = `AllowBucketNotificationsFrom${bucket.node.uniqueId}To${this.fn.permissionsNode.uniqueId}`;

    // the bucket stack already has a dependency on the lambda stack because
    // of the notification resource. therefore adding the permission to the lambda
    // stack would create a circular dependency, so we add it to the bucket stack.
    const bucketStack = Stack.of(bucket);

    if (bucketStack.node.tryFindChild(permissionId) === undefined) {
      this.fn.addPermission(permissionId, {
        sourceAccount: Stack.of(bucket).account,
        principal: new iam.ServicePrincipal('s3.amazonaws.com'),
        sourceArn: bucket.bucketArn,
        scope: bucketStack,
      });
    }

    // if we have a permission resource for this relationship, add it as a dependency
    // to the bucket notifications resource, so it will be created first.
    const permission = bucketStack.node.tryFindChild(permissionId) as CfnResource | undefined;

    return {
      type: s3.BucketNotificationDestinationType.LAMBDA,
      arn: this.fn.functionArn,
      dependencies: permission ? [permission] : undefined,
    };
  }
}
