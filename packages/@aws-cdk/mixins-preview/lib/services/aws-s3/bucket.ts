import type { IConstruct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { CfnResource, CustomResource, Tags } from 'aws-cdk-lib/core';
import { AutoDeleteObjectsProvider } from '../../custom-resource-handlers/aws-s3/auto-delete-objects-provider';
import type { IMixin } from '../../core';

const AUTO_DELETE_OBJECTS_RESOURCE_TYPE = 'Custom::S3AutoDeleteObjects';
const AUTO_DELETE_OBJECTS_TAG = 'aws-cdk:auto-delete-objects';

/**
 * S3-specific mixin for auto-deleting objects.
 * @mixin true
 */
export class AutoDeleteObjects implements IMixin {
  supports(construct: IConstruct): construct is s3.CfnBucket {
    return CfnResource.isCfnResource(construct) && construct.cfnResourceType === s3.CfnBucket.CFN_RESOURCE_TYPE_NAME;
  }

  applyTo(construct: IConstruct): IConstruct {
    if (!this.supports(construct)) {
      return construct;
    }

    const ref = construct.bucketRef;

    const provider = AutoDeleteObjectsProvider.getOrCreateProvider(construct, AUTO_DELETE_OBJECTS_RESOURCE_TYPE, {
      useCfnResponseWrapper: false,
      description: `Lambda function for auto-deleting objects in ${ref.bucketName} S3 bucket.`,
    });

    // Get or create bucket policy
    let policy = construct.node.tryFindChild('Policy') as s3.CfnBucketPolicy | undefined;
    if (!policy) {
      policy = new s3.CfnBucketPolicy(construct, 'Policy', {
        bucket: ref.bucketName,
        policyDocument: {
          Statement: [],
        },
      });
    }

    // Add policy statement to allow the custom resource to delete objects
    const policyDoc = policy.policyDocument as any;
    if (!policyDoc.Statement) {
      policyDoc.Statement = [];
    }
    policyDoc.Statement.push({
      Effect: 'Allow',
      Principal: { AWS: provider.roleArn },
      Action: [
        's3:PutBucketPolicy',
        's3:GetBucket*',
        's3:List*',
        's3:DeleteObject*',
      ],
      Resource: [
        ref.bucketArn,
        `${ref.bucketArn}/*`,
      ],
    });

    const customResource = new CustomResource(construct, 'AutoDeleteObjectsCustomResource', {
      resourceType: AUTO_DELETE_OBJECTS_RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        BucketName: ref.bucketName,
      },
    });

    // Ensure bucket policy is deleted AFTER the custom resource
    customResource.node.addDependency(policy);

    // Tag the bucket to record that we want it autodeleted
    Tags.of(construct).add(AUTO_DELETE_OBJECTS_TAG, 'true');

    return construct;
  }
}

/**
 * S3-specific mixin for enabling versioning.
 */
export class EnableVersioning implements IMixin {
  supports(construct: IConstruct): boolean {
    return construct instanceof s3.CfnBucket;
  }

  applyTo(construct: IConstruct): IConstruct {
    if (construct instanceof s3.CfnBucket) {
      construct.versioningConfiguration = {
        status: 'Enabled',
      };
    }
    return construct;
  }
}
