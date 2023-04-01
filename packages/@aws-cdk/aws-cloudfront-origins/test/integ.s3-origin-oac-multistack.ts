import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as origins from '../lib';

class TestS3OriginOAC extends origins.S3Origin {
  constructor(
    bucket: s3.IBucket,
    policy?: origins.S3OriginAutoResourcePolicy | boolean,
    oac?: cloudfront.OriginAccessControl,
  ) {
    super(bucket, {
      autoResourcePolicy: policy,
      originAccessControl: oac ?? true,
    });
  }
}

function makeDistribution(stack: cdk.Stack, id: string, first: cloudfront.IOrigin, ...more: cloudfront.IOrigin[]) {
  const dist = new cloudfront.Distribution(stack, id, {
    defaultBehavior: { origin: first },
  });
  more.forEach((o, idx) => dist.addBehavior(`${idx}/*`, o));
}

const app = new cdk.App();

const stack1 = new cdk.Stack(app, 'oacmulti1');
const bucket = new s3.Bucket(stack1, 'Bucket', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const bucketByName = s3.Bucket.fromBucketName(stack1, 'BucketHardcoded', 's3origin-oac-test-bucket');
const bucketImport = s3.Bucket.fromBucketName(stack1, 'BucketImported', bucket.bucketName);

const bucketWithKMS = new s3.Bucket(stack1, 'BucketKMS', {
  encryption: s3.BucketEncryption.KMS,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
bucketWithKMS.encryptionKey?.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

const stack2 = new cdk.Stack(app, 'oacmulti2');
makeDistribution(stack2, 'Dist',
  new TestS3OriginOAC(bucket),
  new TestS3OriginOAC(bucketWithKMS, origins.S3OriginAutoResourcePolicy.READ_WRITE),
  new TestS3OriginOAC(bucketImport, false),
  new TestS3OriginOAC(bucketByName, false),
);

new integ.IntegTest(app, 'CloudFrontS3OriginOACTest', {
  testCases: [stack1, stack2],
});
