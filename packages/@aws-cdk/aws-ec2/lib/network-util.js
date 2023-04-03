"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CidrBlock = exports.NetworkBuilder = exports.NetworkUtils = exports.InvalidCidrRangeError = void 0;
/**
 * InvalidCidrRangeError is thrown when attempting to perform operations on a CIDR
 * range that is either not valid, or outside of the VPC size limits.
 */
class InvalidCidrRangeError extends Error {
    constructor(cidr) {
        super(cidr + ' is not a valid VPC CIDR range (must be between /16 and /28)');
        // The following line is required for type checking of custom errors, and must be called right after super()
        // https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
        Object.setPrototypeOf(this, InvalidCidrRangeError.prototype);
    }
}
exports.InvalidCidrRangeError = InvalidCidrRangeError;
/**
 * NetworkUtils contains helpers to work with network constructs (subnets/ranges)
 */
class NetworkUtils {
    /**
     * Validates an IPv4 string
     *
     * returns true of the string contains 4 numbers between 0-255 delimited by
     * a `.` character
     */
    static validIp(ipAddress) {
        const octets = ipAddress.split('.');
        if (octets.length !== 4) {
            return false;
        }
        return octets.map((octet) => parseInt(octet, 10)).
            filter((octet) => octet >= 0 && octet <= 255).length === 4;
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
    static ipToNum(ipAddress) {
        if (!this.validIp(ipAddress)) {
            throw new Error(`${ipAddress} is not valid`);
        }
        return ipAddress
            .split('.')
            .reduce((p, c, i) => p + parseInt(c, 10) * 256 ** (3 - i), 0);
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
    static numToIp(ipNum) {
        // this all because bitwise math is signed
        let remaining = ipNum;
        const address = new Array();
        for (let i = 0; i < 4; i++) {
            if (remaining !== 0) {
                address.push(Math.floor(remaining / 256 ** (3 - i)));
                remaining = remaining % 256 ** (3 - i);
            }
            else {
                address.push(0);
            }
        }
        const ipAddress = address.join('.');
        if (!this.validIp(ipAddress)) {
            throw new Error(`${ipAddress} is not a valid IP Address`);
        }
        return ipAddress;
    }
}
exports.NetworkUtils = NetworkUtils;
/**
 * Creates a network based on a CIDR Block to build contained subnets
 */
class NetworkBuilder {
    /**
     * Create a network using the provided CIDR block
     *
     * No subnets are allocated in the constructor, the maxIpConsumed is set one
     * less than the first IP in the network
     *
     */
    constructor(cidr) {
        /**
         * The list of CIDR blocks for subnets within this network
         */
        this.subnetCidrs = [];
        this.networkCidr = new CidrBlock(cidr);
        this.subnetCidrs = [];
        this.nextAvailableIp = this.networkCidr.minAddress();
    }
    /**
     * Add a subnet to the network and update the maxIpConsumed
     */
    addSubnet(mask) {
        return this.addSubnets(mask, 1)[0];
    }
    /**
     * Add {count} number of subnets to the network and update the maxIpConsumed
     */
    addSubnets(mask, count = 1) {
        if (mask < 16 || mask > 28) {
            throw new InvalidCidrRangeError(`x.x.x.x/${mask}`);
        }
        const maxIp = this.nextAvailableIp + (CidrBlock.calculateNetsize(mask) * count);
        if (this.networkCidr.maxAddress() < maxIp - 1) {
            throw new Error(`${count} of /${mask} exceeds remaining space of ${this.networkCidr.cidr}`);
        }
        const subnets = [];
        for (let i = 0; i < count; i++) {
            const subnet = new CidrBlock(this.nextAvailableIp, mask);
            this.nextAvailableIp = subnet.nextBlock().minAddress();
            this.subnetCidrs.push(subnet);
            subnets.push(subnet);
        }
        return subnets.map((subnet) => (subnet.cidr));
    }
    /**
     * return the CIDR notation strings for all subnets in the network
     */
    get cidrStrings() {
        return this.subnetCidrs.map((subnet) => (subnet.cidr));
    }
    /**
     * Calculates the largest subnet to create of the given count from the
     * remaining IP space
     */
    maskForRemainingSubnets(subnetCount) {
        const remaining = this.networkCidr.maxAddress() - this.nextAvailableIp + 1;
        const ipsPerSubnet = Math.floor(remaining / subnetCount);
        return 32 - Math.floor(Math.log2(ipsPerSubnet));
    }
}
exports.NetworkBuilder = NetworkBuilder;
/**
 * A block of IP address space with a given bit prefix
 */
class CidrBlock {
    constructor(ipAddressOrCidr, mask) {
        if (typeof ipAddressOrCidr === 'string') {
            this.mask = parseInt(ipAddressOrCidr.split('/')[1], 10);
            this.networkAddress = NetworkUtils.ipToNum(ipAddressOrCidr.split('/')[0]) +
                CidrBlock.calculateNetsize(this.mask) - 1;
        }
        else {
            if (typeof mask === 'number') {
                this.mask = mask;
            }
            else {
                // this should be impossible
                this.mask = 16;
            }
            this.networkAddress = ipAddressOrCidr + CidrBlock.calculateNetsize(this.mask) - 1;
            this.networkSize = 2 ** (32 - this.mask);
        }
        this.networkSize = 2 ** (32 - this.mask);
        this.cidr = `${this.minIp()}/${this.mask}`;
    }
    /**
     * Calculates the netmask for a given CIDR mask
     *
     * For example:
     * CidrBlock.calculateNetmask(24) returns '255.255.255.0'
     */
    static calculateNetmask(mask) {
        return NetworkUtils.numToIp(2 ** 32 - 2 ** (32 - mask));
    }
    /**
     * Calculates the number IP addresses in a CIDR Mask
     *
     * For example:
     * CidrBlock.calculateNetsize(24) returns 256
     */
    static calculateNetsize(mask) {
        return 2 ** (32 - mask);
    }
    /*
     * The maximum IP in the CIDR Block e.g. '10.0.8.255'
     */
    maxIp() {
        // min + (2^(32-mask)) - 1 [zero needs to count]
        return NetworkUtils.numToIp(this.maxAddress());
    }
    /*
     * The minimum IP in the CIDR Block e.g. '10.0.0.0'
     */
    minIp() {
        return NetworkUtils.numToIp(this.minAddress());
    }
    /*
     * Returns the number representation for the minimum IPv4 address
     */
    minAddress() {
        const div = this.networkAddress % this.networkSize;
        return this.networkAddress - div;
    }
    /*
     * Returns the number representation for the maximum IPv4 address
     */
    maxAddress() {
        // min + (2^(32-mask)) - 1 [zero needs to count]
        return this.minAddress() + this.networkSize - 1;
    }
    /*
     * Returns the next CIDR Block of the same mask size
     */
    nextBlock() {
        return new CidrBlock(this.maxAddress() + 1, this.mask);
    }
    /*
     * Returns true if this CidrBlock fully contains the provided CidrBlock
     */
    containsCidr(other) {
        return (this.maxAddress() >= other.maxAddress()) &&
            (this.minAddress() <= other.minAddress());
    }
}
exports.CidrBlock = CidrBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay11dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmV0d29yay11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILE1BQWEscUJBQXNCLFNBQVEsS0FBSztJQUM5QyxZQUFZLElBQVk7UUFDdEIsS0FBSyxDQUFDLElBQUksR0FBRyw4REFBOEQsQ0FBQyxDQUFDO1FBQzdFLDRHQUE0RztRQUM1RyxnRkFBZ0Y7UUFDaEYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDOUQ7Q0FDRjtBQVBELHNEQU9DO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFFdkI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQWlCO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztLQUN0RTtJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBaUI7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFNBQVMsZUFBZSxDQUFDLENBQUM7U0FDOUM7UUFFRCxPQUFPLFNBQVM7YUFDYixLQUFL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OztPQUVHO0lBQ0ksS0FBSztRQUNWLGdEQUFnRDtRQUNoRCxPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7T0FFRztJQUNJLEtBQUs7UUFDVixPQUFPLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDaEQ7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDZixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbkQsT0FBTyxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ksVUFBVTtRQUNmLGdEQUFnRDtRQUNoRCxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztLQUNqRDtJQUVEOztPQUVHO0lBQ0ksU0FBUztRQUNkLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEQ7SUFFRDs7T0FFRztJQUNJLFlBQVksQ0FBQyxLQUFnQjtRQUNsQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUM5QyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUM3QztDQUNGO0FBeEhELDhCQXdIQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSW52YWxpZENpZHJSYW5nZUVycm9yIGlzIHRocm93biB3aGVuIGF0dGVtcHRpbmcgdG8gcGVyZm9ybSBvcGVyYXRpb25zIG9uIGEgQ0lEUlxuICogcmFuZ2UgdGhhdCBpcyBlaXRoZXIgbm90IHZhbGlkLCBvciBvdXRzaWRlIG9mIHRoZSBWUEMgc2l6ZSBsaW1pdHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBJbnZhbGlkQ2lkclJhbmdlRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKGNpZHI6IHN0cmluZykge1xuICAgIHN1cGVyKGNpZHIgKyAnIGlzIG5vdCBhIHZhbGlkIFZQQyBDSURSIHJhbmdlIChtdXN0IGJlIGJldHdlZW4gLzE2IGFuZCAvMjgpJyk7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBsaW5lIGlzIHJlcXVpcmVkIGZvciB0eXBlIGNoZWNraW5nIG9mIGN1c3RvbSBlcnJvcnMsIGFuZCBtdXN0IGJlIGNhbGxlZCByaWdodCBhZnRlciBzdXBlcigpXG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzE2MjYyMzEvY3VzdG9tLWVycm9yLWNsYXNzLWluLXR5cGVzY3JpcHRcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgSW52YWxpZENpZHJSYW5nZUVycm9yLnByb3RvdHlwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBOZXR3b3JrVXRpbHMgY29udGFpbnMgaGVscGVycyB0byB3b3JrIHdpdGggbmV0d29yayBjb25zdHJ1Y3RzIChzdWJuZXRzL3JhbmdlcylcbiAqL1xuZXhwb3J0IGNsYXNzIE5ldHdvcmtVdGlscyB7XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBhbiBJUHY0IHN0cmluZ1xuICAgKlxuICAgKiByZXR1cm5zIHRydWUgb2YgdGhlIHN0cmluZyBjb250YWlucyA0IG51bWJlcnMgYmV0d2VlbiAwLTI1NSBkZWxpbWl0ZWQgYnlcbiAgICogYSBgLmAgY2hhcmFjdGVyXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHZhbGlkSXAoaXBBZGRyZXNzOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICBjb25zdCBvY3RldHMgPSBpcEFkZHJlc3Muc3BsaXQoJy4nKTtcbiAgICBpZiAob2N0ZXRzLmxlbmd0aCAhPT0gNCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2N0ZXRzLm1hcCgob2N0ZXQ6IHN0cmluZykgPT4gcGFyc2VJbnQob2N0ZXQsIDEwKSkuXG4gICAgICBmaWx0ZXIoKG9jdGV0OiBudW1iZXIpID0+IG9jdGV0ID49IDAgJiYgb2N0ZXQgPD0gMjU1KS5sZW5ndGggPT09IDQ7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBzdHJpbmcgSVB2NCB0byBhIG51bWJlclxuICAgKlxuICAgKiB0YWtlcyBhbiBJUCBBZGRyZXNzIChlLmcuIDE3NC42Ni4xNzMuMTY4KSBhbmQgY29udmVydHMgdG8gYSBudW1iZXJcbiAgICogKGUuZyAyOTIzNjA1NDE2KTsgY3VycmVudGx5IG9ubHkgc3VwcG9ydHMgSVB2NFxuICAgKlxuICAgKiBVc2VzIHRoZSBmb3JtdWxhOlxuICAgKiAoZmlyc3Qgb2N0ZXQgKiAyNTbCsykgKyAoc2Vjb25kIG9jdGV0ICogMjU2wrIpICsgKHRoaXJkIG9jdGV0ICogMjU2KSArXG4gICAqIChmb3VydGggb2N0ZXQpXG4gICAqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gdGhlIElQIGFkZHJlc3MgKGUuZy4gMTc0LjY2LjE3My4xNjgpXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9IHRoZSBpbnRlZ2VyIHZhbHVlIG9mIHRoZSBJUCBhZGRyZXNzIChlLmcgMjkyMzYwNTQxNilcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXBUb051bShpcEFkZHJlc3M6IHN0cmluZyk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnZhbGlkSXAoaXBBZGRyZXNzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2lwQWRkcmVzc30gaXMgbm90IHZhbGlkYCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlwQWRkcmVzc1xuICAgICAgLnNwbGl0KCcuJylcbiAgICAgIC5yZWR1Y2UoXG4gICAgICAgIChwOiBudW1iZXIsIGM6IHN0cmluZywgaTogbnVtYmVyKSA9PiBwICsgcGFyc2VJbnQoYywgMTApICogMjU2ICoqICgzIC0gaSksXG4gICAgICAgIDAsXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIG51bWJlciBhbmQgY29udmVydHMgaXQgdG8gSVB2NCBhZGRyZXNzIHN0cmluZ1xuICAgKlxuICAgKiBUYWtlcyBhIG51bWJlciAoZS5nIDI5MjM2MDU0MTYpIGFuZCBjb252ZXJ0cyBpdCB0byBhbiBJUHY0IGFkZHJlc3Mgc3RyaW5nXG4gICAqIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIElQdjRcbiAgICpcbiAgICogQHBhcmFtICB7bnVtYmVyfSB0aGUgaW50ZWdlciB2YWx1ZSBvZiB0aGUgSVAgYWRkcmVzcyAoZS5nIDI5MjM2MDU0MTYpXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSBJUHY0IGFkZHJlc3MgKGUuZy4gMTc0LjY2LjE3My4xNjgpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG51bVRvSXAoaXBOdW06IG51bWJlcik6IHN0cmluZyB7XG4gICAgLy8gdGhpcyBhbGwgYmVjYXVzZSBiaXR3aXNlIG1hdGggaXMgc2lnbmVkXG4gICAgbGV0IHJlbWFpbmluZyA9IGlwTnVtO1xuICAgIGNvbnN0IGFkZHJlc3MgPSBuZXcgQXJyYXk8bnVtYmVyPigpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICBpZiAocmVtYWluaW5nICE9PSAwKSB7XG4gICAgICAgIGFkZHJlc3MucHVzaChNYXRoLmZsb29yKHJlbWFpbmluZyAvIDI1NiAqKiAoMyAtIGkpKSk7XG4gICAgICAgIHJlbWFpbmluZyA9IHJlbWFpbmluZyAlIDI1NiAqKiAoMyAtIGkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkcmVzcy5wdXNoKDApO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBpcEFkZHJlc3M6IHN0cmluZyA9IGFkZHJlc3Muam9pbignLicpO1xuICAgIGlmICggIXRoaXMudmFsaWRJcChpcEFkZHJlc3MpICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2lwQWRkcmVzc30gaXMgbm90IGEgdmFsaWQgSVAgQWRkcmVzc2ApO1xuICAgIH1cbiAgICByZXR1cm4gaXBBZGRyZXNzO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldHdvcmsgYmFzZWQgb24gYSBDSURSIEJsb2NrIHRvIGJ1aWxkIGNvbnRhaW5lZCBzdWJuZXRzXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXR3b3JrQnVpbGRlciB7XG5cbiAgLyoqXG4gICAqIFRoZSBDSURSIHJhbmdlIHVzZWQgd2hlbiBjcmVhdGluZyB0aGUgbmV0d29ya1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IG5ldHdvcmtDaWRyOiBDaWRyQmxvY2s7XG5cbiAgLyoqXG4gICAqIFRoZSBsaXN0IG9mIENJRFIgYmxvY2tzIGZvciBzdWJuZXRzIHdpdGhpbiB0aGlzIG5ldHdvcmtcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgc3VibmV0Q2lkcnM6IENpZHJCbG9ja1tdID0gW107XG5cbiAgLyoqXG4gICAqIFRoZSBuZXh0IGF2YWlsYWJsZSBJUCBhZGRyZXNzIGFzIGEgbnVtYmVyXG4gICAqL1xuICBwcml2YXRlIG5leHRBdmFpbGFibGVJcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXR3b3JrIHVzaW5nIHRoZSBwcm92aWRlZCBDSURSIGJsb2NrXG4gICAqXG4gICAqIE5vIHN1Ym5ldHMgYXJlIGFsbG9jYXRlZCBpbiB0aGUgY29uc3RydWN0b3IsIHRoZSBtYXhJcENvbnN1bWVkIGlzIHNldCBvbmVcbiAgICogbGVzcyB0aGFuIHRoZSBmaXJzdCBJUCBpbiB0aGUgbmV0d29ya1xuICAgKlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2lkcjogc3RyaW5nKSB7XG4gICAgdGhpcy5uZXR3b3JrQ2lkciA9IG5ldyBDaWRyQmxvY2soY2lkcik7XG4gICAgdGhpcy5zdWJuZXRDaWRycyA9IFtdO1xuICAgIHRoaXMubmV4dEF2YWlsYWJsZUlwID0gdGhpcy5uZXR3b3JrQ2lkci5taW5BZGRyZXNzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc3VibmV0IHRvIHRoZSBuZXR3b3JrIGFuZCB1cGRhdGUgdGhlIG1heElwQ29uc3VtZWRcbiAgICovXG4gIHB1YmxpYyBhZGRTdWJuZXQobWFzazogbnVtYmVyKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5hZGRTdWJuZXRzKG1hc2ssIDEpWzBdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCB7Y291bnR9IG51bWJlciBvZiBzdWJuZXRzIHRvIHRoZSBuZXR3b3JrIGFuZCB1cGRhdGUgdGhlIG1heElwQ29uc3VtZWRcbiAgICovXG4gIHB1YmxpYyBhZGRTdWJuZXRzKG1hc2s6IG51bWJlciwgY291bnQ6IG51bWJlciA9IDEpOiBzdHJpbmdbXSB7XG4gICAgaWYgKG1hc2sgPCAxNiB8fCBtYXNrID4gMjggKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZENpZHJSYW5nZUVycm9yKGB4LngueC54LyR7bWFza31gKTtcbiAgICB9XG4gICAgY29uc3QgbWF4SXAgPSB0aGlzLm5leHRBdmFpbGFibGVJcCArIChDaWRyQmxvY2suY2FsY3VsYXRlTmV0c2l6ZShtYXNrKSAqIGNvdW50KTtcbiAgICBpZiAodGhpcy5uZXR3b3JrQ2lkci5tYXhBZGRyZXNzKCkgPCBtYXhJcCAtIDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtjb3VudH0gb2YgLyR7bWFza30gZXhjZWVkcyByZW1haW5pbmcgc3BhY2Ugb2YgJHt0aGlzLm5ldHdvcmtDaWRyLmNpZHJ9YCk7XG4gICAgfVxuICAgIGNvbnN0IHN1Ym5ldHM6IENpZHJCbG9ja1tdID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudDsgaSArKykge1xuICAgICAgY29uc3Qgc3VibmV0OiBDaWRyQmxvY2sgPSBuZXcgQ2lkckJsb2NrKHRoaXMubmV4dEF2YWlsYWJsZUlwLCBtYXNrKTtcbiAgICAgIHRoaXMubmV4dEF2YWlsYWJsZUlwID0gc3VibmV0Lm5leHRCbG9jaygpLm1pbkFkZHJlc3MoKTtcbiAgICAgIHRoaXMuc3VibmV0Q2lkcnMucHVzaChzdWJuZXQpO1xuICAgICAgc3VibmV0cy5wdXNoKHN1Ym5ldCk7XG4gICAgfVxuICAgIHJldHVybiBzdWJuZXRzLm1hcCgoc3VibmV0KSA9PiAoc3VibmV0LmNpZHIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdGhlIENJRFIgbm90YXRpb24gc3RyaW5ncyBmb3IgYWxsIHN1Ym5ldHMgaW4gdGhlIG5ldHdvcmtcbiAgICovXG4gIHB1YmxpYyBnZXQgY2lkclN0cmluZ3MoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLnN1Ym5ldENpZHJzLm1hcCgoc3VibmV0KSA9PiAoc3VibmV0LmNpZHIpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBsYXJnZXN0IHN1Ym5ldCB0byBjcmVhdGUgb2YgdGhlIGdpdmVuIGNvdW50IGZyb20gdGhlXG4gICAqIHJlbWFpbmluZyBJUCBzcGFjZVxuICAgKi9cbiAgcHVibGljIG1hc2tGb3JSZW1haW5pbmdTdWJuZXRzKHN1Ym5ldENvdW50OiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHJlbWFpbmluZzogbnVtYmVyID0gdGhpcy5uZXR3b3JrQ2lkci5tYXhBZGRyZXNzKCkgLSB0aGlzLm5leHRBdmFpbGFibGVJcCArIDE7XG4gICAgY29uc3QgaXBzUGVyU3VibmV0OiBudW1iZXIgPSBNYXRoLmZsb29yKHJlbWFpbmluZyAvIHN1Ym5ldENvdW50KTtcbiAgICByZXR1cm4gMzIgLSBNYXRoLmZsb29yKE1hdGgubG9nMihpcHNQZXJTdWJuZXQpKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgYmxvY2sgb2YgSVAgYWRkcmVzcyBzcGFjZSB3aXRoIGEgZ2l2ZW4gYml0IHByZWZpeFxuICovXG5leHBvcnQgY2xhc3MgQ2lkckJsb2NrIHtcblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbmV0bWFzayBmb3IgYSBnaXZlbiBDSURSIG1hc2tcbiAgICpcbiAgICogRm9yIGV4YW1wbGU6XG4gICAqIENpZHJCbG9jay5jYWxjdWxhdGVOZXRtYXNrKDI0KSByZXR1cm5zICcyNTUuMjU1LjI1NS4wJ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVOZXRtYXNrKG1hc2s6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIE5ldHdvcmtVdGlscy5udW1Ub0lwKDIgKiogMzIgLSAyICoqICgzMiAtIG1hc2spKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIHRoZSBudW1iZXIgSVAgYWRkcmVzc2VzIGluIGEgQ0lEUiBNYXNrXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKiBDaWRyQmxvY2suY2FsY3VsYXRlTmV0c2l6ZSgyNCkgcmV0dXJucyAyNTZcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2FsY3VsYXRlTmV0c2l6ZShtYXNrOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiAyICoqICgzMiAtIG1hc2spO1xuICB9XG5cbiAgLypcbiAgICogVGhlIENJRFIgQmxvY2sgcmVwcmVzZW50ZWQgYXMgYSBzdHJpbmcgZS5nLiAnMTAuMC4wLjAvMjEnXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY2lkcjogc3RyaW5nO1xuXG4gIC8qXG4gICAqIFRoZSBDSURSIG1hc2sgZS5nLiBmb3IgQ0lEUiAnMTAuMC4wLjAvMjEnIHJldHVybnMgMjFcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBtYXNrOiBudW1iZXI7XG5cbiAgLypcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiBJUCBhZGRyZXNzZXMgaW4gdGhlIENJRFJcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuZXR3b3JrU2l6ZTogbnVtYmVyO1xuXG4gIC8qXG4gICAqIFRoZSBuZXR3b3JrIGFkZHJlc3MgcHJvdmlkZWQgaW4gQ0lEUiBjcmVhdGlvbiBvZmZzZXQgYnkgdGhlIE5ldHNpemUgLTFcbiAgICovXG4gIHByaXZhdGUgcmVhZG9ubHkgbmV0d29ya0FkZHJlc3M6IG51bWJlcjtcblxuICAvKlxuICAgKiBQYXJzZXMgZWl0aGVyIENJRFIgbm90YXRpb24gU3RyaW5nIG9yIHR3byBudW1iZXJzIHJlcHJlc2VudGluZyB0aGUgSVBcbiAgICogc3BhY2VcbiAgICpcbiAgICogY2lkciBleHBlY3RzIGEgc3RyaW5nICcxMC4wLjAuMC8xNidcbiAgICogaXBBZGRyZXNzIGV4cGVjdHMgYSBudW1iZXJcbiAgICogbWFzayBleHBlY3RzIGEgbnVtYmVyXG4gICAqXG4gICAqIElmIHRoZSBnaXZlbiBgY2lkcmAgb3IgYGlwQWRkcmVzc2AgaXMgbm90IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGJsb2NrLFxuICAgKiB0aGVuIHRoZSBuZXh0IGF2YWlsYWJsZSBibG9jayB3aWxsIGJlIHJldHVybmVkLiBGb3IgZXhhbXBsZSwgaWZcbiAgICogYDEwLjAuMy4xLzI4YCBpcyBnaXZlbiB0aGUgcmV0dXJuZWQgYmxvY2sgd2lsbCByZXByZXNlbnQgYDEwLjAuMy4xNi8yOGAuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjaWRyOiBzdHJpbmcpXG4gIGNvbnN0cnVjdG9yKGlwQWRkcmVzczogbnVtYmVyLCBtYXNrOiBudW1iZXIpXG4gIGNvbnN0cnVjdG9yKGlwQWRkcmVzc09yQ2lkcjogc3RyaW5nIHwgbnVtYmVyLCBtYXNrPzogbnVtYmVyKSB7XG4gICAgaWYgKHR5cGVvZiBpcEFkZHJlc3NPckNpZHIgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLm1hc2sgPSBwYXJzZUludChpcEFkZHJlc3NPckNpZHIuc3BsaXQoJy8nKVsxXSwgMTApO1xuICAgICAgdGhpcy5uZXR3b3JrQWRkcmVzcyA9IE5ldHdvcmtVdGlscy5pcFRvTnVtKGlwQWRkcmVzc09yQ2lkci5zcGxpdCgnLycpWzBdKSArXG4gICAgICAgIENpZHJCbG9jay5jYWxjdWxhdGVOZXRzaXplKHRoaXMubWFzaykgLSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIG1hc2sgPT09ICdudW1iZXInKSB7XG4gICAgICAgIHRoaXMubWFzayA9IG1hc2s7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0aGlzIHNob3VsZCBiZSBpbXBvc3NpYmxlXG4gICAgICAgIHRoaXMubWFzayA9IDE2O1xuICAgICAgfVxuICAgICAgdGhpcy5uZXR3b3JrQWRkcmVzcyA9IGlwQWRkcmVzc09yQ2lkciArIENpZHJCbG9jay5jYWxjdWxhdGVOZXRzaXplKHRoaXMubWFzaykgLSAxO1xuICAgICAgdGhpcy5uZXR3b3JrU2l6ZSA9IDIgKiogKDMyIC0gdGhpcy5tYXNrKTtcbiAgICB9XG4gICAgdGhpcy5uZXR3b3JrU2l6ZSA9IDIgKiogKDMyIC0gdGhpcy5tYXNrKTtcbiAgICB0aGlzLmNpZHIgPSBgJHt0aGlzLm1pbklwKCl9LyR7dGhpcy5tYXNrfWA7XG4gIH1cblxuICAvKlxuICAgKiBUaGUgbWF4aW11bSBJUCBpbiB0aGUgQ0lEUiBCbG9jayBlLmcuICcxMC4wLjguMjU1J1xuICAgKi9cbiAgcHVibGljIG1heElwKCk6IHN0cmluZyB7XG4gICAgLy8gbWluICsgKDJeKDMyLW1hc2spKSAtIDEgW3plcm8gbmVlZHMgdG8gY291bnRdXG4gICAgcmV0dXJuIE5ldHdvcmtVdGlscy5udW1Ub0lwKHRoaXMubWF4QWRkcmVzcygpKTtcbiAgfVxuXG4gIC8qXG4gICAqIFRoZSBtaW5pbXVtIElQIGluIHRoZSBDSURSIEJsb2NrIGUuZy4gJzEwLjAuMC4wJ1xuICAgKi9cbiAgcHVibGljIG1pbklwKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIE5ldHdvcmtVdGlscy5udW1Ub0lwKHRoaXMubWluQWRkcmVzcygpKTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybnMgdGhlIG51bWJlciByZXByZXNlbnRhdGlvbiBmb3IgdGhlIG1pbmltdW0gSVB2NCBhZGRyZXNzXG4gICAqL1xuICBwdWJsaWMgbWluQWRkcmVzcygpOiBudW1iZXIge1xuICAgIGNvbnN0IGRpdiA9IHRoaXMubmV0d29ya0FkZHJlc3MgJSB0aGlzLm5ldHdvcmtTaXplO1xuICAgIHJldHVybiB0aGlzLm5ldHdvcmtBZGRyZXNzIC0gZGl2O1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIHJlcHJlc2VudGF0aW9uIGZvciB0aGUgbWF4aW11bSBJUHY0IGFkZHJlc3NcbiAgICovXG4gIHB1YmxpYyBtYXhBZGRyZXNzKCk6IG51bWJlciB7XG4gICAgLy8gbWluICsgKDJeKDMyLW1hc2spKSAtIDEgW3plcm8gbmVlZHMgdG8gY291bnRdXG4gICAgcmV0dXJuIHRoaXMubWluQWRkcmVzcygpICsgdGhpcy5uZXR3b3JrU2l6ZSAtIDE7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm5zIHRoZSBuZXh0IENJRFIgQmxvY2sgb2YgdGhlIHNhbWUgbWFzayBzaXplXG4gICAqL1xuICBwdWJsaWMgbmV4dEJsb2NrKCk6IENpZHJCbG9jayB7XG4gICAgcmV0dXJuIG5ldyBDaWRyQmxvY2sodGhpcy5tYXhBZGRyZXNzKCkgKyAxLCB0aGlzLm1hc2spO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgQ2lkckJsb2NrIGZ1bGx5IGNvbnRhaW5zIHRoZSBwcm92aWRlZCBDaWRyQmxvY2tcbiAgICovXG4gIHB1YmxpYyBjb250YWluc0NpZHIob3RoZXI6IENpZHJCbG9jayk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAodGhpcy5tYXhBZGRyZXNzKCkgPj0gb3RoZXIubWF4QWRkcmVzcygpKSAmJlxuICAgICAgKHRoaXMubWluQWRkcmVzcygpIDw9IG90aGVyLm1pbkFkZHJlc3MoKSk7XG4gIH1cbn1cbiJdfQ==