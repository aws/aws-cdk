import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy-endpoint');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_18_1,
  }),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const proxy = instance.addProxy('Proxy', {
  secrets: [instance.secret!],
  vpc,
});

const customEndpoint = proxy.addEndpoint('CustomEndpoint', {
  vpc,
  targetRole: rds.ProxyEndpointTargetRole.READ_ONLY,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
});

new cdk.CfnOutput(stack, 'ProxyEndpoint', {
  value: proxy.endpoint,
});

new cdk.CfnOutput(stack, 'CustomEndpointAddress', {
  value: customEndpoint.endpoint,
});

new IntegTest(app, 'proxy-endpoint-integ-test', {
  testCases: [stack],
});

app.synth();
