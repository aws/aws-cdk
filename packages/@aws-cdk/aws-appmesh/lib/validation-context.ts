import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';

/**
 * Defines the TLS validation context trust.
 */
export abstract class TLSClientValidation {
  /**
   * TLS validation context trust for a local file
   */
  public static fileTrust(props: FileTrustOptions): TLSClientValidation {
    return new FileTrust(props);
  }

  /**
   * TLS validation context trust for ACM Private Certificate Authority (CA).
   */
  public static acmTrust(props: ACMTrustOptions): TLSClientValidation {
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
class FileTrust extends TLSClientValidation {
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
class ACMTrust extends TLSClientValidation {
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

/**
 * Default configuration that is applied to all backends for the virtual node.
 * Any configuration defined will be overwritten by configurations specified for a particular backend.
 */
export interface ClientPolicy {
  /**
   * Client policy for TLS
   */
  readonly tlsClientPolicy: TLSClientPolicyOptions;
}

/**
 * TLS Connections with downstream server will always be enforced if True
 */
export interface TLSClientPolicyOptions {
  /**
   * TLS enforced if True.
   *
   * @default - True
   */
  readonly enforce?: boolean;

  /**
   * TLS enforced on these ports. If not specified it is enforced on all ports.
   *
   * @default - none
   */
  readonly ports?: number[];

  /**
   * Policy used to determine if the TLS certificate the server presents is accepted
   *
   * @default - none
   */
  readonly validation: TLSClientValidation;
}

/**
 * ACM Trust Properties
 */
export interface ACMTrustOptions {
  /**
   * Amazon Resource Names (ARN) of trusted ACM Private Certificate Authorities
   */
  readonly certificateAuthorityArns: string[];
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