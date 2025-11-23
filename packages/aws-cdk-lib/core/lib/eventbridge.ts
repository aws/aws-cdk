/**
 * Metadata for AWS EventBridge events
 */
export interface AWSEventMetadata {
  /**
   * Something
   */
  readonly detailType: string[];
  /**
   * Something
   */
  readonly account: string[];
  /**
   * Something
   * @default -
   */
  readonly version?: string[];
  /**
   * Something
   * @default -
   */
  readonly resources?: string[];
}

/**
 * Properties for AWS EventBridge event metadata
 */
export interface AWSEventMetadataProp {
  /**
   * Something
   * @default -
   */
  readonly version?: string[];
  /**
   * Something
   * @default -
   */
  readonly resources?: string[];
  /**
   * Something
   * @default -
   */
  readonly region?: string[];
}
