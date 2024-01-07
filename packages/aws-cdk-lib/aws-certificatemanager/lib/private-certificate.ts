import { Construct } from 'constructs';
import { ICertificate, KeyAlgorithm } from './certificate';
import { CertificateBase } from './certificate-base';
import { CfnCertificate } from './certificatemanager.generated';
import * as acmpca from '../../aws-acmpca';

/**
 * Properties for your private certificate
 */
export interface PrivateCertificateProps {
  /**
   * Fully-qualified domain name to request a private certificate for.
   *
   * May contain wildcards, such as ``*.domain.com``.
   */
  readonly domainName: string;

  /**
   * Alternative domain names on your private certificate.
   *
   * Use this to register alternative domain names that represent the same site.
   *
   * @default - No additional FQDNs will be included as alternative domain names.
   */
  readonly subjectAlternativeNames?: string[];

  /**
   * Private certificate authority (CA) that will be used to issue the certificate.
   */
  readonly certificateAuthority: acmpca.ICertificateAuthority;

  /**
   * Specifies the algorithm of the public and private key pair that your certificate uses to encrypt data.
   *
   * When you request a private PKI certificate signed by a CA from AWS Private CA, the specified signing algorithm family
   * (RSA or ECDSA) must match the algorithm family of the CA's secret key.
   *
   * @default KeyAlgorithm.RSA_2048
   */
  readonly keyAlgorithm?: KeyAlgorithm;
}

/**
 * A private certificate managed by AWS Certificate Manager
 *
 * @resource AWS::CertificateManager::Certificate
 */
export class PrivateCertificate extends CertificateBase implements ICertificate {
  /**
   * Import a certificate
   */
  public static fromCertificateArn(scope: Construct, id: string, certificateArn: string): ICertificate {
    class Import extends CertificateBase {
      public readonly certificateArn = certificateArn;
    }

    return new Import(scope, id);
  }

  /**
   * The certificate's ARN
   */
  public readonly certificateArn: string;

  constructor(scope: Construct, id: string, props: PrivateCertificateProps) {
    super(scope, id);

    const cert = new CfnCertificate(this, 'Resource', {
      domainName: props.domainName,
      subjectAlternativeNames: props.subjectAlternativeNames,
      certificateAuthorityArn: props.certificateAuthority.certificateAuthorityArn,
      keyAlgorithm: props.keyAlgorithm?.name,
    });

    this.certificateArn = cert.ref;
  }
}
