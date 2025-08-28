import { Construct } from 'constructs';
import { IResource, RemovalPolicy, Resource, Token, UnscopedValidationError } from 'aws-cdk-lib/core';
import { ITableBucket } from './table-bucket';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { CfnNamespace } from 'aws-cdk-lib/aws-s3tables';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { EOL } from 'os';

/**
 * Represents an S3 Tables Namespace.
 */
export interface INamespace extends IResource {
  /**
   * The name of this namespace
   * @attribute
   */
  readonly namespaceName: string;

  /**
   * The table bucket which this namespace belongs to
   * @attribute
   */
  readonly tableBucket: ITableBucket;
}

/**
 * Parameters for constructing a Namespace
 */
export interface NamespaceProps {
  /**
   * A name for the namespace
   */
  readonly namespaceName: string;
  /**
   * The table bucket this namespace belongs to.
   */
  readonly tableBucket: ITableBucket;
  /**
   * Policy to apply when the policy is removed from this stack.
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Attributes for importing an existing namespace
 */
export interface NamespaceAttributes {
  /**
   * The name of the namespace
   */
  readonly namespaceName: string;

  /**
   * The table bucket this namespace belongs to
   */
  readonly tableBucket: ITableBucket;
}

/**
 * An S3 Tables Namespace with helpers.
 *
 * A namespace is a logical container for tables within a table bucket.
 */
@propertyInjectable
export class Namespace extends Resource implements INamespace {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3tables-alpha.Namespace';

  /**
   * Import an existing namespace from its attributes
   */
  public static fromNamespaceAttributes(scope: Construct, id: string, attrs: NamespaceAttributes): INamespace {
    class Import extends Resource implements INamespace {
      public readonly namespaceName = attrs.namespaceName;
      public readonly tableBucket = attrs.tableBucket;
    }

    return new Import(scope, id);
  }
  /**
   * See https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-buckets-naming.html
   * @param namespaceName Name of the namespace
   * @throws UnscopedValidationError if any naming errors are detected
   */
  public static validateNamespaceName(namespaceName: string) {
    if (namespaceName == undefined || Token.isUnresolved(namespaceName)) {
      // the name is a late-bound value, not a defined string, so skip validation
      return;
    }

    const errors: string[] = [];

    // Length validation
    if (namespaceName.length < 1 || namespaceName.length > 255) {
      errors.push(
        'Namespace name must be at least 1 and no more than 255 characters',
      );
    }

    // Character set validation
    const illegalCharsetRegEx = /[^a-z0-9_]/;
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;

    const illegalCharMatch = namespaceName.match(illegalCharsetRegEx);
    if (illegalCharMatch) {
      errors.push(
        'Namespace name must only contain lowercase characters, numbers, and underscores (_)' +
          ` (offset: ${illegalCharMatch.index})`,
      );
    }

    // Edge character validation
    if (!allowedEdgeCharsetRegEx.test(namespaceName.charAt(0))) {
      errors.push(
        'Namespace name must start with a lowercase letter or number (offset: 0)',
      );
    }
    if (
      !allowedEdgeCharsetRegEx.test(namespaceName.charAt(namespaceName.length - 1))
    ) {
      errors.push(
        `Namespace name must end with a lowercase letter or number (offset: ${
          namespaceName.length - 1
        })`,
      );
    }

    if (namespaceName.startsWith('aws')) {
      errors.push('Namespace name must not start with reserved prefix \'aws\'');
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        `Invalid S3 Tables namespace name (value: ${namespaceName})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * @internal The underlying namespace resource.
   */
  private readonly _resource: CfnNamespace;

  /**
   * The name of this namespace
   */
  public readonly namespaceName: string;

  /**
   * The table bucket which this namespace belongs to
   */
  public readonly tableBucket: ITableBucket;

  constructor(scope: Construct, id: string, props: NamespaceProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    Namespace.validateNamespaceName(props.namespaceName);

    this.tableBucket = props.tableBucket;
    this.namespaceName = props.namespaceName;
    this._resource = new CfnNamespace(this, id, {
      namespace: props.namespaceName,
      tableBucketArn: this.tableBucket.tableBucketArn,
    });

    if (props.removalPolicy) {
      this._resource.applyRemovalPolicy(props.removalPolicy);
    }
  }
}
