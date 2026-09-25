import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import type { FileSystemReference, IFileSystemRef } from 'aws-cdk-lib/aws-s3files';
import { CfnFileSystem, CfnFileSystemPolicy, CfnMountTarget } from 'aws-cdk-lib/aws-s3files';
import type { Duration, IResource, Size } from 'aws-cdk-lib/core';
import { ArnFormat, Lazy, Names, RemovalPolicy, Resource, Stack, Token, ValidationError } from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct, IDependable } from 'constructs';
import { DependencyGroup } from 'constructs';
import { AccessPoint } from './access-point';
import type { AccessPointOptions } from './access-point';
import { FILE_SYSTEM_SYMBOL } from './private/symbols';
import { FileSystemGrants } from './s3files-grants.generated';

/**
 * IP address type for an S3 Files mount target.
 */
export enum MountTargetIpAddressType {
  /**
   * The mount target only accepts IPv4 connections.
   */
  IPV4_ONLY = 'IPV4_ONLY',

  /**
   * The mount target only accepts IPv6 connections.
   */
  IPV6_ONLY = 'IPV6_ONLY',

  /**
   * The mount target accepts both IPv4 and IPv6 connections.
   */
  DUAL_STACK = 'DUAL_STACK',
}

/**
 * Trigger that controls when import-data rules run.
 */
export enum ImportDataTrigger {
  /**
   * Imports happen on demand when a client first accesses the prefix.
   */
  ON_DEMAND = 'ON_DEMAND',

  /**
   * Imports happen continuously as the bucket changes.
   */
  CONTINUOUS = 'CONTINUOUS',
}

/**
 * Rule describing which S3 objects to import into the file system.
 */
export interface ImportDataRule {
  /**
   * The S3 key prefix that selects objects to import.
   */
  readonly prefix: string;

  /**
   * Maximum object size eligible for import.
   */
  readonly sizeLessThan: Size;

  /**
   * The trigger that controls when import data rules run.
   */
  readonly trigger: ImportDataTrigger;
}

/**
 * Rule describing when files become eligible for expiration from the file system.
 */
export interface ExpirationDataRule {
  /**
   * How long after last access a file is considered expired.
   */
  readonly afterLastAccess: Duration;
}

/**
 * Synchronization configuration for an S3 Files file system.
 */
export interface SynchronizationConfiguration {
  /**
   * Rules describing which S3 objects to import.
   */
  readonly importDataRules: ImportDataRule[];

  /**
   * Rules describing when files expire from the file system.
   */
  readonly expirationDataRules: ExpirationDataRule[];
}

/**
 * Represents an Amazon S3 Files file system.
 *
 * @stateful
 */
export interface IFileSystem extends IFileSystemRef, ec2.IConnectable, iam.IResourceWithPolicyV2, IResource {
  /**
   * The ID of the file system, assigned by the service.
   *
   * @attribute
   */
  readonly fileSystemId: string;

  /**
   * The ARN of the file system.
   *
   * @attribute
   */
  readonly fileSystemArn: string;

  /**
   * Dependable that can be depended upon to ensure the mount targets of the
   * file system are ready before another resource uses it.
   */
  readonly mountTargetsAvailable: IDependable;

  /**
   * Grants Facade for granting IAM permissions on this file system.
   */
  readonly grants: FileSystemGrants;
}

/**
 * Properties of an S3 Files FileSystem.
 */
export interface FileSystemProps {
  /**
   * The S3 bucket backing this file system.
   */
  readonly bucket: s3.IBucketRef;

  /**
   * The VPC to launch the file system in.
   *
   * [disable-awslint:prefer-ref-interface]
   */
  readonly vpc: ec2.IVpc;

  /**
   * IAM role assumed by the S3 Files service to access the bucket on behalf of the file system.
   *
   * @default - a new role is created with read/write permissions scoped to the bucket (and `prefix` if specified).
   */
  readonly role?: iam.IRoleRef;

  /**
   * S3 key prefix scoping this file system to a portion of the bucket.
   *
   * @default - the whole bucket is exposed
   */
  readonly prefix?: string;

  /**
   * KMS key used to encrypt the file system. Used for SSE-KMS buckets.
   *
   * @default - the bucket's own encryption configuration is used
   */
  readonly kmsKey?: kms.IKeyRef;

  /**
   * Subnets in which to create mount targets.
   *
   * @default - one subnet per AZ in the VPC
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security group attached to the mount targets.
   *
   * [disable-awslint:prefer-ref-interface]
   *
   * @default - a new security group is created with no inbound rules and all outbound traffic allowed
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * IP address type for the mount targets.
   *
   * @default MountTargetIpAddressType.IPV4_ONLY
   */
  readonly mountTargetIpAddressType?: MountTargetIpAddressType;

  /**
   * Synchronization configuration for the file system.
   *
   * @default - no synchronization rules
   */
  readonly synchronizationConfiguration?: SynchronizationConfiguration;

  /**
   * Acknowledge that the bucket has properties that may incur additional cost
   * or latency when used with S3 Files.
   *
   * @default false
   */
  readonly acceptBucketWarning?: boolean;

  /**
   * Opaque string used to ensure idempotent creation. Length 1–64 characters.
   *
   * @default - no client token
   */
  readonly clientToken?: string;

  /**
   * The removal policy to apply to the file system.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Resource policy attached at creation. Additional statements can be added later
   * via `addToResourcePolicy`.
   *
   * @default - no resource policy
   */
  readonly resourcePolicy?: iam.PolicyDocument;
}

/**
 * Properties describing an existing S3 Files file system to be imported.
 */
export interface FileSystemAttributes {
  /**
   * Security group attached to the imported file system.
   *
   * [disable-awslint:prefer-ref-interface]
   */
  readonly securityGroup: ec2.ISecurityGroup;

  /**
   * The file system's ID.
   *
   * @default - determined from `fileSystemArn`
   */
  readonly fileSystemId?: string;

  /**
   * The file system's ARN.
   *
   * @default - constructed from `fileSystemId`
   */
  readonly fileSystemArn?: string;
}

abstract class FileSystemBase extends Resource implements IFileSystem {
  public abstract readonly connections: ec2.Connections;

  /** @attribute */
  public abstract readonly fileSystemId: string;

  /** @attribute */
  public abstract readonly fileSystemArn: string;

  public abstract readonly mountTargetsAvailable: IDependable;

  public get fileSystemRef(): FileSystemReference {
    return {
      fileSystemArn: this.fileSystemArn,
    };
  }

  private _grants?: FileSystemGrants;

  public get grants(): FileSystemGrants {
    this._grants ??= FileSystemGrants.fromFileSystem(this);
    return this._grants;
  }

  /**
   * @internal
   */
  protected _resource?: CfnFileSystem;

  /**
   * @internal
   */
  protected _fileSystemPolicy?: iam.PolicyDocument;

  /**
   * @internal
   */
  protected _cfnFileSystemPolicy?: CfnFileSystemPolicy;

  /**
   * Adds a statement to the resource policy associated with this file system.
   * A `CfnFileSystemPolicy` is created lazily on first call.
   *
   * Imported file systems cannot be reconfigured.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this._resource) {
      return { statementAdded: false };
    }
    if (!this._fileSystemPolicy) {
      this._fileSystemPolicy = new iam.PolicyDocument({ statements: [] });
      this._cfnFileSystemPolicy = new CfnFileSystemPolicy(this, 'Policy', {
        fileSystemId: this.fileSystemId,
        policy: Lazy.any({ produce: () => this._fileSystemPolicy?.toJSON() }),
      });
    }
    this._fileSystemPolicy.addStatements(statement);
    return {
      statementAdded: true,
      policyDependable: this._cfnFileSystemPolicy,
    };
  }
}

/**
 * The S3 Files implementation of `IFileSystem`.
 *
 * Creates a new S3 Files file system that exposes an S3 bucket as a POSIX file system to
 * EC2 instances in a VPC. A mount target is created in each selected subnet and
 * an IAM role is generated automatically when one is not supplied.
 *
 * @stateful
 * @resource AWS::S3Files::FileSystem
 */
@propertyInjectable
export class FileSystem extends FileSystemBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk/aws-s3files-alpha.FileSystem';

  /**
   * The default port that S3 Files mount targets listen on (NFS).
   */
  public static readonly DEFAULT_PORT: number = 2049;

  /**
   * Determines whether the given object is a `FileSystem`.
   */
  public static isFileSystem(x: any): x is FileSystem {
    return x !== null && typeof x === 'object' && FILE_SYSTEM_SYMBOL in x;
  }

  /**
   * Import an existing S3 Files file system.
   */
  public static fromFileSystemAttributes(scope: Construct, id: string, attrs: FileSystemAttributes): IFileSystem {
    return new ImportedFileSystem(scope, id, attrs);
  }

  public readonly connections: ec2.Connections;

  /** @attribute */
  public readonly fileSystemId: string;

  /** @attribute */
  public readonly fileSystemArn: string;

  /**
   * The time at which the file system was created.
   *
   * @attribute
   */
  public readonly fileSystemCreationTime: string;

  /**
   * The AWS account that owns the file system.
   *
   * @attribute
   */
  public readonly fileSystemOwnerId: string;

  public readonly mountTargetsAvailable: IDependable;

  /**
   * The IAM role used by the S3 Files service to access the bucket.
   */
  public readonly role: iam.IRoleRef;

  constructor(scope: Construct, id: string, props: FileSystemProps) {
    super(scope, id);
    Object.defineProperty(this, FILE_SYSTEM_SYMBOL, { value: true });
    addConstructMetadata(this, props);

    this.validateProps(props);

    this.role = props.role ?? this.createServiceRole(props);

    this._resource = new CfnFileSystem(this, 'Resource', {
      bucket: props.bucket.bucketRef.bucketArn,
      roleArn: this.role.roleRef.roleArn,
      kmsKeyId: props.kmsKey?.keyRef.keyArn,
      prefix: props.prefix,
      acceptBucketWarning: props.acceptBucketWarning,
      clientToken: props.clientToken,
      synchronizationConfiguration: renderSynchronizationConfiguration(props.synchronizationConfiguration),
    });
    this._resource.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);
    this.fileSystemId = this._resource.attrFileSystemId;
    this.fileSystemArn = this._resource.attrFileSystemArn;
    this.fileSystemCreationTime = this._resource.attrCreationTime;
    this.fileSystemOwnerId = this._resource.attrOwnerId;

    if (props.resourcePolicy && !props.resourcePolicy.isEmpty) {
      this._fileSystemPolicy = props.resourcePolicy;
      this._cfnFileSystemPolicy = new CfnFileSystemPolicy(this, 'Policy', {
        fileSystemId: this.fileSystemId,
        policy: Lazy.any({ produce: () => this._fileSystemPolicy?.toJSON() }),
      });
    }

    const securityGroup = props.securityGroup ?? new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
    });
    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
      defaultPort: ec2.Port.tcp(FileSystem.DEFAULT_PORT),
    });

    const subnets = props.vpc.selectSubnets(props.vpcSubnets ?? { onePerAz: true });
    const dependable = new DependencyGroup();
    for (const subnet of subnets.subnets) {
      const subnetUniqueId = Token.isUnresolved(subnet.node.id)
        ? Names.uniqueResourceName(subnet, { maxLength: 16 })
        : subnet.node.id;
      const mountTarget = new CfnMountTarget(this, `MountTarget-${subnetUniqueId}`, {
        fileSystemId: this.fileSystemId,
        subnetId: subnet.subnetId,
        securityGroups: [securityGroup.securityGroupId],
        ipAddressType: props.mountTargetIpAddressType,
      });
      dependable.add(mountTarget);
    }
    this.mountTargetsAvailable = dependable;
  }

  /**
   * Create an access point on this file system.
   */
  @MethodMetadata()
  public addAccessPoint(id: string, options: AccessPointOptions = {}): AccessPoint {
    return new AccessPoint(this, id, {
      fileSystem: this,
      ...options,
    });
  }

  private validateProps(props: FileSystemProps): void {
    const { clientToken, prefix } = props;
    if (clientToken !== undefined && !Token.isUnresolved(clientToken)) {
      if (clientToken.length < 1 || clientToken.length > 64) {
        throw new ValidationError(
          lit`ClientTokenLength`,
          `'clientToken' must be 1-64 characters long, got ${clientToken.length}`,
          this,
        );
      }
    }
    if (prefix !== undefined && !Token.isUnresolved(prefix)) {
      if (prefix.length > 1024) {
        throw new ValidationError(
          lit`PrefixLength`,
          `'prefix' must be at most 1024 characters long, got ${prefix.length}`,
          this,
        );
      }
      if (prefix !== '' && !prefix.endsWith('/')) {
        throw new ValidationError(
          lit`InvalidPrefix`,
          `'prefix' must be empty or end with '/', got ${JSON.stringify(prefix)}`,
          this,
        );
      }
    }
    const expirationRules = props.synchronizationConfiguration?.expirationDataRules ?? [];
    for (let i = 0; i < expirationRules.length; i++) {
      const d = expirationRules[i].afterLastAccess;
      const seconds = d.toSeconds();
      if (!Token.isUnresolved(seconds) && seconds % 86400 !== 0) {
        throw new ValidationError(
          lit`ExpirationDataRuleAfterLastAccessUnit`,
          `'expirationDataRules[${i}].afterLastAccess' must be a whole number of days, got ${d.toHumanString()}`,
          this,
        );
      }
    }
  }

  private createServiceRole(props: FileSystemProps): iam.IRole {
    const stack = Stack.of(this);
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('elasticfilesystem.amazonaws.com', {
        conditions: {
          StringEquals: { 'aws:SourceAccount': stack.account },
          ArnLike: {
            'aws:SourceArn': stack.formatArn({
              service: 's3files',
              resource: 'file-system',
              resourceName: '*',
            }),
          },
        },
      }),
    });

    const bucketArn = props.bucket.bucketRef.bucketArn;
    const objectsArn = `${bucketArn}/*`;
    const accountCondition = {
      StringEquals: { 'aws:ResourceAccount': stack.account },
    };
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      sid: 'S3BucketPermissions',
      actions: ['s3:ListBucket', 's3:ListBucketVersions'],
      resources: [bucketArn],
      conditions: accountCondition,
    }));
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      sid: 'S3ObjectPermissions',
      actions: [
        's3:AbortMultipartUpload',
        's3:DeleteObject*',
        's3:GetObject*',
        's3:List*',
        's3:PutObject*',
      ],
      resources: [objectsArn],
      conditions: accountCondition,
    }));

    if (props.kmsKey) {
      role.addToPrincipalPolicy(new iam.PolicyStatement({
        sid: 'UseKmsKeyWithS3Files',
        actions: [
          'kms:GenerateDataKey',
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:ReEncryptFrom',
          'kms:ReEncryptTo',
        ],
        resources: [props.kmsKey.keyRef.keyArn],
        conditions: {
          StringLike: {
            'kms:ViaService': `s3.${stack.region}.amazonaws.com`,
            'kms:EncryptionContext:aws:s3:arn': [bucketArn, objectsArn],
          },
        },
      }));
    }

    role.addToPrincipalPolicy(new iam.PolicyStatement({
      sid: 'EventBridgeManage',
      actions: [
        'events:DeleteRule',
        'events:DisableRule',
        'events:EnableRule',
        'events:PutRule',
        'events:PutTargets',
        'events:RemoveTargets',
      ],
      resources: [stack.formatArn({
        service: 'events',
        region: '*',
        account: '*',
        resource: 'rule',
        resourceName: 'DO-NOT-DELETE-S3-Files*',
      })],
      conditions: {
        StringEquals: { 'events:ManagedBy': 'elasticfilesystem.amazonaws.com' },
      },
    }));
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      sid: 'EventBridgeRead',
      actions: [
        'events:DescribeRule',
        'events:ListRuleNamesByTarget',
        'events:ListRules',
        'events:ListTargetsByRule',
      ],
      resources: [stack.formatArn({
        service: 'events',
        region: '*',
        account: '*',
        resource: 'rule',
        resourceName: '*',
      })],
    }));
    return role;
  }
}

@propertyInjectable
class ImportedFileSystem extends FileSystemBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk/aws-s3files-alpha.ImportedFileSystem';

  public readonly connections: ec2.Connections;
  public readonly fileSystemId: string;
  public readonly fileSystemArn: string;
  public readonly mountTargetsAvailable: IDependable;

  constructor(scope: Construct, id: string, attrs: FileSystemAttributes) {
    super(scope, id);
    addConstructMetadata(this, attrs);
    Object.defineProperty(this, FILE_SYSTEM_SYMBOL, { value: true });

    if (!!attrs.fileSystemId === !!attrs.fileSystemArn) {
      throw new ValidationError(
        lit`OneFileSystemIdOrArn`,
        "Exactly one of 'fileSystemId' or 'fileSystemArn' must be provided.",
        this,
      );
    }

    this.fileSystemArn = attrs.fileSystemArn ?? Stack.of(scope).formatArn({
      service: 's3files',
      resource: 'file-system',
      resourceName: attrs.fileSystemId,
    });

    const parsedArn = Stack.of(scope).splitArn(this.fileSystemArn, ArnFormat.SLASH_RESOURCE_NAME);
    if (!parsedArn.resourceName) {
      throw new ValidationError(
        lit`InvalidFileSystemArn`,
        `Invalid file system ARN: ${this.fileSystemArn}`,
        this,
      );
    }
    this.fileSystemId = attrs.fileSystemId ?? parsedArn.resourceName;

    this.connections = new ec2.Connections({
      securityGroups: [attrs.securityGroup],
      defaultPort: ec2.Port.tcp(FileSystem.DEFAULT_PORT),
    });
    this.mountTargetsAvailable = new DependencyGroup();
  }
}

function renderSynchronizationConfiguration(
  config?: SynchronizationConfiguration,
): CfnFileSystem.SynchronizationConfigurationProperty | undefined {
  if (!config) {
    return undefined;
  }
  return {
    importDataRules: config.importDataRules.map(rule => ({
      prefix: rule.prefix,
      sizeLessThan: rule.sizeLessThan.toBytes(),
      trigger: rule.trigger,
    })),
    expirationDataRules: config.expirationDataRules.map(rule => ({
      daysAfterLastAccess: rule.afterLastAccess.toDays(),
    })),
  };
}
