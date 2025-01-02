import { AssertionsProvider, ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as assert from 'assert';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpAlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new App();

const stack = new Stack(app, 'integ-alb-integration');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const lb = new elbv2.ApplicationLoadBalancer(stack, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', { port: 80 });
listener.addAction('dsf', { action: elbv2.ListenerAction.fixedResponse(200) });

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpAlbIntegration('DefaultIntegration', listener, {
    timeout: Duration.seconds(20),
  }),
});

assert(httpEndpoint.url, 'HttpEndpoint URL is not defined');

const integ = new IntegTest(app, 'integ-alb-integration-test', {
  testCases: [stack],
});

integ.assertions.httpApiCall(httpEndpoint.url).expect(
  ExpectedResult.objectLike({ status: 200 }),
);

const integrations = integ.assertions.awsApiCall('ApiGatewayV2', 'getIntegrations', {
  ApiId: httpEndpoint.httpApiId,
});

const assertionProvider = integrations.node.tryFindChild('SdkProvider') as AssertionsProvider;
assertionProvider.addPolicyStatementFromSdkCall('apigateway', 'GET', [
  `arn:${stack.partition}:apigateway:${stack.region}::/apis/${httpEndpoint.httpApiId}/integrations`,
]);

integrations.expect(
  ExpectedResult.objectLike({ Items: [{ IntegrationMethod: 'ANY', TimeoutInMillis: 20000 }] }),
);

app.synth();
