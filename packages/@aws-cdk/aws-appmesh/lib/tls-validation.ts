import * as acmpca from '@aws-cdk/aws-acmpca';
import { CfnVirtualGateway, CfnVirtualNode } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Represents the properties needed to define TLS validation context
 */
export interface TlsValidation {
  /**
   * Reference to where to retrieve the trust chain.
   */
  readonly trust: TlsValidationTrust;
}

/**
 * All Properties for TLS Validations for both Client Policy and Listener.
 */
export interface TlsValidationTrustConfig {
  /**
   * VirtualNode CFN configuration for client policy's TLS Validation
   */
  readonly virtualNodeClientTlsValidationTrust: CfnVirtualNode.TlsValidationContextTrustProperty;

  /**
   * VirtualGateway CFN configuration for client policy's TLS Validation
   */
  readonly virtualGatewayClientTlsValidationTrust: CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty;
}

/**
 * ACM Trust Properties
 */
export interface TlsValidationAcmTrustOptions {
  /**
   * Contains information for your private certificate authority
   */
  readonly certificateAuthorities: acmpca.ICertificateAuthority[];
}

/**
 * File Trust Properties
 */
export interface TlsValidationFileTrustOptions {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;
}

/**
 * Defines the TLS validation context trust.
 */
export abstract class TlsValidationTrust {
  /**
   * Tells envoy where to fetch the validation context from
   */
  public static file(props: TlsValidationFileTrustOptions): TlsValidationTrust {
    return new TlsValidationFileTrust(props);
  }

  /**
   * TLS validation context trust for ACM Private Certificate Authority (CA).
   */
  public static acm(props: TlsValidationAcmTrustOptions): TlsValidationTrust {
    return new TlsValidationAcmTrust(props);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: Construct): TlsValidationTrustConfig;
}

class TlsValidationAcmTrust extends TlsValidationTrust {
  /**
   * Contains information for your private certificate authority
   */
  readonly certificateAuthorities: acmpca.ICertificateAuthority[];

  constructor (props: TlsValidationAcmTrustOptions) {
    super();
    this.certificateAuthorities = props.certificateAuthorities;
  }

  public bind(_scope: Construct): TlsValidationTrustConfig {
    if (this.certificateAuthorities.length === 0) {
      throw new Error('you must provide at least one Certificate Authority when creating an ACM Trust ClientPolicy');
    } else {
      return {
        virtualNodeClientTlsValidationTrust: {
          acm: {
            certificateAuthorityArns: this.certificateAuthorities.map(certificateArn =>
              certificateArn.certificateAuthorityArn),
          },
        },
        virtualGatewayClientTlsValidationTrust: {
          acm: {
            certificateAuthorityArns: this.certificateAuthorities.map(certificateArn =>
              certificateArn.certificateAuthorityArn),
          },
        },
      };
    }
  }
}

class TlsValidationFileTrust extends TlsValidationTrust {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;

  constructor (props: TlsValidationFileTrustOptions) {
    super();
    this.certificateChain = props.certificateChain;
  }

  public bind(_scope: Construct): TlsValidationTrustConfig {
    return {
      virtualNodeClientTlsValidationTrust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
      virtualGatewayClientTlsValidationTrust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
    };
  }
}
