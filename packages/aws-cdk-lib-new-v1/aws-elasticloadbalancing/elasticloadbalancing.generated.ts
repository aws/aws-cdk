/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a Classic Load Balancer.
 *
 * You can specify the `AvailabilityZones` or `Subnets` property, but not both.
 *
 * If this resource has a public IP address and is also in a VPC that is defined in the same template, you must use the [DependsOn attribute](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html) to declare a dependency on the VPC-gateway attachment.
 *
 * @cloudformationResource AWS::ElasticLoadBalancing::LoadBalancer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html
 */
export class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancing::LoadBalancer";

  /**
   * Build a CfnLoadBalancer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoadBalancerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoadBalancer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the Route 53 hosted zone that is associated with the load balancer. Internal-facing load balancers don't use this value, use `DNSName` instead.
   *
   * @cloudformationAttribute CanonicalHostedZoneName
   */
  public readonly attrCanonicalHostedZoneName: string;

  /**
   * The ID of the Route 53 hosted zone name that is associated with the load balancer.
   *
   * @cloudformationAttribute CanonicalHostedZoneNameID
   */
  public readonly attrCanonicalHostedZoneNameId: string;

  /**
   * The DNS name for the load balancer.
   *
   * @cloudformationAttribute DNSName
   */
  public readonly attrDnsName: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the security group that you can use as part of your inbound rules for your load balancer's back-end instances.
   *
   * @cloudformationAttribute SourceSecurityGroup.GroupName
   */
  public readonly attrSourceSecurityGroupGroupName: string;

  /**
   * The owner of the source security group.
   *
   * @cloudformationAttribute SourceSecurityGroup.OwnerAlias
   */
  public readonly attrSourceSecurityGroupOwnerAlias: string;

  /**
   * Information about where and how access logs are stored for the load balancer.
   */
  public accessLoggingPolicy?: CfnLoadBalancer.AccessLoggingPolicyProperty | cdk.IResolvable;

  /**
   * Information about a policy for application-controlled session stickiness.
   */
  public appCookieStickinessPolicy?: Array<CfnLoadBalancer.AppCookieStickinessPolicyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Availability Zones for the load balancer. For load balancers in a VPC, specify `Subnets` instead.
   */
  public availabilityZones?: Array<string>;

  /**
   * If enabled, the load balancer allows existing requests to complete before the load balancer shifts traffic away from a deregistered or unhealthy instance.
   */
  public connectionDrainingPolicy?: CfnLoadBalancer.ConnectionDrainingPolicyProperty | cdk.IResolvable;

  /**
   * If enabled, the load balancer allows the connections to remain idle (no data is sent over the connection) for the specified duration.
   */
  public connectionSettings?: CfnLoadBalancer.ConnectionSettingsProperty | cdk.IResolvable;

  /**
   * If enabled, the load balancer routes the request traffic evenly across all instances regardless of the Availability Zones.
   */
  public crossZone?: boolean | cdk.IResolvable;

  /**
   * The health check settings to use when evaluating the health of your EC2 instances.
   */
  public healthCheck?: CfnLoadBalancer.HealthCheckProperty | cdk.IResolvable;

  /**
   * The IDs of the instances for the load balancer.
   */
  public instances?: Array<string>;

  /**
   * Information about a policy for duration-based session stickiness.
   */
  public lbCookieStickinessPolicy?: Array<cdk.IResolvable | CfnLoadBalancer.LBCookieStickinessPolicyProperty> | cdk.IResolvable;

  /**
   * The listeners for the load balancer. You can specify at most one listener per port.
   */
  public listeners: Array<cdk.IResolvable | CfnLoadBalancer.ListenersProperty> | cdk.IResolvable;

  /**
   * The name of the load balancer.
   */
  public loadBalancerName?: string;

  /**
   * The policies defined for your Classic Load Balancer.
   */
  public policies?: Array<cdk.IResolvable | CfnLoadBalancer.PoliciesProperty> | cdk.IResolvable;

  /**
   * The type of load balancer. Valid only for load balancers in a VPC.
   */
  public scheme?: string;

  /**
   * The security groups for the load balancer.
   */
  public securityGroups?: Array<string>;

  /**
   * The IDs of the subnets for the load balancer. You can specify at most one subnet per Availability Zone.
   */
  public subnets?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags associated with a load balancer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerProps) {
    super(scope, id, {
      "type": CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "listeners", this);

    this.attrCanonicalHostedZoneName = cdk.Token.asString(this.getAtt("CanonicalHostedZoneName", cdk.ResolutionTypeHint.STRING));
    this.attrCanonicalHostedZoneNameId = cdk.Token.asString(this.getAtt("CanonicalHostedZoneNameID", cdk.ResolutionTypeHint.STRING));
    this.attrDnsName = cdk.Token.asString(this.getAtt("DNSName", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrSourceSecurityGroupGroupName = cdk.Token.asString(this.getAtt("SourceSecurityGroup.GroupName", cdk.ResolutionTypeHint.STRING));
    this.attrSourceSecurityGroupOwnerAlias = cdk.Token.asString(this.getAtt("SourceSecurityGroup.OwnerAlias", cdk.ResolutionTypeHint.STRING));
    this.accessLoggingPolicy = props.accessLoggingPolicy;
    this.appCookieStickinessPolicy = props.appCookieStickinessPolicy;
    this.availabilityZones = props.availabilityZones;
    this.connectionDrainingPolicy = props.connectionDrainingPolicy;
    this.connectionSettings = props.connectionSettings;
    this.crossZone = props.crossZone;
    this.healthCheck = props.healthCheck;
    this.instances = props.instances;
    this.lbCookieStickinessPolicy = props.lbCookieStickinessPolicy;
    this.listeners = props.listeners;
    this.loadBalancerName = props.loadBalancerName;
    this.policies = props.policies;
    this.scheme = props.scheme;
    this.securityGroups = props.securityGroups;
    this.subnets = props.subnets;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticLoadBalancing::LoadBalancer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessLoggingPolicy": this.accessLoggingPolicy,
      "appCookieStickinessPolicy": this.appCookieStickinessPolicy,
      "availabilityZones": this.availabilityZones,
      "connectionDrainingPolicy": this.connectionDrainingPolicy,
      "connectionSettings": this.connectionSettings,
      "crossZone": this.crossZone,
      "healthCheck": this.healthCheck,
      "instances": this.instances,
      "lbCookieStickinessPolicy": this.lbCookieStickinessPolicy,
      "listeners": this.listeners,
      "loadBalancerName": this.loadBalancerName,
      "policies": this.policies,
      "scheme": this.scheme,
      "securityGroups": this.securityGroups,
      "subnets": this.subnets,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoadBalancerPropsToCloudFormation(props);
  }
}

export namespace CfnLoadBalancer {
  /**
   * Specifies where and how access logs are stored for your Classic Load Balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-accessloggingpolicy.html
   */
  export interface AccessLoggingPolicyProperty {
    /**
     * The interval for publishing the access logs. You can specify an interval of either 5 minutes or 60 minutes.
     *
     * Default: 60 minutes
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-accessloggingpolicy.html#cfn-elasticloadbalancing-loadbalancer-accessloggingpolicy-emitinterval
     */
    readonly emitInterval?: number;

    /**
     * Specifies whether access logs are enabled for the load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-accessloggingpolicy.html#cfn-elasticloadbalancing-loadbalancer-accessloggingpolicy-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The name of the Amazon S3 bucket where the access logs are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-accessloggingpolicy.html#cfn-elasticloadbalancing-loadbalancer-accessloggingpolicy-s3bucketname
     */
    readonly s3BucketName: string;

    /**
     * The logical hierarchy you created for your Amazon S3 bucket, for example `my-bucket-prefix/prod` .
     *
     * If the prefix is not provided, the log is placed at the root level of the bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-accessloggingpolicy.html#cfn-elasticloadbalancing-loadbalancer-accessloggingpolicy-s3bucketprefix
     */
    readonly s3BucketPrefix?: string;
  }

  /**
   * Specifies a policy for application-controlled session stickiness for your Classic Load Balancer.
   *
   * To associate a policy with a listener, use the [PolicyNames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames) property for the listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-appcookiestickinesspolicy.html
   */
  export interface AppCookieStickinessPolicyProperty {
    /**
     * The name of the application cookie used for stickiness.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-appcookiestickinesspolicy.html#cfn-elasticloadbalancing-loadbalancer-appcookiestickinesspolicy-cookiename
     */
    readonly cookieName: string;

    /**
     * The mnemonic name for the policy being created.
     *
     * The name must be unique within a set of policies for this load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-appcookiestickinesspolicy.html#cfn-elasticloadbalancing-loadbalancer-appcookiestickinesspolicy-policyname
     */
    readonly policyName: string;
  }

  /**
   * Specifies the connection draining settings for your Classic Load Balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-connectiondrainingpolicy.html
   */
  export interface ConnectionDrainingPolicyProperty {
    /**
     * Specifies whether connection draining is enabled for the load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-connectiondrainingpolicy.html#cfn-elasticloadbalancing-loadbalancer-connectiondrainingpolicy-enabled
     */
    readonly enabled: boolean | cdk.IResolvable;

    /**
     * The maximum time, in seconds, to keep the existing connections open before deregistering the instances.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-connectiondrainingpolicy.html#cfn-elasticloadbalancing-loadbalancer-connectiondrainingpolicy-timeout
     */
    readonly timeout?: number;
  }

  /**
   * Specifies the idle timeout value for your Classic Load Balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-connectionsettings.html
   */
  export interface ConnectionSettingsProperty {
    /**
     * The time, in seconds, that the connection is allowed to be idle (no data has been sent over the connection) before it is closed by the load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-connectionsettings.html#cfn-elasticloadbalancing-loadbalancer-connectionsettings-idletimeout
     */
    readonly idleTimeout: number;
  }

  /**
   * Specifies health check settings for your Classic Load Balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-healthcheck.html
   */
  export interface HealthCheckProperty {
    /**
     * The number of consecutive health checks successes required before moving the instance to the `Healthy` state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-healthcheck.html#cfn-elasticloadbalancing-loadbalancer-healthcheck-healthythreshold
     */
    readonly healthyThreshold: string;

    /**
     * The approximate interval, in seconds, between health checks of an individual instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-healthcheck.html#cfn-elasticloadbalancing-loadbalancer-healthcheck-interval
     */
    readonly interval: string;

    /**
     * The instance being checked.
     *
     * The protocol is either TCP, HTTP, HTTPS, or SSL. The range of valid ports is one (1) through 65535.
     *
     * TCP is the default, specified as a TCP: port pair, for example "TCP:5000". In this case, a health check simply attempts to open a TCP connection to the instance on the specified port. Failure to connect within the configured timeout is considered unhealthy.
     *
     * SSL is also specified as SSL: port pair, for example, SSL:5000.
     *
     * For HTTP/HTTPS, you must include a ping path in the string. HTTP is specified as a HTTP:port;/;PathToPing; grouping, for example "HTTP:80/weather/us/wa/seattle". In this case, a HTTP GET request is issued to the instance on the given port and path. Any answer other than "200 OK" within the timeout period is considered unhealthy.
     *
     * The total length of the HTTP ping target must be 1024 16-bit Unicode characters or less.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-healthcheck.html#cfn-elasticloadbalancing-loadbalancer-healthcheck-target
     */
    readonly target: string;

    /**
     * The amount of time, in seconds, during which no response means a failed health check.
     *
     * This value must be less than the `Interval` value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-healthcheck.html#cfn-elasticloadbalancing-loadbalancer-healthcheck-timeout
     */
    readonly timeout: string;

    /**
     * The number of consecutive health check failures required before moving the instance to the `Unhealthy` state.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-healthcheck.html#cfn-elasticloadbalancing-loadbalancer-healthcheck-unhealthythreshold
     */
    readonly unhealthyThreshold: string;
  }

  /**
   * Specifies a policy for duration-based session stickiness for your Classic Load Balancer.
   *
   * To associate a policy with a listener, use the [PolicyNames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames) property for the listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-lbcookiestickinesspolicy.html
   */
  export interface LBCookieStickinessPolicyProperty {
    /**
     * The time period, in seconds, after which the cookie should be considered stale.
     *
     * If this parameter is not specified, the stickiness session lasts for the duration of the browser session.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-lbcookiestickinesspolicy.html#cfn-elasticloadbalancing-loadbalancer-lbcookiestickinesspolicy-cookieexpirationperiod
     */
    readonly cookieExpirationPeriod?: string;

    /**
     * The name of the policy.
     *
     * This name must be unique within the set of policies for this load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-lbcookiestickinesspolicy.html#cfn-elasticloadbalancing-loadbalancer-lbcookiestickinesspolicy-policyname
     */
    readonly policyName?: string;
  }

  /**
   * Specifies a listener for your Classic Load Balancer.
   *
   * Modifying any property replaces the listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html
   */
  export interface ListenersProperty {
    /**
     * The port on which the instance is listening.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html#cfn-elasticloadbalancing-loadbalancer-listeners-instanceport
     */
    readonly instancePort: string;

    /**
     * The protocol to use for routing traffic to instances: HTTP, HTTPS, TCP, or SSL.
     *
     * If the front-end protocol is TCP or SSL, the back-end protocol must be TCP or SSL. If the front-end protocol is HTTP or HTTPS, the back-end protocol must be HTTP or HTTPS.
     *
     * If there is another listener with the same `InstancePort` whose `InstanceProtocol` is secure, (HTTPS or SSL), the listener's `InstanceProtocol` must also be secure.
     *
     * If there is another listener with the same `InstancePort` whose `InstanceProtocol` is HTTP or TCP, the listener's `InstanceProtocol` must be HTTP or TCP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html#cfn-elasticloadbalancing-loadbalancer-listeners-instanceprotocol
     */
    readonly instanceProtocol?: string;

    /**
     * The port on which the load balancer is listening.
     *
     * On EC2-VPC, you can specify any port from the range 1-65535. On EC2-Classic, you can specify any port from the following list: 25, 80, 443, 465, 587, 1024-65535.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html#cfn-elasticloadbalancing-loadbalancer-listeners-loadbalancerport
     */
    readonly loadBalancerPort: string;

    /**
     * The names of the policies to associate with the listener.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html#cfn-elasticloadbalancing-loadbalancer-listeners-policynames
     */
    readonly policyNames?: Array<string>;

    /**
     * The load balancer transport protocol to use for routing: HTTP, HTTPS, TCP, or SSL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html#cfn-elasticloadbalancing-loadbalancer-listeners-protocol
     */
    readonly protocol: string;

    /**
     * The Amazon Resource Name (ARN) of the server certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-listeners.html#cfn-elasticloadbalancing-loadbalancer-listeners-sslcertificateid
     */
    readonly sslCertificateId?: string;
  }

  /**
   * Specifies policies for your Classic Load Balancer.
   *
   * To associate policies with a listener, use the [PolicyNames](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-listener.html#cfn-ec2-elb-listener-policynames) property for the listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-policies.html
   */
  export interface PoliciesProperty {
    /**
     * The policy attributes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-policies.html#cfn-elasticloadbalancing-loadbalancer-policies-attributes
     */
    readonly attributes: Array<any | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The instance ports for the policy.
     *
     * Required only for some policy types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-policies.html#cfn-elasticloadbalancing-loadbalancer-policies-instanceports
     */
    readonly instancePorts?: Array<string>;

    /**
     * The load balancer ports for the policy.
     *
     * Required only for some policy types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-policies.html#cfn-elasticloadbalancing-loadbalancer-policies-loadbalancerports
     */
    readonly loadBalancerPorts?: Array<string>;

    /**
     * The name of the policy.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-policies.html#cfn-elasticloadbalancing-loadbalancer-policies-policyname
     */
    readonly policyName: string;

    /**
     * The name of the policy type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancing-loadbalancer-policies.html#cfn-elasticloadbalancing-loadbalancer-policies-policytype
     */
    readonly policyType: string;
  }
}

/**
 * Properties for defining a `CfnLoadBalancer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html
 */
export interface CfnLoadBalancerProps {
  /**
   * Information about where and how access logs are stored for the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-accessloggingpolicy
   */
  readonly accessLoggingPolicy?: CfnLoadBalancer.AccessLoggingPolicyProperty | cdk.IResolvable;

  /**
   * Information about a policy for application-controlled session stickiness.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-appcookiestickinesspolicy
   */
  readonly appCookieStickinessPolicy?: Array<CfnLoadBalancer.AppCookieStickinessPolicyProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Availability Zones for the load balancer. For load balancers in a VPC, specify `Subnets` instead.
   *
   * Update requires replacement if you did not previously specify an Availability Zone or if you are removing all Availability Zones. Otherwise, update requires no interruption.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-availabilityzones
   */
  readonly availabilityZones?: Array<string>;

  /**
   * If enabled, the load balancer allows existing requests to complete before the load balancer shifts traffic away from a deregistered or unhealthy instance.
   *
   * For more information, see [Configure connection draining](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-conn-drain.html) in the *User Guide for Classic Load Balancers* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-connectiondrainingpolicy
   */
  readonly connectionDrainingPolicy?: CfnLoadBalancer.ConnectionDrainingPolicyProperty | cdk.IResolvable;

  /**
   * If enabled, the load balancer allows the connections to remain idle (no data is sent over the connection) for the specified duration.
   *
   * By default, Elastic Load Balancing maintains a 60-second idle connection timeout for both front-end and back-end connections of your load balancer. For more information, see [Configure idle connection timeout](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/config-idle-timeout.html) in the *User Guide for Classic Load Balancers* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-connectionsettings
   */
  readonly connectionSettings?: CfnLoadBalancer.ConnectionSettingsProperty | cdk.IResolvable;

  /**
   * If enabled, the load balancer routes the request traffic evenly across all instances regardless of the Availability Zones.
   *
   * For more information, see [Configure cross-zone load balancing](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/enable-disable-crosszone-lb.html) in the *User Guide for Classic Load Balancers* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-crosszone
   */
  readonly crossZone?: boolean | cdk.IResolvable;

  /**
   * The health check settings to use when evaluating the health of your EC2 instances.
   *
   * Update requires replacement if you did not previously specify health check settings or if you are removing the health check settings. Otherwise, update requires no interruption.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-healthcheck
   */
  readonly healthCheck?: CfnLoadBalancer.HealthCheckProperty | cdk.IResolvable;

  /**
   * The IDs of the instances for the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-instances
   */
  readonly instances?: Array<string>;

  /**
   * Information about a policy for duration-based session stickiness.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-lbcookiestickinesspolicy
   */
  readonly lbCookieStickinessPolicy?: Array<cdk.IResolvable | CfnLoadBalancer.LBCookieStickinessPolicyProperty> | cdk.IResolvable;

  /**
   * The listeners for the load balancer. You can specify at most one listener per port.
   *
   * If you update the properties for a listener, AWS CloudFormation deletes the existing listener and creates a new one with the specified properties. While the new listener is being created, clients cannot connect to the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-listeners
   */
  readonly listeners: Array<cdk.IResolvable | CfnLoadBalancer.ListenersProperty> | cdk.IResolvable;

  /**
   * The name of the load balancer.
   *
   * This name must be unique within your set of load balancers for the region.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) . If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-loadbalancername
   */
  readonly loadBalancerName?: string;

  /**
   * The policies defined for your Classic Load Balancer.
   *
   * Specify only back-end server policies.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-policies
   */
  readonly policies?: Array<cdk.IResolvable | CfnLoadBalancer.PoliciesProperty> | cdk.IResolvable;

  /**
   * The type of load balancer. Valid only for load balancers in a VPC.
   *
   * If `Scheme` is `internet-facing` , the load balancer has a public DNS name that resolves to a public IP address.
   *
   * If `Scheme` is `internal` , the load balancer has a public DNS name that resolves to a private IP address.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-scheme
   */
  readonly scheme?: string;

  /**
   * The security groups for the load balancer.
   *
   * Valid only for load balancers in a VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-securitygroups
   */
  readonly securityGroups?: Array<string>;

  /**
   * The IDs of the subnets for the load balancer. You can specify at most one subnet per Availability Zone.
   *
   * Update requires replacement if you did not previously specify a subnet or if you are removing all subnets. Otherwise, update requires no interruption. To update to a different subnet in the current Availability Zone, you must first update to a subnet in a different Availability Zone, then update to the new subnet in the original Availability Zone.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-subnets
   */
  readonly subnets?: Array<string>;

  /**
   * The tags associated with a load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancing-loadbalancer.html#cfn-elasticloadbalancing-loadbalancer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AccessLoggingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLoggingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerAccessLoggingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emitInterval", cdk.validateNumber)(properties.emitInterval));
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.requiredValidator)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3BucketName", cdk.validateString)(properties.s3BucketName));
  errors.collect(cdk.propertyValidator("s3BucketPrefix", cdk.validateString)(properties.s3BucketPrefix));
  return errors.wrap("supplied properties not correct for \"AccessLoggingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerAccessLoggingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerAccessLoggingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "EmitInterval": cdk.numberToCloudFormation(properties.emitInterval),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "S3BucketName": cdk.stringToCloudFormation(properties.s3BucketName),
    "S3BucketPrefix": cdk.stringToCloudFormation(properties.s3BucketPrefix)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerAccessLoggingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.AccessLoggingPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.AccessLoggingPolicyProperty>();
  ret.addPropertyResult("emitInterval", "EmitInterval", (properties.EmitInterval != null ? cfn_parse.FromCloudFormation.getNumber(properties.EmitInterval) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("s3BucketName", "S3BucketName", (properties.S3BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketName) : undefined));
  ret.addPropertyResult("s3BucketPrefix", "S3BucketPrefix", (properties.S3BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.S3BucketPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppCookieStickinessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AppCookieStickinessPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerAppCookieStickinessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookieName", cdk.requiredValidator)(properties.cookieName));
  errors.collect(cdk.propertyValidator("cookieName", cdk.validateString)(properties.cookieName));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"AppCookieStickinessPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerAppCookieStickinessPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerAppCookieStickinessPolicyPropertyValidator(properties).assertSuccess();
  return {
    "CookieName": cdk.stringToCloudFormation(properties.cookieName),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerAppCookieStickinessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.AppCookieStickinessPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.AppCookieStickinessPolicyProperty>();
  ret.addPropertyResult("cookieName", "CookieName", (properties.CookieName != null ? cfn_parse.FromCloudFormation.getString(properties.CookieName) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionDrainingPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionDrainingPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerConnectionDrainingPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.requiredValidator)(properties.enabled));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  return errors.wrap("supplied properties not correct for \"ConnectionDrainingPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerConnectionDrainingPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerConnectionDrainingPolicyPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Timeout": cdk.numberToCloudFormation(properties.timeout)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerConnectionDrainingPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.ConnectionDrainingPolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.ConnectionDrainingPolicyProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConnectionSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `ConnectionSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerConnectionSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("idleTimeout", cdk.requiredValidator)(properties.idleTimeout));
  errors.collect(cdk.propertyValidator("idleTimeout", cdk.validateNumber)(properties.idleTimeout));
  return errors.wrap("supplied properties not correct for \"ConnectionSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerConnectionSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerConnectionSettingsPropertyValidator(properties).assertSuccess();
  return {
    "IdleTimeout": cdk.numberToCloudFormation(properties.idleTimeout)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerConnectionSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.ConnectionSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.ConnectionSettingsProperty>();
  ret.addPropertyResult("idleTimeout", "IdleTimeout", (properties.IdleTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleTimeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HealthCheckProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerHealthCheckPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.requiredValidator)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.validateString)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("interval", cdk.requiredValidator)(properties.interval));
  errors.collect(cdk.propertyValidator("interval", cdk.validateString)(properties.interval));
  errors.collect(cdk.propertyValidator("target", cdk.requiredValidator)(properties.target));
  errors.collect(cdk.propertyValidator("target", cdk.validateString)(properties.target));
  errors.collect(cdk.propertyValidator("timeout", cdk.requiredValidator)(properties.timeout));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateString)(properties.timeout));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.requiredValidator)(properties.unhealthyThreshold));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.validateString)(properties.unhealthyThreshold));
  return errors.wrap("supplied properties not correct for \"HealthCheckProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerHealthCheckPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerHealthCheckPropertyValidator(properties).assertSuccess();
  return {
    "HealthyThreshold": cdk.stringToCloudFormation(properties.healthyThreshold),
    "Interval": cdk.stringToCloudFormation(properties.interval),
    "Target": cdk.stringToCloudFormation(properties.target),
    "Timeout": cdk.stringToCloudFormation(properties.timeout),
    "UnhealthyThreshold": cdk.stringToCloudFormation(properties.unhealthyThreshold)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerHealthCheckPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.HealthCheckProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.HealthCheckProperty>();
  ret.addPropertyResult("healthyThreshold", "HealthyThreshold", (properties.HealthyThreshold != null ? cfn_parse.FromCloudFormation.getString(properties.HealthyThreshold) : undefined));
  ret.addPropertyResult("interval", "Interval", (properties.Interval != null ? cfn_parse.FromCloudFormation.getString(properties.Interval) : undefined));
  ret.addPropertyResult("target", "Target", (properties.Target != null ? cfn_parse.FromCloudFormation.getString(properties.Target) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getString(properties.Timeout) : undefined));
  ret.addPropertyResult("unhealthyThreshold", "UnhealthyThreshold", (properties.UnhealthyThreshold != null ? cfn_parse.FromCloudFormation.getString(properties.UnhealthyThreshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LBCookieStickinessPolicyProperty`
 *
 * @param properties - the TypeScript properties of a `LBCookieStickinessPolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerLBCookieStickinessPolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookieExpirationPeriod", cdk.validateString)(properties.cookieExpirationPeriod));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  return errors.wrap("supplied properties not correct for \"LBCookieStickinessPolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerLBCookieStickinessPolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerLBCookieStickinessPolicyPropertyValidator(properties).assertSuccess();
  return {
    "CookieExpirationPeriod": cdk.stringToCloudFormation(properties.cookieExpirationPeriod),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerLBCookieStickinessPolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoadBalancer.LBCookieStickinessPolicyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.LBCookieStickinessPolicyProperty>();
  ret.addPropertyResult("cookieExpirationPeriod", "CookieExpirationPeriod", (properties.CookieExpirationPeriod != null ? cfn_parse.FromCloudFormation.getString(properties.CookieExpirationPeriod) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ListenersProperty`
 *
 * @param properties - the TypeScript properties of a `ListenersProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerListenersPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("instancePort", cdk.requiredValidator)(properties.instancePort));
  errors.collect(cdk.propertyValidator("instancePort", cdk.validateString)(properties.instancePort));
  errors.collect(cdk.propertyValidator("instanceProtocol", cdk.validateString)(properties.instanceProtocol));
  errors.collect(cdk.propertyValidator("loadBalancerPort", cdk.requiredValidator)(properties.loadBalancerPort));
  errors.collect(cdk.propertyValidator("loadBalancerPort", cdk.validateString)(properties.loadBalancerPort));
  errors.collect(cdk.propertyValidator("policyNames", cdk.listValidator(cdk.validateString))(properties.policyNames));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("sslCertificateId", cdk.validateString)(properties.sslCertificateId));
  return errors.wrap("supplied properties not correct for \"ListenersProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerListenersPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerListenersPropertyValidator(properties).assertSuccess();
  return {
    "InstancePort": cdk.stringToCloudFormation(properties.instancePort),
    "InstanceProtocol": cdk.stringToCloudFormation(properties.instanceProtocol),
    "LoadBalancerPort": cdk.stringToCloudFormation(properties.loadBalancerPort),
    "PolicyNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.policyNames),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "SSLCertificateId": cdk.stringToCloudFormation(properties.sslCertificateId)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerListenersPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoadBalancer.ListenersProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.ListenersProperty>();
  ret.addPropertyResult("instancePort", "InstancePort", (properties.InstancePort != null ? cfn_parse.FromCloudFormation.getString(properties.InstancePort) : undefined));
  ret.addPropertyResult("instanceProtocol", "InstanceProtocol", (properties.InstanceProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceProtocol) : undefined));
  ret.addPropertyResult("loadBalancerPort", "LoadBalancerPort", (properties.LoadBalancerPort != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerPort) : undefined));
  ret.addPropertyResult("policyNames", "PolicyNames", (properties.PolicyNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PolicyNames) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("sslCertificateId", "SSLCertificateId", (properties.SSLCertificateId != null ? cfn_parse.FromCloudFormation.getString(properties.SSLCertificateId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PoliciesProperty`
 *
 * @param properties - the TypeScript properties of a `PoliciesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerPoliciesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(cdk.validateObject))(properties.attributes));
  errors.collect(cdk.propertyValidator("instancePorts", cdk.listValidator(cdk.validateString))(properties.instancePorts));
  errors.collect(cdk.propertyValidator("loadBalancerPorts", cdk.listValidator(cdk.validateString))(properties.loadBalancerPorts));
  errors.collect(cdk.propertyValidator("policyName", cdk.requiredValidator)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyName", cdk.validateString)(properties.policyName));
  errors.collect(cdk.propertyValidator("policyType", cdk.requiredValidator)(properties.policyType));
  errors.collect(cdk.propertyValidator("policyType", cdk.validateString)(properties.policyType));
  return errors.wrap("supplied properties not correct for \"PoliciesProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerPoliciesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerPoliciesPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.listMapper(cdk.objectToCloudFormation)(properties.attributes),
    "InstancePorts": cdk.listMapper(cdk.stringToCloudFormation)(properties.instancePorts),
    "LoadBalancerPorts": cdk.listMapper(cdk.stringToCloudFormation)(properties.loadBalancerPorts),
    "PolicyName": cdk.stringToCloudFormation(properties.policyName),
    "PolicyType": cdk.stringToCloudFormation(properties.policyType)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerPoliciesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoadBalancer.PoliciesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.PoliciesProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.Attributes) : undefined));
  ret.addPropertyResult("instancePorts", "InstancePorts", (properties.InstancePorts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.InstancePorts) : undefined));
  ret.addPropertyResult("loadBalancerPorts", "LoadBalancerPorts", (properties.LoadBalancerPorts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LoadBalancerPorts) : undefined));
  ret.addPropertyResult("policyName", "PolicyName", (properties.PolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyName) : undefined));
  ret.addPropertyResult("policyType", "PolicyType", (properties.PolicyType != null ? cfn_parse.FromCloudFormation.getString(properties.PolicyType) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLoadBalancerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLoggingPolicy", CfnLoadBalancerAccessLoggingPolicyPropertyValidator)(properties.accessLoggingPolicy));
  errors.collect(cdk.propertyValidator("appCookieStickinessPolicy", cdk.listValidator(CfnLoadBalancerAppCookieStickinessPolicyPropertyValidator))(properties.appCookieStickinessPolicy));
  errors.collect(cdk.propertyValidator("availabilityZones", cdk.listValidator(cdk.validateString))(properties.availabilityZones));
  errors.collect(cdk.propertyValidator("connectionDrainingPolicy", CfnLoadBalancerConnectionDrainingPolicyPropertyValidator)(properties.connectionDrainingPolicy));
  errors.collect(cdk.propertyValidator("connectionSettings", CfnLoadBalancerConnectionSettingsPropertyValidator)(properties.connectionSettings));
  errors.collect(cdk.propertyValidator("crossZone", cdk.validateBoolean)(properties.crossZone));
  errors.collect(cdk.propertyValidator("healthCheck", CfnLoadBalancerHealthCheckPropertyValidator)(properties.healthCheck));
  errors.collect(cdk.propertyValidator("instances", cdk.listValidator(cdk.validateString))(properties.instances));
  errors.collect(cdk.propertyValidator("lbCookieStickinessPolicy", cdk.listValidator(CfnLoadBalancerLBCookieStickinessPolicyPropertyValidator))(properties.lbCookieStickinessPolicy));
  errors.collect(cdk.propertyValidator("listeners", cdk.requiredValidator)(properties.listeners));
  errors.collect(cdk.propertyValidator("listeners", cdk.listValidator(CfnLoadBalancerListenersPropertyValidator))(properties.listeners));
  errors.collect(cdk.propertyValidator("loadBalancerName", cdk.validateString)(properties.loadBalancerName));
  errors.collect(cdk.propertyValidator("policies", cdk.listValidator(CfnLoadBalancerPoliciesPropertyValidator))(properties.policies));
  errors.collect(cdk.propertyValidator("scheme", cdk.validateString)(properties.scheme));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLoadBalancerProps\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerPropsValidator(properties).assertSuccess();
  return {
    "AccessLoggingPolicy": convertCfnLoadBalancerAccessLoggingPolicyPropertyToCloudFormation(properties.accessLoggingPolicy),
    "AppCookieStickinessPolicy": cdk.listMapper(convertCfnLoadBalancerAppCookieStickinessPolicyPropertyToCloudFormation)(properties.appCookieStickinessPolicy),
    "AvailabilityZones": cdk.listMapper(cdk.stringToCloudFormation)(properties.availabilityZones),
    "ConnectionDrainingPolicy": convertCfnLoadBalancerConnectionDrainingPolicyPropertyToCloudFormation(properties.connectionDrainingPolicy),
    "ConnectionSettings": convertCfnLoadBalancerConnectionSettingsPropertyToCloudFormation(properties.connectionSettings),
    "CrossZone": cdk.booleanToCloudFormation(properties.crossZone),
    "HealthCheck": convertCfnLoadBalancerHealthCheckPropertyToCloudFormation(properties.healthCheck),
    "Instances": cdk.listMapper(cdk.stringToCloudFormation)(properties.instances),
    "LBCookieStickinessPolicy": cdk.listMapper(convertCfnLoadBalancerLBCookieStickinessPolicyPropertyToCloudFormation)(properties.lbCookieStickinessPolicy),
    "Listeners": cdk.listMapper(convertCfnLoadBalancerListenersPropertyToCloudFormation)(properties.listeners),
    "LoadBalancerName": cdk.stringToCloudFormation(properties.loadBalancerName),
    "Policies": cdk.listMapper(convertCfnLoadBalancerPoliciesPropertyToCloudFormation)(properties.policies),
    "Scheme": cdk.stringToCloudFormation(properties.scheme),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerProps>();
  ret.addPropertyResult("accessLoggingPolicy", "AccessLoggingPolicy", (properties.AccessLoggingPolicy != null ? CfnLoadBalancerAccessLoggingPolicyPropertyFromCloudFormation(properties.AccessLoggingPolicy) : undefined));
  ret.addPropertyResult("appCookieStickinessPolicy", "AppCookieStickinessPolicy", (properties.AppCookieStickinessPolicy != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerAppCookieStickinessPolicyPropertyFromCloudFormation)(properties.AppCookieStickinessPolicy) : undefined));
  ret.addPropertyResult("availabilityZones", "AvailabilityZones", (properties.AvailabilityZones != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AvailabilityZones) : undefined));
  ret.addPropertyResult("connectionDrainingPolicy", "ConnectionDrainingPolicy", (properties.ConnectionDrainingPolicy != null ? CfnLoadBalancerConnectionDrainingPolicyPropertyFromCloudFormation(properties.ConnectionDrainingPolicy) : undefined));
  ret.addPropertyResult("connectionSettings", "ConnectionSettings", (properties.ConnectionSettings != null ? CfnLoadBalancerConnectionSettingsPropertyFromCloudFormation(properties.ConnectionSettings) : undefined));
  ret.addPropertyResult("crossZone", "CrossZone", (properties.CrossZone != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CrossZone) : undefined));
  ret.addPropertyResult("healthCheck", "HealthCheck", (properties.HealthCheck != null ? CfnLoadBalancerHealthCheckPropertyFromCloudFormation(properties.HealthCheck) : undefined));
  ret.addPropertyResult("instances", "Instances", (properties.Instances != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Instances) : undefined));
  ret.addPropertyResult("lbCookieStickinessPolicy", "LBCookieStickinessPolicy", (properties.LBCookieStickinessPolicy != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerLBCookieStickinessPolicyPropertyFromCloudFormation)(properties.LBCookieStickinessPolicy) : undefined));
  ret.addPropertyResult("listeners", "Listeners", (properties.Listeners != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerListenersPropertyFromCloudFormation)(properties.Listeners) : undefined));
  ret.addPropertyResult("loadBalancerName", "LoadBalancerName", (properties.LoadBalancerName != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName) : undefined));
  ret.addPropertyResult("policies", "Policies", (properties.Policies != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerPoliciesPropertyFromCloudFormation)(properties.Policies) : undefined));
  ret.addPropertyResult("scheme", "Scheme", (properties.Scheme != null ? cfn_parse.FromCloudFormation.getString(properties.Scheme) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}