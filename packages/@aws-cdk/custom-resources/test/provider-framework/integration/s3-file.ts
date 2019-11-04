import cfn = require('@aws-cdk/aws-cloudformation');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, Token } from '@aws-cdk/core';
import { Providers } from './providers';
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

    const provider = Providers.getOrCreate(this).s3FileProvider;

    const resource = new cfn.CustomResource(this, 'Resource', {
      provider: cfn.CustomResourceProvider.lambda(provider.entrypoint),
      resourceType: 'Custom::S3File',
      properties: {
        [api.PROP_BUCKET_NAME]: props.bucket.bucketName,
        [api.PROP_CONTENTS]: props.contents,
        [api.PROP_OBJECT_KEY]: props.objectKey,
        [api.PROP_PUBLIC]: props.public
      }
    });

    // this will cause our provider's role to accumulate grants
    // for all buckets needed by this specific app.
    props.bucket.grantWrite(provider);

    this.objectKey = Token.asString(resource.getAtt(api.ATTR_OBJECT_KEY));
    this.url = Token.asString(resource.getAtt(api.ATTR_URL));
    this.etag = Token.asString(resource.getAtt(api.ATTR_ETAG));
  }
}