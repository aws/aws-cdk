import { Construct } from 'constructs';
import { CfnDirectoryBucket } from './s3express.generated';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import {
  ArnFormat,
  IResource,
  Names,
  Resource,
  ResourceProps,
  Stack,
  Token,
} from '../../core';
import { ValidationError } from '../../core/lib/errors';

/**
 * Represents an S3 Express One Zone directory bucket
 */
export interface IDirectoryBucket extends IResource {
  /**
   * The ARN of the directory bucket.
   * @attribute
   */
  readonly bucketArn: string;

  /**
   * The name of the directory bucket.
   * @attribute
   */
  readonly bucketName: string;

  /**
   * Grants read permissions for this bucket and its contents to an IAM principal.
   *
   * If encryption is used, permission to use the key to decrypt the contents
   * of the bucket will also be granted.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  grantRead(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;

  /**
   * Grants write permissions to this bucket to an IAM principal.
   *
   * If encryption is used, permission to use the key to encrypt the contents
   * of the bucket will also be granted.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  grantWrite(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;

  /**
   * Grants read/write permissions for this bucket and its contents to an IAM principal.
   *
   * If encryption is used, permission to use the key to decrypt/encrypt the contents
   * of the bucket will also be granted.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  grantReadWrite(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;

  /**
   * Adds a statement to the resource policy for a principal.
   *
   * @param permission the policy statement to be added to the bucket's policy.
   * @returns metadata about the execution of this method
   */
  addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult;
}

/**
 * Data redundancy options for S3 Express One Zone directory buckets
 */
export enum DataRedundancy {
  /**
   * Single Availability Zone redundancy
   */
  SINGLE_AVAILABILITY_ZONE = 'SingleAvailabilityZone',

  /**
   * Single Local Zone redundancy (for AWS Local Zones)
   */
  SINGLE_LOCAL_ZONE = 'SingleLocalZone',
}

/**
 * Encryption type for S3 Express One Zone directory buckets
 *
 * Note: S3 Express supports two encryption options:
 * - aws:kms:dsse: Dual-layer server-side encryption with S3-managed keys (DSSE-KMS)
 * - aws:kms: Server-side encryption with customer-provided AWS KMS keys
 */
export enum DirectoryBucketEncryption {
  /**
   * Dual-layer server-side encryption with S3-managed keys (aws:kms:dsse)
   *
   * Uses DSSE-KMS (Double Server-Side Encryption with AWS KMS), which is the
   * default encryption for S3 Express One Zone directory buckets.
   */
  S3_MANAGED,

  /**
   * Server-side encryption with customer-provided AWS KMS keys (aws:kms)
   *
   * Requires an encryption key to be specified via the `encryptionKey` property.
   */
  KMS,
}

/**
 * Location configuration for directory bucket
 */
export interface DirectoryBucketLocation {
  /**
   * The Availability Zone ID for the directory bucket.
   *
   * Must be an Availability Zone ID (e.g., 'use1-az1'), not an Availability Zone name (e.g., 'us-east-1a').
   * Availability Zone IDs are unique across AWS accounts. You can find your account's AZ IDs using
   * the AWS CLI: `aws ec2 describe-availability-zones --region us-east-1`
   *
   * Either availabilityZone or localZone must be specified, but not both.
   *
   * @default - No Availability Zone specified
   */
  readonly availabilityZone?: string;

  /**
   * The Local Zone ID for the directory bucket.
   * Example: 'us-west-2-lax-1a'
   *
   * Either availabilityZone or localZone must be specified, but not both.
   *
   * @default - No Local Zone specified
   */
  readonly localZone?: string;
}

/**
 * Properties for defining an S3 Express One Zone directory bucket
 */
export interface DirectoryBucketProps extends ResourceProps {
  /**
   * Physical name of this directory bucket.
   *
   * The name must follow the format: bucket-base-name--zone-id--x-s3
   * If not specified, a name will be generated based on the logical ID and location.
   *
   * @default - Automatically generated name
   */
  readonly directoryBucketName?: string;

  /**
   * The location (Availability Zone or Local Zone) where the directory bucket will be created.
   *
   * Directory buckets are single-zone storage resources. You must specify either
   * an Availability Zone ID or a Local Zone ID.
   */
  readonly location: DirectoryBucketLocation;

  /**
   * The data redundancy type for the directory bucket.
   *
   * @default DataRedundancy.SINGLE_AVAILABILITY_ZONE
   */
  readonly dataRedundancy?: DataRedundancy;

  /**
   * The type of server-side encryption to use for the directory bucket.
   *
   * @default DirectoryBucketEncryption.S3_MANAGED
   */
  readonly encryption?: DirectoryBucketEncryption;

  /**
   * External KMS key to use for bucket encryption.
   *
   * The encryption property must be set to KMS. An error will be emitted if
   * encryption is not KMS or if encryptionKey is specified without encryption set to KMS.
   *
   * @default - If encryption is set to KMS and this property is undefined,
   * a new KMS key will be created and associated with this bucket.
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * An S3 Express One Zone directory bucket for high-performance storage
 *
 * Directory buckets provide single-digit millisecond performance with a single
 * Availability Zone or Local Zone storage architecture.
 *
 * @resource AWS::S3Express::DirectoryBucket
 */
export class DirectoryBucket extends Resource implements IDirectoryBucket {
  /**
   * Import an existing directory bucket given its ARN
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param directoryBucketArn The ARN of the directory bucket
   */
  public static fromBucketArn(scope: Construct, id: string, directoryBucketArn: string): IDirectoryBucket {
    const bucketName = Stack.of(scope).splitArn(directoryBucketArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends Resource implements IDirectoryBucket {
      public readonly bucketArn = directoryBucketArn;
      public readonly bucketName = bucketName;

      public grantRead(identity: iam.IGrantable, objectsKeyPattern: string = '*'): iam.Grant {
        return this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS,
          this.bucketArn,
          this.arnForObjects(objectsKeyPattern));
      }

      public grantWrite(identity: iam.IGrantable, objectsKeyPattern: string = '*'): iam.Grant {
        return this.grant(identity, perms.BUCKET_WRITE_ACTIONS, perms.KEY_WRITE_ACTIONS,
          this.bucketArn,
          this.arnForObjects(objectsKeyPattern));
      }

      public grantReadWrite(identity: iam.IGrantable, objectsKeyPattern: string = '*'): iam.Grant {
        const bucketGrant = this.grant(identity,
          [...perms.BUCKET_READ_ACTIONS, ...perms.BUCKET_WRITE_ACTIONS],
          [...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS],
          this.bucketArn,
          this.arnForObjects(objectsKeyPattern));
        return bucketGrant;
      }

      public addToResourcePolicy(_statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
        return { statementAdded: false };
      }

      private arnForObjects(keyPattern: string): string {
        return `${this.bucketArn}/${keyPattern}`;
      }

      private grant(
        grantee: iam.IGrantable,
        bucketActions: string[],
        _keyActions: string[],
        resourceArn: string,
        ...otherResourceArns: string[]
      ): iam.Grant {
        const resources = [resourceArn, ...otherResourceArns];

        const grant = iam.Grant.addToPrincipalOrResource({
          grantee,
          actions: bucketActions,
          resourceArns: resources,
          resource: this,
        });

        return grant;
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing directory bucket given its name
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param directoryBucketName The name of the directory bucket
   */
  public static fromBucketName(scope: Construct, id: string, directoryBucketName: string): IDirectoryBucket {
    const stack = Stack.of(scope);
    const bucketArn = stack.formatArn({
      service: 's3express',
      resource: 'bucket',
      resourceName: directoryBucketName,
    });

    return DirectoryBucket.fromBucketArn(scope, id, bucketArn);
  }

  public readonly bucketArn: string;
  public readonly bucketName: string;

  /**
   * The KMS key used to encrypt the directory bucket.
   *
   * @attribute
   */
  public readonly encryptionKey?: kms.IKey;

  private policy?: iam.PolicyDocument;

  constructor(scope: Construct, id: string, props: DirectoryBucketProps) {
    super(scope, id, {
      physicalName: props.directoryBucketName,
    });

    this.validateProps(props);

    const location = this.determineLocation(props.location);
    const zoneId = this.extractZoneId(location);
    const bucketName = this.determineBucketName(props.directoryBucketName, zoneId);

    this.encryptionKey = this.determineEncryptionKey(props);

    const bucket = new CfnDirectoryBucket(this, 'Resource', {
      bucketName,
      dataRedundancy: props.dataRedundancy ?? DataRedundancy.SINGLE_AVAILABILITY_ZONE,
      locationName: location,
      bucketEncryption: this.renderEncryption(props),
    });

    this.bucketName = bucket.ref;
    this.bucketArn = Stack.of(this).formatArn({
      service: 's3express',
      resource: 'bucket',
      resourceName: this.bucketName,
    });
  }

  /**
   * Adds a statement to the resource policy for a principal.
   *
   * @param permission the policy statement to be added to the bucket's policy.
   * @returns metadata about the execution of this method
   */
  public addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = new iam.PolicyDocument();
    }

    this.policy.addStatements(permission);
    return { statementAdded: true, policyDependable: this.policy };
  }

  /**
   * Grants read permissions for this bucket and its contents to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantRead(identity: iam.IGrantable, objectsKeyPattern: string = '*'): iam.Grant {
    return this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS,
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants write permissions to this bucket to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantWrite(identity: iam.IGrantable, objectsKeyPattern: string = '*'): iam.Grant {
    return this.grant(identity, perms.BUCKET_WRITE_ACTIONS, perms.KEY_WRITE_ACTIONS,
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants read/write permissions for this bucket and its contents to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantReadWrite(identity: iam.IGrantable, objectsKeyPattern: string = '*'): iam.Grant {
    const bucketGrant = this.grant(identity,
      [...perms.BUCKET_READ_ACTIONS, ...perms.BUCKET_WRITE_ACTIONS],
      [...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS],
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
    return bucketGrant;
  }

  private validateProps(props: DirectoryBucketProps): void {
    const { location, encryption, encryptionKey } = props;

    // Validate location
    if (!location.availabilityZone && !location.localZone) {
      throw new ValidationError('Either availabilityZone or localZone must be specified in location', this);
    }

    if (location.availabilityZone && location.localZone) {
      throw new ValidationError('Cannot specify both availabilityZone and localZone in location', this);
    }

    // Validate encryption
    if (encryptionKey && encryption !== DirectoryBucketEncryption.KMS) {
      throw new ValidationError('encryptionKey can only be specified when encryption is set to KMS', this);
    }

    // Validate bucket name format if provided
    if (props.directoryBucketName && !Token.isUnresolved(props.directoryBucketName)) {
      this.validateBucketName(props.directoryBucketName);
    }
  }

  private validateBucketName(bucketName: string): void {
    // Split on '--' to avoid polynomial regex complexity (ReDoS vulnerability)
    const parts = bucketName.split('--');

    // Must have exactly 3 parts: bucket-base-name, zone-id, x-s3
    if (parts.length !== 3 || parts[2] !== 'x-s3') {
      throw new ValidationError(
        `Invalid directory bucket name: ${bucketName}. ` +
        'Directory bucket names must follow the format: bucket-base-name--zone-id--x-s3',
        this,
      );
    }

    // Validate bucket-base-name: starts with alphanumeric, can contain hyphens
    if (!/^[a-z0-9][a-z0-9-]*$/.test(parts[0])) {
      throw new ValidationError(
        `Invalid directory bucket name: ${bucketName}. ` +
        'Bucket base name must start with a lowercase letter or number and contain only lowercase letters, numbers, and hyphens.',
        this,
      );
    }

    // Validate zone-id: alphanumeric and hyphens
    if (!/^[a-z0-9-]+$/.test(parts[1])) {
      throw new ValidationError(
        `Invalid directory bucket name: ${bucketName}. ` +
        'Zone ID must contain only lowercase letters, numbers, and hyphens.',
        this,
      );
    }
  }

  private determineLocation(location: DirectoryBucketLocation): string {
    if (location.availabilityZone) {
      return location.availabilityZone;
    }
    if (location.localZone) {
      return location.localZone;
    }
    throw new ValidationError('Either availabilityZone or localZone must be specified', this);
  }

  private extractZoneId(location: string): string {
    // The location should already be a valid zone ID (e.g., use1-az4 or us-west-2-lax-1a)
    // Just return it as-is for use in the bucket name
    return location.toLowerCase();
  }

  private determineBucketName(proposedName: string | undefined, zoneId: string): string {
    if (proposedName) {
      return proposedName;
    }

    // Generate a name based on the construct path
    const baseName = Names.uniqueResourceName(this, {
      maxLength: 40,
      separator: '-',
    }).toLowerCase();

    return `${baseName}--${zoneId}--x-s3`;
  }

  private determineEncryptionKey(props: DirectoryBucketProps): kms.IKey | undefined {
    if (props.encryption === DirectoryBucketEncryption.KMS) {
      return props.encryptionKey;
    }
    return undefined;
  }

  private renderEncryption(props: DirectoryBucketProps): CfnDirectoryBucket.BucketEncryptionProperty | undefined {
    // S3 Express One Zone supports two encryption algorithms:
    // - aws:kms:dsse (DSSE-KMS): Default S3-managed encryption using dual-layer server-side encryption
    // - aws:kms: Customer-managed KMS keys for custom encryption
    const sseAlgorithm = props.encryption === DirectoryBucketEncryption.KMS ? 'aws:kms' : 'aws:kms:dsse';

    return {
      serverSideEncryptionConfiguration: [{
        serverSideEncryptionByDefault: {
          sseAlgorithm,
          kmsMasterKeyId: props.encryptionKey?.keyArn,
        },
      }],
    };
  }

  private arnForObjects(keyPattern: string): string {
    return `${this.bucketArn}/${keyPattern}`;
  }

  private grant(
    grantee: iam.IGrantable,
    bucketActions: string[],
    keyActions: string[],
    resourceArn: string,
    ...otherResourceArns: string[]
  ): iam.Grant {
    const resources = [resourceArn, ...otherResourceArns];

    const grant = iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: bucketActions,
      resourceArns: resources,
      resource: this,
    });

    if (this.encryptionKey && keyActions.length > 0) {
      this.encryptionKey.grant(grantee, ...keyActions);
    }

    return grant;
  }
}

/**
 * S3 Express permission actions
 */
class perms {
  public static readonly BUCKET_READ_ACTIONS = [
    's3express:CreateSession',
    's3:GetObject',
    's3:ListBucket',
  ];

  public static readonly BUCKET_WRITE_ACTIONS = [
    's3express:CreateSession',
    's3:PutObject',
    's3:DeleteObject',
    's3:AbortMultipartUpload',
  ];

  public static readonly KEY_READ_ACTIONS = [
    'kms:Decrypt',
    'kms:DescribeKey',
  ];

  public static readonly KEY_WRITE_ACTIONS = [
    'kms:Encrypt',
    'kms:ReEncrypt*',
    'kms:GenerateDataKey*',
  ];
}
