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

    public static validIp(ipAddress: string): boolean {
        return ipAddress.split('.').map((octet: string) => parseInt(octet, 10)).
            filter((octet: number) => octet >= 0 && octet <= 255).length === 4;
    }
    /**
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
     * the CIDR range used when creating the network
     */
    public readonly networkCidr: CidrBlock;

    /**
     * the list of CIDR blocks for subnets within this network
     */
    protected subnetCidrs: CidrBlock[];

    /**
     * the current highest allocated IP address in any subnet
     */
    protected maxIpConsumed: string;

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
        this.maxIpConsumed = NetworkUtils.numToIp(NetworkUtils.
            ipToNum(this.networkCidr.minIp()) - 1);
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
    public addSubnets(mask: number, count?: number): string[] {
        if (mask < 16 || mask > 28) {
            throw new InvalidCidrRangeError(`x.x.x.x/${mask}`);
        }
        const subnets: CidrBlock[] = [];
        count = count || 1;
        for (let i = 0; i < count; i ++) {
            const subnet: CidrBlock = CidrBlock.fromOffsetIp(this.maxIpConsumed, mask);
            this.maxIpConsumed = subnet.maxIp();
            this.subnetCidrs.push(subnet);
            if (!this.validate()) {
                throw new Error(`${this.networkCidr.cidr} does not fully contain ${subnet.cidr}`);
            }
            subnets.push(subnet);
        }
        return subnets.map((subnet) => (subnet.cidr));
    }

    /**
     * return the CIDR notation strings for all subnets in the network
     */
    public get subnets(): string[] {
        return this.subnetCidrs.map((subnet) => (subnet.cidr));
    }

    /**
     * Calculates the largest subnet to create of the given count from the
     * remaining IP space
     */
    public maskForRemainingSubnets(subnetCount: number): number {
        const remaining: number =
            NetworkUtils.ipToNum(this.networkCidr.maxIp()) -
            NetworkUtils.ipToNum(this.maxIpConsumed);
        const ipsPerSubnet: number = Math.floor(remaining / subnetCount);
        return 32 - Math.floor(Math.log2(ipsPerSubnet));
        // return this.addSubnets(mask, subnetCount);
    }

    protected validate(): boolean {
        return this.subnetCidrs.map(
            (cidrBlock) => this.networkCidr.containsCidr(cidrBlock)).
            filter( (contains) => (contains === false)).length === 0;
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
     * Given an IP and CIDR mask number returns the next CIDR Block available
     *
     * For example:
     * CidrBlock.fromOffsetIp('10.0.0.15', 24) returns '10.0.1.0/24'
     */
    public static fromOffsetIp(ipAddress: string, mask: number): CidrBlock {
        const initialCidr = new CidrBlock(`${ipAddress}/${mask}`);
        const baseIpNum = NetworkUtils.ipToNum(initialCidr.maxIp()) + 1;
        return new this(`${NetworkUtils.numToIp(baseIpNum)}/${mask}`);
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

    /*
     * Creates a new CidrBlock
     */
    constructor(cidr: string) {
        this.cidr = cidr;
        this.mask = parseInt(cidr.split('/')[1], 10);
        this.netmask = CidrBlock.calculateNetmask(this.mask);
    }

    /*
     * The maximum IP in the CIDR Blcok e.g. '10.0.8.255'
     */
    public maxIp(): string {
        const minIpNum = NetworkUtils.ipToNum(this.minIp());
        return NetworkUtils.numToIp(minIpNum + 2 ** (32 - this.mask) - 1);
    }

    /*
     * The minimum IP in the CIDR Blcok e.g. '10.0.0.0'
     */
    public minIp(): string {
        const netmaskOct = this.netmask.split('.');
        const ipOct = this.cidr.split('/')[0].split('.');
        // tslint:disable:no-bitwise
        return netmaskOct.map(
            (maskOct, index) => parseInt(maskOct, 10) & parseInt(ipOct[index], 10)).join('.');
        // tslint:enable:no-bitwise
    }

    /*
     * Returns true if this CidrBlock fully contains the provided CidrBlock
     */
    public containsCidr(cidr: CidrBlock): boolean {
        return [
            NetworkUtils.ipToNum(this.minIp()) <= NetworkUtils.ipToNum(cidr.minIp()),
            NetworkUtils.ipToNum(this.maxIp()) >= NetworkUtils.ipToNum(cidr.maxIp()),
        ].filter((contains) => (contains === false)).length === 0;
    }
}
