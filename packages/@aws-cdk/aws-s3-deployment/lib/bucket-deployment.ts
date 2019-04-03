import cloudformation = require('@aws-cdk/aws-cloudformation');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import path = require('path');
import { ISource } from './source';

const handlerCodeBundle = path.join(__dirname, '..', 'lambda', 'bundle.zip');

export interface BucketDeploymentProps {
  /**
   * The source from which to deploy the contents of this bucket.
   */
  readonly source: ISource;

  /**
   * The S3 bucket to sync the contents of the zip file to.
   */
  readonly destinationBucket: s3.IBucket;

  /**
   * Key prefix in the destination bucket.
   *
   * @default "/" (unzip to root of the destination bucket)
   */
  readonly destinationKeyPrefix?: string;

  /**
   * If this is set to "false", the destination files will be deleted when the
   * resource is deleted or the destination is updated.
   *
   * NOTICE: if this is set to "false" and destination bucket/prefix is updated,
   * all files in the previous destination will first be deleted and then
   * uploaded to the new destination location. This could have availablity
   * implications on your users.
   *
   * @default true - when resource is deleted/updated, files are retained
   */
  readonly retainOnDelete?: boolean;
}

export class BucketDeployment extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: BucketDeploymentProps) {
    super(scope, id);

    const handler = new lambda.SingletonFunction(this, 'CustomResourceHandler', {
      uuid: '8693BB64-9689-44B6-9AAF-B0CC9EB8756C',
      code: lambda.Code.file(handlerCodeBundle),
      runtime: lambda.Runtime.Python36,
      handler: 'index.handler',
      lambdaPurpose: 'Custom::CDKBucketDeployment',
      timeout: 15 * 60
    });

    const source = props.source.bind(this);

    source.bucket.grantRead(handler);
    props.destinationBucket.grantReadWrite(handler);

    new cloudformation.CustomResource(this, 'CustomResource', {
      lambdaProvider: handler,
      resourceType: 'Custom::CDKBucketDeployment',
      properties: {
        SourceBucketName: source.bucket.bucketName,
        SourceObjectKey: source.zipObjectKey,
        DestinationBucketName: props.destinationBucket.bucketName,
        DestinationBucketKeyPrefix: props.destinationKeyPrefix,
        RetainOnDelete: props.retainOnDelete
      }
    });
  }
}
