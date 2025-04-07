import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cdk from 'aws-cdk-lib';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { CfnChannelGroup } from 'aws-cdk-lib/aws-mediapackagev2';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'cloudfront-origin-group-selection-criteria');

const channelGroup = new CfnChannelGroup(stack, 'cg1', {
  channelGroupName: 'channelGroup1',
});
const channelGroup2 = new CfnChannelGroup(stack, 'cg2', {
  channelGroupName: 'channelGroup2',
});

const originGroup = new origins.OriginGroup({
  primaryOrigin: new origins.HttpOrigin(channelGroup.attrEgressDomain),
  fallbackOrigin: new origins.HttpOrigin(channelGroup2.attrEgressDomain),
  fallbackStatusCodes: [404],
  selectionCriteria: cloudfront.OriginSelectionCriteria.MEDIA_QUALITY_BASED,
});

new cloudfront.Distribution(stack, 'Distribution', {
  defaultBehavior: { origin: originGroup },
  additionalBehaviors: {
    '/video': {
      origin: originGroup,
    },
  },
});

new IntegTest(app, 'origin-group-selection-criteria', {
  testCases: [stack],
});
