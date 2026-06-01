import { Template } from '../../assertions';
import { SecurityGroup, Vpc } from '../../aws-ec2';
import { Duration, Stack } from '../../core';
import {
  OntapDeploymentType,
  OntapFileSystem,
  SingleAz2ThroughputCapacity,
  MultiAz2ThroughputCapacity,
} from '../lib';

describe('FSx for NetApp ONTAP File System', () => {
  let stack: Stack;
  let vpc: Vpc;

  beforeEach(() => {
    stack = new Stack();
    vpc = new Vpc(stack, 'VPC');
  });

  describe('basic creation', () => {
    test('creates a Multi-AZ 2 file system with minimal props', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.MULTI_AZ_2,
          preferredSubnet: vpc.privateSubnets[0],
        },
      });

      Template.fromStack(stack).hasResource('AWS::FSx::FileSystem', {});
      Template.fromStack(stack).hasResource('AWS::EC2::SecurityGroup', {});
      Template.fromStack(stack).hasResource('AWS::FSx::FileSystem', {
        DeletionPolicy: 'Retain',
      });
    });

    test('creates a Single-AZ 1 file system', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        FileSystemType: 'ONTAP',
        OntapConfiguration: {
          DeploymentType: 'SINGLE_AZ_1',
          AutomaticBackupRetentionDays: 30,
        },
      });
    });

    test('file system exposes correct DNS names', () => {
      const fs = new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      expect(fs.dnsName).toBeDefined();
      expect(fs.interClusterDnsName).toContain('intercluster.');
    });

    test('uses provided security group', () => {
      const sg = new SecurityGroup(stack, 'SG', { vpc });

      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        securityGroup: sg,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      // Only one security group should exist (the provided one, not an auto-created one)
      Template.fromStack(stack).resourceCountIs('AWS::EC2::SecurityGroup', 1);
    });
  });

  describe('ONTAP configuration', () => {
    test('sets throughput capacity per HA pair', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.MULTI_AZ_2,
          throughputCapacityPerHaPair: MultiAz2ThroughputCapacity.MB_PER_SEC_384,
          preferredSubnet: vpc.privateSubnets[0],
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          ThroughputCapacityPerHAPair: 384,
        },
      });
    });

    test('sets disk IOPS in USER_PROVISIONED mode', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          diskIops: 10000,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          DiskIopsConfiguration: {
            Mode: 'USER_PROVISIONED',
            Iops: 10000,
          },
        },
      });
    });

    test('uses AUTOMATIC disk IOPS mode when not specified', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          DiskIopsConfiguration: {
            Mode: 'AUTOMATIC',
          },
        },
      });
    });

    test('sets HA pairs for SINGLE_AZ_2', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 2048,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_2,
          haPairs: 2,
          throughputCapacityPerHaPair: SingleAz2ThroughputCapacity.MB_PER_SEC_1536,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          HAPairs: 2,
        },
      });
    });

    test('sets automatic backup retention to 0 to disable', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          automaticBackupRetention: Duration.days(0),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          AutomaticBackupRetentionDays: 0,
        },
      });
    });
  });

  describe('validation', () => {
    test('throws if haPairs > 1 for first-generation deployment type', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            haPairs: 2,
          },
        });
      }).toThrow(/haPairs/);
    });

    test('throws if haPairs > 12', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            haPairs: 13,
          },
        });
      }).toThrow(/haPairs/);
    });

    test('throws if preferredSubnet is missing for Multi-AZ', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
          },
        });
      }).toThrow(/preferredSubnet/);
    });

    test('throws if preferredSubnet is set for Single-AZ', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            preferredSubnet: vpc.privateSubnets[0],
          },
        });
      }).toThrow(/preferredSubnet/);
    });

    test('throws if Multi-AZ does not have exactly 2 subnets', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
            preferredSubnet: vpc.privateSubnets[0],
          },
        });
      }).toThrow(/subnets/);
    });

    test('throws if throughput capacity does not match deployment type', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            throughputCapacityPerHaPair: MultiAz2ThroughputCapacity.MB_PER_SEC_384,
          },
        });
      }).toThrow(/throughputCapacityPerHaPair/);
    });

    test('throws if storage capacity is below minimum', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 512,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          },
        });
      }).toThrow(/storageCapacityGiB/);
    });

    test('throws if automatic backup retention exceeds 90 days', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            automaticBackupRetention: Duration.days(91),
          },
        });
      }).toThrow(/automaticBackupRetention/);
    });

    test('throws if diskIops is below minimum', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            diskIops: 100,
          },
        });
      }).toThrow(/diskIops/);
    });

    test('throws if endpointIpAddressRange is set for Single-AZ', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            endpointIpAddressRange: '198.19.0.0/24',
          },
        });
      }).toThrow(/endpointIpAddressRange/);
    });

    test('throws if routeTables is set for Single-AZ', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            routeTables: [vpc.privateSubnets[0].routeTable],
          },
        });
      }).toThrow(/routeTables/);
    });
  });

  describe('import', () => {
    test('imports from attributes', () => {
      const sg = new SecurityGroup(stack, 'SG', { vpc });
      const imported = OntapFileSystem.fromOntapFileSystemAttributes(stack, 'Imported', {
        dnsName: 'management.fs-12345.fsx.us-east-1.amazonaws.com',
        fileSystemId: 'fs-12345',
        securityGroup: sg,
      });

      expect(imported.fileSystemId).toEqual('fs-12345');
      expect((imported as any).dnsName).toEqual('management.fs-12345.fsx.us-east-1.amazonaws.com');
    });
  });
});
