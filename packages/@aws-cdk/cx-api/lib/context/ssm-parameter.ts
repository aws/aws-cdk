export const SSM_PARAMETER_PROVIDER = 'ssm';

/**
 * Query to hosted zone context provider
 */
export interface SSMParameterContextQuery {
  /**
   * Query account
   */
  readonly account?: string;

  /**
   * Query region
   */
  readonly region?: string;

  /**
   * Parameter name to query
   */
  readonly parameterName?: string;
}

// Response is a string