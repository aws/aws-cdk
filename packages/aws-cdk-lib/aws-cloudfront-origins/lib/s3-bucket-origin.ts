import { Construct } from 'constructs';
import * as cloudfront from '../../aws-cloudfront';
import { AccessLevel } from '../../aws-cloudfront';
import * as iam from '../../aws-iam';
import { IKey } from '../../aws-kms';
import { IBucket } from '../../aws-s3';
import { Annotations, Aws, Names, Stack, UnscopedValidationError } from '../../core';

interface BucketPolicyAction {
  readonly action: string;
  readonly needsBucketArn?: boolean;
}

const BUCKET_ACTIONS: Record<string, BucketPolicyAction[]> = {
  READ: [{ action: 's3:GetObject' }],
  LIST: [{ action: 's3:ListBucket', needsBucketArn: true }],
  WRITE: [{ action: 's3:PutObject' }],
  DELETE: [{ action: 's3:DeleteObject' }],
};

const KEY_ACTIONS: Record<string, string[]> = {
  READ: ['kms:Decrypt'],
  WRITE: ['kms:Encrypt', 'kms:GenerateDataKey*'],
};

/**
 * Properties for configuring a origin using a standard S3 bucket
 */
export interface S3BucketOriginBaseProps extends cloudfront.OriginProps { }

/**
 * Properties for configuring a S3 origin with OAC
 */
export interface S3BucketOriginWithOACProps extends S3BucketOriginBaseProps {
  /**
   * An optional Origin Access Control
   *
   * @default - an Origin Access Control will be created.
   */
  readonly originAccessControl?: cloudfront.IOriginAccessControl;

  /**
   * The level of permissions granted in the bucket policy and key policy (if applicable)
   * to the CloudFront distribution.
   *
   * @default [AccessLevel.READ]
   */
  readonly originAccessLevels?: AccessLevel[];
}

/**
 * Properties for configuring a S3 origin with OAI
 */
export interface S3BucketOriginWithOAIProps extends S3BucketOriginBaseProps {
  /**
   * An optional Origin Access Identity
   *
   * @default - an Origin Access Identity will be created.
   */
  readonly originAccessIdentity?: cloudfront.IOriginAccessIdentity;
}

/**
 * A S3 Bucket Origin
 */
export abstract class S3BucketOrigin extends cloudfront.OriginBase {
  /**
   * Create a S3 Origin with Origin Access Control (OAC) configured
   */
  public static withOriginAccessControl(bucket: IBucket, props?: S3BucketOriginWithOACProps): cloudfront.IOrigin {
    return new S3BucketOriginWithOAC(bucket, props);
  }

  /**
   * Create a S3 Origin with Origin Access Identity (OAI) configured
   * OAI is a legacy feature and we **strongly** recommend you to use OAC via `withOriginAccessControl()`
   * unless it is not supported in your required region (e.g. China regions).
   */
  public static withOriginAccessIdentity(bucket: IBucket, props?: S3BucketOriginWithOAIProps): cloudfront.IOrigin {
    return new S3BucketOriginWithOAI(bucket, props);
  }

  /**
   * Create a S3 Origin with default S3 bucket settings (no origin access control)
   */
  public static withBucketDefaults(bucket: IBucket, props?: cloudfront.OriginProps): cloudfront.IOrigin {
    return new class extends S3BucketOrigin {
      constructor() {
        super(bucket, { ...props });
      }
    }();
  }

  constructor(bucket: IBucket, props?: S3BucketOriginBaseProps) {
    super(bucket.bucketRegionalDomainName, props);
  }

  /** @internal */
  protected _bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    return super.bind(scope, options);
  }

  protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
    return { originAccessIdentity: '' };
  }
}

class S3BucketOriginWithOAC extends S3BucketOrigin {
  private readonly bucket: IBucket;
  private originAccessControl?: cloudfront.IOriginAccessControl;
  private originAccessLevels?: cloudfront.AccessLevel[];

  constructor(bucket: IBucket, props?: S3BucketOriginWithOACProps) {
    super(bucket, { ...props });
    this.bucket = bucket;
    this.originAccessControl = props?.originAccessControl;
    this.originAccessLevels = props?.originAccessLevels;
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (!this.originAccessControl) {
      this.originAccessControl = new cloudfront.S3OriginAccessControl(scope, 'S3OriginAccessControl');
    }

    const distributionId = options.distributionId;
    const accessLevels = new Set(this.originAccessLevels ?? [cloudfront.AccessLevel.READ]);
    if (accessLevels.has(AccessLevel.LIST)) {
      Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:listBucketSecurityRisk',
        'When the origin with AccessLevel.LIST is associated to the default behavior, '+
        'it is strongly recommended to ensure the distribution\'s defaultRootObject is specified,\n'+
        'See the "Setting up OAC with LIST permission" section of module\'s README for more info.');
    }

    const bucketPolicyActions = this.getBucketPolicyActions(accessLevels);
    const bucketPolicyResult = this.grantDistributionAccessToBucket(distributionId!, bucketPolicyActions);

    // Failed to update bucket policy, assume using imported bucket
    if (!bucketPolicyResult.statementAdded) {
      Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateImportedBucketPolicyOac',
        'Cannot update bucket policy of an imported bucket. You will need to update the policy manually instead.\n' +
        'See the "Setting up OAC with imported S3 buckets" section of module\'s README for more info.');
    }

    if (this.bucket.encryptionKey) {
      const keyPolicyActions = this.getKeyPolicyActions(accessLevels);
      const keyPolicyResult = this.grantDistributionAccessToKey(keyPolicyActions, this.bucket.encryptionKey);
      // Failed to update key policy, assume using imported key
      if (!keyPolicyResult.statementAdded) {
        Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateImportedKeyPolicyOac',
          'Cannot update key policy of an imported key. You will need to update the policy manually instead.\n' +
          'See the "Updating imported key policies" section of the module\'s README for more info.');
      }
    }

    const originBindConfig = this._bind(scope, options);

    // Update configuration to set OriginControlAccessId property
    return {
      ...originBindConfig,
      originProperty: {
        ...originBindConfig.originProperty!,
        originAccessControlId: this.originAccessControl.originAccessControlId,
      },
    };
  }

  private getBucketPolicyActions(accessLevels: Set<cloudfront.AccessLevel>): BucketPolicyAction[] {
    return [...accessLevels].flatMap((accessLevel) => BUCKET_ACTIONS[accessLevel] ?? []);
  }

  private getKeyPolicyActions(accessLevels: Set<cloudfront.AccessLevel>): string[] {
    return [...accessLevels].flatMap((accessLevel) => KEY_ACTIONS[accessLevel] ?? []);
  }

  private grantDistributionAccessToBucket(distributionId: string, policyActions: BucketPolicyAction[]): iam.AddToResourcePolicyResult {
    const resources = [this.bucket.arnForObjects('*')];
    if (policyActions.some((pa) => pa.needsBucketArn)) {
      resources.push(this.bucket.bucketArn);
    }
    const oacBucketPolicyStatement = new iam.PolicyStatement(
      {
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: policyActions.map((pa) => pa.action),
        resources,
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/${distributionId}`,
          },
        },
      },
    );
    const result = this.bucket.addToResourcePolicy(oacBucketPolicyStatement);
    return result;
  }

  private grantDistributionAccessToKey(actions: string[], key: IKey): iam.AddToResourcePolicyResult {
    const oacKeyPolicyStatement = new iam.PolicyStatement(
      {
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions,
        resources: ['*'],
        conditions: {
          ArnLike: {
            'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/*`,
          },
        },
      },
    );
    Annotations.of(key.node.scope!).addWarningV2('@aws-cdk/aws-cloudfront-origins:wildcardKeyPolicyForOac',
      'To avoid a circular dependency between the KMS key, Bucket, and Distribution during the initial deployment, ' +
      'a wildcard is used in the Key policy condition to match all Distribution IDs.\n' +
      'After deploying once, it is strongly recommended to further scope down the policy for best security practices by ' +
      'following the guidance in the "Using OAC for a SSE-KMS encrypted S3 origin" section in the module README.');
    const result = key.addToResourcePolicy(oacKeyPolicyStatement);
    return result;
  }
}

class S3BucketOriginWithOAI extends S3BucketOrigin {
  private readonly bucket: IBucket;
  private originAccessIdentity?: cloudfront.IOriginAccessIdentity;

  constructor(bucket: IBucket, props?: S3BucketOriginWithOAIProps) {
    super(bucket, { ...props });
    this.bucket = bucket;
    this.originAccessIdentity = props?.originAccessIdentity;
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    if (!this.originAccessIdentity) {
      // Using a bucket from another stack creates a cyclic reference with
      // the bucket taking a dependency on the generated S3CanonicalUserId for the grant principal,
      // and the distribution having a dependency on the bucket's domain name.
      // Fix this by parenting the OAI in the bucket's stack when cross-stack usage is detected.
      const bucketStack = Stack.of(this.bucket);
      const bucketInDifferentStack = bucketStack !== Stack.of(scope);
      const oaiScope = bucketInDifferentStack ? bucketStack : scope;
      const oaiId = bucketInDifferentStack ? `${Names.uniqueId(scope)}S3Origin` : 'S3Origin';

      this.originAccessIdentity = new cloudfront.OriginAccessIdentity(oaiScope, oaiId, {
        comment: `Identity for ${options.originId}`,
      });
    }
    // Used rather than `grantRead` because `grantRead` will grant overly-permissive policies.
    // Only GetObject is needed to retrieve objects for the distribution.
    // This also excludes KMS permissions; OAI only supports SSE-S3 for buckets.
    // Source: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
    const result = this.bucket.addToResourcePolicy(new iam.PolicyStatement({
      resources: [this.bucket.arnForObjects('*')],
      actions: ['s3:GetObject'],
      principals: [this.originAccessIdentity.grantPrincipal],
    }));
    if (!result.statementAdded) {
      Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateImportedBucketPolicyOai',
        'Cannot update bucket policy of an imported bucket. You will need to update the policy manually instead.\n' +
        'See the "Setting up OAI with imported S3 buckets (legacy)" section of module\'s README for more info.');
    }
    return this._bind(scope, options);
  }

  protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
    if (!this.originAccessIdentity) {
      throw new UnscopedValidationError('Origin access identity cannot be undefined');
    }
    return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityId}` };
  }
}
