import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { LambdaRestApi, ResponseTransferMode } from 'aws-cdk-lib/aws-apigateway';

class LambdaApiStreamStack extends Stack {
  public readonly api: LambdaRestApi;
  constructor(scope: Construct) {
    super(scope, 'LambdaApiStreamStack');

    const fn = new Function(this, 'myfn', {
      code: Code.fromInline(`exports.handler = awslambda.streamifyResponse(async (event, responseStream, context) => {
        const metadata = {
          statusCode: 200,
          headers: { 'Content-Type': 'text/plain' }
        };
        responseStream = awslambda.HttpResponseStream.from(responseStream, metadata);
        responseStream.write('Hello, ');
        await new Promise(resolve => setTimeout(resolve, 100));
        responseStream.write('streaming ');
        await new Promise(resolve => setTimeout(resolve, 100));
        responseStream.write('world!');
        responseStream.end();
      });`),
      runtime: Runtime.NODEJS_24_X,
      handler: 'index.handler',
    });

    this.api = new LambdaRestApi(this, 'LambdaApi', {
      handler: fn,
      integrationOptions: {
        responseTransferMode: ResponseTransferMode.STREAM,
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new LambdaApiStreamStack(app);
const integ = new IntegTest(app, 'lambda-api-stream', {
  testCases: [testCase],
});

const call = integ.assertions.httpApiCall(testCase.api.deploymentStage.urlForPath('/'));
call.expect(ExpectedResult.objectLike({
  body: 'Hello, streaming world!',
}));
