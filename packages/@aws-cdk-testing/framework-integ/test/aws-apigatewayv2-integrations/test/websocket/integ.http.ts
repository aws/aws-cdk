import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import { ContentHandling, HttpApi, HttpMethod, WebSocketApi, WebSocketStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration, WebSocketHttpIntegration, WebSocketHttpProxyIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as logs from 'aws-cdk-lib/aws-logs';
import * as assert from 'node:assert';

/*
 * Stack verification steps:
 * 1. Connect: 'wscat -c <endpoint-in-the-stack-output>'. Should connect successfully and print event data containing connectionId in cloudwatch
 * 2. HTTP: '> {"action": "http", "data": "some-data"}'. Should send the message successfully and print the data in cloudwatch
 * 2. HTTP Proxy: '> {"action": "http-proxy", "data": "some-data"}'. Should send the message successfully and print the data in cloudwatch
 */

const app = new App();
const stack = new Stack(app, 'WebSocketHttpApiInteg');

// We first create an HTTP endpoint and API to have something to proxy
const httpHandler = new lambda.Function(stack, 'HttpHandler', {
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'index.handler',
  code: new lambda.InlineCode(`
  exports.handler = function(event) {
    console.log(event);
    const { requestContext: { http: { method } }, headers, body, isBase64Encoded } = event;

    const integHeaders = Object.fromEntries(
      Object.entries(headers).filter(([key]) => key.startsWith('X-Integ')),
    );

    let parsedBody = body;
    if (isBase64Encoded) {
      parsedBody = Buffer.from(body, 'base64').toString('utf-8');
    }
    parsedBody = JSON.parse(parsedBody ?? 'null');

    let resultBody = JSON.stringify({ 
      success: true, 
      requestReceivedByHttpEndpoint: { 
        method,
        integHeaders,
        body: parsedBody,
      }
    });

    if (isBase64Encoded) {
      resultBody = Buffer.from(resultBody).toString('base64');
    }

    return { 
      statusCode: 200,
      body: resultBody,
      isBase64Encoded,
    };
  };`),
});

const httpApi = new HttpApi(stack, 'HttpApi', {
  defaultIntegration: new HttpLambdaIntegration('DefaultIntegration', httpHandler),
});
assert(httpApi.url, 'HTTP API URL is required');

const websocketHttpIntegration = new WebSocketHttpIntegration('WebsocketHttpIntegration', {
  integrationMethod: HttpMethod.GET,
  integrationUri: httpApi.url,
  timeout: Duration.seconds(10),
  // contentHandling: ContentHandling.CONVERT_TO_TEXT,
});

const websocketHttpProxyIntegration = new WebSocketHttpProxyIntegration('WebsocketHttpIntegration', {
  integrationMethod: HttpMethod.POST,
  integrationUri: httpApi.url,
  timeout: Duration.seconds(10),
  contentHandling: ContentHandling.CONVERT_TO_BINARY,
  requestParameters: {
    // 'integration.request.header.Authorization': '$context.authorizer.auth',
    // 'integration.request.header.X-Integ-Header': 'fixed-header-value',
  },
  /* requestTemplates: {
    'application/json': JSON.stringify({ data: 'some-data' }),
  },
  templateSelectionExpression: '\\$default', */
});

const webSocketApi = new WebSocketApi(stack, 'WebSocketApi', {
  defaultRouteOptions: {
    integration: websocketHttpProxyIntegration,
    returnResponse: true,
  },
});

webSocketApi.addRoute('http', {
  integration: websocketHttpIntegration,
  returnResponse: true,
});

/* webSocketApi.addRoute('http-proxy', {
  integration: websocketHttpProxyIntegration,
  returnResponse: true,
});  */

const stage = new WebSocketStage(stack, 'mystage', {
  webSocketApi,
  stageName: 'dev',
  autoDeploy: true,
});

// FIXME https://github.com/aws/aws-cdk/issues/11100
/* const accessLogs = new logs.LogGroup(stack, 'APIGW-AccessLogs');
(stage.node.defaultChild as CfnStage).accessLogSettings = {
  destinationArn: accessLogs.logGroupArn,
  format: JSON.stringify({
    requestId: '$context.requestId',
    userAgent: '$context.identity.userAgent',
    sourceIp: '$context.identity.sourceIp',
    requestTime: '$context.requestTime',
    requestTimeEpoch: '$context.requestTimeEpoch',
    httpMethod: '$context.httpMethod',
    path: '$context.path',
    status: '$context.status',
    protocol: '$context.protocol',
    responseLength: '$context.responseLength',
    domainName: '$context.domainName',
  }),
};

const role = new iam.Role(stack, 'ApiGWLogWriterRole', {
  assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
});

const policy = new iam.PolicyStatement({
  actions: [
    'logs:CreateLogGroup',
    'logs:CreateLogStream',
    'logs:DescribeLogGroups',
    'logs:DescribeLogStreams',
    'logs:PutLogEvents',
    'logs:GetLogEvents',
    'logs:FilterLogEvents',
  ],
  resources: ['*'],
});

role.addToPolicy(policy);
accessLogs.grantWrite(role); */

new CfnOutput(stack, 'ApiEndpoint', { value: stage.url });

new integ.IntegTest(app, 'integ-tests', {
  testCases: [stack],
});

app.synth();