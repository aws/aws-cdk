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
      prefferredSubnet: vpc.privateSubnets[0],
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
      prefferredSubnet: vpc.privateSubnets[0],
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
    test.each([0.1, -1, 0, 13])('throw error for invalid HA pairs', (haPairs) => {
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
      {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_2,
        haPairs: 2,
      },
      {
        deploymentType: fsx.OntapDeploymentType.MULTI_AZ_1,
        haPairs: 2,
      },
      {
        deploymentType: fsx.OntapDeploymentType.SINGLE_AZ_1,
        haPairs: 2,
      },
    ])('throw error for specification of multiple HA pairs except for SINGLE_AZ_1 deployment type', (config) => {
      const multiAzConfig = {
        preferredSubnet: vpc.privateSubnets[0],
        endpointIpAddressRange: '192.168.12.0/24',
      };

      ontapConfiguration = config;
      if ([fsx.OntapDeploymentType.MULTI_AZ_1, fsx.OntapDeploymentType.MULTI_AZ_2].includes(config.deploymentType)) {
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
      }).toThrow(`\'haPairs\' must be 1 for deployment type ${config.deploymentType}`);
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
    ])('throw error for invalid automatic backup retention days', (duration) => {
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
  }])('throw error for invalid disk IOPS configuration', (config) => {
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
});