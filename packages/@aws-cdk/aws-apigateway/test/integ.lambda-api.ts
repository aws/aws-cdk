import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { App, Duration, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { LambdaRestApi } from '../lib';

class LambdaApiIntegrationOptionsStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'LambdaApiIntegrationOptionsStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline('foo'),
      runtime: Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });

    new LambdaRestApi(this, 'lambdarestapi', {
      handler: fn,
      integrationOptions: {
        timeout: Duration.seconds(1),
      },
    });
  }
}

const app = new App();
new LambdaApiIntegrationOptionsStack(app);
