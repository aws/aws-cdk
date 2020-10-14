/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as apigw from '../lib';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'cors-api-test');

    const handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler')),
    });

    const twitch = api.root.addResource('twitch');
    const backend = new apigw.LambdaIntegration(handler);

    twitch.addMethod('GET', backend); // GET /twitch
    twitch.addMethod('POST', backend); // POST /twitch
    twitch.addMethod('DELETE', backend); // DELETE /twitch
    twitch.addCorsPreflight({ allowOrigins: ['https://google.com', 'https://www.test-cors.org'] });
  }
}

const app = new App();
new TestStack(app, 'cors-twitch-test');
app.synth();
