import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'integ-aurora-serverlessv2-cluster');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new rds.DatabaseCluster(stack, 'Serverless Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: rds.AuroraMysqlEngineVersion.VER_3_11_1,
  }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'integ-test', {
  testCases: [stack],
});
