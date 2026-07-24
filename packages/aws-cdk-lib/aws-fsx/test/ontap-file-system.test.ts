import { Annotations, Match, Template } from '../../assertions';
import { SecurityGroup, Subnet, Vpc } from '../../aws-ec2';
import * as kms from '../../aws-kms';
import { CfnParameter, Duration, RemovalPolicy, SecretValue, Stack } from '../../core';
import {
  NetworkType,
  OntapDeploymentType,
  OntapFileSystem,
  ThroughputCapacityPerHaPair,
} from '../lib';
import { DailyAutomaticBackupStartTime } from '../lib/daily-automatic-backup-start-time';
import { StorageType } from '../lib/file-system';
import { MaintenanceTime, Weekday } from '../lib/maintenance-time';

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

      // AutomaticBackupRetentionDays is intentionally not asserted here: when the user
      // does not supply `automaticBackupRetention`, the construct passes through `undefined`
      // and lets Amazon FSx apply its own service-side default (currently 30 days).
      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        FileSystemType: 'ONTAP',
        OntapConfiguration: {
          DeploymentType: 'SINGLE_AZ_1',
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
          throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_384,
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
          throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_1536,
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
    test('throws if haPairs > 1 for SINGLE_AZ_1', () => {
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
      }).toThrow(/'haPairs' can only be greater than 1 for SINGLE_AZ_2/);
    });

    test('throws if haPairs > 1 for MULTI_AZ_2 (scale-out only on SINGLE_AZ_2)', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
          storageCapacityGiB: 2048,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
            preferredSubnet: vpc.privateSubnets[0],
            haPairs: 2,
          },
        });
      }).toThrow(/'haPairs' can only be greater than 1 for SINGLE_AZ_2/);
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
      }).toThrow(/'haPairs' must be an integer between 1 and 12/);
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
      }).toThrow(/'preferredSubnet' must be specified for Multi-AZ/);
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
      }).toThrow(/'preferredSubnet' can only be specified for Multi-AZ/);
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
      }).toThrow(/Multi-AZ file systems require exactly 2 subnets/);
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
      }).toThrow(/'storageCapacityGiB' must be an integer between/);
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
      }).toThrow(/'automaticBackupRetention' must be a whole number of days between 1 and 90/);
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
      }).toThrow(/'diskIops' must be at least \d+/);
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
      }).toThrow(/'endpointIpAddressRange' can only be specified for Multi-AZ/);
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
      }).toThrow(/'routeTables' can only be specified for Multi-AZ/);
    });

    test('throws if storageType is HDD (ONTAP only supports SSD)', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          storageType: StorageType.HDD,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          },
        });
      }).toThrow(/FSx for ONTAP only supports SSD storage type/);
    });

    test('throws if preferredSubnet is not one of the supplied vpcSubnets', () => {
      const subnetA = Subnet.fromSubnetAttributes(stack, 'SubnetA', {
        availabilityZone: 'us-east-1a',
        subnetId: 'subnet-aaaaaaaa',
      });
      const subnetB = Subnet.fromSubnetAttributes(stack, 'SubnetB', {
        availabilityZone: 'us-east-1b',
        subnetId: 'subnet-bbbbbbbb',
      });
      const otherSubnet = Subnet.fromSubnetAttributes(stack, 'Other', {
        availabilityZone: 'us-east-1c',
        subnetId: 'subnet-99999999',
      });
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [subnetA, subnetB],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
            preferredSubnet: otherSubnet,
          },
        });
      }).toThrow(/'preferredSubnet' must be one of the subnets passed in 'vpcSubnets'/);
    });

    test('throws if Multi-AZ subnets are in the same availability zone', () => {
      const subnetA = Subnet.fromSubnetAttributes(stack, 'SubnetA', {
        availabilityZone: 'us-east-1a',
        subnetId: 'subnet-aaaaaaaa',
      });
      const subnetB = Subnet.fromSubnetAttributes(stack, 'SubnetB', {
        availabilityZone: 'us-east-1a', // same AZ as subnetA
        subnetId: 'subnet-bbbbbbbb',
      });
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [subnetA, subnetB],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
            preferredSubnet: subnetA,
          },
        });
      }).toThrow(/Multi-AZ file systems require the two subnets to be in different availability zones/);
    });
  });

  describe('optional configuration', () => {
    test('sets weekly maintenance start time', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          weeklyMaintenanceStartTime: new MaintenanceTime({
            day: Weekday.MONDAY,
            hour: 12,
            minute: 30,
          }),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          WeeklyMaintenanceStartTime: '1:12:30',
        }),
      });
    });

    test('sets daily automatic backup start time', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          dailyAutomaticBackupStartTime: new DailyAutomaticBackupStartTime({
            hour: 3,
            minute: 15,
          }),
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          DailyAutomaticBackupStartTime: '03:15',
        }),
      });
    });

    test('sets endpointIpAddressRange for Multi-AZ', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.MULTI_AZ_2,
          preferredSubnet: vpc.privateSubnets[0],
          endpointIpAddressRange: '198.19.0.0/24',
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          EndpointIpAddressRange: '198.19.0.0/24',
        }),
      });
    });

    test('sets routeTables for Multi-AZ', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.MULTI_AZ_2,
          preferredSubnet: vpc.privateSubnets[0],
          routeTables: [vpc.privateSubnets[0].routeTable],
        },
      });

      // RouteTableIds is rendered as a list of CFN intrinsics. Look up directly
      // and assert it has at least one entry.
      const resources = Template.fromStack(stack).findResources('AWS::FSx::FileSystem');
      const fs = Object.values(resources)[0] as any;
      expect(fs.Properties.OntapConfiguration.RouteTableIds).toBeDefined();
      expect(fs.Properties.OntapConfiguration.RouteTableIds.length).toBeGreaterThan(0);
    });

    test('uses a custom KMS key when provided', () => {
      const key = new kms.Key(stack, 'Key');

      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        kmsKey: key,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      // The construct passes `kmsKey.keyRef.keyId`, which renders as a CFN
      // intrinsic. Assert that it's an object reference (not a literal string).
      const resources = Template.fromStack(stack).findResources('AWS::FSx::FileSystem');
      const fs = Object.values(resources)[0] as any;
      expect(typeof fs.Properties.KmsKeyId).toBe('object');
    });

    test('applies a removalPolicy of DESTROY', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        removalPolicy: RemovalPolicy.DESTROY,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      Template.fromStack(stack).hasResource('AWS::FSx::FileSystem', {
        DeletionPolicy: 'Delete',
      });
    });

    test('exposes connections defaulting to NFS port 2049', () => {
      const fs = new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      expect(fs.connections.defaultPort?.toString()).toContain('2049');
    });

    test('renders backupId when restoring from a backup', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        backupId: 'backup-12345',
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        BackupId: 'backup-12345',
      });
    });
  });

  describe('token handling', () => {
    test('skips numeric validation when storageCapacityGiB is a token', () => {
      const sizeParam = new CfnParameter(stack, 'Size', { type: 'Number', default: 1024 });

      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: sizeParam.valueAsNumber,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          },
        });
      }).not.toThrow();
    });

    test('skips numeric validation when haPairs is a token', () => {
      const haParam = new CfnParameter(stack, 'HaPairs', { type: 'Number', default: 1 });

      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            haPairs: haParam.valueAsNumber,
          },
        });
      }).not.toThrow();
    });
  });

  describe('throughput capacity', () => {
    test('all static throughput members are accepted', () => {
      const values = [
        ThroughputCapacityPerHaPair.MB_PER_SEC_128,
        ThroughputCapacityPerHaPair.MB_PER_SEC_256,
        ThroughputCapacityPerHaPair.MB_PER_SEC_384,
        ThroughputCapacityPerHaPair.MB_PER_SEC_512,
        ThroughputCapacityPerHaPair.MB_PER_SEC_768,
        ThroughputCapacityPerHaPair.MB_PER_SEC_1024,
        ThroughputCapacityPerHaPair.MB_PER_SEC_1536,
        ThroughputCapacityPerHaPair.MB_PER_SEC_2048,
        ThroughputCapacityPerHaPair.MB_PER_SEC_3072,
        ThroughputCapacityPerHaPair.MB_PER_SEC_4096,
        ThroughputCapacityPerHaPair.MB_PER_SEC_6144,
      ];
      const expected = [128, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144];
      values.forEach((v, i) => expect(v.throughput).toEqual(expected[i]));
    });

    test('accepts a custom throughput value via constructor (passes validation when value is in deployment-type allow list)', () => {
      // The constructor itself accepts any number for forward compatibility with new
      // FSx values. Validation against the deployment-type-specific allow list is
      // performed when the value is wired into an OntapFileSystem.
      const custom = new ThroughputCapacityPerHaPair(4096);
      expect(custom.throughput).toEqual(4096);

      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          throughputCapacityPerHaPair: custom,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          ThroughputCapacityPerHAPair: 4096,
        }),
      });
    });

    test('constructor accepts any custom value for forward compatibility', () => {
      // The constructor must not reject values not yet in the static allow list,
      // so consumers can opt in to new throughput values before the CDK ships
      // a corresponding static member. Validation against the deployment type
      // happens at file-system construction time.
      const custom = new ThroughputCapacityPerHaPair(2560);
      expect(custom.throughput).toEqual(2560);
    });
  });

  describe('deployment type coverage', () => {
    test('creates a Single-AZ 2 file system with maximum HA pairs and matching capacity', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 12288, // 1024 * 12 HA pairs minimum
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_2,
          haPairs: 12,
          throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_1536,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          DeploymentType: 'SINGLE_AZ_2',
          HAPairs: 12,
        }),
        StorageCapacity: 12288,
      });
    });

    test('creates a Multi-AZ 1 file system', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.MULTI_AZ_1,
          preferredSubnet: vpc.privateSubnets[0],
          throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_128,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          DeploymentType: 'MULTI_AZ_1',
          ThroughputCapacityPerHAPair: 128,
        }),
      });
    });

    test('accepts storageCapacityGiB at the Gen2 maximum (1 PiB)', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1_048_576, // 1 PiB (Gen2 hard cap)
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_2,
          haPairs: 12,
          throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_6144,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        StorageCapacity: 1_048_576,
      });
    });
  });

  describe('extra validation', () => {
    test('throws if haPairs is below 1', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            haPairs: 0,
          },
        });
      }).toThrow(/'haPairs' must be an integer between 1 and 12/);
    });

    test('throws if storageCapacityGiB exceeds Gen1 max (196,608 GiB)', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 200_000,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          },
        });
      }).toThrow(/'storageCapacityGiB' must be an integer between 1024 and 196608/);
    });

    test('throws if diskIops exceeds Gen1 max (80,000)', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            diskIops: 100_000,
          },
        });
      }).toThrow(/'diskIops' must be at most \d+/);
    });

    test('throws if dailyAutomaticBackupStartTime is set but backups are disabled', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            automaticBackupRetention: Duration.days(0),
            dailyAutomaticBackupStartTime: new DailyAutomaticBackupStartTime({
              hour: 3,
              minute: 0,
            }),
          },
        });
      }).toThrow(/'dailyAutomaticBackupStartTime' cannot be set when automatic backups are disabled/);
    });

    test('throws if endpointIpv6AddressRange is set for Single-AZ', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            endpointIpv6AddressRange: 'fd00::/64',
          },
        });
      }).toThrow(/'endpointIpv6AddressRange' can only be specified for Multi-AZ/);
    });

    test('throws if endpointIpv6AddressRange is set without networkType DUAL on Multi-AZ', () => {
      // The Multi-AZ scoping check passes, but the IPv6 prop only has effect on
      // dual-stack file systems; without `networkType: DUAL` the FSx API silently
      // drops it, so we surface this as a clear synth error.
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0], vpc.privateSubnets[1]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
            preferredSubnet: vpc.privateSubnets[0],
            endpointIpv6AddressRange: 'fd00::/64',
          },
        });
      }).toThrow(/'endpointIpv6AddressRange' requires 'networkType: NetworkType\.DUAL'/);
    });

    test('throws if a token-valued endpointIpAddressRange is set for Single-AZ', () => {
      const cidrParam = new CfnParameter(stack, 'CidrParam', { type: 'String' });
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            endpointIpAddressRange: cidrParam.valueAsString,
          },
        });
      }).toThrow(/'endpointIpAddressRange' can only be specified for Multi-AZ/);
    });

    test('throws if a token-valued endpointIpv6AddressRange is set for Single-AZ', () => {
      const cidrParam = new CfnParameter(stack, 'CidrParam', { type: 'String' });
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            endpointIpv6AddressRange: cidrParam.valueAsString,
          },
        });
      }).toThrow(/'endpointIpv6AddressRange' can only be specified for Multi-AZ/);
    });
  });

  describe('admin password warning', () => {
    test('emits warning when fsxAdminPassword is a literal SecretValue', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          fsxAdminPassword: SecretValue.unsafePlainText('LiteralPwd1234'),
        },
      });
      Annotations.fromStack(stack).hasWarning('/Default/OntapFs', Match.stringLikeRegexp('fsxAdminPassword.*literal string'));
    });

    test('does not emit warning when fsxAdminPassword is token-based (Secrets Manager)', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
          fsxAdminPassword: SecretValue.secretsManager('my-fsx-admin-secret'),
        },
      });
      Annotations.fromStack(stack).hasNoWarning('/Default/OntapFs', Match.stringLikeRegexp('fsxAdminPassword.*literal string'));
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
      expect(imported.dnsName).toEqual('management.fs-12345.fsx.us-east-1.amazonaws.com');
    });

    test('imports preserve resourceArn when provided', () => {
      const sg = new SecurityGroup(stack, 'SG', { vpc });
      const imported = OntapFileSystem.fromOntapFileSystemAttributes(stack, 'Imported', {
        dnsName: 'management.fs-12345.fsx.us-east-1.amazonaws.com',
        fileSystemId: 'fs-12345',
        securityGroup: sg,
        resourceArn: 'arn:aws:fsx:us-east-1:111122223333:file-system/fs-12345',
      });

      expect(imported.resourceArn).toEqual('arn:aws:fsx:us-east-1:111122223333:file-system/fs-12345');
    });

    test('imported resourceArn throws eagerly when not provided', () => {
      const sg = new SecurityGroup(stack, 'SG', { vpc });
      const imported = OntapFileSystem.fromOntapFileSystemAttributes(stack, 'Imported', {
        dnsName: 'management.fs-12345.fsx.us-east-1.amazonaws.com',
        fileSystemId: 'fs-12345',
        securityGroup: sg,
      });

      // Reading resourceArn on an import that omitted it must surface a clear
      // CDK-side ValidationError rather than silently returning an empty string.
      expect(() => imported.resourceArn).toThrow(/'resourceArn' was not provided when importing this FSx ONTAP file system/);
    });
  });

  describe('networkType', () => {
    test('renders NetworkType=DUAL when set', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        networkType: NetworkType.DUAL,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        NetworkType: 'DUAL',
      });
    });

    test('NetworkType is omitted by default', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      const resources = Template.fromStack(stack).findResources('AWS::FSx::FileSystem');
      const fs = Object.values(resources)[0] as any;
      expect(fs.Properties.NetworkType).toBeUndefined();
    });
  });

  describe('resourceArn', () => {
    test('exposes resourceArn from attrResourceArn', () => {
      const fs = new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 1024,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_1,
        },
      });

      // resourceArn is a token resolving to a CFN intrinsic.
      expect(fs.resourceArn).toBeDefined();
      expect(typeof fs.resourceArn).toBe('string');
    });
  });

  describe('throughputCapacity total alternative', () => {
    test('accepts a total throughputCapacity value', () => {
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 12288,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_2,
          haPairs: 2,
          throughputCapacity: 3072,
        },
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          ThroughputCapacity: 3072,
        }),
      });
    });

    test('throws when both throughputCapacity and throughputCapacityPerHaPair are set', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            throughputCapacity: 1024,
            throughputCapacityPerHaPair: ThroughputCapacityPerHaPair.MB_PER_SEC_1024,
          },
        });
      }).toThrow(/'throughputCapacity' and 'throughputCapacityPerHaPair' are mutually exclusive/);
    });

    test('throws when throughputCapacity is below 8 MBps', () => {
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            throughputCapacity: 7,
          },
        });
      }).toThrow(/'throughputCapacity' must be an integer of at least 128 MBps for SINGLE_AZ_1/);
    });

    test('throws when throughputCapacity exceeds the per-deployment cap on SINGLE_AZ_1', () => {
      // SINGLE_AZ_1 is single-HA-pair only, so the cap is 4,096 MBps (one per-HA-pair maximum),
      // not the global 73,728 service hard cap.
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            throughputCapacity: 10_240,
          },
        });
      }).toThrow(/'throughputCapacity' must be at most 4096 MBps for SINGLE_AZ_1/);
    });

    test('throws when throughputCapacity exceeds the per-deployment cap on MULTI_AZ_2', () => {
      // MULTI_AZ_2 is single-HA-pair only, so the cap is 6,144 MBps.
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.publicSubnets[0], vpc.publicSubnets[1]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.MULTI_AZ_2,
            preferredSubnet: vpc.publicSubnets[0],
            throughputCapacity: 10_240,
          },
        });
      }).toThrow(/'throughputCapacity' must be at most 6144 MBps for MULTI_AZ_2/);
    });

    test('throws when throughputCapacity is below the deployment-type minimum (SINGLE_AZ_2)', () => {
      // SINGLE_AZ_2 minimum total throughput is 1536 MBps (the smallest valid per-HA-pair value).
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            throughputCapacity: 1024,
          },
        });
      }).toThrow(/'throughputCapacity' must be an integer of at least 1536 MBps for SINGLE_AZ_2/);
    });

    test('SINGLE_AZ_2 with multiple HA pairs scales the upper bound proportionally', () => {
      // 2 HA pairs * 6,144 MBps per HA pair = 12,288 MBps cap. 12,289 should fail.
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 4096,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            haPairs: 2,
            throughputCapacity: 12_289,
          },
        });
      }).toThrow(/'throughputCapacity' must be at most 12288 MBps for SINGLE_AZ_2 with haPairs=2/);
    });

    test('lower-bound check still runs when haPairs is an unresolved token', () => {
      // Even though haPairs is tokenized (so the upper-bound check is skipped), the integer
      // check and lower-bound check still apply because they are deployment-type-only constants.
      const haPairsParam = new CfnParameter(stack, 'HaPairs', { type: 'Number' });
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 4096,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            haPairs: haPairsParam.valueAsNumber,
            throughputCapacity: 100, // below the 1536 minimum for SINGLE_AZ_2
          },
        });
      }).toThrow(/'throughputCapacity' must be an integer of at least 1536 MBps for SINGLE_AZ_2/);
    });

    test('throws when throughputCapacity is in-range but does not divide evenly into haPairs', () => {
      // 5000 is in [1536, 12288] for SINGLE_AZ_2 with haPairs=2, but 5000/2 = 2500 is
      // not in the SINGLE_AZ_2 per-HA-pair set {1536, 3072, 6144}. The service rejects
      // this with `BadRequest`; surface it at synth instead.
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 8192,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_2,
            haPairs: 2,
            throughputCapacity: 5000,
          },
        });
      }).toThrow(/'throughputCapacity' \(5000\) divided by haPairs \(2\) must equal a valid per-HA-pair value for SINGLE_AZ_2: 1536, 3072, 6144 MBps/);
    });

    test('throws when throughputCapacity is in-range but not in the per-HA-pair set on SINGLE_AZ_1', () => {
      // 200 is between 128 and 4096 (the SINGLE_AZ_1 cap), but it isn't one of
      // {128, 256, 512, 1024, 2048, 4096}.
      expect(() => {
        new OntapFileSystem(stack, 'OntapFs', {
          vpc,
          vpcSubnets: [vpc.privateSubnets[0]],
          storageCapacityGiB: 1024,
          ontapConfiguration: {
            deploymentType: OntapDeploymentType.SINGLE_AZ_1,
            throughputCapacity: 200,
          },
        });
      }).toThrow(/'throughputCapacity' \(200\) divided by haPairs \(1\) must equal a valid per-HA-pair value for SINGLE_AZ_1/);
    });

    test('accepts a SINGLE_AZ_2 throughputCapacity that divides evenly into a valid per-HA-pair value', () => {
      // 6144 / 2 = 3072, which is in {1536, 3072, 6144}. Should synth cleanly.
      new OntapFileSystem(stack, 'OntapFs', {
        vpc,
        vpcSubnets: [vpc.privateSubnets[0]],
        storageCapacityGiB: 8192,
        ontapConfiguration: {
          deploymentType: OntapDeploymentType.SINGLE_AZ_2,
          haPairs: 2,
          throughputCapacity: 6144,
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: Match.objectLike({
          ThroughputCapacity: 6144,
        }),
      });
    });
  });
});
