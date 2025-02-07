import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as assert from 'assert';
import * as cdk from 'aws-cdk-lib';
import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class NatInstanceStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    // Configure the `natGatewayProvider` when defining a Vpc
    const natGatewayProvider = ec2.NatProvider.instanceV2({
      instanceType: new ec2.InstanceType('t4g.nano'),
    });

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGatewayProvider,
      // The 'natGateways' parameter now controls the number of NAT instances
      natGateways: 1,
    });

    Array.isArray(vpc);
    Array.isArray(natGatewayProvider.configuredGateways);

    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'ALB', { vpc });
    const listener = loadBalancer.addListener('listener', { port: 80 });
    listener.addTargets('target', { port: 80 });
    listener.addAction('response', { action: elbv2.ListenerAction.fixedResponse(200) });

    const httpApi = new apigwv2.HttpApi(this, 'HttpProxyPrivateApi', {
      defaultIntegration: new integrations.HttpAlbIntegration('DefaultIntegration', listener),
      createDefaultStage: true,
    });

    assert(httpApi.url, 'httpApi.url cannot be empty');
    this.apiUrl = httpApi.url;
  }
}

const app = new cdk.App();
const stack = new NatInstanceStack(app, 'aws-cdk-vpc-nat-instances-v2-arm');

const integ = new IntegTest(app, 'nat-instance-v2-arm-integ-test', {
  testCases: [stack],
});

integ.assertions.httpApiCall(stack.apiUrl, {})
  .expect(ExpectedResult.objectLike({ status: 200 }));
