import { Template } from '../../assertions';
import { Bucket } from '../../aws-s3';
import { Stack } from '../../core';
import { Subnet, Vpc } from '../../aws-ec2';
import {
  DataRepositoryAssociation,
  DataRepositoryEventType,
  FileSystemTypeVersion,
  LustreDeploymentType,
  LustreFileSystem,
} from '../lib';

describe('DataRepositoryAssociation', () => {
  let stack: Stack;
  let vpc: Vpc;
  let fileSystem: LustreFileSystem;
  let bucket: Bucket;

  beforeEach(() => {
    stack = new Stack();
    vpc = new Vpc(stack, 'VPC');
    const vpcSubnet = new Subnet(stack, 'Subnet', {
      availabilityZone: 'us-east-1a',
      cidrBlock: vpc.vpcCidrBlock,
      vpcId: vpc.vpcId,
    });
    fileSystem = new LustreFileSystem(stack, 'FileSystem', {
      lustreConfiguration: {
        deploymentType: LustreDeploymentType.SCRATCH_2,
      },
      storageCapacityGiB: 1200,
      vpc,
      vpcSubnet,
      fileSystemTypeVersion: FileSystemTypeVersion.V_2_15,
    });
    bucket = new Bucket(stack, 'Bucket');
  });

  test('creates a DataRepositoryAssociation with required props', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::DataRepositoryAssociation', {
      FileSystemId: { Ref: 'FileSystem8A8E25C0' },
      FileSystemPath: '/data',
    });
  });

  test('sets dataRepositoryPath to bucket root when no prefix is provided', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::DataRepositoryAssociation', {
      DataRepositoryPath: {
        'Fn::Join': ['', ['s3://', { Ref: 'Bucket83908E77' }, '/']],
      },
    });
  });

  test('sets dataRepositoryPath with bucketPrefix', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
      bucketPrefix: 'primary',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::DataRepositoryAssociation', {
      DataRepositoryPath: {
        'Fn::Join': ['', ['s3://', { Ref: 'Bucket83908E77' }, '/primary']],
      },
    });
  });

  test('strips leading slash from bucketPrefix', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
      bucketPrefix: '/primary/',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::DataRepositoryAssociation', {
      DataRepositoryPath: {
        'Fn::Join': ['', ['s3://', { Ref: 'Bucket83908E77' }, '/primary/']],
      },
    });
  });

  test('sets importedFileChunkSizeMiB and batchImportMetaDataOnCreate', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
      importedFileChunkSizeMiB: 2048,
      batchImportMetaDataOnCreate: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::DataRepositoryAssociation', {
      ImportedFileChunkSize: 2048,
      BatchImportMetaDataOnCreate: true,
    });
  });

  test('sets auto import and export policies', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
      s3: {
        autoImportPolicy: { events: [DataRepositoryEventType.NEW, DataRepositoryEventType.CHANGED] },
        autoExportPolicy: { events: [DataRepositoryEventType.NEW, DataRepositoryEventType.CHANGED, DataRepositoryEventType.DELETED] },
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::FSx::DataRepositoryAssociation', {
      S3: {
        AutoImportPolicy: { Events: ['NEW', 'CHANGED'] },
        AutoExportPolicy: { Events: ['NEW', 'CHANGED', 'DELETED'] },
      },
    });
  });

  test('grants fsx.amazonaws.com read-write access to the bucket via bucket policy', () => {
    new DataRepositoryAssociation(stack, 'DRA', {
      fileSystem,
      fileSystemPath: '/data',
      bucket,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: {
        Statement: [
          {
            Principal: { Service: 'fsx.amazonaws.com' },
          },
        ],
      },
    });
  });

  describe('validation', () => {
    test('throws when fileSystemPath does not start with /', () => {
      expect(() => {
        new DataRepositoryAssociation(stack, 'DRA', {
          fileSystem,
          fileSystemPath: 'data',
          bucket,
        });
      }).toThrow(/fileSystemPath must begin with "\/"/);
    });

    test('throws when importedFileChunkSizeMiB is below 1', () => {
      expect(() => {
        new DataRepositoryAssociation(stack, 'DRA', {
          fileSystem,
          fileSystemPath: '/data',
          bucket,
          importedFileChunkSizeMiB: 0,
        });
      }).toThrow(/importedFileChunkSizeMiB must be between 1 and 512,000/);
    });

    test('throws when importedFileChunkSizeMiB exceeds 512000', () => {
      expect(() => {
        new DataRepositoryAssociation(stack, 'DRA', {
          fileSystem,
          fileSystemPath: '/data',
          bucket,
          importedFileChunkSizeMiB: 512001,
        });
      }).toThrow(/importedFileChunkSizeMiB must be between 1 and 512,000/);
    });

    test('throws when autoImportPolicy.events is empty', () => {
      expect(() => {
        new DataRepositoryAssociation(stack, 'DRA', {
          fileSystem,
          fileSystemPath: '/data',
          bucket,
          s3: {
            autoImportPolicy: { events: [] },
          },
        });
      }).toThrow(/autoImportPolicy.events must contain at least one event type/);
    });

    test('throws when autoExportPolicy.events is empty', () => {
      expect(() => {
        new DataRepositoryAssociation(stack, 'DRA', {
          fileSystem,
          fileSystemPath: '/data',
          bucket,
          s3: {
            autoExportPolicy: { events: [] },
          },
        });
      }).toThrow(/autoExportPolicy.events must contain at least one event type/);
    });
  });
});
