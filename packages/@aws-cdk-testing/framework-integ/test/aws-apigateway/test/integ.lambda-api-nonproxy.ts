import { Code, Function } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { LambdaRestApi, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class LambdaApiIntegrationOptionsNonProxyIntegrationStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'LambdaApiIntegrationOptionsNonProxyIntegrationStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline('foo'),
      runtime: STANDARD_NODEJS_RUNTIME,
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

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new LambdaApiIntegrationOptionsNonProxyIntegrationStack(app);
new IntegTest(app, 'lambda-non-proxy-integration', {
  testCases: [testCase],
});
