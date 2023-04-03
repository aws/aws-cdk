import { Construct } from 'constructs';
import { ISubnet, SubnetType } from './vpc';
/**
 * Turn an arbitrary string into one that can be used as a CloudFormation identifier by stripping special characters
 *
 * (At the moment, no efforts are taken to prevent collisions, but we can add that later when it becomes necessary).
 */
export declare function slugify(x: string): string;
/**
 * The default names for every subnet type
 */
export declare function defaultSubnetName(type: SubnetType): "Public" | "Private" | "Isolated";
/**
 * Return a subnet name from its construct ID
 *
 * All subnet names look like NAME <> "Subnet" <> INDEX
 */
export declare function subnetGroupNameFromConstructId(subnet: ISubnet): string;
/**
 * Make the subnet construct ID from a name and number
 */
export declare function subnetId(name: string, i: number): string;
export declare class ImportSubnetGroup {
    private readonly availabilityZones;
    private readonly subnetIds;
    private readonly names;
    private readonly routeTableIds;
    private readonly ipv4CidrBlocks;
    private readonly groups;
    constructor(subnetIds: string[] | undefined, names: string[] | undefined, routeTableIds: string[] | undefined, ipv4CidrBlocks: string[] | undefined, type: SubnetType, availabilityZones: string[], idField: string, nameField: string, routeTableIdField: string, ipv4CidrBlockField: string);
    import(scope: Construct): ISubnet[];
    /**
     * Return a list with a name for every subnet
     */
    private normalizeNames;
    /**
     * Return the i'th AZ
     */
    private pickAZ;
}
/**
 * Generate the list of numbers of [0..n)
 */
export declare function range(n: number): number[];
/**
 * Return the union of table IDs from all selected subnets
 */
export declare function allRouteTableIds(subnets: ISubnet[]): string[];
export declare function flatten<A>(xs: A[][]): A[];
