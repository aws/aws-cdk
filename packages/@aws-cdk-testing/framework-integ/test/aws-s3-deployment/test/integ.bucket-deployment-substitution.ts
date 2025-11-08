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
 * Integration test for DeployTimeSubstitutedFile:
 * - Tests deploy-time string substitution in template files
 * - Validates that token values (like Lambda ARN) are properly substituted
 * - Tests both token and static string substitutions
 */
class TestBucketDeploymentSubstitution extends cdk.Stack {
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
    const file = new DeployTimeSubstitutedFile(this, 'DeployWithSubstitution', {
      source: path.join(__dirname, 'sample-file.yaml'),
      destinationBucket: bucket,
      substitutions: {
        yyyy: hello.functionArn,
        xxxx: 'substitution-successful!',
      },
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

const testCase = new TestBucketDeploymentSubstitution(app, 'test-bucket-deployment-substitution');
const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployment-substitution', {
  testCases: [testCase],
});

const apiCall = integTest.assertions.awsApiCall('S3', 'getObject', {
  Bucket: testCase.bucketName,
  Key: testCase.objectKey,
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
