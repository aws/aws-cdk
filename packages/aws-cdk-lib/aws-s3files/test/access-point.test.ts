import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as s3 from '../../aws-s3';
import { Stack } from '../../core';
import { AccessPoint, FileSystem } from '../lib';

let stack: Stack;
let vpc: ec2.Vpc;
let bucket: s3.IBucket;
let fileSystem: FileSystem;

beforeEach(() => {
  stack = new Stack(undefined, 'Stack', { env: { account: '123456789012', region: 'us-east-1' } });
  vpc = new ec2.Vpc(stack, 'Vpc');
  bucket = new s3.Bucket(stack, 'Bucket');
  fileSystem = new FileSystem(stack, 'FileSystem', { bucket, vpc });
});

describe('AccessPoint', () => {
  test('minimal access point references the file system', () => {
    new AccessPoint(stack, 'AP', { fileSystem });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::AccessPoint', {
      FileSystemId: { 'Fn::GetAtt': [Match.stringLikeRegexp('^FileSystem'), 'FileSystemId'] },
    });
  });

  test('createAcl maps to RootDirectory.CreationPermissions', () => {
    new AccessPoint(stack, 'AP', {
      fileSystem,
      path: '/projects/team-a',
      createAcl: { ownerUid: '1000', ownerGid: '1000', permissions: '0755' },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::AccessPoint', {
      RootDirectory: {
        Path: '/projects/team-a',
        CreationPermissions: {
          OwnerUid: '1000',
          OwnerGid: '1000',
          Permissions: '0755',
        },
      },
    });
  });

  test('posixUser is rendered as PosixUser', () => {
    new AccessPoint(stack, 'AP', {
      fileSystem,
      posixUser: { uid: '1000', gid: '1000', secondaryGids: ['2000', '3000'] },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::AccessPoint', {
      PosixUser: { Uid: '1000', Gid: '1000', SecondaryGids: ['2000', '3000'] },
    });
  });

  test('clientToken passes through', () => {
    new AccessPoint(stack, 'AP', { fileSystem, clientToken: 'idempotent' });

    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::AccessPoint', {
      ClientToken: 'idempotent',
    });
  });

  test.each([0, 65])('clientToken length %d fails', (length) => {
    expect(() => new AccessPoint(stack, 'AP', {
      fileSystem,
      clientToken: 'x'.repeat(length),
    })).toThrow(`'clientToken' must be 1-64 characters long, got ${length}`);
  });

  test('posixUser uid above 2^32-1 fails', () => {
    expect(() => new AccessPoint(stack, 'AP', {
      fileSystem,
      posixUser: { uid: '4294967296', gid: '1000' },
    })).toThrow("'posixUser.uid' must be 0..4294967295, got 4294967296");
  });

  test('posixUser non-numeric uid fails', () => {
    expect(() => new AccessPoint(stack, 'AP', {
      fileSystem,
      posixUser: { uid: 'root', gid: '1000' },
    })).toThrow("'posixUser.uid' must be a non-negative integer string, got \"root\"");
  });

  test('posixUser secondaryGids over 16 entries fails', () => {
    expect(() => new AccessPoint(stack, 'AP', {
      fileSystem,
      posixUser: { uid: '1000', gid: '1000', secondaryGids: Array.from({ length: 17 }, (_, i) => `${i}`) },
    })).toThrow("'posixUser.secondaryGids' must contain at most 16 entries, got 17");
  });

  test('createAcl invalid octal permissions fail', () => {
    expect(() => new AccessPoint(stack, 'AP', {
      fileSystem,
      createAcl: { ownerUid: '1000', ownerGid: '1000', permissions: '8888' },
    })).toThrow("'createAcl.permissions' must be a 3- or 4-digit octal string, got \"8888\"");
  });

  test('path without leading / fails', () => {
    expect(() => new AccessPoint(stack, 'AP', { fileSystem, path: 'projects/a' }))
      .toThrow("'path' must start with '/', got \"projects/a\"");
  });

  test('path deeper than four subdirectories fails', () => {
    expect(() => new AccessPoint(stack, 'AP', { fileSystem, path: '/a/b/c/d/e' }))
      .toThrow("'path' may have up to four subdirectories, got 5");
  });

  test('addAccessPoint factory returns an AccessPoint', () => {
    const ap = fileSystem.addAccessPoint('AP', { path: '/data' });

    expect(ap).toBeInstanceOf(AccessPoint);
    Template.fromStack(stack).hasResourceProperties('AWS::S3Files::AccessPoint', {
      RootDirectory: { Path: '/data' },
    });
  });
});

describe('AccessPoint.fromAccessPointId', () => {
  test('imports by id and synthesizes ARN', () => {
    const ap = AccessPoint.fromAccessPointId(stack, 'Imported', 'fsap-12345678');

    expect(stack.resolve(ap.accessPointId)).toBe('fsap-12345678');
    expect(stack.resolve(ap.accessPointArn)).toEqual({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':s3files:us-east-1:123456789012:access-point/fsap-12345678',
      ]],
    });
  });
});

describe('AccessPoint.fromAccessPointAttributes', () => {
  test('imports by ARN and extracts the id', () => {
    const ap = AccessPoint.fromAccessPointAttributes(stack, 'Imported', {
      accessPointArn: 'arn:aws:s3files:us-east-1:123456789012:access-point/fsap-99999999',
    });

    expect(stack.resolve(ap.accessPointId)).toBe('fsap-99999999');
  });

  test('fails when neither id nor arn is provided', () => {
    expect(() => AccessPoint.fromAccessPointAttributes(stack, 'Imported', {}))
      .toThrow("Exactly one of 'accessPointId' or 'accessPointArn' must be provided.");
  });

  test('fails when both id and arn are provided', () => {
    expect(() => AccessPoint.fromAccessPointAttributes(stack, 'Imported', {
      accessPointId: 'fsap-1',
      accessPointArn: 'arn:aws:s3files:us-east-1:123456789012:access-point/fsap-1',
    })).toThrow("Exactly one of 'accessPointId' or 'accessPointArn' must be provided.");
  });

  test('imported access points without fileSystem throw on access', () => {
    const ap = AccessPoint.fromAccessPointId(stack, 'Imported', 'fsap-1');
    expect(() => ap.fileSystem)
      .toThrow("fileSystem is only available when 'fromAccessPointAttributes()' is used and a fileSystem is provided.");
  });
});
