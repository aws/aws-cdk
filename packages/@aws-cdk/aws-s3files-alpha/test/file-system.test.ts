import { Match, Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Duration, RemovalPolicy, Size, Stack } from 'aws-cdk-lib/core';
import {
  FileSystem,
  ImportDataTrigger,
  MountTargetIpAddressType,
} from '../lib';

let stack: Stack;
let vpc: ec2.Vpc;
let bucket: s3.IBucket;

beforeEach(() => {
  stack = new Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  vpc = new ec2.Vpc(stack, 'Vpc');
  bucket = new s3.Bucket(stack, 'Bucket');
});

describe('FileSystem', () => {
  test('default file system creates the L1 with bucket ARN and a service role', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::S3Files::FileSystem', {
      Bucket: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Bucket'), 'Arn'] },
      RoleArn: {
        'Fn::GetAtt': [Match.stringLikeRegexp('^FileSystemServiceRole'), 'Arn'],
      },
    });
    t.hasResource('AWS::S3Files::FileSystem', {
      DeletionPolicy: 'Retain',
      UpdateReplacePolicy: 'Retain',
    });
  });

  test('one mount target is created per AZ by default', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    Template.fromStack(stack).resourceCountIs('AWS::S3Files::MountTarget', vpc.privateSubnets.length);
  });

  test('mount targets receive the file system and security group', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::MountTarget', {
      FileSystemId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^FileSystem'), 'FileSystemId'] },
      SecurityGroups: [{ 'Fn::GetAtt': [Match.stringLikeRegexp('^FileSystemSecurityGroup'), 'GroupId'] }],
    });
  });

  test('default service role trusts elasticfilesystem.amazonaws.com with confused-deputy conditions', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 'sts:AssumeRole',
            Principal: { Service: 'elasticfilesystem.amazonaws.com' },
            Condition: {
              StringEquals: { 'aws:SourceAccount': '123456789012' },
              ArnLike: {
                'aws:SourceArn': {
                  'Fn::Join': ['', Match.arrayWith([':s3files:us-east-1:123456789012:file-system/*'])],
                },
              },
            },
          }),
        ]),
      },
    });
  });

  test('default service role grants S3 bucket-level access scoped to account', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'S3BucketPermissions',
            Action: ['s3:ListBucket', 's3:ListBucketVersions'],
            Condition: { StringEquals: { 'aws:ResourceAccount': '123456789012' } },
          }),
          Match.objectLike({
            Sid: 'S3ObjectPermissions',
            Action: [
              's3:AbortMultipartUpload',
              's3:DeleteObject*',
              's3:GetObject*',
              's3:List*',
              's3:PutObject*',
            ],
            Condition: { StringEquals: { 'aws:ResourceAccount': '123456789012' } },
          }),
        ]),
      },
    });
  });

  test('default service role grants EventBridge management for elasticfilesystem rules', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'EventBridgeManage',
            Action: [
              'events:DeleteRule',
              'events:DisableRule',
              'events:EnableRule',
              'events:PutRule',
              'events:PutTargets',
              'events:RemoveTargets',
            ],
            Condition: { StringEquals: { 'events:ManagedBy': 'elasticfilesystem.amazonaws.com' } },
          }),
          Match.objectLike({
            Sid: 'EventBridgeRead',
            Action: [
              'events:DescribeRule',
              'events:ListRuleNamesByTarget',
              'events:ListRules',
              'events:ListTargetsByRule',
            ],
          }),
        ]),
      },
    });
  });

  test('explicit role is used and no service role is created', () => {
    const role = new iam.Role(stack, 'CustomRole', {
      assumedBy: new iam.ServicePrincipal('elasticfilesystem.amazonaws.com'),
    });

    new FileSystem(stack, 'FileSystem', { bucket, vpc, role });

    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::S3Files::FileSystem', {
      RoleArn: { 'Fn::GetAtt': [Match.stringLikeRegexp('^CustomRole'), 'Arn'] },
    });
    // Only the user-supplied role should exist.
    const roleIds = Object.keys(t.findResources('AWS::IAM::Role'));
    expect(roleIds).toHaveLength(1);
    expect(roleIds[0]).toMatch(/^CustomRole/);
  });

  test('prefix and acceptBucketWarning pass through to the L1', () => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      prefix: 'data/projects/',
      acceptBucketWarning: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::FileSystem', {
      Prefix: 'data/projects/',
      AcceptBucketWarning: true,
    });
  });

  test('clientToken passes through and validates length', () => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      clientToken: 'token-1',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::FileSystem', {
      ClientToken: 'token-1',
    });
  });

  test.each([0, 65])('fails when clientToken length is %d', (length) => {
    expect(() => new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      clientToken: 'x'.repeat(length),
    })).toThrow(`'clientToken' must be 1-64 characters long, got ${length}`);
  });

  test('fails when prefix does not end with /', () => {
    expect(() => new FileSystem(stack, 'FileSystem', { bucket, vpc, prefix: 'no-trailing-slash' }))
      .toThrow("'prefix' must be empty or end with '/', got \"no-trailing-slash\"");
  });

  test('empty prefix is accepted', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc, prefix: '' });
    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::FileSystem', {
      Prefix: '',
    });
  });

  test('fails when prefix exceeds 1024 characters', () => {
    expect(() => new FileSystem(stack, 'FileSystem', { bucket, vpc, prefix: 'a'.repeat(1024) + '/' }))
      .toThrow("'prefix' must be at most 1024 characters long, got 1025");
  });

  test('kmsKey adds key id and grants the full S3 Files KMS action set with conditions', () => {
    const key = new kms.Key(stack, 'Key');

    new FileSystem(stack, 'FileSystem', { bucket, vpc, kmsKey: key });

    const t = Template.fromStack(stack);
    t.hasResourceProperties('AWS::S3Files::FileSystem', {
      KmsKeyId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Key'), 'Arn'] },
    });
    t.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Sid: 'UseKmsKeyWithS3Files',
            Action: [
              'kms:GenerateDataKey',
              'kms:Encrypt',
              'kms:Decrypt',
              'kms:ReEncryptFrom',
              'kms:ReEncryptTo',
            ],
            Resource: { 'Fn::GetAtt': [Match.stringLikeRegexp('^Key'), 'Arn'] },
            Condition: {
              StringLike: Match.objectLike({
                'kms:ViaService': 's3.us-east-1.amazonaws.com',
              }),
            },
          }),
        ]),
      },
    });
  });

  test('synchronizationConfiguration converts Size and Duration', () => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      synchronizationConfiguration: {
        importDataRules: [{
          prefix: 'incoming',
          sizeLessThan: Size.gibibytes(10),
          trigger: ImportDataTrigger.CONTINUOUS,
        }],
        expirationDataRules: [{
          afterLastAccess: Duration.days(30),
        }],
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::FileSystem', {
      SynchronizationConfiguration: {
        ImportDataRules: [{
          Prefix: 'incoming',
          SizeLessThan: 10 * 1024 * 1024 * 1024,
          Trigger: 'CONTINUOUS',
        }],
        ExpirationDataRules: [{
          DaysAfterLastAccess: 30,
        }],
      },
    });
  });

  test('vpcSubnets controls mount target placement', () => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3Files::MountTarget', vpc.publicSubnets.length);
  });

  test.each([
    MountTargetIpAddressType.IPV4_ONLY,
    MountTargetIpAddressType.IPV6_ONLY,
    MountTargetIpAddressType.DUAL_STACK,
  ])('mountTargetIpAddressType %s is passed to mount targets', (ipAddressType) => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      mountTargetIpAddressType: ipAddressType,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::MountTarget', {
      IpAddressType: ipAddressType,
    });
  });

  test('user-supplied securityGroup is reused and no new SG is created', () => {
    const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

    const fs = new FileSystem(stack, 'FileSystem', { bucket, vpc, securityGroup: sg });

    const t = Template.fromStack(stack);
    const sgIds = Object.keys(t.findResources('AWS::EC2::SecurityGroup'));
    expect(sgIds).toHaveLength(1);
    expect(sgIds[0]).toMatch(/^SG/);
    t.hasResourceProperties('AWS::S3Files::MountTarget', {
      SecurityGroups: [{ 'Fn::GetAtt': [Match.stringLikeRegexp('^SG'), 'GroupId'] }],
    });
    expect(fs.connections.securityGroups).toContain(sg);
  });

  test('removalPolicy DESTROY synthesizes Delete deletion policy', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc, removalPolicy: RemovalPolicy.DESTROY });

    Template.fromStack(stack).hasResource('AWS::S3Files::FileSystem', {
      DeletionPolicy: 'Delete',
      UpdateReplacePolicy: 'Delete',
    });
  });

  test('addToResourcePolicy creates exactly one CfnFileSystemPolicy', () => {
    const fs = new FileSystem(stack, 'FileSystem', { bucket, vpc });

    fs.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3files:ClientMount'],
      principals: [new iam.AnyPrincipal()],
      resources: ['*'],
    }));
    fs.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3files:ClientWrite'],
      principals: [new iam.AnyPrincipal()],
      resources: ['*'],
    }));

    Template.fromStack(stack).resourceCountIs('AWS::S3Files::FileSystemPolicy', 1);
  });

  test('no CfnFileSystemPolicy is created when addToResourcePolicy is never called', () => {
    new FileSystem(stack, 'FileSystem', { bucket, vpc });

    Template.fromStack(stack).resourceCountIs('AWS::S3Files::FileSystemPolicy', 0);
  });

  test('initial resourcePolicy creates the CfnFileSystemPolicy', () => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      resourcePolicy: new iam.PolicyDocument({
        statements: [new iam.PolicyStatement({
          actions: ['s3files:ClientMount'],
          principals: [new iam.AnyPrincipal()],
          resources: ['*'],
        })],
      }),
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3Files::FileSystemPolicy', 1);
  });

  test('empty resourcePolicy emits no CfnFileSystemPolicy', () => {
    new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      resourcePolicy: new iam.PolicyDocument(),
    });

    Template.fromStack(stack).resourceCountIs('AWS::S3Files::FileSystemPolicy', 0);
  });

  test('expirationDataRules.afterLastAccess must be whole days', () => {
    expect(() => new FileSystem(stack, 'FileSystem', {
      bucket,
      vpc,
      synchronizationConfiguration: {
        importDataRules: [],
        expirationDataRules: [{ afterLastAccess: Duration.hours(36) }],
      },
    })).toThrow(/'expirationDataRules\[0\]\.afterLastAccess' must be a whole number of days/);
  });

  test('isFileSystem identifies FileSystem instances', () => {
    const fs = new FileSystem(stack, 'FileSystem', { bucket, vpc });
    expect(FileSystem.isFileSystem(fs)).toBe(true);
    expect(FileSystem.isFileSystem({})).toBe(false);
  });
});

describe('FileSystem.fromFileSystemAttributes', () => {
  let sg: ec2.SecurityGroup;
  beforeEach(() => {
    sg = new ec2.SecurityGroup(stack, 'SG', { vpc });
  });

  test('imports by id and synthesizes ARN', () => {
    const fs = FileSystem.fromFileSystemAttributes(stack, 'Imported', {
      fileSystemId: 'fs-12345678',
      securityGroup: sg,
    });

    expect(stack.resolve(fs.fileSystemId)).toBe('fs-12345678');
    expect(stack.resolve(fs.fileSystemArn)).toEqual({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':s3files:us-east-1:123456789012:file-system/fs-12345678',
      ]],
    });
  });

  test('imports by ARN and parses out the id', () => {
    const fs = FileSystem.fromFileSystemAttributes(stack, 'Imported', {
      fileSystemArn: 'arn:aws:s3files:us-east-1:123456789012:file-system/fs-99999999',
      securityGroup: sg,
    });

    expect(stack.resolve(fs.fileSystemId)).toBe('fs-99999999');
    expect(stack.resolve(fs.fileSystemArn)).toBe('arn:aws:s3files:us-east-1:123456789012:file-system/fs-99999999');
  });

  test('imports use the supplied security group', () => {
    const fs = FileSystem.fromFileSystemAttributes(stack, 'Imported', {
      fileSystemId: 'fs-1',
      securityGroup: sg,
    });

    expect(fs.connections.securityGroups).toContain(sg);
  });

  test('fails when neither id nor arn is provided', () => {
    expect(() => FileSystem.fromFileSystemAttributes(stack, 'Imported', { securityGroup: sg }))
      .toThrow("Exactly one of 'fileSystemId' or 'fileSystemArn' must be provided.");
  });

  test('fails when both id and arn are provided', () => {
    expect(() => FileSystem.fromFileSystemAttributes(stack, 'Imported', {
      fileSystemId: 'fs-1',
      fileSystemArn: 'arn:aws:s3files:us-east-1:123456789012:file-system/fs-1',
      securityGroup: sg,
    })).toThrow("Exactly one of 'fileSystemId' or 'fileSystemArn' must be provided.");
  });
});
