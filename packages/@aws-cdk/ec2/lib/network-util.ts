/**
 * InvalidCidrRangeError is thrown when attempting to perform operations on a CIDR
 * range that is either not valid, or outside of the VPC size limits.
 */
export class InvalidCidrRangeError extends Error {
    constructor(cidr: string) {
        super(cidr + ' is not a valid VPC CIDR range (must be between /16 and /28)');
        // The following line is required for type checking of custom errors, and must be called right after super()
        // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
        Object.setPrototypeOf(this, InvalidCidrRangeError.prototype);
    }
}

/**
 * InvalidSubnetCountError is thrown when attempting to split a CIDR range into more
 * subnets than it has IP space for.
 */
export class InvalidSubnetCountError extends Error {
    constructor(cidr: string, count: number) {
        super('VPC range (' + cidr + ') does not have enough IP space to be split into ' + count + ' subnets');
        // The following line is required for type checking of custom errors, and must be called right after super()
        // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
        Object.setPrototypeOf(this, InvalidSubnetCountError.prototype);
    }
}

/**
 * NetworkUtils contains helpers to work with network constructs (subnets/ranges)
 */
export class NetworkUtils {

    /**
     *
     * splitCIDR takes a CIDR range (e.g. 10.0.0.0/16) and splits it into
     * the provided number of smaller subnets (eg 2 of 10.0.0.0/17).
     *
     * @param  {string} cidr The CIDR range to split (e.g. 10.0.0.0/16)
     * @param  {number} subnetCount How many subnets to create (min:2 max:30)
     * @returns Array An array of CIDR strings (e.g. [ '10.0.0.0/17', '10.0.128.0/17' ])
     */
    public static splitCIDR(cidr: string, subnetCount: number): string[] {

        const parts = cidr.toString().split(/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)\/([0-9]+)/);

        if (parts.length !== 7) {
            throw new InvalidCidrRangeError(cidr);
        }

        const range = parseInt(parts[5], 10);
        const rangeHosts = Math.pow(2, (32 - range));
        const subnetSize = range + Math.round((subnetCount / 2));
        const subnetHosts = Math.pow(2, (32 - subnetSize));

        // Ensure the VPC cidr range fits within the EC2 VPC parameter ranges
        if (range < 16 || range > 28) {
            throw new InvalidCidrRangeError(cidr);
        }

        // Ensure the resulting subnet size is within the EC2 VPC parameter ranges
        if (subnetSize < 16 || subnetSize > 28) {
            throw new InvalidSubnetCountError(cidr, subnetCount);
        }

        // Check that the requested number of subnets fits into the provided CIDR range
        if (subnetHosts === 0 || subnetHosts * subnetCount > rangeHosts) {
            throw new InvalidSubnetCountError(cidr, subnetCount);
        }

        // Convert the initial CIDR to decimal format
        const rangeDec = ((((((+parts[1]) * 256) + (+parts[2])) * 256) + (+parts[3])) * 256) + (+parts[4]);

        // Generate each of the subnets required
        const subnets: string[] = [];
        for (let i = 0; i < subnetCount; i++) {
            const subnetDec = rangeDec + (i * subnetHosts);
            // tslint:disable:no-bitwise
            const p1 = subnetDec & 255;
            const p2 = ((subnetDec >> 8) & 255);
            const p3 = ((subnetDec >> 16) & 255);
            const p4 = ((subnetDec >> 24) & 255);
            // tslint:enable:no-bitwise
            subnets.push(p4 + '.' + p3 + '.' + p2 + '.' + p1 + '/' + subnetSize);
        }

        return subnets;

    }

    /**
     * Validates an IPv4 string
     *
     * returns true of the string contains 4 numbers between 0-255 delimited by
     * a `.` character
     */
    public static validIp(ipAddress: string): boolean {
        const octets = ipAddress.split('.');
        if (octets.length !== 4) {
            return false;
        }
        return octets.map((octet: string) => parseInt(octet, 10)).
            filter((octet: number) => octet >= 0 && octet <= 255).length === 4;
    }

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
    public static ipToNum(ipAddress: string): number {
        if (!this.validIp(ipAddress)) {
            throw new Error(`${ipAddress} is not valid`);
        }

        return ipAddress
            .split('.')
            .reduce(
                (p: number, c: string, i: number) => p + parseInt(c, 10) * 256 ** (3 - i),
                0
            );
    }

    /**
     * Takes number and converts it to IPv4 address string
     *
     * Takes a number (e.g 2923605416) and converts it to an IPv4 address string
     * currently only supports IPv4
     *
     * @param  {number} the integer value of the IP address (e.g 2923605416)
     * @returns {string} the IPv4 address (e.g. 174.66.173.168)
     */
    public static numToIp(ipNum: number): string {
        // this all because bitwise math is signed
        let remaining = ipNum;
        const address = [];
        for (let i = 0; i < 4; i++) {
            if (remaining !== 0) {
                address.push(Math.floor(remaining / 256 ** (3 - i)));
                remaining = remaining % 256 ** (3 - i);
            } else {
                address.push(0);
            }
        }
        const ipAddress: string = address.join('.');
        if ( !this.validIp(ipAddress) ) {
            throw new Error(`${ipAddress} is not a valid IP Address`);
        }
        return ipAddress;
    }
}

/**
 * Creates a network based on a CIDR Block to build contained subnets
 */
export class NetworkBuilder {

    /**
     * The CIDR range used when creating the network
     */
    public readonly networkCidr: CidrBlock;

    /**
     * The list of CIDR blocks for subnets within this network
     */
    private readonly subnetCidrs: CidrBlock[] = [];

    /**
     * The next available IP address as a number
     */
    private nextIp: number;

    /**
     * Create a network using the provided CIDR block
     *
     * No subnets are allocated in the constructor, the maxIpConsumed is set one
     * less than the first IP in the network
     *
     */
    constructor(cidr: string) {
        this.networkCidr = new CidrBlock(cidr);
        this.subnetCidrs = [];
        this.nextIp = this.networkCidr.minAddress();
    }

    /**
     * Add a subnet to the network and update the maxIpConsumed
     */
    public addSubnet(mask: number): string {
        return this.addSubnets(mask, 1)[0];
    }

    /**
     * Add {count} number of subnets to the network and update the maxIpConsumed
     */
    public addSubnets(mask: number, count: number = 1): string[] {
        if (mask < 16 || mask > 28  ) {
            throw new InvalidCidrRangeError(`x.x.x.x/${mask}`);
        }
        const maxIp = this.nextIp + (CidrBlock.calculateNetsize(mask) * count);
        if (this.networkCidr.maxAddress() < maxIp - 1) {
            throw new Error(`${count} of /${mask} exceeds remaining space of ${this.networkCidr.cidr}`);
        }
        const subnets: CidrBlock[] = [];
        for (let i = 0; i < count; i ++) {
            const subnet: CidrBlock = CidrBlock.fromOffsetIp(this.nextIp, mask);
            this.nextIp = subnet.maxAddress() + 1;
            this.subnetCidrs.push(subnet);
            subnets.push(subnet);
        }
        return subnets.map((subnet) => (subnet.cidr));
    }

    /**
     * return the CIDR notation strings for all subnets in the network
     */
    public get cidrStrings(): string[] {
        return this.subnetCidrs.map((subnet) => (subnet.cidr));
    }

    /**
     * Calculates the largest subnet to create of the given count from the
     * remaining IP space
     */
    public maskForRemainingSubnets(subnetCount: number): number {
        const remaining: number = this.networkCidr.maxAddress() - this.nextIp + 1;
        const ipsPerSubnet: number = Math.floor(remaining / subnetCount);
        return 32 - Math.floor(Math.log2(ipsPerSubnet));
    }
}

/**
 * Creates a CIDR Block
 */
export class CidrBlock {

    /**
     * Calculates the netmask for a given CIDR mask
     *
     * For example:
     * CidrBlock.calculateNetmask(24) returns '255.255.255.0'
     */
    public static calculateNetmask(mask: number): string {
        return NetworkUtils.numToIp(2 ** 32 - 2 ** (32 - mask));
    }

    /**
     * Calculates the number IP addresses in a CIDR Mask
     *
     * For example:
     * CidrBlock.calculateNetmask(24) returns 256
     */
    public static calculateNetsize(mask: number): number {
        return 2 ** (32 - mask);
    }

    /**
     * Given an IP and CIDR mask number returns the next CIDR Block available
     *
     * For example:
     * CidrBlock.fromOffsetIp('10.0.0.15', 24) returns new CidrBlock('10.0.1.0/24')
     */
    public static fromOffsetIp(ipAddress: number, mask: number): CidrBlock {
        const ipNum = ipAddress + CidrBlock.calculateNetsize(mask) - 1;
        return new this(`${NetworkUtils.numToIp(ipNum)}/${mask}`);
    }

    /*
     * The CIDR Block represented as a string e.g. '10.0.0.0/21'
     */
    public readonly cidr: string;

    /*
     * The netmask for the CIDR represented as a string e.g. '255.255.255.0'
     */
    public readonly netmask: string;

    /*
     * The CIDR mask e.g. for CIDR '10.0.0.0/21' returns 21
     */
    public readonly mask: number;

    /**
     * The total number of IP addresses in the CIDR
     */
    public readonly networkSize: number;

    /**
     * The first network address in the CIDR as number
     */
    private readonly networkAddress: number;

    /*
     * Creates a new CidrBlock
     */
    constructor(cidr: string) {
        this.mask = parseInt(cidr.split('/')[1], 10);
        this.netmask = CidrBlock.calculateNetmask(this.mask);
        this.networkSize = 2 ** (32 - this.mask);
        this.networkAddress = NetworkUtils.ipToNum(cidr.split('/')[0]);
        this.cidr = `${this.minIp()}/${this.mask}`;
    }

    /*
     * The maximum IP in the CIDR Blcok e.g. '10.0.8.255'
     */
    public maxIp(): string {
        // min + (2^(32-mask)) - 1 [zero needs to count]
        return NetworkUtils.numToIp(this.maxAddress());
    }

    /*
     * The minimum IP in the CIDR Blcok e.g. '10.0.0.0'
     */
    public minIp(): string {
        return NetworkUtils.numToIp(this.minAddress());
    }

    /*
     * Returns true if this CidrBlock fully contains the provided CidrBlock
     */
    public containsCidr(other: CidrBlock): boolean {
        return (this.maxAddress() >= other.maxAddress()) &&
            (this.minAddress() <= other.minAddress());
    }

    /*
     * Returns the number representation for the minimum IPv4 address
     */
    public minAddress(): number {
        const div = this.networkAddress % this.networkSize;
        return this.networkAddress - div;
    }

    /*
     * Returns the number representation for the maximum IPv4 address
     */
    public maxAddress(): number {
        // min + (2^(32-mask)) - 1 [zero needs to count]
        return this.minAddress() + this.networkSize - 1;
    }
}
