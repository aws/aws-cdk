import { CfnVirtualNode } from '../appmesh.generated';
import { ClientPolicyTlsOptions } from '../client-policy-tls-options';
import { ListenerTlsOptions } from '../listener-tls-options';

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
export function renderTlsClientPolicy(scope: Construct, clientPolicyTls: ClientPolicyTlsOptions | undefined)
  : CfnVirtualNode.ClientPolicyTlsProperty | undefined {
  const certificate = clientPolicyTls?.mutualTlsAuthCertificate?.bind(scope).tlsCertificate;
  const sans = clientPolicyTls?.validation.subjectAlternativeNames;

  return clientPolicyTls
    ? {
      certificate: certificate,
      ports: clientPolicyTls.ports,
      enforce: clientPolicyTls.enforce,
      validation: {
        subjectAlternativeNames: sans
          ? {
            match: sans.bind(scope).subjectAlternativeNamesMatch,
          }
          : undefined,
        trust: clientPolicyTls.validation.trust.bind(scope).tlsValidationTrust,
      },
    }
    : undefined;
}

/**
 * This is the helper method to render the TLS config for a listener.
 */
export function renderListenerTls(scope: Construct, listenerTls: ListenerTlsOptions | undefined): CfnVirtualNode.ListenerTlsProperty | undefined {
  const tlsValidation = listenerTls?.mutualTlsAuthValidation;
  if (tlsValidation?.trust.bind(scope).tlsValidationTrust.acm) {
    throw new Error('ACM certificate source is currently not supported for server validation in a listener TLS configuration.');
  }

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
