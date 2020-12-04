import * as acm from '@aws-cdk/aws-certificatemanager';
import { CfnVirtualGateway, CfnVirtualNode } from './appmesh.generated';

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
 * Redundant API shapes are represented here.
 */
export interface TlsCertificateConfig {
  /**
   * The CFN shape for a virtual gateway listener TLS certificate
   */
  readonly virtualGatewayListenerTlsCertificate: CfnVirtualGateway.VirtualGatewayListenerTlsCertificateProperty,

  /**
   * The CFN shape for a virtual node listener TLS certificate
   */
  readonly virtualNodeListenerTlsCertificate: CfnVirtualNode.ListenerTlsCertificateProperty,
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
  readonly abstract tlsMode: TlsMode;

  /**
   * Returns TLS certificate based provider.
   */
  public abstract bind(): TlsCertificateConfig;

}

/**
 * Represents a ACM provided TLS certificate
 */
export class AcmTlsCertificate extends TlsCertificate {
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

  bind(): TlsCertificateConfig {
    return {
      virtualGatewayListenerTlsCertificate: {
        acm: {
          certificateArn: this.acmCertificate.certificateArn,
        },
      },
      virtualNodeListenerTlsCertificate: {
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
export class FileTlsCertificate extends TlsCertificate {
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

  bind(): TlsCertificateConfig {
    return {
      virtualGatewayListenerTlsCertificate: {
        file: {
          certificateChain: this.certificateChain,
          privateKey: this.privateKey,
        },
      },
      virtualNodeListenerTlsCertificate: {
        file: {
          certificateChain: this.certificateChain,
          privateKey: this.privateKey,
        },
      },
    };
  }
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
