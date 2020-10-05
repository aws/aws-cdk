import * as acm from '@aws-cdk/aws-certificatemanager';

/**
 * A certificate source for an ELBv2 listener
 */
export interface IListenerCertificate {
  /**
   * The ARN of the certificate to use
   */
  readonly certificateArn: string;
}

/**
 * A certificate source for an ELBv2 listener
 */
export class ListenerCertificate implements IListenerCertificate {
  /**
   * Use an ACM certificate as a listener certificate
   */
  public static fromCertificateManager(acmCertificate: acm.ICertificate) {
    return new ListenerCertificate(acmCertificate.certificateArn);
  }

  /**
   * Use any certificate, identified by its ARN, as a listener certificate
   */
  public static fromArn(certificateArn: string) {
    return new ListenerCertificate(certificateArn);
  }

  /**
   * The ARN of the certificate to use
   */
  public readonly certificateArn: string;

  protected constructor(certificateArn: string) {
    this.certificateArn = certificateArn;
  }
}
