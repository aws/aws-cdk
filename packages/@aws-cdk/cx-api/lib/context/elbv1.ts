export const ELBV1_PROVIDER = 'elbv1-provider';

/**
 * Query to hosted zone context provider
 */
export interface ElbV1ContextQuery {
  /**
   * Query account
   */
  account?: string;
  /**
   * Query region
   */
  region?: string;
  /**
   * Custom filter logic
   */
  filter: ElbV1Filters;
}

/**
 * Response of the AZ provider looks like this
 */
export type ElbV1ContextResponse = string[];

export interface ElbV1Filters {
  vpcId: string,
  tags: ElbV1Tag[]
}

export interface ElbV1Tag {
  key: string,
  value: string
}