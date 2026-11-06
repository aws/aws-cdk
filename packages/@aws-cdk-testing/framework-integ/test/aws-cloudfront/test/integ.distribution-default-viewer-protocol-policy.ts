import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { ExpectedResult, IntegTest, Match } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-cloudfront:defaultViewerProtocolPolicyRedirectToHttps': true,
  },
});
const stack = new cdk.Stack(app, 'integ-distribution-default-viewer-protocol-policy');

const origin = new TestOrigin('www.example.com');

// Neither behavior sets `viewerProtocolPolicy`, so both pick up the feature-flagged default.
const distribution = new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: {
    origin,
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
  },
  additionalBehaviors: {
    '/images/*': { origin },
  },
});

distribution.addBehavior('/api', origin);

const integ = new IntegTest(app, 'DistributionDefaultViewerProtocolPolicy', {
  testCases: [stack],
});

integ.assertions.awsApiCall('CloudFront', 'getDistributionConfig', {
  Id: distribution.distributionId,
}).expect(
  ExpectedResult.objectLike({
    DistributionConfig: Match.objectLike({
      DefaultCacheBehavior: Match.objectLike({
        ViewerProtocolPolicy: 'redirect-to-https',
      }),
      CacheBehaviors: Match.objectLike({
        Items: Match.arrayWith([
          Match.objectLike({
            PathPattern: '/images/*',
            ViewerProtocolPolicy: 'redirect-to-https',
          }),
          Match.objectLike({
            PathPattern: '/api',
            ViewerProtocolPolicy: 'redirect-to-https',
          }),
        ]),
      }),
    }),
  }),
);
