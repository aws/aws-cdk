"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpAddresses = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cidr_splits_1 = require("./cidr-splits");
const network_util_1 = require("./network-util");
/**
 * An abstract Provider of IpAddresses
 */
class IpAddresses {
    /**
     * Used to provide local Ip Address Management services for your VPC
     *
     * VPC Cidr is supplied at creation and subnets are calculated locally
     *
     */
    static cidr(cidrBlock) {
        return new Cidr(cidrBlock);
    }
    /**
     * Used to provide centralized Ip Address Management services for your VPC
     *
     * Uses VPC Cidr allocations from AWS IPAM
     *
     * @see https://docs.aws.amazon.com/vpc/latest/ipam/what-it-is-ipam.html
     */
    static awsIpamAllocation(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AwsIpamProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.awsIpamAllocation);
            }
            throw error;
        }
        return new AwsIpam(props);
    }
    constructor() { }
}
_a = JSII_RTTI_SYMBOL_1;
IpAddresses[_a] = { fqn: "@aws-cdk/aws-ec2.IpAddresses", version: "0.0.0" };
exports.IpAddresses = IpAddresses;
/**
 * Implements integration with Amazon VPC IP Address Manager (IPAM).
 *
 * See the package-level documentation of this package for an overview
 * of the various dimensions in which you can configure your VPC.
 *
 * For example:
 *
 * ```ts
 *  new ec2.Vpc(stack, 'TheVPC', {
 *   ipAddresses: IpAddresses.awsIpamAllocation({
 *     ipv4IpamPoolId: pool.ref,
 *     ipv4NetmaskLength: 18,
 *     defaultSubnetIpv4NetmaskLength: 24
 *   })
 * });
 * ```
 *
 */
class AwsIpam {
    constructor(props) {
        this.props = props;
    }
    /**
     * Allocates Vpc Cidr. called when creating a Vpc using AwsIpam.
     */
    allocateVpcCidr() {
        return {
            ipv4NetmaskLength: this.props.ipv4NetmaskLength,
            ipv4IpamPoolId: this.props.ipv4IpamPoolId,
        };
    }
    /**
     * Allocates Subnets Cidrs. Called by VPC when creating subnets.
     */
    allocateSubnetsCidr(input) {
        const cidrSplit = (0, cidr_splits_1.calculateCidrSplits)(this.props.ipv4NetmaskLength, input.requestedSubnets.map((mask => {
            if ((mask.configuration.cidrMask === undefined) && (this.props.defaultSubnetIpv4NetmaskLength === undefined)) {
                throw new Error('If you have not set a cidr for all subnets in this case you must set a defaultCidrMask in AwsIpam Options');
            }
            const cidrMask = mask.configuration.cidrMask ?? this.props.defaultSubnetIpv4NetmaskLength;
            if (cidrMask === undefined) {
                throw new Error('Should not have happened, but satisfies the type checker');
            }
            return cidrMask;
        })));
        const allocatedSubnets = cidrSplit.map(subnet => {
            return {
                cidr: core_1.Fn.select(subnet.index, core_1.Fn.cidr(input.vpcCidr, subnet.count, `${32 - subnet.netmask}`)),
            };
        });
        return {
            allocatedSubnets: allocatedSubnets,
        };
    }
}
/**
 * Implements static Ip assignment locally.
 *
 * See the package-level documentation of this package for an overview
 * of the various dimensions in which you can configure your VPC.
 *
 * For example:
 *
 * ```ts
 *  new ec2.Vpc(stack, 'TheVPC', {
 *   ipAddresses: ec2.IpAddresses.cidr('10.0.1.0/20')
 * });
 * ```
 *
 */
class Cidr {
    constructor(cidrBlock) {
        this.cidrBlock = cidrBlock;
        if (core_1.Token.isUnresolved(cidrBlock)) {
            throw new Error('\'cidr\' property must be a concrete CIDR string, got a Token (we need to parse it for automatic subdivision)');
        }
        this.networkBuilder = new network_util_1.NetworkBuilder(this.cidrBlock);
    }
    /**
     * Allocates Vpc Cidr. called when creating a Vpc using IpAddresses.cidr.
     */
    allocateVpcCidr() {
        return {
            cidrBlock: this.networkBuilder.networkCidr.cidr,
        };
    }
    /**
     * Allocates Subnets Cidrs. Called by VPC when creating subnets.
     */
    allocateSubnetsCidr(input) {
        const allocatedSubnets = [];
        const subnetsWithoutDefinedCidr = [];
        //default: Available IP space is evenly divided across subnets if no cidr is given.
        input.requestedSubnets.forEach((requestedSubnet, index) => {
            if (requestedSubnet.configuration.cidrMask === undefined) {
                subnetsWithoutDefinedCidr.push({
                    index,
                    requestedSubnet,
                });
            }
            else {
                allocatedSubnets.push({
                    cidr: this.networkBuilder.addSubnet(requestedSubnet.configuration.cidrMask),
                });
            }
        });
        const cidrMaskForRemaining = this.networkBuilder.maskForRemainingSubnets(subnetsWithoutDefinedCidr.length);
        subnetsWithoutDefinedCidr.forEach((subnet) => {
            allocatedSubnets.splice(subnet.index, 0, {
                cidr: this.networkBuilder.addSubnet(cidrMaskForRemaining),
            });
        });
        return {
            allocatedSubnets: allocatedSubnets,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAtYWRkcmVzc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXAtYWRkcmVzc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEwQztBQUMxQywrQ0FBb0Q7QUFDcEQsaURBQWdEO0FBR2hEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBQ3RCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQjtRQUNsQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzVCO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQW1COzs7Ozs7Ozs7O1FBQ2pELE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7SUFFRCxpQkFBeUI7Ozs7QUF0QmQsa0NBQVc7QUF5S3hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxNQUFNLE9BQU87SUFDWCxZQUE2QixLQUFtQjtRQUFuQixVQUFLLEdBQUwsS0FBSyxDQUFjO0tBQy9DO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2IsT0FBTztZQUNMLGlCQUFpQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCO1lBQy9DLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWM7U0FDMUMsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSCxtQkFBbUIsQ0FBQyxLQUEwQjtRQUU1QyxNQUFNLFNBQVMsR0FBRyxJQUFBLGlDQUFtQixFQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBRXJHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsOEJBQThCLEtBQUksU0FBUyxDQUFDLEVBQUc7Z0JBQzVHLE1BQU0sSUFBSSxLQUFLLENBQUMsMkdBQTJHLENBQUMsQ0FBQzthQUM5SDtZQUVELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsOEJBQThCLENBQUM7WUFFMUYsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDN0U7WUFFRCxPQUFPLFFBQVEsQ0FBQztRQUNsQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFTCxNQUFNLGdCQUFnQixHQUFzQixTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2pFLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLFNBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxTQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzthQUM1RixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0wsZ0JBQWdCLEVBQUUsZ0JBQWdCO1NBQ25DLENBQUM7S0FFSDtDQUNGO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxNQUFNLElBQUk7SUFHUixZQUE2QixTQUFpQjtRQUFqQixjQUFTLEdBQVQsU0FBUyxDQUFRO1FBQzVDLElBQUksWUFBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLCtHQUErRyxDQUFDLENBQUM7U0FDbEk7UUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksNkJBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDMUQ7SUFFRDs7T0FFRztJQUNILGVBQWU7UUFDYixPQUFPO1lBQ0wsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUk7U0FDaEQsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSCxtQkFBbUIsQ0FBQyxLQUEwQjtRQUU1QyxNQUFNLGdCQUFnQixHQUFzQixFQUFFLENBQUM7UUFDL0MsTUFBTSx5QkFBeUIsR0FBK0IsRUFBRSxDQUFDO1FBQ2pFLG1GQUFtRjtRQUVuRixLQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3hELElBQUksZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUN4RCx5QkFBeUIsQ0FBQyxJQUFJLENBQUM7b0JBQzdCLEtBQUs7b0JBQ0wsZUFBZTtpQkFDaEIsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsZ0JBQWdCLENBQUMsSUFBSSxDQUFDO29CQUNwQixJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7aUJBQzVFLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0cseUJBQXlCLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFDLEVBQUU7WUFDMUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFO2dCQUN2QyxJQUFJLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7YUFDMUQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPO1lBQ0wsZ0JBQWdCLEVBQUUsZ0JBQWdCO1NBQ25DLENBQUM7S0FDSDtDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRm4sIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBjYWxjdWxhdGVDaWRyU3BsaXRzIH0gZnJvbSAnLi9jaWRyLXNwbGl0cyc7XG5pbXBvcnQgeyBOZXR3b3JrQnVpbGRlciB9IGZyb20gJy4vbmV0d29yay11dGlsJztcbmltcG9ydCB7IFN1Ym5ldENvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3ZwYyc7XG5cbi8qKlxuICogQW4gYWJzdHJhY3QgUHJvdmlkZXIgb2YgSXBBZGRyZXNzZXNcbiAqL1xuZXhwb3J0IGNsYXNzIElwQWRkcmVzc2VzIHtcbiAgLyoqXG4gICAqIFVzZWQgdG8gcHJvdmlkZSBsb2NhbCBJcCBBZGRyZXNzIE1hbmFnZW1lbnQgc2VydmljZXMgZm9yIHlvdXIgVlBDXG4gICAqXG4gICAqIFZQQyBDaWRyIGlzIHN1cHBsaWVkIGF0IGNyZWF0aW9uIGFuZCBzdWJuZXRzIGFyZSBjYWxjdWxhdGVkIGxvY2FsbHlcbiAgICpcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY2lkcihjaWRyQmxvY2s6IHN0cmluZyk6IElJcEFkZHJlc3NlcyB7XG4gICAgcmV0dXJuIG5ldyBDaWRyKGNpZHJCbG9jayk7XG4gIH1cblxuICAvKipcbiAgICogVXNlZCB0byBwcm92aWRlIGNlbnRyYWxpemVkIElwIEFkZHJlc3MgTWFuYWdlbWVudCBzZXJ2aWNlcyBmb3IgeW91ciBWUENcbiAgICpcbiAgICogVXNlcyBWUEMgQ2lkciBhbGxvY2F0aW9ucyBmcm9tIEFXUyBJUEFNXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3ZwYy9sYXRlc3QvaXBhbS93aGF0LWl0LWlzLWlwYW0uaHRtbFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhd3NJcGFtQWxsb2NhdGlvbihwcm9wczogQXdzSXBhbVByb3BzKTogSUlwQWRkcmVzc2VzIHtcbiAgICByZXR1cm4gbmV3IEF3c0lwYW0ocHJvcHMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxufVxuXG4vKipcbiAqIEltcGxlbWVudGF0aW9ucyBmb3IgaXAgYWRkcmVzcyBtYW5hZ2VtZW50XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUlwQWRkcmVzc2VzIHtcbiAgLyoqXG4gICAqIENhbGxlZCBieSB0aGUgVlBDIHRvIHJldHJpZXZlIFZQQyBvcHRpb25zIGZyb20gdGhlIElwYW1cbiAgICpcbiAgICogRG9uJ3QgY2FsbCB0aGlzIGRpcmVjdGx5LCB0aGUgVlBDIHdpbGwgY2FsbCBpdCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgYWxsb2NhdGVWcGNDaWRyKCk6IFZwY0lwYW1PcHRpb25zO1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIFZQQyB0byByZXRyaWV2ZSBTdWJuZXQgb3B0aW9ucyBmcm9tIHRoZSBJcGFtXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcyBkaXJlY3RseSwgdGhlIFZQQyB3aWxsIGNhbGwgaXQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIGFsbG9jYXRlU3VibmV0c0NpZHIoaW5wdXQ6IEFsbG9jYXRlQ2lkclJlcXVlc3QpOiBTdWJuZXRJcGFtT3B0aW9ucztcbn1cblxuLyoqXG4gKiBDaWRyIEFsbG9jYXRlZCBWcGNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWcGNJcGFtT3B0aW9ucyB7XG5cbiAgLyoqXG4gICAqIENpZHIgQmxvY2sgZm9yIFZwY1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE9ubHkgcmVxdWlyZWQgd2hlbiBJcGFtIGhhcyBjb25jcmV0ZSBhbGxvY2F0aW9uIGF2YWlsYWJsZSBmb3Igc3RhdGljIFZwY1xuICAgKi9cbiAgcmVhZG9ubHkgY2lkckJsb2NrPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDaWRyIE1hc2sgZm9yIFZwY1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE9ubHkgcmVxdWlyZWQgd2hlbiB1c2luZyBBV1MgSXBhbVxuICAgKi9cbiAgcmVhZG9ubHkgaXB2NE5ldG1hc2tMZW5ndGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIGlwdjQgSVBBTSBQb29sIElkXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gT25seSByZXF1aXJlZCB3aGVuIHVzaW5nIEFXUyBJcGFtXG4gICAqL1xuICByZWFkb25seSBpcHY0SXBhbVBvb2xJZD86IHN0cmluZztcbn1cblxuLyoqXG4gKiBTdWJuZXQgcmVxdWVzdGVkIGZvciBhbGxvY2F0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUmVxdWVzdGVkU3VibmV0IHtcblxuICAvKipcbiAgICogVGhlIGF2YWlsYWJpbGl0eSB6b25lIGZvciB0aGUgc3VibmV0XG4gICAqL1xuICByZWFkb25seSBhdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNwZWNpZnkgY29uZmlndXJhdGlvbiBwYXJhbWV0ZXJzIGZvciBhIHNpbmdsZSBzdWJuZXQgZ3JvdXAgaW4gYSBWUENcbiAgICovXG4gIHJlYWRvbmx5IGNvbmZpZ3VyYXRpb246IFN1Ym5ldENvbmZpZ3VyYXRpb247XG5cbiAgLyoqXG4gICAqIElkIGZvciB0aGUgU3VibmV0IGNvbnN0cnVjdFxuICAgKi9cbiAgcmVhZG9ubHkgc3VibmV0Q29uc3RydWN0SWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBpbnN0YW5jZSBvZiBhIFN1Ym5ldCByZXF1ZXN0ZWQgZm9yIGFsbG9jYXRpb25cbiAqL1xuaW50ZXJmYWNlIElSZXF1ZXN0ZWRTdWJuZXRJbnN0YW5jZSB7XG4gIC8qKlxuICAgKiBJbmRleCBsb2NhdGlvbiBvZiBTdWJuZXQgcmVxdWVzdGVkIGZvciBhbGxvY2F0aW9uXG4gICAqL1xuICByZWFkb25seSBpbmRleDogbnVtYmVyLFxuXG4gIC8qKlxuICAgKiBTdWJuZXQgcmVxdWVzdGVkIGZvciBhbGxvY2F0aW9uXG4gICAqL1xuICByZWFkb25seSByZXF1ZXN0ZWRTdWJuZXQ6IFJlcXVlc3RlZFN1Ym5ldFxufVxuXG4vKipcbiAqIFJlcXVlc3QgZm9yIHN1Ym5ldHMgQ2lkciB0byBiZSBhbGxvY2F0ZWQgZm9yIGEgVnBjXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQWxsb2NhdGVDaWRyUmVxdWVzdCB7XG5cbiAgLyoqXG4gICAqIFRoZSBJUHY0IENJRFIgYmxvY2sgZm9yIHRoaXMgVnBjXG4gICAqL1xuICByZWFkb25seSB2cGNDaWRyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBTdWJuZXRzIHRvIGJlIGFsbG9jYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdGVkU3VibmV0czogUmVxdWVzdGVkU3VibmV0W107XG59XG5cbi8qKlxuICogQ2lkciBBbGxvY2F0ZWQgU3VibmV0c1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFN1Ym5ldElwYW1PcHRpb25zIHtcbiAgLyoqXG4gICAqIENpZHIgQWxsb2NhdGlvbnMgZm9yIFN1Ym5ldHNcbiAgICovXG4gIHJlYWRvbmx5IGFsbG9jYXRlZFN1Ym5ldHM6IEFsbG9jYXRlZFN1Ym5ldFtdO1xufVxuXG4vKipcbiAqIENpZHIgQWxsb2NhdGVkIFN1Ym5ldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFsbG9jYXRlZFN1Ym5ldCB7XG4gIC8qKlxuICAgKiBDaWRyIEFsbG9jYXRpb25zIGZvciBhIFN1Ym5ldFxuICAgKi9cbiAgcmVhZG9ubHkgY2lkcjogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gZm9yIEF3c0lwYW1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBd3NJcGFtUHJvcHMge1xuXG4gIC8qKlxuICAgKiBOZXRtYXNrIGxlbmd0aCBmb3IgVnBjXG4gICAqL1xuICByZWFkb25seSBpcHY0TmV0bWFza0xlbmd0aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJcGFtIFBvb2wgSWQgZm9yIGlwdjQgYWxsb2NhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgaXB2NElwYW1Qb29sSWQ6IHN0cmluZzsgLy8gdG9kbzogc2hvdWxkIGJlIGEgdHlwZVxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IGxlbmd0aCBmb3IgU3VibmV0IGlwdjQgTmV0d29yayBtYXNrXG4gICAqXG4gICAqIFNwZWNpZnkgdGhpcyBvcHRpb24gb25seSBpZiB5b3UgZG8gbm90IHNwZWNpZnkgYWxsIFN1Ym5ldHMgdXNpbmcgU3VibmV0Q29uZmlndXJhdGlvbiB3aXRoIGEgY2lkck1hc2tcbiAgICpcbiAgICogQGRlZmF1bHQgLSBEZWZhdWx0IGlwdjQgU3VibmV0IE1hc2sgZm9yIHN1Ym5ldHMgaW4gVnBjXG4gICAqXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0U3VibmV0SXB2NE5ldG1hc2tMZW5ndGg/OiBudW1iZXI7XG59XG5cbi8qKlxuICogSW1wbGVtZW50cyBpbnRlZ3JhdGlvbiB3aXRoIEFtYXpvbiBWUEMgSVAgQWRkcmVzcyBNYW5hZ2VyIChJUEFNKS5cbiAqXG4gKiBTZWUgdGhlIHBhY2thZ2UtbGV2ZWwgZG9jdW1lbnRhdGlvbiBvZiB0aGlzIHBhY2thZ2UgZm9yIGFuIG92ZXJ2aWV3XG4gKiBvZiB0aGUgdmFyaW91cyBkaW1lbnNpb25zIGluIHdoaWNoIHlvdSBjYW4gY29uZmlndXJlIHlvdXIgVlBDLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGBgYHRzXG4gKiAgbmV3IGVjMi5WcGMoc3RhY2ssICdUaGVWUEMnLCB7XG4gKiAgIGlwQWRkcmVzc2VzOiBJcEFkZHJlc3Nlcy5hd3NJcGFtQWxsb2NhdGlvbih7XG4gKiAgICAgaXB2NElwYW1Qb29sSWQ6IHBvb2wucmVmLFxuICogICAgIGlwdjROZXRtYXNrTGVuZ3RoOiAxOCxcbiAqICAgICBkZWZhdWx0U3VibmV0SXB2NE5ldG1hc2tMZW5ndGg6IDI0XG4gKiAgIH0pXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqL1xuY2xhc3MgQXdzSXBhbSBpbXBsZW1lbnRzIElJcEFkZHJlc3NlcyB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEF3c0lwYW1Qcm9wcykge1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG9jYXRlcyBWcGMgQ2lkci4gY2FsbGVkIHdoZW4gY3JlYXRpbmcgYSBWcGMgdXNpbmcgQXdzSXBhbS5cbiAgICovXG4gIGFsbG9jYXRlVnBjQ2lkcigpOiBWcGNJcGFtT3B0aW9ucyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlwdjROZXRtYXNrTGVuZ3RoOiB0aGlzLnByb3BzLmlwdjROZXRtYXNrTGVuZ3RoLFxuICAgICAgaXB2NElwYW1Qb29sSWQ6IHRoaXMucHJvcHMuaXB2NElwYW1Qb29sSWQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvY2F0ZXMgU3VibmV0cyBDaWRycy4gQ2FsbGVkIGJ5IFZQQyB3aGVuIGNyZWF0aW5nIHN1Ym5ldHMuXG4gICAqL1xuICBhbGxvY2F0ZVN1Ym5ldHNDaWRyKGlucHV0OiBBbGxvY2F0ZUNpZHJSZXF1ZXN0KTogU3VibmV0SXBhbU9wdGlvbnMge1xuXG4gICAgY29uc3QgY2lkclNwbGl0ID0gY2FsY3VsYXRlQ2lkclNwbGl0cyh0aGlzLnByb3BzLmlwdjROZXRtYXNrTGVuZ3RoLCBpbnB1dC5yZXF1ZXN0ZWRTdWJuZXRzLm1hcCgobWFzayA9PiB7XG5cbiAgICAgIGlmICgobWFzay5jb25maWd1cmF0aW9uLmNpZHJNYXNrID09PSB1bmRlZmluZWQpICYmICh0aGlzLnByb3BzLmRlZmF1bHRTdWJuZXRJcHY0TmV0bWFza0xlbmd0aD09PSB1bmRlZmluZWQpICkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0lmIHlvdSBoYXZlIG5vdCBzZXQgYSBjaWRyIGZvciBhbGwgc3VibmV0cyBpbiB0aGlzIGNhc2UgeW91IG11c3Qgc2V0IGEgZGVmYXVsdENpZHJNYXNrIGluIEF3c0lwYW0gT3B0aW9ucycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaWRyTWFzayA9IG1hc2suY29uZmlndXJhdGlvbi5jaWRyTWFzayA/PyB0aGlzLnByb3BzLmRlZmF1bHRTdWJuZXRJcHY0TmV0bWFza0xlbmd0aDtcblxuICAgICAgaWYgKGNpZHJNYXNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTaG91bGQgbm90IGhhdmUgaGFwcGVuZWQsIGJ1dCBzYXRpc2ZpZXMgdGhlIHR5cGUgY2hlY2tlcicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2lkck1hc2s7XG4gICAgfSkpKTtcblxuICAgIGNvbnN0IGFsbG9jYXRlZFN1Ym5ldHM6IEFsbG9jYXRlZFN1Ym5ldFtdID0gY2lkclNwbGl0Lm1hcChzdWJuZXQgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY2lkcjogRm4uc2VsZWN0KHN1Ym5ldC5pbmRleCwgRm4uY2lkcihpbnB1dC52cGNDaWRyLCBzdWJuZXQuY291bnQsIGAkezMyLXN1Ym5ldC5uZXRtYXNrfWApKSxcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsb2NhdGVkU3VibmV0czogYWxsb2NhdGVkU3VibmV0cyxcbiAgICB9O1xuXG4gIH1cbn1cblxuLyoqXG4gKiBJbXBsZW1lbnRzIHN0YXRpYyBJcCBhc3NpZ25tZW50IGxvY2FsbHkuXG4gKlxuICogU2VlIHRoZSBwYWNrYWdlLWxldmVsIGRvY3VtZW50YXRpb24gb2YgdGhpcyBwYWNrYWdlIGZvciBhbiBvdmVydmlld1xuICogb2YgdGhlIHZhcmlvdXMgZGltZW5zaW9ucyBpbiB3aGljaCB5b3UgY2FuIGNvbmZpZ3VyZSB5b3VyIFZQQy5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogIG5ldyBlYzIuVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICogICBpcEFkZHJlc3NlczogZWMyLklwQWRkcmVzc2VzLmNpZHIoJzEwLjAuMS4wLzIwJylcbiAqIH0pO1xuICogYGBgXG4gKlxuICovXG5jbGFzcyBDaWRyIGltcGxlbWVudHMgSUlwQWRkcmVzc2VzIHtcbiAgcHJpdmF0ZSByZWFkb25seSBuZXR3b3JrQnVpbGRlcjogTmV0d29ya0J1aWxkZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBjaWRyQmxvY2s6IHN0cmluZykge1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoY2lkckJsb2NrKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcXCdjaWRyXFwnIHByb3BlcnR5IG11c3QgYmUgYSBjb25jcmV0ZSBDSURSIHN0cmluZywgZ290IGEgVG9rZW4gKHdlIG5lZWQgdG8gcGFyc2UgaXQgZm9yIGF1dG9tYXRpYyBzdWJkaXZpc2lvbiknKTtcbiAgICB9XG5cbiAgICB0aGlzLm5ldHdvcmtCdWlsZGVyID0gbmV3IE5ldHdvcmtCdWlsZGVyKHRoaXMuY2lkckJsb2NrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvY2F0ZXMgVnBjIENpZHIuIGNhbGxlZCB3aGVuIGNyZWF0aW5nIGEgVnBjIHVzaW5nIElwQWRkcmVzc2VzLmNpZHIuXG4gICAqL1xuICBhbGxvY2F0ZVZwY0NpZHIoKTogVnBjSXBhbU9wdGlvbnMge1xuICAgIHJldHVybiB7XG4gICAgICBjaWRyQmxvY2s6IHRoaXMubmV0d29ya0J1aWxkZXIubmV0d29ya0NpZHIuY2lkcixcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG9jYXRlcyBTdWJuZXRzIENpZHJzLiBDYWxsZWQgYnkgVlBDIHdoZW4gY3JlYXRpbmcgc3VibmV0cy5cbiAgICovXG4gIGFsbG9jYXRlU3VibmV0c0NpZHIoaW5wdXQ6IEFsbG9jYXRlQ2lkclJlcXVlc3QpOiBTdWJuZXRJcGFtT3B0aW9ucyB7XG5cbiAgICBjb25zdCBhbGxvY2F0ZWRTdWJuZXRzOiBBbGxvY2F0ZWRTdWJuZXRbXSA9IFtdO1xuICAgIGNvbnN0IHN1Ym5ldHNXaXRob3V0RGVmaW5lZENpZHI6IElSZXF1ZXN0ZWRTdWJuZXRJbnN0YW5jZVtdID0gW107XG4gICAgLy9kZWZhdWx0OiBBdmFpbGFibGUgSVAgc3BhY2UgaXMgZXZlbmx5IGRpdmlkZWQgYWNyb3NzIHN1Ym5ldHMgaWYgbm8gY2lkciBpcyBnaXZlbi5cblxuICAgIGlucHV0LnJlcXVlc3RlZFN1Ym5ldHMuZm9yRWFjaCgocmVxdWVzdGVkU3VibmV0LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHJlcXVlc3RlZFN1Ym5ldC5jb25maWd1cmF0aW9uLmNpZHJNYXNrID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc3VibmV0c1dpdGhvdXREZWZpbmVkQ2lkci5wdXNoKHtcbiAgICAgICAgICBpbmRleCxcbiAgICAgICAgICByZXF1ZXN0ZWRTdWJuZXQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsb2NhdGVkU3VibmV0cy5wdXNoKHtcbiAgICAgICAgICBjaWRyOiB0aGlzLm5ldHdvcmtCdWlsZGVyLmFkZFN1Ym5ldChyZXF1ZXN0ZWRTdWJuZXQuY29uZmlndXJhdGlvbi5jaWRyTWFzayksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgY2lkck1hc2tGb3JSZW1haW5pbmcgPSB0aGlzLm5ldHdvcmtCdWlsZGVyLm1hc2tGb3JSZW1haW5pbmdTdWJuZXRzKHN1Ym5ldHNXaXRob3V0RGVmaW5lZENpZHIubGVuZ3RoKTtcbiAgICBzdWJuZXRzV2l0aG91dERlZmluZWRDaWRyLmZvckVhY2goKHN1Ym5ldCk9PiB7XG4gICAgICBhbGxvY2F0ZWRTdWJuZXRzLnNwbGljZShzdWJuZXQuaW5kZXgsIDAsIHtcbiAgICAgICAgY2lkcjogdGhpcy5uZXR3b3JrQnVpbGRlci5hZGRTdWJuZXQoY2lkck1hc2tGb3JSZW1haW5pbmcpLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYWxsb2NhdGVkU3VibmV0czogYWxsb2NhdGVkU3VibmV0cyxcbiAgICB9O1xuICB9XG59XG4iXX0=