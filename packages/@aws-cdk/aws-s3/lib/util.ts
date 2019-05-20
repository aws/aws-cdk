import cdk = require('@aws-cdk/cdk');
import { BucketAttributes } from './bucket';

export function parseBucketArn(construct: cdk.IConstruct, props: BucketAttributes): string {

  // if we have an explicit bucket ARN, use it.
  if (props.bucketArn) {
    return props.bucketArn;
  }

  if (props.bucketName) {
    return construct.node.stack.formatArn({
      // S3 Bucket names are globally unique in a partition,
      // and so their ARNs have empty region and account components
      region: '',
      account: '',
      service: 's3',
      resource: props.bucketName
    });
  }

  throw new Error('Cannot determine bucket ARN. At least `bucketArn` or `bucketName` is needed');
}

export function parseBucketName(construct: cdk.IConstruct, props: BucketAttributes): string | undefined {

  // if we have an explicit bucket name, use it.
  if (props.bucketName) {
    return props.bucketName;
  }

  // if we have a string arn, we can extract the bucket name from it.
  if (props.bucketArn) {

    const resolved = construct.node.resolve(props.bucketArn);
    if (typeof(resolved) === 'string') {
      const components = construct.node.stack.parseArn(resolved);
      if (components.service !== 's3') {
        throw new Error('Invalid ARN. Expecting "s3" service:' + resolved);
      }
      if (components.resourceName) {
        throw new Error(`Bucket ARN must not contain a path`);
      }
      return components.resource;
    }
  }

  // no bucket name is okay since it's optional.
  return undefined;
}
