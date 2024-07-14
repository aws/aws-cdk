import { strictEqual } from 'assert';
import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import { Key } from '../../aws-kms';
import { Aws, Duration, RemovalPolicy, Stack, Token } from '../../core';
import * as fsx from '../lib';

describe('FSx for NetApp ONTAP File System', () => {
  let ontapConfiguration: fsx.OntapConfiguration;
  let stack: Stack;
  let vpc: ec2.Vpc;

  beforeEach(() => {
    stack = new Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
  });

  test('default multi az file system', () => {
    ontapConfiguration = {
      deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
      preferredSubnet: vpc.privateSubnets[0],
    };

    const fileSystem = new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
      ontapConfiguration,
      storageCapacityGiB: 1200,
      vpc,
      vpcSubnets: vpc.privateSubnets,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'ONTAP',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      OntapConfiguration: {
        DeploymentType: 'MULTI_AZ_2',
        AutomaticBackupRetentionDays: 0,
        PreferredSubnetId: {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
    strictEqual(
      fileSystem.dnsName,
      `management.${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
    );
    strictEqual(
      fileSystem.interClusterDnsName,
      `intercluster.${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
    );
  });

  test('full settings multi az file system', () => {
    const kmsKey = new Key(stack, 'Key');

    ontapConfiguration = {
      automaticBackupRetention: Duration.days(7),
      dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({
        hour: 1,
        minute: 0,
      }),
      deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
      diskIops: 15360,
      endpointIpAddressRange: '192.168.12.0/24',
      fsxAdminPassword: 'fsxPassword2',
      haPairs: 1,
      preferredSubnet: vpc.privateSubnets[0],
      routeTables: vpc.privateSubnets.map((subnet) => subnet.routeTable),
      throughputCapacity: 384,
      weeklyMaintenanceStartTime: new fsx.MaintenanceTime({
        day: fsx.Weekday.SUNDAY,
        hour: 5,
        minute: 0,
      }),
    };

    new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
      ontapConfiguration,
      storageCapacityGiB: 1200,
      vpc,
      vpcSubnets: vpc.privateSubnets,
      kmsKey,
      backupId: 'backupId',
      securityGroup: new ec2.SecurityGroup(stack, 'SecurityGroup', {
        vpc,
        allowAllOutbound: false,
      }),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'ONTAP',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      OntapConfiguration: {
        AutomaticBackupRetentionDays: 7,
        DailyAutomaticBackupStartTime: '01:00',
        DeploymentType: 'MULTI_AZ_2',
        DiskIopsConfiguration: {
          Mode: 'USER_PROVISIONED',
          Iops: 15360,
        },
        EndpointIpAddressRange: '192.168.12.0/24',
        FsxAdminPassword: 'fsxPassword2',
        HAPairs: 1,
        PreferredSubnetId: {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        RouteTableIds: [
          {
            Ref: 'VPCPrivateSubnet1RouteTableBE8A6027',
          },
          {
            Ref: 'VPCPrivateSubnet2RouteTable0A19E10E',
          },
        ],
        ThroughputCapacity: 384,
        WeeklyMaintenanceStartTime: '7:05:00',
      },
      BackupId: 'backupId',
      KmsKeyId: {
        Ref: 'Key961B73FD',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
  });

  test('default single az file system', () => {
    ontapConfiguration = {
      deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    };

    const fileSystem = new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
      ontapConfiguration,
      storageCapacityGiB: 1200,
      vpc,
      vpcSubnets: vpc.privateSubnets,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'ONTAP',
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      OntapConfiguration: {
        DeploymentType: 'SINGLE_AZ_2',
        AutomaticBackupRetentionDays: 0,
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      VpcId: {
        Ref: 'VPCB9E5F0B4',
      },
    });
    strictEqual(
      fileSystem.dnsName,
      `management.${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
    );
    strictEqual(
      fileSystem.interClusterDnsName,
      `intercluster.${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
    );
  });

  test('full settings single az file system', () => {
    const kmsKey = new Key(stack, 'Key');

    ontapConfiguration = {
      automaticBackupRetention: Duration.days(7),
      dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({
        hour: 1,
        minute: 0,
      }),
      deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
      diskIops: 442368,
      fsxAdminPassword: 'fsxPassword1',
      haPairs: 12,
      throughputCapacity: 1536 * 12,
      weeklyMaintenanceStartTime: new fsx.MaintenanceTime({
        day: fsx.Weekday.SUNDAY,
        hour: 5,
        minute: 0,
      }),
    };

    new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
      ontapConfiguration,
      storageCapacityGiB: 12288,
      vpc,
      vpcSubnets: vpc.privateSubnets,
      kmsKey,
      backupId: 'backupId',
      securityGroup: new ec2.SecurityGroup(stack, 'SecurityGroup', {
        vpc,
        allowAllOutbound: false,
      }),
      removalPolicy: RemovalPolicy.DESTROY,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemType: 'ONTAP',
      StorageCapacity: 12288,
      SubnetIds: [
        {
          Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
        },
        {
          Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
        },
      ],
      OntapConfiguration: {
        AutomaticBackupRetentionDays: 7,
        DailyAutomaticBackupStartTime: '01:00',
        DeploymentType: 'SINGLE_AZ_2',
        DiskIopsConfiguration: {
          Mode: 'USER_PROVISIONED',
          Iops: 442368,
        },
        FsxAdminPassword: 'fsxPassword1',
        HAPairs: 12,
        ThroughputCapacity: 18432,
        WeeklyMaintenanceStartTime: '7:05:00',
      },
      BackupId: 'backupId',
      KmsKeyId: {
        Ref: 'Key961B73FD',
      },
    });
  });

  describe('HA pairs', () => {
    test.each([0.1, -1, 0, 13])('throw error for invalid HA pairs %s', (haPairs) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        haPairs,
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow(`\'haPairs\' must be an integer between 1 and 12, got ${haPairs}`);
    });

    test.each([
      fsx.OntapDeploymentType.MULTI_AZ_2,
      fsx.OntapDeploymentType.MULTI_AZ_1,
      fsx.OntapDeploymentType.SINGLE_AZ_1,
    ])('throw error for specification of multiple HA pairs except for SINGLE_AZ_1 deployment type %s', (deploymentType) => {
      const multiAzConfig = {
        preferredSubnet: vpc.privateSubnets[0],
        endpointIpAddressRange: '192.168.12.0/24',
      };

      ontapConfiguration = {
        deploymentType,
        haPairs: 2,
      };

      if ([fsx.OntapDeploymentType.MULTI_AZ_1, fsx.OntapDeploymentType.MULTI_AZ_2].includes(deploymentType)) {
        ontapConfiguration = {
          ...ontapConfiguration,
          ...multiAzConfig,
        };
      }

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow(`\'haPairs\' must be 1 for deployment type ${deploymentType}`);
    });
  });

  describe('Automatic backup retention', () => {
    test('disable automatic backup retention', () => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
        automaticBackupRetention: Duration.days(0),
      };

      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: 1200,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          DeploymentType: 'SINGLE_AZ_2',
          AutomaticBackupRetentionDays: 0,
        },
      });
    });

    test.each([
      Duration.millis(1),
      Duration.minutes(1),
      Duration.hours(23),
      Duration.days(91),
    ])('throw error for invalid automatic backup retention days %s', (duration) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
        automaticBackupRetention: duration,
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('automaticBackupRetention must be between 1 and 90 days or be equal to 0');
    });
  });

  test('throw error for spcifying `dailyAutomaticBackupStartTime` when automatic backup is disabled', () => {
    ontapConfiguration = {
      deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
      dailyAutomaticBackupStartTime: new fsx.DailyAutomaticBackupStartTime({
        hour: 1,
        minute: 0,
      }),
      automaticBackupRetention: Duration.days(0),
    };

    expect(() => {
      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: 1200,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });
    }).toThrow('\'automaticBackupRetention\' period must be set a non-zero day when \'dailyAutomaticBackupStartTime\' is set');
  });

  test.each([{
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    diskIops: 0,
    haPairs: 2,
  }, {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    diskIops: 7199,
    haPairs: 2,
  }, {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    diskIops: 7200.1,
    haPairs: 2,
  }, {
    deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
    diskIops: 400_001,
    haPairs: 2,
  }, {
    deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
    diskIops: 0,
  }, {
    deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
    diskIops: 3599,
  }, {
    deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
    diskIops: 200_001,
  }])('throw error for invalid disk IOPS configuration %s', (config) => {
    ontapConfiguration = {
      deploymentType: config.deploymentType,
      diskIops: config.diskIops,
      haPairs: config.haPairs,
    };

    const storageCapacityGiB = 1200;
    const haPairs = config.haPairs ?? 1;

    const minDiskIops = storageCapacityGiB * 3 * haPairs;
    const maxDiskIops = 200_000 * haPairs;

    expect(() => {
      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });
    }).toThrow(`\'diskIops\' must be an integer between ${minDiskIops} and ${maxDiskIops}, got ${config.diskIops}`);
  });

  describe('endpoint IP address range', () => {
    test.each([
      fsx.OntapDeploymentType.SINGLE_AZ_2,
      fsx.OntapDeploymentType.SINGLE_AZ_1,
    ])('throw error for specifying endpointIpAddressRange for %s file system', (deploymentType) => {
      ontapConfiguration = {
        deploymentType: deploymentType,
        endpointIpAddressRange: '192.168.1.0/24',
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'endpointIpAddressRange\' can only be specified for multi-AZ file systems');
    });

    test.each([
      '',
      'a'.repeat(8),
      'a'.repeat(18),
      '192.168.0.1\u0000',
      '10.0.0.1\u0085',
      '172.16.0.1\u2028',
      '172.16.0.1\u2029',
      '172.16.0.1\r',
      '172.16.0.1\n',
    ])('throw error for invalid endpoint IP address range \'%s\'', (ipAddressRange) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        endpointIpAddressRange: ipAddressRange,
        preferredSubnet: vpc.privateSubnets[0],
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'endpointIpAddressRange\' must be between 9 and 17 characters long and not contain any of the following characters: \\u0000, \\u0085, \\u2028, \\u2029, \\r, or \\n');
    });
  });

  describe('fsx admin password', () => {
    test.each([
      '',
      'a'.repeat(7),
      'a'.repeat(51),
      '\u0000',
      '\u0085',
      '\u2028',
      '\u2029',
      '\r',
      '\n',
    ])('throw error for invalid fsx admin password \'%s\'', (fsxAdminPassword) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        fsxAdminPassword,
        preferredSubnet: vpc.privateSubnets[0],
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'fsxAdminPassword\' must be between 8 and 50 characters long and not contain any of the following characters: \\u0000, \\u0085, \\u2028, \\u2029, \\r, or \\n');
    });

    test.each([
      '1'.repeat(8),
      'a'.repeat(8),
      'adminadmin',
    ])('throw error for invalid fsx admin password \'%s\'', (fsxAdminPassword) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        fsxAdminPassword,
        preferredSubnet: vpc.privateSubnets[0],
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'fsxAdminPassword\' must contain at least one English letter and one number, and must not contain the word \'admin\'');
    });
  });

  describe('subnet settings', () => {
    test.each([
      fsx.OntapDeploymentType.SINGLE_AZ_2,
      fsx.OntapDeploymentType.SINGLE_AZ_1,
    ])('throw error for specifying preferred subnet for %s file system', (deploymentType) => {
      ontapConfiguration = {
        deploymentType,
        preferredSubnet: vpc.privateSubnets[0],
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'preferredSubnet\' can only be specified for multi-AZ file systems');
    });

    test.each([
      fsx.OntapDeploymentType.MULTI_AZ_2,
      fsx.OntapDeploymentType.MULTI_AZ_1,
    ])('throw error for not specifying preferred subnet for %s file systems', (deploymentType) => {
      ontapConfiguration = {
        deploymentType,
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'preferredSubnet\' must be specified for multi-AZ file systems');
    });

    test('throw error for specifying preferred subnet that is not in the VPC subnets', () => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        preferredSubnet: vpc.publicSubnets[0],
        endpointIpAddressRange: '192.168.39.0/24',
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'preferredSubnet\' must be one of the specified \'vpcSubnets\'');
    });
  });

  test.each([
    fsx.OntapDeploymentType.SINGLE_AZ_2,
    fsx.OntapDeploymentType.SINGLE_AZ_1,
  ])('throw error for specifying route tables for %s file system', (deploymentType) => {
    ontapConfiguration = {
      deploymentType,
      routeTables: vpc.privateSubnets.map((subnet) => subnet.routeTable),
    };

    expect(() => {
      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: 1200,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });
    }).toThrow('\'routeTables\' can only be specified for multi-AZ file systems');
  });

  test.each([
    {
      storageCapacityGiB: 1023,
      haPairs: 1,
    },
    {
      storageCapacityGiB: 524_289,
      haPairs: 1,
    },
    {
      storageCapacityGiB: 1200.1,
      haPairs: 1,
    },
    {
      storageCapacityGiB: 5119,
      haPairs: 5,
    },
    {
      storageCapacityGiB: 1_048_577,
      haPairs: 5,
    },
  ])('throw error for invalid storage capacity %s', (config) => {
    ontapConfiguration = {
      deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
      haPairs: config.haPairs,
    };

    expect(() => {
      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: config.storageCapacityGiB,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });
    }).toThrow(`storageCapacityGiB must be an integer between ${1024 * config.haPairs} and ${Math.min(1_048_576, 524_288 * config.haPairs)}, got ${config.storageCapacityGiB}`);
  });

  describe('throughput capacity', () => {
    test('throw error for specifying both throughputCapacity and throughputCapacityPerHaPair', () => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
        throughputCapacity: 1536,
        throughputCapacityPerHaPair: 1536,
        haPairs: 2,
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow('\'throughputCapacity\' and \'throughputCapacityPerHaPair\' cannot be specified at the same time');
    });

    const validValues: { [key in fsx.OntapDeploymentType]: number[] } = {
      SINGLE_AZ_1: [128, 256, 512, 1024, 2048, 4096],
      MULTI_AZ_1: [128, 256, 512, 1024, 2048, 4096],
      SINGLE_AZ_2: [1536, 3072, 6144],
      MULTI_AZ_2: [384, 768, 1536, 3072, 6144],
    };

    const testCases = Object
      .entries(validValues)
      .flatMap(([deploymentType, throughputs]) => throughputs.map(throughput => (
        { deploymentType: deploymentType as fsx.OntapDeploymentType, throughput }
      )));

    test.each(testCases)('valid throughput capacity for %s', (config) => {
      ontapConfiguration = {
        deploymentType: config.deploymentType,
        throughputCapacity: config.throughput,
        haPairs: 1,
      };

      if (
        config.deploymentType === fsx.OntapDeploymentType.MULTI_AZ_2 ||
        config.deploymentType === fsx.OntapDeploymentType.MULTI_AZ_1
      ) {
        ontapConfiguration = {
          ...ontapConfiguration,
          preferredSubnet: vpc.privateSubnets[0],
          endpointIpAddressRange: '192.168.12.0/24',
        };
      }

      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: 1200,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          DeploymentType: config.deploymentType,
          ThroughputCapacity: config.throughput,
          HAPairs: 1,
        },
      });
    });

    test.each(testCases)('valid throughput capacity per HA pair for %s', (config) => {
      ontapConfiguration = {
        deploymentType: config.deploymentType,
        throughputCapacityPerHaPair: config.throughput,
        haPairs: 1,
      };

      if ([fsx.OntapDeploymentType.MULTI_AZ_1, fsx.OntapDeploymentType.MULTI_AZ_2].includes(config.deploymentType)) {
        ontapConfiguration = {
          ...ontapConfiguration,
          preferredSubnet: vpc.privateSubnets[0],
          endpointIpAddressRange: '192.168.39.0/24',
        };
      };

      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: 1200,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          DeploymentType: config.deploymentType,
          ThroughputCapacityPerHAPair: config.throughput,
          HAPairs: 1,
        },
      });
    });

    test.each([
      {
        throughput: 3072,
        haPairs: 2,
      },
      {
        throughput: 6144,
        haPairs: 2,
      },
      {
        throughput: 6144,
        haPairs: 4,
      },
    ])('valid throughput capacity with multiple HA pairs for %s', (config) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
        throughputCapacity: config.throughput,
        haPairs: config.haPairs,
      };

      new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
        ontapConfiguration,
        storageCapacityGiB: 5120,
        vpc,
        vpcSubnets: vpc.privateSubnets,
      });

      Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
        OntapConfiguration: {
          DeploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
          ThroughputCapacity: config.throughput,
          HAPairs: config.haPairs,
        },
      });
    });

    test.each([
      {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
        throughput: 384,
      },
      {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
        throughput: 128,
      },
      {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_1,
        throughput: 384,
      },
      {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        throughput: 128,
      },
    ])('throw error for specifying invalid throughput capacity %s', (config) => {
      ontapConfiguration = {
        deploymentType: config.deploymentType,
        throughputCapacity: config.throughput,
        haPairs: 1,
      };

      if ([fsx.OntapDeploymentType.MULTI_AZ_1, fsx.OntapDeploymentType.MULTI_AZ_2].includes(config.deploymentType)) {
        ontapConfiguration = {
          ...ontapConfiguration,
          preferredSubnet: vpc.privateSubnets[0],
          endpointIpAddressRange: '192.168.39.0/24',
        };
      }

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 1200,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow(`'throughputCapacityPerHaPair' and 'throughputCapacity' / haPairs must be one of the following values for ${config.deploymentType}: ${validValues[config.deploymentType].join(', ')}`);
    });

    test.each([
      {
        throughput: 1536,
        haPairs: 2,
      },
      {
        throughput: 3072,
        haPairs: 3,
      },
      {
        throughput: 6144,
        haPairs: 5,
      },
    ])('throw error for specifying invalid throughput capacity with multiple HA pairs %s', (config) => {
      ontapConfiguration = {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_2,
        throughputCapacity: config.throughput,
        haPairs: config.haPairs,
      };

      expect(() => {
        new fsx.OntapFileSystem(stack, 'FsxFileSystem', {
          ontapConfiguration,
          storageCapacityGiB: 5120,
          vpc,
          vpcSubnets: vpc.privateSubnets,
        });
      }).toThrow(`'throughputCapacityPerHaPair' and 'throughputCapacity' / haPairs must be one of the following values for SINGLE_AZ_2: ${validValues[fsx.OntapDeploymentType.SINGLE_AZ_2].join(', ')}`);
    });
  });
});