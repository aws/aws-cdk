import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
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

  test('imports from accessPointId', () => {
    const stack = new Stack();

    const ap = AccessPoint.fromAccessPointId(stack, 'Imported', 'fsap-12345678');

    expect(ap.accessPointId).toBe('fsap-12345678');
  });

  test('imports from accessPointArn', () => {
    const stack = new Stack();

    const ap = AccessPoint.fromAccessPointAttributes(stack, 'Imported', {
      accessPointArn: 'arn:aws:s3files:us-east-1:123456789012:access-point/fsap-12345678',
    });

    expect(ap.accessPointArn).toBe('arn:aws:s3files:us-east-1:123456789012:access-point/fsap-12345678');
  });

  test('throws when neither id nor arn provided for import', () => {
    const stack = new Stack();

    expect(() => {
      AccessPoint.fromAccessPointAttributes(stack, 'Imported', {});
    }).toThrow(/One of accessPointArn or accessPointId must be provided/);
  });
});
