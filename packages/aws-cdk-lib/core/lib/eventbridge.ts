/**
 * Metadata for AWS EventBridge events
 */
export interface AWSEventMetadata {
  readonly detailType: string[];
  readonly source: string[];
  readonly account: string[];
  readonly version?: string[];
  readonly resources?: string[];
}

/**
 * Properties for AWS EventBridge event metadata
 */
export interface AWSEventMetadataProp {
  readonly version?: string[];
  readonly resources?: string[];
  readonly region?: string[];
}
