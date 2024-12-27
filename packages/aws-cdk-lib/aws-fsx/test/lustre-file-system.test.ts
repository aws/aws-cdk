import { strictEqual } from 'assert';
import { Template } from '../../assertions';
import { ISubnet, Port, SecurityGroup, Subnet, Vpc } from '../../aws-ec2';
import { Key } from '../../aws-kms';
import { Aws, Duration, Stack, Token } from '../../core';
import {
  LustreConfiguration,
  LustreDeploymentType,
  LustreAutoImportPolicy,
  LustreFileSystem,
  LustreMaintenanceTime,
  Weekday,
  LustreDataCompressionType,
  DailyAutomaticBackupStartTime,
  FileSystemTypeVersion,
  StorageType,
  DriveCacheType,
} from '../lib';

describe('FSx for Lustre File System', () => {
  let lustreConfiguration: LustreConfiguration;
  let stack: Stack;
  let storageCapacity: number;
  let vpcSubnet: ISubnet;
  let vpc: Vpc;

  beforeEach(() => {
    stack = new Stack();
    storageCapacity = 1200;
    vpc = new Vpc(stack, 'VPC');
    vpcSubnet = new Subnet(stack, 'Subnet', {
      availabilityZone: 'us-west-2',
      cidrBlock: vpc.vpcCidrBlock,
      vpcId: vpc.vpcId,
    });
  });

  test('default file system is created correctly', () => {
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.SCRATCH_2,
    };

    const fileSystem = new LustreFileSystem(stack, 'FsxFileSystem', {
      lustreConfiguration,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
    });

    Template.fromStack(stack).hasResource('AWS::FSx::FileSystem', {});
    Template.fromStack(stack).hasResource('AWS::EC2::SecurityGroup', {});
    strictEqual(
      fileSystem.dnsName,
      `${fileSystem.fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`);

    Template.fromStack(stack).hasResource('AWS::FSx::FileSystem', {
      DeletionPolicy: 'Retain',
    });
  });

  test('file system is created correctly when security group is provided', () => {
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.SCRATCH_2,
    };

    const securityGroup = new SecurityGroup(stack, 'FsxLustreSecurityGroup', {
      vpc,
    });

    new LustreFileSystem(stack, 'FsxFileSystem', {
      lustreConfiguration,
      securityGroup,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
    });

    Template.fromStack(stack).hasResource('AWS::FSx::FileSystem', {});
    Template.fromStack(stack).hasResource('AWS::EC2::SecurityGroup', {});
  });

  test('encrypted file system is created correctly with custom KMS', () => {
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.SCRATCH_2,
    };

    const key = new Key(stack, 'customKeyFS');

    new LustreFileSystem(stack, 'FsxFileSystem', {
      kmsKey: key,
      lustreConfiguration,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
    });

    /**
     * CDK appends 8-digit MD5 hash of the resource path to the logical Id of the resource in order to make sure
     * that the id is unique across multiple stacks. There isnt a direct way to identify the exact name of the resource
     * in generated CDK, hence hardcoding the MD5 hash here for assertion. Assumption is that the path of the Key wont
     * change in this UT. Checked the unique id by generating the cloud formation stack.
     */
    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      KmsKeyId: {
        Ref: 'customKeyFSDDB87C6D',
      },
    });
  });

  test('file system is created correctly when weekly maintenance time is provided', () => {
    const maintenanceTime = new LustreMaintenanceTime({
      day: Weekday.SUNDAY,
      hour: 12,
      minute: 34,
    });
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.SCRATCH_2,
      weeklyMaintenanceStartTime: maintenanceTime,
    };

    const securityGroup = new SecurityGroup(stack, 'FsxLustreSecurityGroup', {
      vpc,
    });

    new LustreFileSystem(stack, 'FsxFileSystem', {
      lustreConfiguration,
      securityGroup,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      LustreConfiguration: {
        DeploymentType: 'SCRATCH_2',
        WeeklyMaintenanceStartTime: '7:12:34',
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {});
  });

  test.each([
    FileSystemTypeVersion.V_2_10,
    FileSystemTypeVersion.V_2_12,
    FileSystemTypeVersion.V_2_15,
  ])('file system is created correctly with fileSystemTypeVersion %s', (fileSystemTypeVersion: FileSystemTypeVersion) => {
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.SCRATCH_2,
    };

    new LustreFileSystem(stack, 'FsxFileSystem', {
      lustreConfiguration,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
      fileSystemTypeVersion,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      FileSystemTypeVersion: fileSystemTypeVersion,
    });
  });

  describe('when validating props', () => {
    describe('fileSystemTypeVersion', () => {
      test('throw error when fileSystemTypeVersion 2.10 is used with PERSISTENT_2 deployment type', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_2,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
            fileSystemTypeVersion: FileSystemTypeVersion.V_2_10,
          });
        }).toThrow('fileSystemTypeVersion V_2_10 is only supported for SCRATCH and PERSISTENT_1 deployment types');
      });
    });

    describe('exportPath', () => {
      test('export path valid', () => {
        const importPath = 's3://import-bucket';
        const exportPath = `${importPath}/export-prefix`;
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
          importPath,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_2,
            ExportPath: exportPath,
            ImportPath: importPath,
          },
        });
      });

      test('export and import paths are Tokens', () => {
        const importPathResolved = 'importPath';
        const exportPathResolved = 'exportPath';
        const importPath = Token.asString(Token.asAny(importPathResolved));
        const exportPath = Token.asString(Token.asAny(exportPathResolved));
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
          importPath,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_2,
            ExportPath: exportPathResolved,
            ImportPath: importPathResolved,
          },
        });
      });

      test('only export path is Token', () => {
        const exportPathResolved = 'exportPath';
        const importPath = 's3://import-bucket';
        const exportPath = Token.asString(Token.asAny(exportPathResolved));
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('The importPath and exportPath must each be Tokens or not Tokens, you cannot use a mix');
      });

      test('only import path is Token', () => {
        const importPathResolved = 'importPath';
        const importPath = Token.asString(Token.asAny(importPathResolved));
        const exportPath = 's3://import-bucket/export';
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('The importPath and exportPath must each be Tokens or not Tokens, you cannot use a mix');
      });

      test('invalid export path length', () => {
        const importPath = 's3://import-bucket';
        const path = Array(902).join('x');
        const exportPath = `${importPath}/${path}`;

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow(`The export path "${exportPath}" exceeds the maximum length of 900 characters`);
      });

      test('export path does not start with import path', () => {
        const importPath = 's3://import-bucket';
        const exportPath = 's3://wrong-bucket';

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow(`The export path "${exportPath}" is invalid. Expecting the format: s3://{IMPORT_PATH}/optional-prefix`);
      });

      test('export path with no import path', () => {
        const exportPath = 's://import-bucket/export-prefix';

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          exportPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('Cannot define an export path without also defining an import path');
      });
    });

    describe('autoImportPolicy', () => {
      test('autoImportPath unsupported with PERSISTENT_2', () => {
        const importPath = 's3://import-bucket/import-prefix';

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_2,
          autoImportPolicy: LustreAutoImportPolicy.NEW_CHANGED_DELETED,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFilesystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('autoImportPolicy is not supported with PERSISTENT_2 deployments');
      });

      test('autoImportPath requires importPath', () => {

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          autoImportPolicy: LustreAutoImportPolicy.NEW_CHANGED_DELETED,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFilesystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('autoImportPolicy requires importPath to be defined');
      });
    });

    describe('autoImportPolicy', () => {
      test.each([
        LustreAutoImportPolicy.NONE,
        LustreAutoImportPolicy.NEW,
        LustreAutoImportPolicy.NEW_CHANGED,
        LustreAutoImportPolicy.NEW_CHANGED_DELETED,
      ])('valid autoImportPolicy', (autoImportPolicy: LustreAutoImportPolicy) => {
        const importPath = 's3://import-bucket/import-path';

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          importPath,
          autoImportPolicy,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            AutoImportPolicy: autoImportPolicy,
            DeploymentType: LustreDeploymentType.PERSISTENT_1,
          },
        });
      });
    });

    describe('importedFileChunkSize', () => {
      test.each([
        1,
        256000,
        512000,
      ])('valid file chunk size of %d', (size: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          importedFileChunkSizeMiB: size,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_2,
            ImportedFileChunkSize: size,
          },
        });
      });

      test.each([
        0,
        512001,
      ])('invalid file chunk size of %d', (size: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          importedFileChunkSizeMiB: size,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow(`importedFileChunkSize cannot be ${size} MiB. It must be a value from 1 to 512,000 MiB`);
      });
    });

    describe('importPath', () => {
      test('import path valid', () => {
        const importPath = 's3://import-bucket';
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          importPath,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_2,
            ImportPath: importPath,
          },
        });
      });

      test('import path is Token', () => {
        const importPathResolved = 'importPath';
        const importPath = Token.asString(Token.asAny(importPathResolved));
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          importPath,
        };
        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_2,
            ImportPath: importPathResolved,
          },
        });
      });

      test('invalid import path format', () => {
        const importPath = 'import-bucket';

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow(`The import path "${importPath}" is invalid. Expecting the format: s3://{BUCKET_NAME}/optional-prefix`);
      });

      test('invalid import path length', () => {
        const path = Array(902).join('x');
        const importPath = `s3://${path}`;

        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          importPath,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow(`The import path "${importPath}" exceeds the maximum length of 900 characters`);
      });
    });

    describe('DataCompressionType', () => {
      test('dataCompressionType enabled', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          dataCompressionType: LustreDataCompressionType.LZ4,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_2,
            DataCompressionType: LustreDataCompressionType.LZ4,
          },
        });
      });
    });

    describe('perUnitStorageThroughput_PERSISTENT_1', () => {
      test.each([
        50,
        100,
        200,
      ])('valid perUnitStorageThroughput of %d for SSD storage', (throughput: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: throughput,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.PERSISTENT_1,
            PerUnitStorageThroughput: throughput,
          },
        });
      });

      test.each([
        1,
        125,
        250,
        500,
        1000,
      ])('invalid perUnitStorageThroughput for SSD storage', (invalidValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: invalidValue,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('perUnitStorageThroughput must be 50, 100, or 200 MB/s/TiB for PERSISTENT_1 SSD storage, got: ' + invalidValue);
      });

      test.each([12, 40])('valid perUnitStorageThroughput of %d for HDD storage', (validValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: validValue,
        };
        storageCapacity = 18000;

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
          storageType: StorageType.HDD,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.PERSISTENT_1,
            PerUnitStorageThroughput: validValue,
          },
          StorageType: StorageType.HDD,
        });
      });

      test.each([1, 50, 100, 125, 200, 250, 500, 1000])('invalid perUnitStorageThroughput of %d for HDD storage', (invalidValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: invalidValue,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
            storageType: StorageType.HDD,
          });
        }).toThrow('perUnitStorageThroughput must be 12 or 40 MB/s/TiB for PERSISTENT_1 HDD storage, got: ' + invalidValue);
      });

      test('setting perUnitStorageThroughput on wrong deploymentType', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_2,
          perUnitStorageThroughput: 50,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('perUnitStorageThroughput can only be set for the PERSISTENT_1/PERSISTENT_2 deployment types');
      });
    });

    describe('perUnitStorageThroughput_Persistent_2', () => {
      test.each([
        125,
        250,
        500,
        1000,
      ])('valid perUnitStorageThroughput of %d', (throughput: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_2,
          perUnitStorageThroughput: throughput,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.PERSISTENT_2,
            PerUnitStorageThroughput: throughput,
          },
        });
      });

      test.each([
        1,
        50,
        100,
        200,
        550,
      ])('invalid perUnitStorageThroughput', (invalidValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_2,
          perUnitStorageThroughput: invalidValue,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('perUnitStorageThroughput must be 125, 250, 500 or 1000 MB/s/TiB for PERSISTENT_2 deployment type, got: ' + invalidValue);
      });
    });

    describe('storageCapacity', () => {
      test.each([
        [1200, LustreDeploymentType.SCRATCH_2],
        [2400, LustreDeploymentType.SCRATCH_2],
        [4800, LustreDeploymentType.SCRATCH_2],
        [1200, LustreDeploymentType.PERSISTENT_1],
        [2400, LustreDeploymentType.PERSISTENT_1],
        [4800, LustreDeploymentType.PERSISTENT_1],
        [1200, LustreDeploymentType.PERSISTENT_2],
        [2400, LustreDeploymentType.PERSISTENT_2],
        [4800, LustreDeploymentType.PERSISTENT_2],
      ])('proper multiple for storage capacity of %d on %s', (value: number, deploymentType: LustreDeploymentType) => {
        lustreConfiguration = {
          deploymentType,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: value,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: deploymentType,
          },
          StorageCapacity: value,
        });
      });

      test.each([
        [1, LustreDeploymentType.SCRATCH_2],
        [2401, LustreDeploymentType.SCRATCH_2],
        [1, LustreDeploymentType.PERSISTENT_1],
        [2401, LustreDeploymentType.PERSISTENT_1],
        [1, LustreDeploymentType.PERSISTENT_2],
        [2401, LustreDeploymentType.PERSISTENT_2],
      ])('invalid value of %d for storage capacity on %s', (invalidValue: number, deploymentType: LustreDeploymentType) => {
        lustreConfiguration = {
          deploymentType,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: invalidValue,
            vpc,
            vpcSubnet,
          });
        }).toThrow(/storageCapacity must be 1,200, 2,400, or a multiple of 2,400/);
      });

      test.each([1200, 2400, 3600, 7200])('proper multiple for storage capacity using %d with SCRATCH_1', (validValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_1,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: validValue,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.SCRATCH_1,
          },
          StorageCapacity: validValue,
        });
      });

      test.each([1, 3601])('invalid value of %d for storage capacity with SCRATCH_1', (invalidValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_1,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: invalidValue,
            vpc,
            vpcSubnet,
          });
        }).toThrow(/storageCapacity must be 1,200, 2,400, 3,600, or a multiple of 3,600/);
      });

      test.each([
        [6000, 12],
        [12000, 12],
        [1800, 40],
        [3600, 40],
      ])('proper multiple for storage capacity using %d with PERSISTENT_1 HDD', (validValue: number, throughput: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: throughput,
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: validValue,
          vpc,
          vpcSubnet,
          storageType: StorageType.HDD,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.PERSISTENT_1,
            PerUnitStorageThroughput: throughput,
          },
          StorageCapacity: validValue,
          StorageType: StorageType.HDD,
        });
      });

      test.each([1, 6001])('invalid value of %d for storage capacity with PERSISTENT_1 HDD with 12 MB/s/TiB throughput', (invalidValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: 12,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: invalidValue,
            vpc,
            vpcSubnet,
            storageType: StorageType.HDD,
          });
        }).toThrow('storageCapacity must be a multiple of 6,000 for PERSISTENT_1 HDD storage with 12 MB/s/TiB throughput');
      });

      test.each([1, 1801])('invalid value of %d for storage capacity with PERSISTENT_1 HDD with 40 MB/s/TiB throughput', (invalidValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          perUnitStorageThroughput: 40,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: invalidValue,
            vpc,
            vpcSubnet,
            storageType: StorageType.HDD,
          });
        }).toThrow('storageCapacity must be a multiple of 1,800 for PERSISTENT_1 HDD storage with 40 MB/s/TiB throughput');
      });
    });

    describe('automaticBackupRetention', () => {
      test.each([0, 10, 90])('valid value for automaticBackupRetention using %d', (validValue: number) => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          automaticBackupRetention: Duration.days(validValue),
        };

        new LustreFileSystem(stack, 'FsxFileSystem', {
          lustreConfiguration,
          storageCapacityGiB: storageCapacity,
          vpc,
          vpcSubnet,
        });

        Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
          LustreConfiguration: {
            DeploymentType: LustreDeploymentType.PERSISTENT_1,
            AutomaticBackupRetentionDays: validValue,
          },
        });
      });

      test('Scratch file system with a non-zero day automaticBackupRetention throws error', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.SCRATCH_1,
          automaticBackupRetention: Duration.days(3),
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('automatic backups is not supported on scratch file systems');
      });

      test('automaticBackupRetention over 90 days throws error', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          automaticBackupRetention: Duration.days(100),
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('automaticBackupRetention period must be between 0 and 90 days. received: 100');
      });
    });

    describe('dailyAutomaticBackupStartTime', () => {
      test('dailyAutomaticBackupStartTime without an automaticBackupRetention setting throws error', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          dailyAutomaticBackupStartTime: new DailyAutomaticBackupStartTime({ hour: 10, minute: 0 }),
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('automaticBackupRetention period must be set a non-zero day when dailyAutomaticBackupStartTime is set');
      });

      test('dailyAutomaticBackupStartTime with automaticBackupRetention 0 day throws error', () => {
        lustreConfiguration = {
          deploymentType: LustreDeploymentType.PERSISTENT_1,
          automaticBackupRetention: Duration.days(0),
          dailyAutomaticBackupStartTime: new DailyAutomaticBackupStartTime({ hour: 10, minute: 0 }),
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
          });
        }).toThrow('automaticBackupRetention period must be set a non-zero day when dailyAutomaticBackupStartTime is set');
      });

      test.each([
        LustreDeploymentType.PERSISTENT_2,
        LustreDeploymentType.SCRATCH_1,
        LustreDeploymentType.SCRATCH_2,
      ])('HDD storage type is not supported for %s', (deploymentType: LustreDeploymentType) => {
        lustreConfiguration = {
          deploymentType,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
            storageType: StorageType.HDD,
          });
        }).toThrow(`Storage type HDD is only supported for PERSISTENT_1 deployment type, got: ${deploymentType}`);
      });

      test.each([{
        deploymentType: LustreDeploymentType.PERSISTENT_1,
        storageType: StorageType.SSD,
        driveCacheType: DriveCacheType.READ,
      },
      {
        deploymentType: LustreDeploymentType.PERSISTENT_1,
        storageType: StorageType.SSD,
        driveCacheType: DriveCacheType.NONE,
      },
      {
        deploymentType: LustreDeploymentType.PERSISTENT_2,
        storageType: StorageType.SSD,
        driveCacheType: DriveCacheType.READ,
      },
      {
        deploymentType: LustreDeploymentType.PERSISTENT_2,
        storageType: StorageType.SSD,
        driveCacheType: DriveCacheType.NONE,
      }])('throw error for invalid drive cache type', (props) => {
        lustreConfiguration = {
          deploymentType: props.deploymentType,
          driveCacheType: props.driveCacheType,
        };

        expect(() => {
          new LustreFileSystem(stack, 'FsxFileSystem', {
            lustreConfiguration,
            storageCapacityGiB: storageCapacity,
            vpc,
            vpcSubnet,
            storageType: props.storageType,
          });
        }).toThrow(`driveCacheType can only be set for PERSISTENT_1 HDD storage type, got: ${props.deploymentType} and ${props.storageType}`);
      });
    });
  });

  test.each([StorageType.SSD, StorageType.HDD])('specify storage type %s', (storageType: StorageType) => {
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.PERSISTENT_1,
    };

    new LustreFileSystem(stack, 'FsxFileSystem', {
      lustreConfiguration,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
      storageType,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      LustreConfiguration: {
        DeploymentType: LustreDeploymentType.PERSISTENT_1,
        ...( storageType === StorageType.HDD ? { DriveCacheType: 'NONE' } : undefined ),
      },
      StorageType: storageType,
    });
  });

  test('existing file system is imported correctly', () => {
    const fileSystemId = 'fs123';
    const fs = LustreFileSystem.fromLustreFileSystemAttributes(stack, 'existingFS', {
      dnsName: `${fileSystemId}.fsx.${stack.region}.${Aws.URL_SUFFIX}`,
      fileSystemId,
      securityGroup: SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-123456789', {
        allowAllOutbound: false,
      }),
    });

    fs.connections.allowToAnyIpv4(Port.tcp(443));

    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'sg-123456789',
    });
  });

  test.each([true, false])('copyTagsToBackups using %s', (copyTagsToBackups: boolean) => {
    lustreConfiguration = {
      deploymentType: LustreDeploymentType.PERSISTENT_1,
      copyTagsToBackups,
    };

    new LustreFileSystem(stack, 'FsxFileSystem', {
      lustreConfiguration,
      storageCapacityGiB: storageCapacity,
      vpc,
      vpcSubnet,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::FileSystem', {
      LustreConfiguration: {
        DeploymentType: LustreDeploymentType.PERSISTENT_1,
        CopyTagsToBackups: copyTagsToBackups,
      },
    });
  });
});
