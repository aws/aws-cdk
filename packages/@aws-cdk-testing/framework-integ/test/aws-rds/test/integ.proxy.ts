import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false, natGateways: 1 });

const dbInstance = new rds.DatabaseInstance(stack, 'DBInstance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_16_11,
  }),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const proxy = dbInstance.addProxy('DBProxy', {
  secrets: [dbInstance.secret!],
  vpc,
  debugLogging: true,
  requireTLS: false,
});

new cdk.CfnOutput(stack, 'ProxyEndpoint', {
  value: proxy.endpoint,
});

new IntegTest(app, 'database-proxy-integ-test', {
  testCases: [stack],
});
