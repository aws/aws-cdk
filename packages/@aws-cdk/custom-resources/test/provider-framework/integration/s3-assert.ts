import cfn = require('@aws-cdk/aws-cloudformation');
import s3 = require('@aws-cdk/aws-s3');
import { Construct } from '@aws-cdk/core';
import { Providers } from './providers';

export interface S3AssertProps {
  /**
   * The s3 bucket to query.
   */
  readonly bucket: s3.IBucket;

  /**
   * The object key.
   */
  readonly objectKey: string;

  /**
   * The expected contents.
   */
  readonly expectedContent: string;
}

/**
 * A custom resource that asserts that a file on s3 has the specified contents.
 * This resource will wait 10 minutes before, allowing for eventual consistency
 * to stabilize (and also exercises the idea of asynchronous custom resources).
 *
 * Code is written in Python because why not.
 */
export class S3Assert extends Construct {
  constructor(scope: Construct, id: string, props: S3AssertProps) {
    super(scope, id);

    const provider = Providers.getOrCreate(this).s3AssertProvider;

    new cfn.CustomResource(this, 'Resource', {
      provider: cfn.CustomResourceProvider.lambda(provider.entrypoint),
      resourceType: 'Custom::S3Assert',
      properties: {
        BucketName: props.bucket.bucketName,
        ObjectKey: props.objectKey,
        ExpectedContent: props.expectedContent,
      },
    });
  }
}
