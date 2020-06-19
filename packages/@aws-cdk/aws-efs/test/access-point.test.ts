import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import { Stack } from '@aws-cdk/core';
import { AccessPoint, FileSystem } from '../lib';

let stack: Stack;
let vpc: ec2.Vpc;
let filesystem: FileSystem;

beforeEach(() => {
  stack = new Stack();
  vpc = new ec2.Vpc(stack, 'VPC');
  filesystem = new FileSystem(stack, 'EfsFileSystem', {
    vpc,
  });
});

test('default access point is created correctly', () => {
  // WHEN
  new AccessPoint(stack, 'MyAccessPoint', {
    filesystem,
  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::EFS::AccessPoint'));
});

test('import correctly', () => {
  // WHEN
  const ap = new AccessPoint(stack, 'MyAccessPoint', {
    filesystem,
  });
  const imported = AccessPoint.fromAccessPointId(stack, 'ImportedAccessPoint', ap.accessPointId);
  // THEN
  expect(imported.accessPointId).toEqual(ap.accessPointId);
});

test('custom access point is created correctly', () => {
  // WHEN
  new AccessPoint(stack, 'MyAccessPoint', {
    filesystem,
    ownerGid: '1001',
    ownerUid: '1001',
    path: '/custom',
    permissions: '777',
    posixUserGid: '1001',
    posixUserUid: '1001',
    secondaryGids: [
      '1002',
      '1003',
    ],
  });
  // THEN
  expectCDK(stack).to(haveResource('AWS::EFS::AccessPoint', {
    FileSystemId: {
      Ref: 'EfsFileSystem37910666',
    },
    PosixUser: {
      Gid: '1001',
      SecondaryGids: [
        '1002',
        '1003',
      ],
      Uid: '1001',
    },
    RootDirectory: {
      CreationInfo: {
        OwnerGid: '1001',
        OwnerUid: '1001',
        Permissions: '777',
      },
      Path: '/custom',
    },
  }));
});
