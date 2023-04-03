import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnHttpNamespace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html
 */
export interface CfnHttpNamespaceProps {
    /**
     * The name that you want to assign to this namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html#cfn-servicediscovery-httpnamespace-name
     */
    readonly name: string;
    /**
     * A description for the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html#cfn-servicediscovery-httpnamespace-description
     */
    readonly description?: string;
    /**
     * The tags for the namespace. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html#cfn-servicediscovery-httpnamespace-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::ServiceDiscovery::HttpNamespace`
 *
 * The `HttpNamespace` resource is an AWS Cloud Map resource type that contains information about an HTTP namespace. Service instances that you register using an HTTP namespace can be discovered using a `DiscoverInstances` request but can't be discovered using DNS.
 *
 * For the current quota on the number of namespaces that you can create using the same AWS account, see [AWS Cloud Map quotas](https://docs.aws.amazon.com/cloud-map/latest/dg/cloud-map-limits.html) in the ** .
 *
 * @cloudformationResource AWS::ServiceDiscovery::HttpNamespace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html
 */
export declare class CfnHttpNamespace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceDiscovery::HttpNamespace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHttpNamespace;
    /**
     * The Amazon Resource Name (ARN) of the namespace, such as `arn:aws:service-discovery:us-east-1:123456789012:http-namespace/http-namespace-a1bzhi` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the namespace.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name that you want to assign to this namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html#cfn-servicediscovery-httpnamespace-name
     */
    name: string;
    /**
     * A description for the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html#cfn-servicediscovery-httpnamespace-description
     */
    description: string | undefined;
    /**
     * The tags for the namespace. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-httpnamespace.html#cfn-servicediscovery-httpnamespace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ServiceDiscovery::HttpNamespace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnHttpNamespaceProps);
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
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html
 */
export interface CfnInstanceProps {
    /**
     * A string map that contains the following information for the service that you specify in `ServiceId` :
     *
     * - The attributes that apply to the records that are defined in the service.
     * - For each attribute, the applicable value.
     *
     * Supported attribute keys include the following:
     *
     * - **AWS_ALIAS_DNS_NAME** - If you want AWS Cloud Map to create a Route 53 alias record that routes traffic to an Elastic Load Balancing load balancer, specify the DNS name that is associated with the load balancer. For information about how to get the DNS name, see [AliasTarget->DNSName](https://docs.aws.amazon.com/Route53/latest/APIReference/API_AliasTarget.html#Route53-Type-AliasTarget-DNSName) in the *Route 53 API Reference* .
     *
     * Note the following:
     *
     * - The configuration for the service that is specified by `ServiceId` must include settings for an `A` record, an `AAAA` record, or both.
     * - In the service that is specified by `ServiceId` , the value of `RoutingPolicy` must be `WEIGHTED` .
     * - If the service that is specified by `ServiceId` includes `HealthCheckConfig` settings, AWS Cloud Map will create the health check, but it won't associate the health check with the alias record.
     * - Auto naming currently doesn't support creating alias records that route traffic to AWS resources other than ELB load balancers.
     * - If you specify a value for `AWS_ALIAS_DNS_NAME` , don't specify values for any of the `AWS_INSTANCE` attributes.
     * - **AWS_EC2_INSTANCE_ID** - *HTTP namespaces only.* The Amazon EC2 instance ID for the instance. The `AWS_INSTANCE_IPV4` attribute contains the primary private IPv4 address. When creating resources with a type of [AWS::ServiceDiscovery::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html) , if the `AWS_EC2_INSTANCE_ID` attribute is specified, the only other attribute that can be specified is `AWS_INIT_HEALTH_STATUS` . After the resource has been created, the `AWS_INSTANCE_IPV4` attribute contains the primary private IPv4 address.
     * - **AWS_INIT_HEALTH_STATUS** - If the service configuration includes `HealthCheckCustomConfig` , when creating resources with a type of [AWS::ServiceDiscovery::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html) you can optionally use `AWS_INIT_HEALTH_STATUS` to specify the initial status of the custom health check, `HEALTHY` or `UNHEALTHY` . If you don't specify a value for `AWS_INIT_HEALTH_STATUS` , the initial status is `HEALTHY` . This attribute can only be used when creating resources and will not be seen on existing resources.
     * - **AWS_INSTANCE_CNAME** - If the service configuration includes a `CNAME` record, the domain name that you want Route 53 to return in response to DNS queries, for example, `example.com` .
     *
     * This value is required if the service specified by `ServiceId` includes settings for an `CNAME` record.
     * - **AWS_INSTANCE_IPV4** - If the service configuration includes an `A` record, the IPv4 address that you want Route 53 to return in response to DNS queries, for example, `192.0.2.44` .
     *
     * This value is required if the service specified by `ServiceId` includes settings for an `A` record. If the service includes settings for an `SRV` record, you must specify a value for `AWS_INSTANCE_IPV4` , `AWS_INSTANCE_IPV6` , or both.
     * - **AWS_INSTANCE_IPV6** - If the service configuration includes an `AAAA` record, the IPv6 address that you want Route 53 to return in response to DNS queries, for example, `2001:0db8:85a3:0000:0000:abcd:0001:2345` .
     *
     * This value is required if the service specified by `ServiceId` includes settings for an `AAAA` record. If the service includes settings for an `SRV` record, you must specify a value for `AWS_INSTANCE_IPV4` , `AWS_INSTANCE_IPV6` , or both.
     * - **AWS_INSTANCE_PORT** - If the service includes an `SRV` record, the value that you want Route 53 to return for the port.
     *
     * If the service includes `HealthCheckConfig` , the port on the endpoint that you want Route 53 to send requests to.
     *
     * This value is required if you specified settings for an `SRV` record or a Route 53 health check when you created the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html#cfn-servicediscovery-instance-instanceattributes
     */
    readonly instanceAttributes: any | cdk.IResolvable;
    /**
     * The ID of the service that you want to use for settings for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html#cfn-servicediscovery-instance-serviceid
     */
    readonly serviceId: string;
    /**
     * An identifier that you want to associate with the instance. Note the following:
     *
     * - If the service that's specified by `ServiceId` includes settings for an `SRV` record, the value of `InstanceId` is automatically included as part of the value for the `SRV` record. For more information, see [DnsRecord > Type](https://docs.aws.amazon.com/cloud-map/latest/api/API_DnsRecord.html#cloudmap-Type-DnsRecord-Type) .
     * - You can use this value to update an existing instance.
     * - To register a new instance, you must specify a value that's unique among instances that you register by using the same service.
     * - If you specify an existing `InstanceId` and `ServiceId` , AWS Cloud Map updates the existing DNS records, if any. If there's also an existing health check, AWS Cloud Map deletes the old health check and creates a new one.
     *
     * > The health check isn't deleted immediately, so it will still appear for a while if you submit a `ListHealthChecks` request, for example.
     *
     * > Do not include sensitive information in `InstanceId` if the namespace is discoverable by public DNS queries and any `Type` member of `DnsRecord` for the service contains `SRV` because the `InstanceId` is discoverable by public DNS queries.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html#cfn-servicediscovery-instance-instanceid
     */
    readonly instanceId?: string;
}
/**
 * A CloudFormation `AWS::ServiceDiscovery::Instance`
 *
 * A complex type that contains information about an instance that AWS Cloud Map creates when you submit a `RegisterInstance` request.
 *
 * @cloudformationResource AWS::ServiceDiscovery::Instance
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html
 */
export declare class CfnInstance extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceDiscovery::Instance";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance;
    /**
     * A string map that contains the following information for the service that you specify in `ServiceId` :
     *
     * - The attributes that apply to the records that are defined in the service.
     * - For each attribute, the applicable value.
     *
     * Supported attribute keys include the following:
     *
     * - **AWS_ALIAS_DNS_NAME** - If you want AWS Cloud Map to create a Route 53 alias record that routes traffic to an Elastic Load Balancing load balancer, specify the DNS name that is associated with the load balancer. For information about how to get the DNS name, see [AliasTarget->DNSName](https://docs.aws.amazon.com/Route53/latest/APIReference/API_AliasTarget.html#Route53-Type-AliasTarget-DNSName) in the *Route 53 API Reference* .
     *
     * Note the following:
     *
     * - The configuration for the service that is specified by `ServiceId` must include settings for an `A` record, an `AAAA` record, or both.
     * - In the service that is specified by `ServiceId` , the value of `RoutingPolicy` must be `WEIGHTED` .
     * - If the service that is specified by `ServiceId` includes `HealthCheckConfig` settings, AWS Cloud Map will create the health check, but it won't associate the health check with the alias record.
     * - Auto naming currently doesn't support creating alias records that route traffic to AWS resources other than ELB load balancers.
     * - If you specify a value for `AWS_ALIAS_DNS_NAME` , don't specify values for any of the `AWS_INSTANCE` attributes.
     * - **AWS_EC2_INSTANCE_ID** - *HTTP namespaces only.* The Amazon EC2 instance ID for the instance. The `AWS_INSTANCE_IPV4` attribute contains the primary private IPv4 address. When creating resources with a type of [AWS::ServiceDiscovery::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html) , if the `AWS_EC2_INSTANCE_ID` attribute is specified, the only other attribute that can be specified is `AWS_INIT_HEALTH_STATUS` . After the resource has been created, the `AWS_INSTANCE_IPV4` attribute contains the primary private IPv4 address.
     * - **AWS_INIT_HEALTH_STATUS** - If the service configuration includes `HealthCheckCustomConfig` , when creating resources with a type of [AWS::ServiceDiscovery::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html) you can optionally use `AWS_INIT_HEALTH_STATUS` to specify the initial status of the custom health check, `HEALTHY` or `UNHEALTHY` . If you don't specify a value for `AWS_INIT_HEALTH_STATUS` , the initial status is `HEALTHY` . This attribute can only be used when creating resources and will not be seen on existing resources.
     * - **AWS_INSTANCE_CNAME** - If the service configuration includes a `CNAME` record, the domain name that you want Route 53 to return in response to DNS queries, for example, `example.com` .
     *
     * This value is required if the service specified by `ServiceId` includes settings for an `CNAME` record.
     * - **AWS_INSTANCE_IPV4** - If the service configuration includes an `A` record, the IPv4 address that you want Route 53 to return in response to DNS queries, for example, `192.0.2.44` .
     *
     * This value is required if the service specified by `ServiceId` includes settings for an `A` record. If the service includes settings for an `SRV` record, you must specify a value for `AWS_INSTANCE_IPV4` , `AWS_INSTANCE_IPV6` , or both.
     * - **AWS_INSTANCE_IPV6** - If the service configuration includes an `AAAA` record, the IPv6 address that you want Route 53 to return in response to DNS queries, for example, `2001:0db8:85a3:0000:0000:abcd:0001:2345` .
     *
     * This value is required if the service specified by `ServiceId` includes settings for an `AAAA` record. If the service includes settings for an `SRV` record, you must specify a value for `AWS_INSTANCE_IPV4` , `AWS_INSTANCE_IPV6` , or both.
     * - **AWS_INSTANCE_PORT** - If the service includes an `SRV` record, the value that you want Route 53 to return for the port.
     *
     * If the service includes `HealthCheckConfig` , the port on the endpoint that you want Route 53 to send requests to.
     *
     * This value is required if you specified settings for an `SRV` record or a Route 53 health check when you created the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html#cfn-servicediscovery-instance-instanceattributes
     */
    instanceAttributes: any | cdk.IResolvable;
    /**
     * The ID of the service that you want to use for settings for the instance.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html#cfn-servicediscovery-instance-serviceid
     */
    serviceId: string;
    /**
     * An identifier that you want to associate with the instance. Note the following:
     *
     * - If the service that's specified by `ServiceId` includes settings for an `SRV` record, the value of `InstanceId` is automatically included as part of the value for the `SRV` record. For more information, see [DnsRecord > Type](https://docs.aws.amazon.com/cloud-map/latest/api/API_DnsRecord.html#cloudmap-Type-DnsRecord-Type) .
     * - You can use this value to update an existing instance.
     * - To register a new instance, you must specify a value that's unique among instances that you register by using the same service.
     * - If you specify an existing `InstanceId` and `ServiceId` , AWS Cloud Map updates the existing DNS records, if any. If there's also an existing health check, AWS Cloud Map deletes the old health check and creates a new one.
     *
     * > The health check isn't deleted immediately, so it will still appear for a while if you submit a `ListHealthChecks` request, for example.
     *
     * > Do not include sensitive information in `InstanceId` if the namespace is discoverable by public DNS queries and any `Type` member of `DnsRecord` for the service contains `SRV` because the `InstanceId` is discoverable by public DNS queries.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-instance.html#cfn-servicediscovery-instance-instanceid
     */
    instanceId: string | undefined;
    /**
     * Create a new `AWS::ServiceDiscovery::Instance`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps);
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
 * Properties for defining a `CfnPrivateDnsNamespace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html
 */
export interface CfnPrivateDnsNamespaceProps {
    /**
     * The name that you want to assign to this namespace. When you create a private DNS namespace, AWS Cloud Map automatically creates an Amazon Route 53 private hosted zone that has the same name as the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-name
     */
    readonly name: string;
    /**
     * The ID of the Amazon VPC that you want to associate the namespace with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-vpc
     */
    readonly vpc: string;
    /**
     * A description for the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-description
     */
    readonly description?: string;
    /**
     * Properties for the private DNS namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-properties
     */
    readonly properties?: CfnPrivateDnsNamespace.PropertiesProperty | cdk.IResolvable;
    /**
     * The tags for the namespace. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::ServiceDiscovery::PrivateDnsNamespace`
 *
 * Creates a private namespace based on DNS, which is visible only inside a specified Amazon VPC. The namespace defines your service naming scheme. For example, if you name your namespace `example.com` and name your service `backend` , the resulting DNS name for the service is `backend.example.com` . Service instances that are registered using a private DNS namespace can be discovered using either a `DiscoverInstances` request or using DNS. For the current quota on the number of namespaces that you can create using the same AWS account , see [AWS Cloud Map quotas](https://docs.aws.amazon.com/cloud-map/latest/dg/cloud-map-limits.html) in the *AWS Cloud Map Developer Guide* .
 *
 * @cloudformationResource AWS::ServiceDiscovery::PrivateDnsNamespace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html
 */
export declare class CfnPrivateDnsNamespace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceDiscovery::PrivateDnsNamespace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPrivateDnsNamespace;
    /**
     * The Amazon Resource Name (ARN) of the private namespace.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID for the Route 53 hosted zone that AWS Cloud Map creates when you create a namespace.
     * @cloudformationAttribute HostedZoneId
     */
    readonly attrHostedZoneId: string;
    /**
     * The ID of the private namespace.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name that you want to assign to this namespace. When you create a private DNS namespace, AWS Cloud Map automatically creates an Amazon Route 53 private hosted zone that has the same name as the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-name
     */
    name: string;
    /**
     * The ID of the Amazon VPC that you want to associate the namespace with.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-vpc
     */
    vpc: string;
    /**
     * A description for the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-description
     */
    description: string | undefined;
    /**
     * Properties for the private DNS namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-properties
     */
    properties: CfnPrivateDnsNamespace.PropertiesProperty | cdk.IResolvable | undefined;
    /**
     * The tags for the namespace. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-privatednsnamespace.html#cfn-servicediscovery-privatednsnamespace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ServiceDiscovery::PrivateDnsNamespace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPrivateDnsNamespaceProps);
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
export declare namespace CfnPrivateDnsNamespace {
    /**
     * DNS properties for the private DNS namespace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-privatednsnamespace-privatednspropertiesmutable.html
     */
    interface PrivateDnsPropertiesMutableProperty {
        /**
         * Fields for the Start of Authority (SOA) record for the hosted zone for the private DNS namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-privatednsnamespace-privatednspropertiesmutable.html#cfn-servicediscovery-privatednsnamespace-privatednspropertiesmutable-soa
         */
        readonly soa?: CfnPrivateDnsNamespace.SOAProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPrivateDnsNamespace {
    /**
     * Properties for the private DNS namespace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-privatednsnamespace-properties.html
     */
    interface PropertiesProperty {
        /**
         * DNS properties for the private DNS namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-privatednsnamespace-properties.html#cfn-servicediscovery-privatednsnamespace-properties-dnsproperties
         */
        readonly dnsProperties?: CfnPrivateDnsNamespace.PrivateDnsPropertiesMutableProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPrivateDnsNamespace {
    /**
     * Start of Authority (SOA) properties for a public or private DNS namespace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-privatednsnamespace-soa.html
     */
    interface SOAProperty {
        /**
         * The time to live (TTL) for purposes of negative caching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-privatednsnamespace-soa.html#cfn-servicediscovery-privatednsnamespace-soa-ttl
         */
        readonly ttl?: number;
    }
}
/**
 * Properties for defining a `CfnPublicDnsNamespace`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html
 */
export interface CfnPublicDnsNamespaceProps {
    /**
     * The name that you want to assign to this namespace.
     *
     * > Do not include sensitive information in the name. The name is publicly available using DNS queries.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-name
     */
    readonly name: string;
    /**
     * A description for the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-description
     */
    readonly description?: string;
    /**
     * Properties for the public DNS namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-properties
     */
    readonly properties?: CfnPublicDnsNamespace.PropertiesProperty | cdk.IResolvable;
    /**
     * The tags for the namespace. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::ServiceDiscovery::PublicDnsNamespace`
 *
 * Creates a public namespace based on DNS, which is visible on the internet. The namespace defines your service naming scheme. For example, if you name your namespace `example.com` and name your service `backend` , the resulting DNS name for the service is `backend.example.com` . You can discover instances that were registered with a public DNS namespace by using either a `DiscoverInstances` request or using DNS. For the current quota on the number of namespaces that you can create using the same AWS account , see [AWS Cloud Map quotas](https://docs.aws.amazon.com/cloud-map/latest/dg/cloud-map-limits.html) in the *AWS Cloud Map Developer Guide* .
 *
 * > The `CreatePublicDnsNamespace` API operation is not supported in the AWS GovCloud (US) Regions.
 *
 * @cloudformationResource AWS::ServiceDiscovery::PublicDnsNamespace
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html
 */
export declare class CfnPublicDnsNamespace extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceDiscovery::PublicDnsNamespace";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPublicDnsNamespace;
    /**
     * The Amazon Resource Name (ARN) of the public namespace.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID for the Route 53 hosted zone that AWS Cloud Map creates when you create a namespace.
     * @cloudformationAttribute HostedZoneId
     */
    readonly attrHostedZoneId: string;
    /**
     * The ID of the public namespace.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name that you want to assign to this namespace.
     *
     * > Do not include sensitive information in the name. The name is publicly available using DNS queries.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-name
     */
    name: string;
    /**
     * A description for the namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-description
     */
    description: string | undefined;
    /**
     * Properties for the public DNS namespace.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-properties
     */
    properties: CfnPublicDnsNamespace.PropertiesProperty | cdk.IResolvable | undefined;
    /**
     * The tags for the namespace. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-publicdnsnamespace.html#cfn-servicediscovery-publicdnsnamespace-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ServiceDiscovery::PublicDnsNamespace`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnPublicDnsNamespaceProps);
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
export declare namespace CfnPublicDnsNamespace {
    /**
     * Properties for the public DNS namespace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-publicdnsnamespace-properties.html
     */
    interface PropertiesProperty {
        /**
         * DNS properties for the public DNS namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-publicdnsnamespace-properties.html#cfn-servicediscovery-publicdnsnamespace-properties-dnsproperties
         */
        readonly dnsProperties?: CfnPublicDnsNamespace.PublicDnsPropertiesMutableProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPublicDnsNamespace {
    /**
     * DNS properties for the public DNS namespace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-publicdnsnamespace-publicdnspropertiesmutable.html
     */
    interface PublicDnsPropertiesMutableProperty {
        /**
         * Start of Authority (SOA) record for the hosted zone for the public DNS namespace.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-publicdnsnamespace-publicdnspropertiesmutable.html#cfn-servicediscovery-publicdnsnamespace-publicdnspropertiesmutable-soa
         */
        readonly soa?: CfnPublicDnsNamespace.SOAProperty | cdk.IResolvable;
    }
}
export declare namespace CfnPublicDnsNamespace {
    /**
     * Start of Authority (SOA) properties for a public or private DNS namespace.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-publicdnsnamespace-soa.html
     */
    interface SOAProperty {
        /**
         * The time to live (TTL) for purposes of negative caching.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-publicdnsnamespace-soa.html#cfn-servicediscovery-publicdnsnamespace-soa-ttl
         */
        readonly ttl?: number;
    }
}
/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html
 */
export interface CfnServiceProps {
    /**
     * The description of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-description
     */
    readonly description?: string;
    /**
     * A complex type that contains information about the Route 53 DNS records that you want AWS Cloud Map to create when you register an instance.
     *
     * > The record types of a service can only be changed by deleting the service and recreating it with a new `Dnsconfig` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-dnsconfig
     */
    readonly dnsConfig?: CfnService.DnsConfigProperty | cdk.IResolvable;
    /**
     * *Public DNS and HTTP namespaces only.* A complex type that contains settings for an optional health check. If you specify settings for a health check, AWS Cloud Map associates the health check with the records that you specify in `DnsConfig` .
     *
     * For information about the charges for health checks, see [Amazon Route 53 Pricing](https://docs.aws.amazon.com/route53/pricing/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-healthcheckconfig
     */
    readonly healthCheckConfig?: CfnService.HealthCheckConfigProperty | cdk.IResolvable;
    /**
     * A complex type that contains information about an optional custom health check.
     *
     * > If you specify a health check configuration, you can specify either `HealthCheckCustomConfig` or `HealthCheckConfig` but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-healthcheckcustomconfig
     */
    readonly healthCheckCustomConfig?: CfnService.HealthCheckCustomConfigProperty | cdk.IResolvable;
    /**
     * The name of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-name
     */
    readonly name?: string;
    /**
     * The ID of the namespace that was used to create the service.
     *
     * > You must specify a value for `NamespaceId` either for the service properties or for [DnsConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html) . Don't specify a value in both places.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-namespaceid
     */
    readonly namespaceId?: string;
    /**
     * The tags for the service. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * If present, specifies that the service instances are only discoverable using the `DiscoverInstances` API operation. No DNS records is registered for the service instances. The only valid value is `HTTP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-type
     */
    readonly type?: string;
}
/**
 * A CloudFormation `AWS::ServiceDiscovery::Service`
 *
 * A complex type that contains information about a service, which defines the configuration of the following entities:
 *
 * - For public and private DNS namespaces, one of the following combinations of DNS records in Amazon Route 53:
 *
 * - A
 * - AAAA
 * - A and AAAA
 * - SRV
 * - CNAME
 * - Optionally, a health check
 *
 * @cloudformationResource AWS::ServiceDiscovery::Service
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html
 */
export declare class CfnService extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ServiceDiscovery::Service";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnService;
    /**
     * The Amazon Resource Name (ARN) of the service.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The ID of the service.
     * @cloudformationAttribute Id
     */
    readonly attrId: string;
    /**
     * The name that you assigned to the service.
     * @cloudformationAttribute Name
     */
    readonly attrName: string;
    /**
     * The description of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-description
     */
    description: string | undefined;
    /**
     * A complex type that contains information about the Route 53 DNS records that you want AWS Cloud Map to create when you register an instance.
     *
     * > The record types of a service can only be changed by deleting the service and recreating it with a new `Dnsconfig` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-dnsconfig
     */
    dnsConfig: CfnService.DnsConfigProperty | cdk.IResolvable | undefined;
    /**
     * *Public DNS and HTTP namespaces only.* A complex type that contains settings for an optional health check. If you specify settings for a health check, AWS Cloud Map associates the health check with the records that you specify in `DnsConfig` .
     *
     * For information about the charges for health checks, see [Amazon Route 53 Pricing](https://docs.aws.amazon.com/route53/pricing/) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-healthcheckconfig
     */
    healthCheckConfig: CfnService.HealthCheckConfigProperty | cdk.IResolvable | undefined;
    /**
     * A complex type that contains information about an optional custom health check.
     *
     * > If you specify a health check configuration, you can specify either `HealthCheckCustomConfig` or `HealthCheckConfig` but not both.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-healthcheckcustomconfig
     */
    healthCheckCustomConfig: CfnService.HealthCheckCustomConfigProperty | cdk.IResolvable | undefined;
    /**
     * The name of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-name
     */
    name: string | undefined;
    /**
     * The ID of the namespace that was used to create the service.
     *
     * > You must specify a value for `NamespaceId` either for the service properties or for [DnsConfig](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html) . Don't specify a value in both places.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-namespaceid
     */
    namespaceId: string | undefined;
    /**
     * The tags for the service. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * If present, specifies that the service instances are only discoverable using the `DiscoverInstances` API operation. No DNS records is registered for the service instances. The only valid value is `HTTP` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html#cfn-servicediscovery-service-type
     */
    type: string | undefined;
    /**
     * Create a new `AWS::ServiceDiscovery::Service`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnServiceProps);
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
export declare namespace CfnService {
    /**
     * A complex type that contains information about the Amazon Route 53 DNS records that you want AWS Cloud Map to create when you register an instance.
     *
     * > The record types of a service can only be changed by deleting the service and recreating it with a new `Dnsconfig` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html
     */
    interface DnsConfigProperty {
        /**
         * An array that contains one `DnsRecord` object for each Route 53 DNS record that you want AWS Cloud Map to create when you register an instance.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html#cfn-servicediscovery-service-dnsconfig-dnsrecords
         */
        readonly dnsRecords: Array<CfnService.DnsRecordProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * The ID of the namespace to use for DNS configuration.
         *
         * > You must specify a value for `NamespaceId` either for `DnsConfig` or for the [service properties](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html) . Don't specify a value in both places.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html#cfn-servicediscovery-service-dnsconfig-namespaceid
         */
        readonly namespaceId?: string;
        /**
         * The routing policy that you want to apply to all Route 53 DNS records that AWS Cloud Map creates when you register an instance and specify this service.
         *
         * > If you want to use this service to register instances that create alias records, specify `WEIGHTED` for the routing policy.
         *
         * You can specify the following values:
         *
         * - **MULTIVALUE** - If you define a health check for the service and the health check is healthy, Route 53 returns the applicable value for up to eight instances.
         *
         * For example, suppose that the service includes configurations for one `A` record and a health check. You use the service to register 10 instances. Route 53 responds to DNS queries with IP addresses for up to eight healthy instances. If fewer than eight instances are healthy, Route 53 responds to every DNS query with the IP addresses for all of the healthy instances.
         *
         * If you don't define a health check for the service, Route 53 assumes that all instances are healthy and returns the values for up to eight instances.
         *
         * For more information about the multivalue routing policy, see [Multivalue Answer Routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-multivalue) in the *Route 53 Developer Guide* .
         * - **WEIGHTED** - Route 53 returns the applicable value from one randomly selected instance from among the instances that you registered using the same service. Currently, all records have the same weight, so you can't route more or less traffic to any instances.
         *
         * For example, suppose that the service includes configurations for one `A` record and a health check. You use the service to register 10 instances. Route 53 responds to DNS queries with the IP address for one randomly selected instance from among the healthy instances. If no instances are healthy, Route 53 responds to DNS queries as if all of the instances were healthy.
         *
         * If you don't define a health check for the service, Route 53 assumes that all instances are healthy and returns the applicable value for one randomly selected instance.
         *
         * For more information about the weighted routing policy, see [Weighted Routing](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html#routing-policy-weighted) in the *Route 53 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsconfig.html#cfn-servicediscovery-service-dnsconfig-routingpolicy
         */
        readonly routingPolicy?: string;
    }
}
export declare namespace CfnService {
    /**
     * A complex type that contains information about the Route 53 DNS records that you want AWS Cloud Map to create when you register an instance.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsrecord.html
     */
    interface DnsRecordProperty {
        /**
         * The amount of time, in seconds, that you want DNS resolvers to cache the settings for this record.
         *
         * > Alias records don't include a TTL because Route 53 uses the TTL for the AWS resource that an alias record routes traffic to. If you include the `AWS_ALIAS_DNS_NAME` attribute when you submit a [RegisterInstance](https://docs.aws.amazon.com/cloud-map/latest/api/API_RegisterInstance.html) request, the `TTL` value is ignored. Always specify a TTL for the service; you can use a service to register instances that create either alias or non-alias records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsrecord.html#cfn-servicediscovery-service-dnsrecord-ttl
         */
        readonly ttl: number;
        /**
         * The type of the resource, which indicates the type of value that Route 53 returns in response to DNS queries. You can specify values for `Type` in the following combinations:
         *
         * - `A`
         * - `AAAA`
         * - `A` and `AAAA`
         * - `SRV`
         * - `CNAME`
         *
         * If you want AWS Cloud Map to create a Route 53 alias record when you register an instance, specify `A` or `AAAA` for `Type` .
         *
         * You specify other settings, such as the IP address for `A` and `AAAA` records, when you register an instance. For more information, see [RegisterInstance](https://docs.aws.amazon.com/cloud-map/latest/api/API_RegisterInstance.html) .
         *
         * The following values are supported:
         *
         * - **A** - Route 53 returns the IP address of the resource in IPv4 format, such as 192.0.2.44.
         * - **AAAA** - Route 53 returns the IP address of the resource in IPv6 format, such as 2001:0db8:85a3:0000:0000:abcd:0001:2345.
         * - **CNAME** - Route 53 returns the domain name of the resource, such as www.example.com. Note the following:
         *
         * - You specify the domain name that you want to route traffic to when you register an instance. For more information, see [Attributes](https://docs.aws.amazon.com/cloud-map/latest/api/API_RegisterInstance.html#cloudmap-RegisterInstance-request-Attributes) in the topic [RegisterInstance](https://docs.aws.amazon.com/cloud-map/latest/api/API_RegisterInstance.html) .
         * - You must specify `WEIGHTED` for the value of `RoutingPolicy` .
         * - You can't specify both `CNAME` for `Type` and settings for `HealthCheckConfig` . If you do, the request will fail with an `InvalidInput` error.
         * - **SRV** - Route 53 returns the value for an `SRV` record. The value for an `SRV` record uses the following values:
         *
         * `priority weight port service-hostname`
         *
         * Note the following about the values:
         *
         * - The values of `priority` and `weight` are both set to `1` and can't be changed.
         * - The value of `port` comes from the value that you specify for the `AWS_INSTANCE_PORT` attribute when you submit a [RegisterInstance](https://docs.aws.amazon.com/cloud-map/latest/api/API_RegisterInstance.html) request.
         * - The value of `service-hostname` is a concatenation of the following values:
         *
         * - The value that you specify for `InstanceId` when you register an instance.
         * - The name of the service.
         * - The name of the namespace.
         *
         * For example, if the value of `InstanceId` is `test` , the name of the service is `backend` , and the name of the namespace is `example.com` , the value of `service-hostname` is:
         *
         * `test.backend.example.com`
         *
         * If you specify settings for an `SRV` record and if you specify values for `AWS_INSTANCE_IPV4` , `AWS_INSTANCE_IPV6` , or both in the `RegisterInstance` request, AWS Cloud Map automatically creates `A` and/or `AAAA` records that have the same name as the value of `service-hostname` in the `SRV` record. You can ignore these records.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-dnsrecord.html#cfn-servicediscovery-service-dnsrecord-type
         */
        readonly type: string;
    }
}
export declare namespace CfnService {
    /**
     * *Public DNS and HTTP namespaces only.* A complex type that contains settings for an optional health check. If you specify settings for a health check, AWS Cloud Map associates the health check with the records that you specify in `DnsConfig` .
     *
     * > If you specify a health check configuration, you can specify either `HealthCheckCustomConfig` or `HealthCheckConfig` but not both.
     *
     * Health checks are basic Route 53 health checks that monitor an AWS endpoint. For information about pricing for health checks, see [Amazon Route 53 Pricing](https://docs.aws.amazon.com/route53/pricing/) .
     *
     * Note the following about configuring health checks.
     *
     * - **A and AAAA records** - If `DnsConfig` includes configurations for both `A` and `AAAA` records, AWS Cloud Map creates a health check that uses the IPv4 address to check the health of the resource. If the endpoint tthat's specified by the IPv4 address is unhealthy, Route 53 considers both the `A` and `AAAA` records to be unhealthy.
     * - **CNAME records** - You can't specify settings for `HealthCheckConfig` when the `DNSConfig` includes `CNAME` for the value of `Type` . If you do, the `CreateService` request will fail with an `InvalidInput` error.
     * - **Request interval** - A Route 53 health checker in each health-checking AWS Region sends a health check request to an endpoint every 30 seconds. On average, your endpoint receives a health check request about every two seconds. However, health checkers don't coordinate with one another. Therefore, you might sometimes see several requests in one second that's followed by a few seconds with no health checks at all.
     * - **Health checking regions** - Health checkers perform checks from all Route 53 health-checking Regions. For a list of the current Regions, see [Regions](https://docs.aws.amazon.com/Route53/latest/APIReference/API_HealthCheckConfig.html#Route53-Type-HealthCheckConfig-Regions) .
     * - **Alias records** - When you register an instance, if you include the `AWS_ALIAS_DNS_NAME` attribute, AWS Cloud Map creates a Route 53 alias record. Note the following:
     *
     * - Route 53 automatically sets `EvaluateTargetHealth` to true for alias records. When `EvaluateTargetHealth` is true, the alias record inherits the health of the referenced AWS resource. such as an ELB load balancer. For more information, see [EvaluateTargetHealth](https://docs.aws.amazon.com/Route53/latest/APIReference/API_AliasTarget.html#Route53-Type-AliasTarget-EvaluateTargetHealth) .
     * - If you include `HealthCheckConfig` and then use the service to register an instance that creates an alias record, Route 53 doesn't create the health check.
     * - **Charges for health checks** - Health checks are basic Route 53 health checks that monitor an AWS endpoint. For information about pricing for health checks, see [Amazon Route 53 Pricing](https://docs.aws.amazon.com/route53/pricing/) .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-healthcheckconfig.html
     */
    interface HealthCheckConfigProperty {
        /**
         * The number of consecutive health checks that an endpoint must pass or fail for Route 53 to change the current status of the endpoint from unhealthy to healthy or the other way around. For more information, see [How Route 53 Determines Whether an Endpoint Is Healthy](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html) in the *Route 53 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-healthcheckconfig.html#cfn-servicediscovery-service-healthcheckconfig-failurethreshold
         */
        readonly failureThreshold?: number;
        /**
         * The path that you want Route 53 to request when performing health checks. The path can be any value that your endpoint returns an HTTP status code of a 2xx or 3xx format for when the endpoint is healthy. An example file is `/docs/route53-health-check.html` . Route 53 automatically adds the DNS name for the service. If you don't specify a value for `ResourcePath` , the default value is `/` .
         *
         * If you specify `TCP` for `Type` , you must *not* specify a value for `ResourcePath` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-healthcheckconfig.html#cfn-servicediscovery-service-healthcheckconfig-resourcepath
         */
        readonly resourcePath?: string;
        /**
         * The type of health check that you want to create, which indicates how Route 53 determines whether an endpoint is healthy.
         *
         * > You can't change the value of `Type` after you create a health check.
         *
         * You can create the following types of health checks:
         *
         * - *HTTP* : Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and waits for an HTTP status code of 200 or greater and less than 400.
         * - *HTTPS* : Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and waits for an HTTP status code of 200 or greater and less than 400.
         *
         * > If you specify HTTPS for the value of `Type` , the endpoint must support TLS v1.0 or later.
         * - *TCP* : Route 53 tries to establish a TCP connection.
         *
         * If you specify `TCP` for `Type` , don't specify a value for `ResourcePath` .
         *
         * For more information, see [How Route 53 Determines Whether an Endpoint Is Healthy](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html) in the *Route 53 Developer Guide* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-healthcheckconfig.html#cfn-servicediscovery-service-healthcheckconfig-type
         */
        readonly type: string;
    }
}
export declare namespace CfnService {
    /**
     * A complex type that contains information about an optional custom health check. A custom health check, which requires that you use a third-party health checker to evaluate the health of your resources, is useful in the following circumstances:
     *
     * - You can't use a health check that's defined by `HealthCheckConfig` because the resource isn't available over the internet. For example, you can use a custom health check when the instance is in an Amazon VPC. (To check the health of resources in a VPC, the health checker must also be in the VPC.)
     * - You want to use a third-party health checker regardless of where your resources are located.
     *
     * > If you specify a health check configuration, you can specify either `HealthCheckCustomConfig` or `HealthCheckConfig` but not both.
     *
     * To change the status of a custom health check, submit an `UpdateInstanceCustomHealthStatus` request. AWS Cloud Map doesn't monitor the status of the resource, it just keeps a record of the status specified in the most recent `UpdateInstanceCustomHealthStatus` request.
     *
     * Here's how custom health checks work:
     *
     * - You create a service.
     * - You register an instance.
     * - You configure a third-party health checker to monitor the resource that's associated with the new instance.
     *
     * > AWS Cloud Map doesn't check the health of the resource directly.
     * - The third-party health-checker determines that the resource is unhealthy and notifies your application.
     * - Your application submits an `UpdateInstanceCustomHealthStatus` request.
     * - AWS Cloud Map waits for 30 seconds.
     * - If another `UpdateInstanceCustomHealthStatus` request doesn't arrive during that time to change the status back to healthy, AWS Cloud Map stops routing traffic to the resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-healthcheckcustomconfig.html
     */
    interface HealthCheckCustomConfigProperty {
        /**
         * > This parameter is no longer supported and is always set to 1. AWS Cloud Map waits for approximately 30 seconds after receiving an `UpdateInstanceCustomHealthStatus` request before changing the status of the service instance.
         *
         * The number of 30-second intervals that you want AWS Cloud Map to wait after receiving an `UpdateInstanceCustomHealthStatus` request before it changes the health status of a service instance.
         *
         * Sending a second or subsequent `UpdateInstanceCustomHealthStatus` request with the same value before 30 seconds has passed doesn't accelerate the change. AWS Cloud Map still waits `30` seconds after the first request to make the change.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-servicediscovery-service-healthcheckcustomconfig.html#cfn-servicediscovery-service-healthcheckcustomconfig-failurethreshold
         */
        readonly failureThreshold?: number;
    }
}
