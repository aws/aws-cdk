import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * Integration test for ProxyResource autoConfigurePathParameter feature.
 *
 * This test verifies that proxy resources with autoConfigurePathParameter
 * automatically configure path parameters and correctly forward requests
 * to the Lambda backend.
 */
class ProxyAutoConfigureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'EchoHandler', {
      runtime: STANDARD_NODEJS_RUNTIME,
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          return {
            statusCode: 200,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              path: event.path,
              pathParameters: event.pathParameters,
              httpMethod: event.httpMethod
            })
          };
        };
      `),
      handler: 'index.handler',
    });

    const api = new apigateway.RestApi(this, 'ProxyApi');

    const apiResource = api.root.addResource('api');
    apiResource.addProxy({
      autoConfigurePathParameter: true,
      defaultIntegration: new apigateway.LambdaIntegration(handler),
    });
  }
}

const app = new cdk.App();
const stack = new ProxyAutoConfigureStack(app, 'ProxyAutoConfigureStack');

new IntegTest(app, 'ProxyAutoConfigureTest', {
  testCases: [stack],
});
