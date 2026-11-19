import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const logGroup = new logs.LogGroup(this, 'MyLogGroup');
    const api = new apigateway.RestApi(this, 'MyApi', {
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields({
          user: false,
          caller: false,
          additionalFields: {
            path: apigateway.AccessLogField.contextPath(),
            errorMessage: apigateway.AccessLogField.contextErrorMessage(),
            sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
          },
        }),
      },
    });
    api.root.addMethod('GET');
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-apigateway-access-log-json-additional-fields');
new IntegTest(app, 'apigateway-access-log-json-additional-fields', {
  testCases: [testCase],
});

app.synth();
