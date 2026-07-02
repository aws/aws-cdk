import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-failover');

const bucket1 = new s3.Bucket(stack, 'bucket1');
const bucket2 = new s3.Bucket(stack, 'bucket2');

const originGroup = new origins.OriginGroup({
  primaryOrigin: origins.S3BucketOrigin.withOriginAccessControl(bucket1),
  fallbackOrigin: origins.S3BucketOrigin.withOriginAccessControl(bucket2),
  fallbackStatusCodes: [500],
});

const dist = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: originGroup },
});

new cdk.CfnOutput(stack, 'DistributionDomainName', { value: dist.domainName });
