import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3tables from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'kms-key-s3tables-stack');

const kmsKey = new kms.Key(stack, 'KmsKey');

new s3tables.TableBucket(stack, 'TableBucket', {
  tableBucketName: 'kms-key-s3tables-bucket',
  kmsKey: kmsKey,
});

cdk.RemovalPolicies.of(stack).destroy();

new integ.IntegTest(app, 'kms-key-s3tables-integ', {
  testCases: [stack],
});
