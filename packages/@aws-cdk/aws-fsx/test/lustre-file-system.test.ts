import { strictEqual } from 'assert';
import { Template } from '@aws-cdk/assertions';
import { ISubnet, Port, SecurityGroup, Subnet, Vpc } from '@aws-cdk/aws-ec2';
import { Key } from '@aws-cdk/aws-kms';
import { Aws, Stack, Token } from '@aws-cdk/core';
import { LustreConfiguration, LustreDeploymentType, LustreAutoImportPolicy, LustreFileSystem, LustreMaintenanceTime, Weekday, LustreDataCompressionType } from '../lib';

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

  describe('when validating props', () => {
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
        }).toThrowError('The importPath and exportPath must each be Tokens or not Tokens, you cannot use a mix');
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
        }).toThrowError('The importPath and exportPath must each be Tokens or not Tokens, you cannot use a mix');
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
        }).toThrowError(`The export path "${exportPath}" exceeds the maximum length of 900 characters`);
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
        }).toThrowError(`The export path "${exportPath}" is invalid. Expecting the format: s3://{IMPORT_PATH}/optional-prefix`);
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
        }).toThrowError('Cannot define an export path without also defining an import path');
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
        }).toThrowError('autoImportPolicy is not supported with PERSISTENT_2 deployments');
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
        }).toThrowError('autoImportPolicy requires importPath to be defined');
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
        }).toThrowError(`importedFileChunkSize cannot be ${size} MiB. It must be a value from 1 to 512,000 MiB`);
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
        }).toThrowError(`The import path "${importPath}" is invalid. Expecting the format: s3://{BUCKET_NAME}/optional-prefix`);
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
        }).toThrowError(`The import path "${importPath}" exceeds the maximum length of 900 characters`);
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

    describe('perUnitStorageThroughput', () => {
      test.each([
        50,
        100,
        200,
      ])('valid perUnitStorageThroughput of %d', (throughput: number) => {
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
      ])('invalid perUnitStorageThroughput', (invalidValue: number) => {
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
        }).toThrowError('perUnitStorageThroughput must be 50, 100, or 200 MB/s/TiB for PERSISTENT_1 deployment type, got: ' + invalidValue);
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
        }).toThrowError('perUnitStorageThroughput can only be set for the PERSISTENT_1/PERSISTENT_2 deployment types');
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
        }).toThrowError('perUnitStorageThroughput must be 125, 250, 500 or 1000 MB/s/TiB for PERSISTENT_2 deployment type, got: ' + invalidValue);
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
        }).toThrowError(/storageCapacity must be 1,200, 2,400, or a multiple of 2,400/);
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
        }).toThrowError(/storageCapacity must be 1,200, 2,400, 3,600, or a multiple of 3,600/);
      });
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
});