import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import { CfnResource, Names, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Use a Lambda function as a bucket notification destination
 */
export class LambdaDestination implements s3.IBucketNotificationDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(_scope: Construct, bucket: s3.IBucket): s3.BucketNotificationDestinationConfig {
    const permissionId = `AllowBucketNotificationsTo${Names.nodeUniqueId(this.fn.permissionsNode)}`;

    if (!(bucket instanceof Construct)) {
      throw new Error(`LambdaDestination for function ${Names.nodeUniqueId(this.fn.permissionsNode)} can only be configured on a
        bucket construct (Bucket ${bucket.bucketName})`);
    }

    if (bucket.node.tryFindChild(permissionId) === undefined) {
      this.fn.addPermission(permissionId, {
        sourceAccount: Stack.of(bucket).account,
        principal: new iam.ServicePrincipal('s3.amazonaws.com'),
        sourceArn: bucket.bucketArn,
        // Placing the permissions node in the same scope as the s3 bucket.
        // Otherwise, there is a circular dependency when the s3 bucket
        // and lambda functions declared in different stacks.
        scope: bucket,
      });
    }

    // if we have a permission resource for this relationship, add it as a dependency
    // to the bucket notifications resource, so it will be created first.
    const permission = bucket.node.tryFindChild(permissionId) as CfnResource | undefined;

    return {
      type: s3.BucketNotificationDestinationType.LAMBDA,
      arn: this.fn.functionArn,
      dependencies: permission ? [permission] : undefined,
    };
  }
}
