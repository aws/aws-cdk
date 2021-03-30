import { expect, haveResourceLike } from '@aws-cdk/assert-internal';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { CloudFrontWebDistribution, FailoverStatusCode } from '../lib';

nodeunitShim({
  'Distribution with custom origin failover'(test: Test) {
    const stack = new cdk.Stack();

    new CloudFrontWebDistribution(stack, 'ADistribution', {
      originConfigs: [
        {
          originHeaders: {
            'X-Custom-Header': 'somevalue',
          },
          customOriginSource: {
            domainName: 'myorigin.com',
          },
          failoverCustomOriginSource: {
            domainName: 'myoriginfallback.com',
          },
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
    });

    expect(stack).to(
      haveResourceLike('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          OriginGroups: {
            Items: [
              {
                FailoverCriteria: {
                  StatusCodes: {
                    Items: [
                      500,
                      502,
                      503,
                      504,
                    ],
                    Quantity: 4,
                  },
                },
                Id: 'OriginGroup1',
                Members: {
                  Items: [
                    {
                      OriginId: 'origin1',
                    },
                    {
                      OriginId: 'originSecondary1',
                    },
                  ],
                  Quantity: 2,
                },
              },
            ],
            Quantity: 1,
          },
          Origins: [
            {
              CustomOriginConfig: {
                HTTPPort: 80,
                HTTPSPort: 443,
                OriginKeepaliveTimeout: 5,
                OriginProtocolPolicy: 'https-only',
                OriginReadTimeout: 30,
                OriginSSLProtocols: [
                  'TLSv1.2',
                ],
              },
              DomainName: 'myoriginfallback.com',
              Id: 'originSecondary1',
              OriginCustomHeaders: [
                {
                  HeaderName: 'X-Custom-Header',
                  HeaderValue: 'somevalue',
                },
              ],
            },
            {
              CustomOriginConfig: {
                HTTPPort: 80,
                HTTPSPort: 443,
                OriginKeepaliveTimeout: 5,
                OriginProtocolPolicy: 'https-only',
                OriginReadTimeout: 30,
                OriginSSLProtocols: [
                  'TLSv1.2',
                ],
              },
              DomainName: 'myorigin.com',
              Id: 'origin1',
              OriginCustomHeaders: [
                {
                  HeaderName: 'X-Custom-Header',
                  HeaderValue: 'somevalue',
                },
              ],
            },
          ],
        },
      }),
    );

    test.done();
  },

  'Distribution with s3 origin failover'(test: Test) {
    const stack = new cdk.Stack();

    new CloudFrontWebDistribution(stack, 'ADistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: s3.Bucket.fromBucketName(stack, 'aBucket', 'myoriginbucket'),
            originPath: '/',
            originHeaders: {
              myHeader: '42',
            },
          },
          failoverS3OriginSource: {
            s3BucketSource: s3.Bucket.fromBucketName(stack, 'aBucketFallback', 'myoriginbucketfallback'),
            originPath: '/somwhere',
            originHeaders: {
              myHeader2: '21',
            },
          },
          failoverCriteriaStatusCodes: [FailoverStatusCode.INTERNAL_SERVER_ERROR],
          behaviors: [
            {
              isDefaultBehavior: true,
            },
          ],
        },
      ],
    });

    expect(stack).to(
      haveResourceLike('AWS::CloudFront::Distribution', {
        DistributionConfig: {
          OriginGroups: {
            Items: [
              {
                FailoverCriteria: {
                  StatusCodes: {
                    Items: [
                      500,
                    ],
                    Quantity: 1,
                  },
                },
                Id: 'OriginGroup1',
                Members: {
                  Items: [
                    {
                      OriginId: 'origin1',
                    },
                    {
                      OriginId: 'originSecondary1',
                    },
                  ],
                  Quantity: 2,
                },
              },
            ],
            Quantity: 1,
          },
          Origins: [
            {
              DomainName: {
                'Fn::Join': [
                  '',
                  [
                    'myoriginbucketfallback.s3.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.',
                    {
                      Ref: 'AWS::URLSuffix',
                    },
                  ],
                ],
              },
              Id: 'originSecondary1',
              OriginCustomHeaders: [
                {
                  HeaderName: 'myHeader2',
                  HeaderValue: '21',
                },
              ],
              OriginPath: '/somwhere',
              S3OriginConfig: {},
            },
            {
              DomainName: {
                'Fn::Join': [
                  '',
                  [
                    'myoriginbucket.s3.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.',
                    {
                      Ref: 'AWS::URLSuffix',
                    },
                  ],
                ],
              },
              Id: 'origin1',
              OriginCustomHeaders: [
                {
                  HeaderName: 'myHeader',
                  HeaderValue: '42',
                },
              ],
              OriginPath: '/',
              S3OriginConfig: {},
            },
          ],
        },
      }),
    );

    test.done();
  },
});
