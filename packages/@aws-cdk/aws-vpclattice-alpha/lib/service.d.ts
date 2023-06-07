import * as core from 'aws-cdk-lib';
import { aws_vpclattice, aws_iam as iam, aws_certificatemanager as certificatemanager } from 'aws-cdk-lib';
import * as constructs from 'constructs';
import { AddListenerProps, IListener, Listener } from './index';
/**
 * Properties to Share the Service
 */
export interface ShareServiceProps {
    /**
     * The name of the service
     */
    readonly name: string;
    /**
     * Allow External Principals
     * @default false
     */
    readonly allowExternalPrincipals?: boolean | undefined;
    /**
     * Principals to share the service with.
     * TO DO, this needs some work
     * @default none
     */
    readonly principals: string[] | undefined;
}
/**
 * Create a vpcLattice service network.
 * Implemented by `Service`.
 */
export interface IService extends core.IResource {
    /**
    * The Amazon Resource Name (ARN) of the service.
    */
    readonly serviceArn: string;
    /**
    * The Id of the Service Network
    */
    readonly serviceId: string;
    /**
     * Add A vpc listener to the Service.
     * @param props
     */
    addListener(props: AddListenerProps): Listener;
    /**
     * Share the service to other accounts via RAM
     * @param props
     */
    share(props: ShareServiceProps): void;
    /**
    * Create a DNS entry in R53 for the service.
    */
    addDNSEntry(props: aws_vpclattice.CfnService.DnsEntryProperty): void;
    /**
     * Add a certificate to the service
     * @param certificate
     */
    addCertificate(certificate: certificatemanager.Certificate): void;
    /**
     * add a custom domain to the service
     * @param domain
     */
    addCustomDomain(domain: string): void;
    /**
     * add a name for the service
     * @default cloudformation will provide a name
     */
    addName(name: string): void;
    /**
     * grant access to the service
     *
     */
    grantAccess(principals: iam.IPrincipal[]): void;
    /**
     * Apply the authAuthPolicy to the Service
     */
    applyAuthPolicy(): iam.PolicyDocument;
    /**
     * Add A policyStatement to the Auth Policy
     */
    addPolicyStatement(statement: iam.PolicyStatement): void;
}
/**
 * Properties for a Lattice Service
 */
export interface LatticeServiceProps {
    /**
     * Name for the service
     * @default cloudformation will provide a name
     */
    readonly name?: string | undefined;
    /**
     * The authType of the Service
     * @default 'AWS_IAM'
     */
    readonly authType?: string | undefined;
    /**
     * Listeners that will be attached to the service
    */
    readonly listeners?: IListener[] | undefined;
    /**
     * A certificate that may be used by the service
     */
    readonly certificate?: certificatemanager.Certificate | undefined;
    /**
     * A customDomain used by the service
     */
    readonly customDomain?: string | undefined;
    /**
     * A customDomain
     */
    readonly dnsEntry?: aws_vpclattice.CfnService.DnsEntryProperty | undefined;
    /**
     *
     */
    readonly shares?: ShareServiceProps[] | undefined;
    /**
     * allow principals outside of this organisation
     * @default false
     */
    readonly allowExternalPrincipals?: boolean | undefined;
    /**
     * Reject Anonymous Access to the Service
     * @default false
     */
    readonly rejectAnonymousAccess?: boolean | undefined;
}
/**
 * Create a vpcLattice Service
 */
export declare class Service extends core.Resource implements IService {
    /**
     * The Id of the Service
     */
    readonly serviceId: string;
    /**
     * The Arn of the Service
     */
    readonly serviceArn: string;
    /**
     * The authType of the service.
     */
    authType: string | undefined;
    /**
     * A certificate that may be used by the service
     */
    certificate: certificatemanager.Certificate | undefined;
    /**
     * A custom Domain used by the service
     */
    customDomain: string | undefined;
    /**
     * A DNS Entry for the service
     */
    dnsEntry: aws_vpclattice.CfnService.DnsEntryProperty | undefined;
    /**
    * A name for the service
    */
    name: string | undefined;
    /**
     * The auth Policy for the service.
     */
    authPolicy: iam.PolicyDocument;
    constructor(scope: constructs.Construct, id: string, props: LatticeServiceProps);
    /**
     * .grantAccess on a lattice service, will permit the principals to
     * access all of the service. Consider using more granual permissions
     * at the rule level.
     *
     * @param principals
     */
    grantAccess(principals: iam.IPrincipal[]): void;
    applyAuthPolicy(): iam.PolicyDocument;
    addPolicyStatement(statement: iam.PolicyStatement): void;
    /**
     * Provide an ACM certificate to the service
     * @param certificate
     */
    addCertificate(certificate: core.aws_certificatemanager.Certificate): void;
    /**
     * Add a name to the Service
     * @param name
     */
    addName(name: string): void;
    /**
     * Add a custom domain to the service
     * @param domain the domain
     */
    addCustomDomain(domain: string): void;
    /**
     * Add a DNS entry for the service
     * @param dnsEntry
     */
    addDNSEntry(dnsEntry: aws_vpclattice.CfnService.DnsEntryProperty): void;
    /**
     * Adds a listener to the service.
     * @param props AddListenerProps
     * @returns Listener
     */
    addListener(props: AddListenerProps): Listener;
    /**
     * Share the service to other accounts via RAM
     * @param props SharedServiceProps
     */
    share(props: ShareServiceProps): void;
}
