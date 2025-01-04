import * as cloudfront from '../';
import { Template } from '../../assertions';
import * as origins from '../../aws-cloudfront-origins';
import { CfnChannelGroup } from '../../aws-mediapackagev2';
import { Stack } from '../../core';

let stack: Stack;
let otherStack: Stack;

beforeEach(() => {
  stack = new Stack();
  otherStack = new Stack();
});

test('Selection criteria does set Media Quality Based failover', () => {
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
    selectionCriteria: cloudfront.OriginGroupSelectionCriteria.MEDIA_QUALITY_BASED,
  });

  new cloudfront.Distribution(stack, 'dist', {
    defaultBehavior: {
      origin: originGroup,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        TargetOriginId: 'distOriginGroup1CE86FDB8',
      },
      OriginGroups: {
        Items: [{
          FailoverCriteria: {
            StatusCodes: {
              Items: [404],
            },
          },
          Id: 'distOriginGroup1CE86FDB8',
          Members: {
            Items: [
              { OriginId: 'distOrigin175AC3CB4' },
              { OriginId: 'distOrigin203EDB784' },
            ],
          },
          SelectionCriteria: 'media-quality-based',
        }],
      },
    },
  });
});

test('Ensure default is undefined', () => {
  const url1 = new origins.HttpOrigin('myurl.com');
  const url2 = new origins.HttpOrigin('myurl1.com');

  const og = new origins.OriginGroup({
    primaryOrigin: url1,
    fallbackOrigin: url2,
    fallbackStatusCodes: [404],
  });

  new cloudfront.Distribution(stack, 'dist', {
    defaultBehavior: {
      origin: og,
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
    DistributionConfig: {
      DefaultCacheBehavior: {
        TargetOriginId: 'distOriginGroup1CE86FDB8',
      },
      OriginGroups: {
        Items: [{
          FailoverCriteria: {
            StatusCodes: {
              Items: [404],
            },
          },
          Id: 'distOriginGroup1CE86FDB8',
          Members: {
            Items: [
              { OriginId: 'distOrigin175AC3CB4' },
              { OriginId: 'distOrigin203EDB784' },
            ],
          },
        }],
      },
    },
  });
});
