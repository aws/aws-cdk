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
    constructor() { }
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
}
exports.IpAddresses = IpAddresses;
_a = JSII_RTTI_SYMBOL_1;
IpAddresses[_a] = { fqn: "@aws-cdk/aws-ec2.IpAddresses", version: "0.0.0" };
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
        const cidrSplit = cidr_splits_1.calculateCidrSplits(this.props.ipv4NetmaskLength, input.requestedSubnets.map((mask => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXAtYWRkcmVzc2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaXAtYWRkcmVzc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUEwQztBQUMxQywrQ0FBb0Q7QUFDcEQsaURBQWdEO0FBR2hEOztHQUVHO0FBQ0gsTUFBYSxXQUFXO0lBc0J0QixpQkFBeUI7SUFyQnpCOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFpQjtRQUNsQyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzVCO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQW1COzs7Ozs7Ozs7O1FBQ2pELE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDM0I7O0FBcEJILGtDQXVCQzs7O0FBa0pEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxNQUFNLE9BQU87SUFDWCxZQUE2QixLQUFtQjtRQUFuQixVQUFLLEdBQUwsS0FBSyxDQUFjO0tBQy9DO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2IsT0FBTztZQUNMLGlCQUFpQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCO1lBQy9DLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWM7U0FDMUMsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSCxtQkFBbUIsQ0FBQyxLQUEwQjtRQUU1QyxNQUFNLFNBQVMsR0FBRyxpQ0FBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUVyRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLDhCQUE4QixLQUFJLFNBQVMsQ0FBQyxFQUFHO2dCQUM1RyxNQUFNLElBQUksS0FBSyxDQUFDLDJHQUEyRyxDQUFDLENBQUM7YUFDOUg7WUFFRCxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLDhCQUE4QixDQUFDO1lBRTFGLElBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO2FBQzdFO1lBRUQsT0FBTyxRQUFRLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUwsTUFBTSxnQkFBZ0IsR0FBc0IsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNqRSxPQUFPO2dCQUNMLElBQUksRUFBRSxTQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsU0FBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7YUFDNUYsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztZQUNMLGdCQUFnQixFQUFFLGdCQUFnQjtTQUNuQyxDQUFDO0tBRUg7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7OztHQWNHO0FBQ0gsTUFBTSxJQUFJO0lBR1IsWUFBNkIsU0FBaUI7UUFBakIsY0FBUyxHQUFULFNBQVMsQ0FBUTtRQUM1QyxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQywrR0FBK0csQ0FBQyxDQUFDO1NBQ2xJO1FBRUQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLDZCQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzFEO0lBRUQ7O09BRUc7SUFDSCxlQUFlO1FBQ2IsT0FBTztZQUNMLFNBQVMsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxJQUFJO1NBQ2hELENBQUM7S0FDSDtJQUVEOztPQUVHO0lBQ0gsbUJBQW1CLENBQUMsS0FBMEI7UUFFNUMsTUFBTSxnQkFBZ0IsR0FBc0IsRUFBRSxDQUFDO1FBQy9DLE1BQU0seUJBQXlCLEdBQStCLEVBQUUsQ0FBQztRQUNqRSxtRkFBbUY7UUFFbkYsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4RCxJQUFJLGVBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtnQkFDeEQseUJBQXlCLENBQUMsSUFBSSxDQUFDO29CQUM3QixLQUFLO29CQUNMLGVBQWU7aUJBQ2hCLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLGdCQUFnQixDQUFDLElBQUksQ0FBQztvQkFDcEIsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDO2lCQUM1RSxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLHVCQUF1QixDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNHLHlCQUF5QixDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBQyxFQUFFO1lBQzFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRTtnQkFDdkMsSUFBSSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO2FBQzFELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztZQUNMLGdCQUFnQixFQUFFLGdCQUFnQjtTQUNuQyxDQUFDO0tBQ0g7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZuLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgY2FsY3VsYXRlQ2lkclNwbGl0cyB9IGZyb20gJy4vY2lkci1zcGxpdHMnO1xuaW1wb3J0IHsgTmV0d29ya0J1aWxkZXIgfSBmcm9tICcuL25ldHdvcmstdXRpbCc7XG5pbXBvcnQgeyBTdWJuZXRDb25maWd1cmF0aW9uIH0gZnJvbSAnLi92cGMnO1xuXG4vKipcbiAqIEFuIGFic3RyYWN0IFByb3ZpZGVyIG9mIElwQWRkcmVzc2VzXG4gKi9cbmV4cG9ydCBjbGFzcyBJcEFkZHJlc3NlcyB7XG4gIC8qKlxuICAgKiBVc2VkIHRvIHByb3ZpZGUgbG9jYWwgSXAgQWRkcmVzcyBNYW5hZ2VtZW50IHNlcnZpY2VzIGZvciB5b3VyIFZQQ1xuICAgKlxuICAgKiBWUEMgQ2lkciBpcyBzdXBwbGllZCBhdCBjcmVhdGlvbiBhbmQgc3VibmV0cyBhcmUgY2FsY3VsYXRlZCBsb2NhbGx5XG4gICAqXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGNpZHIoY2lkckJsb2NrOiBzdHJpbmcpOiBJSXBBZGRyZXNzZXMge1xuICAgIHJldHVybiBuZXcgQ2lkcihjaWRyQmxvY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZWQgdG8gcHJvdmlkZSBjZW50cmFsaXplZCBJcCBBZGRyZXNzIE1hbmFnZW1lbnQgc2VydmljZXMgZm9yIHlvdXIgVlBDXG4gICAqXG4gICAqIFVzZXMgVlBDIENpZHIgYWxsb2NhdGlvbnMgZnJvbSBBV1MgSVBBTVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS92cGMvbGF0ZXN0L2lwYW0vd2hhdC1pdC1pcy1pcGFtLmh0bWxcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYXdzSXBhbUFsbG9jYXRpb24ocHJvcHM6IEF3c0lwYW1Qcm9wcyk6IElJcEFkZHJlc3NlcyB7XG4gICAgcmV0dXJuIG5ldyBBd3NJcGFtKHByb3BzKTtcbiAgfVxuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7IH1cbn1cblxuLyoqXG4gKiBJbXBsZW1lbnRhdGlvbnMgZm9yIGlwIGFkZHJlc3MgbWFuYWdlbWVudFxuICovXG5leHBvcnQgaW50ZXJmYWNlIElJcEFkZHJlc3NlcyB7XG4gIC8qKlxuICAgKiBDYWxsZWQgYnkgdGhlIFZQQyB0byByZXRyaWV2ZSBWUEMgb3B0aW9ucyBmcm9tIHRoZSBJcGFtXG4gICAqXG4gICAqIERvbid0IGNhbGwgdGhpcyBkaXJlY3RseSwgdGhlIFZQQyB3aWxsIGNhbGwgaXQgYXV0b21hdGljYWxseS5cbiAgICovXG4gIGFsbG9jYXRlVnBjQ2lkcigpOiBWcGNJcGFtT3B0aW9ucztcblxuICAvKipcbiAgICogQ2FsbGVkIGJ5IHRoZSBWUEMgdG8gcmV0cmlldmUgU3VibmV0IG9wdGlvbnMgZnJvbSB0aGUgSXBhbVxuICAgKlxuICAgKiBEb24ndCBjYWxsIHRoaXMgZGlyZWN0bHksIHRoZSBWUEMgd2lsbCBjYWxsIGl0IGF1dG9tYXRpY2FsbHkuXG4gICAqL1xuICBhbGxvY2F0ZVN1Ym5ldHNDaWRyKGlucHV0OiBBbGxvY2F0ZUNpZHJSZXF1ZXN0KTogU3VibmV0SXBhbU9wdGlvbnM7XG59XG5cbi8qKlxuICogQ2lkciBBbGxvY2F0ZWQgVnBjXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVnBjSXBhbU9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBDaWRyIEJsb2NrIGZvciBWcGNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBPbmx5IHJlcXVpcmVkIHdoZW4gSXBhbSBoYXMgY29uY3JldGUgYWxsb2NhdGlvbiBhdmFpbGFibGUgZm9yIHN0YXRpYyBWcGNcbiAgICovXG4gIHJlYWRvbmx5IGNpZHJCbG9jaz86IHN0cmluZztcblxuICAvKipcbiAgICogQ2lkciBNYXNrIGZvciBWcGNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBPbmx5IHJlcXVpcmVkIHdoZW4gdXNpbmcgQVdTIElwYW1cbiAgICovXG4gIHJlYWRvbmx5IGlwdjROZXRtYXNrTGVuZ3RoPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBpcHY0IElQQU0gUG9vbCBJZFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE9ubHkgcmVxdWlyZWQgd2hlbiB1c2luZyBBV1MgSXBhbVxuICAgKi9cbiAgcmVhZG9ubHkgaXB2NElwYW1Qb29sSWQ/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogU3VibmV0IHJlcXVlc3RlZCBmb3IgYWxsb2NhdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RlZFN1Ym5ldCB7XG5cbiAgLyoqXG4gICAqIFRoZSBhdmFpbGFiaWxpdHkgem9uZSBmb3IgdGhlIHN1Ym5ldFxuICAgKi9cbiAgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IGNvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBmb3IgYSBzaW5nbGUgc3VibmV0IGdyb3VwIGluIGEgVlBDXG4gICAqL1xuICByZWFkb25seSBjb25maWd1cmF0aW9uOiBTdWJuZXRDb25maWd1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBJZCBmb3IgdGhlIFN1Ym5ldCBjb25zdHJ1Y3RcbiAgICovXG4gIHJlYWRvbmx5IHN1Ym5ldENvbnN0cnVjdElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gaW5zdGFuY2Ugb2YgYSBTdWJuZXQgcmVxdWVzdGVkIGZvciBhbGxvY2F0aW9uXG4gKi9cbmludGVyZmFjZSBJUmVxdWVzdGVkU3VibmV0SW5zdGFuY2Uge1xuICAvKipcbiAgICogSW5kZXggbG9jYXRpb24gb2YgU3VibmV0IHJlcXVlc3RlZCBmb3IgYWxsb2NhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgaW5kZXg6IG51bWJlcixcblxuICAvKipcbiAgICogU3VibmV0IHJlcXVlc3RlZCBmb3IgYWxsb2NhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgcmVxdWVzdGVkU3VibmV0OiBSZXF1ZXN0ZWRTdWJuZXRcbn1cblxuLyoqXG4gKiBSZXF1ZXN0IGZvciBzdWJuZXRzIENpZHIgdG8gYmUgYWxsb2NhdGVkIGZvciBhIFZwY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFsbG9jYXRlQ2lkclJlcXVlc3Qge1xuXG4gIC8qKlxuICAgKiBUaGUgSVB2NCBDSURSIGJsb2NrIGZvciB0aGlzIFZwY1xuICAgKi9cbiAgcmVhZG9ubHkgdnBjQ2lkcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgU3VibmV0cyB0byBiZSBhbGxvY2F0ZWRcbiAgICovXG4gIHJlYWRvbmx5IHJlcXVlc3RlZFN1Ym5ldHM6IFJlcXVlc3RlZFN1Ym5ldFtdO1xufVxuXG4vKipcbiAqIENpZHIgQWxsb2NhdGVkIFN1Ym5ldHNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdWJuZXRJcGFtT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDaWRyIEFsbG9jYXRpb25zIGZvciBTdWJuZXRzXG4gICAqL1xuICByZWFkb25seSBhbGxvY2F0ZWRTdWJuZXRzOiBBbGxvY2F0ZWRTdWJuZXRbXTtcbn1cblxuLyoqXG4gKiBDaWRyIEFsbG9jYXRlZCBTdWJuZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbGxvY2F0ZWRTdWJuZXQge1xuICAvKipcbiAgICogQ2lkciBBbGxvY2F0aW9ucyBmb3IgYSBTdWJuZXRcbiAgICovXG4gIHJlYWRvbmx5IGNpZHI6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBBd3NJcGFtXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXdzSXBhbVByb3BzIHtcblxuICAvKipcbiAgICogTmV0bWFzayBsZW5ndGggZm9yIFZwY1xuICAgKi9cbiAgcmVhZG9ubHkgaXB2NE5ldG1hc2tMZW5ndGg6IG51bWJlcjtcblxuICAvKipcbiAgICogSXBhbSBQb29sIElkIGZvciBpcHY0IGFsbG9jYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGlwdjRJcGFtUG9vbElkOiBzdHJpbmc7IC8vIHRvZG86IHNob3VsZCBiZSBhIHR5cGVcblxuICAvKipcbiAgICogRGVmYXVsdCBsZW5ndGggZm9yIFN1Ym5ldCBpcHY0IE5ldHdvcmsgbWFza1xuICAgKlxuICAgKiBTcGVjaWZ5IHRoaXMgb3B0aW9uIG9ubHkgaWYgeW91IGRvIG5vdCBzcGVjaWZ5IGFsbCBTdWJuZXRzIHVzaW5nIFN1Ym5ldENvbmZpZ3VyYXRpb24gd2l0aCBhIGNpZHJNYXNrXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRGVmYXVsdCBpcHY0IFN1Ym5ldCBNYXNrIGZvciBzdWJuZXRzIGluIFZwY1xuICAgKlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFN1Ym5ldElwdjROZXRtYXNrTGVuZ3RoPzogbnVtYmVyO1xufVxuXG4vKipcbiAqIEltcGxlbWVudHMgaW50ZWdyYXRpb24gd2l0aCBBbWF6b24gVlBDIElQIEFkZHJlc3MgTWFuYWdlciAoSVBBTSkuXG4gKlxuICogU2VlIHRoZSBwYWNrYWdlLWxldmVsIGRvY3VtZW50YXRpb24gb2YgdGhpcyBwYWNrYWdlIGZvciBhbiBvdmVydmlld1xuICogb2YgdGhlIHZhcmlvdXMgZGltZW5zaW9ucyBpbiB3aGljaCB5b3UgY2FuIGNvbmZpZ3VyZSB5b3VyIFZQQy5cbiAqXG4gKiBGb3IgZXhhbXBsZTpcbiAqXG4gKiBgYGB0c1xuICogIG5ldyBlYzIuVnBjKHN0YWNrLCAnVGhlVlBDJywge1xuICogICBpcEFkZHJlc3NlczogSXBBZGRyZXNzZXMuYXdzSXBhbUFsbG9jYXRpb24oe1xuICogICAgIGlwdjRJcGFtUG9vbElkOiBwb29sLnJlZixcbiAqICAgICBpcHY0TmV0bWFza0xlbmd0aDogMTgsXG4gKiAgICAgZGVmYXVsdFN1Ym5ldElwdjROZXRtYXNrTGVuZ3RoOiAyNFxuICogICB9KVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKi9cbmNsYXNzIEF3c0lwYW0gaW1wbGVtZW50cyBJSXBBZGRyZXNzZXMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBBd3NJcGFtUHJvcHMpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvY2F0ZXMgVnBjIENpZHIuIGNhbGxlZCB3aGVuIGNyZWF0aW5nIGEgVnBjIHVzaW5nIEF3c0lwYW0uXG4gICAqL1xuICBhbGxvY2F0ZVZwY0NpZHIoKTogVnBjSXBhbU9wdGlvbnMge1xuICAgIHJldHVybiB7XG4gICAgICBpcHY0TmV0bWFza0xlbmd0aDogdGhpcy5wcm9wcy5pcHY0TmV0bWFza0xlbmd0aCxcbiAgICAgIGlwdjRJcGFtUG9vbElkOiB0aGlzLnByb3BzLmlwdjRJcGFtUG9vbElkLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWxsb2NhdGVzIFN1Ym5ldHMgQ2lkcnMuIENhbGxlZCBieSBWUEMgd2hlbiBjcmVhdGluZyBzdWJuZXRzLlxuICAgKi9cbiAgYWxsb2NhdGVTdWJuZXRzQ2lkcihpbnB1dDogQWxsb2NhdGVDaWRyUmVxdWVzdCk6IFN1Ym5ldElwYW1PcHRpb25zIHtcblxuICAgIGNvbnN0IGNpZHJTcGxpdCA9IGNhbGN1bGF0ZUNpZHJTcGxpdHModGhpcy5wcm9wcy5pcHY0TmV0bWFza0xlbmd0aCwgaW5wdXQucmVxdWVzdGVkU3VibmV0cy5tYXAoKG1hc2sgPT4ge1xuXG4gICAgICBpZiAoKG1hc2suY29uZmlndXJhdGlvbi5jaWRyTWFzayA9PT0gdW5kZWZpbmVkKSAmJiAodGhpcy5wcm9wcy5kZWZhdWx0U3VibmV0SXB2NE5ldG1hc2tMZW5ndGg9PT0gdW5kZWZpbmVkKSApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJZiB5b3UgaGF2ZSBub3Qgc2V0IGEgY2lkciBmb3IgYWxsIHN1Ym5ldHMgaW4gdGhpcyBjYXNlIHlvdSBtdXN0IHNldCBhIGRlZmF1bHRDaWRyTWFzayBpbiBBd3NJcGFtIE9wdGlvbnMnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2lkck1hc2sgPSBtYXNrLmNvbmZpZ3VyYXRpb24uY2lkck1hc2sgPz8gdGhpcy5wcm9wcy5kZWZhdWx0U3VibmV0SXB2NE5ldG1hc2tMZW5ndGg7XG5cbiAgICAgIGlmIChjaWRyTWFzayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2hvdWxkIG5vdCBoYXZlIGhhcHBlbmVkLCBidXQgc2F0aXNmaWVzIHRoZSB0eXBlIGNoZWNrZXInKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNpZHJNYXNrO1xuICAgIH0pKSk7XG5cbiAgICBjb25zdCBhbGxvY2F0ZWRTdWJuZXRzOiBBbGxvY2F0ZWRTdWJuZXRbXSA9IGNpZHJTcGxpdC5tYXAoc3VibmV0ID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGNpZHI6IEZuLnNlbGVjdChzdWJuZXQuaW5kZXgsIEZuLmNpZHIoaW5wdXQudnBjQ2lkciwgc3VibmV0LmNvdW50LCBgJHszMi1zdWJuZXQubmV0bWFza31gKSksXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFsbG9jYXRlZFN1Ym5ldHM6IGFsbG9jYXRlZFN1Ym5ldHMsXG4gICAgfTtcblxuICB9XG59XG5cbi8qKlxuICogSW1wbGVtZW50cyBzdGF0aWMgSXAgYXNzaWdubWVudCBsb2NhbGx5LlxuICpcbiAqIFNlZSB0aGUgcGFja2FnZS1sZXZlbCBkb2N1bWVudGF0aW9uIG9mIHRoaXMgcGFja2FnZSBmb3IgYW4gb3ZlcnZpZXdcbiAqIG9mIHRoZSB2YXJpb3VzIGRpbWVuc2lvbnMgaW4gd2hpY2ggeW91IGNhbiBjb25maWd1cmUgeW91ciBWUEMuXG4gKlxuICogRm9yIGV4YW1wbGU6XG4gKlxuICogYGBgdHNcbiAqICBuZXcgZWMyLlZwYyhzdGFjaywgJ1RoZVZQQycsIHtcbiAqICAgaXBBZGRyZXNzZXM6IGVjMi5JcEFkZHJlc3Nlcy5jaWRyKCcxMC4wLjEuMC8yMCcpXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqL1xuY2xhc3MgQ2lkciBpbXBsZW1lbnRzIElJcEFkZHJlc3NlcyB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbmV0d29ya0J1aWxkZXI6IE5ldHdvcmtCdWlsZGVyO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgY2lkckJsb2NrOiBzdHJpbmcpIHtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKGNpZHJCbG9jaykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXFwnY2lkclxcJyBwcm9wZXJ0eSBtdXN0IGJlIGEgY29uY3JldGUgQ0lEUiBzdHJpbmcsIGdvdCBhIFRva2VuICh3ZSBuZWVkIHRvIHBhcnNlIGl0IGZvciBhdXRvbWF0aWMgc3ViZGl2aXNpb24pJyk7XG4gICAgfVxuXG4gICAgdGhpcy5uZXR3b3JrQnVpbGRlciA9IG5ldyBOZXR3b3JrQnVpbGRlcih0aGlzLmNpZHJCbG9jayk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb2NhdGVzIFZwYyBDaWRyLiBjYWxsZWQgd2hlbiBjcmVhdGluZyBhIFZwYyB1c2luZyBJcEFkZHJlc3Nlcy5jaWRyLlxuICAgKi9cbiAgYWxsb2NhdGVWcGNDaWRyKCk6IFZwY0lwYW1PcHRpb25zIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2lkckJsb2NrOiB0aGlzLm5ldHdvcmtCdWlsZGVyLm5ldHdvcmtDaWRyLmNpZHIsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvY2F0ZXMgU3VibmV0cyBDaWRycy4gQ2FsbGVkIGJ5IFZQQyB3aGVuIGNyZWF0aW5nIHN1Ym5ldHMuXG4gICAqL1xuICBhbGxvY2F0ZVN1Ym5ldHNDaWRyKGlucHV0OiBBbGxvY2F0ZUNpZHJSZXF1ZXN0KTogU3VibmV0SXBhbU9wdGlvbnMge1xuXG4gICAgY29uc3QgYWxsb2NhdGVkU3VibmV0czogQWxsb2NhdGVkU3VibmV0W10gPSBbXTtcbiAgICBjb25zdCBzdWJuZXRzV2l0aG91dERlZmluZWRDaWRyOiBJUmVxdWVzdGVkU3VibmV0SW5zdGFuY2VbXSA9IFtdO1xuICAgIC8vZGVmYXVsdDogQXZhaWxhYmxlIElQIHNwYWNlIGlzIGV2ZW5seSBkaXZpZGVkIGFjcm9zcyBzdWJuZXRzIGlmIG5vIGNpZHIgaXMgZ2l2ZW4uXG5cbiAgICBpbnB1dC5yZXF1ZXN0ZWRTdWJuZXRzLmZvckVhY2goKHJlcXVlc3RlZFN1Ym5ldCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChyZXF1ZXN0ZWRTdWJuZXQuY29uZmlndXJhdGlvbi5jaWRyTWFzayA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN1Ym5ldHNXaXRob3V0RGVmaW5lZENpZHIucHVzaCh7XG4gICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgcmVxdWVzdGVkU3VibmV0LFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFsbG9jYXRlZFN1Ym5ldHMucHVzaCh7XG4gICAgICAgICAgY2lkcjogdGhpcy5uZXR3b3JrQnVpbGRlci5hZGRTdWJuZXQocmVxdWVzdGVkU3VibmV0LmNvbmZpZ3VyYXRpb24uY2lkck1hc2spLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGNpZHJNYXNrRm9yUmVtYWluaW5nID0gdGhpcy5uZXR3b3JrQnVpbGRlci5tYXNrRm9yUmVtYWluaW5nU3VibmV0cyhzdWJuZXRzV2l0aG91dERlZmluZWRDaWRyLmxlbmd0aCk7XG4gICAgc3VibmV0c1dpdGhvdXREZWZpbmVkQ2lkci5mb3JFYWNoKChzdWJuZXQpPT4ge1xuICAgICAgYWxsb2NhdGVkU3VibmV0cy5zcGxpY2Uoc3VibmV0LmluZGV4LCAwLCB7XG4gICAgICAgIGNpZHI6IHRoaXMubmV0d29ya0J1aWxkZXIuYWRkU3VibmV0KGNpZHJNYXNrRm9yUmVtYWluaW5nKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFsbG9jYXRlZFN1Ym5ldHM6IGFsbG9jYXRlZFN1Ym5ldHMsXG4gICAgfTtcbiAgfVxufVxuIl19