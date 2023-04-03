import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as route53 from '@aws-cdk/aws-route53';
import { IResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CertificateBase } from './certificate-base';
/**
 * Represents a certificate in AWS Certificate Manager
 */
export interface ICertificate extends IResource {
    /**
     * The certificate's ARN
     *
     * @attribute
     */
    readonly certificateArn: string;
    /**
     * Return the DaysToExpiry metric for this AWS Certificate Manager
     * Certificate. By default, this is the minimum value over 1 day.
     *
     * This metric is no longer emitted once the certificate has effectively
     * expired, so alarms configured on this metric should probably treat missing
     * data as "breaching".
     */
    metricDaysToExpiry(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
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
     * @deprecated use `validation` instead.
     */
    readonly validationDomains?: {
        [domainName: string]: string;
    };
    /**
     * Validation method used to assert domain ownership
     *
     * @default ValidationMethod.EMAIL
     * @deprecated use `validation` instead.
     */
    readonly validationMethod?: ValidationMethod;
    /**
     * How to validate this certificate
     *
     * @default CertificateValidation.fromEmail()
     */
    readonly validation?: CertificateValidation;
    /**
     * Enable or disable transparency logging for this certificate
     *
     * Once a certificate has been logged, it cannot be removed from the log.
     * Opting out at that point will have no effect. If you opt out of logging
     * when you request a certificate and then choose later to opt back in,
     * your certificate will not be logged until it is renewed.
     * If you want the certificate to be logged immediately, we recommend that you issue a new one.
     *
     * @see https://docs.aws.amazon.com/acm/latest/userguide/acm-bestpractices.html#best-practices-transparency
     *
     * @default true
     */
    readonly transparencyLoggingEnabled?: boolean;
    /**
     * The Certifcate name.
     *
     * Since the Certifcate resource doesn't support providing a physical name, the value provided here will be recorded in the `Name` tag
     *
     * @default the full, absolute path of this construct
     */
    readonly certificateName?: string;
}
/**
 * Properties for certificate validation
 */
export interface CertificationValidationProps {
    /**
     * Validation method
     *
     * @default ValidationMethod.EMAIL
     */
    readonly method?: ValidationMethod;
    /**
     * Hosted zone to use for DNS validation
     *
     * @default - use email validation
     */
    readonly hostedZone?: route53.IHostedZone;
    /**
     * A map of hosted zones to use for DNS validation
     *
     * @default - use `hostedZone`
     */
    readonly hostedZones?: {
        [domainName: string]: route53.IHostedZone;
    };
    /**
     * Validation domains to use for email validation
     *
     * @default - Apex domain
     */
    readonly validationDomains?: {
        [domainName: string]: string;
    };
}
/**
 * How to validate a certificate
 */
export declare class CertificateValidation {
    readonly props: CertificationValidationProps;
    /**
     * Validate the certificate with DNS
     *
     * IMPORTANT: If `hostedZone` is not specified, DNS records must be added
     * manually and the stack will not complete creating until the records are
     * added.
     *
     * @param hostedZone the hosted zone where DNS records must be created
     */
    static fromDns(hostedZone?: route53.IHostedZone): CertificateValidation;
    /**
     * Validate the certificate with automatically created DNS records in multiple
     * Amazon Route 53 hosted zones.
     *
     * @param hostedZones a map of hosted zones where DNS records must be created
     * for the domains in the certificate
     */
    static fromDnsMultiZone(hostedZones: {
        [domainName: string]: route53.IHostedZone;
    }): CertificateValidation;
    /**
     * Validate the certificate with Email
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
     *
     * @param validationDomains a map of validation domains to use for domains in the certificate
     */
    static fromEmail(validationDomains?: {
        [domainName: string]: string;
    }): CertificateValidation;
    /**
     * The validation method
     */
    readonly method: ValidationMethod;
    /** @param props Certification validation properties */
    private constructor();
}
/**
 * A certificate managed by AWS Certificate Manager
 */
export declare class Certificate extends CertificateBase implements ICertificate {
    /**
     * Import a certificate
     */
    static fromCertificateArn(scope: Construct, id: string, certificateArn: string): ICertificate;
    /**
     * The certificate's ARN
     */
    readonly certificateArn: string;
    constructor(scope: Construct, id: string, props: CertificateProps);
}
/**
 * Method used to assert ownership of the domain
 */
export declare enum ValidationMethod {
    /**
     * Send email to a number of email addresses associated with the domain
     *
     * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-email.html
     */
    EMAIL = "EMAIL",
    /**
     * Validate ownership by adding appropriate DNS records
     *
     * @see https://docs.aws.amazon.com/acm/latest/userguide/gs-acm-validate-dns.html
     */
    DNS = "DNS"
}
