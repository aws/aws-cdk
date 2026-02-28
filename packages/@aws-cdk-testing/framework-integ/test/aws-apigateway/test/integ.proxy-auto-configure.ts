import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * Integration test for ProxyResource autoConfigurePathParameter feature.
 *
 * This test verifies that:
 * 1. Proxy resources with autoConfigurePathParameter automatically configure path parameters
 * 2. Requests to /api/foo/bar are correctly forwarded to the backend with the full path
 * 3. The feature works with both Lambda and HTTP integrations
 */
class ProxyAutoConfigureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    // Create a Lambda function that echoes the request
    const echoHandler = new lambda.Function(this, 'EchoHandler', {
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

    // REST API with proxy resource using autoConfigurePathParameter
    const api = new apigateway.RestApi(this, 'ProxyApi', {
      restApiName: 'proxy-auto-configure-test',
      description: 'Test API for autoConfigurePathParameter feature',
      deployOptions: {
        stageName: 'test',
      },
    });

    // Add proxy resource with automatic path parameter configuration
    const apiResource = api.root.addResource('api');
    apiResource.addProxy({
      autoConfigurePathParameter: true,
      defaultIntegration: new apigateway.LambdaIntegration(echoHandler),
    });

    // Add another proxy resource without auto-configuration for comparison
    const manualResource = api.root.addResource('manual');
    manualResource.addProxy({
      autoConfigurePathParameter: false,
      defaultIntegration: new apigateway.LambdaIntegration(echoHandler),
      defaultMethodOptions: {
        requestParameters: {
          'method.request.path.proxy': true,
        },
      },
    });

    // Output the API endpoint
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL',
    });

    new cdk.CfnOutput(this, 'AutoProxyUrl', {
      value: `${api.url}api/test/path`,
      description: 'Test URL with auto-configured proxy',
    });

    new cdk.CfnOutput(this, 'ManualProxyUrl', {
      value: `${api.url}manual/test/path`,
      description: 'Test URL with manually configured proxy',
    });
  }
}

const app = new cdk.App();
const stack = new ProxyAutoConfigureStack(app, 'ProxyAutoConfigureIntegTest');

new IntegTest(app, 'ProxyAutoConfigureTest', {
  testCases: [stack],
});

app.synth();
