import * as iam from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CertificateProps, ICertificate } from './certificate';
import { CertificateBase } from './certificate-base';
/**
 * Properties to create a DNS validated certificate managed by AWS Certificate Manager
 *
 */
export interface DnsValidatedCertificateProps extends CertificateProps {
    /**
     * Route 53 Hosted Zone used to perform DNS validation of the request.  The zone
     * must be authoritative for the domain name specified in the Certificate Request.
     */
    readonly hostedZone: route53.IHostedZone;
    /**
     * AWS region that will host the certificate. This is needed especially
     * for certificates used for CloudFront distributions, which require the region
     * to be us-east-1.
     *
     * @default the region the stack is deployed in.
     */
    readonly region?: string;
    /**
     * An endpoint of Route53 service, which is not necessary as AWS SDK could figure
     * out the right endpoints for most regions, but for some regions such as those in
     * aws-cn partition, the default endpoint is not working now, hence the right endpoint
     * need to be specified through this prop.
     *
     * Route53 is not been officially launched in China, it is only available for AWS
     * internal accounts now. To make DnsValidatedCertificate work for internal accounts
     * now, a special endpoint needs to be provided.
     *
     * @default - The AWS SDK will determine the Route53 endpoint to use based on region
     */
    readonly route53Endpoint?: string;
    /**
     * Role to use for the custom resource that creates the validated certificate
     *
     * @default - A new role will be created
     */
    readonly customResourceRole?: iam.IRole;
    /**
     * When set to true, when the DnsValidatedCertificate is deleted,
     * the associated Route53 validation records are removed.
     *
     * CAUTION: If multiple certificates share the same domains (and same validation records),
     * this can cause the other certificates to fail renewal and/or not validate.
     * Not recommended for production use.
     *
     * @default false
     */
    readonly cleanupRoute53Records?: boolean;
}
/**
 * A certificate managed by AWS Certificate Manager.  Will be automatically
 * validated using DNS validation against the specified Route 53 hosted zone.
 *
 * @resource AWS::CertificateManager::Certificate
 * @deprecated use {@link Certificate} instead
 */
export declare class DnsValidatedCertificate extends CertificateBase implements ICertificate, cdk.ITaggable {
    readonly certificateArn: string;
    /**
    * Resource Tags.
    * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-certificatemanager-certificate.html#cfn-certificatemanager-certificate-tags
    */
    readonly tags: cdk.TagManager;
    protected readonly region?: string;
    private normalizedZoneName;
    private hostedZoneId;
    private domainName;
    private _removalPolicy?;
    constructor(scope: Construct, id: string, props: DnsValidatedCertificateProps);
    applyRemovalPolicy(policy: cdk.RemovalPolicy): void;
    private validateDnsValidatedCertificate;
}
