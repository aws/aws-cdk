export const CLOUDFORMATION_IMPORT_PROVIDER = 'cloudformation-import';

/**
 * Query to hosted zone context provider
 */
export interface CloudFormationImportContextQuery {
  /**
   * Query account
   */
  account?: string;

  /**
   * Query region
   */
  region?: string;

  /**
   * Name of export to look up
   */
  exportName?: string;
}

// Response is a string
