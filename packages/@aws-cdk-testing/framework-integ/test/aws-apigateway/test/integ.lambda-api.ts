import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';

class LambdaApiIntegrationOptionsStack extends Stack {
  public readonly api: LambdaRestApi;
  constructor(scope: Construct) {
    super(scope, 'LambdaApiIntegrationOptionsStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline(`exports.handler = async function(event) {
        return {
          body: JSON.stringify({
            message: 'Hello',
          }),
          statusCode: 200,
          headers: { 'Content-Type': '*/*' }
        };
      }`),
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
    });

    this.api = new LambdaRestApi(this, 'lambdarestapi', {
      handler: fn,
      cloudWatchRole: true,
      integrationOptions: {
        timeout: Duration.seconds(1),
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new LambdaApiIntegrationOptionsStack(app);
const integ = new IntegTest(app, 'lambda-integration', {
  testCases: [testCase],
});

const call = integ.assertions.httpApiCall(testCase.api.deploymentStage.urlForPath('/'));
call.expect(ExpectedResult.objectLike({
  body: { message: 'Hello' },
}));
