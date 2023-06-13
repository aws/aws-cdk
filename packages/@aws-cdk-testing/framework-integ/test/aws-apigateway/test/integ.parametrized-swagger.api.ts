import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { DeployTimeSubstitutedFile } from 'aws-cdk-lib/aws-s3-deployment';

let lambdaFunctionArn: string = '';
class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const hello = new lambda.Function(this, 'Hello', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    });

    lambdaFunctionArn = hello.functionArn;

    const bucket = new Bucket(this, 'Bucket');
    const deployment = new DeployTimeSubstitutedFile(this, 'Deployment', {
      source: path.join(__dirname, 'sample-definition-substitution.yaml'),
      destinationBucket: bucket,
      substitutions: {
        testMethod: hello.functionArn,
        xxxx: hello.functionArn,
      },
    });

    new apigateway.SpecRestApi(this, 'sample-api-definition', {
      apiDefinition: apigateway.ApiDefinition.fromBucket(deployment.bucket, deployment.objectKey),
    });
  }
}

const app = new cdk.App();
new Test(app, 'my-stack');

const testCase = new Test(app, 'test-apigateway-parameterized-swagger');
const integ = new IntegTest(app, 'apigateway-parameterized-swagger', {
  testCases: [testCase],
});

const invoke = integ.assertions.invokeFunction({
  functionName: lambdaFunctionArn,
});
invoke.expect(ExpectedResult.objectLike({
  StatusCode: 200,
}));

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!',
  });
}