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
  DUAL_STACK = 'dualstack'
}

/**
 * Determines the ECR endpoint type based on environment variables
 * 
 * Checks the AWS_USE_DUALSTACK_ENDPOINT environment variable following
 * AWS SDK standards for consistency.
 * 
 * @returns EcrEndpointType.DUAL_STACK if AWS_USE_DUALSTACK_ENDPOINT is 'true' or '1',
 *          EcrEndpointType.IPV4_ONLY otherwise (default for backward compatibility)
 */
export function determineEcrEndpointType(): EcrEndpointType {
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