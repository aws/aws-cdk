import { Token, TokenComparison } from '@aws-cdk/core';
import { CfnVirtualNode } from '../appmesh.generated';
import { GrpcGatewayRouteMatch } from '../gateway-route-spec';
import { HeaderMatch } from '../header-match';
import { ListenerTlsOptions } from '../listener-tls-options';
import { GrpcRouteMatch, HttpRouteMatch } from '../route-spec';
import { TlsClientPolicy } from '../tls-client-policy';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Generated Connection pool config
 */
export interface ConnectionPoolConfig {
  /**
   * The maximum connections in the pool
   *
   * @default - none
   */
  readonly maxConnections?: number;

  /**
   * The maximum pending requests in the pool
   *
   * @default - none
   */
  readonly maxPendingRequests?: number;

  /**
   * The maximum requests in the pool
   *
   * @default - none
   */
  readonly maxRequests?: number;
}

/**
 * This is the helper method to render TLS property of client policy.
 */
export function renderTlsClientPolicy(scope: Construct, tlsClientPolicy: TlsClientPolicy | undefined)
  : CfnVirtualNode.ClientPolicyTlsProperty | undefined {
  const certificate = tlsClientPolicy?.mutualTlsCertificate?.bind(scope).tlsCertificate;
  const sans = tlsClientPolicy?.validation.subjectAlternativeNames;

  return tlsClientPolicy
    ? {
      certificate: certificate,
      ports: tlsClientPolicy.ports,
      enforce: tlsClientPolicy.enforce,
      validation: {
        subjectAlternativeNames: sans
          ? {
            match: sans.bind(scope).subjectAlternativeNamesMatch,
          }
          : undefined,
        trust: tlsClientPolicy.validation.trust.bind(scope).tlsValidationTrust,
      },
    }
    : undefined;
}

/**
 * This is the helper method to render the TLS config for a listener.
 */
export function renderListenerTlsOptions(scope: Construct, listenerTls: ListenerTlsOptions | undefined)
  : CfnVirtualNode.ListenerTlsProperty | undefined {
  const tlsValidation = listenerTls?.mutualTlsValidation;

  return listenerTls
    ? {
      certificate: listenerTls.certificate.bind(scope).tlsCertificate,
      mode: listenerTls.mode,
      validation: tlsValidation
        ? {
          subjectAlternativeNames: tlsValidation.subjectAlternativeNames
            ? {
              match: tlsValidation.subjectAlternativeNames.bind(scope).subjectAlternativeNamesMatch,
            }
            : undefined,
          trust: tlsValidation.trust.bind(scope).tlsValidationTrust,
        }
        : undefined,
    }
    : undefined;
}

/**
 * This is the helper method to populate mesh owner when it is a shared mesh scenario
 */
export function renderMeshOwner(resourceAccount: string, meshAccount: string) : string | undefined {
  const comparison = Token.compareStrings(resourceAccount, meshAccount);
  return comparison === TokenComparison.DIFFERENT || comparison === TokenComparison.ONE_UNRESOLVED
    ? meshAccount
    : undefined;
}

/**
 * This is the helper method to check if properties for passed match are undefined.
 * This returns true if all properties for an object are undefined.
 */
export function areMatchPropertiesUndefined(match: HttpRouteMatch | GrpcRouteMatch | GrpcGatewayRouteMatch | undefined): boolean {
  let isEmpty = true;
  for (const property in match) {
    if (property) {
      isEmpty = false;
      break;
    }
  }

  return isEmpty;
}

/**
 * This is the helper method to validate the length of Metadata array when it is specified.
 */
export function validateMetadata(metadata?: HeaderMatch[]) {
  const MIN_LENGTH = 1;
  const MAX_LENGTH = 10;

  if (metadata && (metadata.length < MIN_LENGTH || metadata.length > MAX_LENGTH)) {
    throw new Error(`Number of metadata provided for matching must be between ${MIN_LENGTH} and ${MAX_LENGTH}. got: ${metadata.length}`);
  }
}

/**
 * This is the helper method to validate at least one of gRPC match type is defined.
 */
export function validateGprcMatch(match: GrpcRouteMatch | GrpcGatewayRouteMatch) {
  if (areMatchPropertiesUndefined(match)) {
    throw new Error('At least one gRPC match property must be provided.');
  }
}
