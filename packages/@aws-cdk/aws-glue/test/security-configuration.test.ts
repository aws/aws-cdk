import * as assert from 'assert';
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

  // kms key not created
  assert.deepStrictEqual(securityConfiguration.kmsKey, undefined);

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

  // auto created kms key
  assert.notDeepStrictEqual(securityConfiguration.kmsKey, undefined);
  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::KMS::Key'));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'SSE-KMS',
        KmsKeyArn: stack.resolve(securityConfiguration.kmsKey?.keyArn),
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

  // auto created kms key
  assert.notDeepStrictEqual(securityConfiguration.kmsKey, undefined);
  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::KMS::Key'));

  cdkassert.expect(stack).to(cdkassert.haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'SSE-KMS',
        // auto-created kms key
        KmsKeyArn: stack.resolve(securityConfiguration.kmsKey?.keyArn),
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
