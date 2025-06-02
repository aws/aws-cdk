import * as path from 'path';
import { App, CustomResource, CustomResourceProvider, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME } from '../../config';

const PUT_OBJECTS_RESOURCE_TYPE = 'Custom::S3PutObjects';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'Bucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Put objects in the bucket to ensure auto delete works as expected
    const serviceToken = CustomResourceProvider.getOrCreate(this, PUT_OBJECTS_RESOURCE_TYPE, {
      codeDirectory: path.join(__dirname, 'put-objects-handler'),
      runtime: STANDARD_CUSTOM_RESOURCE_PROVIDER_RUNTIME,
      policyStatements: [{
        Effect: 'Allow',
        Action: 's3:PutObject',
        Resource: bucket.arnForObjects('*'),
      }],
    });
    new CustomResource(this, 'PutObjectsCustomResource', {
      resourceType: PUT_OBJECTS_RESOURCE_TYPE,
      serviceToken,
      properties: {
        BucketName: bucket.bucketName,
      },
    });

    const bucketThatWillBeRemoved = new s3.Bucket(this, 'RemovedBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Remove this bucket immediately
    // so we can test that a non-existing bucket will not fail the auto-delete-objects Custom Resource
    new AwsCustomResource(this, 'DeleteBucket', {
      onCreate: {
        physicalResourceId: PhysicalResourceId.of(bucketThatWillBeRemoved.bucketArn),
        service: 'S3',
        action: 'deleteBucket',
        parameters: {
          Bucket: bucketThatWillBeRemoved.bucketName,
        },
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [bucketThatWillBeRemoved.bucketArn],
      }),
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

new IntegTest(app, 'cdk-integ-s3-bucket-auto-delete-objects', {
  testCases: [new TestStack(app, 'cdk-s3-bucket-auto-delete-objects')],
  diffAssets: true,
});
