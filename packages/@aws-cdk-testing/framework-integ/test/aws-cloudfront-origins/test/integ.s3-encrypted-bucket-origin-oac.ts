import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as path from 'path';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'cloudfront-s3-encrypted-bucket-origin-oac');
const kmsKey = new kms.Key(stack, 'myKey', { removalPolicy: cdk.RemovalPolicy.DESTROY });
const bucket = new s3.Bucket(stack, 'MyBucket', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  encryption: s3.BucketEncryption.KMS,
  encryptionKey: kmsKey,
  objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
  autoDeleteObjects: true,
});
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
  },
});
new s3deploy.BucketDeployment(stack, 'DeployWithInvalidation', {
  sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
  destinationBucket: bucket,
  retainOnDelete: false, // default is true, which will block the integration test cleanup
});

const integ = new IntegTest(app, 's3-encrypted-bucket-origin-oac', {
  testCases: [stack],
});

const call = integ.assertions.httpApiCall(`https://${distribution.distributionDomainName}/test.html`);
call.expect(ExpectedResult.objectLike({
  body: 'ecb13420-3826-4f11-a1b5-a4ac2f65c7c6',
}));
