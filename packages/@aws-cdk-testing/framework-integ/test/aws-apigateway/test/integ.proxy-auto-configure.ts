import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/**
 * Integration test for ProxyResource autoConfigurePathParameter feature.
 *
 * The proxy resources under test forward requests through an HTTP proxy
 * integration whose URI contains `{proxy}`. Without the path parameter
 * mapping, the backend would receive `/echo/` instead of the greedy path, so
 * the assertions check the path the echo backend actually received.
 */
class ProxyAutoConfigureStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;
  public readonly rootProxyApi: apigateway.RestApi;

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
              httpMethod: event.httpMethod
            })
          };
        };
      `),
      handler: 'index.handler',
    });

    // Backend that echoes the path it receives
    const echoApi = new apigateway.LambdaRestApi(this, 'EchoApi', { handler });
    const backendUri = `${echoApi.urlForPath('/echo')}/{proxy}`;

    // Proxy resource under a nested resource
    this.api = new apigateway.RestApi(this, 'ProxyApi');
    this.api.root.addResource('api').addProxy({
      autoConfigurePathParameter: true,
      defaultIntegration: new apigateway.HttpIntegration(backendUri),
    });

    // Proxy resource mounted under the root, which also adds the method to the root
    this.rootProxyApi = new apigateway.RestApi(this, 'RootProxyApi');
    this.rootProxyApi.root.addProxy({
      autoConfigurePathParameter: true,
      defaultIntegration: new apigateway.HttpIntegration(backendUri),
    });
  }
}

const app = new cdk.App();
const stack = new ProxyAutoConfigureStack(app, 'ProxyAutoConfigureStack');

const integ = new IntegTest(app, 'ProxyAutoConfigureTest', {
  testCases: [stack],
});

integ.assertions.httpApiCall(stack.api.deploymentStage.urlForPath('/api/foo/bar')).expect(ExpectedResult.objectLike({
  status: 200,
  body: { path: '/echo/foo/bar' },
}));

integ.assertions.httpApiCall(stack.rootProxyApi.deploymentStage.urlForPath('/foo/bar')).expect(ExpectedResult.objectLike({
  status: 200,
  body: { path: '/echo/foo/bar' },
}));
