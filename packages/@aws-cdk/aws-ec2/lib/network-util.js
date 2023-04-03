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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV0d29yay11dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmV0d29yay11dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNILE1BQWEscUJBQXNCLFNBQVEsS0FBSztJQUM5QyxZQUFZLElBQVk7UUFDdEIsS0FBSyxDQUFDLElBQUksR0FBRyw4REFBOEQsQ0FBQyxDQUFDO1FBQzdFLDRHQUE0RztRQUM1RyxnRkFBZ0Y7UUFDaEYsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDOUQ7Q0FDRjtBQVBELHNEQU9DO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFFdkI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQWlCO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN2QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBYSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxDQUFDLEtBQWEsRUFBRSxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztLQUN0RTtJQUVEOzs7Ozs7Ozs7Ozs7T0FZRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBaUI7UUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDNUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLFNBQVMsZUFBZSxDQUFDLENBQUM7U0FDOUM7UUFFRCxPQUFPLFNBQVM7YUFDYixLQUFL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T0FFRztJQUNJLEtBQUs7UUFDVixnREFBZ0Q7UUFDaEQsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7O09BRUc7SUFDSSxLQUFLO1FBQ1YsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQ2hEO0lBRUQ7O09BRUc7SUFDSSxVQUFVO1FBQ2YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ25ELE9BQU8sSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7S0FDbEM7SUFFRDs7T0FFRztJQUNJLFVBQVU7UUFDZixnREFBZ0Q7UUFDaEQsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7S0FDakQ7SUFFRDs7T0FFRztJQUNJLFNBQVM7UUFDZCxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3hEO0lBRUQ7O09BRUc7SUFDSSxZQUFZLENBQUMsS0FBZ0I7UUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDN0M7Q0FDRjtBQXhIRCw4QkF3SEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEludmFsaWRDaWRyUmFuZ2VFcnJvciBpcyB0aHJvd24gd2hlbiBhdHRlbXB0aW5nIHRvIHBlcmZvcm0gb3BlcmF0aW9ucyBvbiBhIENJRFJcbiAqIHJhbmdlIHRoYXQgaXMgZWl0aGVyIG5vdCB2YWxpZCwgb3Igb3V0c2lkZSBvZiB0aGUgVlBDIHNpemUgbGltaXRzLlxuICovXG5leHBvcnQgY2xhc3MgSW52YWxpZENpZHJSYW5nZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihjaWRyOiBzdHJpbmcpIHtcbiAgICBzdXBlcihjaWRyICsgJyBpcyBub3QgYSB2YWxpZCBWUEMgQ0lEUiByYW5nZSAobXVzdCBiZSBiZXR3ZWVuIC8xNiBhbmQgLzI4KScpO1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgbGluZSBpcyByZXF1aXJlZCBmb3IgdHlwZSBjaGVja2luZyBvZiBjdXN0b20gZXJyb3JzLCBhbmQgbXVzdCBiZSBjYWxsZWQgcmlnaHQgYWZ0ZXIgc3VwZXIoKVxuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzMxNjI2MjMxL2N1c3RvbS1lcnJvci1jbGFzcy1pbi10eXBlc2NyaXB0XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHRoaXMsIEludmFsaWRDaWRyUmFuZ2VFcnJvci5wcm90b3R5cGUpO1xuICB9XG59XG5cbi8qKlxuICogTmV0d29ya1V0aWxzIGNvbnRhaW5zIGhlbHBlcnMgdG8gd29yayB3aXRoIG5ldHdvcmsgY29uc3RydWN0cyAoc3VibmV0cy9yYW5nZXMpXG4gKi9cbmV4cG9ydCBjbGFzcyBOZXR3b3JrVXRpbHMge1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgYW4gSVB2NCBzdHJpbmdcbiAgICpcbiAgICogcmV0dXJucyB0cnVlIG9mIHRoZSBzdHJpbmcgY29udGFpbnMgNCBudW1iZXJzIGJldHdlZW4gMC0yNTUgZGVsaW1pdGVkIGJ5XG4gICAqIGEgYC5gIGNoYXJhY3RlclxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB2YWxpZElwKGlwQWRkcmVzczogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgY29uc3Qgb2N0ZXRzID0gaXBBZGRyZXNzLnNwbGl0KCcuJyk7XG4gICAgaWYgKG9jdGV0cy5sZW5ndGggIT09IDQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIG9jdGV0cy5tYXAoKG9jdGV0OiBzdHJpbmcpID0+IHBhcnNlSW50KG9jdGV0LCAxMCkpLlxuICAgICAgZmlsdGVyKChvY3RldDogbnVtYmVyKSA9PiBvY3RldCA+PSAwICYmIG9jdGV0IDw9IDI1NSkubGVuZ3RoID09PSA0O1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgc3RyaW5nIElQdjQgdG8gYSBudW1iZXJcbiAgICpcbiAgICogdGFrZXMgYW4gSVAgQWRkcmVzcyAoZS5nLiAxNzQuNjYuMTczLjE2OCkgYW5kIGNvbnZlcnRzIHRvIGEgbnVtYmVyXG4gICAqIChlLmcgMjkyMzYwNTQxNik7IGN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIElQdjRcbiAgICpcbiAgICogVXNlcyB0aGUgZm9ybXVsYTpcbiAgICogKGZpcnN0IG9jdGV0ICogMjU2wrMpICsgKHNlY29uZCBvY3RldCAqIDI1NsKyKSArICh0aGlyZCBvY3RldCAqIDI1NikgK1xuICAgKiAoZm91cnRoIG9jdGV0KVxuICAgKlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRoZSBJUCBhZGRyZXNzIChlLmcuIDE3NC42Ni4xNzMuMTY4KVxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSB0aGUgaW50ZWdlciB2YWx1ZSBvZiB0aGUgSVAgYWRkcmVzcyAoZS5nIDI5MjM2MDU0MTYpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGlwVG9OdW0oaXBBZGRyZXNzOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIGlmICghdGhpcy52YWxpZElwKGlwQWRkcmVzcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtpcEFkZHJlc3N9IGlzIG5vdCB2YWxpZGApO1xuICAgIH1cblxuICAgIHJldHVybiBpcEFkZHJlc3NcbiAgICAgIC5zcGxpdCgnLicpXG4gICAgICAucmVkdWNlKFxuICAgICAgICAocDogbnVtYmVyLCBjOiBzdHJpbmcsIGk6IG51bWJlcikgPT4gcCArIHBhcnNlSW50KGMsIDEwKSAqIDI1NiAqKiAoMyAtIGkpLFxuICAgICAgICAwLFxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBudW1iZXIgYW5kIGNvbnZlcnRzIGl0IHRvIElQdjQgYWRkcmVzcyBzdHJpbmdcbiAgICpcbiAgICogVGFrZXMgYSBudW1iZXIgKGUuZyAyOTIzNjA1NDE2KSBhbmQgY29udmVydHMgaXQgdG8gYW4gSVB2NCBhZGRyZXNzIHN0cmluZ1xuICAgKiBjdXJyZW50bHkgb25seSBzdXBwb3J0cyBJUHY0XG4gICAqXG4gICAqIEBwYXJhbSAge251bWJlcn0gdGhlIGludGVnZXIgdmFsdWUgb2YgdGhlIElQIGFkZHJlc3MgKGUuZyAyOTIzNjA1NDE2KVxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgSVB2NCBhZGRyZXNzIChlLmcuIDE3NC42Ni4xNzMuMTY4KVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBudW1Ub0lwKGlwTnVtOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIC8vIHRoaXMgYWxsIGJlY2F1c2UgYml0d2lzZSBtYXRoIGlzIHNpZ25lZFxuICAgIGxldCByZW1haW5pbmcgPSBpcE51bTtcbiAgICBjb25zdCBhZGRyZXNzID0gbmV3IEFycmF5PG51bWJlcj4oKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgaWYgKHJlbWFpbmluZyAhPT0gMCkge1xuICAgICAgICBhZGRyZXNzLnB1c2goTWF0aC5mbG9vcihyZW1haW5pbmcgLyAyNTYgKiogKDMgLSBpKSkpO1xuICAgICAgICByZW1haW5pbmcgPSByZW1haW5pbmcgJSAyNTYgKiogKDMgLSBpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZHJlc3MucHVzaCgwKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgaXBBZGRyZXNzOiBzdHJpbmcgPSBhZGRyZXNzLmpvaW4oJy4nKTtcbiAgICBpZiAoICF0aGlzLnZhbGlkSXAoaXBBZGRyZXNzKSApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtpcEFkZHJlc3N9IGlzIG5vdCBhIHZhbGlkIElQIEFkZHJlc3NgKTtcbiAgICB9XG4gICAgcmV0dXJuIGlwQWRkcmVzcztcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXR3b3JrIGJhc2VkIG9uIGEgQ0lEUiBCbG9jayB0byBidWlsZCBjb250YWluZWQgc3VibmV0c1xuICovXG5leHBvcnQgY2xhc3MgTmV0d29ya0J1aWxkZXIge1xuXG4gIC8qKlxuICAgKiBUaGUgQ0lEUiByYW5nZSB1c2VkIHdoZW4gY3JlYXRpbmcgdGhlIG5ldHdvcmtcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBuZXR3b3JrQ2lkcjogQ2lkckJsb2NrO1xuXG4gIC8qKlxuICAgKiBUaGUgbGlzdCBvZiBDSURSIGJsb2NrcyBmb3Igc3VibmV0cyB3aXRoaW4gdGhpcyBuZXR3b3JrXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHN1Ym5ldENpZHJzOiBDaWRyQmxvY2tbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiBUaGUgbmV4dCBhdmFpbGFibGUgSVAgYWRkcmVzcyBhcyBhIG51bWJlclxuICAgKi9cbiAgcHJpdmF0ZSBuZXh0QXZhaWxhYmxlSXA6IG51bWJlcjtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV0d29yayB1c2luZyB0aGUgcHJvdmlkZWQgQ0lEUiBibG9ja1xuICAgKlxuICAgKiBObyBzdWJuZXRzIGFyZSBhbGxvY2F0ZWQgaW4gdGhlIGNvbnN0cnVjdG9yLCB0aGUgbWF4SXBDb25zdW1lZCBpcyBzZXQgb25lXG4gICAqIGxlc3MgdGhhbiB0aGUgZmlyc3QgSVAgaW4gdGhlIG5ldHdvcmtcbiAgICpcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNpZHI6IHN0cmluZykge1xuICAgIHRoaXMubmV0d29ya0NpZHIgPSBuZXcgQ2lkckJsb2NrKGNpZHIpO1xuICAgIHRoaXMuc3VibmV0Q2lkcnMgPSBbXTtcbiAgICB0aGlzLm5leHRBdmFpbGFibGVJcCA9IHRoaXMubmV0d29ya0NpZHIubWluQWRkcmVzcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHN1Ym5ldCB0byB0aGUgbmV0d29yayBhbmQgdXBkYXRlIHRoZSBtYXhJcENvbnN1bWVkXG4gICAqL1xuICBwdWJsaWMgYWRkU3VibmV0KG1hc2s6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYWRkU3VibmV0cyhtYXNrLCAxKVswXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQge2NvdW50fSBudW1iZXIgb2Ygc3VibmV0cyB0byB0aGUgbmV0d29yayBhbmQgdXBkYXRlIHRoZSBtYXhJcENvbnN1bWVkXG4gICAqL1xuICBwdWJsaWMgYWRkU3VibmV0cyhtYXNrOiBudW1iZXIsIGNvdW50OiBudW1iZXIgPSAxKTogc3RyaW5nW10ge1xuICAgIGlmIChtYXNrIDwgMTYgfHwgbWFzayA+IDI4ICkge1xuICAgICAgdGhyb3cgbmV3IEludmFsaWRDaWRyUmFuZ2VFcnJvcihgeC54LngueC8ke21hc2t9YCk7XG4gICAgfVxuICAgIGNvbnN0IG1heElwID0gdGhpcy5uZXh0QXZhaWxhYmxlSXAgKyAoQ2lkckJsb2NrLmNhbGN1bGF0ZU5ldHNpemUobWFzaykgKiBjb3VudCk7XG4gICAgaWYgKHRoaXMubmV0d29ya0NpZHIubWF4QWRkcmVzcygpIDwgbWF4SXAgLSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7Y291bnR9IG9mIC8ke21hc2t9IGV4Y2VlZHMgcmVtYWluaW5nIHNwYWNlIG9mICR7dGhpcy5uZXR3b3JrQ2lkci5jaWRyfWApO1xuICAgIH1cbiAgICBjb25zdCBzdWJuZXRzOiBDaWRyQmxvY2tbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkgKyspIHtcbiAgICAgIGNvbnN0IHN1Ym5ldDogQ2lkckJsb2NrID0gbmV3IENpZHJCbG9jayh0aGlzLm5leHRBdmFpbGFibGVJcCwgbWFzayk7XG4gICAgICB0aGlzLm5leHRBdmFpbGFibGVJcCA9IHN1Ym5ldC5uZXh0QmxvY2soKS5taW5BZGRyZXNzKCk7XG4gICAgICB0aGlzLnN1Ym5ldENpZHJzLnB1c2goc3VibmV0KTtcbiAgICAgIHN1Ym5ldHMucHVzaChzdWJuZXQpO1xuICAgIH1cbiAgICByZXR1cm4gc3VibmV0cy5tYXAoKHN1Ym5ldCkgPT4gKHN1Ym5ldC5jaWRyKSk7XG4gIH1cblxuICAvKipcbiAgICogcmV0dXJuIHRoZSBDSURSIG5vdGF0aW9uIHN0cmluZ3MgZm9yIGFsbCBzdWJuZXRzIGluIHRoZSBuZXR3b3JrXG4gICAqL1xuICBwdWJsaWMgZ2V0IGNpZHJTdHJpbmdzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5zdWJuZXRDaWRycy5tYXAoKHN1Ym5ldCkgPT4gKHN1Ym5ldC5jaWRyKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbGFyZ2VzdCBzdWJuZXQgdG8gY3JlYXRlIG9mIHRoZSBnaXZlbiBjb3VudCBmcm9tIHRoZVxuICAgKiByZW1haW5pbmcgSVAgc3BhY2VcbiAgICovXG4gIHB1YmxpYyBtYXNrRm9yUmVtYWluaW5nU3VibmV0cyhzdWJuZXRDb3VudDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCByZW1haW5pbmc6IG51bWJlciA9IHRoaXMubmV0d29ya0NpZHIubWF4QWRkcmVzcygpIC0gdGhpcy5uZXh0QXZhaWxhYmxlSXAgKyAxO1xuICAgIGNvbnN0IGlwc1BlclN1Ym5ldDogbnVtYmVyID0gTWF0aC5mbG9vcihyZW1haW5pbmcgLyBzdWJuZXRDb3VudCk7XG4gICAgcmV0dXJuIDMyIC0gTWF0aC5mbG9vcihNYXRoLmxvZzIoaXBzUGVyU3VibmV0KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGJsb2NrIG9mIElQIGFkZHJlc3Mgc3BhY2Ugd2l0aCBhIGdpdmVuIGJpdCBwcmVmaXhcbiAqL1xuZXhwb3J0IGNsYXNzIENpZHJCbG9jayB7XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZXMgdGhlIG5ldG1hc2sgZm9yIGEgZ2l2ZW4gQ0lEUiBtYXNrXG4gICAqXG4gICAqIEZvciBleGFtcGxlOlxuICAgKiBDaWRyQmxvY2suY2FsY3VsYXRlTmV0bWFzaygyNCkgcmV0dXJucyAnMjU1LjI1NS4yNTUuMCdcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2FsY3VsYXRlTmV0bWFzayhtYXNrOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIHJldHVybiBOZXR3b3JrVXRpbHMubnVtVG9JcCgyICoqIDMyIC0gMiAqKiAoMzIgLSBtYXNrKSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsY3VsYXRlcyB0aGUgbnVtYmVyIElQIGFkZHJlc3NlcyBpbiBhIENJRFIgTWFza1xuICAgKlxuICAgKiBGb3IgZXhhbXBsZTpcbiAgICogQ2lkckJsb2NrLmNhbGN1bGF0ZU5ldHNpemUoMjQpIHJldHVybnMgMjU2XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNhbGN1bGF0ZU5ldHNpemUobWFzazogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gMiAqKiAoMzIgLSBtYXNrKTtcbiAgfVxuXG4gIC8qXG4gICAqIFRoZSBDSURSIEJsb2NrIHJlcHJlc2VudGVkIGFzIGEgc3RyaW5nIGUuZy4gJzEwLjAuMC4wLzIxJ1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNpZHI6IHN0cmluZztcblxuICAvKlxuICAgKiBUaGUgQ0lEUiBtYXNrIGUuZy4gZm9yIENJRFIgJzEwLjAuMC4wLzIxJyByZXR1cm5zIDIxXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbWFzazogbnVtYmVyO1xuXG4gIC8qXG4gICAqIFRoZSB0b3RhbCBudW1iZXIgb2YgSVAgYWRkcmVzc2VzIGluIHRoZSBDSURSXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmV0d29ya1NpemU6IG51bWJlcjtcblxuICAvKlxuICAgKiBUaGUgbmV0d29yayBhZGRyZXNzIHByb3ZpZGVkIGluIENJRFIgY3JlYXRpb24gb2Zmc2V0IGJ5IHRoZSBOZXRzaXplIC0xXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IG5ldHdvcmtBZGRyZXNzOiBudW1iZXI7XG5cbiAgLypcbiAgICogUGFyc2VzIGVpdGhlciBDSURSIG5vdGF0aW9uIFN0cmluZyBvciB0d28gbnVtYmVycyByZXByZXNlbnRpbmcgdGhlIElQXG4gICAqIHNwYWNlXG4gICAqXG4gICAqIGNpZHIgZXhwZWN0cyBhIHN0cmluZyAnMTAuMC4wLjAvMTYnXG4gICAqIGlwQWRkcmVzcyBleHBlY3RzIGEgbnVtYmVyXG4gICAqIG1hc2sgZXhwZWN0cyBhIG51bWJlclxuICAgKlxuICAgKiBJZiB0aGUgZ2l2ZW4gYGNpZHJgIG9yIGBpcEFkZHJlc3NgIGlzIG5vdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBibG9jayxcbiAgICogdGhlbiB0aGUgbmV4dCBhdmFpbGFibGUgYmxvY2sgd2lsbCBiZSByZXR1cm5lZC4gRm9yIGV4YW1wbGUsIGlmXG4gICAqIGAxMC4wLjMuMS8yOGAgaXMgZ2l2ZW4gdGhlIHJldHVybmVkIGJsb2NrIHdpbGwgcmVwcmVzZW50IGAxMC4wLjMuMTYvMjhgLlxuICAgKi9cbiAgY29uc3RydWN0b3IoY2lkcjogc3RyaW5nKVxuICBjb25zdHJ1Y3RvcihpcEFkZHJlc3M6IG51bWJlciwgbWFzazogbnVtYmVyKVxuICBjb25zdHJ1Y3RvcihpcEFkZHJlc3NPckNpZHI6IHN0cmluZyB8IG51bWJlciwgbWFzaz86IG51bWJlcikge1xuICAgIGlmICh0eXBlb2YgaXBBZGRyZXNzT3JDaWRyID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5tYXNrID0gcGFyc2VJbnQoaXBBZGRyZXNzT3JDaWRyLnNwbGl0KCcvJylbMV0sIDEwKTtcbiAgICAgIHRoaXMubmV0d29ya0FkZHJlc3MgPSBOZXR3b3JrVXRpbHMuaXBUb051bShpcEFkZHJlc3NPckNpZHIuc3BsaXQoJy8nKVswXSkgK1xuICAgICAgICBDaWRyQmxvY2suY2FsY3VsYXRlTmV0c2l6ZSh0aGlzLm1hc2spIC0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiBtYXNrID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLm1hc2sgPSBtYXNrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdGhpcyBzaG91bGQgYmUgaW1wb3NzaWJsZVxuICAgICAgICB0aGlzLm1hc2sgPSAxNjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmV0d29ya0FkZHJlc3MgPSBpcEFkZHJlc3NPckNpZHIgKyBDaWRyQmxvY2suY2FsY3VsYXRlTmV0c2l6ZSh0aGlzLm1hc2spIC0gMTtcbiAgICAgIHRoaXMubmV0d29ya1NpemUgPSAyICoqICgzMiAtIHRoaXMubWFzayk7XG4gICAgfVxuICAgIHRoaXMubmV0d29ya1NpemUgPSAyICoqICgzMiAtIHRoaXMubWFzayk7XG4gICAgdGhpcy5jaWRyID0gYCR7dGhpcy5taW5JcCgpfS8ke3RoaXMubWFza31gO1xuICB9XG5cbiAgLypcbiAgICogVGhlIG1heGltdW0gSVAgaW4gdGhlIENJRFIgQmxvY2sgZS5nLiAnMTAuMC44LjI1NSdcbiAgICovXG4gIHB1YmxpYyBtYXhJcCgpOiBzdHJpbmcge1xuICAgIC8vIG1pbiArICgyXigzMi1tYXNrKSkgLSAxIFt6ZXJvIG5lZWRzIHRvIGNvdW50XVxuICAgIHJldHVybiBOZXR3b3JrVXRpbHMubnVtVG9JcCh0aGlzLm1heEFkZHJlc3MoKSk7XG4gIH1cblxuICAvKlxuICAgKiBUaGUgbWluaW11bSBJUCBpbiB0aGUgQ0lEUiBCbG9jayBlLmcuICcxMC4wLjAuMCdcbiAgICovXG4gIHB1YmxpYyBtaW5JcCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBOZXR3b3JrVXRpbHMubnVtVG9JcCh0aGlzLm1pbkFkZHJlc3MoKSk7XG4gIH1cblxuICAvKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgcmVwcmVzZW50YXRpb24gZm9yIHRoZSBtaW5pbXVtIElQdjQgYWRkcmVzc1xuICAgKi9cbiAgcHVibGljIG1pbkFkZHJlc3MoKTogbnVtYmVyIHtcbiAgICBjb25zdCBkaXYgPSB0aGlzLm5ldHdvcmtBZGRyZXNzICUgdGhpcy5uZXR3b3JrU2l6ZTtcbiAgICByZXR1cm4gdGhpcy5uZXR3b3JrQWRkcmVzcyAtIGRpdjtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybnMgdGhlIG51bWJlciByZXByZXNlbnRhdGlvbiBmb3IgdGhlIG1heGltdW0gSVB2NCBhZGRyZXNzXG4gICAqL1xuICBwdWJsaWMgbWF4QWRkcmVzcygpOiBudW1iZXIge1xuICAgIC8vIG1pbiArICgyXigzMi1tYXNrKSkgLSAxIFt6ZXJvIG5lZWRzIHRvIGNvdW50XVxuICAgIHJldHVybiB0aGlzLm1pbkFkZHJlc3MoKSArIHRoaXMubmV0d29ya1NpemUgLSAxO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJucyB0aGUgbmV4dCBDSURSIEJsb2NrIG9mIHRoZSBzYW1lIG1hc2sgc2l6ZVxuICAgKi9cbiAgcHVibGljIG5leHRCbG9jaygpOiBDaWRyQmxvY2sge1xuICAgIHJldHVybiBuZXcgQ2lkckJsb2NrKHRoaXMubWF4QWRkcmVzcygpICsgMSwgdGhpcy5tYXNrKTtcbiAgfVxuXG4gIC8qXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIENpZHJCbG9jayBmdWxseSBjb250YWlucyB0aGUgcHJvdmlkZWQgQ2lkckJsb2NrXG4gICAqL1xuICBwdWJsaWMgY29udGFpbnNDaWRyKG90aGVyOiBDaWRyQmxvY2spOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMubWF4QWRkcmVzcygpID49IG90aGVyLm1heEFkZHJlc3MoKSkgJiZcbiAgICAgICh0aGlzLm1pbkFkZHJlc3MoKSA8PSBvdGhlci5taW5BZGRyZXNzKCkpO1xuICB9XG59XG4iXX0=