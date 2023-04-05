import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudfront-failover');

const dist = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
  originConfigs: [{
    behaviors: [{ isDefaultBehavior: true }],
    s3OriginSource: {
      s3BucketSource: new s3.Bucket(stack, 'bucket1'),
    },
    failoverS3OriginSource: {
      s3BucketSource: new s3.Bucket(stack, 'bucket2'),
    },
    failoverCriteriaStatusCodes: [cloudfront.FailoverStatusCode.INTERNAL_SERVER_ERROR],
  }],
});

new cdk.CfnOutput(stack, 'DistributionDomainName', { value: dist.domainName });
