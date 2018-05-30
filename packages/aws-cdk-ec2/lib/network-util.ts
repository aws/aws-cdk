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

}
