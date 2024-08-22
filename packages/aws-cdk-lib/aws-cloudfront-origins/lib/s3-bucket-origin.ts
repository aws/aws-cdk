import { Construct } from 'constructs';
import * as cloudfront from '../../aws-cloudfront';
import { AccessLevel } from '../../aws-cloudfront';
import * as iam from '../../aws-iam';
import { IKey } from '../../aws-kms';
import { IBucket } from '../../aws-s3';
import { Annotations, Aws, DefaultTokenResolver, Names, Stack, StringConcat, Token, Tokenization } from '../../core';

const BUCKET_ACTIONS: Record<string, string[]> = {
  READ: ['s3:GetObject'],
  WRITE: ['s3:PutObject'],
  DELETE: ['s3:DeleteObject'],
};

const KEY_ACTIONS: Record<string, string[]> = {
  READ: ['kms:Decrypt'],
  WRITE: ['kms:Encrypt', 'kms:GenerateDataKey*'],
};

/**
 * Properties for configuring a origin using a standard S3 bucket
 */
export interface S3BucketOriginBaseProps extends cloudfront.OriginProps {}

/**
 * Properties for configuring a S3 origin with OAC
 */
export interface S3BucketOriginWithOACProps extends S3BucketOriginBaseProps {
  /**
  * An optional Origin Access Control
  * @default - an Origin Access Control will be created.
  */
  readonly originAccessControl?: cloudfront.IOriginAccessControl;

  /**
   * The level of permissions granted in the bucket policy and key policy (if applicable)
   * to the CloudFront distribution.
   * @default AccessLevel.READ
   */
  readonly originAccessLevels?: AccessLevel[];
}

/**
 * Properties for configuring a S3 origin with OAI
 */
export interface S3BucketOriginWithOAIProps extends S3BucketOriginBaseProps {
  /**
  * An optional Origin Access Identity
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
    return new class extends S3BucketOrigin {
      private originAccessControl?: cloudfront.IOriginAccessControl;

      constructor() {
        super(bucket, { ...props });
        this.originAccessControl = props?.originAccessControl;
      }

      public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
        if (!this.originAccessControl) {
          this.originAccessControl = new cloudfront.S3OriginAccessControl(scope, 'S3OriginAccessControl');
        }

        const distributionId = options.distributionId;
        const bucketPolicyActions = this.getBucketPolicyActions(props?.originAccessLevels ?? [cloudfront.AccessLevel.READ]);
        const bucketPolicyResult = this.grantDistributionAccessToBucket(distributionId!, bucketPolicyActions);

        // Failed to update bucket policy, assume using imported bucket
        if (!bucketPolicyResult.statementAdded) {
          Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateImportedBucketPolicy',
            'Cannot update bucket policy of an imported bucket. You may need to update the policy manually instead.');
        }

        if (bucket.encryptionKey) {
          let bucketName = bucket.bucketName;
          if (Token.isUnresolved(bucket.bucketName)) {
            bucketName = JSON.stringify(Tokenization.resolve(bucket.bucketName, {
              scope,
              resolver: new DefaultTokenResolver(new StringConcat()),
            }));
          }
          Annotations.of(scope).addInfo(
            `Granting OAC permissions to access KMS key for S3 bucket origin ${bucketName} may cause a circular dependency error when this stack deploys.\n` +
            'The key policy references the distribution\'s id, the distribution references the bucket, and the bucket references the key.\n'+
            'See the "Using OAC for a SSE-KMS encrypted S3 origin" section in the module README for more details.\n',
          );

          const keyPolicyActions = this.getKeyPolicyActions(props?.originAccessLevels ?? [cloudfront.AccessLevel.READ]);
          const keyPolicyResult = this.grantDistributionAccessToKey(distributionId!, keyPolicyActions, bucket.encryptionKey);
          // Failed to update key policy, assume using imported key
          if (!keyPolicyResult.statementAdded) {
            Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateImportedKeyPolicy',
              'Cannot update key policy of an imported key. You may need to update the policy manually instead.');
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

      getBucketPolicyActions(accessLevels: cloudfront.AccessLevel[]) {
        let actions: string[] = [];
        for (const accessLevel of new Set(accessLevels)) {
          actions = actions.concat(BUCKET_ACTIONS[accessLevel]);
        }
        return actions;
      }

      getKeyPolicyActions(accessLevels: cloudfront.AccessLevel[]) {
        let actions: string[] = [];
        // Remove duplicates and filters out DELETE since delete permissions are not applicable to KMS key actions
        const keyAccessLevels = [...new Set(accessLevels.filter(level => level !== AccessLevel.DELETE))];
        for (const accessLevel of new Set(keyAccessLevels)) {
          actions = actions.concat(KEY_ACTIONS[accessLevel]);
        }
        return actions;
      }

      grantDistributionAccessToBucket(distributionId: string, actions: string[]): iam.AddToResourcePolicyResult {
        const oacBucketPolicyStatement = new iam.PolicyStatement(
          {
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            actions,
            resources: [bucket.arnForObjects('*')],
            conditions: {
              StringEquals: {
                'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/${distributionId}`,
              },
            },
          },
        );
        const result = bucket.addToResourcePolicy(oacBucketPolicyStatement);
        return result;
      }

      grantDistributionAccessToKey(distributionId: string, actions: string[], key: IKey): iam.AddToResourcePolicyResult {
        const oacKeyPolicyStatement = new iam.PolicyStatement(
          {
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            actions,
            resources: ['*'],
            conditions: {
              StringEquals: {
                'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/${distributionId}`,
              },
            },
          },
        );
        const result = key.addToResourcePolicy(oacKeyPolicyStatement);
        return result;
      }
    }();
  }

  /**
   * Create a S3 Origin with Origin Access Identity (OAI) configured
   */
  public static withOriginAccessIdentity(bucket: IBucket, props?: S3BucketOriginWithOAIProps): cloudfront.IOrigin {
    return new class extends S3BucketOrigin {
      private originAccessIdentity?: cloudfront.IOriginAccessIdentity;

      constructor() {
        super(bucket, { ...props });
        this.originAccessIdentity = props?.originAccessIdentity;
      }

      public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
        if (!this.originAccessIdentity) {
          // Using a bucket from another stack creates a cyclic reference with
          // the bucket taking a dependency on the generated S3CanonicalUserId for the grant principal,
          // and the distribution having a dependency on the bucket's domain name.
          // Fix this by parenting the OAI in the bucket's stack when cross-stack usage is detected.
          const bucketStack = Stack.of(bucket);
          const bucketInDifferentStack = bucketStack !== Stack.of(scope);
          const oaiScope = bucketInDifferentStack ? bucketStack : scope;
          const oaiId = bucketInDifferentStack ? `${Names.uniqueId(scope)}S3Origin` : 'S3Origin';

          this.originAccessIdentity = new cloudfront.OriginAccessIdentity(oaiScope, oaiId, {
            comment: `Identity for ${options.originId}`,
          });
        };
        // Used rather than `grantRead` because `grantRead` will grant overly-permissive policies.
        // Only GetObject is needed to retrieve objects for the distribution.
        // This also excludes KMS permissions; currently, OAI only supports SSE-S3 for buckets.
        // Source: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
        bucket.addToResourcePolicy(new iam.PolicyStatement({
          resources: [bucket.arnForObjects('*')],
          actions: ['s3:GetObject'],
          principals: [this.originAccessIdentity.grantPrincipal],
        }));
        return this._bind(scope, options);
      }

      protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
        if (!this.originAccessIdentity) {
          throw new Error('Origin access identity cannot be undefined');
        }
        return { originAccessIdentity: `origin-access-identity/cloudfront/${this.originAccessIdentity.originAccessIdentityId}` };
      }
    }();
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

  constructor(bucket: IBucket, props: S3BucketOriginBaseProps) {
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