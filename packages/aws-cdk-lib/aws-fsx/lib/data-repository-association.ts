import type { Construct } from 'constructs';
import type { IFileSystem } from './file-system';
import { CfnDataRepositoryAssociation } from './fsx.generated';

import { ServicePrincipal } from '../../aws-iam';
import type { IBucket } from '../../aws-s3';
import { RemovalPolicy, Resource, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Event types that trigger automatic import or export for a DataRepositoryAssociation.
 */
export enum DataRepositoryEventType {
  /**
   * New files or directories added to the S3 bucket / file system.
   */
  NEW = 'NEW',

  /**
   * Files or directories changed in the S3 bucket / file system.
   */
  CHANGED = 'CHANGED',

  /**
   * Files or directories deleted in the S3 bucket / file system.
   */
  DELETED = 'DELETED',
}

/**
 * Automatic import policy: which S3 events trigger import into the Lustre file system.
 */
export interface S3AutoImportPolicy {
  /**
   * The S3 events that will trigger an automatic import into the file system.
   */
  readonly events: DataRepositoryEventType[];
}

/**
 * Automatic export policy: which file system events trigger export to S3.
 */
export interface S3AutoExportPolicy {
  /**
   * The file system events that will trigger an automatic export to S3.
   */
  readonly events: DataRepositoryEventType[];
}

/**
 * S3 data repository configuration for a DataRepositoryAssociation.
 */
export interface S3DataRepositoryConfiguration {
  /**
   * Defines which S3 events automatically import new file metadata into the Lustre file system.
   *
   * @default - no automatic import
   */
  readonly autoImportPolicy?: S3AutoImportPolicy;

  /**
   * Defines which file system events automatically export changed file metadata to S3.
   *
   * @default - no automatic export
   */
  readonly autoExportPolicy?: S3AutoExportPolicy;
}

/**
 * Properties for a DataRepositoryAssociation.
 */
export interface DataRepositoryAssociationProps {
  /**
   * The Lustre file system to associate with the S3 data repository.
   */
  readonly fileSystem: IFileSystem;

  /**
   * The path on the Lustre file system to associate with the data repository.
   * Must begin with `/` and be unique within the file system.
   *
   * Example: `/data`
   */
  readonly fileSystemPath: string;

  /**
   * The S3 bucket to use as the data repository.
   */
  readonly bucket: IBucket;

  /**
   * The prefix within the S3 bucket to associate with the file system path.
   *
   * @default - the root of the bucket (`s3://<bucket-name>/`)
   */
  readonly bucketPrefix?: string;

  /**
   * S3 auto-import and auto-export policies for this association.
   *
   * @default - no automatic import or export
   */
  readonly s3?: S3DataRepositoryConfiguration;

  /**
   * For files imported from S3, the stripe count and maximum amount of data per
   * file (in MiB) stored on a single physical disk.
   *
   * Allowed values: 1 to 512,000 MiB.
   *
   * @default 1024
   */
  readonly importedFileChunkSizeMiB?: number;

  /**
   * Whether to run a data repository task to import S3 metadata after the
   * association is created.
   *
   * @default false
   */
  readonly batchImportMetaDataOnCreate?: boolean;

  /**
   * The removal policy for this resource.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Interface for a DataRepositoryAssociation.
 */
export interface IDataRepositoryAssociation {
  /**
   * The ID of the data repository association.
   */
  readonly associationId: string;
}

/**
 * An L2 construct for an FSx for Lustre DataRepositoryAssociation.
 *
 * Links an S3 bucket to a path on a Lustre file system so that data can be
 * automatically imported and exported between S3 and the file system.
 *
 * Data repository associations are supported on FSx for Lustre 2.12 and 2.15
 * file systems with SCRATCH_2, PERSISTENT_1, or PERSISTENT_2 deployment types.
 *
 * @see https://docs.aws.amazon.com/fsx/latest/LustreGuide/overview-dra-data-repo.html
 *
 * @resource AWS::FSx::DataRepositoryAssociation
 */
@propertyInjectable
export class DataRepositoryAssociation extends Resource implements IDataRepositoryAssociation {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-fsx.DataRepositoryAssociation';

  /**
   * The ID of the data repository association.
   * @attribute
   */
  public readonly associationId: string;

  constructor(scope: Construct, id: string, props: DataRepositoryAssociationProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    this.validateProps(props);

    const dataRepositoryPath = props.bucketPrefix
      ? `s3://${props.bucket.bucketName}/${props.bucketPrefix.replace(/^\/+/, '')}`
      : `s3://${props.bucket.bucketName}/`;

    const resource = new CfnDataRepositoryAssociation(this, 'Resource', {
      fileSystemId: props.fileSystem.fileSystemId,
      fileSystemPath: props.fileSystemPath,
      dataRepositoryPath,
      importedFileChunkSize: props.importedFileChunkSizeMiB,
      batchImportMetaDataOnCreate: props.batchImportMetaDataOnCreate,
      s3: props.s3,
    });
    resource.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);

    this.associationId = resource.ref;

    // Grant FSx service principal read/write access to the bucket so it can
    // fulfil import and export requests on behalf of the file system.
    // Add an explicit dependency so CloudFormation creates the bucket policy before the DRA.
    const grant = props.bucket.grantReadWrite(new ServicePrincipal('fsx.amazonaws.com'));
    resource.node.addDependency(grant);
  }

  private validateProps(props: DataRepositoryAssociationProps): void {
    this.validateFileSystemPath(props.fileSystemPath);
    this.validateImportedFileChunkSize(props.importedFileChunkSizeMiB);
    if (props.s3?.autoImportPolicy) {
      this.validateEventTypes(props.s3.autoImportPolicy.events, 'autoImportPolicy');
    }
    if (props.s3?.autoExportPolicy) {
      this.validateEventTypes(props.s3.autoExportPolicy.events, 'autoExportPolicy');
    }
  }

  private validateFileSystemPath(fileSystemPath: string): void {
    if (Token.isUnresolved(fileSystemPath)) return;
    if (!fileSystemPath.startsWith('/')) {
      throw new ValidationError(lit`FileSystemPathMustStartWithSlash`, `fileSystemPath must begin with "/", got: "${fileSystemPath}"`, this);
    }
    if (fileSystemPath.length > 4096) {
      throw new ValidationError(lit`FileSystemPathExceedsMaxLength`, `fileSystemPath cannot exceed 4096 characters, got length: ${fileSystemPath.length}`, this);
    }
  }

  private validateImportedFileChunkSize(importedFileChunkSizeMiB?: number): void {
    if (importedFileChunkSizeMiB === undefined) return;
    if (importedFileChunkSizeMiB < 1 || importedFileChunkSizeMiB > 512000) {
      throw new ValidationError(lit`ImportedFileChunkSizeInvalid`, `importedFileChunkSizeMiB must be between 1 and 512,000 MiB, got: ${importedFileChunkSizeMiB}`, this);
    }
  }

  private validateEventTypes(events: DataRepositoryEventType[], field: string): void {
    if (events.length === 0) {
      throw new ValidationError(lit`EventTypesMustNotBeEmpty`, `${field}.events must contain at least one event type`, this);
    }
  }
}
