import { Construct, IResource, Resource, Token } from '@aws-cdk/core';
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

  /**
   * Validation method used to assert domain ownership
   *
   * @default ValidationMethod.EMAIL
   */
  readonly validationMethod?: ValidationMethod;
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
      validationMethod: props.validationMethod,
    });

    this.certificateArn = cert.ref;

    /**
     * Return the domain validation options for the given domain
     *
     * Closes over props.
     */
    function domainValidationOption(domainName: string): CfnCertificate.DomainValidationOptionProperty {
      let validationDomain = props.validationDomains && props.validationDomains[domainName];
      if (validationDomain === undefined) {
        if (Token.isUnresolved(domainName)) {
          throw new Error(`When using Tokens for domain names, 'validationDomains' needs to be supplied`);
        }
        validationDomain = apexDomain(domainName);
      }

      return { domainName, validationDomain };
    }
  }
}

/**
 * Method used to assert ownership of the domain
 */
export enum ValidationMethod {
  /**
   * Send email to a number of email addresses associated with the domain
   *
   * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html
   */
  EMAIL = 'EMAIL',

  /**
   * Validate ownership by adding appropriate DNS records
   *
   * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html
   */
  DNS = 'DNS',
}