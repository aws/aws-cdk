import { Match, Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront';
import * as mediapackage from '../../aws-mediapackagev2';
import * as s3 from '../../aws-s3';
import { Stack } from '../../core';
import * as origins from '../lib';

let stack: Stack;
let bucket: s3.IBucket;
let primaryOrigin: cloudfront.IOrigin;
beforeEach(() => {
  stack = new Stack();
  bucket = new s3.Bucket(stack, 'Bucket');
  primaryOrigin = new origins.S3Origin(bucket);
});

describe('Origin Groups', () => {
  test('ignores a group ID on an ordinary origin and reuses its actual origin ID', () => {
    const httpOrigin = new origins.HttpOrigin('ordinary.example.com', { originId: 'ordinary-origin' });
    const ordinaryOrigin: cloudfront.IOrigin = {
      bind: (scope, options) => ({ ...httpOrigin.bind(scope, options), originGroupId: 'ignored-group' }),
    };
    const distribution = new cloudfront.Distribution(stack, 'Distribution', { defaultBehavior: { origin: ordinaryOrigin } });
    distribution.addBehavior('/ordinary/*', ordinaryOrigin);
    distribution.addBehavior('/group/*', new origins.OriginGroup({
      primaryOrigin: new origins.HttpOrigin('primary.example.com'),
      fallbackOrigin: new origins.HttpOrigin('fallback.example.com'),
      originId: 'ignored-group',
    }));
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: { TargetOriginId: 'ordinary-origin' },
        CacheBehaviors: Match.arrayWith([
          Match.objectLike({ PathPattern: '/ordinary/*', TargetOriginId: 'ordinary-origin' }),
          Match.objectLike({ PathPattern: '/group/*', TargetOriginId: 'ignored-group' }),
        ]),
      },
    });
  });

  test.each(['primary', 'fallback', 'ordinary'])('fails when a group ID collides with a %s origin ID', collision => {
    const group = new origins.OriginGroup({
      primaryOrigin: new origins.HttpOrigin('primary.example.com', { originId: collision === 'primary' ? 'shared-id' : 'primary' }),
      fallbackOrigin: new origins.HttpOrigin('fallback.example.com', { originId: collision === 'fallback' ? 'shared-id' : 'fallback' }),
      originId: 'shared-id',
    });
    expect(() => {
      const distribution = new cloudfront.Distribution(stack, 'Distribution', { defaultBehavior: { origin: group } });
      if (collision === 'ordinary') {
        distribution.addBehavior('/ordinary/*', new origins.HttpOrigin('ordinary.example.com', { originId: 'shared-id' }));
      }
    }).toThrow('Origin with id shared-id already exists');
  });

  test('reuses the generated group ID in additional cache behaviors', () => {
    const group = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: new origins.HttpOrigin('fallback.example.com'),
    });
    const distribution = new cloudfront.Distribution(stack, 'Distribution', { defaultBehavior: { origin: group } });
    distribution.addBehavior('/assets/*', group);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: { TargetOriginId: 'DistributionOriginGroup1A1A31B49' },
        CacheBehaviors: Match.arrayWith([Match.objectLike({ TargetOriginId: 'DistributionOriginGroup1A1A31B49' })]),
        OriginGroups: { Quantity: 1, Items: [Match.objectLike({ Id: 'DistributionOriginGroup1A1A31B49' })] },
      },
    });
  });

  test('uses the custom group ID in default and additional behavior references', () => {
    const group = new origins.OriginGroup({
      primaryOrigin: new origins.HttpOrigin('primary.example.com', { originId: 'primary' }),
      fallbackOrigin: new origins.HttpOrigin('fallback.example.com', { originId: 'fallback' }),
      originId: 'readable-failover',
    });
    const distribution = new cloudfront.Distribution(stack, 'Distribution', { defaultBehavior: { origin: group } });
    distribution.addBehavior('/assets/*', group);
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: { TargetOriginId: 'readable-failover' },
        CacheBehaviors: Match.arrayWith([Match.objectLike({ TargetOriginId: 'readable-failover' })]),
        OriginGroups: {
          Quantity: 1,
          Items: [Match.objectLike({
            Id: 'readable-failover',
            Members: { Quantity: 2, Items: [{ OriginId: 'primary' }, { OriginId: 'fallback' }] },
          })],
        },
      },
    });
  });

  test('fails for duplicate custom origin group IDs', () => {
    const group = () => new origins.OriginGroup({
      primaryOrigin: new origins.HttpOrigin('primary.example.com'),
      fallbackOrigin: new origins.HttpOrigin('fallback.example.com'),
      originId: 'same-group',
    });
    const distribution = new cloudfront.Distribution(stack, 'Distribution', { defaultBehavior: { origin: group() } });
    expect(() => distribution.addBehavior('/other/*', group())).toThrow('Origin with id same-group already exists');
  });

  test('correctly render the OriginGroups property of DistributionConfig', () => {
    const failoverOrigin = new origins.S3Origin(s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'imported-bucket'));
    const originGroup = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: failoverOrigin,
      fallbackStatusCodes: [500],
    });

    new cloudfront.Distribution(stack, 'Distribution', {
      defaultBehavior: { origin: originGroup },
    });

    const primaryOriginId = 'DistributionOrigin13547B94F';
    const failoverOriginId = 'DistributionOrigin2C85CC43B';
    const originGroupId = 'DistributionOriginGroup1A1A31B49';
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          TargetOriginId: originGroupId,
        },
        Origins: [
          {
            Id: primaryOriginId,
            DomainName: {
              'Fn::GetAtt': ['Bucket83908E77', 'RegionalDomainName'],
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': ['', [
                  'origin-access-identity/cloudfront/',
                  { Ref: 'DistributionOrigin1S3Origin5F5C0696' },
                ]],
              },
            },
          },
          {
            Id: failoverOriginId,
            DomainName: {
              'Fn::Join': ['', [
                'imported-bucket.s3.',
                { Ref: 'AWS::Region' },
                '.',
                { Ref: 'AWS::URLSuffix' },
              ]],
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': ['', [
                  'origin-access-identity/cloudfront/',
                  { Ref: 'DistributionOrigin2S3OriginE484D4BF' },
                ]],
              },
            },
          },
        ],
        OriginGroups: {
          Items: [
            {
              FailoverCriteria: {
                StatusCodes: {
                  Items: [500],
                  Quantity: 1,
                },
              },
              Id: 'DistributionOriginGroup1A1A31B49',
              Members: {
                Items: [
                  { OriginId: primaryOriginId },
                  { OriginId: failoverOriginId },
                ],
                Quantity: 2,
              },
            },
          ],
          Quantity: 1,
        },
      },
    });
  });

  test('correctly render the OriginGroups property of DistributionConfig with originId set', () => {
    const failoverOrigin = new origins.S3Origin(s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'imported-bucket'), { originId: 'MyCustomOrigin1' });
    const originGroup = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: failoverOrigin,
      fallbackStatusCodes: [500],
    });

    new cloudfront.Distribution(stack, 'Distribution', {
      defaultBehavior: { origin: originGroup },
    });

    const primaryOriginId = 'DistributionOrigin13547B94F';
    const originGroupId = 'DistributionOriginGroup1A1A31B49';
    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: {
        DefaultCacheBehavior: {
          TargetOriginId: originGroupId,
        },
        Origins: [
          {
            Id: primaryOriginId,
            DomainName: {
              'Fn::GetAtt': ['Bucket83908E77', 'RegionalDomainName'],
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': ['', [
                  'origin-access-identity/cloudfront/',
                  { Ref: 'DistributionOrigin1S3Origin5F5C0696' },
                ]],
              },
            },
          },
          {
            Id: 'MyCustomOrigin1',
            DomainName: {
              'Fn::Join': ['', [
                'imported-bucket.s3.',
                { Ref: 'AWS::Region' },
                '.',
                { Ref: 'AWS::URLSuffix' },
              ]],
            },
            S3OriginConfig: {
              OriginAccessIdentity: {
                'Fn::Join': ['', [
                  'origin-access-identity/cloudfront/',
                  { Ref: 'DistributionOrigin2S3OriginE484D4BF' },
                ]],
              },
            },
          },
        ],
        OriginGroups: {
          Items: [
            {
              FailoverCriteria: {
                StatusCodes: {
                  Items: [500],
                  Quantity: 1,
                },
              },
              Id: 'DistributionOriginGroup1A1A31B49',
              Members: {
                Items: [
                  { OriginId: primaryOriginId },
                  { OriginId: 'MyCustomOrigin1' },
                ],
                Quantity: 2,
              },
            },
          ],
          Quantity: 1,
        },
      },
    });
  });

  test('cannot have an Origin with their own failover configuration as the primary Origin', () => {
    const failoverOrigin = new origins.S3Origin(s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'imported-bucket'));
    const originGroup = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: failoverOrigin,
    });
    const groupOfGroups = new origins.OriginGroup({
      primaryOrigin: originGroup,
      fallbackOrigin: failoverOrigin,
    });

    expect(() => {
      new cloudfront.Distribution(stack, 'Distribution', {
        defaultBehavior: { origin: groupOfGroups },
      });
    }).toThrow(/An OriginGroup cannot use an Origin with its own failover configuration as its primary origin!/);
  });

  test('cannot have an Origin with their own failover configuration as the fallback Origin', () => {
    const originGroup = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: new origins.S3Origin(s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'imported-bucket')),
    });
    const groupOfGroups = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: originGroup,
    });

    expect(() => {
      new cloudfront.Distribution(stack, 'Distribution', {
        defaultBehavior: { origin: groupOfGroups },
      });
    }).toThrow(/An Origin cannot use an Origin with its own failover configuration as its fallback origin!/);
  });

  test('cannot have an empty array of fallbackStatusCodes', () => {
    const failoverOrigin = new origins.S3Origin(s3.Bucket.fromBucketName(stack, 'ImportedBucket', 'imported-bucket'));
    const originGroup = new origins.OriginGroup({
      primaryOrigin,
      fallbackOrigin: failoverOrigin,
      fallbackStatusCodes: [],
    });

    expect(() => {
      new cloudfront.Distribution(stack, 'Distribution', {
        defaultBehavior: { origin: originGroup },
      });
    }).toThrow(/fallbackStatusCodes cannot be empty/);
  });
});

test('Selection criteria does set Media Quality Based failover for Origin Group', () => {
  const channelGroup = new mediapackage.CfnChannelGroup(stack, 'cg1', {
    channelGroupName: 'channelGroup1',
  });
  const channelGroup2 = new mediapackage.CfnChannelGroup(stack, 'cg2', {
    channelGroupName: 'channelGroup2',
  });

  const originGroup = new origins.OriginGroup({
    primaryOrigin: new origins.HttpOrigin(channelGroup.attrEgressDomain),
    fallbackOrigin: new origins.HttpOrigin(channelGroup2.attrEgressDomain),
    fallbackStatusCodes: [404],
    selectionCriteria: cloudfront.OriginSelectionCriteria.MEDIA_QUALITY_BASED,
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

test('Selection criteria does set default for Origin Group', () => {
  const url1 = new origins.HttpOrigin('myurl.com');
  const url2 = new origins.HttpOrigin('myurl1.com');

  const og = new origins.OriginGroup({
    primaryOrigin: url1,
    fallbackOrigin: url2,
    fallbackStatusCodes: [404],
    selectionCriteria: cloudfront.OriginSelectionCriteria.DEFAULT,
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
          SelectionCriteria: 'default',
        }],
      },
    },
  });
});
