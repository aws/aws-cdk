import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'instance-applyimmediately-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 0, restrictDefaultSecurityGroup: false });

new rds.DatabaseInstance(stack, 'DatabaseInstance', {
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_40 }),
  credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  vpc,
  publiclyAccessible: false,
  applyImmediately: false,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'test-instance-applyimmediately-integ', {
  testCases: [stack],
});
