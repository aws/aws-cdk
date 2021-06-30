import { IBucket } from '@aws-cdk/aws-s3';

/**
 * An interface for S3 Location for Schema Implementation
 */
export interface S3Location {
  /**
   * The S3 bucket that stores the GraphQL Schema
   */
  readonly bucket: IBucket;

  /**
   * The object key for the GraphQL Schema
   */
  readonly key: string;
}