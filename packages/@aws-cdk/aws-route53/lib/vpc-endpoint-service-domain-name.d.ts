import { IVpcEndpointService } from '@aws-cdk/aws-ec2';
import { Construct } from 'constructs';
import { IPublicHostedZone } from '../lib';
/**
 * Properties to configure a VPC Endpoint Service domain name
 */
export interface VpcEndpointServiceDomainNameProps {
    /**
     * The VPC Endpoint Service to configure Private DNS for
     */
    readonly endpointService: IVpcEndpointService;
    /**
     * The domain name to use.
     *
     * This domain name must be owned by this account (registered through Route53),
     * or delegated to this account. Domain ownership will be verified by AWS before
     * private DNS can be used.
     * @see https://docs.aws.amazon.com/vpc/latest/userguide/endpoint-services-dns-validation.html
     */
    readonly domainName: string;
    /**
     * The public hosted zone to use for the domain.
     */
    readonly publicHostedZone: IPublicHostedZone;
}
/**
 * A Private DNS configuration for a VPC endpoint service.
 */
export declare class VpcEndpointServiceDomainName extends Construct {
    private static readonly endpointServices;
    private static readonly endpointServicesMap;
    /**
     * The domain name associated with the private DNS configuration
     */
    domainName: string;
    constructor(scope: Construct, id: string, props: VpcEndpointServiceDomainNameProps);
    private validateProps;
    /**
     * Sets up Custom Resources to make AWS calls to set up Private DNS on an endpoint service,
     * returning the values to use in a TxtRecord, which AWS uses to verify domain ownership.
     */
    private getPrivateDnsConfiguration;
    /**
     * Creates a Route53 entry and a Custom Resource which explicitly tells AWS to verify ownership
     * of the domain name attached to an endpoint service.
     */
    private verifyPrivateDnsConfiguration;
}
