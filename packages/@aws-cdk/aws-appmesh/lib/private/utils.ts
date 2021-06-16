import { CfnVirtualNode } from '../appmesh.generated';
import { TlsClientPolicy } from '../tls-client-policy';
import { TlsListener } from '../tls-listener';

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
  const certificate = tlsClientPolicy?.certificate?.bind(scope).tlsCertificate;
  if (certificate?.acm) {
    throw new Error('ACM certificate source is currently not supported for Client certificates in a TLS Client Policy');
  }

  const sans = tlsClientPolicy?.validation.subjectAlternativeNames;

  return tlsClientPolicy
    ? {
      certificate: certificate,
      ports: tlsClientPolicy.ports,
      enforce: tlsClientPolicy.enforce,
      validation: {
        subjectAlternativeNames: sans
          ? {
            match: {
              exact: sans.exactMatch,
            },
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
export function renderTls(scope: Construct, tls: TlsListener | undefined): CfnVirtualNode.ListenerTlsProperty | undefined {
  const tlsValidation = tls?.validation;
  if (tlsValidation?.trust.bind(scope).tlsValidationTrust.acm) {
    throw new Error('ACM certificate source is currently not supported for server validation in a listener TLS configuration.');
  }

  return tls
    ? {
      certificate: tls.certificate.bind(scope).tlsCertificate,
      mode: tls.mode,
      validation: tlsValidation
        ? {
          subjectAlternativeNames: tlsValidation.subjectAlternativeNames
            ? {
              match: {
                exact: tlsValidation.subjectAlternativeNames.exactMatch,
              },
            }
            : undefined,
          trust: tlsValidation.trust.bind(scope).tlsValidationTrust,
        }
        : undefined,
    }
    : undefined;
}
