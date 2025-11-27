import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { DeployTimeSubstitutedFile } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * Integration test for DeployTimeSubstitutedFile with custom destination key:
 * - Tests that custom destinationKey can be specified for the deployed file
 * - Validates that substitution works correctly with custom destination keys
 */
class TestBucketDeploymentSubstitutionWithDestinationKey extends cdk.Stack {
  public readonly bucketName: String;
  public readonly objectKey: String;
  public readonly lambdaArn: String;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hello = new lambda.Function(this, 'Hello', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    });

    const bucket = new Bucket(this, 'substitution-bucket');
    const file = new DeployTimeSubstitutedFile(this, 'DeployWithDestinationKey', {
      source: path.join(__dirname, 'sample-file.yaml'),
      destinationBucket: bucket,
      substitutions: {
        yyyy: hello.functionArn,
        xxxx: 'substitution-successful!',
      },
      destinationKey: 'processed-sample-file.yaml',
    });

    this.bucketName = bucket.bucketName;
    this.objectKey = file.objectKey;
    this.lambdaArn = hello.functionArn;
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const testCase = new TestBucketDeploymentSubstitutionWithDestinationKey(app, 'test-bucket-deployment-substitution-with-destination-key');
const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployment-substitution-with-destination-key', {
  testCases: [testCase],
});

const apiCall = integTest.assertions.awsApiCall('S3', 'getObject', {
  Bucket: testCase.bucketName,
  Key: 'processed-sample-file.yaml',
});

apiCall.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['s3:GetObject', 's3:ListBucket'],
  Resource: ['*'],
});

apiCall.assertAtPath('Body', ExpectedResult.stringLikeRegexp(`substitutionStatus: substitution-successful!\\nlambdaArn: ${testCase.lambdaArn}`));

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!',
  });
}
