import { IConstruct } from 'constructs';
import { TableBucketAttributes } from './table-bucket';
import * as cdk from 'aws-cdk-lib/core';

export const S3_TABLES_SERVICE = 's3tables';

export function parseTableBucketArn(construct: IConstruct, props: TableBucketAttributes): string {
  // if we have an explicit table bucket ARN, use it.
  if (props.tableBucketArn) {
    return props.tableBucketArn;
  }

  if (props.tableBucketName) {
    return cdk.Stack.of(construct).formatArn({
      region: props.region,
      account: props.account,
      service: S3_TABLES_SERVICE,
      resource: 'bucket',
      resourceName: props.tableBucketName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  throw new cdk.ValidationError('Cannot determine bucket ARN. At least `tableBucketArn` is needed', construct);
}

export function parseTableBucketName(construct: IConstruct, props: TableBucketAttributes): string {
  // if we have an explicit bucket name, use it.
  if (props.tableBucketName) {
    return props.tableBucketName;
  }

  // extract table bucket name from bucket arn
  if (props.tableBucketArn) {
    const bucketNameFromArn = cdk.Stack.of(construct).splitArn(props.tableBucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
    if (bucketNameFromArn) {
      return bucketNameFromArn;
    }
  }

  throw new cdk.ValidationError('tableBucketName is required and could not be inferred from context', construct);
}

export function parseTableBucketRegion(construct: IConstruct, props: TableBucketAttributes): string | undefined {
  // if we have an explicit bucket region, use it.
  if (props.region) {
    return props.region;
  }

  // extract table bucket region from bucket arn
  if (props.tableBucketArn) {
    const regionFromArn = cdk.Stack.of(construct).splitArn(props.tableBucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).region;
    if (regionFromArn) {
      return regionFromArn;
    }
  }

  // Region is optional, can be inferred later
  return undefined;
}

export function parseTableBucketAccount(construct: IConstruct, props: TableBucketAttributes): string | undefined {
  // if we have an explicit bucket account, use it.
  if (props.account) {
    return props.account;
  }

  // extract table bucket account from bucket arn
  if (props.tableBucketArn) {
    const accountFromArn = cdk.Stack.of(construct).splitArn(props.tableBucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).account;
    if (accountFromArn) {
      return accountFromArn;
    }
  }

  // Account is optional, can be inferred later
  return undefined;
}

/**
 * @returns populated attributes from given scope and attributes
 * @throws ValidationError if any of the required attribures are missing
 */
export function validateTableBucketAttributes(construct: IConstruct, props: TableBucketAttributes) {
  return {
    tableBucketName: parseTableBucketName(construct, props),
    account: parseTableBucketAccount(construct, props),
    region: parseTableBucketRegion(construct, props),
    tableBucketArn: parseTableBucketArn(construct, props),
  };
}
