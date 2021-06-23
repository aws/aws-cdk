import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as apigw from '../lib';

class MultiStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const hello = new apigw.LambdaIntegration(new lambda.Function(this, 'Hello', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = ${helloCode}`),
    }));

    const api = new apigw.RestApi(this, 'hello-api');
    api.root.resourceForPath('/hello').addMethod('GET', hello);

    const api2 = new apigw.RestApi(this, 'second-api');
    api2.root.resourceForPath('/hello').addMethod('GET', hello);
  }
}

class MultiApp extends cdk.App {
  constructor() {
    super();

    new MultiStack(this, 'restapi-multiuse-example');
  }
}

function helloCode(_event: any, _context: any, callback: any) {
  return callback(undefined, {
    statusCode: 200,
    body: 'hello, world!',
  });
}

new MultiApp().synth();
