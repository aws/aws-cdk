import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnAccelerator`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html
 */
export interface CfnAcceleratorProps {
    /**
     * The name of the accelerator. The name must contain only alphanumeric characters or hyphens (-), and must not begin or end with a hyphen.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-name
     */
    readonly name: string;
    /**
     * Indicates whether the accelerator is enabled. The value is true or false. The default value is true.
     *
     * If the value is set to true, the accelerator cannot be deleted. If set to false, accelerator can be deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
    /**
     * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose IP addresses from your own pool to use for the accelerator's static IP addresses when you create an accelerator. You can specify one or two addresses, separated by a comma. Do not include the /32 suffix.
     *
     * Only one IP address from each of your IP address ranges can be used for each accelerator. If you specify only one IP address from your IP address range, Global Accelerator assigns a second static IP address for the accelerator from the AWS IP address pool.
     *
     * Note that you can't update IP addresses for an existing accelerator. To change them, you must create a new accelerator with the new addresses.
     *
     * For more information, see [Bring Your Own IP Addresses (BYOIP)](https://docs.aws.amazon.com/global-accelerator/latest/dg/using-byoip.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-ipaddresses
     */
    readonly ipAddresses?: string[];
    /**
     * The IP address type that an accelerator supports. For a standard accelerator, the value can be IPV4 or DUAL_STACK.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-ipaddresstype
     */
    readonly ipAddressType?: string;
    /**
     * Create tags for an accelerator.
     *
     * For more information, see [Tagging](https://docs.aws.amazon.com/global-accelerator/latest/dg/tagging-in-global-accelerator.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::GlobalAccelerator::Accelerator`
 *
 * The `AWS::GlobalAccelerator::Accelerator` resource is a Global Accelerator resource type that contains information about how you create an accelerator. An accelerator includes one or more listeners that process inbound connections and direct traffic to one or more endpoint groups, each of which includes endpoints, such as Application Load Balancers, Network Load Balancers, and Amazon EC2 instances.
 *
 * @cloudformationResource AWS::GlobalAccelerator::Accelerator
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html
 */
export declare class CfnAccelerator extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GlobalAccelerator::Accelerator";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAccelerator;
    /**
     * The ARN of the accelerator, such as `arn:aws:globalaccelerator::012345678901:accelerator/1234abcd-abcd-1234-abcd-1234abcdefgh` .
     * @cloudformationAttribute AcceleratorArn
     */
    readonly attrAcceleratorArn: string;
    /**
     * The Domain Name System (DNS) name that Global Accelerator creates that points to an accelerator's static IPv4 addresses.
     * @cloudformationAttribute DnsName
     */
    readonly attrDnsName: string;
    /**
     * The DNS name that Global Accelerator creates that points to a dual-stack accelerator's four static IP addresses: two IPv4 addresses and two IPv6 addresses.
     * @cloudformationAttribute DualStackDnsName
     */
    readonly attrDualStackDnsName: string;
    /**
     * The array of IPv4 addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
     * @cloudformationAttribute Ipv4Addresses
     */
    readonly attrIpv4Addresses: string[];
    /**
     * The array of IPv6 addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
     * @cloudformationAttribute Ipv6Addresses
     */
    readonly attrIpv6Addresses: string[];
    /**
     * The name of the accelerator. The name must contain only alphanumeric characters or hyphens (-), and must not begin or end with a hyphen.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-name
     */
    name: string;
    /**
     * Indicates whether the accelerator is enabled. The value is true or false. The default value is true.
     *
     * If the value is set to true, the accelerator cannot be deleted. If set to false, accelerator can be deleted.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-enabled
     */
    enabled: boolean | cdk.IResolvable | undefined;
    /**
     * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose IP addresses from your own pool to use for the accelerator's static IP addresses when you create an accelerator. You can specify one or two addresses, separated by a comma. Do not include the /32 suffix.
     *
     * Only one IP address from each of your IP address ranges can be used for each accelerator. If you specify only one IP address from your IP address range, Global Accelerator assigns a second static IP address for the accelerator from the AWS IP address pool.
     *
     * Note that you can't update IP addresses for an existing accelerator. To change them, you must create a new accelerator with the new addresses.
     *
     * For more information, see [Bring Your Own IP Addresses (BYOIP)](https://docs.aws.amazon.com/global-accelerator/latest/dg/using-byoip.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-ipaddresses
     */
    ipAddresses: string[] | undefined;
    /**
     * The IP address type that an accelerator supports. For a standard accelerator, the value can be IPV4 or DUAL_STACK.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-ipaddresstype
     */
    ipAddressType: string | undefined;
    /**
     * Create tags for an accelerator.
     *
     * For more information, see [Tagging](https://docs.aws.amazon.com/global-accelerator/latest/dg/tagging-in-global-accelerator.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-accelerator.html#cfn-globalaccelerator-accelerator-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::GlobalAccelerator::Accelerator`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnAcceleratorProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
/**
 * Properties for defining a `CfnEndpointGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html
 */
export interface CfnEndpointGroupProps {
    /**
     * The AWS Regions where the endpoint group is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-endpointgroupregion
     */
    readonly endpointGroupRegion: string;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-listenerarn
     */
    readonly listenerArn: string;
    /**
     * The list of endpoint objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-endpointconfigurations
     */
    readonly endpointConfigurations?: Array<CfnEndpointGroup.EndpointConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The time—10 seconds or 30 seconds—between health checks for each endpoint. The default value is 30.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckintervalseconds
     */
    readonly healthCheckIntervalSeconds?: number;
    /**
     * If the protocol is HTTP/S, then this value provides the ping path that Global Accelerator uses for the destination on the endpoints for health checks. The default is slash (/).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckpath
     */
    readonly healthCheckPath?: string;
    /**
     * The port that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.
     *
     * The default port is the port for the listener that this endpoint group is associated with. If the listener port is a list, Global Accelerator uses the first specified port in the list of ports.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckport
     */
    readonly healthCheckPort?: number;
    /**
     * The protocol that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group. The default value is TCP.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckprotocol
     */
    readonly healthCheckProtocol?: string;
    /**
     * Allows you to override the destination ports used to route traffic to an endpoint. Using a port override lets you map a list of external destination ports (that your users send traffic to) to a list of internal destination ports that you want an application endpoint to receive traffic on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-portoverrides
     */
    readonly portOverrides?: Array<CfnEndpointGroup.PortOverrideProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy. The default value is 3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-thresholdcount
     */
    readonly thresholdCount?: number;
    /**
     * The percentage of traffic to send to an AWS Regions . Additional traffic is distributed to other endpoint groups for this listener.
     *
     * Use this action to increase (dial up) or decrease (dial down) traffic to a specific Region. The percentage is applied to the traffic that would otherwise have been routed to the Region based on optimal routing.
     *
     * The default value is 100.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-trafficdialpercentage
     */
    readonly trafficDialPercentage?: number;
}
/**
 * A CloudFormation `AWS::GlobalAccelerator::EndpointGroup`
 *
 * The `AWS::GlobalAccelerator::EndpointGroup` resource is a Global Accelerator resource type that contains information about how you create an endpoint group for the specified listener. An endpoint group is a collection of endpoints in one AWS Region .
 *
 * @cloudformationResource AWS::GlobalAccelerator::EndpointGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html
 */
export declare class CfnEndpointGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GlobalAccelerator::EndpointGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEndpointGroup;
    /**
     * The ARN of the endpoint group, such as `arn:aws:globalaccelerator::012345678901:accelerator/1234abcd-abcd-1234-abcd-1234abcdefgh/listener/0123vxyz/endpoint-group/098765zyxwvu` .
     * @cloudformationAttribute EndpointGroupArn
     */
    readonly attrEndpointGroupArn: string;
    /**
     * The AWS Regions where the endpoint group is located.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-endpointgroupregion
     */
    endpointGroupRegion: string;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-listenerarn
     */
    listenerArn: string;
    /**
     * The list of endpoint objects.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-endpointconfigurations
     */
    endpointConfigurations: Array<CfnEndpointGroup.EndpointConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The time—10 seconds or 30 seconds—between health checks for each endpoint. The default value is 30.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckintervalseconds
     */
    healthCheckIntervalSeconds: number | undefined;
    /**
     * If the protocol is HTTP/S, then this value provides the ping path that Global Accelerator uses for the destination on the endpoints for health checks. The default is slash (/).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckpath
     */
    healthCheckPath: string | undefined;
    /**
     * The port that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.
     *
     * The default port is the port for the listener that this endpoint group is associated with. If the listener port is a list, Global Accelerator uses the first specified port in the list of ports.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckport
     */
    healthCheckPort: number | undefined;
    /**
     * The protocol that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group. The default value is TCP.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-healthcheckprotocol
     */
    healthCheckProtocol: string | undefined;
    /**
     * Allows you to override the destination ports used to route traffic to an endpoint. Using a port override lets you map a list of external destination ports (that your users send traffic to) to a list of internal destination ports that you want an application endpoint to receive traffic on.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-portoverrides
     */
    portOverrides: Array<CfnEndpointGroup.PortOverrideProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy. The default value is 3.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-thresholdcount
     */
    thresholdCount: number | undefined;
    /**
     * The percentage of traffic to send to an AWS Regions . Additional traffic is distributed to other endpoint groups for this listener.
     *
     * Use this action to increase (dial up) or decrease (dial down) traffic to a specific Region. The percentage is applied to the traffic that would otherwise have been routed to the Region based on optimal routing.
     *
     * The default value is 100.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-endpointgroup.html#cfn-globalaccelerator-endpointgroup-trafficdialpercentage
     */
    trafficDialPercentage: number | undefined;
    /**
     * Create a new `AWS::GlobalAccelerator::EndpointGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnEndpointGroupProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnEndpointGroup {
    /**
     * A complex type for endpoints. A resource must be valid and active when you add it as an endpoint.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html
     */
    interface EndpointConfigurationProperty {
        /**
         * Indicates whether client IP address preservation is enabled for an Application Load Balancer endpoint. The value is true or false. The default value is true for new accelerators.
         *
         * If the value is set to true, the client's IP address is preserved in the `X-Forwarded-For` request header as traffic travels to applications on the Application Load Balancer endpoint fronted by the accelerator.
         *
         * For more information, see [Preserve Client IP Addresses](https://docs.aws.amazon.com/global-accelerator/latest/dg/preserve-client-ip-address.html) in the *AWS Global Accelerator Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-clientippreservationenabled
         */
        readonly clientIpPreservationEnabled?: boolean | cdk.IResolvable;
        /**
         * An ID for the endpoint. If the endpoint is a Network Load Balancer or Application Load Balancer, this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address, this is the Elastic IP address allocation ID. For Amazon EC2 instances, this is the EC2 instance ID. A resource must be valid and active when you add it as an endpoint.
         *
         * An Application Load Balancer can be either internal or internet-facing.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-endpointid
         */
        readonly endpointId: string;
        /**
         * The weight associated with the endpoint. When you add weights to endpoints, you configure Global Accelerator to route traffic based on proportions that you specify. For example, you might specify endpoint weights of 4, 5, 5, and 6 (sum=20). The result is that 4/20 of your traffic, on average, is routed to the first endpoint, 5/20 is routed both to the second and third endpoints, and 6/20 is routed to the last endpoint. For more information, see [Endpoint Weights](https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.html) in the *AWS Global Accelerator Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-endpointconfiguration.html#cfn-globalaccelerator-endpointgroup-endpointconfiguration-weight
         */
        readonly weight?: number;
    }
}
export declare namespace CfnEndpointGroup {
    /**
     * Override specific listener ports used to route traffic to endpoints that are part of an endpoint group. For example, you can create a port override in which the listener receives user traffic on ports 80 and 443, but your accelerator routes that traffic to ports 1080 and 1443, respectively, on the endpoints.
     *
     * For more information, see [Port overrides](https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoint-groups-port-override.html) in the *AWS Global Accelerator Developer Guide* .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-portoverride.html
     */
    interface PortOverrideProperty {
        /**
         * The endpoint port that you want a listener port to be mapped to. This is the port on the endpoint, such as the Application Load Balancer or Amazon EC2 instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-portoverride.html#cfn-globalaccelerator-endpointgroup-portoverride-endpointport
         */
        readonly endpointPort: number;
        /**
         * The listener port that you want to map to a specific endpoint port. This is the port that user traffic arrives to the Global Accelerator on.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-endpointgroup-portoverride.html#cfn-globalaccelerator-endpointgroup-portoverride-listenerport
         */
        readonly listenerPort: number;
    }
}
/**
 * Properties for defining a `CfnListener`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html
 */
export interface CfnListenerProps {
    /**
     * The Amazon Resource Name (ARN) of your accelerator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-acceleratorarn
     */
    readonly acceleratorArn: string;
    /**
     * The list of port ranges for the connections from clients to the accelerator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-portranges
     */
    readonly portRanges: Array<CfnListener.PortRangeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The protocol for the connections from clients to the accelerator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-protocol
     */
    readonly protocol: string;
    /**
     * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request. Client affinity gives you control over whether to always route each client to the same specific endpoint.
     *
     * AWS Global Accelerator uses a consistent-flow hashing algorithm to choose the optimal endpoint for a connection. If client affinity is `NONE` , Global Accelerator uses the "five-tuple" (5-tuple) properties—source IP address, source port, destination IP address, destination port, and protocol—to select the hash value, and then chooses the best endpoint. However, with this setting, if someone uses different ports to connect to Global Accelerator, their connections might not be always routed to the same endpoint because the hash value changes.
     *
     * If you want a given client to always be routed to the same endpoint, set client affinity to `SOURCE_IP` instead. When you use the `SOURCE_IP` setting, Global Accelerator uses the "two-tuple" (2-tuple) properties— source (client) IP address and destination IP address—to select the hash value.
     *
     * The default value is `NONE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-clientaffinity
     */
    readonly clientAffinity?: string;
}
/**
 * A CloudFormation `AWS::GlobalAccelerator::Listener`
 *
 * The `AWS::GlobalAccelerator::Listener` resource is a Global Accelerator resource type that contains information about how you create a listener to process inbound connections from clients to an accelerator. Connections arrive to assigned static IP addresses on a port, port range, or list of port ranges that you specify.
 *
 * @cloudformationResource AWS::GlobalAccelerator::Listener
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html
 */
export declare class CfnListener extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::GlobalAccelerator::Listener";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListener;
    /**
     * The ARN of the listener, such as `arn:aws:globalaccelerator::012345678901:accelerator/1234abcd-abcd-1234-abcd-1234abcdefgh/listener/0123vxyz` .
     * @cloudformationAttribute ListenerArn
     */
    readonly attrListenerArn: string;
    /**
     * The Amazon Resource Name (ARN) of your accelerator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-acceleratorarn
     */
    acceleratorArn: string;
    /**
     * The list of port ranges for the connections from clients to the accelerator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-portranges
     */
    portRanges: Array<CfnListener.PortRangeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The protocol for the connections from clients to the accelerator.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-protocol
     */
    protocol: string;
    /**
     * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request. Client affinity gives you control over whether to always route each client to the same specific endpoint.
     *
     * AWS Global Accelerator uses a consistent-flow hashing algorithm to choose the optimal endpoint for a connection. If client affinity is `NONE` , Global Accelerator uses the "five-tuple" (5-tuple) properties—source IP address, source port, destination IP address, destination port, and protocol—to select the hash value, and then chooses the best endpoint. However, with this setting, if someone uses different ports to connect to Global Accelerator, their connections might not be always routed to the same endpoint because the hash value changes.
     *
     * If you want a given client to always be routed to the same endpoint, set client affinity to `SOURCE_IP` instead. When you use the `SOURCE_IP` setting, Global Accelerator uses the "two-tuple" (2-tuple) properties— source (client) IP address and destination IP address—to select the hash value.
     *
     * The default value is `NONE` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-globalaccelerator-listener.html#cfn-globalaccelerator-listener-clientaffinity
     */
    clientAffinity: string | undefined;
    /**
     * Create a new `AWS::GlobalAccelerator::Listener`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnListenerProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnListener {
    /**
     * A complex type for a range of ports for a listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-listener-portrange.html
     */
    interface PortRangeProperty {
        /**
         * The first port in the range of ports, inclusive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-listener-portrange.html#cfn-globalaccelerator-listener-portrange-fromport
         */
        readonly fromPort: number;
        /**
         * The last port in the range of ports, inclusive.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-globalaccelerator-listener-portrange.html#cfn-globalaccelerator-listener-portrange-toport
         */
        readonly toPort: number;
    }
}
