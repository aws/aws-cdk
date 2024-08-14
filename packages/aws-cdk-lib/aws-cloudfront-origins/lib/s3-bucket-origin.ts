import { Construct } from 'constructs';
import * as cloudfront from '../../aws-cloudfront';
import { AccessLevel } from '../../aws-cloudfront';
import * as iam from '../../aws-iam';
import { IKey } from '../../aws-kms';
import { IBucket } from '../../aws-s3';
import { Annotations, Aws, CustomResource, Names, Stack } from '../../core';
import { S3OriginAccessControlKeyPolicyProvider } from '../../custom-resource-handlers/dist/aws-cloudfront-origins/s3-origin-access-control-key-policy-provider.generated';

const BUCKET_ACTIONS = {
  READ: ['s3:GetObject'],
  WRITE: ['s3:PutObject'],
  DELETE: ['s3:DeleteObject'],
};
const S3_ORIGIN_ACCESS_CONTROL_KEY_RESOURCE_TYPE = 'Custom::S3OriginAccessControlKeyPolicy';

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
   * Create a S3 Origin with Origin Access Control (OAI) configured
   */
  public static withOriginAccessControl(bucket: IBucket, props?: S3BucketOriginWithOACProps): cloudfront.IOrigin {
    return new class extends S3BucketOrigin {
      private originAccessControl?: cloudfront.IOriginAccessControl;

      constructor() {
        super(bucket, { ...props });
        this.originAccessControl = props?.originAccessControl;
      }

      public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
        this.originAccessControl = new cloudfront.S3OriginAccessControl(scope, 'S3OriginAccessControl');

        const distributionId = options.distributionId;
        const actions = this.getActions(props?.originAccessLevels ?? [cloudfront.AccessLevel.READ]);
        const result = this.grantDistributionAccessToBucket(distributionId, actions);

        // Failed to update bucket policy, assume using imported bucket
        if (!result.statementAdded) {
          Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateBucketPolicy',
            'Cannot update bucket policy of an imported bucket. Set overrideImportedBucketPolicy to true or update the policy manually instead.');
        }

        if (bucket.encryptionKey) {
          this.grantDistributionAccessToKey(scope, distributionId, bucket.encryptionKey);
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

      getActions(accessLevels: cloudfront.AccessLevel[]) {
        let actions: string[] = [];
        for (const accessLevel of new Set(accessLevels)) {
          actions = actions.concat(BUCKET_ACTIONS[accessLevel]);
        }
        return actions;
      }

      grantDistributionAccessToBucket(distributionId: string, actions: string[]): iam.AddToResourcePolicyResult {
        const oacReadOnlyBucketPolicyStatement = new iam.PolicyStatement(
          {
            sid: 'GrantCloudFrontOACAccessToS3Origin',
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
        const result = bucket.addToResourcePolicy(oacReadOnlyBucketPolicyStatement);
        return result;
      }

      /**
       * Use custom resource to update KMS key policy
       */
      grantDistributionAccessToKey(scope: Construct, distributionId: string, key: IKey) {
        const provider = S3OriginAccessControlKeyPolicyProvider.getOrCreateProvider(scope, S3_ORIGIN_ACCESS_CONTROL_KEY_RESOURCE_TYPE,
          {
            description: 'Lambda function that updates SSE-KMS key policy to allow CloudFront distribution access.',
          });
        provider.addToRolePolicy({
          Action: ['kms:PutKeyPolicy', 'kms:GetKeyPolicy', 'kms:DescribeKey'],
          Effect: 'Allow',
          Resource: [key.keyArn],
        });

        new CustomResource(scope, 'S3OriginKMSKeyPolicyCustomResource', {
          resourceType: S3_ORIGIN_ACCESS_CONTROL_KEY_RESOURCE_TYPE,
          serviceToken: provider.serviceToken,
          properties: {
            DistributionId: distributionId,
            KmsKeyId: key.keyId,
            AccountId: bucket.env.account,
            Partition: Stack.of(scope).partition,
          },
        });
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