import type { Construct } from 'constructs';
import { Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';
import { SecurityPolicy } from '../domain-name';
import { EndpointType } from '../restapi';

export function isEnhancedSecurityPolicy(policy?: SecurityPolicy): boolean {
  return policy !== undefined && !Token.isUnresolved(policy) && policy.startsWith('SecurityPolicy_');
}

export function validateSecurityPolicyEndpointType(scope: Construct, policy?: SecurityPolicy, endpointType?: EndpointType): void {
  if (!policy || !endpointType || Token.isUnresolved(policy) || Token.isUnresolved(endpointType)) {
    return;
  }

  const NON_EDGE_ONLY_POLICIES = [
    SecurityPolicy.TLS13_1_3_2025_09,
    SecurityPolicy.TLS13_1_3_FIPS_2025_09,
    SecurityPolicy.TLS13_1_2_PQ_2025_09,
    SecurityPolicy.TLS13_1_2_PFS_PQ_2025_09,
  ];
  const EDGE_ONLY_POLICIES = [
    SecurityPolicy.TLS13_2025_EDGE,
    SecurityPolicy.TLS12_PFS_2025_EDGE,
    SecurityPolicy.TLS12_2018_EDGE,
  ];

  if (endpointType === EndpointType.EDGE && NON_EDGE_ONLY_POLICIES.includes(policy)) {
    throw new ValidationError(
      lit`SecurityPolicyNotSupportedForEdgeEndpoint`,
      `Security policy ${policy} is not supported for edge-optimized endpoints. ` +
      'Use a security policy that supports edge-optimized endpoints. ' +
      'See: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-custom-domain-tls-version.html',
      scope,
    );
  }

  if (endpointType !== EndpointType.EDGE && EDGE_ONLY_POLICIES.includes(policy)) {
    throw new ValidationError(
      lit`SecurityPolicyOnlySupportedForEdgeEndpoint`,
      `Security policy ${policy} is only supported for edge-optimized endpoints. ` +
      'Use a policy that supports non-edge endpoints. ' +
      'See: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-custom-domain-tls-version.html',
      scope,
    );
  }
}