import { Template } from '@aws-cdk/assertions';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
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
