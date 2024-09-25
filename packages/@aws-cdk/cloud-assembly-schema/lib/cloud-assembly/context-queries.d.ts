import { Tag } from './metadata-schema';
/**
 * Identifier for the context provider
 */
export declare enum ContextProvider {
    /**
     * AMI provider
     */
    AMI_PROVIDER = "ami",
    /**
     * AZ provider
     */
    AVAILABILITY_ZONE_PROVIDER = "availability-zones",
    /**
     * Route53 Hosted Zone provider
     */
    HOSTED_ZONE_PROVIDER = "hosted-zone",
    /**
     * SSM Parameter Provider
     */
    SSM_PARAMETER_PROVIDER = "ssm",
    /**
     * VPC Provider
     */
    VPC_PROVIDER = "vpc-provider",
    /**
     * VPC Endpoint Service AZ Provider
     */
    ENDPOINT_SERVICE_AVAILABILITY_ZONE_PROVIDER = "endpoint-service-availability-zones",
    /**
     * Load balancer provider
     */
    LOAD_BALANCER_PROVIDER = "load-balancer",
    /**
     * Load balancer listener provider
     */
    LOAD_BALANCER_LISTENER_PROVIDER = "load-balancer-listener",
    /**
     * Security group provider
     */
    SECURITY_GROUP_PROVIDER = "security-group",
    /**
     * KMS Key Provider
     */
    KEY_PROVIDER = "key-provider",
    /**
     * A plugin provider (the actual plugin name will be in the properties)
     */
    PLUGIN = "plugin"
}
/**
 * Query to AMI context provider
 */
export interface AmiContextQuery {
    /**
     * Account to query
     */
    readonly account: string;
    /**
     * Region to query
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Owners to DescribeImages call
     *
     * @default - All owners
     */
    readonly owners?: string[];
    /**
     * Filters to DescribeImages call
     */
    readonly filters: {
        [key: string]: string[];
    };
}
/**
 * Query to availability zone context provider
 */
export interface AvailabilityZonesContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
}
/**
 * Query to hosted zone context provider
 */
export interface HostedZoneContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * The domain name e.g. example.com to lookup
     */
    readonly domainName: string;
    /**
     * True if the zone you want to find is a private hosted zone
     *
     * @default false
     */
    readonly privateZone?: boolean;
    /**
     * The VPC ID to that the private zone must be associated with
     *
     * If you provide VPC ID and privateZone is false, this will return no results
     * and raise an error.
     *
     * @default - Required if privateZone=true
     */
    readonly vpcId?: string;
}
/**
 * Query to SSM Parameter Context Provider
 */
export interface SSMParameterContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Parameter name to query
     */
    readonly parameterName: string;
}
/**
 * Query input for looking up a VPC
 */
export interface VpcContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Filters to apply to the VPC
     *
     * Filter parameters are the same as passed to DescribeVpcs.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_DescribeVpcs.html
     */
    readonly filter: {
        [key: string]: string;
    };
    /**
     * Whether to populate the subnetGroups field of the `VpcContextResponse`,
     * which contains potentially asymmetric subnet groups.
     *
     * @default false
     */
    readonly returnAsymmetricSubnets?: boolean;
    /**
     * Optional tag for subnet group name.
     * If not provided, we'll look at the aws-cdk:subnet-name tag.
     * If the subnet does not have the specified tag,
     * we'll use its type as the name.
     *
     * @default 'aws-cdk:subnet-name'
     */
    readonly subnetGroupNameTag?: string;
    /**
     * Whether to populate the `vpnGatewayId` field of the `VpcContextResponse`,
     * which contains the VPN Gateway ID, if one exists. You can explicitly
     * disable this in order to avoid the lookup if you know the VPC does not have
     * a VPN Gatway attached.
     *
     * @default true
     */
    readonly returnVpnGateways?: boolean;
}
/**
 * Query to endpoint service context provider
 */
export interface EndpointServiceAvailabilityZonesContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Query service name
     */
    readonly serviceName: string;
}
/**
 * Type of load balancer
 */
export declare enum LoadBalancerType {
    /**
     * Network load balancer
     */
    NETWORK = "network",
    /**
     * Application load balancer
     */
    APPLICATION = "application"
}
/**
 * Filters for selecting load balancers
 */
export interface LoadBalancerFilter {
    /**
     * Filter load balancers by their type
     */
    readonly loadBalancerType: LoadBalancerType;
    /**
     * Find by load balancer's ARN
     * @default - does not search by load balancer arn
     */
    readonly loadBalancerArn?: string;
    /**
     * Match load balancer tags
     * @default - does not match load balancers by tags
     */
    readonly loadBalancerTags?: Tag[];
}
/**
 * Query input for looking up a load balancer
 */
export interface LoadBalancerContextQuery extends LoadBalancerFilter {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
}
/**
 * The protocol for connections from clients to the load balancer
 */
export declare enum LoadBalancerListenerProtocol {
    /**
     * HTTP protocol
     */
    HTTP = "HTTP",
    /**
     * HTTPS protocol
     */
    HTTPS = "HTTPS",
    /**
     * TCP protocol
     */
    TCP = "TCP",
    /**
     * TLS protocol
     */
    TLS = "TLS",
    /**
     * UDP protocol
     * */
    UDP = "UDP",
    /**
     * TCP and UDP protocol
     * */
    TCP_UDP = "TCP_UDP"
}
/**
 * Query input for looking up a load balancer listener
 */
export interface LoadBalancerListenerContextQuery extends LoadBalancerFilter {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Find by listener's arn
     * @default - does not find by listener arn
     */
    readonly listenerArn?: string;
    /**
     * Filter by listener protocol
     * @default - does not filter by listener protocol
     */
    readonly listenerProtocol?: LoadBalancerListenerProtocol;
    /**
     * Filter listeners by listener port
     * @default - does not filter by a listener port
     */
    readonly listenerPort?: number;
}
/**
 * Query input for looking up a security group
 */
export interface SecurityGroupContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Security group id
     *
     * @default - None
     */
    readonly securityGroupId?: string;
    /**
     * Security group name
     *
     * @default - None
     */
    readonly securityGroupName?: string;
    /**
     * VPC ID
     *
     * @default - None
     */
    readonly vpcId?: string;
}
/**
 * Query input for looking up a KMS Key
 */
export interface KeyContextQuery {
    /**
     * Query account
     */
    readonly account: string;
    /**
     * Query region
     */
    readonly region: string;
    /**
     * The ARN of the role that should be used to look up the missing values
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * Alias name used to search the Key
     */
    readonly aliasName: string;
}
/**
 * Query input for plugins
 *
 * This alternate branch is necessary because it needs to be able to escape all type checking
 * we do on on the cloud assembly -- we cannot know the properties that will be used a priori.
 */
export interface PluginContextQuery {
    /**
     * The name of the plugin
     */
    readonly pluginName: string;
    /**
     * Arbitrary other arguments for the plugin.
     *
     * This index signature is not usable in non-TypeScript/JavaScript languages.
     *
     * @jsii ignore
     */
    [key: string]: any;
}
export type ContextQueryProperties = AmiContextQuery | AvailabilityZonesContextQuery | HostedZoneContextQuery | SSMParameterContextQuery | VpcContextQuery | EndpointServiceAvailabilityZonesContextQuery | LoadBalancerContextQuery | LoadBalancerListenerContextQuery | SecurityGroupContextQuery | KeyContextQuery | PluginContextQuery;
