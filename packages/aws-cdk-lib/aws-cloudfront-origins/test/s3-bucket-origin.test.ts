import { Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront/index';
import * as origins from '../../aws-cloudfront-origins';
import * as s3 from '../../aws-s3/index';
import { Stack } from '../../core';

describe('S3BucketOrigin', () => {
  describe('withOriginAccessControl', () => {
    test('origin can be used by multiple Distributions', () => {
      const stack = new Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket);

      new cloudfront.Distribution(stack, 'MyDistributionA', {
        defaultBehavior: { origin: origin },
      });
      new cloudfront.Distribution(stack, 'MyDistributionB', {
        defaultBehavior: { origin: origin },
      });

      const template = Template.fromStack(stack);
      template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1);
      template.resourceCountIs('AWS::CloudFront::Distribution', 2);
      template.resourceCountIs('AWS::S3::Bucket', 1);
      template.resourceCountIs('AWS::S3::BucketPolicy', 1);
    });
  });
});