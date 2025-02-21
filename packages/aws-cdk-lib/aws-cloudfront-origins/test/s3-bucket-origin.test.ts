import { Annotations, Template } from '../../assertions';
import * as cloudfront from '../../aws-cloudfront/index';
import * as origins from '../../aws-cloudfront-origins';
import * as kms from '../../aws-kms';
import * as s3 from '../../aws-s3/index';
import { App, Duration, Fn, Stack } from '../../core';

describe('S3BucketOrigin', () => {
  describe('withOriginAccessControl', () => {
    describe('when passing custom props', () => {
      let stack: Stack;
      let bucket: s3.Bucket;
      let origin: cloudfront.IOrigin;
      let template: Template;

      beforeAll(() => {
        stack = new Stack();
        bucket = new s3.Bucket(stack, 'MyBucket');
        origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
          originAccessControl: new cloudfront.S3OriginAccessControl(stack, 'MyOac'),
          originAccessLevels: [cloudfront.AccessLevel.WRITE, cloudfront.AccessLevel.READ],
          originPath: '/pathA',
          connectionTimeout: Duration.seconds(10),
          connectionAttempts: 2,
          customHeaders: { headerA: 'headerAValue' },
          originShieldRegion: 'ca-central-1',
          originShieldEnabled: true,
          originId: 'originIdA',
        });

        new cloudfront.Distribution(stack, 'MyDistributionA', {
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
                    Action: [
                      's3:PutObject',
                      's3:GetObject',
                    ],
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
                  },
                ],
                Version: '2012-10-17',
              },
            },
          },
          MyOacAA788594: {
            Type: 'AWS::CloudFront::OriginAccessControl',
            Properties: {
              OriginAccessControlConfig: {
                Name: 'MyOac',
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
                  TargetOriginId: 'originIdA',
                  ViewerProtocolPolicy: 'allow-all',
                },
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [
                  {
                    ConnectionAttempts: 2,
                    ConnectionTimeout: 10,
                    DomainName: {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'RegionalDomainName',
                      ],
                    },
                    Id: 'originIdA',
                    OriginAccessControlId: {
                      'Fn::GetAtt': [
                        'MyOacAA788594',
                        'Id',
                      ],
                    },
                    OriginCustomHeaders: [
                      {
                        HeaderName: 'headerA',
                        HeaderValue: 'headerAValue',
                      },
                    ],
                    OriginPath: '/pathA',
                    OriginShield: {
                      Enabled: true,
                      OriginShieldRegion: 'ca-central-1',
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

    describe('when using bucket with KMS Customer Managed key', () => {
      it('should match expected template resource and warn user about wildcard key policy', () => {
        const stack = new Stack();
        const kmsKey = new kms.Key(stack, 'myKey');
        const bucket = new s3.Bucket(stack, 'myEncryptedBucket', {
          encryption: s3.BucketEncryption.KMS,
          encryptionKey: kmsKey,
          objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        });
        new cloudfront.Distribution(stack, 'MyDistributionA', {
          defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(bucket) },
        });
        const template = Template.fromStack(stack);

        expect(template.toJSON().Resources).toEqual({
          myKey441A1E73: {
            Type: 'AWS::KMS::Key',
            Properties: {
              KeyPolicy: {
                Statement: [
                  {
                    Action: 'kms:*',
                    Effect: 'Allow',
                    Principal: {
                      AWS: {
                        'Fn::Join': [
                          '',
                          [
                            'arn:',
                            {
                              Ref: 'AWS::Partition',
                            },
                            ':iam::',
                            {
                              Ref: 'AWS::AccountId',
                            },
                            ':root',
                          ],
                        ],
                      },
                    },
                    Resource: '*',
                  },
                  {
                    Action: 'kms:Decrypt',
                    Condition: {
                      ArnLike: {
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
                              ':distribution/*',
                            ],
                          ],
                        },
                      },
                    },
                    Effect: 'Allow',
                    Principal: {
                      Service: 'cloudfront.amazonaws.com',
                    },
                    Resource: '*',
                  },
                ],
                Version: '2012-10-17',
              },
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain',
          },
          myEncryptedBucket939A51C0: {
            Type: 'AWS::S3::Bucket',
            Properties: {
              BucketEncryption: {
                ServerSideEncryptionConfiguration: [
                  {
                    ServerSideEncryptionByDefault: {
                      KMSMasterKeyID: {
                        'Fn::GetAtt': [
                          'myKey441A1E73',
                          'Arn',
                        ],
                      },
                      SSEAlgorithm: 'aws:kms',
                    },
                  },
                ],
              },
              OwnershipControls: {
                Rules: [
                  {
                    ObjectOwnership: 'BucketOwnerEnforced',
                  },
                ],
              },
            },
            UpdateReplacePolicy: 'Retain',
            DeletionPolicy: 'Retain',
          },
          myEncryptedBucketPolicyF516140B: {
            Type: 'AWS::S3::BucketPolicy',
            Properties: {
              Bucket: {
                Ref: 'myEncryptedBucket939A51C0',
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
                              'myEncryptedBucket939A51C0',
                              'Arn',
                            ],
                          },
                          '/*',
                        ],
                      ],
                    },
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
                        'myEncryptedBucket939A51C0',
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
        });
        Annotations.fromStack(stack).hasWarning('/Default',
          'To avoid a circular dependency between the KMS key, Bucket, and Distribution during the initial deployment, ' +
          'a wildcard is used in the Key policy condition to match all Distribution IDs.\n' +
          'After deploying once, it is strongly recommended to further scope down the policy for best security practices by ' +
          'following the guidance in the "Using OAC for a SSE-KMS encrypted S3 origin" section in the module README. [ack: @aws-cdk/aws-cloudfront-origins:wildcardKeyPolicyForOac]');
      });

      it('should allow users to use escape hatch to scope down KMS key policy to specific distribution id', () => {
        const stack = new Stack();
        const kmsKey = new kms.Key(stack, 'myKey');
        const bucket = new s3.Bucket(stack, 'myEncryptedBucket', {
          encryption: s3.BucketEncryption.KMS,
          encryptionKey: kmsKey,
          objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        });
        new cloudfront.Distribution(stack, 'MyDistributionA', {
          defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(bucket) },
        });

        // assuming user now know the Distribution ID and want to use escape hatch to scope down the key policy
        const distributionId = 'SomeDistributionId';
        const finalKeyPolicy = {
          Statement: [
            {
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      {
                        Ref: 'AWS::Partition',
                      },
                      ':iam::',
                      {
                        Ref: 'AWS::AccountId',
                      },
                      ':root',
                    ],
                  ],
                },
              },
              Resource: '*',
            },
            {
              Action: 'kms:Decrypt',
              Condition: {
                StringLike: {
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
                        `:distribution/${distributionId}`,
                      ],
                    ],
                  },
                },
              },
              Effect: 'Allow',
              Principal: {
                Service: 'cloudfront.amazonaws.com',
              },
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        };
        (kmsKey.node.defaultChild as kms.CfnKey).keyPolicy = finalKeyPolicy;

        Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
          KeyPolicy: finalKeyPolicy,
        });
      });
      it('should warn users to update key policy manually for imported keys', () => {
        const stack = new Stack();
        const keyArn = 'arn:aws:kms:us-west-2:111122223333:key/test-key';
        const kmsKey = kms.Key.fromKeyArn(stack, 'myImportedKey', keyArn);
        const bucket = new s3.Bucket(stack, 'myEncryptedBucket', {
          encryption: s3.BucketEncryption.KMS,
          encryptionKey: kmsKey,
          objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
        });
        new cloudfront.Distribution(stack, 'MyDistributionA', {
          defaultBehavior: { origin: origins.S3BucketOrigin.withOriginAccessControl(bucket) },
        });
        Annotations.fromStack(stack).hasWarning('/Default/MyDistributionA/Origin1',
          'Cannot update key policy of an imported key. You will need to update the policy manually instead.\n' +
          'See the "Updating imported key policies" section of the module\'s README for more info. [ack: @aws-cdk/aws-cloudfront-origins:updateImportedKeyPolicyOac]');
      });
    });

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
          'Cannot update bucket policy of an imported bucket. You will need to update the policy manually instead.\n' +
          'See the "Setting up OAC with imported S3 buckets" section of module\'s README for more info. [ack: @aws-cdk/aws-cloudfront-origins:updateImportedBucketPolicyOac]');
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

    describe('when specifying READ, WRITE, and DELETE origin access levels', () => {
      it('should add the correct permissions to bucket policy', () => {
        const stack = new Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.WRITE, cloudfront.AccessLevel.DELETE],
        });
        new cloudfront.Distribution(stack, 'MyDistribution', {
          defaultBehavior: { origin },
        });
        Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  's3:GetObject',
                  's3:PutObject',
                  's3:DeleteObject',
                ],
                Effect: 'Allow',
                Principal: {
                  Service: 'cloudfront.amazonaws.com',
                },
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
                            Ref: 'MyDistribution6271DFB5',
                          },
                        ],
                      ],
                    },
                  },
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
              },
            ],
          },
        });
      });
    });
  });

  describe('when specifying READ and LIST origin access levels', () => {
    it('should add the correct permissions to bucket policy', () => {
      const stack = new Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
        originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.LIST],
      });
      new cloudfront.Distribution(stack, 'MyDistribution', {
        defaultBehavior: { origin },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Statement: [
            {
              Action: ['s3:GetObject', 's3:ListBucket'],
              Effect: 'Allow',
              Principal: { Service: 'cloudfront.amazonaws.com' },
              Condition: {
                StringEquals: {
                  'AWS:SourceArn': {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':cloudfront::',
                        { Ref: 'AWS::AccountId' },
                        ':distribution/',
                        { Ref: 'MyDistribution6271DFB5' },
                      ],
                    ],
                  },
                },
              },
              Resource: [
                { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] }, '/*']] },
                { 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] },
              ],
            },
          ],
        },
      });
    });

    describe('when specifying READ and READ_VERSIONED origin access levels', () => {
      it('should add the correct permissions to bucket policy', () => {
        const stack = new Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.READ_VERSIONED],
        });
        new cloudfront.Distribution(stack, 'MyDistribution', {
          defaultBehavior: { origin },
        });

        Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
          PolicyDocument: {
            Statement: [
              {
                Action: ['s3:GetObject', 's3:GetObjectVersion'],
                Effect: 'Allow',
                Principal: { Service: 'cloudfront.amazonaws.com' },
                Condition: {
                  StringEquals: {
                    'AWS:SourceArn': {
                      'Fn::Join': [
                        '',
                        [
                          'arn:',
                          { Ref: 'AWS::Partition' },
                          ':cloudfront::',
                          { Ref: 'AWS::AccountId' },
                          ':distribution/',
                          { Ref: 'MyDistribution6271DFB5' },
                        ],
                      ],
                    },
                  },
                },
                Resource: { 'Fn::Join': ['', [{ 'Fn::GetAtt': ['MyBucketF68F3FF0', 'Arn'] }, '/*']] },
              },
            ],
          },
        });
      });
    });
    it('should add the warning annotation', () => {
      const stack = new Stack();
      const bucket = new s3.Bucket(stack, 'MyBucket');
      const origin = origins.S3BucketOrigin.withOriginAccessControl(bucket, {
        originAccessLevels: [cloudfront.AccessLevel.READ, cloudfront.AccessLevel.LIST],
      });
      new cloudfront.Distribution(stack, 'MyDistribution', {
        defaultBehavior: { origin },
      });
      Annotations.fromStack(stack).hasWarning('/Default/MyDistribution/Origin1',
        'When the origin with AccessLevel.LIST is associated to the default behavior, '+
        'it is strongly recommended to ensure the distribution\'s defaultRootObject is specified,\n'+
        'See the "Setting up OAC with LIST permission" section of module\'s README for more info.'+
        ' [ack: @aws-cdk/aws-cloudfront-origins:listBucketSecurityRisk]');
    });
  });

  describe('withOriginAccessIdentity', () => {
    describe('when passing custom props', () => {
      let stack: Stack;
      let bucket: s3.Bucket;
      let origin: cloudfront.IOrigin;
      let template: Template;

      beforeAll(() => {
        stack = new Stack();
        bucket = new s3.Bucket(stack, 'MyBucket');
        origin = origins.S3BucketOrigin.withOriginAccessIdentity(bucket, {
          originAccessIdentity: new cloudfront.OriginAccessIdentity(stack, 'MyOAI'),
          originPath: '/pathA',
          connectionTimeout: Duration.seconds(10),
          connectionAttempts: 2,
          customHeaders: { headerA: 'headerAValue' },
          originShieldRegion: 'ca-central-1',
          originShieldEnabled: true,
          originId: 'originIdA',
        });

        new cloudfront.Distribution(stack, 'MyDistributionA', {
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
                    Effect: 'Allow',
                    Principal: {
                      CanonicalUser: {
                        'Fn::GetAtt': [
                          'MyOAID7163411',
                          'S3CanonicalUserId',
                        ],
                      },
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
                  },
                ],
                Version: '2012-10-17',
              },
            },
          },
          MyOAID7163411: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
              CloudFrontOriginAccessIdentityConfig: {
                Comment: 'Allows CloudFront to reach the bucket',
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
                  TargetOriginId: 'originIdA',
                  ViewerProtocolPolicy: 'allow-all',
                },
                Enabled: true,
                HttpVersion: 'http2',
                IPV6Enabled: true,
                Origins: [
                  {
                    ConnectionAttempts: 2,
                    ConnectionTimeout: 10,
                    DomainName: {
                      'Fn::GetAtt': [
                        'MyBucketF68F3FF0',
                        'RegionalDomainName',
                      ],
                    },
                    Id: 'originIdA',
                    OriginCustomHeaders: [
                      {
                        HeaderName: 'headerA',
                        HeaderValue: 'headerAValue',
                      },
                    ],
                    OriginPath: '/pathA',
                    OriginShield: {
                      Enabled: true,
                      OriginShieldRegion: 'ca-central-1',
                    },
                    S3OriginConfig: {
                      OriginAccessIdentity: {
                        'Fn::Join': [
                          '',
                          [
                            'origin-access-identity/cloudfront/',
                            {
                              Ref: 'MyOAID7163411',
                            },
                          ],
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        });
      });
    });

    describe('when attaching to a multiple distribution', () => {
      let stack: Stack;
      let bucket: s3.Bucket;
      let origin: cloudfront.IOrigin;
      let template: Template;

      beforeAll(() => {
        stack = new Stack();
        bucket = new s3.Bucket(stack, 'MyBucket');
        origin = origins.S3BucketOrigin.withOriginAccessIdentity(bucket);

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
                    Effect: 'Allow',
                    Principal: {
                      CanonicalUser: {
                        'Fn::GetAtt': [
                          'MyDistributionAOrigin1S3Origin8C75F420',
                          'S3CanonicalUserId',
                        ],
                      },
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
                  },
                ],
                Version: '2012-10-17',
              },
            },
          },
          MyDistributionAOrigin1S3Origin8C75F420: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
              CloudFrontOriginAccessIdentityConfig: {
                Comment: 'Identity for MyDistributionAOrigin11BE8FF8C',
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
                    S3OriginConfig: {
                      OriginAccessIdentity: {
                        'Fn::Join': [
                          '',
                          [
                            'origin-access-identity/cloudfront/',
                            {
                              Ref: 'MyDistributionAOrigin1S3Origin8C75F420',
                            },
                          ],
                        ],
                      },
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
                    S3OriginConfig: {
                      OriginAccessIdentity: {
                        'Fn::Join': [
                          '',
                          [
                            'origin-access-identity/cloudfront/',
                            {
                              Ref: 'MyDistributionAOrigin1S3Origin8C75F420',
                            },
                          ],
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        });
      });
    });

    describe('when using an imported bucket from another stack', () => {
      let distributionStack: Stack;
      let bucketStack: Stack;
      let bucket: s3.IBucket;
      let origin: cloudfront.IOrigin;

      beforeAll(() => {
        const app = new App();
        distributionStack = new Stack(app, 'distributionStack');
        bucketStack = new Stack(app, 'bucketStack');
        bucket = s3.Bucket.fromBucketName(bucketStack, 'BucketId', 'my-bucket');
        origin = origins.S3BucketOrigin.withOriginAccessIdentity(bucket);

        new cloudfront.Distribution(distributionStack, 'MyDistributionA', {
          defaultBehavior: { origin: origin },
        });
      });

      it('should warn user bucket policy is not updated', () => {
        Annotations.fromStack(distributionStack).hasWarning('/distributionStack/MyDistributionA/Origin1',
          'Cannot update bucket policy of an imported bucket. You will need to update the policy manually instead.\n' +
          'See the "Setting up OAI with imported S3 buckets (legacy)" section of module\'s README for more info. [ack: @aws-cdk/aws-cloudfront-origins:updateImportedBucketPolicyOai]');
      });

      it('should create OAI in bucket stack and output it, then reference the output in the distribution stack', () => {
        const distributionStackTemplate = Template.fromStack(distributionStack).toJSON();
        const bucketStackTemplate = Template.fromStack(bucketStack).toJSON();
        expect(bucketStackTemplate.Resources).toEqual({
          distributionStackMyDistributionAOrigin15F199CD4S3OriginD88C4A64: {
            Type: 'AWS::CloudFront::CloudFrontOriginAccessIdentity',
            Properties: {
              CloudFrontOriginAccessIdentityConfig: {
                Comment: 'Identity for distributionStackMyDistributionAOrigin15F199CD4',
              },
            },
          },
        });
        expect(bucketStackTemplate.Outputs).toEqual({
          ExportsOutputRefdistributionStackMyDistributionAOrigin15F199CD4S3OriginD88C4A64BA6320AC: {
            Value: {
              Ref: 'distributionStackMyDistributionAOrigin15F199CD4S3OriginD88C4A64',
            },
            Export: {
              Name: 'bucketStack:ExportsOutputRefdistributionStackMyDistributionAOrigin15F199CD4S3OriginD88C4A64BA6320AC',
            },
          },
        });
        expect(distributionStackTemplate.Resources).toEqual({
          MyDistributionA2150CE0F: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
              DistributionConfig: {
                DefaultCacheBehavior: {
                  CachePolicyId: '658327ea-f89d-4fab-a63d-7e88639e58f6',
                  Compress: true,
                  TargetOriginId: 'distributionStackMyDistributionAOrigin15F199CD4',
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
                    Id: 'distributionStackMyDistributionAOrigin15F199CD4',
                    S3OriginConfig: {
                      OriginAccessIdentity: {
                        'Fn::Join': [
                          '',
                          [
                            'origin-access-identity/cloudfront/',
                            {
                              'Fn::ImportValue': 'bucketStack:ExportsOutputRefdistributionStackMyDistributionAOrigin15F199CD4S3OriginD88C4A64BA6320AC',
                            },
                          ],
                        ],
                      },
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
