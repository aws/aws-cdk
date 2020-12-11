import * as cdk from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { CfnVirtualNode } from './appmesh.generated';

/**
 * Enum of supported TLS modes
 */
export enum TlsMode {
  /**
   * Only accept encrypted traffic
   */
  STRICT = 'STRICT',

  /**
   * Accept encrypted and plaintext traffic.
   */
  PERMISSIVE = 'PERMISSIVE',

  /**
   * TLS is disabled, only accept plaintext traffic.
   */
  DISABLED = 'DISABLED',
}

/**
 * A wrapper for the tls config returned by {@link TlsCertificate.bind}
 */
export interface TlsCertificateConfig {
  /**
   * The CFN shape for a listener TLS certificate
   */
  readonly tlsCertificate: CfnVirtualNode.ListenerTlsCertificateProperty,
}

/**
 * ACM Certificate Properties
 */
export interface AcmCertificateOptions {
  /**
   * The TLS mode.
   *
   * @default - none
   */
  readonly tlsMode: TlsMode;

  /**
   * The ACM certificate
   */
  readonly acmCertificate: acm.ICertificate;
}

/**
 * File Certificate Properties
 */
export interface FileCertificateOptions {
  /**
   * The TLS mode.
   *
   * @default - none
   */
  readonly tlsMode: TlsMode;

  /**
   * The file path of the certificate chain file.
   */
  readonly certificateChain: string;

  /**
   * The file path of the private key file.
   */
  readonly privateKey: string;
}

/**
 * Represents a TLS certificate
 */
export abstract class TlsCertificate {
  /**
   * Returns an File TLS Certificate
   */
  public static file(props: FileCertificateOptions): TlsCertificate {
    return new FileTlsCertificate(props);
  }

  /**
   * Returns an ACM TLS Certificate
   */
  public static acm(props: AcmCertificateOptions): TlsCertificate {
    return new AcmTlsCertificate(props);
  }

  /**
   * The TLS mode.
   *
   * @default - none
   */
  public readonly abstract tlsMode: TlsMode;

  /**
   * Returns TLS certificate based provider.
   */
  public abstract bind(_scope: cdk.Construct): TlsCertificateConfig;

}

/**
 * Represents a ACM provided TLS certificate
 */
class AcmTlsCertificate extends TlsCertificate {
  /**
   * The TLS mode.
   *
   * @default - none
   */
  readonly tlsMode: TlsMode;

  /**
   * The ARN of the ACM certificate
   */
  readonly acmCertificate: acm.ICertificate;

  constructor(props: AcmCertificateOptions) {
    super();
    this.tlsMode = props.tlsMode;
    this.acmCertificate = props.acmCertificate;
  }

  bind(_scope: cdk.Construct): TlsCertificateConfig {
    return {
      tlsCertificate: {
        acm: {
          certificateArn: this.acmCertificate.certificateArn,
        },
      },
    };
  }
}

/**
 * Represents a file provided TLS certificate
 */
class FileTlsCertificate extends TlsCertificate {
  /**
   * The TLS mode.
   *
   * @default - none
   */
  readonly tlsMode: TlsMode;

  /**
   * The file path of the certificate chain file.
   */
  readonly certificateChain: string;

  /**
   * The file path of the private key file.
   */
  readonly privateKey: string;

  constructor(props: FileCertificateOptions) {
    super();
    this.tlsMode = props.tlsMode;
    this.certificateChain = props.certificateChain;
    this.privateKey = props.privateKey;
  }

  bind(_scope: cdk.Construct): TlsCertificateConfig {
    return {
      tlsCertificate: {
        file: {
          certificateChain: this.certificateChain,
          privateKey: this.privateKey,
        },
      },
    };
  }
}
