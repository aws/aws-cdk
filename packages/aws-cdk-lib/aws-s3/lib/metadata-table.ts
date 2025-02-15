import { IBucket } from './bucket';

/**
 * The configuration for the S3 tables destination for metadata.
 */
export interface S3TablesDestination {
  /**
   * The ARN of the S3 bucket where you want to store metadata events.
   */
  readonly tableBucketArn?: string;

  /**
   * The name of the metadata table.
   */
  readonly tableName: string;

  /**
   * The namespace of the metadata table.
   */
  readonly tableNamespace: string;

  /**
   * The ARN of the metadata table.
   */
  readonly tableArn?: string;
}

/**
 * Configuration for metadata table management in S3.
 */
export interface MetadataTableConfiguration {
  /**
   * The destination configuration for S3 metadata tables.
   */
  readonly s3TablesDestination: S3TablesDestination;
}