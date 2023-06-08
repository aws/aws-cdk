import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { DeployTimeSubstitutedFile } from 'aws-cdk-lib/aws-s3-deployment';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'MyHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromInline(`exports.handler = ${handlerCode}`),
      handler: 'index.handler',
    });

    const bucket = new Bucket(this, 'Bucket');
    const deployment = new DeployTimeSubstitutedFile(this, 'Deployment', {
      source: path.join(__dirname, 'sample-definition-substitution.yaml'),
      destinationBucket: bucket,
      substitutions: {
        testMethod: handler.functionName,
      },
    });

    new apigateway.SpecRestApi(this, 'sample-api-definition', {
      apiDefinition: apigateway.ApiDefinition.fromBucket(deployment.deployedBucket, deployment.objectKey),
    });

    function handlerCode(event: any, _: any, callback: any) {
      return callback(undefined, {
        isBase64Encoded: false,
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(event),
      });
    }
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-apigateway-parameterized-swagger');
new IntegTest(app, 'apigateway-parameterized-swagger', {
  testCases: [testCase],
});