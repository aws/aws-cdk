import * as cdk from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { BucketAttributes } from './bucket';

export function parseBucketArn(construct: IConstruct, props: BucketAttributes): string {

  // if we have an explicit bucket ARN, use it.
  if (props.bucketArn) {
    return props.bucketArn;
  }

  if (props.bucketName) {
    return cdk.Stack.of(construct).formatArn({
      // S3 Bucket names are globally unique in a partition,
      // and so their ARNs have empty region and account components
      region: '',
      account: '',
      service: 's3',
      resource: props.bucketName,
    });
  }

  throw new Error('Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed');
}

export function parseBucketName(construct: IConstruct, props: BucketAttributes): string | undefined {

  // if we have an explicit bucket name, use it.
  if (props.bucketName) {
    return props.bucketName;
  }

  // extract bucket name from bucket arn
  if (props.bucketArn) {
    return cdk.Stack.of(construct).splitArn(props.bucketArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resource;
  }

  // no bucket name is okay since it's optional.
  return undefined;
}

export function buildbucketWebsiteUrl(bucketWebsiteNewUrlFormat: boolean, region: string, urlSuffix: string): string {
  return `s3-website.${region}${bucketWebsiteNewUrlFormat ? '.' : '-'}${urlSuffix}`;
}
