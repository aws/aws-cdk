import * as cdk from 'aws-cdk-lib/core';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

/**
 * This test creates a cluster with an instanceIdentifiers attribute that can return writer and reader IDs.
 */

const app = new cdk.App();

const stack = new cdk.Stack(app);

const vpc = new ec2.Vpc(stack, 'VPC');

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_3_06_0 }),
  writer: rds.ClusterInstance.provisioned('Instance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  readers: [rds.ClusterInstance.provisioned('reader')],
  instanceUpdateBehaviour: rds.InstanceUpdateBehaviour.ROLLING,
  vpc,
});

new integ.IntegTest(app, 'instanceIdentifiersTest', {
  testCases: [stack],
});

app.synth();
