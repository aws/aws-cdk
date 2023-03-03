import * as path from 'path';
import { App, CustomResource, CustomResourceProvider, CustomResourceProviderRuntime, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as s3 from '../lib';

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
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
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
  }
}

const app = new App();

new IntegTest(app, 'cdk-integ-s3-bucket-auto-delete-objects', {
  testCases: [new TestStack(app, 'cdk-s3-bucket-auto-delete-objects')],
});
