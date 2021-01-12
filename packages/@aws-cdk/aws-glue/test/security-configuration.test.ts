import * as cdkassert from '@aws-cdk/assert';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import * as glue from '../lib';

test('a security configuration with no encryption config', () => {
  const stack = new cdk.Stack();

  expect(() => new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
  })).toThrowError(/One of cloudWatchEncryption, jobBookmarksEncryption or s3Encryption must be defined/);
});

test('a security configuration with cloudwatch encryption configuration', () => {
  const stack = new cdk.Stack();
  const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const key = kms.Key.fromKeyArn(stack, 'ImportedKey', keyArn);

  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.KMS,
      kmsKey: key,
    },
  });

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'SSE-KMS',
        KmsKeyArn: keyArn,
      },
    },
  }));
});

test('a security configuration with cloudwatch encryption configuration requiring but missing a kms key', () => {
  const stack = new cdk.Stack();

  expect(() => new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.KMS,
    },
  })).toThrowError(/SSE-KMS requires providing a kms key/);
});

test('a security configuration with cloudwatch encryption configuration not requiring a kms key', () => {
  const stack = new cdk.Stack();

  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.DISABLED,
    },
  });

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'DISABLED',
      },
    },
  }));
});

test('a security configuration with all encryption configs', () => {
  const stack = new cdk.Stack();
  const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const key = kms.Key.fromKeyArn(stack, 'ImportedKey', keyArn);

  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.DISABLED,
    },
    jobBookmarksEncryption: {
      mode: glue.JobBookmarksEncryptionMode.CLIENT_SIDE_KMS,
      kmsKey: key,
    },
    s3Encryption: {
      mode: glue.S3EncryptionMode.S3_MANAGED,
    },
  });

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'DISABLED',
      },
      JobBookmarksEncryption: {
        JobBookmarksEncryptionMode: 'CSE-KMS',
        KmsKeyArn: keyArn,
      },
      S3Encryptions: [{
        S3EncryptionMode: 'SSE-S3',
      }],
    },
  }));
});
