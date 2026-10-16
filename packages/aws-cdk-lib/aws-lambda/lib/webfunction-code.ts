import type { Construct } from 'constructs';
import type * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import type * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import * as cdk from '../../core';
import { S3ObjectCopy, copyIdentity } from './private/s3-object-copy';
import { ValidationError } from '../../core/lib/errors';
import { lit } from '../../core/lib/private/literal-string';

/**
 * S3 location for WebFunction code
 */
export interface WebFunctionS3Location {
  /**
   * The S3 bucket name
   */
  readonly bucketName: string;

  /**
   * The S3 object key
   */
  readonly objectKey: string;

  /**
   * The S3 object version (optional)
   *
   * @default - the version that is latest when the revision is created
   */
  readonly objectVersion?: string;
}

/**
 * WebFunction code configuration result
 */
export interface WebFunctionCodeConfig {
  /**
   * The S3 location of the code
   */
  readonly s3Location: WebFunctionS3Location;
}

/**
 * Options passed by `WebFunction` when binding code.
 */
export interface WebFunctionCodeBindOptions {
  /**
   * The ARN of the WebFunction the code is bound to.
   *
   * Used to scope the code-read policy to this function's revisions.
   */
  readonly webFunctionArn: string;
}

/**
 * Code for a `WebFunction`.
 *
 * WebFunction always reads its code from S3 at runtime, on every sandbox start, using the
 * Lambda service principal. The bucket holding the code must therefore have S3 versioning
 * enabled — enforced at synth time for buckets defined in the same app — and grant
 * `lambda.amazonaws.com` read access to the code object. The construct adds that grant
 * automatically on owned buckets (best-effort — imported buckets emit a warning instead).
 *
 * Bucket encryption compatibility:
 *
 * - `BucketEncryption.S3_MANAGED` (SSE-S3, AES256) — works, no key policy needed
 * - `BucketEncryption.KMS` or `BucketEncryption.DSSE` with a customer managed key —
 *   works; `kms:Decrypt` is granted to the Lambda service principal automatically
 *   (best-effort for imported keys)
 * - `BucketEncryption.KMS_MANAGED` (SSE-KMS with `aws/s3`) and
 *   `BucketEncryption.DSSE_MANAGED` — do not work: an AWS-managed key policy cannot
 *   be modified to authorize the Lambda service principal. For a bucket defined in
 *   this app this fails at synthesis; an imported bucket exposes no encryption
 *   settings, so there it surfaces as a read failure at runtime
 *
 * Use one of the static factory methods to create an instance.
 *
 * Unlike `lambda.Code`, there is deliberately no plain `fromAsset()`: each asset factory
 * names the bucket the code is staged to, so the choice is explicit at the call site.
 */
export abstract class WebFunctionCode {
  /**
   * Create WebFunction code from an S3 bucket.
   *
   * This method configures the bucket on a best-effort basis so it satisfies
   * WebFunction's runtime requirements:
   *
   * - It adds a resource policy statement granting `lambda.amazonaws.com`
   *   `s3:GetObject` and `s3:GetObjectVersion`, scoped to the given object key,
   *   to the deploying account and to the revisions of the bound WebFunction.
   *   For buckets imported by attributes (e.g.
   *   `Bucket.fromBucketName`) the policy cannot be modified from this app;
   *   ensure the bucket already carries an equivalent statement.
   * - This method does not change the bucket's versioning setting, so it is
   *   validated instead: a bucket defined in this app without
   *   `versioned: true` fails at synthesis. Imported buckets cannot be
   *   inspected, so for those the requirement is only enforced at deployment
   *   time, where WebFunction rejects a bucket that reports no object version.
   * - Encryption with an AWS-managed KMS key is asserted against for the same
   *   reason: a bucket defined in this app using `BucketEncryption.KMS_MANAGED`
   *   or `BucketEncryption.DSSE_MANAGED` fails at synthesis, since that key's
   *   policy cannot be modified to authorize the service principal. Imported
   *   buckets cannot be inspected and are assumed to be compatible.
   */
  public static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): WebFunctionCode {
    return new BucketCode(bucket, key, objectVersion);
  }

  /**
   * Create WebFunction code from a local file or directory, staged into a bucket that CDK
   * creates and configures for you.
   *
   * One bucket is created per stack and shared by every WebFunction in it that uses this
   * factory. It is configured with everything WebFunction requires: versioning, AES256
   * (SSE-S3) encryption, and a bucket policy granting `lambda.amazonaws.com` read access.
   *
   * The bucket is created with `RemovalPolicy.DESTROY` and `autoDeleteObjects`, so it is
   * removed along with the stack that owns it.
   *
   * Not supported in an environment bootstrapped with a customer managed KMS key; see the README.
   */
  public static fromAssetToManagedBucket(path: string, options?: WebFunctionManagedBucketAssetOptions): WebFunctionCode {
    return new ManagedBucketAssetCode(path, options ?? {});
  }

  /**
   * Create WebFunction code from a local file or directory, staged into a bucket you own.
   *
   * You own the bucket, so CDK only makes the narrowest change it needs: it adds a resource
   * policy statement granting `lambda.amazonaws.com` read access to this function's code, and
   * `kms:Decrypt` on the bucket's key if it is encrypted with a customer managed key. Both
   * are best-effort — on an imported bucket or key they are no-ops and a warning is emitted
   * instead, since the policy cannot be modified from this app.
   *
   * You are responsible for the bucket settings CDK cannot change:
   *
   * - S3 versioning must be enabled. This is validated at synth time for a bucket defined in
   *   the same app; an imported bucket is only caught at deployment time, where WebFunction
   *   rejects a bucket that reports no object version.
   * - Encryption must not be `BucketEncryption.KMS_MANAGED` (SSE-KMS with `aws/s3`) or
   *   `BucketEncryption.DSSE_MANAGED`, whose key policy cannot be modified to authorize the
   *   Lambda service principal. SSE-S3 and a customer managed key both work.
   *
   * Not supported in an environment bootstrapped with a customer managed KMS key; see the README.
   */
  public static fromAssetToProvidedBucket(
    bucket: s3.IBucket,
    path: string,
    options?: WebFunctionProvidedBucketAssetOptions,
  ): WebFunctionCode {
    return new ProvidedBucketAssetCode(bucket, path, options ?? {});
  }

  /**
   * Binds the code to a construct and returns the S3 location.
   *
   * @param scope - The construct scope to bind to
   * @param options - Identity of the WebFunction, used to scope the read policy
   * @returns The S3 location configuration for the code
   */
  public abstract bind(scope: Construct, options: WebFunctionCodeBindOptions): WebFunctionCodeConfig;

  /**
   * Called after the CloudFormation resource has been created, to let the code object bind
   * to it. A no-op for every current code source.
   *
   * `lambda.Code` has the same hook, and its `AssetCode` uses it to attach asset metadata
   * (`aws:asset:path` etc.) for tooling. That is deliberately not done here: of the consumers
   * of that metadata, SAM CLI local invoke does not support WebFunction, and
   * `cdk deploy --hotswap` would be semantically wrong — it performs an in-place code
   * update, whereas WebFunction's model is "create a new revision, then shift traffic".
   * An override can be added once a consumer is verified to handle WebFunction correctly.
   */
  public bindToResource(_resource: cdk.CfnResource): void {
    return;
  }
}

/**
 * Code that already lives in a compliant S3 bucket. No staging is performed.
 *
 * Not exported: consumers reach this through `WebFunctionCode.fromBucket()`, which declares
 * `WebFunctionCode` as its return type. This class adds no API beyond the base class.
 */
class BucketCode extends WebFunctionCode {
  constructor(
    private readonly bucket: s3.IBucket,
    private readonly key: string,
    private readonly objectVersion?: string,
  ) {
    super();
  }

  /**
   * Binds the code to a construct and returns the S3 location.
   *
   * Grants the Lambda service principal read access to the code object and, for a
   * bucket defined in this app, asserts that it has versioning enabled and is not
   * encrypted with an AWS-managed KMS key.
   *
   * @param scope - The construct scope to bind to
   * @param options - Identity of the WebFunction, used to scope the read policy
   * @returns The S3 location configuration for the code
   */
  public bind(scope: Construct, options: WebFunctionCodeBindOptions): WebFunctionCodeConfig {
    scope.node.addValidation({
      validate: () => [
        ...validateBucketVersioned(this.bucket, 'fromBucket'),
        ...validateBucketEncryption(this.bucket, 'fromBucket'),
      ],
    });
    grantServiceRead(this.bucket, this.key, scope, options);

    return {
      s3Location: {
        bucketName: this.bucket.bucketName,
        objectKey: this.key,
        objectVersion: this.objectVersion,
      },
    };
  }
}

/**
 * Configuration for the Lambda function that copies staged code into its destination bucket.
 *
 * The function is a stack-level singleton: every copy whose options resolve to the same
 * configuration shares one function. Supplying different options produces a separate
 * function, since a single Lambda cannot hold two conflicting configurations.
 */
export interface WebFunctionCodeCopyOptions {
  /**
   * Execution role for the Lambda function that performs the copy.
   *
   * @default - a role is created with permissions to read the source object and write the
   * destination object
   */
  readonly role?: iam.IRole;

  /**
   * The VPC to run the Lambda function in.
   *
   * Only needed if your organization requires all functions to run inside a VPC. The function
   * calls S3, so the VPC needs either a NAT gateway or an S3 VPC endpoint.
   *
   * @default - the function is not placed in a VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Which subnets to place the Lambda function in.
   *
   * Only used if `vpc` is supplied.
   *
   * @default - the VPC's private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security groups for the Lambda function.
   *
   * Only used if `vpc` is supplied.
   *
   * @default - a dedicated security group is created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The log group the Lambda function sends logs to.
   *
   * @default - a log group is created in the stack, shared by every copy that uses the same function
   */
  readonly logGroup?: logs.ILogGroupRef;
}

/**
 * Options common to the asset-based factories.
 *
 * The asset is a staging copy in the CDK asset bucket; the function serves the object the copy
 * writes to the destination bucket. So `readers` and `deployTime` apply to that staged object
 * only — read access to the code the function runs is granted on the destination bucket.
 */
export interface WebFunctionAssetOptions extends s3_assets.AssetOptions {
  /**
   * Configuration for the custom resource that copies the staged asset into the destination
   * bucket. Use this if your organization requires the copy to run in a VPC, or to supply
   * your own execution role.
   *
   * @default - the copy runs outside a VPC with a role created for it
   */
  readonly copyOptions?: WebFunctionCodeCopyOptions;
}

/**
 * Options for `WebFunctionCode.fromAssetToManagedBucket()`.
 */
export interface WebFunctionManagedBucketAssetOptions extends WebFunctionAssetOptions {
}

/**
 * Options for `WebFunctionCode.fromAssetToProvidedBucket()`.
 */
export interface WebFunctionProvidedBucketAssetOptions extends WebFunctionAssetOptions {
  /**
   * Prefix for the object key written into your bucket.
   *
   * The object is written at `<keyPrefix>web-function/<unique id>/<hash>.zip`. The prefix is
   * used as given, so include a trailing `/` to place the object under a folder-like prefix.
   *
   * The prefix also scopes the copy function's write and delete permissions on your bucket, so
   * it must not start with `/` or contain `*`, `?` or `${`, which IAM would read as a wildcard
   * or a policy variable.
   *
   * @default - objects are written under `web-function/` at the root of the bucket
   */
  readonly keyPrefix?: string;
}

/**
 * Shared implementation for code staged from a local asset.
 *
 * Both subclasses stage the asset the normal CDK way, which lands it in the bootstrap bucket,
 * and then copy it into a bucket that satisfies WebFunction's runtime requirements. The
 * bootstrap copy is a plain deploy-time asset; only the destination copy is read at runtime.
 */
abstract class StagedAssetCode extends WebFunctionCode {
  private asset?: s3_assets.Asset;

  constructor(private readonly path: string, private readonly options: WebFunctionAssetOptions) {
    super();
  }

  public bind(scope: Construct, options: WebFunctionCodeBindOptions): WebFunctionCodeConfig {
    // The asset belongs to this one function, so it hangs off `scope` rather than the stack.
    this.asset = new s3_assets.Asset(scope, 'Code', {
      path: this.path,
      ...this.options,
    });
    if (!this.asset.isZipArchive) {
      throw new ValidationError(lit`WebFunctionAssetMustBeZipFile`, `Asset must be a .zip file or a directory (${this.path})`, scope);
    }

    const destination = this.destinationBucket(scope);
    const prefix = this.destinationPrefix();
    // Everything this function's code is ever written to, across deployments.
    const functionPrefix = `${prefix}${cdk.Names.uniqueId(scope)}/`;

    // Let the subclass make sure the service principal can read the object it is about to
    // write, and that nothing reading it is created before that grant exists. The managed
    // bucket carries a wildcard statement already and only needs the ordering; a caller-provided
    // bucket gets a statement scoped to this function's objects. The grant covers the folder
    // rather than the one key so that it stays the same when the code changes: the revision
    // being replaced keeps reading its own object until the deployment completes.
    this.grantDestinationRead(destination, `${functionPrefix}*`, scope, options);

    // Each copy gets its own key and its own construct id, both derived from the source object
    // and the copy function's configuration (including the destination). Whenever the copy
    // resource is replaced, its key is new as well. CloudFormation deletes the old resource in
    // the cleanup phase, through its own ServiceToken, and that Delete removes only the old key,
    // never the object the new revision reads. Deriving the id from the copy function also keeps
    // the ServiceToken of a resource fixed, which CloudFormation does not allow to change.
    const copyProps = {
      destinationBucket: destination,
      destinationKeyPattern: `${prefix}*`,
      ...this.options.copyOptions,
    };
    const identity = copyIdentity(copyProps, this.asset.assetHash);
    const copy = new S3ObjectCopy(scope, `CodeCopy${identity.slice(0, 8)}`, {
      ...copyProps,
      sourceBucket: this.asset.bucket,
      sourceKey: this.asset.s3ObjectKey,
      destinationKey: `${functionPrefix}${identity}.zip`,
    });

    return {
      // The full address comes from the copy's outputs — what was actually written — rather
      // than being reassembled from this method's inputs.
      s3Location: {
        bucketName: copy.destinationBucketName,
        objectKey: copy.destinationObjectKey,
        objectVersion: copy.versionId,
      },
    };
  }

  /** The bucket the code is copied into. */
  protected abstract destinationBucket(scope: Construct): s3.IBucket;

  /**
   * The key prefix everything this module writes to the destination bucket lives under.
   *
   * The copy function may write, delete and list under it. It is shared by every function
   * copying into the bucket, so the copy function's policy has one set of statements per
   * bucket rather than one per function.
   */
  protected abstract destinationPrefix(): string;

  /**
   * Grant the Lambda service principal read access to the copied objects matching `keyPattern`.
   *
   * The default does nothing, for destinations that already carry a suitable statement.
   */
  protected grantDestinationRead(
    _bucket: s3.IBucket, _keyPattern: string, _scope: Construct, _options: WebFunctionCodeBindOptions,
  ): void {
    return;
  }
}

/**
 * Code staged into a per-stack bucket that CDK creates and configures.
 */
class ManagedBucketAssetCode extends StagedAssetCode {
  constructor(path: string, options: WebFunctionManagedBucketAssetOptions) {
    super(path, options);
  }

  protected destinationBucket(scope: Construct): s3.IBucket {
    return getOrCreateAssetBucket(scope);
  }

  protected grantDestinationRead(bucket: s3.IBucket, _keyPattern: string, scope: Construct): void {
    // The statement is already on the bucket, added once when the bucket was created. What
    // each function still needs is the ordering: the service reads the code through that
    // policy when the revision is created, so the revision must not exist before the policy
    // does. The bucket is always one this module created, so its policy is always present.
    if (bucket.policy) {
      scope.node.addDependency(bucket.policy);
    }
  }

  protected destinationPrefix(): string {
    // The bucket is CDK-owned and holds only WebFunction code, so this covers all of it.
    return CODE_KEY_SEGMENT;
  }
}

/**
 * Code staged into a bucket supplied by the customer.
 */
class ProvidedBucketAssetCode extends StagedAssetCode {
  constructor(
    private readonly bucket: s3.IBucket,
    path: string,
    private readonly providedOptions: WebFunctionProvidedBucketAssetOptions,
  ) {
    super(path, providedOptions);
  }

  protected destinationBucket(scope: Construct): s3.IBucket {
    validateKeyPrefix(this.providedOptions.keyPrefix, scope);
    scope.node.addValidation({
      validate: () => [
        ...validateBucketVersioned(this.bucket, 'fromAssetToProvidedBucket'),
        ...validateBucketEncryption(this.bucket, 'fromAssetToProvidedBucket'),
      ],
    });
    return this.bucket;
  }

  protected destinationPrefix(): string {
    // Only what this module writes under the caller's prefix; the caller's own objects under
    // the same prefix stay out of reach.
    return `${this.providedOptions.keyPrefix ?? ''}${CODE_KEY_SEGMENT}`;
  }

  /**
   * The caller owns this bucket, so CDK adds only the one statement the service needs to read
   * this function's code — scoped to its objects, not to the whole bucket.
   */
  protected grantDestinationRead(
    bucket: s3.IBucket, keyPattern: string, scope: Construct, options: WebFunctionCodeBindOptions,
  ): void {
    grantServiceRead(bucket, keyPattern, scope, options);
  }
}

/**
 * Grant the Lambda service principal read access to code objects.
 *
 * The statement is scoped to `key` — one object key, or a pattern such as a function's folder —
 * and conditioned on `aws:SourceAccount`
 * and `aws:SourceArn`. The service reads the object on behalf
 * of a revision and presents the revision ARN as the source, so the condition matches
 * `<webFunctionArn>/revision/*`. For imported buckets `addToResourcePolicy` is a no-op, so this
 * is best-effort by construction: for those the caller has to carry an equivalent statement
 * already, otherwise `CreateWebFunctionRevision` rejects the deployment.
 */
function grantServiceRead(
  bucket: s3.IBucket, key: string, scope: Construct, options: WebFunctionCodeBindOptions,
): void {
  const result = bucket.addToResourcePolicy(new iam.PolicyStatement({
    principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
    actions: ['s3:GetObject', 's3:GetObjectVersion'],
    resources: [bucket.arnForObjects(key)],
    conditions: {
      StringEquals: {
        'aws:SourceAccount': cdk.Stack.of(scope).account,
      },
      ArnLike: { 'aws:SourceArn': `${options.webFunctionArn}/revision/*` },
    },
  }));

  // Make sure the revision is not created before the policy exists,
  // since the service reads the code object through this policy.
  if (result.policyDependable) {
    scope.node.addDependency(result.policyDependable);
  }

  if (!result.statementAdded) {
    cdk.Annotations.of(scope).addWarningV2(
      '@aws-cdk/aws-lambda:webFunctionImportedCodeBucketPolicy',
      `Cannot inspect or modify the imported bucket '${bucket.node.path}', so none of the ` +
      'requirements WebFunction places on a code bucket are checked for it. Ensure yourself ' +
      'that it has versioning enabled, that it is not encrypted with an AWS managed KMS key ' +
      '(the key policy cannot be changed to let Lambda decrypt), and that it grants ' +
      'lambda.amazonaws.com s3:GetObject and s3:GetObjectVersion on the code object.',
    );
  }

  // For a CMK-encrypted bucket, the Lambda service principal also needs
  // kms:Decrypt on the bucket's key. The service reads the object every
  // time a sandbox starts, so this is a permanent dependency, not a
  // create-time one. `encryptionKey` is undefined for SSE-S3 and SSE-KMS
  // (aws/s3), so this only runs on CMK buckets.
  const encryptionKey = bucket.encryptionKey;
  if (encryptionKey !== undefined) {
    encryptionKey.grantDecrypt(new iam.ServicePrincipal('lambda.amazonaws.com', {
      conditions: {
        StringEquals: {
          'aws:SourceAccount': cdk.Stack.of(scope).account,
        },
        // Scope to WebFunction revisions in this account, matching the S3 code-read grant.
        // Use the account-wide `web-function/*/revision/*` wildcard rather than this
        // function's concrete ARN: a per-function condition would add one distinct statement
        // per function to a shared key's policy (growth toward the size limit), whereas the
        // wildcard is identical across functions and collapses to a single statement.
        ArnLike: {
          'aws:SourceArn': cdk.Stack.of(scope).formatArn({
            service: 'lambda',
            resource: 'web-function',
            resourceName: '*/revision/*',
            arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
          }),
        },
      },
    }));
    if (!cdk.Resource.isOwnedResource(encryptionKey)) {
      cdk.Annotations.of(scope).addWarningV2(
        '@aws-cdk/aws-lambda:webFunctionImportedCodeBucketKmsKey',
        'Cannot grant kms:Decrypt to lambda.amazonaws.com on the imported KMS key ' +
        'used by the code bucket. Grant it manually on the key policy.',
      );
    }
  }
}

// Namespaced like other stack-level singletons (`AWSCDKCfnUtilsProvider`) so a customer
// construct is unlikely to occupy it. The id feeds the bucket's logical ID, so it is permanent.
const ASSET_BUCKET_ID = 'AWSCDKWebFunctionAssetBucket';

/**
 * Segment that every code object is written under, whichever bucket it goes to. It gives the
 * copy function's delete grant something narrower than the whole bucket to attach to, while
 * still covering every key this module has ever written there — including the one a renamed
 * construct leaves behind, which the grant must be able to remove.
 */
const CODE_KEY_SEGMENT = 'web-function/';

/**
 * Stamped on buckets created by `getOrCreateAssetBucket`, so adoption can verify identity rather
 * than type. A customer construct occupying
 * the reserved id — even an `s3.Bucket` — would skip the configuration (versioning, encryption,
 * service-principal policy) this module relies on. `Symbol.for` makes the marker shared across
 * copies of this library in one app, so a second copy recognizes the bucket instead of
 * reporting a collision.
 */
const ASSET_BUCKET_SYMBOL = Symbol.for('@aws-cdk/aws-lambda.WebFunctionAssetBucket');

/**
 * Get or create the stack's code bucket.
 *
 * The bucket is created under the stack, not under whichever WebFunction happened to need it
 * first. If it hung off a function, its logical ID would depend on declaration order, and
 * reordering or removing that function would make CloudFormation read the change as "delete
 * one bucket, create another" - breaking every revision that pins an object version in it.
 */
function getOrCreateAssetBucket(scope: Construct): s3.IBucket {
  const stack = cdk.Stack.of(scope);

  const existing = stack.node.tryFindChild(ASSET_BUCKET_ID);
  if (existing) {
    if (!(existing as any)[ASSET_BUCKET_SYMBOL]) {
      throw new ValidationError(
        lit`WebFunctionAssetBucketIdCollision`,
        `The construct id '${ASSET_BUCKET_ID}' at the stack root is reserved for the code bucket ` +
        'created by WebFunctionCode.fromAssetToManagedBucket(). Rename the conflicting construct, ' +
        'or use WebFunctionCode.fromAssetToProvidedBucket() to stage code into your own bucket.',
        scope,
      );
    }
    return existing as s3.Bucket;
  }

  const bucket = new s3.Bucket(stack, ASSET_BUCKET_ID, {
    // Each revision pins one object version for its lifetime.
    versioned: true,
    // The AWS managed key (aws/s3) is unusable: its key policy cannot be changed to grant the
    // Lambda service principal, and the service reads the code at runtime.
    encryption: s3.BucketEncryption.S3_MANAGED,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    // Fixed rather than configurable. Retaining the bucket would not retain any code: each
    // copy resource deletes every version of its own object when it leaves the stack, so a
    // retained bucket is an empty one the customer has to delete by hand.
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  // Granted on the whole code segment rather than per function: a shared bucket would
  // otherwise accumulate one statement per function and approach the 20 KB bucket policy
  // limit. The source condition is widened to match, to any WebFunction revision in this
  // account, so the statement still refuses reads the service performs on behalf of anything
  // else.
  bucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject', 's3:GetObjectVersion'],
    principals: [new iam.ServicePrincipal('lambda.amazonaws.com')],
    resources: [bucket.arnForObjects(`${CODE_KEY_SEGMENT}*`)],
    conditions: {
      StringEquals: {
        'aws:SourceAccount': cdk.Aws.ACCOUNT_ID,
      },
      ArnLike: {
        'aws:SourceArn': stack.formatArn({
          service: 'lambda',
          resource: 'web-function',
          resourceName: '*/revision/*',
          arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
        }),
      },
    },
  }));

  Object.defineProperty(bucket, ASSET_BUCKET_SYMBOL, { value: true });

  return bucket;
}

/**
 * Validate that a code bucket defined in this app is not encrypted with an AWS-managed KMS key.
 *
 * The service reads the code object as `lambda.amazonaws.com`, which can only be authorized
 * on the key policy — and the policy of an AWS-managed key (`aws/s3`) cannot be modified.
 * `bucket.encryptionKey` is undefined both for SSE-S3 and for an AWS-managed key, so the two
 * are told apart on the L1 instead: an AWS-managed key means a KMS algorithm with no key id.
 * Imported buckets expose no encryption settings and are skipped.
 *
 * @param factory the `WebFunctionCode` factory to name in the error message
 */
/**
 * Reject a key prefix that would widen the copy function's grants on the caller's bucket.
 *
 * The prefix is used verbatim in the IAM resource ARNs and the `s3:prefix` condition that scope
 * the copy function's writes, deletes and version listing. There, `*` and `?` are wildcards and
 * `${` starts a policy variable, so any of them reaches beyond `web-function/`. A leading `/`
 * gives keys that start with an empty path segment, which is never intended.
 *
 * A token cannot be checked, so it only gets a warning.
 */
function validateKeyPrefix(keyPrefix: string | undefined, scope: Construct): void {
  if (keyPrefix === undefined) {
    return;
  }
  if (cdk.Token.isUnresolved(keyPrefix)) {
    cdk.Annotations.of(scope).addWarningV2('@aws-cdk/aws-lambda:webFunctionKeyPrefixUnresolved',
      'keyPrefix is a deploy-time value and cannot be checked. It scopes the copy function\'s permissions ' +
      'on your bucket, so make sure it does not start with \'/\' or contain \'*\', \'?\' or \'${\'.');
    return;
  }
  if (keyPrefix.startsWith('/') || /[*?]|\$\{/.test(keyPrefix)) {
    throw new ValidationError(lit`WebFunctionKeyPrefixInvalid`,
      `keyPrefix '${keyPrefix}' must not start with '/' or contain '*', '?' or '\${'. It scopes the copy ` +
      'function\'s permissions on your bucket, where these would widen them.', scope);
  }
}

/**
 * Whether a bucket's KMS key id names the AWS-managed `aws/s3` key by its alias, either as
 * `alias/aws/s3` or as an alias ARN.
 *
 * An alias ARN built from the stack's partition, Region or account is a token, as it is for
 * `kms.Alias.fromAliasName()`. It resolves to an `Fn::Join` whose literal tail still ends with
 * the alias name, so that tail is checked instead.
 */
function namesAwsManagedS3Key(bucket: s3.IBucket, kmsMasterKeyId: string): boolean {
  const AWS_MANAGED_ALIAS = 'alias/aws/s3';
  if (!cdk.Token.isUnresolved(kmsMasterKeyId)) {
    return kmsMasterKeyId.endsWith(AWS_MANAGED_ALIAS);
  }
  const resolved = cdk.Stack.of(bucket).resolve(kmsMasterKeyId);
  const parts = resolved?.['Fn::Join']?.[1];
  const last = Array.isArray(parts) ? parts[parts.length - 1] : undefined;
  return typeof last === 'string' && last.endsWith(AWS_MANAGED_ALIAS);
}

function validateBucketEncryption(bucket: s3.IBucket, factory: string): string[] {
  const cfnBucket = bucket.node.defaultChild;
  if (!s3.CfnBucket.isCfnBucket(cfnBucket)) {
    // Imported bucket (or an exotic construct tree): nothing to inspect.
    return [];
  }

  const encryption = cfnBucket.bucketEncryption;
  if (encryption === undefined || !cdk.Token.isResolved(encryption)) {
    return [];
  }

  const rules = encryption.serverSideEncryptionConfiguration;
  if (rules === undefined || !cdk.Token.isResolved(rules)) {
    return [];
  }

  for (const rule of rules) {
    if (!cdk.Token.isResolved(rule)) {
      continue;
    }
    const applied = rule.serverSideEncryptionByDefault;
    if (applied === undefined || !cdk.Token.isResolved(applied)) {
      continue;
    }

    const { sseAlgorithm, kmsMasterKeyId } = applied;
    if (!cdk.Token.isResolved(sseAlgorithm)) {
      continue;
    }

    // Under a KMS algorithm, no key id means the AWS-managed key, covering both `KMS_MANAGED`
    // (`aws:kms`) and `DSSE_MANAGED` (`aws:kms:dsse`). The same key can also be named
    // explicitly through its alias. Any other key id is taken to be a customer managed key,
    // whose policy can be granted on; the AWS-managed key's own key ARN cannot be recognized.
    if (sseAlgorithm.startsWith('aws:kms') &&
      (kmsMasterKeyId === undefined || namesAwsManagedS3Key(bucket, kmsMasterKeyId))) {
      return [
        `The bucket '${bucket.node.path}' used with WebFunctionCode.${factory}() is encrypted with an ` +
        'AWS-managed KMS key, whose key policy cannot be modified to authorize lambda.amazonaws.com to read ' +
        'the code object. Use `BucketEncryption.S3_MANAGED`, or a customer managed key.',
      ];
    }
  }

  return [];
}

/**
 * Validate that a code bucket defined in this app has versioning enabled.
 *
 * Versioning is a create-time bucket setting that cannot be changed through
 * `IBucket`, so it is validated rather than configured. Imported buckets
 * expose no versioning information and are skipped; for those the requirement
 * is only enforced at deployment time, where WebFunction rejects a bucket that
 * reports no object version.
 *
 * @param factory the `WebFunctionCode` factory to name in the error message
 */
function validateBucketVersioned(bucket: s3.IBucket, factory: string): string[] {
  const cfnBucket = bucket.node.defaultChild;
  if (!s3.CfnBucket.isCfnBucket(cfnBucket)) {
    // Imported bucket (or an exotic construct tree): nothing to inspect.
    return [];
  }

  const versioning = cfnBucket.versioningConfiguration;
  if (cdk.Token.isUnresolved(versioning)) {
    // Configuration is a token; cannot be inspected at synth time.
    return [];
  }

  const status = (versioning as s3.CfnBucket.VersioningConfigurationProperty | undefined)?.status;
  if (cdk.Token.isUnresolved(status)) {
    return [];
  }

  if (status !== 'Enabled') {
    return [
      `The bucket '${bucket.node.path}' used with WebFunctionCode.${factory}() must have versioning enabled ` +
      '(set `versioned: true` on the Bucket).',
    ];
  }

  return [];
}
