import { Annotations, Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront/index';
import * as origins from '../../aws-cloudfront-origins';
import * as s3 from '../../aws-s3/index';
import { Stack } from '../../core';

describe('S3BucketOrigin', () => {
  describe('withOriginAccessControl', () => {
    describe('when attaching to a multiple distribution', () => {
      let stack: Stack;
      let bucket: s3.Bucket;
      let origin: cloudfront.IOrigin;
      let template: Template;

      beforeAll(() => {
        stack = new Stack();
        bucket = new s3.Bucket(stack, 'MyBucket');
        origin = origins.S3BucketOrigin.withOriginAccessControl(bucket);

        new cloudfront.Distribution(stack, 'MyDistributionA', {
          defaultBehavior: { origin: origin },
        });
        new cloudfront.Distribution(stack, 'MyDistributionB', {
          defaultBehavior: { origin: origin },
        });

        template = Template.fromStack(stack);
      });

      it('should match expected template resources', () => {
        expect(template.toJSON().Resources).toEqual({
          MyBucketF68F3FF0: {
            Type: 'AWS::S3::Bucket',
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain',
          },
          MyBucketPolicyE7FBAC7B: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
              Bucket: {
                Ref: 'MyBucketF68F3FF0',
              },
              PolicyDocument: {
                Statement: [
                  {
                    Action: 's3:GetObject',
                    Condition: {
                      StringEquals: {
                        'AWS:SourceArn': {
                          'Fn::Join': [
                            '',
                            [
                              'arn:',
                              {
                                Ref: 'AWS::Partition',
                              },
                              ':cloudfront::',
                              {
                                Ref: 'AWS::AccountId',
                              },
                              ':distribution/',
                              {
                                Ref: 'MyDistributionA2150CE0F',
                              },
                            ],
                          ],
                        },
                      },
                    },
                    Effect: 'Allow',
                    Principal: {
                      Service: 'cloudfront.amazonaws.com',
                    },
                    Resource: {
                      'Fn::Join': [
                        '',
                        [
                          {
                            'Fn::GetAtt': [
                              'MyBucketF68F3FF0',
                              'Arn',
                            ],
                          },
                          '/*',
                        ],
                      ],
                    },
                    Sid: 'GrantCloudFrontOACAccessToS3Origin',
                  },
                  {
                    Action: 's3:GetObject',
                    Condition: {
                      StringEquals: {
                        'AWS:SourceArn': {
                          'Fn::Join': [
                            '',
                            [
                              'arn:',
                              {
                                Ref: 'AWS::Partition',
                              },
                              ':cloudfront::',
                              {
                                Ref: 'AWS::AccountId',
                              },
                              ':distribution/',
                              {
                                Ref: 'MyDistributionB4B294FCF',
                              },
                            ],
                          ],
                        },
                      },
                    },
                    Effect: 'Allow',
                    Principal: {
                      Service: 'cloudfront.amazonaws.com',
                    },
                    Resource: {
                      'Fn::Join': [
                        '',
                        [
                          {
                            'Fn::GetAtt': [
                              'MyBucketF68F3FF0',
                              'Arn',
                            ],
                          },
                          '/*',
                        ],
                      ],
                    },
                    Sid: 'GrantCloudFrontOACAccessToS3Origin',
                  },
                ],
                Version: '2012-10-17',
              },
            },
          },
          MyDistributionAOrigin1S3OriginAccessControlE2649D73: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'MyDistributionAOrigin1S3OriginAccessControl2859DD54',
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4',
              },
            },
          },
          MyDistributionA2150CE0F: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
              DistributionConfig: {
                DefaultCacheBehavior: {
                  CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                  Compress: true,
                  TargetOriginId: 'MyDistributionAOrigin11BE8FF8C',
                  ViewerProtocolPolicy: 'allow-all',
                },
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [
                  {
                    DomainName: {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'RegionalDomainName',
                      ],
                    },
                    Id: 'MyDistributionAOrigin11BE8FF8C',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'MyDistributionAOrigin1S3OriginAccessControlE2649D73',
                        'Id',
                      ],
                    },
                    S3OriginConfig: {
                      OriginAccessIdentity: '',
                    },
                  },
                ],
              },
            },
          },
          MyDistributionB4B294FCF: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
              DistributionConfig: {
                DefaultCacheBehavior: {
                  CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                  Compress: true,
                  TargetOriginId: 'MyDistributionBOrigin12F11A471',
                  ViewerProtocolPolicy: 'allow-all',
                },
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [
                  {
                    DomainName: {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'RegionalDomainName',
                      ],
                    },
                    Id: 'MyDistributionBOrigin12F11A471',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'MyDistributionAOrigin1S3OriginAccessControlE2649D73',
                        'Id',
                      ],
                    },
                    S3OriginConfig: {
                      OriginAccessIdentity: '',
                    },
                  },
                ],
              },
            },
          },
        });
      });
    });

    describe('when using an imported bucket obtained from Bucket.fromBucketName', () => {
      let stack: Stack;
      let bucket: s3.IBucket;
      let origin: cloudfront.IOrigin;
      let template: Template;

      beforeAll(() => {
        stack = new Stack();
        bucket = s3.Bucket.fromBucketName(stack, 'BucketId', 'my-bucket');
        origin = origins.S3BucketOrigin.withOriginAccessControl(bucket);

        new cloudfront.Distribution(stack, 'MyDistributionA', {
          defaultBehavior: { origin: origin },
        });

        template = Template.fromStack(stack);
      });

      it('should warn user bucket policy is not updated', () => {
        Annotations.fromStack(stack).hasWarning('/Default/MyDistributionA/Origin1',
          'Cannot update bucket policy of an imported bucket. Set overrideImportedBucketPolicy to true or update the policy manually instead. [ack: @aws-cdk/aws-cloudfront-origins:updateBucketPolicy]');
      });

      it('should match expected template resources', () => {
        expect(template.toJSON().Resources).toEqual({
          MyDistributionAOrigin1S3OriginAccessControlE2649D73: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'MyDistributionAOrigin1S3OriginAccessControl2859DD54',
                OriginAccessControlOriginType: 's3',
                SigningBehavior: 'always',
                SigningProtocol: 'sigv4',
              },
            },
          },
          MyDistributionA2150CE0F: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
              DistributionConfig: {
                DefaultCacheBehavior: {
                  CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                  Compress: true,
                  TargetOriginId: 'MyDistributionAOrigin11BE8FF8C',
                  ViewerProtocolPolicy: 'allow-all',
                },
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [
                  {
                    DomainName: {
                      'Fn::Join': [
                        '',
                        [
                          'my-bucket.s3.',
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
                    Id: 'MyDistributionAOrigin11BE8FF8C',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'MyDistributionAOrigin1S3OriginAccessControlE2649D73',
                        'Id',
                      ],
                    },
                    S3OriginConfig: {
                      OriginAccessIdentity: '',
                    },
                  },
                ],
              },
            },
          },
        });
      });
    });
  });
});