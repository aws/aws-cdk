import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cluster-applyimmediately-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 0, restrictDefaultSecurityGroup: false });

const instanceProps = {
  publiclyAccessible: false,
  applyImmediately: false,
};

new rds.DatabaseCluster(stack, 'DatabaseCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_07_1 }),
  credentials: rds.Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
  vpc,
  writer: rds.ClusterInstance.provisioned('Instance1', { ...instanceProps }),
  readers: [
    rds.ClusterInstance.serverlessV2('Instance2', { ...instanceProps }),
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'test-cluster-applyimmediately-integ', {
  testCases: [stack],
});
