/*
 * Stack verification steps:
 * - aws rds describe-db-instances --db-instance-identifier <instance-id>
 * - verify that StorageEncrypted is true
 */

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-default-encryption');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_4 }),
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'rds-instance-default-encryption-integ-test', {
  testCases: [stack],
});
