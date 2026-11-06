import { Stack, Token } from 'aws-cdk-lib';
import type { IConstruct } from 'constructs';

/**
 * The name prefix of the workload identity AgentCore creates for a gateway.
 *
 * The service names a gateway's workload identity after the lowercased gateway
 * name, and IAM resource matching is case-sensitive, so identity grants must use
 * the lowercased form. A tokenized name that resolves to a string at synthesis
 * time (such as the auto-generated default) is resolved and lowercased; a name
 * that resolves to a deploy-time intrinsic is used unchanged, since
 * CloudFormation cannot lowercase it.
 */
export function workloadIdentityNamePrefix(scope: IConstruct, gatewayName: string): string {
  const resolved = Token.isUnresolved(gatewayName) ? Stack.of(scope).resolve(gatewayName) : gatewayName;
  return typeof resolved === 'string' ? resolved.toLowerCase() : gatewayName;
}
