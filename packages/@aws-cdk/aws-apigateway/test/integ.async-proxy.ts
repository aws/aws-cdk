
import lambda = require('@aws-cdk/aws-lambda');
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';
import apigw = require('../lib');

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'async-proxy-test');

    const handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_8_10,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async (event) => console.log(event);')
    });

    api.root.addResource('async').addMethod('GET', new apigw.LambdaIntegration(handler, { asyncProxy: true }));
  }
}

const app = new App();
new TestStack(app, 'async-proxy-test');
app.synth();
