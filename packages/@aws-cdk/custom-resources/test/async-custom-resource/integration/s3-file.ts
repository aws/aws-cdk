import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Token } from '@aws-cdk/core';
import path = require('path');
import { AsyncCustomResource } from '../../../lib';
import api = require('./s3-file-handler/api');

interface S3FileProps {
  /**
   * The bucket in which the file will be created.
   */
  readonly bucket: s3.IBucket;

  /**
   * The object key.
   *
   * @default - automatically-generated
   */
  readonly objectKey?: string;

  /**
   * The contents of the file.
   */
  readonly contents: string;

  /**
   * Indicates if this file should have public-read permissions.
   *
   * @default false
   */
  readonly public?: boolean;
}

export class S3File extends Construct {
  public readonly objectKey: string;
  public readonly url: string;
  public readonly etag: string;

  constructor(scope: Construct, id: string, props: S3FileProps) {
    super(scope, id);

    const resource = new AsyncCustomResource(this, 'Resource', {
      uuid: '53510EEE-B419-46DA-B5F1-A9594E2C7FED',
      code: lambda.Code.fromAsset(path.join(__dirname, 's3-file-handler')),
      runtime: lambda.Runtime.NODEJS_10_X,
      onEventHandler: 'index.onEvent',
      isCompleteHandler: 'index.isComplete',
      resourceType: 'Custom::S3File',
      properties: {
        [api.PROP_BUCKET_NAME]: props.bucket.bucketName,
        [api.PROP_CONTENTS]: props.contents,
        [api.PROP_OBJECT_KEY]: props.objectKey,
        [api.PROP_PUBLIC]: props.public
      }
    });

    props.bucket.grantWrite(resource.userExecutionPrincipal);

    this.objectKey = Token.asString(resource.getAtt(api.ATTR_OBJECT_KEY));
    this.url = Token.asString(resource.getAtt(api.ATTR_URL));
    this.etag = Token.asString(resource.getAtt(api.ATTR_ETAG));
  }
}