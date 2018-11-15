export const SSM_PARAMETER_PROVIDER = 'ssm';

/**
 * Query to hosted zone context provider
 */
export interface SSMParameterContextQuery {
  /**
   * Query account
   */
  account?: string;

  /**
   * Query region
   */
  region?: string;

  /**
   * Parameter name to query
   */
  parameterName?: string;
}

// Response is a string