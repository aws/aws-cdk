import * as acmpca from '@aws-cdk/aws-acmpca';
import { CfnVirtualGateway, CfnVirtualNode } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Represents the properties needed to define TLS validation context
 */
export interface TlsValidationContext {
  /**
   * Reference to where to retrieve the trust chain.
   */
  readonly trust: TlsValidationContextTrust;
}

/**
 * All Properties for TLS Validations for both Client Policy and Listener.
 */
export interface TlsValidationTrustConfig {
  /**
   * VirtualNode CFN configuration for client policy's TLS Validation
   */
  readonly virtualNodeClientTlsValidationContextTrust: CfnVirtualNode.TlsValidationContextTrustProperty;

  /**
   * VirtualNode CFN configuration for listener's TLS Validation
   *
   * @default - no TLS Validation
   */
  readonly virtualNodeListenerTlsValidationContextTrust?: CfnVirtualNode.ListenerTlsValidationContextTrustProperty

  /**
   * VirtualGateway CFN configuration for client policy's TLS Validation
   */
  readonly virtualGatewayClientTlsValidationContextTrust: CfnVirtualGateway.VirtualGatewayTlsValidationContextTrustProperty;

  /**
   * VirtualGateway CFN configuration for listener's TLS Validation
   *
   * @default - no TLS Validation
   */
  readonly virtualGatewayListenerTlsValidationContextTrust?: CfnVirtualGateway.VirtualGatewayListenerTlsValidationContextTrustProperty;
}

/**
 * ACM Trust Properties
 */
export interface AcmTrustOptions {
  /**
   * Contains information for your private certificate authority
   */
  readonly certificateAuthorities: acmpca.ICertificateAuthority[];
}

/**
 * File Trust Properties
 */
export interface FileTrustOptions {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;
}

/**
 * Defines the TLS validation context trust.
 */
export abstract class TlsValidationContextTrust {
  /**
   * Tells envoy where to fetch the validation context from
   */
  public static fileTrust(props: FileTrustOptions): TlsValidationContextTrust {
    return new FileTlsValidationContextTrustImpl(props);
  }

  /**
   * TLS validation context trust for ACM Private Certificate Authority (CA).
   */
  public static acmTrust(props: AcmTrustOptions): TlsValidationContextTrust {
    return new AcmTlsValidationContextTrustImpl(props);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: Construct): TlsValidationTrustConfig;

}

class AcmTlsValidationContextTrustImpl extends TlsValidationContextTrust {
  /**
   * Contains information for your private certificate authority
   */
  readonly certificateAuthorities: acmpca.ICertificateAuthority[];

  constructor (props: AcmTrustOptions) {
    super();
    this.certificateAuthorities = props.certificateAuthorities;
  }

  public bind(_scope: Construct): TlsValidationTrustConfig {
    if (this.certificateAuthorities.length === 0) {
      throw new Error('you must provide at least one Certificate Authority when creating an ACM Trust ClientPolicy');
    } else {
      return {
        virtualNodeClientTlsValidationContextTrust: {
          acm: {
            certificateAuthorityArns: this.certificateAuthorities.map(certificateArn =>
              certificateArn.certificateAuthorityArn),
          },
        },
        virtualGatewayClientTlsValidationContextTrust: {
          acm: {
            certificateAuthorityArns: this.certificateAuthorities.map(certificateArn =>
              certificateArn.certificateAuthorityArn),
          },
        },
      };
    }
  }
}

class FileTlsValidationContextTrustImpl extends TlsValidationContextTrust {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;

  constructor (props: FileTrustOptions) {
    super();
    this.certificateChain = props.certificateChain;
  }

  public bind(_scope: Construct): TlsValidationTrustConfig {
    return {
      virtualNodeClientTlsValidationContextTrust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
      virtualNodeListenerTlsValidationContextTrust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
      virtualGatewayClientTlsValidationContextTrust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
      virtualGatewayListenerTlsValidationContextTrust: {
        file: {
          certificateChain: this.certificateChain,
        },
      },
    };
  }
}
