import { SubnetConfiguration } from './vpc';
/**
 * An abstract Provider of IpAddresses
 */
export declare class IpAddresses {
    /**
     * Used to provide local Ip Address Management services for your VPC
     *
     * VPC Cidr is supplied at creation and subnets are calculated locally
     *
     */
    static cidr(cidrBlock: string): IIpAddresses;
    /**
     * Used to provide centralized Ip Address Management services for your VPC
     *
     * Uses VPC Cidr allocations from AWS IPAM
     *
     * @see https://docs.aws.amazon.com/vpc/latest/ipam/what-it-is-ipam.html
     */
    static awsIpamAllocation(props: AwsIpamProps): IIpAddresses;
    private constructor();
}
/**
 * Implementations for ip address management
 */
export interface IIpAddresses {
    /**
     * Called by the VPC to retrieve VPC options from the Ipam
     *
     * Don't call this directly, the VPC will call it automatically.
     */
    allocateVpcCidr(): VpcIpamOptions;
    /**
     * Called by the VPC to retrieve Subnet options from the Ipam
     *
     * Don't call this directly, the VPC will call it automatically.
     */
    allocateSubnetsCidr(input: AllocateCidrRequest): SubnetIpamOptions;
}
/**
 * Cidr Allocated Vpc
 */
export interface VpcIpamOptions {
    /**
     * Cidr Block for Vpc
     *
     * @default - Only required when Ipam has concrete allocation available for static Vpc
     */
    readonly cidrBlock?: string;
    /**
     * Cidr Mask for Vpc
     *
     * @default - Only required when using AWS Ipam
     */
    readonly ipv4NetmaskLength?: number;
    /**
     * ipv4 IPAM Pool Id
     *
     * @default - Only required when using AWS Ipam
     */
    readonly ipv4IpamPoolId?: string;
}
/**
 * Subnet requested for allocation
 */
export interface RequestedSubnet {
    /**
     * The availability zone for the subnet
     */
    readonly availabilityZone: string;
    /**
     * Specify configuration parameters for a single subnet group in a VPC
     */
    readonly configuration: SubnetConfiguration;
    /**
     * Id for the Subnet construct
     */
    readonly subnetConstructId: string;
}
/**
 * Request for subnets Cidr to be allocated for a Vpc
 */
export interface AllocateCidrRequest {
    /**
     * The IPv4 CIDR block for this Vpc
     */
    readonly vpcCidr: string;
    /**
     * The Subnets to be allocated
     */
    readonly requestedSubnets: RequestedSubnet[];
}
/**
 * Cidr Allocated Subnets
 */
export interface SubnetIpamOptions {
    /**
     * Cidr Allocations for Subnets
     */
    readonly allocatedSubnets: AllocatedSubnet[];
}
/**
 * Cidr Allocated Subnet
 */
export interface AllocatedSubnet {
    /**
     * Cidr Allocations for a Subnet
     */
    readonly cidr: string;
}
/**
 * Configuration for AwsIpam
 */
export interface AwsIpamProps {
    /**
     * Netmask length for Vpc
     */
    readonly ipv4NetmaskLength: number;
    /**
     * Ipam Pool Id for ipv4 allocation
     */
    readonly ipv4IpamPoolId: string;
    /**
     * Default length for Subnet ipv4 Network mask
     *
     * Specify this option only if you do not specify all Subnets using SubnetConfiguration with a cidrMask
     *
     * @default - Default ipv4 Subnet Mask for subnets in Vpc
     *
     */
    readonly defaultSubnetIpv4NetmaskLength?: number;
}
