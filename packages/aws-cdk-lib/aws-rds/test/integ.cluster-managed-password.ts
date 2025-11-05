import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-managed-password');

const vpc = new ec2.Vpc(stack, 'VPC');

new rds.DatabaseCluster(stack, 'ManagedPasswordCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_04_0 }),
  manageMasterUserPassword: true,
  credentials: rds.Credentials.fromUsername('clusteradmin'),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  }),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new integ.IntegTest(app, 'ClusterManagedPasswordTest', {
  testCases: [stack],
});
