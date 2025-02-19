import { IConstruct } from 'constructs';
import { TableBucketAttributes } from './table-bucket';
import * as cdk from '../../core';
import { ArnFormat } from '../../core';
import { ValidationError } from '../../core/lib/errors';

export const S3_TABLES_SERVICE = 's3tables';

export function parseTableBucketArn(construct: IConstruct, props: TableBucketAttributes): string {
  // if we have an explicit table bucket ARN, use it.
  if (props.tableBucketArn) {
    return props.tableBucketArn;
  }

  if (props.tableBucketName && props.region && props.account) {
    return cdk.Stack.of(construct).formatArn({
      region: props.region,
      account: props.account,
      service: S3_TABLES_SERVICE,
      resource: 'bucket',
      resourceName: props.tableBucketName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  throw new ValidationError('Cannot determine bucket ARN. At least `tableBucketArn`, `bucketName`, and `account` is needed', construct);
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

  // no table bucket name is okay since it's optional.
  throw new ValidationError('tableBucketName is required and could not be inferred from context', construct);
}

export function parseTableBucketRegion(construct: IConstruct, props: TableBucketAttributes): string {
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

  // no table bucket region is okay since it's optional.
  throw new ValidationError('Region is required and could not be inferred from context', construct);
}

export function parseTableBucketAccount(construct: IConstruct, props: TableBucketAttributes): string {
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

  throw new ValidationError('Account is required and could not be inferred from context', construct);
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
