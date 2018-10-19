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
  source: ISource;

  /**
   * The S3 bucket to sync the contents of the zip file to.
   */
  destinationBucket: s3.BucketRef;

  /**
   * Key prefix in desination.
   * @default No prefix (source == dest)
   */
  destinationKeyPrefix?: string;

  /**
   * If this is enabled, files in destination bucket/prefix will not be deleted
   * when the resource is deleted or removed from the stack.
   *
   * @default false (when resource is deleted, files are deleted)
   */
  retainOnDelete?: boolean;
}

export class BucketDeployment extends cdk.Construct {
  constructor(parent: cdk.Construct, id: string, props: BucketDeploymentProps) {
    super(parent, id);

    const handler = new lambda.SingletonFunction(this, 'CustomResourceHandler', {
      uuid: '8693BB64-9689-44B6-9AAF-B0CC9EB8756C',
      code: lambda.Code.file(handlerCodeBundle),
      runtime: lambda.Runtime.Python36,
      handler: 'index.handler',
      lambdaPurpose: 'Handler for the Custom::CDKBucketDeployment custom resource in module @aws-cdk/aws-s3-deployment',
      timeout: 15 * 60
    });

    const source = props.source.bind(this);

    source.bucket.grantRead(handler.role);
    props.destinationBucket.grantReadWrite(handler.role);

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
