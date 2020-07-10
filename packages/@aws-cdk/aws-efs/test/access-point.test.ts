import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { AccessPoint, FileSystem } from '../lib';

let stack: Stack;
let vpc: ec2.Vpc;
let fileSystem: FileSystem;

beforeEach(() => {
  stack = new Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
  fileSystem = new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });
});

test('addAccessPoint correctly', () => {
  // WHEN
  fileSystem.addAccessPoint('MyAccessPoint');
  // THEN
  expectCDK(stack).to(haveResource('AWS::EFS::AccessPoint'));
});

test('new AccessPoint correctly', () => {
  // WHEN
  new AccessPoint(stack, 'MyAccessPoint', {
    fileSystem,
  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::EFS::AccessPoint'));
});

test('import correctly', () => {
  // WHEN
  const ap = new AccessPoint(stack, 'MyAccessPoint', {
    fileSystem,
  });
  const imported = AccessPoint.fromAccessPointId(stack, 'ImportedAccessPoint', ap.accessPointId);
  // THEN
  expect(imported.accessPointId).toEqual(ap.accessPointId);
});

test('custom access point is created correctly', () => {
  // WHEN
  new AccessPoint(stack, 'MyAccessPoint', {
    fileSystem,
    createAcl: {
      ownerGid: '1000',
      ownerUid: '1000',
      permissions: '755',
    },
    path: '/export/share',
    posixUser: {
      gid: '1000',
      uid: '1000',
      secondaryGids: [
        '1001',
        '1002',
      ],
    },

  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::EFS::AccessPoint', {
    FileSystemId: {
      Ref: 'EfsFileSystem37910666',
    },
    PosixUser: {
      Gid: '1000',
      SecondaryGids: [
        '1001',
        '1002',
      ],
      Uid: '1000',
    },
    RootDirectory: {
      CreationInfo: {
        OwnerGid: '1000',
        OwnerUid: '1000',
        Permissions: '755',
      },
      Path: '/export/share',
    },
  }));
});