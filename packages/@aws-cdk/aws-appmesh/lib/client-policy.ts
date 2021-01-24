import * as acmpca from '@aws-cdk/aws-acmpca';
import { CfnVirtualNode } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

enum CertificateType {
  ACMPCA = 'acm',
  FILE = 'file',
}

/**
 * Properties of TLS Client Policy
 */
export interface ClientPolicyConfig {
  /**
   * Represents single Client Policy property
   */
  readonly clientPolicy: CfnVirtualNode.ClientPolicyProperty;
}

/**
 * Represents the property needed to define a Client Policy
 */
export interface ClientPolicyOptions {
  /**
   * TLS is enforced on the ports specified here.
   * If no ports are specified, TLS will be enforced on all the ports.
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
   * Contains information for your private certificate authority
   */
  readonly certificateAuthorities: acmpca.ICertificateAuthority[];
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
    return new ClientPolicyImpl(props.ports, CertificateType.FILE, props.certificateChain, undefined);
  }

  /**
   * TLS validation context trust for ACM Private Certificate Authority (CA).
   */
  public static acmTrust(props: AcmTrustOptions): ClientPolicy {
    return new ClientPolicyImpl(props.ports, CertificateType.ACMPCA, undefined, props.certificateAuthorities);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: Construct): ClientPolicyConfig;

}

class ClientPolicyImpl extends ClientPolicy {
  constructor (private readonly ports: number[] | undefined,
    private readonly certificateType: CertificateType,
    private readonly certificateChain: string | undefined,
    private readonly certificateAuthorityArns: acmpca.ICertificateAuthority[] | undefined) { super(); }

  public bind(_scope: Construct): ClientPolicyConfig {
    if (this.certificateType === CertificateType.ACMPCA && this.certificateAuthorityArns?.map(certificateArn =>
      certificateArn.certificateAuthorityArn).length === 0) {
      throw new Error('You must provide at least one Certificate Authority when creating an ACM Trust ClientPolicy');
    } else {
      return {
        clientPolicy: {
          tls: {
            ports: this.ports,
            validation: {
              trust: {
                [this.certificateType]: this.certificateType === CertificateType.FILE
                  ? {
                    certificateChain: this.certificateChain,
                  }
                  : {
                    certificateAuthorityArns: this.certificateAuthorityArns?.map(certificateArn =>
                      certificateArn.certificateAuthorityArn),
                  },
              },
            },
          },
        },
      };
    }
  }
}
