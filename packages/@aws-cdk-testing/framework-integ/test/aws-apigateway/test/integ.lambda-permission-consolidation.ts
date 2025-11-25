import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';

class LambdaPermissionConsolidationStack extends Stack {
  public readonly api: RestApi;
  constructor(scope: Construct) {
    super(scope, 'LambdaPermissionConsolidationStack');

    const fn = new Function(this, 'Handler', {
      code: Code.fromInline(`exports.handler = async function(event) {
        return {
          body: JSON.stringify({
            message: 'Hello from ' + event.httpMethod,
          }),
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' }
        };
      }`),
      runtime: Runtime.NODEJS_18_X,
      handler: 'index.handler',
    });

    this.api = new RestApi(this, 'Api', {
      cloudWatchRole: true,
    });

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'];
    methods.forEach(method => {
      this.api.root.addMethod(method, new LambdaIntegration(fn, {
        scopePermissionToMethod: false,
      }));
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const testCase = new LambdaPermissionConsolidationStack(app);
const integ = new IntegTest(app, 'lambda-permission-consolidation', {
  testCases: [testCase],
});

// Test that all methods work after consolidation
const call = integ.assertions.httpApiCall(testCase.api.deploymentStage.urlForPath('/'), {
  method: 'GET',
});
call.expect(ExpectedResult.objectLike({
  body: { message: 'Hello from GET' },
}));
