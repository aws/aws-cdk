import * as s3 from '@aws-cdk/aws-s3';
import { App, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as backup from '../lib';

const app = new App();

const stack = new Stack(app, 'cdk-backup-s3');

const bucket = new s3.Bucket(stack, 'Bucket', {
  removalPolicy: RemovalPolicy.DESTROY,
  // Bucket must be versioned to enable AWS Backup
  versioned: true,
});

const vault = new backup.BackupVault(stack, 'Vault', {
  removalPolicy: RemovalPolicy.DESTROY,
});

// Allow the discovery to find the bucket and add s3 managed policies
const planAuto = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'PlanAuto', vault);
planAuto.addSelection('SelectionAuto', {
  resources: [
    backup.BackupResource.fromConstruct(stack), // Ensure that s3 bucket is found
  ],
  allowS3Backup: true,
  allowS3Restores: true,
});

// Create a plan where we explicitly add the s3 resource using fromS3Bucket and
// add the policies
const planExplicit = backup.BackupPlan.dailyWeeklyMonthly5YearRetention(stack, 'PlanExplicit', vault);
planExplicit.addSelection('SelectionExplicit', {
  resources: [
    backup.BackupResource.fromS3Bucket(bucket),
  ],
  allowS3Backup: true,
  allowS3Restores: true,
});

new integ.IntegTest(app, 'BackupS3Resource', { testCases: [stack] });

app.synth();