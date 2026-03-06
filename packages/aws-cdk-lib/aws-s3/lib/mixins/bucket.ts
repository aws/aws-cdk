import type { IConstruct } from 'constructs';
import * as iam from '../../../aws-iam';
import { CfnDeletionPolicy, CustomResource, Tags } from '../../../core';
import { findParentL2Scope } from '../../../core/lib/helpers-internal';
import { Mixin } from '../../../core/lib/mixins';
import { AutoDeleteObjectsProvider } from '../../../custom-resource-handlers/dist/aws-s3/auto-delete-objects-provider.generated';
import { BlockPublicAccess, type BlockPublicAccessOptions } from '../bucket';
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
    const scope = findParentL2Scope(construct) ?? construct;
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
