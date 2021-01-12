import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-security-configuration');

const key = new kms.Key(stack, 'Key');

// SecurityConfiguration for all 3 (s3, cloudwatch and job bookmarks) in disabled mode without kms key provided
new glue.SecurityConfiguration(stack, 'DisabledKeylessSC', {
  securityConfigurationName: 'DisabledKeylessSC',
  jobBookmarksEncryption: {
    mode: glue.JobBookmarksEncryptionMode.DISABLED,
  },
  cloudWatchEncryption: {
    mode: glue.CloudWatchEncryptionMode.DISABLED,
  },
  s3Encryption: {
    mode: glue.S3EncryptionMode.DISABLED,
  },
});

// SecurityConfiguration for all 3 (s3, cloudwatch and job bookmarks) in modes requiring kms keys
new glue.SecurityConfiguration(stack, 'EnabledSC', {
  securityConfigurationName: 'EnabledSC',
  jobBookmarksEncryption: {
    mode: glue.JobBookmarksEncryptionMode.CLIENT_SIDE_KMS,
    kmsKey: key,
  },
  cloudWatchEncryption: {
    mode: glue.CloudWatchEncryptionMode.KMS,
    kmsKey: key,
  },
  s3Encryption: {
    mode: glue.S3EncryptionMode.KMS,
    kmsKey: key,
  },
});

// SecurityConfiguration for s3 not requiring kms key
new glue.SecurityConfiguration(stack, 'S3SC', {
  securityConfigurationName: 'S3SC',
  s3Encryption: {
    mode: glue.S3EncryptionMode.S3_MANAGED,
  },
});

app.synth();
