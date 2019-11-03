import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Duration } from '@aws-cdk/core';
import path = require('path');
import { AsyncCustomResource } from '../../../lib';

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

  /**
   * @default Duration.minutes(10)
   */
  readonly timeout?: Duration;
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

    const resource = new AsyncCustomResource(this, 'Resource', {
      uuid: '9F0E1249-7CD8-4E1F-BC21-797F444C753F',
      code: lambda.Code.fromAsset(path.join(__dirname, 's3-assert-handler')),
      runtime: lambda.Runtime.PYTHON_3_7,
      resourceType: 'Custom::S3Assert',
      onEventHandler: 'index.on_event',
      isCompleteHandler: 'index.is_complete',
      properties: {
        BucketName: props.bucket.bucketName,
        ObjectKey: props.objectKey,
        ExpectedContent: props.expectedContent,
      },
      totalTimeout: props.timeout || Duration.minutes(5),
    });

    props.bucket.grantRead(resource.userExecutionPrincipal);
  }
}
