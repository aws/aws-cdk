import * as path from 'path';
import type { StackProps } from 'aws-cdk-lib';
import { App, Fn, CustomResource, CustomResourceProvider, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME } from '../../config';

const PUT_OBJECTS_RESOURCE_TYPE = 'Custom::S3PutObjects';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.CfnBucket(this, 'Bucket');
    bucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
    bucket.with(new s3.mixins.BucketAutoDeleteObjects());

    const bucketRef = bucket.bucketRef;

    // Put objects in the bucket to ensure auto delete works as expected
    const serviceToken = CustomResourceProvider.getOrCreate(this, PUT_OBJECTS_RESOURCE_TYPE, {
      codeDirectory: path.join(__dirname, 'put-objects-handler'),
      runtime: STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME,
      policyStatements: [{
        Effect: 'Allow',
        Action: 's3:PutObject',
        Resource: Fn.join('', [bucketRef.bucketArn, '/*']),
      }],
    });
    new CustomResource(this, 'PutObjectsCustomResource', {
      resourceType: PUT_OBJECTS_RESOURCE_TYPE,
      serviceToken,
      properties: {
        BucketName: bucketRef.bucketName,
      },
    });

    const removedBucket = new s3.CfnBucket(this, 'RemovedBucket');
    removedBucket.applyRemovalPolicy(RemovalPolicy.DESTROY);
    removedBucket.with(new s3.mixins.BucketAutoDeleteObjects());

    const removedBucketRef = removedBucket.bucketRef;

    // Remove this bucket immediately
    // so we can test that a non-existing bucket will not fail the auto-delete-objects Custom Resource
    new AwsCustomResource(this, 'DeleteBucket', {
      onCreate: {
        physicalResourceId: PhysicalResourceId.of(removedBucketRef.bucketArn),
        service: 'S3',
        action: 'deleteBucket',
        parameters: {
          Bucket: removedBucketRef.bucketName,
        },
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [removedBucketRef.bucketArn],
      }),
    });
  }
}

const app = new App({ context: { '@aws-cdk/core:disableGitSource': true } });

new IntegTest(app, 'cdk-integ-s3-bucket-auto-delete-objects-mixin', {
  testCases: [new TestStack(app, 'cdk-s3-bucket-auto-delete-objects-mixin')],
  diffAssets: true,
});
