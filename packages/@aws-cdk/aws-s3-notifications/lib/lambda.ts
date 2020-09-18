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
    const permissionId = `AllowBucketNotificationsFrom${bucket.node.uniqueId}`;

    const permissionProps: lambda.Permission = {
      sourceAccount: Stack.of(bucket).account,
      principal: new iam.ServicePrincipal('s3.amazonaws.com'),
      sourceArn: bucket.bucketArn,
    };

    let permission = undefined;

    if (Stack.of(this.fn) !== Stack.of(bucket)) {
      if (Stack.of(bucket).node.tryFindChild(permissionId) === undefined) {
        this.fn.addPermission(permissionId, {
          ...permissionProps,
          // the bucket stack already has a dependency on the lambda stack because
          // of the notification resource. therefore adding the permission to the lambda
          // stack would create a circular dependency, so we add it to the bucket stack.
          scope: Stack.of(bucket),
        });
        permission = Stack.of(bucket).node.tryFindChild(permissionId) as CfnResource | undefined;
      }
    } else {
      if (this.fn.permissionsNode.tryFindChild(permissionId) === undefined) {
        this.fn.addPermission(permissionId, {
          ...permissionProps,
        });
        // if we have a permission resource for this relationship, add it as a dependency
        // to the bucket notifications resource, so it will be created first.
        permission = this.fn.permissionsNode.tryFindChild(permissionId) as CfnResource | undefined;
      }
    }

    return {
      type: s3.BucketNotificationDestinationType.LAMBDA,
      arn: this.fn.functionArn,
      dependencies: permission ? [permission] : undefined,
    };
  }
}
