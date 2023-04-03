/**
 * InvalidCidrRangeError is thrown when attempting to perform operations on a CIDR
 * range that is either not valid, or outside of the VPC size limits.
 */
export declare class InvalidCidrRangeError extends Error {
    constructor(cidr: string);
}
/**
 * NetworkUtils contains helpers to work with network constructs (subnets/ranges)
 */
export declare class NetworkUtils {
    /**
     * Validates an IPv4 string
     *
     * returns true of the string contains 4 numbers between 0-255 delimited by
     * a `.` character
     */
    static validIp(ipAddress: string): boolean;
    /**
     * Converts a string IPv4 to a number
     *
     * takes an IP Address (e.g. 174.66.173.168) and converts to a number
     * (e.g 2923605416); currently only supports IPv4
     *
     * Uses the formula:
     * (first octet * 256³) + (second octet * 256²) + (third octet * 256) +
     * (fourth octet)
     *
     * @param  {string} the IP address (e.g. 174.66.173.168)
     * @returns {number} the integer value of the IP address (e.g 2923605416)
     */
    static ipToNum(ipAddress: string): number;
    /**
     * Takes number and converts it to IPv4 address string
     *
     * Takes a number (e.g 2923605416) and converts it to an IPv4 address string
     * currently only supports IPv4
     *
     * @param  {number} the integer value of the IP address (e.g 2923605416)
     * @returns {string} the IPv4 address (e.g. 174.66.173.168)
     */
    static numToIp(ipNum: number): string;
}
/**
 * Creates a network based on a CIDR Block to build contained subnets
 */
export declare class NetworkBuilder {
    /**
     * The CIDR range used when creating the network
     */
    readonly networkCidr: CidrBlock;
    /**
     * The list of CIDR blocks for subnets within this network
     */
    private readonly subnetCidrs;
    /**
     * The next available IP address as a number
     */
    private nextAvailableIp;
    /**
     * Create a network using the provided CIDR block
     *
     * No subnets are allocated in the constructor, the maxIpConsumed is set one
     * less than the first IP in the network
     *
     */
    constructor(cidr: string);
    /**
     * Add a subnet to the network and update the maxIpConsumed
     */
    addSubnet(mask: number): string;
    /**
     * Add {count} number of subnets to the network and update the maxIpConsumed
     */
    addSubnets(mask: number, count?: number): string[];
    /**
     * return the CIDR notation strings for all subnets in the network
     */
    get cidrStrings(): string[];
    /**
     * Calculates the largest subnet to create of the given count from the
     * remaining IP space
     */
    maskForRemainingSubnets(subnetCount: number): number;
}
/**
 * A block of IP address space with a given bit prefix
 */
export declare class CidrBlock {
    /**
     * Calculates the netmask for a given CIDR mask
     *
     * For example:
     * CidrBlock.calculateNetmask(24) returns '255.255.255.0'
     */
    static calculateNetmask(mask: number): string;
    /**
     * Calculates the number IP addresses in a CIDR Mask
     *
     * For example:
     * CidrBlock.calculateNetsize(24) returns 256
     */
    static calculateNetsize(mask: number): number;
    readonly cidr: string;
    readonly mask: number;
    readonly networkSize: number;
    private readonly networkAddress;
    constructor(cidr: string);
    constructor(ipAddress: number, mask: number);
    maxIp(): string;
    minIp(): string;
    minAddress(): number;
    maxAddress(): number;
    nextBlock(): CidrBlock;
    containsCidr(other: CidrBlock): boolean;
}
