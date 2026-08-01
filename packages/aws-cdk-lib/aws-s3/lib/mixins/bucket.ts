import type { IConstruct } from 'constructs';
import * as iam from '../../../aws-iam';
import { CfnDeletionPolicy, CustomResource, Tags, Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { ConstructReflection } from '../../../core/lib/helpers-internal';
import { Mixin } from '../../../core/lib/mixins';
import { lit } from '../../../core/lib/private/literal-string';
import { AutoDeleteObjectsProvider } from '../../../custom-resource-handlers/dist/aws-s3/auto-delete-objects-provider.generated';
import { BlockPublicAccess, type BlockPublicAccessOptions, type MetadataConfiguration, MetadataConfigurationState, MetadataRecordExpiration } from '../bucket';
import * as perms from '../perms';
import { CfnBucket } from '../s3.generated';

/**
 * S3-specific Mixin to automatically delete all objects from a bucket
 * when the bucket is removed from the stack or when the stack is deleted.
 *
 * Requires the `removalPolicy` to be set to `RemovalPolicy.DESTROY`.
 *
 * Apply this mixin to a bucket will add `s3:PutBucketPolicy` to the
 * bucket policy. This is because during bucket deletion, the custom resource provider
 * needs to update the bucket policy by adding a deny policy for `s3:PutObject` to
 * prevent race conditions with external bucket writers.
 */
export class BucketAutoDeleteObjects extends Mixin {
  private static AUTO_DELETE_OBJECTS_RESOURCE_TYPE = 'Custom::S3AutoDeleteObjects';
  private static AUTO_DELETE_OBJECTS_TAG = 'aws-cdk:auto-delete-objects';

  supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }

  applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) {
      return;
    }

    // Enforce correct removal policy is set
    construct.node.addValidation({
      validate: () => {
        const errors = new Array<string>();
        if (construct.cfnOptions.deletionPolicy !== CfnDeletionPolicy.DELETE) {
          errors.push('Cannot use \'AutoDeleteObjects\' on a Bucket without setting removal policy to \'DESTROY\'.');
        }
        return errors;
      },
    });

    const bucketRef = construct.bucketRef;

    // We prefer to attach the CR to the L2 scope if we have one
    const scope = ConstructReflection.of(construct).defaultChildOwner ?? construct;
    const provider = AutoDeleteObjectsProvider.getOrCreateProvider(scope, BucketAutoDeleteObjects.AUTO_DELETE_OBJECTS_RESOURCE_TYPE, {
      useCfnResponseWrapper: false,
      description: `Lambda function for auto-deleting objects in ${bucketRef.bucketName} S3 bucket.`,
    });

    // Use a bucket policy to allow the custom resource to delete
    // objects in the bucket
    const policyResult = iam.ResourceWithPolicies.of(construct)?.addToResourcePolicy(new iam.PolicyStatement({
      actions: [
        // prevent further PutObject calls
        ...perms.BUCKET_PUT_POLICY_ACTIONS,
        // list objects
        ...perms.BUCKET_READ_METADATA_ACTIONS,
        ...perms.BUCKET_DELETE_ACTIONS, // and then delete them
      ],
      resources: [
        bucketRef.bucketArn,
        perms.arnForObjects(bucketRef.bucketArn, '*'),
      ],
      principals: [new iam.ArnPrincipal(provider.roleArn)],
    }));

    const customResource = new CustomResource(scope, 'AutoDeleteObjectsCustomResource', {
      resourceType: BucketAutoDeleteObjects.AUTO_DELETE_OBJECTS_RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        BucketName: bucketRef.bucketName,
      },
    });

    // Ensure bucket policy is deleted AFTER the custom resource otherwise
    // we don't have permissions to list and delete in the bucket.
    if (policyResult?.policyDependable) {
      customResource.node.addDependency(policyResult.policyDependable);
    }

    // We also tag the bucket to record the fact that we want it autodeleted.
    // The custom resource will check this tag before actually doing the delete.
    // Because tagging and untagging will ALWAYS happen before the CR is deleted,
    // we can remove AutoDeleteObjects without the removal of the CR emptying
    // the bucket as a side effect.
    Tags.of(construct).add(BucketAutoDeleteObjects.AUTO_DELETE_OBJECTS_TAG, 'true');
  }
}

/**
 * S3-specific mixin for enabling versioning.
 */
export class BucketVersioning extends Mixin {
  constructor(private readonly enabled = true) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;

    construct.versioningConfiguration = {
      status: this.enabled ? 'Enabled' : 'Suspended',
    };
  }
}

/**
 * S3-specific mixin for blocking public-access.
 */
export class BucketBlockPublicAccess extends Mixin {
  private readonly configOptions: BlockPublicAccessOptions;

  constructor(publicAccessConfig: BlockPublicAccess = BlockPublicAccess.BLOCK_ALL) {
    super();
    this.configOptions = {
      blockPublicAcls: publicAccessConfig.blockPublicAcls,
      blockPublicPolicy: publicAccessConfig.blockPublicPolicy,
      ignorePublicAcls: publicAccessConfig.ignorePublicAcls,
      restrictPublicBuckets: publicAccessConfig.restrictPublicBuckets,
    };
  }

  public supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;

    construct.publicAccessBlockConfiguration = {
      blockPublicAcls: this.configOptions.blockPublicAcls ?? true,
      blockPublicPolicy: this.configOptions.blockPublicPolicy ?? true,
      ignorePublicAcls: this.configOptions.ignorePublicAcls ?? true,
      restrictPublicBuckets: this.configOptions.restrictPublicBuckets ?? true,
    };
  }
}

/**
 * S3-specific mixin for configuring S3 Metadata.
 *
 * S3 Metadata captures the metadata of the objects in a bucket as queryable Apache
 * Iceberg tables. A journal table is always created; the inventory and annotation
 * tables are opt-in.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/metadata-tables-overview.html
 */
export class BucketMetadataConfiguration extends Mixin {
  constructor(private readonly metadataConfiguration: MetadataConfiguration = {}) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnBucket {
    return CfnBucket.isCfnBucket(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;

    const journalTable = this.metadataConfiguration.journalTable ?? {};
    const recordExpiration = journalTable.recordExpiration ?? MetadataRecordExpiration.DISABLED;
    const expirationEnabled = recordExpiration === MetadataRecordExpiration.ENABLED;
    const days = journalTable.recordExpirationAfter?.toDays();

    if (expirationEnabled && days === undefined) {
      throw new ValidationError(lit`JournalTableRecordExpirationAfterRequired`, "'recordExpirationAfter' must be specified when 'recordExpiration' is ENABLED", construct);
    }
    if (!expirationEnabled && days !== undefined) {
      throw new ValidationError(lit`JournalTableRecordExpirationDisabled`, "'recordExpirationAfter' can only be specified when 'recordExpiration' is ENABLED", construct);
    }
    if (days !== undefined && !Token.isUnresolved(days) && (days < 1 || days > 2147483647)) {
      throw new ValidationError(lit`JournalTableRecordExpirationAfterOutOfRange`, `'recordExpirationAfter' must be between 1 and 2147483647 days, got ${days}`, construct);
    }

    // S3 rejects an enabled annotation table without a role at deploy time, even though
    // CloudFormation marks the property as optional.
    const annotationTable = this.metadataConfiguration.annotationTable;
    if (annotationTable?.configurationState === MetadataConfigurationState.ENABLED && annotationTable.role === undefined) {
      throw new ValidationError(lit`AnnotationTableRoleRequired`, "'role' must be specified when the annotation table 'configurationState' is ENABLED", construct);
    }

    construct.metadataConfiguration = {
      journalTableConfiguration: {
        recordExpiration: {
          expiration: recordExpiration,
          days,
        },
        encryptionConfiguration: journalTable.encryption?._render(),
      },
      inventoryTableConfiguration: this.metadataConfiguration.inventoryTable ? {
        configurationState: this.metadataConfiguration.inventoryTable.configurationState,
        encryptionConfiguration: this.metadataConfiguration.inventoryTable.encryption?._render(),
      } : undefined,
      annotationTableConfiguration: annotationTable ? {
        configurationState: annotationTable.configurationState,
        encryptionConfiguration: annotationTable.encryption?._render(),
        role: annotationTable.role?.roleRef.roleArn,
      } : undefined,
    };
  }
}
