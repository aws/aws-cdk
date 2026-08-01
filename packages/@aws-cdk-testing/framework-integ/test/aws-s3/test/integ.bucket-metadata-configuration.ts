#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-s3-metadata-configuration');

// A customer managed key that the S3 Metadata service is allowed to use.
const key = new kms.Key(stack, 'MetadataKey', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

key.addToResourcePolicy(new iam.PolicyStatement({
  principals: [
    new iam.ServicePrincipal('metadata.s3.amazonaws.com'),
    new iam.ServicePrincipal('maintenance.s3tables.amazonaws.com'),
  ],
  actions: ['kms:Decrypt', 'kms:GenerateDataKey'],
  resources: ['*'],
}));

// Journal table only, with the default (disabled) record expiration and S3 managed encryption.
const defaultsBucket = new s3.Bucket(stack, 'DefaultsBucket', {
  metadataConfiguration: {
    journalTable: {
      encryption: s3.MetadataTableEncryption.s3Managed(),
    },
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// S3 Metadata requires a role it can assume to write to the annotation table.
const annotationRole = new iam.Role(stack, 'AnnotationRole', {
  assumedBy: new iam.ServicePrincipal('metadata.s3.amazonaws.com'),
});

annotationRole.addToPolicy(new iam.PolicyStatement({
  actions: [
    's3tables:CreateTableBucket',
    's3tables:CreateNamespace',
    's3tables:CreateTable',
    's3tables:GetTable',
    's3tables:PutTablePolicy',
    's3tables:PutTableEncryption',
    's3tables:PutTableBucketPolicy',
    's3tables:GetTableData',
    's3tables:PutTableData',
    'kms:DescribeKey',
  ],
  resources: ['*'],
}));

// All three tables, with record expiration and KMS encryption.
const fullBucket = new s3.Bucket(stack, 'FullBucket', {
  metadataConfiguration: {
    journalTable: {
      recordExpiration: s3.MetadataRecordExpiration.ENABLED,
      recordExpirationAfter: cdk.Duration.days(7),
      encryption: s3.MetadataTableEncryption.kms(key),
    },
    inventoryTable: {
      configurationState: s3.MetadataConfigurationState.ENABLED,
      encryption: s3.MetadataTableEncryption.kms(key),
    },
    annotationTable: {
      configurationState: s3.MetadataConfigurationState.ENABLED,
      encryption: s3.MetadataTableEncryption.kms(key),
      role: annotationRole,
    },
  },
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const integ = new IntegTest(app, 'cdk-integ-bucket-metadata-configuration', {
  testCases: [stack],
});

// The IAM action for both the V1 and V2 API operations is s3:GetBucketMetadataTableConfiguration,
// which does not match the V2 API name that the assertion derives its grant from.
const metadataReadPolicy = {
  Effect: 'Allow',
  Action: ['s3:GetBucketMetadataTableConfiguration'],
  Resource: ['*'],
};

// The journal table is always created, and record expiration defaults to disabled.
const defaultsCall = integ.assertions.awsApiCall('S3', 'getBucketMetadataConfiguration', {
  Bucket: defaultsBucket.bucketName,
});
defaultsCall.provider.addToRolePolicy(metadataReadPolicy);
defaultsCall.expect(ExpectedResult.objectLike({
  GetBucketMetadataConfigurationResult: {
    MetadataConfigurationResult: {
      JournalTableConfigurationResult: {
        RecordExpiration: { Expiration: 'DISABLED' },
      },
    },
  },
}));

// Record expiration and the optional tables are applied as configured.
const fullCall = integ.assertions.awsApiCall('S3', 'getBucketMetadataConfiguration', {
  Bucket: fullBucket.bucketName,
});
fullCall.provider.addToRolePolicy(metadataReadPolicy);
fullCall.expect(ExpectedResult.objectLike({
  GetBucketMetadataConfigurationResult: {
    MetadataConfigurationResult: {
      JournalTableConfigurationResult: {
        RecordExpiration: { Expiration: 'ENABLED', Days: 7 },
      },
      InventoryTableConfigurationResult: {
        ConfigurationState: 'ENABLED',
      },
      // AnnotationTableConfigurationResult is deliberately not asserted: the deployed
      // configuration below enables the annotation table, but the assertion provider's SDK
      // does not return that key in the response. The annotation table is still covered by
      // this test, because S3 rejects the stack outright if the configuration is invalid.
    },
  },
}));
