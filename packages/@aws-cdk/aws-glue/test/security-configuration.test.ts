import { expect, haveResource } from '@aws-cdk/assert';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import '@aws-cdk/assert/jest';
import * as glue from '../lib';

test('a security configuration with non of the optional fields', () => {
  const stack = new cdk.Stack();
  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
  });

  expect(stack).to(haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {},
  }));
});

test('a security configuration with cloudwatch encryption configuration', () => {
  const stack = new cdk.Stack();
  const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const key = kms.Key.fromKeyArn(stack, 'ImportedKey', keyArn);

  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    cloudWatchEncryption: {
      mode: 'SSE-KMS',
      kmsKey: key,
    },
  });

  expect(stack).to(haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      CloudWatchEncryption: {
        CloudWatchEncryptionMode: 'SSE-KMS',
        KmsKeyArn: keyArn,
      },
    },
  }));
});

test('a security configuration with job bookmarks encryption configuration', () => {
  const stack = new cdk.Stack();
  const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const key = kms.Key.fromKeyArn(stack, 'ImportedKey', keyArn);

  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    jobBookmarksEncryption: {
      mode: 'CSE-KMS',
      kmsKey: key,
    },
  });

  expect(stack).to(haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      JobBookmarksEncryption: {
        JobBookmarksEncryptionMode: 'CSE-KMS',
        KmsKeyArn: keyArn,
      },
    },
  }));
});

test('a security configuration with s3 encryption configurations', () => {
  const stack = new cdk.Stack();
  const sseS3KmsKeyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
  const sseS3KmsKey = kms.Key.fromKeyArn(stack, 'SSES3KmsKey', sseS3KmsKeyArn);
  const sseKmsKeyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key2';
  const sseKmsKey = kms.Key.fromKeyArn(stack, 'ImportedKey', sseKmsKeyArn);

  new glue.SecurityConfiguration(stack, 'SecurityConfiguration', {
    securityConfigurationName: 'name',
    s3Encryptions: [
      { mode: 'SSE-KMS', kmsKey: sseKmsKey },
      { mode: 'SSE-S3', kmsKey: sseS3KmsKey },
    ],
  });

  expect(stack).to(haveResource('AWS::Glue::SecurityConfiguration', {
    Name: 'name',
    EncryptionConfiguration: {
      S3Encryptions: [
        { S3EncryptionMode: 'SSE-KMS', KmsKeyArn: sseKmsKeyArn },
        { S3EncryptionMode: 'SSE-S3', KmsKeyArn: sseS3KmsKeyArn },
      ],
    },
  }));
});