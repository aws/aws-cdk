import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-s3-postgres-integ');

new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16_3 }),
  vpc: new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false }),
  multiAz: false,
  publiclyAccessible: true,
  iamAuthentication: true,
  s3ImportBuckets: [new s3.Bucket(stack, 'ImportBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY })],
  s3ExportBuckets: [new s3.Bucket(stack, 'ExportBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY })],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new IntegTest(app, 'instance-s3-postgres', {
  testCases: [stack],
});
