import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { CustomResourceConfig } from 'aws-cdk-lib/custom-resources';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'MyStack');

let websiteBucket = new s3.Bucket(stack, 'WebsiteBucket', {});

new s3deploy.BucketDeployment(stack, 'BucketDeployment', {
  sources: [s3deploy.Source.jsonData('file.json', { a: 'b' })],
  destinationBucket: websiteBucket,
});

CustomResourceConfig.of(app).addLambdaRuntime(lambda.Runtime.PYTHON_3_12);

new integ.IntegTest(app, 'integ-test-custom-resource-config-lambda-runtime', {
  testCases: [stack],
  diffAssets: false,
});
