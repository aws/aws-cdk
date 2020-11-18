import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';
import { ACMTrustOptions, FileTrustOptions } from './client-policy';

/**
 * Defines the TLS validation context trust.
 */
export abstract class TLSValidationContext {
  /**
   * Tells envoy where to fetch the validation context from
   */
  public static fileTrust(props: FileTrustOptions): TLSValidationContext {
    return new FileTrust(props);
  }

  /**
   * TLS validation context trust for ACM Private Certificate Authority (CA).
   */
  public static acmTrust(props: ACMTrustOptions): TLSValidationContext {
    return new ACMTrust(props);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: cdk.Construct): TLSValidationConfig;
}

/**
 * Represents a Transport Layer Security (TLS) validation context trust for a local file
 */
class FileTrust extends TLSValidationContext {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;

  constructor(props: FileTrustOptions) {
    super();
    this.certificateChain = props.certificateChain;
  }

  public bind(_scope: cdk.Construct): TLSValidationConfig {
    return {
      tlsValidation: {
        trust: {
          file: {
            certificateChain: this.certificateChain,
          },
        },
      },
    };
  }
}

/**
 * Represents a TLS validation context trust for an AWS Certicate Manager (ACM) certificate.
 */
class ACMTrust extends TLSValidationContext {
  /**
   * Amazon Resource Name of the Certificates
   */
  readonly certificateAuthorityArns: string[];

  constructor(props: ACMTrustOptions) {
    super();
    this.certificateAuthorityArns = props.certificateAuthorityArns;
  }

  public bind(_scope: cdk.Construct): TLSValidationConfig {
    return {
      tlsValidation: {
        trust: {
          acm: {
            certificateAuthorityArns: this.certificateAuthorityArns,
          },
        },
      },
    };
  }
}

/**
 * Properties of TLS validation context
 */
export interface TLSValidationConfig {
  /**
   * Represents single validation context property
   */
  readonly tlsValidation: CfnVirtualNode.TlsValidationContextProperty;
}