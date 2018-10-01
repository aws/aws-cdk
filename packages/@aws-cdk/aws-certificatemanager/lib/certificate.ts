import { Construct } from '@aws-cdk/cdk';
import { CertificateRef } from './certificate-ref';
import { cloudformation } from './certificatemanager.generated';
import { apexDomain } from './util';

/**
 * Properties for your certificate
 */
export interface CertificateProps {
  /**
   * Fully-qualified domain name to request a certificate for.
   *
   * May contain wildcards, such as ``*.domain.com``.
   */
  domainName: string;

  /**
   * Alternative domain names on your certificate.
   *
   * Use this to register alternative domain names that represent the same site.
   */
  subjectAlternativeNames?: string[];

  /**
   * What validation domain to use for every requested domain.
   *
   * Has to be a superdomain of the requested domain.
   *
   * @default Apex domain is used for every domain that's not overridden.
   */
  validationDomains?: {[domainName: string]: string};
}

/**
 * A certificate managed by Amazon Certificate Manager
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
export class Certificate extends CertificateRef {
  /**
   * The certificate's ARN
   */
  public readonly certificateArn: string;

  constructor(parent: Construct, name: string, props: CertificateProps) {
    super(parent, name);

    const allDomainNames = [props.domainName].concat(props.subjectAlternativeNames || []);

    const cert = new cloudformation.CertificateResource(this, 'Resource', {
      domainName: props.domainName,
      subjectAlternativeNames: props.subjectAlternativeNames,
      domainValidationOptions: allDomainNames.map(domainValidationOption),
    });

    this.certificateArn = cert.certificateArn;

    /**
     * Return the domain validation options for the given domain
     *
     * Closes over props.
     */
    function domainValidationOption(domainName: string): cloudformation.CertificateResource.DomainValidationOptionProperty {
      const overrideDomain = props.validationDomains && props.validationDomains[domainName];
      return {
        domainName,
        validationDomain: overrideDomain || apexDomain(domainName)
      };
    }
  }

}
