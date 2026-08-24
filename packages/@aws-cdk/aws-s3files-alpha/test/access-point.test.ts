import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { AccessPoint, FileSystem } from '../lib';

describe('AccessPoint', () => {
  test('creates with minimal props via addAccessPoint', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const bucket = new s3.Bucket(stack, 'Bucket', { versioned: true });

    const fs = new FileSystem(stack, 'FileSystem', {
      bucket,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
    });

    fs.addAccessPoint('AP');

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3Files::AccessPoint', {
      RootDirectory: { Path: '/' },
    });
  });

  test('creates with full configuration', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const bucket = new s3.Bucket(stack, 'Bucket', { versioned: true });

    const fs = new FileSystem(stack, 'FileSystem', {
      bucket,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
    });

    fs.addAccessPoint('AP', {
      path: '/lambda',
      createAcl: {
        ownerUid: '1000',
        ownerGid: '1000',
        permissions: '755',
      },
      posixUser: {
        uid: '1000',
        gid: '1000',
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3Files::AccessPoint', {
      PosixUser: {
        Uid: '1000',
        Gid: '1000',
      },
      RootDirectory: {
        Path: '/lambda',
        CreationPermissions: {
          OwnerUid: '1000',
          OwnerGid: '1000',
          Permissions: '755',
        },
      },
    });
  });

  test('creates standalone access point', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const bucket = new s3.Bucket(stack, 'Bucket', { versioned: true });

    const fs = new FileSystem(stack, 'FileSystem', {
      bucket,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
    });

    new AccessPoint(stack, 'AP', {
      fileSystem: fs,
      path: '/data',
      posixUser: {
        uid: '1001',
        gid: '1001',
        secondaryGids: ['1002', '1003'],
      },
    });

    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::S3Files::AccessPoint', {
      PosixUser: {
        Uid: '1001',
        Gid: '1001',
        SecondaryGids: ['1002', '1003'],
      },
      RootDirectory: {
        Path: '/data',
      },
    });
  });

  test('imports from accessPointArn (nested format) and extracts the id', () => {
    const stack = new Stack();

    const ap = AccessPoint.fromAccessPointAttributes(stack, 'Imported', {
      accessPointArn: 'arn:aws:s3files:us-east-1:123456789012:file-system/fs-12345678/access-point/fsap-12345678',
    });

    expect(ap.accessPointId).toBe('fsap-12345678');
    expect(ap.accessPointArn).toBe('arn:aws:s3files:us-east-1:123456789012:file-system/fs-12345678/access-point/fsap-12345678');
  });

  test('imports from accessPointId with fileSystem and builds the nested arn', () => {
    const stack = new Stack();
    const fs = FileSystem.fromFileSystemAttributes(stack, 'Fs', {
      fileSystemArn: 'arn:aws:s3files:us-east-1:123456789012:file-system/fs-12345678',
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-12345'),
    });

    const ap = AccessPoint.fromAccessPointAttributes(stack, 'Imported', {
      accessPointId: 'fsap-12345678',
      fileSystem: fs,
    });

    expect(ap.accessPointId).toBe('fsap-12345678');
    expect(ap.accessPointArn).toBe('arn:aws:s3files:us-east-1:123456789012:file-system/fs-12345678/access-point/fsap-12345678');
  });

  test('throws when neither id nor arn provided for import', () => {
    const stack = new Stack();

    expect(() => {
      AccessPoint.fromAccessPointAttributes(stack, 'Imported', {});
    }).toThrow(/One of accessPointArn or accessPointId must be provided/);
  });

  test('throws when importing by accessPointId without a fileSystem', () => {
    const stack = new Stack();

    expect(() => {
      AccessPoint.fromAccessPointAttributes(stack, 'Imported', {
        accessPointId: 'fsap-12345678',
      });
    }).toThrow(/fileSystem is required when importing an access point by accessPointId/);
  });

  test('works with lambda.FileSystem.fromS3FilesAccessPoint', () => {
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const bucket = new s3.Bucket(stack, 'Bucket', { versioned: true });

    const fs = new FileSystem(stack, 'FileSystem', {
      bucket,
      vpcConfiguration: {
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      },
    });

    const accessPoint = fs.addAccessPoint('AccessPoint', {
      path: '/lambda',
      createAcl: { ownerUid: '1000', ownerGid: '1000', permissions: '755' },
      posixUser: { uid: '1000', gid: '1000' },
    });

    const fn = new lambda.Function(stack, 'Fn', {
      runtime: lambda.Runtime.NODEJS_LATEST,
      handler: 'index.handler',
      code: lambda.Code.fromInline('exports.handler = async () => {};'),
      vpc,
      filesystem: lambda.FileSystem.fromS3FilesAccessPoint(accessPoint, '/mnt/files'),
    });

    expect(fn).toBeDefined();
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::Lambda::Function', {
      FileSystemConfigs: [{
        LocalMountPath: '/mnt/files',
      }],
    });
  });
});
