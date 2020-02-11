import * as cdk from '@aws-cdk/core';
import * as waf from './index';

export enum IPAddressVersion {
    IPV4 = 'IPV4',
    IPV6 = 'IPV6'
}

export enum IPSetScope {
    CLOUDFRONT = 'CLOUDFRONT',
    REGIONAL = 'REGIONAL'
}

export interface IIPSet {
    /**
     * A friendly name of the IP set. You cannot change the name of an IPSet
     * after you create it.
     */
    readonly ipSetName: string;
}

export abstract class IPSetBase extends cdk.Resource implements IIPSet {
    /**
     * A friendly name of the IP set. You cannot change the name of an IPSet
     * after you create it.
     */
    public abstract readonly ipSetName: string;
}

export interface IPSetProps {
    /**
     * A friendly name of the IP set. You cannot change the name of an IPSet
     * after you create it.
     */
    readonly name?: string;

    /**
     * A friendly description of the IP set. You cannot change the description
     * of an IP set after you create it.
     */
    readonly description?: string;

    /**
     * Contains an array of strings that specify one or more IP addresses or
     * blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
     * AWS WAF supports all address ranges for IP versions IPv4 and IPv6.
     */
    readonly addresses?: string[];

    /**
     * Specify IPV4 or IPV6.
     *
     * @efault IPV4
     */
    readonly ipAddressVersion: IPAddressVersion;

    /**
     * Specifies whether this is for an AWS CloudFront distribution or for a
     * regional application. A regional application can be an Application
     * Load Balancer (ALB) or an API Gateway stage.
     *
     * @default CLOUDFRONT
     */
    readonly scope: IPSetScope;
}

export class IPSet extends IPSetBase {
    /**
     * A friendly name of the IP set. You cannot change the name of an IPSet
     * after you create it.
     */
    public readonly ipSetName: string;

    /**
     * Contains an array of strings that specify one or more IP addresses or
     * blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
     * AWS WAF supports all address ranges for IP versions IPv4 and IPv6.
     */
    private addresses: string[] = [];

    constructor(scope: cdk.Construct, id: string, props: IPSetProps) {
        super(scope, id, {
            physicalName: props.name || cdk.PhysicalName.GENERATE_IF_NEEDED
        });

        this.ipSetName = this.physicalName;

        this.addAddresses(...props.addresses || []);

        const resource: waf.CfnIPSet = new waf.CfnIPSet(this, 'Resource', {
            addresses: {
                ipAddresses: cdk.Lazy.listValue({ produce: () => this.addresses }, { omitEmpty: true })
            },
            ipAddressVersion: props.ipAddressVersion || IPAddressVersion.IPV4,
            name: props.name,
            scope: props.scope || IPSetScope.CLOUDFRONT,
            description: props.description
        });

        this.node.defaultChild = resource;
    }

    /**
     * Adds an ip address to the the addresses list
     */
    public addAddresses(...addresses: string[]): void {
        for (const address of addresses) {
            this.addresses.push(address);
        }
    }
}
