import * as path from 'path';
import { MatchStyle, objectLike } from '@aws-cdk/assert-internal';
import '@aws-cdk/assert-internal/jest';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { testDeprecated, testFutureBehavior } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import * as s3deploy from '../lib';

/* eslint-disable max-len */

const s3GrantWriteCtx = { [cxapi.S3_GRANT_WRITE_WITHOUT_ACL]: true };

test('deploy from local directory asset', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
  });

  // THEN
  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
        'Arn',
      ],
    },
    SourceBucketNames: [{
      Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3Bucket9CD8B20A',
    }],
    SourceObjectKeys: [{
      'Fn::Join': [
        '',
        [
          {
            'Fn::Select': [
              0,
              {
                'Fn::Split': [
                  '||',
                  {
                    Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                  },
                ],
              },
            ],
          },
          {
            'Fn::Select': [
              1,
              {
                'Fn::Split': [
                  '||',
                  {
                    Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                  },
                ],
              },
            ],
          },
        ],
      ],
    }],
    DestinationBucketName: {
      Ref: 'DestC383B82A',
    },
  });
});

test('deploy with configured log retention', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    logRetention: logs.RetentionDays.ONE_WEEK,
  });

  // THEN
  expect(stack).toHaveResourceLike('Custom::LogRetention', { RetentionInDays: 7 });
});

test('deploy from local directory assets', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [
      s3deploy.Source.asset(path.join(__dirname, 'my-website')),
      s3deploy.Source.asset(path.join(__dirname, 'my-website-second')),
    ],
    destinationBucket: bucket,
  });

  // THEN
  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
        'Arn',
      ],
    },
    SourceBucketNames: [
      {
        Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3Bucket9CD8B20A',
      },
      {
        Ref: 'AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3Bucket99793559',
      },
    ],
    SourceObjectKeys: [
      {
        'Fn::Join': [
          '',
          [
            {
              'Fn::Select': [
                0,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                    },
                  ],
                },
              ],
            },
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParametersfc4481abf279255619ff7418faa5d24456fef3432ea0da59c95542578ff0222eS3VersionKeyA58D380C',
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
      {
        'Fn::Join': [
          '',
          [
            {
              'Fn::Select': [
                0,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3VersionKeyD9ACE665',
                    },
                  ],
                },
              ],
            },
            {
              'Fn::Select': [
                1,
                {
                  'Fn::Split': [
                    '||',
                    {
                      Ref: 'AssetParametersa94977ede0211fd3b45efa33d6d8d1d7bbe0c5a96d977139d8b16abfa96fe9cbS3VersionKeyD9ACE665',
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
    ],
    DestinationBucketName: {
      Ref: 'DestC383B82A',
    },
  });
});

test('fails if local asset is a non-zip file', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // THEN
  expect(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html'))],
    destinationBucket: bucket,
  })).toThrow(/Asset path must be either a \.zip file or a directory/);
});

test('deploy from a local .zip file', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
  });

});

test('deploy from a local .zip file when efs is enabled', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    useEfs: true,
    vpc: new ec2.Vpc(stack, 'Vpc'),
  });

  //THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        MOUNT_PATH: '/mnt/lambda',
      },
    },
    FileSystemConfigs: [
      {
        Arn: {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':elasticfilesystem:',
              {
                Ref: 'AWS::Region',
              },
              ':',
              {
                Ref: 'AWS::AccountId',
              },
              ':access-point/',
              {
                Ref: 'BucketDeploymentEFSVPCc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba175AccessPoint557A73A5',
              },
            ],
          ],
        },
        LocalMountPath: '/mnt/lambda',
      },
    ],
    Layers: [
      {
        Ref: 'DeployAwsCliLayer8445CB38',
      },
    ],
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756Cc8fd940acb9a3f95ad0e87fb4c3a2482b1900ba175SecurityGroup3E7AAF58',
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: 'VpcPrivateSubnet1Subnet536B997A',
        },
        {
          Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
        },
      ],
    },
  });
});

testDeprecated('honors passed asset options', () => {
  // The 'exclude' property is deprecated and not deprecated in AssetOptions interface.
  // The interface through a complex set of inheritance chain has a 'exclude' prop that is deprecated
  // and another 'exclude' prop that is not deprecated.
  // Using 'testDeprecated' block here since there's no way to work around this craziness.
  // When the deprecated property is removed from source, this block can be dropped.

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'), {
      exclude: ['*', '!index.html'],
    })],
    destinationBucket: bucket,
  });

  // THEN
  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    ServiceToken: {
      'Fn::GetAtt': [
        'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756C81C01536',
        'Arn',
      ],
    },
    SourceBucketNames: [{
      Ref: 'AssetParametersa4d0f1d9c73aa029fd432ca3e640d46745f490023a241d0127f3351773a8938eS3Bucket02009982',
    }],
    SourceObjectKeys: [{
      'Fn::Join': [
        '',
        [
          {
            'Fn::Select': [
              0,
              {
                'Fn::Split': [
                  '||',
                  {
                    Ref: 'AssetParametersa4d0f1d9c73aa029fd432ca3e640d46745f490023a241d0127f3351773a8938eS3VersionKey07726F25',
                  },
                ],
              },
            ],
          },
          {
            'Fn::Select': [
              1,
              {
                'Fn::Split': [
                  '||',
                  {
                    Ref: 'AssetParametersa4d0f1d9c73aa029fd432ca3e640d46745f490023a241d0127f3351773a8938eS3VersionKey07726F25',
                  },
                ],
              },
            ],
          },
        ],
      ],
    }],
    DestinationBucketName: {
      Ref: 'DestC383B82A',
    },
  });
});

test('retainOnDelete can be used to retain files when resource is deleted', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    retainOnDelete: true,
  });

  // THEN
  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    RetainOnDelete: true,
  });
});

test('user metadata is correctly transformed', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    metadata: {
      A: '1',
      B: '2',
    },
  });

  // THEN
  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    UserMetadata: { a: '1', b: '2' },
  });
});

test('system metadata is correctly transformed', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const expiration = cdk.Expiration.after(cdk.Duration.hours(12));

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    contentType: 'text/html',
    contentLanguage: 'en',
    storageClass: s3deploy.StorageClass.INTELLIGENT_TIERING,
    contentDisposition: 'inline',
    serverSideEncryption: s3deploy.ServerSideEncryption.AWS_KMS,
    serverSideEncryptionAwsKmsKeyId: 'mykey',
    serverSideEncryptionCustomerAlgorithm: 'rot13',
    websiteRedirectLocation: 'example',
    cacheControl: [s3deploy.CacheControl.setPublic(), s3deploy.CacheControl.maxAge(cdk.Duration.hours(1))],
    expires: expiration,
    accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
  });

  // THEN
  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    SystemMetadata: {
      'content-type': 'text/html',
      'content-language': 'en',
      'content-disposition': 'inline',
      'storage-class': 'INTELLIGENT_TIERING',
      'sse': 'aws:kms',
      'sse-kms-key-id': 'mykey',
      'cache-control': 'public, max-age=3600',
      'expires': expiration.date.toUTCString(),
      'sse-c-copy-source': 'rot13',
      'website-redirect': 'example',
      'acl': 'bucket-owner-full-control',
    },
  });
});

// type checking structure that forces to update it if BucketAccessControl changes
// see `--acl` here: https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html
const accessControlMap: Record<s3.BucketAccessControl, string> = {
  [s3.BucketAccessControl.PRIVATE]: 'private',
  [s3.BucketAccessControl.PUBLIC_READ]: 'public-read',
  [s3.BucketAccessControl.PUBLIC_READ_WRITE]: 'public-read-write',
  [s3.BucketAccessControl.AUTHENTICATED_READ]: 'authenticated-read',
  [s3.BucketAccessControl.AWS_EXEC_READ]: 'aws-exec-read',
  [s3.BucketAccessControl.BUCKET_OWNER_READ]: 'bucket-owner-read',
  [s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL]: 'bucket-owner-full-control',
  [s3.BucketAccessControl.LOG_DELIVERY_WRITE]: 'log-delivery-write',
};

test.each(Object.entries(accessControlMap) as [s3.BucketAccessControl, string][])(
  'system metadata acl %s is correctly transformed',
  (accessControl, systemMetadataKeyword) => {
    // GIVEN
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Dest');

    // WHEN
    new s3deploy.BucketDeployment(stack, 'Deploy', {
      sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
      destinationBucket: bucket,
      accessControl: accessControl,
    });

    // THEN
    expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
      SystemMetadata: {
        acl: systemMetadataKeyword,
      },
    });
  },
);

test('expires type has correct values', () => {
  expect(cdk.Expiration.atDate(new Date('Sun, 26 Jan 2020 00:53:20 GMT')).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
  expect(cdk.Expiration.atTimestamp(1580000000000).date.toUTCString()).toEqual('Sun, 26 Jan 2020 00:53:20 GMT');
  expect(Math.abs(new Date(cdk.Expiration.after(cdk.Duration.minutes(10)).date.toUTCString()).getTime() - (Date.now() + 600000)) < 15000).toBeTruthy();
  expect(cdk.Expiration.fromString('Tue, 04 Feb 2020 08:45:33 GMT').date.toUTCString()).toEqual('Tue, 04 Feb 2020 08:45:33 GMT');
});

test('cache control type has correct values', () => {
  expect(s3deploy.CacheControl.mustRevalidate().value).toEqual('must-revalidate');
  expect(s3deploy.CacheControl.noCache().value).toEqual('no-cache');
  expect(s3deploy.CacheControl.noTransform().value).toEqual('no-transform');
  expect(s3deploy.CacheControl.setPublic().value).toEqual('public');
  expect(s3deploy.CacheControl.setPrivate().value).toEqual('private');
  expect(s3deploy.CacheControl.proxyRevalidate().value).toEqual('proxy-revalidate');
  expect(s3deploy.CacheControl.maxAge(cdk.Duration.minutes(1)).value).toEqual('max-age=60');
  expect(s3deploy.CacheControl.sMaxAge(cdk.Duration.minutes(1)).value).toEqual('s-maxage=60');
  expect(s3deploy.CacheControl.fromString('only-if-cached').value).toEqual('only-if-cached');
});

test('storage class type has correct values', () => {
  expect(s3deploy.StorageClass.STANDARD).toEqual('STANDARD');
  expect(s3deploy.StorageClass.REDUCED_REDUNDANCY).toEqual('REDUCED_REDUNDANCY');
  expect(s3deploy.StorageClass.STANDARD_IA).toEqual('STANDARD_IA');
  expect(s3deploy.StorageClass.ONEZONE_IA).toEqual('ONEZONE_IA');
  expect(s3deploy.StorageClass.INTELLIGENT_TIERING).toEqual('INTELLIGENT_TIERING');
  expect(s3deploy.StorageClass.GLACIER).toEqual('GLACIER');
  expect(s3deploy.StorageClass.DEEP_ARCHIVE).toEqual('DEEP_ARCHIVE');
});

test('server side encryption type has correct values', () => {
  expect(s3deploy.ServerSideEncryption.AES_256).toEqual('AES256');
  expect(s3deploy.ServerSideEncryption.AWS_KMS).toEqual('aws:kms');
});

test('distribution can be used to provide a CloudFront distribution for invalidation', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
        },
        behaviors: [{ isDefaultBehavior: true }],
      },
    ],
  });

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    distribution,
    distributionPaths: ['/images/*'],
  });

  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    DistributionId: {
      Ref: 'DistributionCFDistribution882A7313',
    },
    DistributionPaths: ['/images/*'],
  });
});

test('invalidation can happen without distributionPaths provided', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
        },
        behaviors: [{ isDefaultBehavior: true }],
      },
    ],
  });

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    distribution,
  });

  expect(stack).toHaveResource('Custom::CDKBucketDeployment', {
    DistributionId: {
      Ref: 'DistributionCFDistribution882A7313',
    },
  });

});

test('fails if distribution paths provided but not distribution ID', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // THEN
  expect(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website', 'index.html'))],
    destinationBucket: bucket,
    distributionPaths: ['/images/*'],
  })).toThrow(/Distribution must be specified if distribution paths are specified/);

});

test('fails if distribution paths don\'t start with "/"', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const distribution = new cloudfront.CloudFrontWebDistribution(stack, 'Distribution', {
    originConfigs: [
      {
        s3OriginSource: {
          s3BucketSource: bucket,
        },
        behaviors: [{ isDefaultBehavior: true }],
      },
    ],
  });

  // THEN
  expect(() => new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website.zip'))],
    destinationBucket: bucket,
    distribution,
    distributionPaths: ['images/*'],
  })).toThrow(/Distribution paths must start with "\/"/);
});

testFutureBehavior('lambda execution role gets permissions to read from the source bucket and read/write in destination', s3GrantWriteCtx, cdk.App, (app) => {
  // GIVEN
  const stack = new cdk.Stack(app);
  const source = new s3.Bucket(stack, 'Source');
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.bucket(source, 'file.zip')],
    destinationBucket: bucket,
  });

  // THEN
  expect(stack).toHaveResource('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: [
            's3:GetObject*',
            's3:GetBucket*',
            's3:List*',
          ],
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'Source71E471F1',
                'Arn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'Source71E471F1',
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          ],
        },
        {
          Action: [
            's3:GetObject*',
            's3:GetBucket*',
            's3:List*',
            's3:DeleteObject*',
            's3:PutObject',
            's3:Abort*',
          ],
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': [
                'DestC383B82A',
                'Arn',
              ],
            },
            {
              'Fn::Join': [
                '',
                [
                  {
                    'Fn::GetAtt': [
                      'DestC383B82A',
                      'Arn',
                    ],
                  },
                  '/*',
                ],
              ],
            },
          ],
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRoleDefaultPolicy88902FDF',
    Roles: [
      {
        Ref: 'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756CServiceRole89A01265',
      },
    ],
  });
});

test('memoryLimit can be used to specify the memory limit for the deployment resource handler', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN

  // we define 3 deployments with 2 different memory configurations

  new s3deploy.BucketDeployment(stack, 'Deploy256-1', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    memoryLimit: 256,
  });

  new s3deploy.BucketDeployment(stack, 'Deploy256-2', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    memoryLimit: 256,
  });

  new s3deploy.BucketDeployment(stack, 'Deploy1024', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    memoryLimit: 1024,
  });

  // THEN

  // we expect to find only two handlers, one for each configuration

  expect(stack).toCountResources('AWS::Lambda::Function', 2);
  expect(stack).toHaveResource('AWS::Lambda::Function', { MemorySize: 256 });
  expect(stack).toHaveResource('AWS::Lambda::Function', { MemorySize: 1024 });
});

test('deployment allows custom role to be supplied', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const existingRole = new iam.Role(stack, 'Role', {
    assumedBy: new iam.ServicePrincipal('lambda.amazon.com'),
  });

  // WHEN
  new s3deploy.BucketDeployment(stack, 'DeployWithRole', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    role: existingRole,
  });

  // THEN
  expect(stack).toCountResources('AWS::IAM::Role', 1);
  expect(stack).toCountResources('AWS::Lambda::Function', 1);
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    Role: {
      'Fn::GetAtt': [
        'Role1ABCC5F0',
        'Arn',
      ],
    },
  });
});

test('deploy without deleting missing files from destination', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    prune: false,
  });

  expect(stack).toHaveResourceLike('Custom::CDKBucketDeployment', {
    Prune: false,
  });
});

test('deploy with excluded files from destination', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    exclude: ['sample.js'],
  });

  expect(stack).toHaveResourceLike('Custom::CDKBucketDeployment', {
    Exclude: ['sample.js'],
  });
});

test('deploy with included files from destination', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    include: ['sample.js'],
  });

  expect(stack).toHaveResourceLike('Custom::CDKBucketDeployment', {
    Include: ['sample.js'],
  });
});

test('deploy with excluded and included files from destination', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    exclude: ['sample/*'],
    include: ['sample/include.json'],
  });

  expect(stack).toHaveResourceLike('Custom::CDKBucketDeployment', {
    Exclude: ['sample/*'],
    Include: ['sample/include.json'],
  });
});

test('deploy with multiple exclude and include filters', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  new s3deploy.BucketDeployment(stack, 'Deploy', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    exclude: ['sample/*', 'another/*'],
    include: ['sample/include.json', 'another/include.json'],
  });

  expect(stack).toHaveResourceLike('Custom::CDKBucketDeployment', {
    Exclude: ['sample/*', 'another/*'],
    Include: ['sample/include.json', 'another/include.json'],
  });
});

test('deployment allows vpc to be implicitly supplied to lambda', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const vpc: ec2.IVpc = new ec2.Vpc(stack, 'SomeVpc1', {});

  // WHEN
  new s3deploy.BucketDeployment(stack, 'DeployWithVpc1', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    vpc,
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756Cc81cec990a9a5d64a5922e5708ad8067eeb95c53d1SecurityGroup881B9147',
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: 'SomeVpc1PrivateSubnet1SubnetCBA5DD76',
        },
        {
          Ref: 'SomeVpc1PrivateSubnet2SubnetD4B3A566',
        },
      ],
    },
  });
});

test('deployment allows vpc and subnets to be implicitly supplied to lambda', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const vpc: ec2.IVpc = new ec2.Vpc(stack, 'SomeVpc2', {});
  new ec2.PrivateSubnet(stack, 'SomeSubnet', {
    vpcId: vpc.vpcId,
    availabilityZone: vpc.availabilityZones[0],
    cidrBlock: vpc.vpcCidrBlock,
  });

  // WHEN
  new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    vpc,
    vpcSubnets: {
      availabilityZones: [vpc.availabilityZones[0]],
    },
  });

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::Function', {
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            'CustomCDKBucketDeployment8693BB64968944B69AAFB0CC9EB8756Cc8a39596cb8641929fcf6a288bc9db5ab7b0f656adSecurityGroup11274779',
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: 'SomeVpc2PrivateSubnet1SubnetB1DC76FF',
        },
      ],
    },
  });
});

test('resource id includes memory and vpc', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const vpc: ec2.IVpc = new ec2.Vpc(stack, 'SomeVpc2', {});

  // WHEN
  new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    vpc,
    memoryLimit: 256,
  });

  // THEN
  expect(stack).toMatchTemplate({
    Resources: objectLike({
      DeployWithVpc2CustomResource256MiBc8a39596cb8641929fcf6a288bc9db5ab7b0f656ad3C5F6E78: objectLike({
        Type: 'Custom::CDKBucketDeployment',
      }),
    }),
  }, MatchStyle.SUPERSET);
});

test('bucket includes custom resource owner tag', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const vpc: ec2.IVpc = new ec2.Vpc(stack, 'SomeVpc2', {});

  // WHEN
  new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    destinationKeyPrefix: '/a/b/c',
    vpc,
    memoryLimit: 256,
  });

  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket', {
    Tags: [{
      Key: 'aws-cdk:cr-owned:/a/b/c:971e1fa8',
      Value: 'true',
    }],
  });
});

test('throws if destinationKeyPrefix is too long', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');

  // WHEN
  expect(() => new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    destinationKeyPrefix: '/this/is/a/random/key/prefix/that/is/a/lot/of/characters/do/we/think/that/it/will/ever/be/this/long??????',
    memoryLimit: 256,
  })).toThrow(/The BucketDeployment construct requires that/);

});

test('bucket has multiple deployments', () => {

  // GIVEN
  const stack = new cdk.Stack();
  const bucket = new s3.Bucket(stack, 'Dest');
  const vpc: ec2.IVpc = new ec2.Vpc(stack, 'SomeVpc2', {});

  // WHEN
  new s3deploy.BucketDeployment(stack, 'DeployWithVpc2', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    destinationKeyPrefix: '/a/b/c',
    vpc,
    memoryLimit: 256,
  });

  new s3deploy.BucketDeployment(stack, 'DeployWithVpc2Exclude', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'), {
      exclude: ['index.html'],
    })],
    destinationBucket: bucket,
    destinationKeyPrefix: '/a/b/c',
    vpc,
    memoryLimit: 256,
  });

  new s3deploy.BucketDeployment(stack, 'DeployWithVpc3', {
    sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
    destinationBucket: bucket,
    destinationKeyPrefix: '/x/z',
  });

  // THEN
  expect(stack).toHaveResource('AWS::S3::Bucket', {
    Tags: [
      {
        Key: 'aws-cdk:cr-owned:/a/b/c:6da0a4ab',
        Value: 'true',
      },
      {
        Key: 'aws-cdk:cr-owned:/a/b/c:971e1fa8',
        Value: 'true',
      },
      {
        Key: 'aws-cdk:cr-owned:/x/z:2db04622',
        Value: 'true',
      },
    ],
  });
});
