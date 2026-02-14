import { ArnFormat, IResource, Resource, ResourceProps, RemovalPolicy, Stack, Token, Fn } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { CfnVectorBucket } from 'aws-cdk-lib/aws-s3vectors';
import { UnscopedValidationError } from 'aws-cdk-lib/core/lib/errors';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import {
  VECTOR_BUCKET_READ_ACCESS,
  VECTOR_BUCKET_WRITE_ACCESS,
  VECTOR_BUCKET_READ_WRITE_ACCESS,
  INDEX_READ_ACCESS,
  INDEX_WRITE_ACCESS,
  INDEX_READ_WRITE_ACCESS,
  KEY_READ_ACCESS,
  KEY_WRITE_ACCESS,
  KEY_READ_WRITE_ACCESS,
} from './permissions';
import { VectorBucketPolicy } from './vector-bucket-policy';

/**
 * Represents a Vector Bucket
 */
export interface IVectorBucket extends IResource {
  /**
   * The ARN of the vector bucket
   *
   * @attribute
   */
  readonly vectorBucketArn: string;

  /**
   * The name of the vector bucket
   *
   * @attribute
   */
  readonly vectorBucketName: string;

  /**
   * Optional KMS encryption key associated with this vector bucket
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Adds a statement to the resource policy for a principal to perform actions on this vector bucket
   *
   * @param permission the policy statement to be added
   * @returns metadata about the execution of this method
   */
  addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  /**
   * Grant read permissions for this vector bucket to an IAM principal
   *
   * If encryption is used, permission to use the key to decrypt the contents
   * of the bucket will also be granted to the same principal.
   *
   * @param identity The principal
   * @param indexId Allow the permissions to all indexes using '*' or to single index by its name
   */
  grantRead(identity: iam.IGrantable, indexId: string): iam.Grant;

  /**
   * Grant write permissions for this vector bucket to an IAM principal
   *
   * If encryption is used, permission to use the key to encrypt the contents
   * of the bucket will also be granted to the same principal.
   *
   * @param identity The principal
   * @param indexId Allow the permissions to all indexes using '*' or to single index by its name
   */
  grantWrite(identity: iam.IGrantable, indexId: string): iam.Grant;

  /**
   * Grant read/write permissions for this vector bucket to an IAM principal
   *
   * If encryption is used, permission to use the key to encrypt/decrypt the contents
   * of the bucket will also be granted to the same principal.
   *
   * @param identity The principal
   * @param indexId Allow the permissions to all indexes using '*' or to single index by its name
   */
  grantReadWrite(identity: iam.IGrantable, indexId: string): iam.Grant;
}

/**
 * Encryption type for S3 Vector Bucket
 */
export enum VectorBucketEncryption {
  /**
   * Server-side encryption with Amazon S3 managed keys (SSE-S3)
   */
  S3_MANAGED = 'AES256',

  /**
   * Server-side encryption with AWS KMS managed keys (SSE-KMS)
   */
  KMS = 'aws:kms',
}

/**
 * Properties for defining a Vector Bucket
 */
export interface VectorBucketProps extends ResourceProps {
  /**
   * The name of the vector bucket
   *
   * If not specified, a unique name will be generated
   *
   * @default - Automatically generated name
   */
  readonly vectorBucketName?: string;

  /**
   * The type of server-side encryption to apply to this bucket
   *
   * @default - VectorBucketEncryption.S3_MANAGED
   */
  readonly encryption?: VectorBucketEncryption;

  /**
   * External KMS key to use for bucket encryption
   *
   * The encryption property must be KMS for this to have any effect
   *
   * @default - If encryption is set to KMS and this property is undefined,
   * a new KMS key will be created and associated with this bucket
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Policy to apply when the bucket is removed from this stack
   *
   * @default - The bucket will be orphaned
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Attributes for importing an existing Vector Bucket
 */
export interface VectorBucketAttributes {
  /**
   * The ARN of the vector bucket
   */
  readonly vectorBucketArn: string;

  /**
   * The encryption key associated with this bucket
   *
   * @default - No encryption key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Base class for Vector Bucket
 */
abstract class VectorBucketBase extends Resource implements IVectorBucket {
  public abstract readonly vectorBucketArn: string;
  public abstract readonly vectorBucketName: string;
  public abstract readonly encryptionKey?: kms.IKey;

  /**
   * The resource policy associated with this vector bucket.
   *
   * If `autoCreatePolicy` is true, a `VectorBucketPolicy` will be created upon the
   * first call to addToResourcePolicy.
   */
  public abstract vectorBucketPolicy?: VectorBucketPolicy;

  /**
   * Indicates if a vector bucket resource policy should automatically be created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy: boolean;

  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this.vectorBucketPolicy && this.autoCreatePolicy) {
      this.vectorBucketPolicy = new VectorBucketPolicy(this, 'DefaultPolicy', {
        vectorBucket: this,
      });
    }

    if (this.vectorBucketPolicy) {
      this.vectorBucketPolicy.document.addStatements(statement);
      return { statementAdded: true, policyDependable: this.vectorBucketPolicy };
    }

    return { statementAdded: false };
  }

  public grantRead(identity: iam.IGrantable, indexId: string): iam.Grant {
    return this.grantWithSeparateResources(
      identity,
      VECTOR_BUCKET_READ_ACCESS,
      INDEX_READ_ACCESS,
      KEY_READ_ACCESS,
      indexId,
    );
  }

  public grantWrite(identity: iam.IGrantable, indexId: string): iam.Grant {
    return this.grantWithSeparateResources(
      identity,
      VECTOR_BUCKET_WRITE_ACCESS,
      INDEX_WRITE_ACCESS,
      KEY_WRITE_ACCESS,
      indexId,
    );
  }

  public grantReadWrite(identity: iam.IGrantable, indexId: string): iam.Grant {
    return this.grantWithSeparateResources(
      identity,
      VECTOR_BUCKET_READ_WRITE_ACCESS,
      INDEX_READ_WRITE_ACCESS,
      KEY_READ_WRITE_ACCESS,
      indexId,
    );
  }

  /**
   * Grant permissions with proper resource type separation per AWS IAM best practices.
   * VectorBucket actions are granted on the bucket ARN, Index actions on the index ARN.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-access-management.html
   */
  private grantWithSeparateResources(
    grantee: iam.IGrantable,
    bucketActions: string[],
    indexActions: string[],
    keyActions: string[],
    indexId: string,
  ): iam.Grant {
    const indexArn = `${this.vectorBucketArn}/index/${indexId}`;

    // Grant VectorBucket-level actions on the bucket ARN
    let bucketGrant: iam.Grant | undefined;
    if (bucketActions.length > 0) {
      bucketGrant = iam.Grant.addToPrincipalOrResource({
        grantee,
        actions: bucketActions,
        resourceArns: [this.vectorBucketArn],
        resource: this,
      });
    }

    // Grant Index-level actions on the index ARN
    let indexGrant: iam.Grant | undefined;
    if (indexActions.length > 0) {
      indexGrant = iam.Grant.addToPrincipalOrResource({
        grantee,
        actions: indexActions,
        resourceArns: [indexArn],
        resource: this,
      });
    }

    // Grant KMS permissions if encryption key is present
    if (this.encryptionKey && keyActions && keyActions.length > 0) {
      this.encryptionKey.grant(grantee, ...keyActions);
    }

    // Return the index grant as the primary grant (or bucket grant if no index actions)
    return indexGrant ?? bucketGrant ?? iam.Grant.drop(grantee, 'No actions to grant');
  }
}

/**
 * An S3 Vector Bucket for storing and querying vector data
 *
 * @resource AWS::S3Vectors::VectorBucket
 */
@propertyInjectable
export class VectorBucket extends VectorBucketBase {
  /**
   * Property injection ID for VectorBucket
   */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3vectors-alpha.VectorBucket';

  /**
   * Import an existing vector bucket by ARN
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param vectorBucketArn The ARN of the vector bucket
   */
  public static fromVectorBucketArn(scope: Construct, id: string, vectorBucketArn: string): IVectorBucket {
    return VectorBucket.fromVectorBucketAttributes(scope, id, { vectorBucketArn });
  }

  /**
   * Import an existing vector bucket by name
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param vectorBucketName The name of the vector bucket
   */
  public static fromVectorBucketName(scope: Construct, id: string, vectorBucketName: string): IVectorBucket {
    const stack = Stack.of(scope);
    const vectorBucketArn = stack.formatArn({
      service: 's3vectors',
      resource: 'bucket',
      resourceName: vectorBucketName,
    });

    class Import extends VectorBucketBase {
      public readonly vectorBucketArn = vectorBucketArn;
      public readonly vectorBucketName = vectorBucketName;
      public readonly encryptionKey = undefined;
      public readonly vectorBucketPolicy?: VectorBucketPolicy;
      protected autoCreatePolicy: boolean = false;
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing vector bucket using attributes
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param attrs The attributes of the vector bucket
   */
  public static fromVectorBucketAttributes(scope: Construct, id: string, attrs: VectorBucketAttributes): IVectorBucket {
    const stack = Stack.of(scope);
    const arnComponents = stack.splitArn(attrs.vectorBucketArn, ArnFormat.SLASH_RESOURCE_NAME);
    const bucketName = arnComponents.resourceName;

    if (!bucketName) {
      throw new UnscopedValidationError(`Cannot extract bucket name from ARN: ${attrs.vectorBucketArn}`);
    }

    class Import extends VectorBucketBase {
      public readonly vectorBucketArn = attrs.vectorBucketArn;
      public readonly vectorBucketName = bucketName!;
      public readonly encryptionKey = attrs.encryptionKey;
      public readonly vectorBucketPolicy?: VectorBucketPolicy;
      protected autoCreatePolicy: boolean = false;
    }

    return new Import(scope, id);
  }

  public readonly vectorBucketArn: string;
  public readonly vectorBucketName: string;
  public readonly encryptionKey?: kms.IKey;

  /**
   * The resource policy associated with this vector bucket.
   *
   * If `autoCreatePolicy` is true, a `VectorBucketPolicy` will be created upon the
   * first call to addToResourcePolicy.
   */
  public vectorBucketPolicy?: VectorBucketPolicy;

  /**
   * Indicates if a vector bucket resource policy should automatically be created upon
   * the first call to `addToResourcePolicy`.
   */
  protected autoCreatePolicy: boolean = true;

  constructor(scope: Construct, id: string, props: VectorBucketProps = {}) {
    super(scope, id, {
      physicalName: props.vectorBucketName,
    });

    // Validate bucket name
    this.validateVectorBucketName(props.vectorBucketName);

    // Parse encryption configuration
    const { bucketEncryption, encryptionKey } = this.parseEncryption(props);
    this.encryptionKey = encryptionKey;

    // Create the vector bucket
    const resource = new CfnVectorBucket(this, 'Resource', {
      vectorBucketName: props.vectorBucketName,
      encryptionConfiguration: bucketEncryption,
    });

    if (props.removalPolicy) {
      resource.applyRemovalPolicy(props.removalPolicy);
    }

    this.vectorBucketArn = resource.attrVectorBucketArn;
    this.vectorBucketName = Fn.select(1, Fn.split('/', this.vectorBucketArn));
  }

  private parseEncryption(props: VectorBucketProps): {
    bucketEncryption?: CfnVectorBucket.EncryptionConfigurationProperty;
    encryptionKey?: kms.IKey;
  } {
    const encryptionType = props.encryption;
    let key = props.encryptionKey;

    // If encryption is undefined
    if (encryptionType === undefined) {
      if (key === undefined) {
        // No encryption specified, use default S3 managed
        return { bucketEncryption: undefined, encryptionKey: undefined };
      } else {
        // Key provided without encryption type, use KMS
        return {
          bucketEncryption: {
            sseType: VectorBucketEncryption.KMS,
            kmsKeyArn: key.keyArn,
          },
          encryptionKey: key,
        };
      }
    }

    // KMS encryption
    if (encryptionType === VectorBucketEncryption.KMS) {
      if (key === undefined) {
        // Create a new key
        key = new kms.Key(this, 'Key', {
          description: `Created by ${this.node.path}`,
          enableKeyRotation: true,
        });
      }
      return {
        bucketEncryption: {
          sseType: VectorBucketEncryption.KMS,
          kmsKeyArn: key.keyArn,
        },
        encryptionKey: key,
      };
    }

    // S3 managed encryption
    if (encryptionType === VectorBucketEncryption.S3_MANAGED) {
      if (key !== undefined) {
        throw new UnscopedValidationError(
          'Expected encryption = VectorBucketEncryption.KMS with user provided encryption key. ' +
          'Use VectorBucketEncryption.KMS or remove the encryptionKey property.',
        );
      }
      return {
        bucketEncryption: {
          sseType: VectorBucketEncryption.S3_MANAGED,
        },
      };
    }

    return { bucketEncryption: undefined };
  }

  /**
   * Validate vector bucket name
   *
   * @param bucketName The bucket name to validate
   */
  private validateVectorBucketName(bucketName: string | undefined): void {
    if (bucketName == undefined || Token.isUnresolved(bucketName)) {
      return; // Skip validation for tokens
    }

    const errors: string[] = [];

    // Length check: 3-63 characters
    if (bucketName.length < 3 || bucketName.length > 63) {
      errors.push('Bucket name must be at least 3 and no more than 63 characters');
    }

    // Character set check: lowercase, numbers, hyphens only
    const illegalCharsetRegEx = /[^a-z0-9-]/;
    if (illegalCharsetRegEx.test(bucketName)) {
      errors.push('Bucket name must only contain lowercase characters, numbers, and hyphens (-)');
    }

    // Start/end character check: lowercase or number
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;
    if (!allowedEdgeCharsetRegEx.test(bucketName.charAt(0))) {
      errors.push('Bucket name must start with a lowercase letter or number');
    }
    if (!allowedEdgeCharsetRegEx.test(bucketName.charAt(bucketName.length - 1))) {
      errors.push('Bucket name must end with a lowercase letter or number');
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(`Invalid S3 vector bucket name (value: ${bucketName})\n${errors.join('\n')}`);
    }
  }
}
