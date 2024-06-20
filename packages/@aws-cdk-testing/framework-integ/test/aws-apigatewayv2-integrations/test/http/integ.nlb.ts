import { HttpApi } from 'aws-cdk-lib/aws-apigatewayv2';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { HttpNlbIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { IntegTest, ExpectedResult, AssertionsProvider } from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'integ-nlb-integration');

const vpc = new ec2.Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });
const lb = new elbv2.NetworkLoadBalancer(stack, 'lb', { vpc });
const listener = lb.addListener('listener', { port: 80 });
listener.addTargets('target', { port: 80 });

const httpEndpoint = new HttpApi(stack, 'HttpProxyPrivateApi', {
  defaultIntegration: new HttpNlbIntegration('DefaultIntegration', listener, {
    timeout: Duration.seconds(20),
  }),
});

const integ = new IntegTest(app, 'integ-nlb-integration-test', {
  testCases: [stack],
});

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
