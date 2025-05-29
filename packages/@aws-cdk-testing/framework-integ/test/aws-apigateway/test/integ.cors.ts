import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'cors-api-test', {
      cloudWatchRole: true,
    });

    const handler = new lambda.Function(this, 'handler', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'integ.cors.handler'), { exclude: ['*.ts'] }),
    });

    const twitch = api.root.addResource('twitch');
    const backend = new apigw.LambdaIntegration(handler);

    twitch.addMethod('GET', backend); // GET /twitch
    twitch.addMethod('POST', backend); // POST /twitch
    twitch.addMethod('DELETE', backend); // DELETE /twitch
    twitch.addCorsPreflight({ allowOrigins: ['https://google.com', 'https://www.test-cors.org'] });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new TestStack(app, 'cors-twitch-test');
new IntegTest(app, 'cors', {
  testCases: [testCase],
});
app.synth();
