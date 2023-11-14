import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

class Test extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const testFormat = apigateway.AccessLogFormat.custom(JSON.stringify({
      requestId: apigateway.AccessLogField.contextRequestId(),
      sourceIp: apigateway.AccessLogField.contextIdentitySourceIp(),
      method: apigateway.AccessLogField.contextHttpMethod(),
      callerAccountId: apigateway.AccessLogField.contextCallerAccountId(),
      ownerAccountId: apigateway.AccessLogField.contextOwnerAccountId(),
      userContext: {
        sub: apigateway.AccessLogField.contextAuthorizerClaims('sub'),
        email: apigateway.AccessLogField.contextAuthorizerClaims('email'),
      },
      clientCertPem: apigateway.AccessLogField.contextIdentityClientCertPem(),
      subjectDN: apigateway.AccessLogField.contextIdentityClientCertSubjectDN(),
      issunerDN: apigateway.AccessLogField.contextIdentityClientCertIssunerDN(),
      serialNumber: apigateway.AccessLogField.contextIdentityClientCertSerialNumber(),
      validityNotBefore: apigateway.AccessLogField.contextIdentityClientCertValidityNotBefore(),
      validityNotAfter: apigateway.AccessLogField.contextIdentityClientCertValidityNotAfter(),
    }));

    const logGroup = new logs.LogGroup(this, 'MyLogGroup');
    const api = new apigateway.RestApi(this, 'MyApi', {
      cloudWatchRole: true,
      deployOptions: {
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: testFormat,
      },
    });
    api.root.addMethod('GET');
  }
}

const app = new cdk.App();

const testCase = new Test(app, 'test-apigateway-access-logs');
new IntegTest(app, 'apigateway-access-logs', {
  testCases: [testCase],
});

app.synth();
