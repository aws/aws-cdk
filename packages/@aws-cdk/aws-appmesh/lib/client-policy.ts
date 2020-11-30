import { ICertificateAuthority } from '@aws-cdk/aws-acmpca';
import * as cdk from '@aws-cdk/core';
import { CfnVirtualNode } from './appmesh.generated';

enum CertificateType {
  ACMPCA = 'acm',
  FILE = 'file'
}

/**
 * Properties of TLS validation context
 */
export interface ClientPolicyConfig {
  /**
   * Represents single validation context property
   */
  readonly clientPolicy: CfnVirtualNode.ClientPolicyProperty;
}

/**
 * TLS Connections with downstream server will always be enforced if True
 */
export interface ClientPolicyOptions {
  /**
   * TLS enforced if True.
   *
   * @default true
   */
  readonly enforceTls?: boolean;

  /**
   * TLS is enforced on the ports specified here.
   *
   * @default - none
   */
  readonly ports?: number[];
}

/**
 * ACM Trust Properties
 */
export interface AcmTrustOptions extends ClientPolicyOptions {
  /**
   * Amazon Resource Names (ARN) of trusted ACM Private Certificate Authorities
   */
  readonly certificateAuthorityArns: ICertificateAuthority[];
}

/**
 * File Trust Properties
 */
export interface FileTrustOptions extends ClientPolicyOptions {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;
}

/**
 * Defines the TLS validation context trust.
 */
export abstract class ClientPolicy {

  /**
   * Tells envoy where to fetch the validation context from
   */
  public static fileTrust(props: FileTrustOptions): ClientPolicy {
    return new ClientPolicyImpl(props.enforceTls, props.ports, CertificateType.FILE, props.certificateChain, undefined);
  }

  /**
   * TLS validation context trust for ACM Private Certificate Authority (CA).
   */
  public static acmTrust(props: AcmTrustOptions): ClientPolicy {
    return new ClientPolicyImpl(props.enforceTls, props.ports, CertificateType.ACMPCA, undefined, props.certificateAuthorityArns);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: cdk.Construct): ClientPolicyConfig;

}

class ClientPolicyImpl extends ClientPolicy {
  constructor (private readonly enforce: boolean | undefined,
    private readonly ports: number[] | undefined,
    private readonly certificateType: CertificateType,
    private readonly certificateChain: string| undefined,
    private readonly certificateAuthorityArns: ICertificateAuthority[] | undefined) { super(); }

  public bind(_scope: cdk.Construct): ClientPolicyConfig {
    return {
      clientPolicy: {
        tls: {
          ports: this.ports,
          enforce: this.enforce,
          validation: {
            trust: {
              [this.certificateType]: this.certificateType === 'file' ? {
                certificateChain: this.certificateChain,
              } : {
                certificateAuthorityArns: this.certificateAuthorityArns?.map(certificateArn => certificateArn.certificateAuthorityArn),
              },
            },
          },
        },
      },
    };
  }
}