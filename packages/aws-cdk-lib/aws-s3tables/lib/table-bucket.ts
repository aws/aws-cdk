import { EOL } from 'os';
import { Construct } from 'constructs';
import UnreferencedFileRemovalProperty = CfnTableBucket.UnreferencedFileRemovalProperty;
import * as s3tables from './index';
import { CfnTableBucket } from './s3tables.generated';
import { TableBucketPolicy } from './table-bucket-policy';
import { validateTableBucketAttributes, S3_TABLES_SERVICE } from './util';
import * as iam from '../../aws-iam';
import { Resource, IResource, Token, UnscopedValidationError, ArnFormat } from '../../core';

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
}

export abstract class TableBucketBase extends Resource implements ITableBucket {
  public abstract readonly tableBucketArn: string;
  public abstract readonly tableBucketName: string;
}

/**
 * Parameters for constructing a TableBucket
 */
export interface TableBucketProps {
  /**
   * Name of the S3 TableBucket.
   * @link https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-buckets-naming.html#table-buckets-naming-rules
   */
  bucketName: string;
  /**
   * Unreferenced file removal settings for the S3 TableBucket.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3tables-tablebucket-unreferencedfileremoval.html
   */
  unreferencedFileRemoval?: UnreferencedFileRemovalProperty;
  /**
   * AWS region that the table bucket exists in.
   */
  region?: string;
  /**
   * AWS Account ID of the table bucket owner.
   */
  account?: string;
}

/**
 * Everything needed to reference a specific table bucket.
 * At a minimum, we need the tableBucketName, region, and account.
 */
export class TableBucketAttributes {
  readonly region?: string;
  readonly account?: string;
  readonly tableBucketName?: string;
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
      public policy?: TableBucketPolicy = undefined;

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
   * Thrown an exception if the given table bucket name is not valid.
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

    // Forbidden prefixes
    const forbiddenPrefixes = ['xn--', 'sthree-', 'amzn-s3-demo-'];
    for (const prefix of forbiddenPrefixes) {
      if (bucketName.toLowerCase().startsWith(prefix)) {
        errors.push(`Bucket name must not start with the prefix '${prefix}'`);
      }
    }

    // Forbidden suffixes
    const forbiddenSuffixes = ['-s3alias', '--ol-s3', '--x-s3'];
    for (const suffix of forbiddenSuffixes) {
      if (bucketName.toLowerCase().endsWith(suffix)) {
        errors.push(`Bucket name must not end with the suffix '${suffix}'`);
      }
    }

    // IP address format check
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(bucketName)) {
      errors.push('Bucket name must not resemble an IP address');
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        `Invalid S3 bucket name (value: ${bucketName})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * The underlying CfnTableBucket L1 resource
   */
  public readonly _resource: s3tables.CfnTableBucket;
  /**
   * The resource policy for this tableBucket.
   * See TableBucket#addToResourcePolicy
   */
  public resourcePolicy: TableBucketPolicy | undefined;

  /**
   * The unique Amazon Resource Name (arn) of this table bucket
   */
  public readonly tableBucketArn: string;
  /**
   * The name of this table bucket
   */
  public readonly tableBucketName: string;

  constructor(scope: Construct, id: string, props: TableBucketProps) {
    super(scope, id, {
      physicalName: props.bucketName,
    });

    const resource = new s3tables.CfnTableBucket(this, id, {
      tableBucketName: props.bucketName,
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

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this table bucket and/or its
   * contents. Use `tableBucketArn` and `arnForObjects(keys)` to obtain ARNs for
   * this bucket or objects.
   *
   * Note that the policy statement may or may not be added to the policy.
   * For example, when an `IBucket` is created from an existing bucket,
   * it's not possible to tell whether the bucket already has a policy
   * attached, let alone to re-use that policy to add more statements to it.
   * So it's safest to do nothing in these cases.
   *
   * @param permission the policy statement to be added to the bucket's
   * policy.
   * @returns metadata about the execution of this method. If the policy
   * was not added, the value of `statementAdded` will be `false`. You
   * should always check this value to make sure that the operation was
   * actually carried out. Otherwise, synthesis and deploy will terminate
   * silently, which may be confusing.
   */
  public addToResourcePolicy(
    permission: iam.PolicyStatement,
  ): iam.AddToResourcePolicyResult {
    if (!this.resourcePolicy) {
      this.resourcePolicy = new TableBucketPolicy(this, 'Policy', {
        tableBucket: this,
      });
    }

    if (this.resourcePolicy) {
      this.resourcePolicy.document.addStatements(permission);
      return { statementAdded: true, policyDependable: this.resourcePolicy };
    }

    return { statementAdded: false };
  }
}
