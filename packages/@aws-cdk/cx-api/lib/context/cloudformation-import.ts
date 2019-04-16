export const CLOUDFORMATION_IMPORT_PROVIDER = 'cloudformation-import';

/**
 * Query to hosted zone context provider
 */
export interface CloudFormationImportContextQuery {
  /**
   * Query account
   */
  readonly account?: string;

  /**
   * Query region
   */
  readonly region?: string;

  /**
   * Name of export to look up
   */
  readonly exportName?: string;
}

// Response is a string
