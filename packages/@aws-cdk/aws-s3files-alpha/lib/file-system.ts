import { Annotations, ArnFormat, type Duration, type IResource, RemovalPolicy, Resource, type Size, Stack, UnscopedValidationError } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import { CfnFileSystem, CfnMountTarget, CfnFileSystemPolicy } from 'aws-cdk-lib/aws-s3files';
import type { IFileSystemRef, FileSystemReference } from 'aws-cdk-lib/aws-s3files';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import { type Construct, DependencyGroup, type IDependable } from 'constructs';
import { AccessPoint } from './access-point';
import type { AccessPointOptions } from './access-point';
import { FileSystemGrants } from './s3files-grants.generated';

/**
 * Trigger type for import data rules.
 */
export enum ImportDataRuleTrigger {
  /**
   * Import data whenever a directory is first accessed.
   */
  ON_DIRECTORY_FIRST_ACCESS = 'ON_DIRECTORY_FIRST_ACCESS',

  /**
   * Import data whenever a file is accessed.
   */
  ON_FILE_ACCESS = 'ON_FILE_ACCESS',
}

/**
 * IP address type for mount targets.
 */
export enum IpAddressType {
  /**
   * IPv4 only.
   */
  IPV4_ONLY = 'IPV4_ONLY',

  /**
   * IPv6 only.
   */
  IPV6_ONLY = 'IPV6_ONLY',

  /**
   * Dual-stack (IPv4 and IPv6).
   */
  DUAL_STACK = 'DUAL_STACK',
}

/**
 * Configuration for mount targets in a VPC.
 */
export interface VpcConfiguration {
  /**
   * The VPC to create mount targets in.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Selection of subnets to place mount targets in.
   * Only create mount targets in subnets where clients will connect from.
   */
  readonly vpcSubnets: ec2.SubnetSelection;

  /**
   * Security group for the mount targets in this VPC.
   *
   * @default - a new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The IP address type for the mount targets.
   *
   * @default IpAddressType.IPV4_ONLY
   */
  readonly ipAddressType?: IpAddressType;
}

/**
 * Rule controlling how data is imported from S3.
 */
export interface ImportDataRule {
  /**
   * The S3 key prefix for this rule.
   * Must be empty (matches all objects) or end with '/'.
   */
  readonly prefix: string;

  /**
   * Maximum object size to import.
   * Objects larger than this are not imported.
   * Use `Size.tebibytes(48)` to effectively import all objects.
   */
  readonly sizeLessThan: Size;

  /**
   * The trigger that causes data to be imported.
   *
   * @default ImportDataRuleTrigger.ON_DIRECTORY_FIRST_ACCESS
   */
  readonly trigger?: ImportDataRuleTrigger;
}

/**
 * Configuration for data import and expiration behavior.
 */
export interface SynchronizationConfiguration {
  /**
   * Rules controlling how data is imported from S3.
   * Must contain between 1 and 10 rules. Each rule's prefix
   * must be empty or end with '/'.
   */
  readonly importDataRules: ImportDataRule[];

  /**
   * Number of days after last access before cached data expires.
   * Must be a whole number of days between 1 and 365.
   */
  readonly daysAfterLastAccess: Duration;
}

/**
 * Properties for creating an S3 Files FileSystem.
 */
export interface FileSystemProps {
  /**
   * The S3 bucket that backs this file system.
   */
  readonly bucket: s3.IBucket;

  /**
   * VPC configuration for mount targets.
   */
  readonly vpcConfiguration: VpcConfiguration;

  /**
   * IAM role assumed by the S3 Files service to access the bucket on behalf of the file system.
   *
   * @default - a new role is created with required policies
   */
  readonly role?: iam.IRole;

  /**
   * The KMS key used for encryption.
   *
   * @default - the bucket's own encryption configuration is used
   */
  readonly kmsKey?: kms.IKey;

  /**
   * S3 key prefix to scope the file system to within the bucket.
   *
   * @default - the entire bucket
   */
  readonly prefix?: string;

  /**
   * Synchronization configuration controlling data import and expiration.
   *
   * @default - no synchronization configuration
   */
  readonly synchronizationConfiguration?: SynchronizationConfiguration;

  /**
   * Resource policy to attach at creation.
   * Additional policies can be added with `addToResourcePolicy` later.
   *
   * @default - none
   */
  readonly fileSystemPolicy?: iam.PolicyDocument;

  /**
   * The removal policy to apply to the file system.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Properties that describe an existing S3 Files file system.
 */
export interface FileSystemAttributes {
  /**
   * The security group of the file system.
   */
  readonly securityGroup: ec2.ISecurityGroup;

  /**
   * The file system ID.
   *
   * @default - determined based on fileSystemArn
   */
  readonly fileSystemId?: string;

  /**
   * The file system ARN.
   *
   * @default - determined based on fileSystemId
   */
  readonly fileSystemArn?: string;
}

/**
 * Represents an S3 Files FileSystem.
 */
export interface IFileSystem extends IResource, ec2.IConnectable, iam.IResourceWithPolicyV2, IFileSystemRef {
  /**
   * The ARN of the file system.
   *
   * @attribute
   */
  readonly fileSystemArn: string;

  /**
   * The ID of the file system.
   *
   * @attribute
   */
  readonly fileSystemId: string;

  /**
   * The grants facade for this file system.
   */
  readonly grants: FileSystemGrants;

  /**
   * Dependable that can be depended upon to ensure the mount targets
   * of the file system are ready.
   *
   * Add this to the dependencies of any resource (e.g. an EC2 instance
   * or Lambda function) that mounts the file system, to ensure it is
   * not deployed before the mount targets are available.
   */
  readonly mountTargetsAvailable: IDependable;

  /**
   * Add an access point to this file system.
   */
  addAccessPoint(id: string, options?: AccessPointOptions): AccessPoint;

  /**
   * Return the given named metric for this file system.
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Bytes read from the file system. */
  metricDataReadBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Bytes written to the file system. */
  metricDataWriteBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Metadata bytes read from the file system. */
  metricMetadataReadBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Metadata bytes written to the file system. */
  metricMetadataWriteBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Total size of the file system in bytes. Emitted every 15 minutes. */
  metricStorageBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Total number of inodes in the file system. Emitted every 15 minutes. */
  metricInodes(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Number of files and directories pending export to the S3 bucket. */
  metricPendingExports(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Number of objects that failed to import after retries. */
  metricImportFailures(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Number of files and directories that failed export and will not be retried. */
  metricExportFailures(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Age of in-progress imports from the linked S3 bucket, in seconds. */
  metricImportAge(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Age of in-progress exports to the linked S3 bucket, in seconds. */
  metricExportAge(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Number of files in the lost+found directory. */
  metricLostAndFoundFiles(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /** Number of active client connections to the file system. */
  metricClientConnections(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

abstract class FileSystemBase extends Resource implements IFileSystem {
  public abstract readonly fileSystemArn: string;
  public abstract readonly fileSystemId: string;
  public abstract readonly connections: ec2.Connections;
  public abstract readonly mountTargetsAvailable: IDependable;

  public get fileSystemRef(): FileSystemReference {
    return { fileSystemArn: this.fileSystemArn };
  }

  public readonly grants = FileSystemGrants.fromFileSystem(this);

  public addAccessPoint(id: string, options: AccessPointOptions = {}): AccessPoint {
    return new AccessPoint(this, id, {
      fileSystem: this,
      ...options,
    });
  }

  public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    return { statementAdded: false };
  }

  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/S3/Files',
      metricName,
      dimensionsMap: {
        FileSystemId: this.fileSystemId,
      },
      ...props,
    });
  }

  public metricDataReadBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('DataReadBytes', { statistic: 'Sum', ...props });
  }

  public metricDataWriteBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('DataWriteBytes', { statistic: 'Sum', ...props });
  }

  public metricMetadataReadBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MetadataReadBytes', { statistic: 'Sum', ...props });
  }

  public metricMetadataWriteBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('MetadataWriteBytes', { statistic: 'Sum', ...props });
  }

  public metricStorageBytes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('StorageBytes', { statistic: 'Average', ...props });
  }

  public metricInodes(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('Inodes', { statistic: 'Sum', ...props });
  }

  public metricPendingExports(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('PendingExports', { statistic: 'Sum', ...props });
  }

  public metricImportFailures(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ImportFailures', { statistic: 'Sum', ...props });
  }

  public metricExportFailures(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ExportFailures', { statistic: 'Sum', ...props });
  }

  public metricImportAge(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ImportAge', { statistic: 'Maximum', ...props });
  }

  public metricExportAge(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ExportAge', { statistic: 'Maximum', ...props });
  }

  public metricLostAndFoundFiles(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('LostAndFoundFiles', { statistic: 'Sum', ...props });
  }

  public metricClientConnections(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric('ClientConnections', { statistic: 'Sum', ...props });
  }
}

/**
 * An S3 Files FileSystem.
 *
 * @resource AWS::S3Files::FileSystem
 */
export class FileSystem extends FileSystemBase {
  /**
   * Import an existing file system from its attributes.
   */
  public static fromFileSystemAttributes(scope: Construct, id: string, attrs: FileSystemAttributes): IFileSystem {
    if (!attrs.fileSystemArn && !attrs.fileSystemId) {
      throw new UnscopedValidationError(lit`FileSystemImportInvalid`, 'One of fileSystemArn or fileSystemId must be provided');
    }

    class Import extends FileSystemBase {
      public readonly fileSystemArn: string;
      public readonly fileSystemId: string;
      public readonly connections: ec2.Connections;
      public readonly mountTargetsAvailable: IDependable = new DependencyGroup();

      constructor() {
        super(scope, id);

        if (attrs.fileSystemArn) {
          this.fileSystemArn = attrs.fileSystemArn;
          this.fileSystemId = Stack.of(scope).splitArn(attrs.fileSystemArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
        } else {
          this.fileSystemId = attrs.fileSystemId!;
          this.fileSystemArn = Stack.of(scope).formatArn({
            service: 's3files',
            resource: 'file-system',
            resourceName: attrs.fileSystemId,
          });
        }

        this.connections = new ec2.Connections({
          securityGroups: [attrs.securityGroup],
        });
      }
    }

    return new Import();
  }

  public readonly fileSystemArn: string;
  public readonly fileSystemId: string;
  public readonly connections: ec2.Connections;
  public readonly mountTargetsAvailable: IDependable;

  private readonly _resource: CfnFileSystem;
  private _resourcePolicy?: CfnFileSystemPolicy;
  private readonly _policyDocument: iam.PolicyDocument;
  private readonly _mountTargetsAvailable = new DependencyGroup();

  constructor(scope: Construct, id: string, props: FileSystemProps) {
    super(scope, id, {
      physicalName: id,
    });

    this.validateProps(props);

    const role = props.role ?? this.createServiceRole(props);

    const securityGroup = props.vpcConfiguration.securityGroup ?? new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpcConfiguration.vpc,
      description: 'Security group for S3 Files mount targets',
    });

    securityGroup.addIngressRule(
      ec2.Peer.ipv4(props.vpcConfiguration.vpc.vpcCidrBlock),
      ec2.Port.tcp(2049),
      'Allow NFS traffic from VPC',
    );

    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
    });

    this._resource = new CfnFileSystem(this, 'Resource', {
      bucket: props.bucket.bucketArn,
      roleArn: role.roleArn,
      kmsKeyId: props.kmsKey?.keyArn,
      prefix: props.prefix,
      acceptBucketWarning: true,
      synchronizationConfiguration: props.synchronizationConfiguration
        ? this.renderSyncConfig(props.synchronizationConfiguration)
        : undefined,
    });

    this._resource.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);

    this.fileSystemArn = this._resource.attrFileSystemArn;
    this.fileSystemId = this._resource.attrFileSystemId;

    // Create mount targets
    const subnets = props.vpcConfiguration.vpc.selectSubnets(props.vpcConfiguration.vpcSubnets).subnets;
    for (const subnet of subnets) {
      const mountTarget = new CfnMountTarget(this, `MountTarget-${subnet.node.id}`, {
        fileSystemId: this.fileSystemId,
        subnetId: subnet.subnetId,
        securityGroups: [securityGroup.securityGroupId],
        ipAddressType: props.vpcConfiguration.ipAddressType,
      });
      this._mountTargetsAvailable.add(mountTarget);
    }
    this.mountTargetsAvailable = this._mountTargetsAvailable;

    // File system policy
    this._policyDocument = props.fileSystemPolicy ?? new iam.PolicyDocument();
    if (props.fileSystemPolicy) {
      this.createResourcePolicy();
    }
  }

  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    this._policyDocument.addStatements(statement);
    if (!this._resourcePolicy) {
      this.createResourcePolicy();
    }
    return { statementAdded: true, policyDependable: this._resourcePolicy };
  }

  private renderSyncConfig(config: SynchronizationConfiguration): CfnFileSystem.SynchronizationConfigurationProperty {
    return {
      importDataRules: config.importDataRules.map(rule => ({
        prefix: rule.prefix,
        sizeLessThan: rule.sizeLessThan.toBytes(),
        trigger: rule.trigger ?? ImportDataRuleTrigger.ON_FILE_ACCESS,
      })),
      expirationDataRules: [{
        daysAfterLastAccess: config.daysAfterLastAccess.toDays(),
      }],
    };
  }

  private createResourcePolicy(): void {
    this._resourcePolicy = new CfnFileSystemPolicy(this, 'Policy', {
      fileSystemId: this.fileSystemId,
      policy: this._policyDocument,
    });
  }

  private createServiceRole(props: FileSystemProps): iam.IRole {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('elasticfilesystem.amazonaws.com', {
        conditions: {
          StringEquals: {
            'aws:SourceAccount': Stack.of(this).account,
          },
        },
      }),
    });

    role.addToPolicy(new iam.PolicyStatement({
      actions: [
        's3:GetObject',
        's3:PutObject',
        's3:DeleteObject',
        's3:ListBucket',
        's3:GetBucketLocation',
      ],
      resources: [
        props.bucket.bucketArn,
        props.bucket.arnForObjects('*'),
      ],
    }));

    role.addToPolicy(new iam.PolicyStatement({
      sid: 'EventBridgeManage',
      actions: [
        'events:DeleteRule',
        'events:DisableRule',
        'events:EnableRule',
        'events:PutRule',
        'events:PutTargets',
        'events:RemoveTargets',
      ],
      resources: [
        Stack.of(this).formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'DO-NOT-DELETE-S3-Files*',
          region: '*',
          account: '*',
        }),
      ],
      conditions: {
        StringEquals: { 'events:ManagedBy': 'elasticfilesystem.amazonaws.com' },
      },
    }));

    role.addToPolicy(new iam.PolicyStatement({
      sid: 'EventBridgeRead',
      actions: [
        'events:DescribeRule',
        'events:ListRuleNamesByTarget',
        'events:ListRules',
        'events:ListTargetsByRule',
      ],
      resources: [
        Stack.of(this).formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: '*',
          region: '*',
          account: '*',
        }),
      ],
    }));

    if (props.kmsKey) {
      role.addToPolicy(new iam.PolicyStatement({
        actions: [
          'kms:GenerateDataKey',
          'kms:Encrypt',
          'kms:Decrypt',
          'kms:ReEncryptFrom',
          'kms:ReEncryptTo',
        ],
        resources: [props.kmsKey.keyArn],
        conditions: {
          StringLike: {
            'kms:ViaService': 's3.*.amazonaws.com',
          },
        },
      }));
    }

    return role;
  }

  private validateProps(props: FileSystemProps): void {
    // Versioning cannot be verified statically from IBucket — emit a warning
    // so users are reminded to enable it on the bucket before deploying.
    Annotations.of(this).addWarningV2('@aws-cdk/aws-s3files-alpha:bucketVersioningNotVerified',
      'S3 Files requires bucket versioning to be enabled. Ensure versioning is enabled on the bucket before deploying.');

    if (props.synchronizationConfiguration) {
      const { importDataRules, daysAfterLastAccess } = props.synchronizationConfiguration;

      if (importDataRules.length < 1 || importDataRules.length > 10) {
        throw new UnscopedValidationError(lit`ImportDataRulesCountInvalid`, 'importDataRules must contain between 1 and 10 rules');
      }

      for (const rule of importDataRules) {
        if (rule.prefix !== '' && !rule.prefix.endsWith('/')) {
          throw new UnscopedValidationError(lit`ImportDataRulePrefixInvalid`, `importDataRule prefix must be empty or end with '/': '${rule.prefix}'`);
        }
      }

      const days = daysAfterLastAccess.toDays();
      if (days < 1 || days > 365 || !Number.isInteger(days)) {
        throw new UnscopedValidationError(lit`DaysAfterLastAccessInvalid`, 'daysAfterLastAccess must be a whole number of days between 1 and 365');
      }
    }
  }
}
