import * as cdk from 'aws-cdk-lib/core';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { IConstruct } from 'constructs';
import type { VectorBucketAttributes } from './vector-bucket';

export const S3_VECTORS_SERVICE = 's3vectors';

export function parseVectorBucketArn(construct: IConstruct, props: VectorBucketAttributes): string {
  // if we have an explicit vector bucket ARN, use it.
  if (props.vectorBucketArn) {
    return props.vectorBucketArn;
  }

  if (props.vectorBucketName) {
    return cdk.Stack.of(construct).formatArn({
      region: props.region,
      account: props.account,
      service: S3_VECTORS_SERVICE,
      resource: 'bucket',
      resourceName: props.vectorBucketName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  throw new cdk.ValidationError(lit`CannotDetermineVectorBucketArn`, 'Cannot determine bucket ARN. At least `vectorBucketArn` or `vectorBucketName` is needed', construct);
}

export function parseVectorBucketName(construct: IConstruct, props: VectorBucketAttributes): string {
  // if we have an explicit bucket name, use it.
  if (props.vectorBucketName) {
    return props.vectorBucketName;
  }

  // extract vector bucket name from bucket arn
  if (props.vectorBucketArn) {
    const bucketNameFromArn = cdk.Stack.of(construct).splitArn(props.vectorBucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (bucketNameFromArn) {
      return bucketNameFromArn;
    }
  }

  throw new cdk.ValidationError(lit`VectorBucketNameRequired`, 'vectorBucketName is required and could not be inferred from context', construct);
}

export function parseVectorBucketRegion(construct: IConstruct, props: VectorBucketAttributes): string | undefined {
  // if we have an explicit bucket region, use it.
  if (props.region) {
    return props.region;
  }

  // extract vector bucket region from bucket arn
  if (props.vectorBucketArn) {
    const regionFromArn = cdk.Stack.of(construct).splitArn(props.vectorBucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).region;
    if (regionFromArn) {
      return regionFromArn;
    }
  }

  // Region is optional, can be inferred later
  return undefined;
}

export function parseVectorBucketAccount(construct: IConstruct, props: VectorBucketAttributes): string | undefined {
  // if we have an explicit bucket account, use it.
  if (props.account) {
    return props.account;
  }

  // extract vector bucket account from bucket arn
  if (props.vectorBucketArn) {
    const accountFromArn = cdk.Stack.of(construct).splitArn(props.vectorBucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).account;
    if (accountFromArn) {
      return accountFromArn;
    }
  }

  // Account is optional, can be inferred later
  return undefined;
}

/**
 * @returns populated attributes from given scope and attributes
 * @throws ValidationError if any of the required attributes are missing
 */
export function validateVectorBucketAttributes(construct: IConstruct, props: VectorBucketAttributes) {
  return {
    vectorBucketName: parseVectorBucketName(construct, props),
    account: parseVectorBucketAccount(construct, props),
    region: parseVectorBucketRegion(construct, props),
    vectorBucketArn: parseVectorBucketArn(construct, props),
  };
}
