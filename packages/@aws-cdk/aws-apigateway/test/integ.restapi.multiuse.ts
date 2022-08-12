import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as apigw from '../lib';

class MultiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    }));

    const api = new apigw.RestApi(this, 'hello-api', { cloudWatchRole: true });
    api.root.resourceForPath('/hello').addMethod('GET', hello);

    const api2 = new apigw.RestApi(this, 'second-api', { cloudWatchRole: true });
    api2.root.resourceForPath('/hello').addMethod('GET', hello);
  }
}

const app = new cdk.App();
const testCase = new MultiStack(app, 'restapi-multiuse-example');

new IntegTest(app, 'restapi-multiuse', {
  testCases: [testCase],
});

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!',
  });
}

