import { ISubnet } from './vpc';
/**
 * Contains logic which chooses a set of subnets from a larger list, in conjunction
 * with SubnetSelection, to determine where to place AWS resources such as VPC
 * endpoints, EC2 instances, etc.
 */
export declare abstract class SubnetFilter {
    /**
     * Chooses subnets by id.
     */
    static byIds(subnetIds: string[]): SubnetFilter;
    /**
     * Chooses subnets which are in one of the given availability zones.
    */
    static availabilityZones(availabilityZones: string[]): SubnetFilter;
    /**
     * Chooses subnets such that there is at most one per availability zone.
    */
    static onePerAz(): SubnetFilter;
    /**
     * Chooses subnets which contain any of the specified IP addresses.
    */
    static containsIpAddresses(ipv4addrs: string[]): SubnetFilter;
    /**
     * Chooses subnets which have the provided CIDR netmask.
     */
    static byCidrMask(mask: number): SubnetFilter;
    /**
     * Executes the subnet filtering logic, returning a filtered set of subnets.
     */
    selectSubnets(_subnets: ISubnet[]): ISubnet[];
}
