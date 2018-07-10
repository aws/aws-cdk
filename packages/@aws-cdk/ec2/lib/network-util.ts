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
 * InvalidSubnetCidrError is thrown when attempting to split a CIDR range into more
 * subnets than it has IP space for.
 */
export class InvalidSubnetCidrError extends Error {
    constructor(cidr: string, subnet: string) {
        super('VPC range (' + cidr + ') does not contain ' + subnet);
        // The following line is required for type checking of custom errors, and must be called right after super()
        // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
        Object.setPrototypeOf(this, InvalidSubnetCidrError.prototype);
    }
}

/**
 * InvalidIpAddressError is thrown when attempting to split a CIDR range into more
 * subnets than it has IP space for.
 */
export class InvalidIpAddressError extends Error {
    constructor(ip: string) {
        super(ip + ' is not a valid IP must be (0-255).(0-255).(0-255).(0-255).');
        // The following line is required for type checking of custom errors, and must be called right after super()
        // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
        Object.setPrototypeOf(this, InvalidIpAddressError.prototype);
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
            throw new InvalidIpAddressError(ipAddress);
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
     * takes a number (e.g 2923605416) and converts it to an IPv4 address string
     * currently only supports IPv4
     *
     * Uses the formula:
     * (first octet * 256³) + (second octet * 256²) + (third octet * 256) +
     * (fourth octet)
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
            throw new InvalidIpAddressError(ipAddress);
        }
        return ipAddress;
    }

}

export class NetworkBuilder {
    public readonly networkCidr: CidrBlock;
    protected subnetCidrs: CidrBlock[];
    protected maxIpConsumed: string;

    constructor(cidr: string) {
        this.networkCidr = new CidrBlock(cidr);
        this.subnetCidrs = [];
        this.maxIpConsumed = NetworkUtils.numToIp(NetworkUtils.
            ipToNum(this.networkCidr.minIp()) - 1);
    }

    public addSubnet(mask: number): string {
        return this.addSubnets(mask, 1)[0];
    }

    public addSubnets(mask: number, count?: number): string[] {
        if (mask < 16 || mask > 28) {
            throw new InvalidCidrRangeError(`x.x.x.x/${mask}`);
        }
        const subnets: CidrBlock[] = [];
        if (!count) {
            count = 1;
        }
        for (let i = 0; i < count; i ++) {
            const subnet: CidrBlock = CidrBlock.fromOffsetIp(this.maxIpConsumed, mask);
            this.maxIpConsumed = subnet.maxIp();
            this.subnetCidrs.push(subnet);
            if (!this.validate()) {
                throw new InvalidSubnetCidrError(this.networkCidr.cidr, subnet.cidr);
            }
            subnets.push(subnet);
        }
        return subnets.map((subnet) => (subnet.cidr));
    }

    public get subnets(): string[] {
        return this.subnetCidrs.map((subnet) => (subnet.cidr));
    }

    public validate(): boolean {
        return this.subnetCidrs.map(
            (cidrBlock) => this.networkCidr.containsCidr(cidrBlock)).reduce(
                (containsAll: boolean, contains: boolean) => (containsAll && contains));
    }

}

export class CidrBlock {

    public static calculateNetmask(mask: number): string {
        return NetworkUtils.numToIp(2 ** 32 - 2 ** (32 - mask));
    }

    public static fromOffsetIp(ipAddress: string, mask: number): CidrBlock {
        const initialCidr = new CidrBlock(`${ipAddress}/${mask}`);
        const baseIpNum = NetworkUtils.ipToNum(initialCidr.maxIp()) + 1;
        return new this(`${NetworkUtils.numToIp(baseIpNum)}/${mask}`);
    }

    public readonly cidr: string;
    public readonly netmask: string;
    public readonly mask: number;

    constructor(cidr: string) {
        this.cidr = cidr;
        this.mask = parseInt(cidr.split('/')[1], 10);
        this.netmask = CidrBlock.calculateNetmask(this.mask);
    }

    public maxIp(): string {
        const minIpNum = NetworkUtils.ipToNum(this.minIp());
        return NetworkUtils.numToIp(minIpNum + 2 ** (32 - this.mask) - 1);
    }

    public minIp(): string {
        const netmaskOct = this.netmask.split('.');
        const ipOct = this.cidr.split('/')[0].split('.');
        // tslint:disable:no-bitwise
        return netmaskOct.map(
            (maskOct, index) => parseInt(maskOct, 10) & parseInt(ipOct[index], 10)).join('.');
        // tslint:enable:no-bitwise
    }

    public containsCidr(cidr: CidrBlock): boolean {
        return [
            NetworkUtils.ipToNum(this.minIp()) <= NetworkUtils.ipToNum(cidr.minIp()),
            NetworkUtils.ipToNum(this.maxIp()) >= NetworkUtils.ipToNum(cidr.maxIp()),
        ].reduce((contained: boolean, value: boolean) => (contained && value), true);
    }
}
