import * as ec2 from '../../aws-ec2';
import { App, Stack } from '../../core';
import { AccessPointReflection } from '../lib/private/access-point-reflection';
import { CfnAccessPoint, CfnFileSystem, CfnMountTarget } from '../lib/s3files.generated';

let stack: Stack;
let cfnFileSystem: CfnFileSystem;
let cfnAccessPoint: CfnAccessPoint;

beforeEach(() => {
  stack = new Stack();
  cfnFileSystem = new CfnFileSystem(stack, 'FileSystem', {
    bucket: 'my-bucket',
    roleArn: 'arn:aws:iam::123456789012:role/S3FilesRole',
  });
  cfnAccessPoint = new CfnAccessPoint(stack, 'AccessPoint', {
    fileSystemId: cfnFileSystem.attrFileSystemId,
  });
});

describe('AccessPointReflection', () => {
  test('resolves the CfnAccessPoint from the construct tree', () => {
    const reflection = AccessPointReflection.of(cfnAccessPoint);
    expect(reflection.accessPoint).toBe(cfnAccessPoint);
  });

  test('resolves the CfnFileSystem from the construct tree', () => {
    const reflection = AccessPointReflection.of(cfnAccessPoint);
    expect(reflection.fileSystem).toBe(cfnFileSystem);
  });

  test('resolves mount targets sharing the same fileSystemId', () => {
    const mt0 = new CfnMountTarget(stack, 'MT0', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-aaa',
      securityGroups: ['sg-111'],
    });
    const mt1 = new CfnMountTarget(stack, 'MT1', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-bbb',
      securityGroups: ['sg-111'],
    });
    // unrelated mount target
    new CfnMountTarget(stack, 'OtherMT', {
      fileSystemId: 'fs-other',
      subnetId: 'subnet-ccc',
    });

    const reflection = AccessPointReflection.of(cfnAccessPoint);
    expect(reflection.mountTargets).toEqual(expect.arrayContaining([mt0, mt1]));
    expect(reflection.mountTargets).toHaveLength(2);
  });

  test('resolves security groups from mount targets', () => {
    const vpc = new ec2.Vpc(stack, 'VPC');
    const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

    new CfnMountTarget(stack, 'MT0', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-aaa',
      securityGroups: [sg.securityGroupId],
    });

    const reflection = AccessPointReflection.of(cfnAccessPoint);
    expect(reflection.mountTargetSecurityGroups).toHaveLength(1);
  });

  test('deduplicates security groups across mount targets', () => {
    const vpc = new ec2.Vpc(stack, 'VPC');
    const sg = new ec2.SecurityGroup(stack, 'SG', { vpc });

    new CfnMountTarget(stack, 'MT0', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-aaa',
      securityGroups: [sg.securityGroupId],
    });
    new CfnMountTarget(stack, 'MT1', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-bbb',
      securityGroups: [sg.securityGroupId],
    });

    const reflection = AccessPointReflection.of(cfnAccessPoint);
    expect(reflection.mountTargetSecurityGroups).toHaveLength(1);
  });

  test('throws when file system is not in the construct tree', () => {
    const otherStack = new Stack();
    const orphanAp = new CfnAccessPoint(otherStack, 'OrphanAP', {
      fileSystemId: 'fs-orphan',
    });

    const reflection = AccessPointReflection.of(orphanAp);
    expect(reflection.accessPoint).toBe(orphanAp);
    expect(() => reflection.fileSystem).toThrow(/Unable to find the CfnFileSystem/);
    expect(() => reflection.mountTargets).toThrow(/Unable to find the CfnFileSystem/);
    expect(() => reflection.mountTargetSecurityGroups).toThrow(/Unable to find the CfnFileSystem/);
  });

  test('throws when mount targets have no security groups', () => {
    new CfnMountTarget(stack, 'MT0', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-aaa',
    });

    const reflection = AccessPointReflection.of(cfnAccessPoint);
    expect(reflection.mountTargets).toHaveLength(1);
    expect(() => reflection.mountTargetSecurityGroups).toThrow(/does not have security groups/);
  });

  test('resolves mount targets when access point uses ref and mount targets use attrFileSystemId', () => {
    const apWithRef = new CfnAccessPoint(stack, 'APRef', {
      fileSystemId: cfnFileSystem.ref,
    });
    new CfnMountTarget(stack, 'MTAttr', {
      fileSystemId: cfnFileSystem.attrFileSystemId,
      subnetId: 'subnet-aaa',
    });

    const reflection = AccessPointReflection.of(apWithRef);
    expect(reflection.fileSystem).toBe(cfnFileSystem);
    expect(reflection.mountTargets).toHaveLength(1);
  });

  describe('cross-stack scenarios', () => {
    test('throws when CfnAccessPoint cannot be found for an imported ref', () => {
      const app = new App();
      const mockRef = new class extends Stack {
        get accessPointRef() {
          return { accessPointId: 'fsap-cross', accessPointArn: 'arn:aws:s3files:us-east-1:123456789012:access-point/fsap-cross' };
        }
      }(app, 'MockRef');

      const reflection = AccessPointReflection.of(mockRef as any);
      expect(() => reflection.accessPoint).toThrow(/Unable to find underlying CfnAccessPoint/);
    });

    test('resolves resources across stacks in the same app', () => {
      const app = new App();
      const stack1 = new Stack(app, 'Stack1');
      const stack2 = new Stack(app, 'Stack2');

      const fs = new CfnFileSystem(stack1, 'FileSystem', {
        bucket: 'my-bucket',
        roleArn: 'arn:aws:iam::123456789012:role/S3FilesRole',
      });
      const mt = new CfnMountTarget(stack1, 'MT0', {
        fileSystemId: fs.attrFileSystemId,
        subnetId: 'subnet-aaa',
        securityGroups: ['sg-111'],
      });
      const ap = new CfnAccessPoint(stack2, 'AccessPoint', {
        fileSystemId: fs.attrFileSystemId,
      });

      const reflection = AccessPointReflection.of(ap);
      expect(reflection.fileSystem).toBe(fs);
      expect(reflection.mountTargets).toEqual([mt]);
    });
  });
});
