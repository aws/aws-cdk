import { Construct } from 'constructs';
import { HttpOrigin } from './http-origin';
import * as cloudfront from '../../aws-cloudfront';
import * as iam from '../../aws-iam';
import { IKey } from '../../aws-kms';
import * as s3 from '../../aws-s3';
import { Stack, Names, FeatureFlags, Aws, CustomResource, Annotations } from '../../core';
import { S3OriginAccessControlBucketPolicyProvider } from '../../custom-resource-handlers/dist/aws-cloudfront-origins/s3-origin-access-control-bucket-policy-provider.generated';
import { S3OriginAccessControlKeyPolicyProvider } from '../../custom-resource-handlers/dist/aws-cloudfront-origins/s3-origin-access-control-key-policy-provider.generated';
import * as cxapi from '../../cx-api';

const S3_ORIGIN_ACCESS_CONTROL_KEY_RESOURCE_TYPE = 'Custom::S3OriginAccessControlKeyPolicyUpdater';
const S3_ORIGIN_ACCESS_CONTROL_BUCKET_RESOURCE_TYPE = 'Custom::S3OriginAccessControlBucketPolicyUpdater';

const BUCKET_ACTIONS: Record<string, string[]> = {
  READ: ['s3:GetObject'],
  WRITE: ['s3:PutObject'],
  DELETE: ['s3:DeleteObject'],
};

/**
 * Properties to use to customize an S3 Origin.
 */
export interface S3OriginProps extends cloudfront.OriginProps {
  /**
   * An optional Origin Access Identity of the origin identity cloudfront will use when calling your s3 bucket.
   *
   * @default - An Origin Access Identity will be created.
   */
  readonly originAccessIdentity?: cloudfront.IOriginAccessIdentity;

  /**
   * An optional Origin Access Control
   * @default - An Origin Access Control will be created.
   */
  readonly originAccessControl?: cloudfront.IOriginAccessControl;

  /**
   * When set to 'true', a best-effort attempt will be made to update the bucket policy to allow the
   * CloudFront distribution access.
   * @default false
   */
  readonly overrideImportedBucketPolicy?: boolean;

  /**
   * The level of permissions granted in the bucket policy and key policy (if applicable)
   * to the CloudFront distribution. This property only applies to OAC (not OAI).
   * @default AccessLevel.READ
   */
  readonly originAccessLevels?: AccessLevel[];
}

/**
 * The types of permissions to grant OAC access to th S3 origin
 */
export enum AccessLevel {
  /**
   * Grants 's3:GetObject' permission to OAC
   */
  READ = 'READ',
  /**
   * Grants 's3:PutObject' permission to OAC
   */
  WRITE = 'WRITE',
  /**
   * Grants 's3:DeleteObject' permission to OAC
   */
  DELETE = 'DELETE',
}

/**
 * An Origin that is backed by an S3 bucket.
 *
 * If the bucket is configured for website hosting, this origin will be configured to use the bucket as an
 * HTTP server origin and will use the bucket's configured website redirects and error handling. Otherwise,
 * the origin is created as a bucket origin and will use CloudFront's redirect and error handling.
 */
export class S3Origin implements cloudfront.IOrigin {
  private readonly origin: cloudfront.IOrigin;

  constructor(bucket: s3.IBucket, props: S3OriginProps = {}) {
    if (props.originAccessControl && props.originAccessIdentity) {
      throw new Error('Only one of originAccessControl or originAccessIdentity can be specified for an origin.');
    }

    if (bucket.isWebsite) {
      this.origin = new HttpOrigin(bucket.bucketWebsiteDomainName, {
        protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY, // S3 only supports HTTP for website buckets
        ...props,
      });
    } else if (props.originAccessControl) {
      this.origin = S3BucketOrigin.withAccessControl(bucket, props);
    } else if (props.originAccessIdentity) {
      this.origin = S3BucketOrigin.withAccessIdentity(bucket, props);
    } else {
      this.origin = FeatureFlags.of(bucket.stack)
        .isEnabled(cxapi.CLOUDFRONT_USE_ORIGIN_ACCESS_CONTROL_BY_DEFAULT) ?
        S3BucketOrigin.withAccessControl(bucket, props) :
        S3BucketOrigin.withAccessIdentity(bucket, props);
    }
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    return this.origin.bind(scope, options);
  }
}

/**
 * An Origin specific to a S3 bucket (not configured for website hosting).
 *
 * Contains additional logic around bucket permissions and origin access control (via OAI or OAC).
 */
abstract class S3BucketOrigin extends cloudfront.OriginBase {
  public static withAccessIdentity(bucket: s3.IBucket, props: S3OriginProps = {}): S3BucketOrigin {
    return new (class OriginAccessIdentity extends S3BucketOrigin {
      private originAccessIdentity?: cloudfront.IOriginAccessIdentity;

      public constructor() {
        super(bucket, props);
        this.originAccessIdentity = props.originAccessIdentity;
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
        };
        // Used rather than `grantRead` because `grantRead` will grant overly-permissive policies.
        // Only GetObject is needed to retrieve objects for the distribution.
        // This also excludes KMS permissions; currently, OAI only supports SSE-S3 for buckets.
        // Source: https://aws.amazon.com/blogs/networking-and-content-delivery/serving-sse-kms-encrypted-content-from-s3-using-cloudfront/
        this.bucket.addToResourcePolicy(new iam.PolicyStatement({
          resources: [this.bucket.arnForObjects('*')],
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
    })();
  }

  public static withAccessControl(bucket: s3.IBucket, props: S3OriginProps = {}): S3BucketOrigin {
    return new (class OriginAccessControl extends S3BucketOrigin {
      private originAccessControl?: cloudfront.IOriginAccessControl;

      constructor() {
        super(bucket, props);
        this.originAccessControl = props.originAccessControl;
      }

      public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
        if (!this.originAccessControl) {
          // Create a new origin access control if not specified
          this.originAccessControl = new cloudfront.OriginAccessControl(scope, 'S3OriginAccessControl');
        }

        if (this.originAccessControl.originAccessControlOriginType !== cloudfront.OriginAccessControlOriginType.S3) {
          throw new Error(`Origin access control for an S3 origin must have origin type '${cloudfront.OriginAccessControlOriginType.S3}', got origin type '${this.originAccessControl.originAccessControlOriginType}'`);
        }

        const distributionId = options.distributionId;
        const actions = this.getActions(props.originAccessLevels ?? [AccessLevel.READ]);
        const result = this.grantDistributionAccessToBucket(distributionId, actions);

        // Failed to update bucket policy, assume using imported bucket
        if (!result.statementAdded) {
          if (props.overrideImportedBucketPolicy) {
            this.grantDistributionAccessToImportedBucket(scope, distributionId, actions);
          } else {
            Annotations.of(scope).addWarningV2('@aws-cdk/aws-cloudfront-origins:updateBucketPolicy',
              'Cannot update bucket policy of an imported bucket. Set overrideImportedBucketPolicy to true or update the policy manually instead.');
          }
        }

        if (this.bucket.encryptionKey) {
          this.grantDistributionAccessToKey(
            scope,
            distributionId,
            this.bucket.encryptionKey,
            props.originAccessLevels ?? [AccessLevel.READ],
          );
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

      /**
      * If you're using origin access control (OAC) instead of origin access identity, specify an empty `OriginAccessIdentity` element.
      * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cloudfront-distribution-s3originconfig.html#cfn-cloudfront-distribution-s3originconfig-originaccessidentity
      */
      protected renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined {
        return { originAccessIdentity: '' };
      }

      private getActions(accessLevels: AccessLevel[]): string[] {
        let actions: string[] = [];
        for (const accessLevel of new Set(accessLevels)) {
          actions = actions.concat(BUCKET_ACTIONS[accessLevel]);
        }
        return actions;
      }

      private grantDistributionAccessToBucket(distributionId: string | undefined, actions: string[]): iam.AddToResourcePolicyResult {
        const oacReadOnlyBucketPolicyStatement = new iam.PolicyStatement(
          {
            sid: 'GrantOACAccessToS3',
            effect: iam.Effect.ALLOW,
            principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
            actions,
            resources: [this.bucket.arnForObjects('*')],
            conditions: {
              StringEquals: {
                'AWS:SourceArn': `arn:${Aws.PARTITION}:cloudfront::${Aws.ACCOUNT_ID}:distribution/${distributionId}`,
              },
            },
          },
        );
        const result = this.bucket.addToResourcePolicy(oacReadOnlyBucketPolicyStatement);
        return result;
      }

      /**
       * Use custom resource to update bucket policy and remove OAI policy statement if it exists
       */
      private grantDistributionAccessToImportedBucket(scope: Construct, distributionId: string | undefined, actions: string[]) {
        const provider = S3OriginAccessControlBucketPolicyProvider.getOrCreateProvider(scope, S3_ORIGIN_ACCESS_CONTROL_BUCKET_RESOURCE_TYPE, {
          description: 'Lambda function that updates S3 bucket policy to allow CloudFront distribution access.',
        });
        provider.addToRolePolicy({
          Action: ['s3:getBucketPolicy', 's3:putBucketPolicy'],
          Effect: 'Allow',
          Resource: [this.bucket.bucketArn],
        });

        new CustomResource(scope, 'S3OriginBucketPolicyCustomResource', {
          resourceType: S3_ORIGIN_ACCESS_CONTROL_BUCKET_RESOURCE_TYPE,
          serviceToken: provider.serviceToken,
          properties: {
            DistributionId: distributionId,
            AccountId: this.bucket.env.account,
            Partition: Stack.of(scope).partition,
            BucketName: this.bucket.bucketName,
            Actions: actions,
          },
        });
      }

      /**
       * Use custom resource to update KMS key policy
       */
      private grantDistributionAccessToKey(scope: Construct, distributionId: string | undefined, key: IKey, accessLevels: AccessLevel[]) {
        const provider = S3OriginAccessControlKeyPolicyProvider.getOrCreateProvider(scope, S3_ORIGIN_ACCESS_CONTROL_KEY_RESOURCE_TYPE,
          {
            description: 'Lambda function that updates SSE-KMS key policy to allow CloudFront distribution access.',
          });
        provider.addToRolePolicy({
          Action: ['kms:PutKeyPolicy', 'kms:GetKeyPolicy', 'kms:DescribeKey'],
          Effect: 'Allow',
          Resource: [key.keyArn],
        });

        // Remove duplicates and DELETE permissions which are not applicable to KMS key actions
        const keyAccessLevels = [...new Set(accessLevels.filter(level => level !== AccessLevel.DELETE))];

        new CustomResource(scope, 'S3OriginKMSKeyPolicyCustomResource', {
          resourceType: S3_ORIGIN_ACCESS_CONTROL_KEY_RESOURCE_TYPE,
          serviceToken: provider.serviceToken,
          properties: {
            DistributionId: distributionId,
            KmsKeyId: key.keyId,
            AccountId: this.bucket.env.account,
            Partition: Stack.of(scope).partition,
            AccessLevels: keyAccessLevels,
          },
        });
      }
    });
  }

  protected constructor(protected readonly bucket: s3.IBucket, props: S3OriginProps = {}) {
    super(bucket.bucketRegionalDomainName, props);
  }

  public abstract bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig;

  protected abstract renderS3OriginConfig(): cloudfront.CfnDistribution.S3OriginConfigProperty | undefined;

  protected _bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    return super.bind(scope, options);
  }
}
