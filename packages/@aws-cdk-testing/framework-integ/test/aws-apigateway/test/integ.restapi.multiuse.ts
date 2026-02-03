import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class MultiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    }));

    const api = new apigw.RestApi(this, 'hello-api', { cloudWatchRole: true });
    api.root.resourceForPath('/hello').addMethod('GET', hello);

    const api2 = new apigw.RestApi(this, 'second-api', { cloudWatchRole: true });
    api2.root.resourceForPath('/hello').addMethod('GET', hello);
  }
}

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
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

