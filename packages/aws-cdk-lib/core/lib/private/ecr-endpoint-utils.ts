/**
 * ECR endpoint type enumeration
 */
export enum EcrEndpointType {
  /**
   * IPv4-only endpoint format: account.dkr.ecr.region.amazonaws.com
   */
  IPV4_ONLY = 'ipv4',

  /**
   * IPv6 dual-stack endpoint format: account.dkr-ecr.region.on.aws
   */
  DUAL_STACK = 'dualstack',
}

/**
 * Determines the ECR endpoint type based on repository configuration and environment variables
 *
 * Priority order:
 * 1. Repository-level useDualStackEndpoint property (if provided)
 * 2. AWS_USE_DUALSTACK_ENDPOINT environment variable
 * 3. Default to IPv4-only for backward compatibility
 *
 * @param useDualStackEndpoint Optional repository-level setting to override environment variable
 * @returns EcrEndpointType.DUAL_STACK if dual-stack is enabled, EcrEndpointType.IPV4_ONLY otherwise
 */
export function determineEcrEndpointType(useDualStackEndpoint?: boolean): EcrEndpointType {
  // Repository-level setting takes precedence
  if (useDualStackEndpoint !== undefined) {
    return useDualStackEndpoint ? EcrEndpointType.DUAL_STACK : EcrEndpointType.IPV4_ONLY;
  }

  // Check AWS_USE_DUALSTACK_ENDPOINT environment variable
  const envDualStack = process.env.AWS_USE_DUALSTACK_ENDPOINT;
  if (envDualStack === 'true' || envDualStack === '1') {
    return EcrEndpointType.DUAL_STACK;
  }

  // Default to IPv4-only for backward compatibility
  return EcrEndpointType.IPV4_ONLY;
}

/**
 * Formats an ECR endpoint URL based on the specified endpoint type
 *
 * @param account AWS account ID
 * @param region AWS region
 * @param urlSuffix URL suffix (e.g., 'amazonaws.com')
 * @param endpointType The type of endpoint to generate
 * @returns Formatted ECR endpoint URL
 */
export function formatEcrEndpoint(account: string, region: string, urlSuffix: string, endpointType: EcrEndpointType): string {
  if (endpointType === EcrEndpointType.DUAL_STACK) {
    // IPv6 dual-stack format: account.dkr-ecr.region.on.aws
    return `${account}.dkr-ecr.${region}.on.aws`;
  }

  // IPv4-only format: account.dkr.ecr.region.amazonaws.com
  return `${account}.dkr.ecr.${region}.${urlSuffix}`;
}
