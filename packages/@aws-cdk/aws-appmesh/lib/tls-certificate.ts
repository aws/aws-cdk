import * as acm from '@aws-cdk/aws-certificatemanager';
import { CfnVirtualNode } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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

  /**
   * The TLS mode.
   */
  readonly tlsMode: TlsMode;
}

/**
 * ACM Certificate Properties
 */
export interface AcmCertificateOptions {
  /**
   * The TLS mode.
   */
  readonly tlsMode: TlsMode;

  /**
   * The ACM certificate
   */
  readonly certificate: acm.ICertificate;
}

/**
 * File Certificate Properties
 */
export interface FileCertificateOptions {
  /**
   * The TLS mode.
   */
  readonly tlsMode: TlsMode;

  /**
   * The file path of the certificate chain file.
   */
  readonly certificateChainPath: string;

  /**
   * The file path of the private key file.
   */
  readonly privateKeyPath: string;
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
   * Returns TLS certificate based provider.
   */
  public abstract bind(_scope: Construct): TlsCertificateConfig;

}

/**
 * Represents a ACM provided TLS certificate
 */
class AcmTlsCertificate extends TlsCertificate {
  /**
   * The TLS mode.
   *
   * @default - TlsMode.DISABLED
   */
  readonly tlsMode: TlsMode;

  /**
   * The ARN of the ACM certificate
   */
  readonly acmCertificate: acm.ICertificate;

  constructor(props: AcmCertificateOptions) {
    super();
    this.tlsMode = props.tlsMode;
    this.acmCertificate = props.certificate;
  }

  bind(_scope: Construct): TlsCertificateConfig {
    return {
      tlsCertificate: {
        acm: {
          certificateArn: this.acmCertificate.certificateArn,
        },
      },
      tlsMode: this.tlsMode,
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
   * @default - TlsMode.DISABLED
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
    this.certificateChain = props.certificateChainPath;
    this.privateKey = props.privateKeyPath;
  }

  bind(_scope: Construct): TlsCertificateConfig {
    return {
      tlsCertificate: {
        file: {
          certificateChain: this.certificateChain,
          privateKey: this.privateKey,
        },
      },
      tlsMode: this.tlsMode,
    };
  }
}
