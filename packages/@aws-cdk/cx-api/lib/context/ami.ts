export const AMI_PROVIDER = "ami";

/**
 * Query to AMI context provider
 */
export interface AmiContextQuery {
  /**
   * Owners to DescribeImages call
   *
   * @default - All owners
   */
  readonly owners?: string[];

  /**
   * Filters to DescribeImages call
   */
  readonly filters: {[key: string]: string[]};
}

/**
 * Returns just an AMI ID
 */
export type AmiContextResponse = string;