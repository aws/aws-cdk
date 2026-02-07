import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { DatabaseInstance, DatabaseInstanceEngine, LicenseModel, SqlServerEngineVersion } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-s3-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const importBucket = new s3.Bucket(stack, 'ImportBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY, autoDeleteObjects: true });
const exportBucket = new s3.Bucket(stack, 'ExportBucket', { removalPolicy: cdk.RemovalPolicy.DESTROY, autoDeleteObjects: true });

new DatabaseInstance(stack, 'Database', {
  engine: DatabaseInstanceEngine.sqlServerSe({ version: SqlServerEngineVersion.VER_15 }),
  vpc,
  licenseModel: LicenseModel.LICENSE_INCLUDED,
  s3ImportBuckets: [importBucket],
  s3ExportBuckets: [exportBucket],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  deletionProtection: false,
});

new IntegTest(app, 'integ.instance-s3', {
  testCases: [stack],
});

app.synth();
