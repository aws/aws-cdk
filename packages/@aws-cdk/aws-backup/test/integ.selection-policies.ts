import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as backup from '../lib';

const app = new App();

const stack = new Stack(app, 'cdk-selection-policies');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  // Bucket must be versioned to enable AWS Backup
  versioned: true,
});

const vault = new backup.BackupVault(stack, 'Vault', {
  removalPolicy: RemovalPolicy.DESTROY,
});

// Plan with selection containing all policies
const planAll = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'PlanAll', vault);
planAll.addSelection('SelectionAll', {
  resources: [
    backup.BackupResource.fromS3Bucket(bucket),
  ],
  allowBackup: true,
  allowRestores: true,
  allowS3Backup: true,
  allowS3Restores: true,
});

// Plan with selection containing no policies
const planNone = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'PlanNone', vault);
planNone.addSelection('SelectionNone', {
  resources: [
    backup.BackupResource.fromS3Bucket(bucket),
  ],
  allowBackup: false,
  allowRestores: false,
  allowS3Backup: false,
  allowS3Restores: false,
});

// Plan with selection containing no policies
const planDefault = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'PlanDefault', vault);
planDefault.addSelection('SelectionDefault', {
  resources: [
    backup.BackupResource.fromS3Bucket(bucket),
  ],
});

// Plan with only S3 policies
const planS3Only = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'PlanS3Only', vault);
planS3Only.addSelection('SelectionS3Only', {
  resources: [
    backup.BackupResource.fromS3Bucket(bucket),
  ],
  allowBackup: false,
  allowS3Backup: true,
  allowS3Restores: true,
});

new integ.IntegTest(app, 'SelectionPolicies', { testCases: [stack] });

app.synth();