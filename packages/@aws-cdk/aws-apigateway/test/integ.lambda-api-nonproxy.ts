import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { LambdaRestApi, PassthroughBehavior } from '../lib';

class LambdaApiIntegrationOptionsNonProxyIntegrationStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'LambdaApiIntegrationOptionsNonProxyIntegrationStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });

    new LambdaRestApi(this, 'lambdarestapi', {
      cloudWatchRole: true,
      handler: fn,
      integrationOptions: {
        proxy: false,
        passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
        integrationResponses: [
          {
            statusCode: '200',
            responseTemplates: {
              'application/json': JSON.stringify({ message: 'Hello, word' }),
            },
          },
        ],
      },
    });
  }
}

const app = new App();
new LambdaApiIntegrationOptionsNonProxyIntegrationStack(app);
