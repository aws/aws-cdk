import { Template } from '../../assertions';
import { Vpc } from '../../aws-ec2';
import { Duration, Stack } from '../../core';
import {
  OntapDeploymentType,
  OntapFileSystem,
  OntapStorageVirtualMachine,
  OntapVolume,
  OntapVolumeType,
  VolumeStyle,
  TieringPolicyName,
  SecurityStyle,
} from '../lib';

describe('FSx for NetApp ONTAP Volume', () => {
  let stack: Stack;
  let vpc: Vpc;
  let svm: OntapStorageVirtualMachine;

  beforeEach(() => {
    stack = new Stack();
    vpc = new Vpc(stack, 'VPC');
    const fileSystem = new OntapFileSystem(stack, 'OntapFs', {
      vpc,
      vpcSubnets: [vpc.privateSubnets[0]],
      storageCapacityGiB: 1024,
      ontapConfiguration: {
        deploymentType: OntapDeploymentType.SINGLE_AZ_1,
      },
    });
    svm = new OntapStorageVirtualMachine(stack, 'Svm', {
      fileSystem,
      name: 'test-svm',
    });
  });

  describe('basic creation', () => {
    test('creates a volume with minimal props', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test-vol',
        sizeInBytes: 1073741824, // 1 GB
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        VolumeType: 'ONTAP',
        Name: 'test-vol',
        OntapConfiguration: {
          StorageEfficiencyEnabled: 'true',
        },
      });
    });

    test('creates a volume with junction path', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test-vol',
        sizeInBytes: 1073741824,
        junctionPath: '/data',
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          JunctionPath: '/data',
        },
      });
    });

    test('creates a volume with tiering policy', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test-vol',
        sizeInBytes: 1073741824,
        tieringPolicy: {
          name: TieringPolicyName.AUTO,
          coolingPeriod: Duration.days(31),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          TieringPolicy: {
            Name: 'AUTO',
            CoolingPeriod: 31,
          },
        },
      });
    });

    test('creates a volume with security style', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test-vol',
        sizeInBytes: 1073741824,
        securityStyle: SecurityStyle.NTFS,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          SecurityStyle: 'NTFS',
        },
      });
    });

    test('creates a DP volume', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'dp-vol',
        sizeInBytes: 1073741824,
        ontapVolumeType: OntapVolumeType.DP,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          OntapVolumeType: 'DP',
        },
      });
    });

    test('creates a FlexGroup volume', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'flexgroup-vol',
        sizeInBytes: 1073741824,
        volumeStyle: VolumeStyle.FLEXGROUP,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          VolumeStyle: 'FLEXGROUP',
        },
      });
    });

    test('creates a volume with copyTagsToBackups', () => {
      new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test-vol',
        sizeInBytes: 1073741824,
        copyTagsToBackups: true,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::Volume', {
        OntapConfiguration: {
          CopyTagsToBackups: 'true',
        },
      });
    });

    test('exposes volumeId', () => {
      const volume = new OntapVolume(stack, 'Volume', {
        storageVirtualMachine: svm,
        name: 'test-vol',
        sizeInBytes: 1073741824,
      });

      expect(volume.volumeId).toBeDefined();
    });
  });

  describe('validation', () => {
    test('throws if name is empty', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: '',
          sizeInBytes: 1073741824,
        });
      }).toThrow(/name/);
    });

    test('throws if name exceeds 203 characters', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'a'.repeat(204),
          sizeInBytes: 1073741824,
        });
      }).toThrow(/name/);
    });

    test('throws if junctionPath does not start with /', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test-vol',
          sizeInBytes: 1073741824,
          junctionPath: 'data',
        });
      }).toThrow(/junctionPath/);
    });

    test('throws if junctionPath exceeds 255 characters', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test-vol',
          sizeInBytes: 1073741824,
          junctionPath: '/' + 'a'.repeat(255),
        });
      }).toThrow(/junctionPath/);
    });

    test('throws if cooling period is below 2 days', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test-vol',
          sizeInBytes: 1073741824,
          tieringPolicy: {
            name: TieringPolicyName.AUTO,
            coolingPeriod: Duration.days(1),
          },
        });
      }).toThrow(/coolingPeriod/);
    });

    test('throws if cooling period exceeds 183 days', () => {
      expect(() => {
        new OntapVolume(stack, 'Volume', {
          storageVirtualMachine: svm,
          name: 'test-vol',
          sizeInBytes: 1073741824,
          tieringPolicy: {
            name: TieringPolicyName.SNAPSHOT_ONLY,
            coolingPeriod: Duration.days(184),
          },
        });
      }).toThrow(/coolingPeriod/);
    });
  });
});
