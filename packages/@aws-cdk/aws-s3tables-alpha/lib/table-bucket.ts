import { EOL } from 'os';
import { Construct } from 'constructs';
import * as s3tables from 'aws-cdk-lib/aws-s3tables';
import { TableBucketPolicy } from './table-bucket-policy';
import { validateTableBucketAttributes, S3_TABLES_SERVICE } from './util';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Resource, IResource, Token, UnscopedValidationError, ArnFormat, PhysicalName } from 'aws-cdk-lib/core';
import UnreferencedFileRemovalProperty = s3tables.CfnTableBucket.UnreferencedFileRemovalProperty;
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';

/**
 * Interface definition for S3 Table Buckets
 */
export interface ITableBucket extends IResource {
  /**
   * The ARN of the bucket.
   * @attribute
   */
  readonly tableBucketArn: string;

  /**
   * The name of the bucket.
   * @attribute
   */
  readonly tableBucketName: string;

  /**
   * The resource policy for this tableBucket.
   */
  readonly policy?: TableBucketPolicy;

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this table bucket and/or its
   * contents. Use `tableBucketArn` and `arnForObjects(keys)` to obtain ARNs for
   * this bucket or objects.
   *
   * Note that the policy statement may or may not be added to the policy.
   * For example, when an `ITableBucket` is created from an existing table bucket,
   * it's not possible to tell whether the bucket already has a policy
   * attached, let alone to re-use that policy to add more statements to it.
   * So it's safest to do nothing in these cases.
   *
   * @param statement the policy statement to be added to the bucket's
   * policy.
   * @returns metadata about the execution of this method. If the policy
   * was not added, the value of `statementAdded` will be `false`. You
   * should always check this value to make sure that the operation was
   * actually carried out. Otherwise, synthesis and deploy will terminate
   * silently, which may be confusing.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
}

abstract class TableBucketBase extends Resource implements ITableBucket {
  public abstract readonly tableBucketArn: string;
  public abstract readonly tableBucketName: string;
  public abstract policy?: TableBucketPolicy;

  /**
   * Indicates if a bucket resource policy should automatically created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy: boolean;

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this table bucket and/or its
   * contents. Use `tableBucketArn` and `arnForObjects(keys)` to obtain ARNs for
   * this bucket or objects.
   *
   * Note that the policy statement may or may not be added to the policy.
   * For example, when an `ITableBucket` is created from an existing table bucket,
   * it's not possible to tell whether the bucket already has a policy
   * attached, let alone to re-use that policy to add more statements to it.
   * So it's safest to do nothing in these cases.
   *
   * @param statement the policy statement to be added to the bucket's
   * policy.
   * @returns metadata about the execution of this method. If the policy
   * was not added, the value of `statementAdded` will be `false`. You
   * should always check this value to make sure that the operation was
   * actually carried out. Otherwise, synthesis and deploy will terminate
   * silently, which may be confusing.
   */
  public addToResourcePolicy(
    statement: iam.PolicyStatement,
  ): iam.AddToResourcePolicyResult {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new TableBucketPolicy(this, 'Policy', {
        tableBucket: this,
        tableBucketPolicyName: `${this.tableBucketName}-policy`,
      });
    }

    if (this.policy) {
      this.policy.document.addStatements(statement);
      return { statementAdded: true, policyDependable: this.policy };
    }

    return { statementAdded: false };
  }
}

/**
 * Parameters for constructing a TableBucket
 */
export interface TableBucketProps {
  /**
   * Name of the S3 TableBucket.
   * @link https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-buckets-naming.html#table-buckets-naming-rules
   */
  readonly tableBucketName: string;
  /**
   * Unreferenced file removal settings for the S3 TableBucket.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-tablebucket-unreferencedfileremoval.html
   * @default Enabled with default values
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-table-buckets-maintenance.html
   */
  readonly unreferencedFileRemoval?: UnreferencedFileRemovalProperty;
  /**
   * AWS region that the table bucket exists in.
   */
  readonly region: string;
  /**
   * AWS Account ID of the table bucket owner.
   */
  readonly account: string;
}

/**
 * Everything needed to reference a specific table bucket.
 * The tableBucketName, region, and account can be provided explicitly
 * or will be inferred from the tableBucketArn
 */
export interface TableBucketAttributes {
  /**
   * AWS region this table bucket exists in
   * @default region inferred from scope
   */
  readonly region?: string;
  /**
   * The accountId containing this table bucket
   * @default account inferred from scope
   */
  readonly account?: string;
  /**
   * The table bucket name, unique per region
   * @default tableBucketName inferred from arn
   */
  readonly tableBucketName?: string;
  /**
   * The table bucket's ARN.
   * @default tableBucketArn constructed from region, account and tableBucketName are provided
   */
  readonly tableBucketArn?: string;
}

/**
 * An S3 table bucket with helpers for associated resource policies
 *
 * This bucket may not yet have all features that exposed by the underlying CfnTableBucket.
 *
 * @example
 * const tableBucket = new TableBucket(scope, 'ExampleTableBucket', {
 *   bucketName: 'example-bucket',
 *   // Optional fields:
 *   unreferencedFileRemoval: {
 *     noncurrentDays: 123,
 *     status: 'status',
 *     unreferencedDays: 123,
 *   },
 * });
 */
export class TableBucket extends TableBucketBase {
  /**
   * Creates a TableBucket construct that represents an external table bucket.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `TableBucketAttributes` object. Can be manually created.
   */
  public static fromTableBucketAttributes(
    scope: Construct,
    id: string,
    attrs: TableBucketAttributes,
  ): ITableBucket {
    const { tableBucketName, region, account, tableBucketArn } = validateTableBucketAttributes(scope, attrs);
    TableBucket.validateBucketName(tableBucketName);
    class Import extends TableBucketBase {
      public readonly tableBucketName = tableBucketName!;
      public readonly tableBucketArn = tableBucketArn;
      public readonly policy?: TableBucketPolicy;
      protected autoCreatePolicy: boolean = false;

      /**
       * Exports this bucket from the stack.
       */
      public export() {
        return attrs;
      }
    }

    return new Import(scope, id, {
      account: account,
      region: region,
      physicalName: tableBucketName,
    });
  }

  /**
   * Throws an exception if the given table bucket name is not valid.
   *
   * @param physicalName name of the bucket.
   */
  public static validateBucketName(
    physicalName: string,
  ): void {
    const bucketName = physicalName;
    if (!bucketName || Token.isUnresolved(bucketName)) {
      // the name is a late-bound value, not a defined string, so skip validation
      return;
    }

    const errors: string[] = [];

    // Length validation
    if (bucketName.length < 3 || bucketName.length > 63) {
      errors.push(
        'Bucket name must be at least 3 and no more than 63 characters',
      );
    }

    // Character set validation
    const illegalCharsetRegEx = /[^a-z0-9-]/;
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;

    const illegalCharMatch = bucketName.match(illegalCharsetRegEx);
    if (illegalCharMatch) {
      errors.push(
        'Bucket name must only contain lowercase characters, numbers, and hyphens (-)' +
          ` (offset: ${illegalCharMatch.index})`,
      );
    }

    // Edge character validation
    if (!allowedEdgeCharsetRegEx.test(bucketName.charAt(0))) {
      errors.push(
        'Bucket name must start with a lowercase letter or number (offset: 0)',
      );
    }
    if (
      !allowedEdgeCharsetRegEx.test(bucketName.charAt(bucketName.length - 1))
    ) {
      errors.push(
        `Bucket name must end with a lowercase letter or number (offset: ${
          bucketName.length - 1
        })`,
      );
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        `Invalid S3 bucket name (value: ${bucketName})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * Throws an exception if the given unreferencedFileRemovalProperty is not valid.
   *
   * @param unreferencedFileRemovalProperty configuration for the table bucket
   */
  public static validateUnreferencedFileRemoval(
    unreferencedFileRemovalProperty?: UnreferencedFileRemovalProperty,
  ): void {
    // Skip validation if property is not defined
    if (!unreferencedFileRemovalProperty) {
      return;
    }

    const { noncurrentDays, status, unreferencedDays } = unreferencedFileRemovalProperty;

    const errors: string[] = [];

    if (noncurrentDays != undefined && noncurrentDays < 1) {
      errors.push(
        'noncurrentDays must be at least 1',
      );
    }

    if (unreferencedDays != undefined && unreferencedDays < 1) {
      errors.push(
        'unreferencedDays must be at least 1',
      );
    }

    const allowedStatus = ['Enabled', 'Disabled'];
    if (status != undefined && !allowedStatus.includes(status)) {
      errors.push(
        'status must be one of \'Enabled\' or \'Disabled\'',
      );
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        `Invalid UnreferencedFileRemovalProperty})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * @internal
   * The underlying CfnTableBucket L1 resource
   */
  public readonly _resource: s3tables.CfnTableBucket;

  /**
   * The resource policy for this tableBucket.
   */
  public readonly policy?: TableBucketPolicy;

  /**
   * The unique Amazon Resource Name (arn) of this table bucket
   */
  public readonly tableBucketArn: string;

  /**
   * The name of this table bucket
   */
  public readonly tableBucketName: string;

  protected autoCreatePolicy: boolean = true;

  constructor(scope: Construct, id: string, props: TableBucketProps) {
    super(scope, id, {
      physicalName: PhysicalName.GENERATE_IF_NEEDED,
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    TableBucket.validateBucketName(props.tableBucketName);
    TableBucket.validateUnreferencedFileRemoval(props.unreferencedFileRemoval);

    const resource = new s3tables.CfnTableBucket(this, id, {
      tableBucketName: props.tableBucketName,
      unreferencedFileRemoval: props.unreferencedFileRemoval,
    });
    this._resource = resource;

    this.tableBucketName = this.getResourceNameAttribute(resource.ref);
    this.tableBucketArn = this.getResourceArnAttribute(
      resource.attrTableBucketArn,
      {
        region: props.region,
        account: props.account,
        service: S3_TABLES_SERVICE,
        resource: 'bucket',
        resourceName: this.physicalName,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      },
    );
  }
}

