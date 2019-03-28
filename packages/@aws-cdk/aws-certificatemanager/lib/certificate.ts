import { CfnOutput, Construct, IConstruct } from '@aws-cdk/cdk';
import { CfnCertificate } from './certificatemanager.generated';
import { apexDomain } from './util';

export interface ICertificate extends IConstruct {
  /**
   * The certificate's ARN
   */
  readonly certificateArn: string;

  /**
   * Export this certificate from the stack
   */
  export(): CertificateImportProps;
}

/**
 * Reference to an existing Certificate
 */
export interface CertificateImportProps {
  /**
   * The certificate's ARN
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
   */
  readonly subjectAlternativeNames?: string[];

  /**
   * What validation domain to use for every requested domain.
   *
   * Has to be a superdomain of the requested domain.
   *
   * @default Apex domain is used for every domain that's not overridden.
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
export class Certificate extends Construct implements ICertificate {
  /**
   * Import a certificate
   */
  public static import(scope: Construct, id: string, props: CertificateImportProps): ICertificate {
    return new ImportedCertificate(scope, id, props);
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

    this.certificateArn = cert.certificateArn;

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

  /**
   * Export this certificate from the stack
   */
  public export(): CertificateImportProps {
    return {
      certificateArn: new CfnOutput(this, 'Arn', { value: this.certificateArn }).makeImportValue().toString()
    };
  }
}

/**
 * A Certificate that has been imported from another stack
 */
class ImportedCertificate extends Construct implements ICertificate {
  public readonly certificateArn: string;

  constructor(scope: Construct, id: string, private readonly props: CertificateImportProps) {
    super(scope, id);

    this.certificateArn = props.certificateArn;
  }

  public export() {
    return this.props;
  }
}
