import * as cdkassert from '@aws-cdk/assert-internal';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import '@aws-cdk/assert-internal/jest';
import * as glue from '../lib';

test('throws when a security configuration has no encryption config', () => {
  const stack = new cdk.Stack();

  expect(() => new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
  })).toThrowError(/One of cloudWatchEncryption, jobBookmarksEncryption or s3Encryption must be defined/);
});

test('a security configuration with encryption configuration requiring kms key and providing an explicit one', () => {
  const stack = new cdk.Stack();
  const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const key = kms.Key.fromKeyArn(stack, 'ImportedKey', keyArn);

  const securityConfiguration = new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.KMS,
      kmsKey: key,
    },
  });

  expect(securityConfiguration.cloudWatchEncryptionKey?.keyArn).toEqual(keyArn);
  expect(securityConfiguration.jobBookmarksEncryptionKey).toBeUndefined();
  expect(securityConfiguration.s3EncryptionKey).toBeUndefined();

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

test('a security configuration with an encryption configuration requiring kms key but not providing an explicit one', () => {
  const stack = new cdk.Stack();

  const securityConfiguration = new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.KMS,
    },
  });

  expect(securityConfiguration.cloudWatchEncryptionKey).toBeDefined();
  expect(securityConfiguration.jobBookmarksEncryptionKey).toBeUndefined();
  expect(securityConfiguration.s3EncryptionKey).toBeUndefined();

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::KMS::Key'));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'SSE-KMS',
        KmsKeyArn: stack.resolve(securityConfiguration.cloudWatchEncryptionKey?.keyArn),
      },
    },
  }));
});

test('a security configuration with all encryption configs and mixed kms key inputs', () => {
  const stack = new cdk.Stack();
  const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const key = kms.Key.fromKeyArn(stack, 'ImportedKey', keyArn);

  const securityConfiguration = new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: glue.CloudWatchEncryptionMode.KMS,
    },
    jobBookmarksEncryption: {
      mode: glue.JobBookmarksEncryptionMode.CLIENT_SIDE_KMS,
      kmsKey: key,
    },
    s3Encryption: {
      mode: glue.S3EncryptionMode.S3_MANAGED,
    },
  });

  expect(securityConfiguration.cloudWatchEncryptionKey).toBeDefined();
  expect(securityConfiguration.jobBookmarksEncryptionKey?.keyArn).toEqual(keyArn);
  expect(securityConfiguration.s3EncryptionKey).toBeUndefined();

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::KMS::Key'));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'SSE-KMS',
        // auto-created kms key
        KmsKeyArn: stack.resolve(securityConfiguration.cloudWatchEncryptionKey?.keyArn),
      },
      JobBookmarksEncryption: {
        JobBookmarksEncryptionMode: 'CSE-KMS',
        // explicitly provided kms key
        KmsKeyArn: keyArn,
      },
      S3Encryptions: [{
        S3EncryptionMode: 'SSE-S3',
      }],
    },
  }));
});

test('fromSecurityConfigurationName', () => {
  const stack = new cdk.Stack();
  const name = 'name';

  const securityConfiguration = glue.SecurityConfiguration.fromSecurityConfigurationName(stack, 'ImportedSecurityConfiguration', name);

  expect(securityConfiguration.securityConfigurationName).toEqual(name);
});
