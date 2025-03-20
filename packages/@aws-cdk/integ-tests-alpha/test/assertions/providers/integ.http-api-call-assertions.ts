import { App, Stack } from 'aws-cdk-lib';
import { ExpectedResult, IntegTest } from '../../../lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';

const app = new App();
const stack = new Stack(app, 'InvokeFunctionAssertions');
const integ = new IntegTest(app, 'AssertionsTest', {
  testCases: [stack],
});

const httpApi = new apigwv2.HttpApi(stack, 'HttpApi');

httpApi.addRoutes({
  path: '/get',
  methods: [apigwv2.HttpMethod.GET],
  integration: new integrations.HttpLambdaIntegration('GetIntegration',
    new lambda.Function(stack, 'GetHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: new lambda.InlineCode(`
        exports.handler = async () => ({
          statusCode: 200,
          body: 'Hello!',
        });`),
    })),
});

httpApi.addRoutes({
  path: '/post',
  methods: [apigwv2.HttpMethod.POST],
  integration: new integrations.HttpLambdaIntegration('PostIntegration',
    new lambda.Function(stack, 'PostHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: new lambda.InlineCode(`
        exports.handler = async ({ body }) => ({
          statusCode: 200,
          body: 'Received body: ' + body,
        });`),
    })),
});

httpApi.addRoutes({
  path: '/status/403',
  methods: [apigwv2.HttpMethod.GET],
  integration: new integrations.HttpLambdaIntegration('ForbiddenIntegration',
    new lambda.Function(stack, 'ForbiddenHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: new lambda.InlineCode(`
        exports.handler = async ({ body }) => ({
          statusCode: 403,
        });`),
    })),
});

httpApi.addRoutes({
  path: '/echo/{echo}',
  methods: [apigwv2.HttpMethod.GET],
  integration: new integrations.HttpLambdaIntegration('EchoIntegration',
    new lambda.Function(stack, 'EchoHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: new lambda.InlineCode(`
        exports.handler = async ({ pathParameters: { echo } }) => ({
          statusCode: 200,
          body: echo,
        });`),
    })),
});

const stage = new apigwv2.HttpStage(stack, 'Stage', {
  httpApi,
  stageName: 'dev',
  autoDeploy: true,
});

integ.assertions.httpApiCall(
  `${stage.url}/get`,
).expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: 'Hello!',
  }),
);

integ.assertions.httpApiCall(
  `${stage.url}/post`,
  {
    method: 'POST',
    body: JSON.stringify({ key: 'value' }),
    headers: { 'Content-Type': 'application/json' },
  },
).expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: 'Received body: {"key":"value"}',
  }),
);

integ.assertions.httpApiCall(
  `${stage.url}/status/403`,
).expect(
  ExpectedResult.objectLike({
    status: 403,
    ok: false,
  }),
);

// FIXME expectations broken by flattenResult, see https://github.com/aws/aws-cdk/issues/30477
const echoCall = integ.assertions.httpApiCall(
  `${stage.url}/echo/HelloWorld`,
)/* .expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: 'HelloWorld',
  }),
) */;
const echo = echoCall.getAttString('body');

integ.assertions.httpApiCall(
  `${stage.url}/echo/${echo}`,
).expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: echo,
  }),
);

// We are also using httpbin.org to test the assertions with a fixed URL
// See https://github.com/aws/aws-cdk/issues/29700

integ.assertions.httpApiCall(
  'https://httpbin.org/get?key=value#hash',
).expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: {
      url: 'https://httpbin.org/get?key=value',
      args: { key: 'value' },
    },
  }),
);

integ.assertions.httpApiCall(
  'https://httpbin.org/post',
  {
    method: 'POST',
    body: JSON.stringify({ key: 'value' }),
    headers: { 'Content-Type': 'application/json' },
  },
).expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: {
      url: 'https://httpbin.org/post',
      json: { key: 'value' },
    },
  }),
);

integ.assertions.httpApiCall(
  'https://httpbin.org/status/403',
).expect(
  ExpectedResult.objectLike({
    status: 403,
    ok: false,
  }),
);

// FIXME expectations broken by flattenResult, see https://github.com/aws/aws-cdk/issues/30477
const uuidCall = integ.assertions.httpApiCall(
  'https://httpbin.org/uuid',
)/* .expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
  }),
) */;
const uuid = uuidCall.getAttString('body.uuid');

integ.assertions.httpApiCall(
  `https://httpbin.org/anything/${uuid}`,
).expect(
  ExpectedResult.objectLike({
    status: 200,
    ok: true,
    body: {
      url: `https://httpbin.org/anything/${uuid}`,
    },
  }),
);
