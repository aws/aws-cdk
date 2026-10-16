import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-custom-origin-group');
const group = new origins.OriginGroup({
  originId: 'application-failover',
  primaryOrigin: new origins.HttpOrigin('primary.example.com'),
  fallbackOrigin: new origins.HttpOrigin('fallback.example.com'),
});
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: group },
  additionalBehaviors: { '/assets/*': { origin: group } },
});
const integ = new IntegTest(app, 'OriginGroupId', { testCases: [stack] });
integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', { Id: distribution.distributionId })
  .expect(ExpectedResult.objectLike({
    DistributionConfig: {
      DefaultCacheBehavior: { TargetOriginId: 'application-failover' },
      CacheBehaviors: { Items: Match.arrayWith([Match.objectLike({ TargetOriginId: 'application-failover' })]) },
      OriginGroups: { Quantity: 1, Items: [Match.objectLike({ Id: 'application-failover' })] },
    },
  }));
