import { Construct, IResource, Resource } from '@aws-cdk/cdk';
import { CfnCertificate } from './certificatemanager.generated';
import { apexDomain } from './util';

export interface ICertificate extends IResource {
  /**
   * The certificate's ARN
   *
   * @attribute
   */
  readonly certificateArn: string;
}

/**
 * Properties for your certificate
 */
export interface CertificateProps {
  /**
   * Fully-qualified domain name to request a certificate for.
   *
   * May contain wildcards, such as ``*.domain.com``.
   */
  readonly domainName: string;

  /**
   * Alternative domain names on your certificate.
   *
   * Use this to register alternative domain names that represent the same site.
   *
   * @default - No additional FQDNs will be included as alternative domain names.
   */
  readonly subjectAlternativeNames?: string[];

  /**
   * What validation domain to use for every requested domain.
   *
   * Has to be a superdomain of the requested domain.
   *
   * @default - Apex domain is used for every domain that's not overridden.
   */
  readonly validationDomains?: {[domainName: string]: string};
}

/**
 * A certificate managed by AWS Certificate Manager
 *
 * IMPORTANT: if you are creating a certificate as part of your stack, the stack
 * will not complete creating until you read and follow the instructions in the
 * email that you will receive.
 *
 * ACM will send validation emails to the following addresses:
 *
 *  admin@domain.com
 *  administrator@domain.com
 *  hostmaster@domain.com
 *  postmaster@domain.com
 *  webmaster@domain.com
 *
 * For every domain that you register.
 */
export class Certificate extends Resource implements ICertificate {

  /**
   * Import a certificate
   */
  public static fromCertificateArn(scope: Construct, id: string, certificateArn: string): ICertificate {
    class Import extends Resource implements ICertificate {
      public certificateArn = certificateArn;
    }

    return new Import(scope, id);
  }

  /**
   * The certificate's ARN
   */
  public readonly certificateArn: string;

  constructor(scope: Construct, id: string, props: CertificateProps) {
    super(scope, id);

    const allDomainNames = [props.domainName].concat(props.subjectAlternativeNames || []);

    const cert = new CfnCertificate(this, 'Resource', {
      domainName: props.domainName,
      subjectAlternativeNames: props.subjectAlternativeNames,
      domainValidationOptions: allDomainNames.map(domainValidationOption),
    });

    this.certificateArn = cert.refAsString;

    /**
     * Return the domain validation options for the given domain
     *
     * Closes over props.
     */
    function domainValidationOption(domainName: string): CfnCertificate.DomainValidationOptionProperty {
      const overrideDomain = props.validationDomains && props.validationDomains[domainName];
      return {
        domainName,
        validationDomain: overrideDomain || apexDomain(domainName)
      };
    }
  }
}
