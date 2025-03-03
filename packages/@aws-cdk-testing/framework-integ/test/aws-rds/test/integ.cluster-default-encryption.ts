/*
 * Stack verification steps:
 * - aws rds describe-db-clusters --db-cluster-identifier <cluster-id>
 * - verify that StorageEncrypted is true
 */

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DatabaseCluster, DatabaseClusterEngine, AuroraPostgresEngineVersion } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-default-encryption');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_16_4 }),
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
    vpc,
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'IntegClusterDefaultEncryption', {
  testCases: [stack],
});

app.synth();
