import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { CfnResource, Construct } from '@aws-cdk/cdk';

/**
 * Use a Lambda function as a bucket notification destination
 */
export class LambdaDestination implements s3.IBucketNotificationDestination {
  constructor(private readonly fn: lambda.IFunction) {
  }

  public bind(_scope: Construct, bucket: s3.IBucket): s3.BucketNotificationDestinationProps {
    const permissionId = `AllowBucketNotificationsFrom${bucket.node.uniqueId}`;

    if (this.fn.node.tryFindChild(permissionId) === undefined) {
      this.fn.addPermission(permissionId, {
        sourceAccount: bucket.node.stack.accountId,
        principal: new iam.ServicePrincipal('s3.amazonaws.com'),
        sourceArn: bucket.bucketArn
      });
    }

    // if we have a permission resource for this relationship, add it as a dependency
    // to the bucket notifications resource, so it will be created first.
    const permission = this.fn.node.findChild(permissionId) as CfnResource;

    return {
      type: s3.BucketNotificationDestinationType.Lambda,
      arn: this.fn.functionArn,
      dependencies: permission ? [ permission ] : undefined
    };
  }
}