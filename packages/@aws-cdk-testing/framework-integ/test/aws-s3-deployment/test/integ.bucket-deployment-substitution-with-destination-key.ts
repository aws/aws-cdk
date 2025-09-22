import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { DeployTimeSubstitutedFile } from 'aws-cdk-lib/aws-s3-deployment';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class Test extends cdk.Stack {
  public readonly bucketName: String;
  public readonly objectKey: String;
  public readonly lambdaArn: String;

  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const hello = new lambda.Function(this, 'Hello', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    });

    const bucket = new Bucket(this, 'substitution-bucket');
    const file = new DeployTimeSubstitutedFile(this, 'Deployment', {
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

const testCase = new Test(app, 'test-s3-deploy-substitution-with-destination-key');
const integ = new IntegTest(app, 'deploy-time-substitution-with-destination-key-integ-test', {
  testCases: [testCase],
});

const apiCall = integ.assertions.awsApiCall('S3', 'getObject', {
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
