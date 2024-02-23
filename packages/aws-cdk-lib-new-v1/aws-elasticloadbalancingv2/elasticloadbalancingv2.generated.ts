/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a listener for an Application Load Balancer, Network Load Balancer, or Gateway Load Balancer.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::Listener
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html
 */
export class CfnListener extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::Listener";

  /**
   * Build a CfnListener from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListener {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnListenerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnListener(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the listener.
   *
   * @cloudformationAttribute ListenerArn
   */
  public readonly attrListenerArn: string;

  /**
   * [TLS listener] The name of the Application-Layer Protocol Negotiation (ALPN) policy.
   */
  public alpnPolicy?: Array<string>;

  /**
   * The default SSL server certificate for a secure listener.
   */
  public certificates?: Array<CfnListener.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The actions for the default rule. You cannot define a condition for a default rule.
   */
  public defaultActions: Array<CfnListener.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the load balancer.
   */
  public loadBalancerArn: string;

  /**
   * The mutual authentication configuration information.
   */
  public mutualAuthentication?: cdk.IResolvable | CfnListener.MutualAuthenticationProperty;

  /**
   * The port on which the load balancer is listening.
   */
  public port?: number;

  /**
   * The protocol for connections from clients to the load balancer.
   */
  public protocol?: string;

  /**
   * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported.
   */
  public sslPolicy?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnListenerProps) {
    super(scope, id, {
      "type": CfnListener.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "defaultActions", this);
    cdk.requireProperty(props, "loadBalancerArn", this);

    this.attrListenerArn = cdk.Token.asString(this.getAtt("ListenerArn", cdk.ResolutionTypeHint.STRING));
    this.alpnPolicy = props.alpnPolicy;
    this.certificates = props.certificates;
    this.defaultActions = props.defaultActions;
    this.loadBalancerArn = props.loadBalancerArn;
    this.mutualAuthentication = props.mutualAuthentication;
    this.port = props.port;
    this.protocol = props.protocol;
    this.sslPolicy = props.sslPolicy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alpnPolicy": this.alpnPolicy,
      "certificates": this.certificates,
      "defaultActions": this.defaultActions,
      "loadBalancerArn": this.loadBalancerArn,
      "mutualAuthentication": this.mutualAuthentication,
      "port": this.port,
      "protocol": this.protocol,
      "sslPolicy": this.sslPolicy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnListener.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnListenerPropsToCloudFormation(props);
  }
}

export namespace CfnListener {
  /**
   * Specifies an action for a listener rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html
   */
  export interface ActionProperty {
    /**
     * [HTTPS listeners] Information for using Amazon Cognito to authenticate users.
     *
     * Specify only when `Type` is `authenticate-cognito` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-authenticatecognitoconfig
     */
    readonly authenticateCognitoConfig?: CfnListener.AuthenticateCognitoConfigProperty | cdk.IResolvable;

    /**
     * [HTTPS listeners] Information about an identity provider that is compliant with OpenID Connect (OIDC).
     *
     * Specify only when `Type` is `authenticate-oidc` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-authenticateoidcconfig
     */
    readonly authenticateOidcConfig?: CfnListener.AuthenticateOidcConfigProperty | cdk.IResolvable;

    /**
     * [Application Load Balancer] Information for creating an action that returns a custom HTTP response.
     *
     * Specify only when `Type` is `fixed-response` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-fixedresponseconfig
     */
    readonly fixedResponseConfig?: CfnListener.FixedResponseConfigProperty | cdk.IResolvable;

    /**
     * Information for creating an action that distributes requests among one or more target groups.
     *
     * For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-forwardconfig
     */
    readonly forwardConfig?: CfnListener.ForwardConfigProperty | cdk.IResolvable;

    /**
     * The order for the action.
     *
     * This value is required for rules with multiple actions. The action with the lowest value for order is performed first.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-order
     */
    readonly order?: number;

    /**
     * [Application Load Balancer] Information for creating a redirect action.
     *
     * Specify only when `Type` is `redirect` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-redirectconfig
     */
    readonly redirectConfig?: cdk.IResolvable | CfnListener.RedirectConfigProperty;

    /**
     * The Amazon Resource Name (ARN) of the target group.
     *
     * Specify only when `Type` is `forward` and you want to route to a single target group. To route to one or more target groups, use `ForwardConfig` instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-targetgrouparn
     */
    readonly targetGroupArn?: string;

    /**
     * The type of action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-type
     */
    readonly type: string;
  }

  /**
   * Specifies information required when returning a custom HTTP response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html
   */
  export interface FixedResponseConfigProperty {
    /**
     * The content type.
     *
     * Valid Values: text/plain | text/css | text/html | application/javascript | application/json
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listener-fixedresponseconfig-contenttype
     */
    readonly contentType?: string;

    /**
     * The message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listener-fixedresponseconfig-messagebody
     */
    readonly messageBody?: string;

    /**
     * The HTTP response code (2XX, 4XX, or 5XX).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listener-fixedresponseconfig-statuscode
     */
    readonly statusCode: string;
  }

  /**
   * Specifies information required when integrating with Amazon Cognito to authenticate users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html
   */
  export interface AuthenticateCognitoConfigProperty {
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-authenticationrequestextraparams
     */
    readonly authenticationRequestExtraParams?: cdk.IResolvable | Record<string, string>;

    /**
     * The behavior if the user is not authenticated. The following are possible values:.
     *
     * - deny `` - Return an HTTP 401 Unauthorized error.
     * - allow `` - Allow the request to be forwarded to the target.
     * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-onunauthenticatedrequest
     */
    readonly onUnauthenticatedRequest?: string;

    /**
     * The set of user claims to be requested from the IdP. The default is `openid` .
     *
     * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-scope
     */
    readonly scope?: string;

    /**
     * The name of the cookie used to maintain session information.
     *
     * The default is AWSELBAuthSessionCookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-sessioncookiename
     */
    readonly sessionCookieName?: string;

    /**
     * The maximum duration of the authentication session, in seconds.
     *
     * The default is 604800 seconds (7 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-sessiontimeout
     */
    readonly sessionTimeout?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Cognito user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-userpoolarn
     */
    readonly userPoolArn: string;

    /**
     * The ID of the Amazon Cognito user pool client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-userpoolclientid
     */
    readonly userPoolClientId: string;

    /**
     * The domain prefix or fully-qualified domain name of the Amazon Cognito user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-userpooldomain
     */
    readonly userPoolDomain: string;
  }

  /**
   * Information about a redirect action.
   *
   * A URI consists of the following components: protocol://hostname:port/path?query. You must modify at least one of the following components to avoid a redirect loop: protocol, hostname, port, or path. Any components that you do not modify retain their original values.
   *
   * You can reuse URI components using the following reserved keywords:
   *
   * - #{protocol}
   * - #{host}
   * - #{port}
   * - #{path} (the leading "/" is removed)
   * - #{query}
   *
   * For example, you can change the path to "/new/#{path}", the hostname to "example.#{host}", or the query to "#{query}&value=xyz".
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html
   */
  export interface RedirectConfigProperty {
    /**
     * The hostname.
     *
     * This component is not percent-encoded. The hostname can contain #{host}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-host
     */
    readonly host?: string;

    /**
     * The absolute path, starting with the leading "/".
     *
     * This component is not percent-encoded. The path can contain #{host}, #{path}, and #{port}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-path
     */
    readonly path?: string;

    /**
     * The port.
     *
     * You can specify a value from 1 to 65535 or #{port}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-port
     */
    readonly port?: string;

    /**
     * The protocol.
     *
     * You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP, HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-protocol
     */
    readonly protocol?: string;

    /**
     * The query parameters, URL-encoded when necessary, but not percent-encoded.
     *
     * Do not include the leading "?", as it is automatically added. You can specify any of the reserved keywords.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-query
     */
    readonly query?: string;

    /**
     * The HTTP redirect code.
     *
     * The redirect is either permanent (HTTP 301) or temporary (HTTP 302).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-statuscode
     */
    readonly statusCode: string;
  }

  /**
   * Information for creating an action that distributes requests among one or more target groups.
   *
   * For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html
   */
  export interface ForwardConfigProperty {
    /**
     * Information about how traffic will be distributed between multiple target groups in a forward rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html#cfn-elasticloadbalancingv2-listener-forwardconfig-targetgroups
     */
    readonly targetGroups?: Array<cdk.IResolvable | CfnListener.TargetGroupTupleProperty> | cdk.IResolvable;

    /**
     * Information about the target group stickiness for a rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html#cfn-elasticloadbalancingv2-listener-forwardconfig-targetgroupstickinessconfig
     */
    readonly targetGroupStickinessConfig?: cdk.IResolvable | CfnListener.TargetGroupStickinessConfigProperty;
  }

  /**
   * Information about the target group stickiness for a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html
   */
  export interface TargetGroupStickinessConfigProperty {
    /**
     * The time period, in seconds, during which requests from a client should be routed to the same target group.
     *
     * The range is 1-604800 seconds (7 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listener-targetgroupstickinessconfig-durationseconds
     */
    readonly durationSeconds?: number;

    /**
     * Indicates whether target group stickiness is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listener-targetgroupstickinessconfig-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Information about how traffic will be distributed between multiple target groups in a forward rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html
   */
  export interface TargetGroupTupleProperty {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html#cfn-elasticloadbalancingv2-listener-targetgrouptuple-targetgrouparn
     */
    readonly targetGroupArn?: string;

    /**
     * The weight.
     *
     * The range is 0 to 999.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html#cfn-elasticloadbalancingv2-listener-targetgrouptuple-weight
     */
    readonly weight?: number;
  }

  /**
   * Specifies information required using an identity provide (IdP) that is compliant with OpenID Connect (OIDC) to authenticate users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html
   */
  export interface AuthenticateOidcConfigProperty {
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-authenticationrequestextraparams
     */
    readonly authenticationRequestExtraParams?: cdk.IResolvable | Record<string, string>;

    /**
     * The authorization endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-authorizationendpoint
     */
    readonly authorizationEndpoint: string;

    /**
     * The OAuth 2.0 client identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-clientid
     */
    readonly clientId: string;

    /**
     * The OAuth 2.0 client secret. This parameter is required if you are creating a rule. If you are modifying a rule, you can omit this parameter if you set `UseExistingClientSecret` to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-clientsecret
     */
    readonly clientSecret?: string;

    /**
     * The OIDC issuer identifier of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-issuer
     */
    readonly issuer: string;

    /**
     * The behavior if the user is not authenticated. The following are possible values:.
     *
     * - deny `` - Return an HTTP 401 Unauthorized error.
     * - allow `` - Allow the request to be forwarded to the target.
     * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-onunauthenticatedrequest
     */
    readonly onUnauthenticatedRequest?: string;

    /**
     * The set of user claims to be requested from the IdP. The default is `openid` .
     *
     * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-scope
     */
    readonly scope?: string;

    /**
     * The name of the cookie used to maintain session information.
     *
     * The default is AWSELBAuthSessionCookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-sessioncookiename
     */
    readonly sessionCookieName?: string;

    /**
     * The maximum duration of the authentication session, in seconds.
     *
     * The default is 604800 seconds (7 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-sessiontimeout
     */
    readonly sessionTimeout?: string;

    /**
     * The token endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-tokenendpoint
     */
    readonly tokenEndpoint: string;

    /**
     * Indicates whether to use the existing client secret when modifying a rule.
     *
     * If you are creating a rule, you can omit this parameter or set it to false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-useexistingclientsecret
     */
    readonly useExistingClientSecret?: boolean | cdk.IResolvable;

    /**
     * The user info endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-userinfoendpoint
     */
    readonly userInfoEndpoint: string;
  }

  /**
   * Specifies an SSL server certificate to use as the default certificate for a secure listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificate.html
   */
  export interface CertificateProperty {
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificate.html#cfn-elasticloadbalancingv2-listener-certificate-certificatearn
     */
    readonly certificateArn?: string;
  }

  /**
   * Specifies the configuration information for mutual authentication.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-mutualauthentication.html
   */
  export interface MutualAuthenticationProperty {
    /**
     * Indicates whether expired client certificates are ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-mutualauthentication.html#cfn-elasticloadbalancingv2-listener-mutualauthentication-ignoreclientcertificateexpiry
     */
    readonly ignoreClientCertificateExpiry?: boolean | cdk.IResolvable;

    /**
     * The client certificate handling method.
     *
     * Options are `off` , `passthrough` or `verify` . The default value is `off` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-mutualauthentication.html#cfn-elasticloadbalancingv2-listener-mutualauthentication-mode
     */
    readonly mode?: string;

    /**
     * The Amazon Resource Name (ARN) of the trust store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-mutualauthentication.html#cfn-elasticloadbalancingv2-listener-mutualauthentication-truststorearn
     */
    readonly trustStoreArn?: string;
  }
}

/**
 * Properties for defining a `CfnListener`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html
 */
export interface CfnListenerProps {
  /**
   * [TLS listener] The name of the Application-Layer Protocol Negotiation (ALPN) policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-alpnpolicy
   */
  readonly alpnPolicy?: Array<string>;

  /**
   * The default SSL server certificate for a secure listener.
   *
   * You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
   *
   * To create a certificate list for a secure listener, use [AWS::ElasticLoadBalancingV2::ListenerCertificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-certificates
   */
  readonly certificates?: Array<CfnListener.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The actions for the default rule. You cannot define a condition for a default rule.
   *
   * To create additional rules for an Application Load Balancer, use [AWS::ElasticLoadBalancingV2::ListenerRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-defaultactions
   */
  readonly defaultActions: Array<CfnListener.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-loadbalancerarn
   */
  readonly loadBalancerArn: string;

  /**
   * The mutual authentication configuration information.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-mutualauthentication
   */
  readonly mutualAuthentication?: cdk.IResolvable | CfnListener.MutualAuthenticationProperty;

  /**
   * The port on which the load balancer is listening.
   *
   * You cannot specify a port for a Gateway Load Balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-port
   */
  readonly port?: number;

  /**
   * The protocol for connections from clients to the load balancer.
   *
   * For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, and TCP_UDP. You can’t specify the UDP or TCP_UDP protocol if dual-stack mode is enabled. You cannot specify a protocol for a Gateway Load Balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-protocol
   */
  readonly protocol?: string;

  /**
   * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported.
   *
   * For more information, see [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) in the *Application Load Balancers Guide* and [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html#describe-ssl-policies) in the *Network Load Balancers Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-sslpolicy
   */
  readonly sslPolicy?: string;
}

/**
 * Determine whether the given properties match those of a `FixedResponseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FixedResponseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerFixedResponseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("messageBody", cdk.validateString)(properties.messageBody));
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"FixedResponseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerFixedResponseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerFixedResponseConfigPropertyValidator(properties).assertSuccess();
  return {
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "MessageBody": cdk.stringToCloudFormation(properties.messageBody),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnListenerFixedResponseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.FixedResponseConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.FixedResponseConfigProperty>();
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("messageBody", "MessageBody", (properties.MessageBody != null ? cfn_parse.FromCloudFormation.getString(properties.MessageBody) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthenticateCognitoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateCognitoConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerAuthenticateCognitoConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationRequestExtraParams", cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
  errors.collect(cdk.propertyValidator("onUnauthenticatedRequest", cdk.validateString)(properties.onUnauthenticatedRequest));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("sessionCookieName", cdk.validateString)(properties.sessionCookieName));
  errors.collect(cdk.propertyValidator("sessionTimeout", cdk.validateString)(properties.sessionTimeout));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.requiredValidator)(properties.userPoolArn));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.validateString)(properties.userPoolArn));
  errors.collect(cdk.propertyValidator("userPoolClientId", cdk.requiredValidator)(properties.userPoolClientId));
  errors.collect(cdk.propertyValidator("userPoolClientId", cdk.validateString)(properties.userPoolClientId));
  errors.collect(cdk.propertyValidator("userPoolDomain", cdk.requiredValidator)(properties.userPoolDomain));
  errors.collect(cdk.propertyValidator("userPoolDomain", cdk.validateString)(properties.userPoolDomain));
  return errors.wrap("supplied properties not correct for \"AuthenticateCognitoConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerAuthenticateCognitoConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerAuthenticateCognitoConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationRequestExtraParams": cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
    "OnUnauthenticatedRequest": cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "SessionCookieName": cdk.stringToCloudFormation(properties.sessionCookieName),
    "SessionTimeout": cdk.stringToCloudFormation(properties.sessionTimeout),
    "UserPoolArn": cdk.stringToCloudFormation(properties.userPoolArn),
    "UserPoolClientId": cdk.stringToCloudFormation(properties.userPoolClientId),
    "UserPoolDomain": cdk.stringToCloudFormation(properties.userPoolDomain)
  };
}

// @ts-ignore TS6133
function CfnListenerAuthenticateCognitoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.AuthenticateCognitoConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.AuthenticateCognitoConfigProperty>();
  ret.addPropertyResult("authenticationRequestExtraParams", "AuthenticationRequestExtraParams", (properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined));
  ret.addPropertyResult("onUnauthenticatedRequest", "OnUnauthenticatedRequest", (properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("sessionCookieName", "SessionCookieName", (properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined));
  ret.addPropertyResult("sessionTimeout", "SessionTimeout", (properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getString(properties.SessionTimeout) : undefined));
  ret.addPropertyResult("userPoolArn", "UserPoolArn", (properties.UserPoolArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolArn) : undefined));
  ret.addPropertyResult("userPoolClientId", "UserPoolClientId", (properties.UserPoolClientId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolClientId) : undefined));
  ret.addPropertyResult("userPoolDomain", "UserPoolDomain", (properties.UserPoolDomain != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolDomain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedirectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRedirectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("query", cdk.validateString)(properties.query));
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"RedirectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRedirectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRedirectConfigPropertyValidator(properties).assertSuccess();
  return {
    "Host": cdk.stringToCloudFormation(properties.host),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Port": cdk.stringToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "Query": cdk.stringToCloudFormation(properties.query),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnListenerRedirectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListener.RedirectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.RedirectConfigProperty>();
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("query", "Query", (properties.Query != null ? cfn_parse.FromCloudFormation.getString(properties.Query) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupStickinessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupStickinessConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerTargetGroupStickinessConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationSeconds", cdk.validateNumber)(properties.durationSeconds));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TargetGroupStickinessConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerTargetGroupStickinessConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerTargetGroupStickinessConfigPropertyValidator(properties).assertSuccess();
  return {
    "DurationSeconds": cdk.numberToCloudFormation(properties.durationSeconds),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnListenerTargetGroupStickinessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListener.TargetGroupStickinessConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.TargetGroupStickinessConfigProperty>();
  ret.addPropertyResult("durationSeconds", "DurationSeconds", (properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupTupleProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupTupleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerTargetGroupTuplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroupArn", cdk.validateString)(properties.targetGroupArn));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"TargetGroupTupleProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerTargetGroupTuplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerTargetGroupTuplePropertyValidator(properties).assertSuccess();
  return {
    "TargetGroupArn": cdk.stringToCloudFormation(properties.targetGroupArn),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnListenerTargetGroupTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListener.TargetGroupTupleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.TargetGroupTupleProperty>();
  ret.addPropertyResult("targetGroupArn", "TargetGroupArn", (properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerForwardConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroupStickinessConfig", CfnListenerTargetGroupStickinessConfigPropertyValidator)(properties.targetGroupStickinessConfig));
  errors.collect(cdk.propertyValidator("targetGroups", cdk.listValidator(CfnListenerTargetGroupTuplePropertyValidator))(properties.targetGroups));
  return errors.wrap("supplied properties not correct for \"ForwardConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerForwardConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerForwardConfigPropertyValidator(properties).assertSuccess();
  return {
    "TargetGroupStickinessConfig": convertCfnListenerTargetGroupStickinessConfigPropertyToCloudFormation(properties.targetGroupStickinessConfig),
    "TargetGroups": cdk.listMapper(convertCfnListenerTargetGroupTuplePropertyToCloudFormation)(properties.targetGroups)
  };
}

// @ts-ignore TS6133
function CfnListenerForwardConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.ForwardConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.ForwardConfigProperty>();
  ret.addPropertyResult("targetGroups", "TargetGroups", (properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerTargetGroupTuplePropertyFromCloudFormation)(properties.TargetGroups) : undefined));
  ret.addPropertyResult("targetGroupStickinessConfig", "TargetGroupStickinessConfig", (properties.TargetGroupStickinessConfig != null ? CfnListenerTargetGroupStickinessConfigPropertyFromCloudFormation(properties.TargetGroupStickinessConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthenticateOidcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateOidcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerAuthenticateOidcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationRequestExtraParams", cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
  errors.collect(cdk.propertyValidator("authorizationEndpoint", cdk.requiredValidator)(properties.authorizationEndpoint));
  errors.collect(cdk.propertyValidator("authorizationEndpoint", cdk.validateString)(properties.authorizationEndpoint));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("issuer", cdk.requiredValidator)(properties.issuer));
  errors.collect(cdk.propertyValidator("issuer", cdk.validateString)(properties.issuer));
  errors.collect(cdk.propertyValidator("onUnauthenticatedRequest", cdk.validateString)(properties.onUnauthenticatedRequest));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("sessionCookieName", cdk.validateString)(properties.sessionCookieName));
  errors.collect(cdk.propertyValidator("sessionTimeout", cdk.validateString)(properties.sessionTimeout));
  errors.collect(cdk.propertyValidator("tokenEndpoint", cdk.requiredValidator)(properties.tokenEndpoint));
  errors.collect(cdk.propertyValidator("tokenEndpoint", cdk.validateString)(properties.tokenEndpoint));
  errors.collect(cdk.propertyValidator("useExistingClientSecret", cdk.validateBoolean)(properties.useExistingClientSecret));
  errors.collect(cdk.propertyValidator("userInfoEndpoint", cdk.requiredValidator)(properties.userInfoEndpoint));
  errors.collect(cdk.propertyValidator("userInfoEndpoint", cdk.validateString)(properties.userInfoEndpoint));
  return errors.wrap("supplied properties not correct for \"AuthenticateOidcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerAuthenticateOidcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerAuthenticateOidcConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationRequestExtraParams": cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
    "AuthorizationEndpoint": cdk.stringToCloudFormation(properties.authorizationEndpoint),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "Issuer": cdk.stringToCloudFormation(properties.issuer),
    "OnUnauthenticatedRequest": cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "SessionCookieName": cdk.stringToCloudFormation(properties.sessionCookieName),
    "SessionTimeout": cdk.stringToCloudFormation(properties.sessionTimeout),
    "TokenEndpoint": cdk.stringToCloudFormation(properties.tokenEndpoint),
    "UseExistingClientSecret": cdk.booleanToCloudFormation(properties.useExistingClientSecret),
    "UserInfoEndpoint": cdk.stringToCloudFormation(properties.userInfoEndpoint)
  };
}

// @ts-ignore TS6133
function CfnListenerAuthenticateOidcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.AuthenticateOidcConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.AuthenticateOidcConfigProperty>();
  ret.addPropertyResult("authenticationRequestExtraParams", "AuthenticationRequestExtraParams", (properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined));
  ret.addPropertyResult("authorizationEndpoint", "AuthorizationEndpoint", (properties.AuthorizationEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationEndpoint) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("issuer", "Issuer", (properties.Issuer != null ? cfn_parse.FromCloudFormation.getString(properties.Issuer) : undefined));
  ret.addPropertyResult("onUnauthenticatedRequest", "OnUnauthenticatedRequest", (properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("sessionCookieName", "SessionCookieName", (properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined));
  ret.addPropertyResult("sessionTimeout", "SessionTimeout", (properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getString(properties.SessionTimeout) : undefined));
  ret.addPropertyResult("tokenEndpoint", "TokenEndpoint", (properties.TokenEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.TokenEndpoint) : undefined));
  ret.addPropertyResult("useExistingClientSecret", "UseExistingClientSecret", (properties.UseExistingClientSecret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseExistingClientSecret) : undefined));
  ret.addPropertyResult("userInfoEndpoint", "UserInfoEndpoint", (properties.UserInfoEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.UserInfoEndpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticateCognitoConfig", CfnListenerAuthenticateCognitoConfigPropertyValidator)(properties.authenticateCognitoConfig));
  errors.collect(cdk.propertyValidator("authenticateOidcConfig", CfnListenerAuthenticateOidcConfigPropertyValidator)(properties.authenticateOidcConfig));
  errors.collect(cdk.propertyValidator("fixedResponseConfig", CfnListenerFixedResponseConfigPropertyValidator)(properties.fixedResponseConfig));
  errors.collect(cdk.propertyValidator("forwardConfig", CfnListenerForwardConfigPropertyValidator)(properties.forwardConfig));
  errors.collect(cdk.propertyValidator("order", cdk.validateNumber)(properties.order));
  errors.collect(cdk.propertyValidator("redirectConfig", CfnListenerRedirectConfigPropertyValidator)(properties.redirectConfig));
  errors.collect(cdk.propertyValidator("targetGroupArn", cdk.validateString)(properties.targetGroupArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerActionPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticateCognitoConfig": convertCfnListenerAuthenticateCognitoConfigPropertyToCloudFormation(properties.authenticateCognitoConfig),
    "AuthenticateOidcConfig": convertCfnListenerAuthenticateOidcConfigPropertyToCloudFormation(properties.authenticateOidcConfig),
    "FixedResponseConfig": convertCfnListenerFixedResponseConfigPropertyToCloudFormation(properties.fixedResponseConfig),
    "ForwardConfig": convertCfnListenerForwardConfigPropertyToCloudFormation(properties.forwardConfig),
    "Order": cdk.numberToCloudFormation(properties.order),
    "RedirectConfig": convertCfnListenerRedirectConfigPropertyToCloudFormation(properties.redirectConfig),
    "TargetGroupArn": cdk.stringToCloudFormation(properties.targetGroupArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnListenerActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.ActionProperty>();
  ret.addPropertyResult("authenticateCognitoConfig", "AuthenticateCognitoConfig", (properties.AuthenticateCognitoConfig != null ? CfnListenerAuthenticateCognitoConfigPropertyFromCloudFormation(properties.AuthenticateCognitoConfig) : undefined));
  ret.addPropertyResult("authenticateOidcConfig", "AuthenticateOidcConfig", (properties.AuthenticateOidcConfig != null ? CfnListenerAuthenticateOidcConfigPropertyFromCloudFormation(properties.AuthenticateOidcConfig) : undefined));
  ret.addPropertyResult("fixedResponseConfig", "FixedResponseConfig", (properties.FixedResponseConfig != null ? CfnListenerFixedResponseConfigPropertyFromCloudFormation(properties.FixedResponseConfig) : undefined));
  ret.addPropertyResult("forwardConfig", "ForwardConfig", (properties.ForwardConfig != null ? CfnListenerForwardConfigPropertyFromCloudFormation(properties.ForwardConfig) : undefined));
  ret.addPropertyResult("order", "Order", (properties.Order != null ? cfn_parse.FromCloudFormation.getNumber(properties.Order) : undefined));
  ret.addPropertyResult("redirectConfig", "RedirectConfig", (properties.RedirectConfig != null ? CfnListenerRedirectConfigPropertyFromCloudFormation(properties.RedirectConfig) : undefined));
  ret.addPropertyResult("targetGroupArn", "TargetGroupArn", (properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CertificateProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  return errors.wrap("supplied properties not correct for \"CertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerCertificatePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn)
  };
}

// @ts-ignore TS6133
function CfnListenerCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.CertificateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.CertificateProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MutualAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerMutualAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ignoreClientCertificateExpiry", cdk.validateBoolean)(properties.ignoreClientCertificateExpiry));
  errors.collect(cdk.propertyValidator("mode", cdk.validateString)(properties.mode));
  errors.collect(cdk.propertyValidator("trustStoreArn", cdk.validateString)(properties.trustStoreArn));
  return errors.wrap("supplied properties not correct for \"MutualAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerMutualAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerMutualAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "IgnoreClientCertificateExpiry": cdk.booleanToCloudFormation(properties.ignoreClientCertificateExpiry),
    "Mode": cdk.stringToCloudFormation(properties.mode),
    "TrustStoreArn": cdk.stringToCloudFormation(properties.trustStoreArn)
  };
}

// @ts-ignore TS6133
function CfnListenerMutualAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListener.MutualAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.MutualAuthenticationProperty>();
  ret.addPropertyResult("ignoreClientCertificateExpiry", "IgnoreClientCertificateExpiry", (properties.IgnoreClientCertificateExpiry != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IgnoreClientCertificateExpiry) : undefined));
  ret.addPropertyResult("mode", "Mode", (properties.Mode != null ? cfn_parse.FromCloudFormation.getString(properties.Mode) : undefined));
  ret.addPropertyResult("trustStoreArn", "TrustStoreArn", (properties.TrustStoreArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrustStoreArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnListenerProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alpnPolicy", cdk.listValidator(cdk.validateString))(properties.alpnPolicy));
  errors.collect(cdk.propertyValidator("certificates", cdk.listValidator(CfnListenerCertificatePropertyValidator))(properties.certificates));
  errors.collect(cdk.propertyValidator("defaultActions", cdk.requiredValidator)(properties.defaultActions));
  errors.collect(cdk.propertyValidator("defaultActions", cdk.listValidator(CfnListenerActionPropertyValidator))(properties.defaultActions));
  errors.collect(cdk.propertyValidator("loadBalancerArn", cdk.requiredValidator)(properties.loadBalancerArn));
  errors.collect(cdk.propertyValidator("loadBalancerArn", cdk.validateString)(properties.loadBalancerArn));
  errors.collect(cdk.propertyValidator("mutualAuthentication", CfnListenerMutualAuthenticationPropertyValidator)(properties.mutualAuthentication));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("sslPolicy", cdk.validateString)(properties.sslPolicy));
  return errors.wrap("supplied properties not correct for \"CfnListenerProps\"");
}

// @ts-ignore TS6133
function convertCfnListenerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerPropsValidator(properties).assertSuccess();
  return {
    "AlpnPolicy": cdk.listMapper(cdk.stringToCloudFormation)(properties.alpnPolicy),
    "Certificates": cdk.listMapper(convertCfnListenerCertificatePropertyToCloudFormation)(properties.certificates),
    "DefaultActions": cdk.listMapper(convertCfnListenerActionPropertyToCloudFormation)(properties.defaultActions),
    "LoadBalancerArn": cdk.stringToCloudFormation(properties.loadBalancerArn),
    "MutualAuthentication": convertCfnListenerMutualAuthenticationPropertyToCloudFormation(properties.mutualAuthentication),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "SslPolicy": cdk.stringToCloudFormation(properties.sslPolicy)
  };
}

// @ts-ignore TS6133
function CfnListenerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerProps>();
  ret.addPropertyResult("alpnPolicy", "AlpnPolicy", (properties.AlpnPolicy != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AlpnPolicy) : undefined));
  ret.addPropertyResult("certificates", "Certificates", (properties.Certificates != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerCertificatePropertyFromCloudFormation)(properties.Certificates) : undefined));
  ret.addPropertyResult("defaultActions", "DefaultActions", (properties.DefaultActions != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerActionPropertyFromCloudFormation)(properties.DefaultActions) : undefined));
  ret.addPropertyResult("loadBalancerArn", "LoadBalancerArn", (properties.LoadBalancerArn != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerArn) : undefined));
  ret.addPropertyResult("mutualAuthentication", "MutualAuthentication", (properties.MutualAuthentication != null ? CfnListenerMutualAuthenticationPropertyFromCloudFormation(properties.MutualAuthentication) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("sslPolicy", "SslPolicy", (properties.SslPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SslPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an SSL server certificate to add to the certificate list for an HTTPS or TLS listener.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::ListenerCertificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html
 */
export class CfnListenerCertificate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::ListenerCertificate";

  /**
   * Build a CfnListenerCertificate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListenerCertificate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnListenerCertificatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnListenerCertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The certificate.
   */
  public certificates: Array<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the listener.
   */
  public listenerArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnListenerCertificateProps) {
    super(scope, id, {
      "type": CfnListenerCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificates", this);
    cdk.requireProperty(props, "listenerArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.certificates = props.certificates;
    this.listenerArn = props.listenerArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificates": this.certificates,
      "listenerArn": this.listenerArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnListenerCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnListenerCertificatePropsToCloudFormation(props);
  }
}

export namespace CfnListenerCertificate {
  /**
   * Specifies an SSL server certificate for the certificate list of a secure listener.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenercertificate-certificate.html
   */
  export interface CertificateProperty {
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenercertificate-certificate.html#cfn-elasticloadbalancingv2-listenercertificate-certificate-certificatearn
     */
    readonly certificateArn?: string;
  }
}

/**
 * Properties for defining a `CfnListenerCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html
 */
export interface CfnListenerCertificateProps {
  /**
   * The certificate.
   *
   * You can specify one certificate per resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-certificates
   */
  readonly certificates: Array<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the listener.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-listenerarn
   */
  readonly listenerArn: string;
}

/**
 * Determine whether the given properties match those of a `CertificateProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerCertificateCertificatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  return errors.wrap("supplied properties not correct for \"CertificateProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerCertificateCertificatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerCertificateCertificatePropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn)
  };
}

// @ts-ignore TS6133
function CfnListenerCertificateCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerCertificate.CertificateProperty>();
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnListenerCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificates", cdk.requiredValidator)(properties.certificates));
  errors.collect(cdk.propertyValidator("certificates", cdk.listValidator(CfnListenerCertificateCertificatePropertyValidator))(properties.certificates));
  errors.collect(cdk.propertyValidator("listenerArn", cdk.requiredValidator)(properties.listenerArn));
  errors.collect(cdk.propertyValidator("listenerArn", cdk.validateString)(properties.listenerArn));
  return errors.wrap("supplied properties not correct for \"CfnListenerCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnListenerCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerCertificatePropsValidator(properties).assertSuccess();
  return {
    "Certificates": cdk.listMapper(convertCfnListenerCertificateCertificatePropertyToCloudFormation)(properties.certificates),
    "ListenerArn": cdk.stringToCloudFormation(properties.listenerArn)
  };
}

// @ts-ignore TS6133
function CfnListenerCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerCertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerCertificateProps>();
  ret.addPropertyResult("certificates", "Certificates", (properties.Certificates != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerCertificateCertificatePropertyFromCloudFormation)(properties.Certificates) : undefined));
  ret.addPropertyResult("listenerArn", "ListenerArn", (properties.ListenerArn != null ? cfn_parse.FromCloudFormation.getString(properties.ListenerArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a listener rule.
 *
 * The listener must be associated with an Application Load Balancer. Each rule consists of a priority, one or more actions, and one or more conditions.
 *
 * For more information, see [Quotas for your Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-limits.html) in the *User Guide for Application Load Balancers* .
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::ListenerRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html
 */
export class CfnListenerRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::ListenerRule";

  /**
   * Build a CfnListenerRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListenerRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnListenerRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnListenerRule(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Indicates whether this is the default rule.
   *
   * @cloudformationAttribute IsDefault
   */
  public readonly attrIsDefault: cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the rule.
   *
   * @cloudformationAttribute RuleArn
   */
  public readonly attrRuleArn: string;

  /**
   * The actions.
   */
  public actions: Array<CfnListenerRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The conditions.
   */
  public conditions: Array<cdk.IResolvable | CfnListenerRule.RuleConditionProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the listener.
   */
  public listenerArn?: string;

  /**
   * The rule priority. A listener can't have multiple rules with the same priority.
   */
  public priority: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnListenerRuleProps) {
    super(scope, id, {
      "type": CfnListenerRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actions", this);
    cdk.requireProperty(props, "conditions", this);
    cdk.requireProperty(props, "priority", this);

    this.attrIsDefault = this.getAtt("IsDefault");
    this.attrRuleArn = cdk.Token.asString(this.getAtt("RuleArn", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.conditions = props.conditions;
    this.listenerArn = props.listenerArn;
    this.priority = props.priority;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "conditions": this.conditions,
      "listenerArn": this.listenerArn,
      "priority": this.priority
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnListenerRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnListenerRulePropsToCloudFormation(props);
  }
}

export namespace CfnListenerRule {
  /**
   * Specifies an action for a listener rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html
   */
  export interface ActionProperty {
    /**
     * [HTTPS listeners] Information for using Amazon Cognito to authenticate users.
     *
     * Specify only when `Type` is `authenticate-cognito` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-authenticatecognitoconfig
     */
    readonly authenticateCognitoConfig?: CfnListenerRule.AuthenticateCognitoConfigProperty | cdk.IResolvable;

    /**
     * [HTTPS listeners] Information about an identity provider that is compliant with OpenID Connect (OIDC).
     *
     * Specify only when `Type` is `authenticate-oidc` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-authenticateoidcconfig
     */
    readonly authenticateOidcConfig?: CfnListenerRule.AuthenticateOidcConfigProperty | cdk.IResolvable;

    /**
     * [Application Load Balancer] Information for creating an action that returns a custom HTTP response.
     *
     * Specify only when `Type` is `fixed-response` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-fixedresponseconfig
     */
    readonly fixedResponseConfig?: CfnListenerRule.FixedResponseConfigProperty | cdk.IResolvable;

    /**
     * Information for creating an action that distributes requests among one or more target groups.
     *
     * For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-forwardconfig
     */
    readonly forwardConfig?: CfnListenerRule.ForwardConfigProperty | cdk.IResolvable;

    /**
     * The order for the action.
     *
     * This value is required for rules with multiple actions. The action with the lowest value for order is performed first.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-order
     */
    readonly order?: number;

    /**
     * [Application Load Balancer] Information for creating a redirect action.
     *
     * Specify only when `Type` is `redirect` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-redirectconfig
     */
    readonly redirectConfig?: cdk.IResolvable | CfnListenerRule.RedirectConfigProperty;

    /**
     * The Amazon Resource Name (ARN) of the target group.
     *
     * Specify only when `Type` is `forward` and you want to route to a single target group. To route to one or more target groups, use `ForwardConfig` instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-targetgrouparn
     */
    readonly targetGroupArn?: string;

    /**
     * The type of action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-type
     */
    readonly type: string;
  }

  /**
   * Specifies information required when returning a custom HTTP response.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html
   */
  export interface FixedResponseConfigProperty {
    /**
     * The content type.
     *
     * Valid Values: text/plain | text/css | text/html | application/javascript | application/json
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listenerrule-fixedresponseconfig-contenttype
     */
    readonly contentType?: string;

    /**
     * The message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listenerrule-fixedresponseconfig-messagebody
     */
    readonly messageBody?: string;

    /**
     * The HTTP response code (2XX, 4XX, or 5XX).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listenerrule-fixedresponseconfig-statuscode
     */
    readonly statusCode: string;
  }

  /**
   * Specifies information required when integrating with Amazon Cognito to authenticate users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html
   */
  export interface AuthenticateCognitoConfigProperty {
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-authenticationrequestextraparams
     */
    readonly authenticationRequestExtraParams?: cdk.IResolvable | Record<string, string>;

    /**
     * The behavior if the user is not authenticated. The following are possible values:.
     *
     * - deny `` - Return an HTTP 401 Unauthorized error.
     * - allow `` - Allow the request to be forwarded to the target.
     * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-onunauthenticatedrequest
     */
    readonly onUnauthenticatedRequest?: string;

    /**
     * The set of user claims to be requested from the IdP. The default is `openid` .
     *
     * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-scope
     */
    readonly scope?: string;

    /**
     * The name of the cookie used to maintain session information.
     *
     * The default is AWSELBAuthSessionCookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-sessioncookiename
     */
    readonly sessionCookieName?: string;

    /**
     * The maximum duration of the authentication session, in seconds.
     *
     * The default is 604800 seconds (7 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-sessiontimeout
     */
    readonly sessionTimeout?: number;

    /**
     * The Amazon Resource Name (ARN) of the Amazon Cognito user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-userpoolarn
     */
    readonly userPoolArn: string;

    /**
     * The ID of the Amazon Cognito user pool client.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-userpoolclientid
     */
    readonly userPoolClientId: string;

    /**
     * The domain prefix or fully-qualified domain name of the Amazon Cognito user pool.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-userpooldomain
     */
    readonly userPoolDomain: string;
  }

  /**
   * Information about a redirect action.
   *
   * A URI consists of the following components: protocol://hostname:port/path?query. You must modify at least one of the following components to avoid a redirect loop: protocol, hostname, port, or path. Any components that you do not modify retain their original values.
   *
   * You can reuse URI components using the following reserved keywords:
   *
   * - #{protocol}
   * - #{host}
   * - #{port}
   * - #{path} (the leading "/" is removed)
   * - #{query}
   *
   * For example, you can change the path to "/new/#{path}", the hostname to "example.#{host}", or the query to "#{query}&value=xyz".
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html
   */
  export interface RedirectConfigProperty {
    /**
     * The hostname.
     *
     * This component is not percent-encoded. The hostname can contain #{host}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-host
     */
    readonly host?: string;

    /**
     * The absolute path, starting with the leading "/".
     *
     * This component is not percent-encoded. The path can contain #{host}, #{path}, and #{port}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-path
     */
    readonly path?: string;

    /**
     * The port.
     *
     * You can specify a value from 1 to 65535 or #{port}.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-port
     */
    readonly port?: string;

    /**
     * The protocol.
     *
     * You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP, HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-protocol
     */
    readonly protocol?: string;

    /**
     * The query parameters, URL-encoded when necessary, but not percent-encoded.
     *
     * Do not include the leading "?", as it is automatically added. You can specify any of the reserved keywords.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-query
     */
    readonly query?: string;

    /**
     * The HTTP redirect code.
     *
     * The redirect is either permanent (HTTP 301) or temporary (HTTP 302).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-statuscode
     */
    readonly statusCode: string;
  }

  /**
   * Information for creating an action that distributes requests among one or more target groups.
   *
   * For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html
   */
  export interface ForwardConfigProperty {
    /**
     * Information about how traffic will be distributed between multiple target groups in a forward rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html#cfn-elasticloadbalancingv2-listenerrule-forwardconfig-targetgroups
     */
    readonly targetGroups?: Array<cdk.IResolvable | CfnListenerRule.TargetGroupTupleProperty> | cdk.IResolvable;

    /**
     * Information about the target group stickiness for a rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html#cfn-elasticloadbalancingv2-listenerrule-forwardconfig-targetgroupstickinessconfig
     */
    readonly targetGroupStickinessConfig?: cdk.IResolvable | CfnListenerRule.TargetGroupStickinessConfigProperty;
  }

  /**
   * Information about the target group stickiness for a rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html
   */
  export interface TargetGroupStickinessConfigProperty {
    /**
     * The time period, in seconds, during which requests from a client should be routed to the same target group.
     *
     * The range is 1-604800 seconds (7 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig-durationseconds
     */
    readonly durationSeconds?: number;

    /**
     * Indicates whether target group stickiness is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * Information about how traffic will be distributed between multiple target groups in a forward rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html
   */
  export interface TargetGroupTupleProperty {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html#cfn-elasticloadbalancingv2-listenerrule-targetgrouptuple-targetgrouparn
     */
    readonly targetGroupArn?: string;

    /**
     * The weight.
     *
     * The range is 0 to 999.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html#cfn-elasticloadbalancingv2-listenerrule-targetgrouptuple-weight
     */
    readonly weight?: number;
  }

  /**
   * Specifies information required using an identity provide (IdP) that is compliant with OpenID Connect (OIDC) to authenticate users.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html
   */
  export interface AuthenticateOidcConfigProperty {
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-authenticationrequestextraparams
     */
    readonly authenticationRequestExtraParams?: cdk.IResolvable | Record<string, string>;

    /**
     * The authorization endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-authorizationendpoint
     */
    readonly authorizationEndpoint: string;

    /**
     * The OAuth 2.0 client identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-clientid
     */
    readonly clientId: string;

    /**
     * The OAuth 2.0 client secret. This parameter is required if you are creating a rule. If you are modifying a rule, you can omit this parameter if you set `UseExistingClientSecret` to true.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-clientsecret
     */
    readonly clientSecret?: string;

    /**
     * The OIDC issuer identifier of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-issuer
     */
    readonly issuer: string;

    /**
     * The behavior if the user is not authenticated. The following are possible values:.
     *
     * - deny `` - Return an HTTP 401 Unauthorized error.
     * - allow `` - Allow the request to be forwarded to the target.
     * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-onunauthenticatedrequest
     */
    readonly onUnauthenticatedRequest?: string;

    /**
     * The set of user claims to be requested from the IdP. The default is `openid` .
     *
     * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-scope
     */
    readonly scope?: string;

    /**
     * The name of the cookie used to maintain session information.
     *
     * The default is AWSELBAuthSessionCookie.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-sessioncookiename
     */
    readonly sessionCookieName?: string;

    /**
     * The maximum duration of the authentication session, in seconds.
     *
     * The default is 604800 seconds (7 days).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-sessiontimeout
     */
    readonly sessionTimeout?: number;

    /**
     * The token endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-tokenendpoint
     */
    readonly tokenEndpoint: string;

    /**
     * Indicates whether to use the existing client secret when modifying a rule.
     *
     * If you are creating a rule, you can omit this parameter or set it to false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-useexistingclientsecret
     */
    readonly useExistingClientSecret?: boolean | cdk.IResolvable;

    /**
     * The user info endpoint of the IdP.
     *
     * This must be a full URL, including the HTTPS protocol, the domain, and the path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-userinfoendpoint
     */
    readonly userInfoEndpoint: string;
  }

  /**
   * Specifies a condition for a listener rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html
   */
  export interface RuleConditionProperty {
    /**
     * The field in the HTTP request. The following are the possible values:.
     *
     * - `http-header`
     * - `http-request-method`
     * - `host-header`
     * - `path-pattern`
     * - `query-string`
     * - `source-ip`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-field
     */
    readonly field?: string;

    /**
     * Information for a host header condition.
     *
     * Specify only when `Field` is `host-header` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-hostheaderconfig
     */
    readonly hostHeaderConfig?: CfnListenerRule.HostHeaderConfigProperty | cdk.IResolvable;

    /**
     * Information for an HTTP header condition.
     *
     * Specify only when `Field` is `http-header` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-httpheaderconfig
     */
    readonly httpHeaderConfig?: CfnListenerRule.HttpHeaderConfigProperty | cdk.IResolvable;

    /**
     * Information for an HTTP method condition.
     *
     * Specify only when `Field` is `http-request-method` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-httprequestmethodconfig
     */
    readonly httpRequestMethodConfig?: CfnListenerRule.HttpRequestMethodConfigProperty | cdk.IResolvable;

    /**
     * Information for a path pattern condition.
     *
     * Specify only when `Field` is `path-pattern` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-pathpatternconfig
     */
    readonly pathPatternConfig?: cdk.IResolvable | CfnListenerRule.PathPatternConfigProperty;

    /**
     * Information for a query string condition.
     *
     * Specify only when `Field` is `query-string` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-querystringconfig
     */
    readonly queryStringConfig?: cdk.IResolvable | CfnListenerRule.QueryStringConfigProperty;

    /**
     * Information for a source IP condition.
     *
     * Specify only when `Field` is `source-ip` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-sourceipconfig
     */
    readonly sourceIpConfig?: cdk.IResolvable | CfnListenerRule.SourceIpConfigProperty;

    /**
     * The condition value.
     *
     * Specify only when `Field` is `host-header` or `path-pattern` . Alternatively, to specify multiple host names or multiple path patterns, use `HostHeaderConfig` or `PathPatternConfig` .
     *
     * If `Field` is `host-header` and you're not using `HostHeaderConfig` , you can specify a single host name (for example, my.example.com). A host name is case insensitive, can be up to 128 characters in length, and can contain any of the following characters.
     *
     * - A-Z, a-z, 0-9
     * - - .
     * - * (matches 0 or more characters)
     * - ? (matches exactly 1 character)
     *
     * If `Field` is `path-pattern` and you're not using `PathPatternConfig` , you can specify a single path pattern (for example, /img/*). A path pattern is case-sensitive, can be up to 128 characters in length, and can contain any of the following characters.
     *
     * - A-Z, a-z, 0-9
     * - _ - . $ / ~ " ' @ : +
     * - & (using &amp;)
     * - * (matches 0 or more characters)
     * - ? (matches exactly 1 character)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Information about an HTTP header condition.
   *
   * There is a set of standard HTTP header fields. You can also define custom HTTP header fields.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httpheaderconfig.html
   */
  export interface HttpHeaderConfigProperty {
    /**
     * The name of the HTTP header field.
     *
     * The maximum size is 40 characters. The header name is case insensitive. The allowed characters are specified by RFC 7230. Wildcards are not supported.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httpheaderconfig.html#cfn-elasticloadbalancingv2-listenerrule-httpheaderconfig-httpheadername
     */
    readonly httpHeaderName?: string;

    /**
     * The strings to compare against the value of the HTTP header.
     *
     * The maximum size of each string is 128 characters. The comparison strings are case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character).
     *
     * If the same header appears multiple times in the request, we search them in order until a match is found.
     *
     * If you specify multiple strings, the condition is satisfied if one of the strings matches the value of the HTTP header. To require that all of the strings are a match, create one condition per string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httpheaderconfig.html#cfn-elasticloadbalancingv2-listenerrule-httpheaderconfig-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Information about a query string condition.
   *
   * The query string component of a URI starts after the first '?' character and is terminated by either a '#' character or the end of the URI. A typical query string contains key/value pairs separated by '&' characters. The allowed characters are specified by RFC 3986. Any character can be percentage encoded.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringconfig.html
   */
  export interface QueryStringConfigProperty {
    /**
     * The key/value pairs or values to find in the query string.
     *
     * The maximum size of each string is 128 characters. The comparison is case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character). To search for a literal '*' or '?' character in a query string, you must escape these characters in `Values` using a '\' character.
     *
     * If you specify multiple key/value pairs or values, the condition is satisfied if one of them is found in the query string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringconfig.html#cfn-elasticloadbalancingv2-listenerrule-querystringconfig-values
     */
    readonly values?: Array<cdk.IResolvable | CfnListenerRule.QueryStringKeyValueProperty> | cdk.IResolvable;
  }

  /**
   * Information about a key/value pair.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html
   */
  export interface QueryStringKeyValueProperty {
    /**
     * The key.
     *
     * You can omit the key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html#cfn-elasticloadbalancingv2-listenerrule-querystringkeyvalue-key
     */
    readonly key?: string;

    /**
     * The value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html#cfn-elasticloadbalancingv2-listenerrule-querystringkeyvalue-value
     */
    readonly value?: string;
  }

  /**
   * Information about a host header condition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-hostheaderconfig.html
   */
  export interface HostHeaderConfigProperty {
    /**
     * The host names.
     *
     * The maximum size of each name is 128 characters. The comparison is case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character).
     *
     * If you specify multiple strings, the condition is satisfied if one of the strings matches the host name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-hostheaderconfig.html#cfn-elasticloadbalancingv2-listenerrule-hostheaderconfig-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Information about an HTTP method condition.
   *
   * HTTP defines a set of request methods, also referred to as HTTP verbs. For more information, see the [HTTP Method Registry](https://docs.aws.amazon.com/https://www.iana.org/assignments/http-methods/http-methods.xhtml) . You can also define custom HTTP methods.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httprequestmethodconfig.html
   */
  export interface HttpRequestMethodConfigProperty {
    /**
     * The name of the request method.
     *
     * The maximum size is 40 characters. The allowed characters are A-Z, hyphen (-), and underscore (_). The comparison is case sensitive. Wildcards are not supported; therefore, the method name must be an exact match.
     *
     * If you specify multiple strings, the condition is satisfied if one of the strings matches the HTTP request method. We recommend that you route GET and HEAD requests in the same way, because the response to a HEAD request may be cached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httprequestmethodconfig.html#cfn-elasticloadbalancingv2-listenerrule-httprequestmethodconfig-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Information about a path pattern condition.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-pathpatternconfig.html
   */
  export interface PathPatternConfigProperty {
    /**
     * The path patterns to compare against the request URL.
     *
     * The maximum size of each string is 128 characters. The comparison is case sensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character).
     *
     * If you specify multiple strings, the condition is satisfied if one of them matches the request URL. The path pattern is compared only to the path of the URL, not to its query string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-pathpatternconfig.html#cfn-elasticloadbalancingv2-listenerrule-pathpatternconfig-values
     */
    readonly values?: Array<string>;
  }

  /**
   * Information about a source IP condition.
   *
   * You can use this condition to route based on the IP address of the source that connects to the load balancer. If a client is behind a proxy, this is the IP address of the proxy not the IP address of the client.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-sourceipconfig.html
   */
  export interface SourceIpConfigProperty {
    /**
     * The source IP addresses, in CIDR format. You can use both IPv4 and IPv6 addresses. Wildcards are not supported.
     *
     * If you specify multiple addresses, the condition is satisfied if the source IP address of the request matches one of the CIDR blocks. This condition is not satisfied by the addresses in the X-Forwarded-For header.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-sourceipconfig.html#cfn-elasticloadbalancingv2-listenerrule-sourceipconfig-values
     */
    readonly values?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnListenerRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html
 */
export interface CfnListenerRuleProps {
  /**
   * The actions.
   *
   * The rule must include exactly one of the following types of actions: `forward` , `fixed-response` , or `redirect` , and it must be the last action to be performed. If the rule is for an HTTPS listener, it can also optionally include an authentication action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-actions
   */
  readonly actions: Array<CfnListenerRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The conditions.
   *
   * The rule can optionally include up to one of each of the following conditions: `http-request-method` , `host-header` , `path-pattern` , and `source-ip` . A rule can also optionally include one or more of each of the following conditions: `http-header` and `query-string` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-conditions
   */
  readonly conditions: Array<cdk.IResolvable | CfnListenerRule.RuleConditionProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the listener.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-listenerarn
   */
  readonly listenerArn?: string;

  /**
   * The rule priority. A listener can't have multiple rules with the same priority.
   *
   * If you try to reorder rules by updating their priorities, do not specify a new priority if an existing rule already uses this priority, as this can cause an error. If you need to reuse a priority with a different rule, you must remove it as a priority first, and then specify it in a subsequent update.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-priority
   */
  readonly priority: number;
}

/**
 * Determine whether the given properties match those of a `FixedResponseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FixedResponseConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleFixedResponseConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentType", cdk.validateString)(properties.contentType));
  errors.collect(cdk.propertyValidator("messageBody", cdk.validateString)(properties.messageBody));
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"FixedResponseConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleFixedResponseConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleFixedResponseConfigPropertyValidator(properties).assertSuccess();
  return {
    "ContentType": cdk.stringToCloudFormation(properties.contentType),
    "MessageBody": cdk.stringToCloudFormation(properties.messageBody),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleFixedResponseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.FixedResponseConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.FixedResponseConfigProperty>();
  ret.addPropertyResult("contentType", "ContentType", (properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined));
  ret.addPropertyResult("messageBody", "MessageBody", (properties.MessageBody != null ? cfn_parse.FromCloudFormation.getString(properties.MessageBody) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthenticateCognitoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateCognitoConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleAuthenticateCognitoConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationRequestExtraParams", cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
  errors.collect(cdk.propertyValidator("onUnauthenticatedRequest", cdk.validateString)(properties.onUnauthenticatedRequest));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("sessionCookieName", cdk.validateString)(properties.sessionCookieName));
  errors.collect(cdk.propertyValidator("sessionTimeout", cdk.validateNumber)(properties.sessionTimeout));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.requiredValidator)(properties.userPoolArn));
  errors.collect(cdk.propertyValidator("userPoolArn", cdk.validateString)(properties.userPoolArn));
  errors.collect(cdk.propertyValidator("userPoolClientId", cdk.requiredValidator)(properties.userPoolClientId));
  errors.collect(cdk.propertyValidator("userPoolClientId", cdk.validateString)(properties.userPoolClientId));
  errors.collect(cdk.propertyValidator("userPoolDomain", cdk.requiredValidator)(properties.userPoolDomain));
  errors.collect(cdk.propertyValidator("userPoolDomain", cdk.validateString)(properties.userPoolDomain));
  return errors.wrap("supplied properties not correct for \"AuthenticateCognitoConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleAuthenticateCognitoConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleAuthenticateCognitoConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationRequestExtraParams": cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
    "OnUnauthenticatedRequest": cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "SessionCookieName": cdk.stringToCloudFormation(properties.sessionCookieName),
    "SessionTimeout": cdk.numberToCloudFormation(properties.sessionTimeout),
    "UserPoolArn": cdk.stringToCloudFormation(properties.userPoolArn),
    "UserPoolClientId": cdk.stringToCloudFormation(properties.userPoolClientId),
    "UserPoolDomain": cdk.stringToCloudFormation(properties.userPoolDomain)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleAuthenticateCognitoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.AuthenticateCognitoConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.AuthenticateCognitoConfigProperty>();
  ret.addPropertyResult("authenticationRequestExtraParams", "AuthenticationRequestExtraParams", (properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined));
  ret.addPropertyResult("onUnauthenticatedRequest", "OnUnauthenticatedRequest", (properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("sessionCookieName", "SessionCookieName", (properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined));
  ret.addPropertyResult("sessionTimeout", "SessionTimeout", (properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeout) : undefined));
  ret.addPropertyResult("userPoolArn", "UserPoolArn", (properties.UserPoolArn != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolArn) : undefined));
  ret.addPropertyResult("userPoolClientId", "UserPoolClientId", (properties.UserPoolClientId != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolClientId) : undefined));
  ret.addPropertyResult("userPoolDomain", "UserPoolDomain", (properties.UserPoolDomain != null ? cfn_parse.FromCloudFormation.getString(properties.UserPoolDomain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RedirectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleRedirectConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("host", cdk.validateString)(properties.host));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("query", cdk.validateString)(properties.query));
  errors.collect(cdk.propertyValidator("statusCode", cdk.requiredValidator)(properties.statusCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  return errors.wrap("supplied properties not correct for \"RedirectConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleRedirectConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleRedirectConfigPropertyValidator(properties).assertSuccess();
  return {
    "Host": cdk.stringToCloudFormation(properties.host),
    "Path": cdk.stringToCloudFormation(properties.path),
    "Port": cdk.stringToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "Query": cdk.stringToCloudFormation(properties.query),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleRedirectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.RedirectConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.RedirectConfigProperty>();
  ret.addPropertyResult("host", "Host", (properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("query", "Query", (properties.Query != null ? cfn_parse.FromCloudFormation.getString(properties.Query) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupStickinessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupStickinessConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleTargetGroupStickinessConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("durationSeconds", cdk.validateNumber)(properties.durationSeconds));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TargetGroupStickinessConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleTargetGroupStickinessConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleTargetGroupStickinessConfigPropertyValidator(properties).assertSuccess();
  return {
    "DurationSeconds": cdk.numberToCloudFormation(properties.durationSeconds),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleTargetGroupStickinessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.TargetGroupStickinessConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.TargetGroupStickinessConfigProperty>();
  ret.addPropertyResult("durationSeconds", "DurationSeconds", (properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupTupleProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupTupleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleTargetGroupTuplePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroupArn", cdk.validateString)(properties.targetGroupArn));
  errors.collect(cdk.propertyValidator("weight", cdk.validateNumber)(properties.weight));
  return errors.wrap("supplied properties not correct for \"TargetGroupTupleProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleTargetGroupTuplePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleTargetGroupTuplePropertyValidator(properties).assertSuccess();
  return {
    "TargetGroupArn": cdk.stringToCloudFormation(properties.targetGroupArn),
    "Weight": cdk.numberToCloudFormation(properties.weight)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleTargetGroupTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.TargetGroupTupleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.TargetGroupTupleProperty>();
  ret.addPropertyResult("targetGroupArn", "TargetGroupArn", (properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined));
  ret.addPropertyResult("weight", "Weight", (properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ForwardConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleForwardConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetGroupStickinessConfig", CfnListenerRuleTargetGroupStickinessConfigPropertyValidator)(properties.targetGroupStickinessConfig));
  errors.collect(cdk.propertyValidator("targetGroups", cdk.listValidator(CfnListenerRuleTargetGroupTuplePropertyValidator))(properties.targetGroups));
  return errors.wrap("supplied properties not correct for \"ForwardConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleForwardConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleForwardConfigPropertyValidator(properties).assertSuccess();
  return {
    "TargetGroupStickinessConfig": convertCfnListenerRuleTargetGroupStickinessConfigPropertyToCloudFormation(properties.targetGroupStickinessConfig),
    "TargetGroups": cdk.listMapper(convertCfnListenerRuleTargetGroupTuplePropertyToCloudFormation)(properties.targetGroups)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleForwardConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.ForwardConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.ForwardConfigProperty>();
  ret.addPropertyResult("targetGroups", "TargetGroups", (properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerRuleTargetGroupTuplePropertyFromCloudFormation)(properties.TargetGroups) : undefined));
  ret.addPropertyResult("targetGroupStickinessConfig", "TargetGroupStickinessConfig", (properties.TargetGroupStickinessConfig != null ? CfnListenerRuleTargetGroupStickinessConfigPropertyFromCloudFormation(properties.TargetGroupStickinessConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthenticateOidcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateOidcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleAuthenticateOidcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticationRequestExtraParams", cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
  errors.collect(cdk.propertyValidator("authorizationEndpoint", cdk.requiredValidator)(properties.authorizationEndpoint));
  errors.collect(cdk.propertyValidator("authorizationEndpoint", cdk.validateString)(properties.authorizationEndpoint));
  errors.collect(cdk.propertyValidator("clientId", cdk.requiredValidator)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientId", cdk.validateString)(properties.clientId));
  errors.collect(cdk.propertyValidator("clientSecret", cdk.validateString)(properties.clientSecret));
  errors.collect(cdk.propertyValidator("issuer", cdk.requiredValidator)(properties.issuer));
  errors.collect(cdk.propertyValidator("issuer", cdk.validateString)(properties.issuer));
  errors.collect(cdk.propertyValidator("onUnauthenticatedRequest", cdk.validateString)(properties.onUnauthenticatedRequest));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("sessionCookieName", cdk.validateString)(properties.sessionCookieName));
  errors.collect(cdk.propertyValidator("sessionTimeout", cdk.validateNumber)(properties.sessionTimeout));
  errors.collect(cdk.propertyValidator("tokenEndpoint", cdk.requiredValidator)(properties.tokenEndpoint));
  errors.collect(cdk.propertyValidator("tokenEndpoint", cdk.validateString)(properties.tokenEndpoint));
  errors.collect(cdk.propertyValidator("useExistingClientSecret", cdk.validateBoolean)(properties.useExistingClientSecret));
  errors.collect(cdk.propertyValidator("userInfoEndpoint", cdk.requiredValidator)(properties.userInfoEndpoint));
  errors.collect(cdk.propertyValidator("userInfoEndpoint", cdk.validateString)(properties.userInfoEndpoint));
  return errors.wrap("supplied properties not correct for \"AuthenticateOidcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleAuthenticateOidcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleAuthenticateOidcConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticationRequestExtraParams": cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
    "AuthorizationEndpoint": cdk.stringToCloudFormation(properties.authorizationEndpoint),
    "ClientId": cdk.stringToCloudFormation(properties.clientId),
    "ClientSecret": cdk.stringToCloudFormation(properties.clientSecret),
    "Issuer": cdk.stringToCloudFormation(properties.issuer),
    "OnUnauthenticatedRequest": cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "SessionCookieName": cdk.stringToCloudFormation(properties.sessionCookieName),
    "SessionTimeout": cdk.numberToCloudFormation(properties.sessionTimeout),
    "TokenEndpoint": cdk.stringToCloudFormation(properties.tokenEndpoint),
    "UseExistingClientSecret": cdk.booleanToCloudFormation(properties.useExistingClientSecret),
    "UserInfoEndpoint": cdk.stringToCloudFormation(properties.userInfoEndpoint)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleAuthenticateOidcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.AuthenticateOidcConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.AuthenticateOidcConfigProperty>();
  ret.addPropertyResult("authenticationRequestExtraParams", "AuthenticationRequestExtraParams", (properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined));
  ret.addPropertyResult("authorizationEndpoint", "AuthorizationEndpoint", (properties.AuthorizationEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.AuthorizationEndpoint) : undefined));
  ret.addPropertyResult("clientId", "ClientId", (properties.ClientId != null ? cfn_parse.FromCloudFormation.getString(properties.ClientId) : undefined));
  ret.addPropertyResult("clientSecret", "ClientSecret", (properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined));
  ret.addPropertyResult("issuer", "Issuer", (properties.Issuer != null ? cfn_parse.FromCloudFormation.getString(properties.Issuer) : undefined));
  ret.addPropertyResult("onUnauthenticatedRequest", "OnUnauthenticatedRequest", (properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined));
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("sessionCookieName", "SessionCookieName", (properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined));
  ret.addPropertyResult("sessionTimeout", "SessionTimeout", (properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeout) : undefined));
  ret.addPropertyResult("tokenEndpoint", "TokenEndpoint", (properties.TokenEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.TokenEndpoint) : undefined));
  ret.addPropertyResult("useExistingClientSecret", "UseExistingClientSecret", (properties.UseExistingClientSecret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseExistingClientSecret) : undefined));
  ret.addPropertyResult("userInfoEndpoint", "UserInfoEndpoint", (properties.UserInfoEndpoint != null ? cfn_parse.FromCloudFormation.getString(properties.UserInfoEndpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authenticateCognitoConfig", CfnListenerRuleAuthenticateCognitoConfigPropertyValidator)(properties.authenticateCognitoConfig));
  errors.collect(cdk.propertyValidator("authenticateOidcConfig", CfnListenerRuleAuthenticateOidcConfigPropertyValidator)(properties.authenticateOidcConfig));
  errors.collect(cdk.propertyValidator("fixedResponseConfig", CfnListenerRuleFixedResponseConfigPropertyValidator)(properties.fixedResponseConfig));
  errors.collect(cdk.propertyValidator("forwardConfig", CfnListenerRuleForwardConfigPropertyValidator)(properties.forwardConfig));
  errors.collect(cdk.propertyValidator("order", cdk.validateNumber)(properties.order));
  errors.collect(cdk.propertyValidator("redirectConfig", CfnListenerRuleRedirectConfigPropertyValidator)(properties.redirectConfig));
  errors.collect(cdk.propertyValidator("targetGroupArn", cdk.validateString)(properties.targetGroupArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleActionPropertyValidator(properties).assertSuccess();
  return {
    "AuthenticateCognitoConfig": convertCfnListenerRuleAuthenticateCognitoConfigPropertyToCloudFormation(properties.authenticateCognitoConfig),
    "AuthenticateOidcConfig": convertCfnListenerRuleAuthenticateOidcConfigPropertyToCloudFormation(properties.authenticateOidcConfig),
    "FixedResponseConfig": convertCfnListenerRuleFixedResponseConfigPropertyToCloudFormation(properties.fixedResponseConfig),
    "ForwardConfig": convertCfnListenerRuleForwardConfigPropertyToCloudFormation(properties.forwardConfig),
    "Order": cdk.numberToCloudFormation(properties.order),
    "RedirectConfig": convertCfnListenerRuleRedirectConfigPropertyToCloudFormation(properties.redirectConfig),
    "TargetGroupArn": cdk.stringToCloudFormation(properties.targetGroupArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.ActionProperty>();
  ret.addPropertyResult("authenticateCognitoConfig", "AuthenticateCognitoConfig", (properties.AuthenticateCognitoConfig != null ? CfnListenerRuleAuthenticateCognitoConfigPropertyFromCloudFormation(properties.AuthenticateCognitoConfig) : undefined));
  ret.addPropertyResult("authenticateOidcConfig", "AuthenticateOidcConfig", (properties.AuthenticateOidcConfig != null ? CfnListenerRuleAuthenticateOidcConfigPropertyFromCloudFormation(properties.AuthenticateOidcConfig) : undefined));
  ret.addPropertyResult("fixedResponseConfig", "FixedResponseConfig", (properties.FixedResponseConfig != null ? CfnListenerRuleFixedResponseConfigPropertyFromCloudFormation(properties.FixedResponseConfig) : undefined));
  ret.addPropertyResult("forwardConfig", "ForwardConfig", (properties.ForwardConfig != null ? CfnListenerRuleForwardConfigPropertyFromCloudFormation(properties.ForwardConfig) : undefined));
  ret.addPropertyResult("order", "Order", (properties.Order != null ? cfn_parse.FromCloudFormation.getNumber(properties.Order) : undefined));
  ret.addPropertyResult("redirectConfig", "RedirectConfig", (properties.RedirectConfig != null ? CfnListenerRuleRedirectConfigPropertyFromCloudFormation(properties.RedirectConfig) : undefined));
  ret.addPropertyResult("targetGroupArn", "TargetGroupArn", (properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HttpHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleHttpHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("httpHeaderName", cdk.validateString)(properties.httpHeaderName));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"HttpHeaderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleHttpHeaderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleHttpHeaderConfigPropertyValidator(properties).assertSuccess();
  return {
    "HttpHeaderName": cdk.stringToCloudFormation(properties.httpHeaderName),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleHttpHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.HttpHeaderConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.HttpHeaderConfigProperty>();
  ret.addPropertyResult("httpHeaderName", "HttpHeaderName", (properties.HttpHeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HttpHeaderName) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryStringKeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringKeyValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleQueryStringKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"QueryStringKeyValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleQueryStringKeyValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleQueryStringKeyValuePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleQueryStringKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.QueryStringKeyValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.QueryStringKeyValueProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryStringConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleQueryStringConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(CfnListenerRuleQueryStringKeyValuePropertyValidator))(properties.values));
  return errors.wrap("supplied properties not correct for \"QueryStringConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleQueryStringConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleQueryStringConfigPropertyValidator(properties).assertSuccess();
  return {
    "Values": cdk.listMapper(convertCfnListenerRuleQueryStringKeyValuePropertyToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleQueryStringConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.QueryStringConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.QueryStringConfigProperty>();
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerRuleQueryStringKeyValuePropertyFromCloudFormation)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HostHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HostHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleHostHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"HostHeaderConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleHostHeaderConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleHostHeaderConfigPropertyValidator(properties).assertSuccess();
  return {
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleHostHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.HostHeaderConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.HostHeaderConfigProperty>();
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpRequestMethodConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRequestMethodConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleHttpRequestMethodConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"HttpRequestMethodConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleHttpRequestMethodConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleHttpRequestMethodConfigPropertyValidator(properties).assertSuccess();
  return {
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleHttpRequestMethodConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.HttpRequestMethodConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.HttpRequestMethodConfigProperty>();
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PathPatternConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PathPatternConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRulePathPatternConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"PathPatternConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRulePathPatternConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRulePathPatternConfigPropertyValidator(properties).assertSuccess();
  return {
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRulePathPatternConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.PathPatternConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.PathPatternConfigProperty>();
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SourceIpConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceIpConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleSourceIpConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"SourceIpConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleSourceIpConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleSourceIpConfigPropertyValidator(properties).assertSuccess();
  return {
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleSourceIpConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.SourceIpConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.SourceIpConfigProperty>();
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleConditionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleConditionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRuleRuleConditionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("field", cdk.validateString)(properties.field));
  errors.collect(cdk.propertyValidator("hostHeaderConfig", CfnListenerRuleHostHeaderConfigPropertyValidator)(properties.hostHeaderConfig));
  errors.collect(cdk.propertyValidator("httpHeaderConfig", CfnListenerRuleHttpHeaderConfigPropertyValidator)(properties.httpHeaderConfig));
  errors.collect(cdk.propertyValidator("httpRequestMethodConfig", CfnListenerRuleHttpRequestMethodConfigPropertyValidator)(properties.httpRequestMethodConfig));
  errors.collect(cdk.propertyValidator("pathPatternConfig", CfnListenerRulePathPatternConfigPropertyValidator)(properties.pathPatternConfig));
  errors.collect(cdk.propertyValidator("queryStringConfig", CfnListenerRuleQueryStringConfigPropertyValidator)(properties.queryStringConfig));
  errors.collect(cdk.propertyValidator("sourceIpConfig", CfnListenerRuleSourceIpConfigPropertyValidator)(properties.sourceIpConfig));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"RuleConditionProperty\"");
}

// @ts-ignore TS6133
function convertCfnListenerRuleRuleConditionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRuleRuleConditionPropertyValidator(properties).assertSuccess();
  return {
    "Field": cdk.stringToCloudFormation(properties.field),
    "HostHeaderConfig": convertCfnListenerRuleHostHeaderConfigPropertyToCloudFormation(properties.hostHeaderConfig),
    "HttpHeaderConfig": convertCfnListenerRuleHttpHeaderConfigPropertyToCloudFormation(properties.httpHeaderConfig),
    "HttpRequestMethodConfig": convertCfnListenerRuleHttpRequestMethodConfigPropertyToCloudFormation(properties.httpRequestMethodConfig),
    "PathPatternConfig": convertCfnListenerRulePathPatternConfigPropertyToCloudFormation(properties.pathPatternConfig),
    "QueryStringConfig": convertCfnListenerRuleQueryStringConfigPropertyToCloudFormation(properties.queryStringConfig),
    "SourceIpConfig": convertCfnListenerRuleSourceIpConfigPropertyToCloudFormation(properties.sourceIpConfig),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnListenerRuleRuleConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnListenerRule.RuleConditionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.RuleConditionProperty>();
  ret.addPropertyResult("field", "Field", (properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined));
  ret.addPropertyResult("hostHeaderConfig", "HostHeaderConfig", (properties.HostHeaderConfig != null ? CfnListenerRuleHostHeaderConfigPropertyFromCloudFormation(properties.HostHeaderConfig) : undefined));
  ret.addPropertyResult("httpHeaderConfig", "HttpHeaderConfig", (properties.HttpHeaderConfig != null ? CfnListenerRuleHttpHeaderConfigPropertyFromCloudFormation(properties.HttpHeaderConfig) : undefined));
  ret.addPropertyResult("httpRequestMethodConfig", "HttpRequestMethodConfig", (properties.HttpRequestMethodConfig != null ? CfnListenerRuleHttpRequestMethodConfigPropertyFromCloudFormation(properties.HttpRequestMethodConfig) : undefined));
  ret.addPropertyResult("pathPatternConfig", "PathPatternConfig", (properties.PathPatternConfig != null ? CfnListenerRulePathPatternConfigPropertyFromCloudFormation(properties.PathPatternConfig) : undefined));
  ret.addPropertyResult("queryStringConfig", "QueryStringConfig", (properties.QueryStringConfig != null ? CfnListenerRuleQueryStringConfigPropertyFromCloudFormation(properties.QueryStringConfig) : undefined));
  ret.addPropertyResult("sourceIpConfig", "SourceIpConfig", (properties.SourceIpConfig != null ? CfnListenerRuleSourceIpConfigPropertyFromCloudFormation(properties.SourceIpConfig) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnListenerRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnListenerRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnListenerRuleActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("conditions", cdk.requiredValidator)(properties.conditions));
  errors.collect(cdk.propertyValidator("conditions", cdk.listValidator(CfnListenerRuleRuleConditionPropertyValidator))(properties.conditions));
  errors.collect(cdk.propertyValidator("listenerArn", cdk.validateString)(properties.listenerArn));
  errors.collect(cdk.propertyValidator("priority", cdk.requiredValidator)(properties.priority));
  errors.collect(cdk.propertyValidator("priority", cdk.validateNumber)(properties.priority));
  return errors.wrap("supplied properties not correct for \"CfnListenerRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnListenerRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnListenerRulePropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnListenerRuleActionPropertyToCloudFormation)(properties.actions),
    "Conditions": cdk.listMapper(convertCfnListenerRuleRuleConditionPropertyToCloudFormation)(properties.conditions),
    "ListenerArn": cdk.stringToCloudFormation(properties.listenerArn),
    "Priority": cdk.numberToCloudFormation(properties.priority)
  };
}

// @ts-ignore TS6133
function CfnListenerRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRuleProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerRuleActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("conditions", "Conditions", (properties.Conditions != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerRuleRuleConditionPropertyFromCloudFormation)(properties.Conditions) : undefined));
  ret.addPropertyResult("listenerArn", "ListenerArn", (properties.ListenerArn != null ? cfn_parse.FromCloudFormation.getString(properties.ListenerArn) : undefined));
  ret.addPropertyResult("priority", "Priority", (properties.Priority != null ? cfn_parse.FromCloudFormation.getNumber(properties.Priority) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::LoadBalancer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html
 */
export class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::LoadBalancer";

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
   * The ID of the Amazon Route 53 hosted zone associated with the load balancer. For example, `Z2P70J7EXAMPLE` .
   *
   * @cloudformationAttribute CanonicalHostedZoneID
   */
  public readonly attrCanonicalHostedZoneId: string;

  /**
   * The DNS name for the load balancer. For example, `my-load-balancer-424835706.us-west-2.elb.amazonaws.com` .
   *
   * @cloudformationAttribute DNSName
   */
  public readonly attrDnsName: string;

  /**
   * The Amazon Resource Name (ARN) of the load balancer.
   *
   * @cloudformationAttribute LoadBalancerArn
   */
  public readonly attrLoadBalancerArn: string;

  /**
   * The full name of the load balancer. For example, `app/my-load-balancer/50dc6c495c0c9188` .
   *
   * @cloudformationAttribute LoadBalancerFullName
   */
  public readonly attrLoadBalancerFullName: string;

  /**
   * The name of the load balancer. For example, `my-load-balancer` .
   *
   * @cloudformationAttribute LoadBalancerName
   */
  public readonly attrLoadBalancerName: string;

  /**
   * The IDs of the security groups for the load balancer.
   *
   * @cloudformationAttribute SecurityGroups
   */
  public readonly attrSecurityGroups: Array<string>;

  /**
   * The IP address type.
   */
  public ipAddressType?: string;

  /**
   * The load balancer attributes.
   */
  public loadBalancerAttributes?: Array<cdk.IResolvable | CfnLoadBalancer.LoadBalancerAttributeProperty> | cdk.IResolvable;

  /**
   * The name of the load balancer.
   */
  public name?: string;

  /**
   * The nodes of an Internet-facing load balancer have public IP addresses.
   */
  public scheme?: string;

  /**
   * [Application Load Balancers and Network Load Balancers] The IDs of the security groups for the load balancer.
   */
  public securityGroups?: Array<string>;

  /**
   * The IDs of the public subnets.
   */
  public subnetMappings?: Array<cdk.IResolvable | CfnLoadBalancer.SubnetMappingProperty> | cdk.IResolvable;

  /**
   * The IDs of the public subnets.
   */
  public subnets?: Array<string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the load balancer.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of load balancer.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerProps = {}) {
    super(scope, id, {
      "type": CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrCanonicalHostedZoneId = cdk.Token.asString(this.getAtt("CanonicalHostedZoneID", cdk.ResolutionTypeHint.STRING));
    this.attrDnsName = cdk.Token.asString(this.getAtt("DNSName", cdk.ResolutionTypeHint.STRING));
    this.attrLoadBalancerArn = cdk.Token.asString(this.getAtt("LoadBalancerArn", cdk.ResolutionTypeHint.STRING));
    this.attrLoadBalancerFullName = cdk.Token.asString(this.getAtt("LoadBalancerFullName", cdk.ResolutionTypeHint.STRING));
    this.attrLoadBalancerName = cdk.Token.asString(this.getAtt("LoadBalancerName", cdk.ResolutionTypeHint.STRING));
    this.attrSecurityGroups = cdk.Token.asList(this.getAtt("SecurityGroups", cdk.ResolutionTypeHint.STRING_LIST));
    this.ipAddressType = props.ipAddressType;
    this.loadBalancerAttributes = props.loadBalancerAttributes;
    this.name = props.name;
    this.scheme = props.scheme;
    this.securityGroups = props.securityGroups;
    this.subnetMappings = props.subnetMappings;
    this.subnets = props.subnets;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticLoadBalancingV2::LoadBalancer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ipAddressType": this.ipAddressType,
      "loadBalancerAttributes": this.loadBalancerAttributes,
      "name": this.name,
      "scheme": this.scheme,
      "securityGroups": this.securityGroups,
      "subnetMappings": this.subnetMappings,
      "subnets": this.subnets,
      "tags": this.tags.renderTags(),
      "type": this.type
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
   * Specifies an attribute for an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattribute.html
   */
  export interface LoadBalancerAttributeProperty {
    /**
     * The name of the attribute.
     *
     * The following attributes are supported by all load balancers:
     *
     * - `deletion_protection.enabled` - Indicates whether deletion protection is enabled. The value is `true` or `false` . The default is `false` .
     * - `load_balancing.cross_zone.enabled` - Indicates whether cross-zone load balancing is enabled. The possible values are `true` and `false` . The default for Network Load Balancers and Gateway Load Balancers is `false` . The default for Application Load Balancers is `true` , and cannot be changed.
     *
     * The following attributes are supported by both Application Load Balancers and Network Load Balancers:
     *
     * - `access_logs.s3.enabled` - Indicates whether access logs are enabled. The value is `true` or `false` . The default is `false` .
     * - `access_logs.s3.bucket` - The name of the S3 bucket for the access logs. This attribute is required if access logs are enabled. The bucket must exist in the same region as the load balancer and have a bucket policy that grants Elastic Load Balancing permissions to write to the bucket.
     * - `access_logs.s3.prefix` - The prefix for the location in the S3 bucket for the access logs.
     * - `ipv6.deny_all_igw_traffic` - Blocks internet gateway (IGW) access to the load balancer. It is set to `false` for internet-facing load balancers and `true` for internal load balancers, preventing unintended access to your internal load balancer through an internet gateway.
     *
     * The following attributes are supported by only Application Load Balancers:
     *
     * - `idle_timeout.timeout_seconds` - The idle timeout value, in seconds. The valid range is 1-4000 seconds. The default is 60 seconds.
     * - `connection_logs.s3.enabled` - Indicates whether connection logs are enabled. The value is `true` or `false` . The default is `false` .
     * - `connection_logs.s3.bucket` - The name of the S3 bucket for the connection logs. This attribute is required if connection logs are enabled. The bucket must exist in the same region as the load balancer and have a bucket policy that grants Elastic Load Balancing permissions to write to the bucket.
     * - `connection_logs.s3.prefix` - The prefix for the location in the S3 bucket for the connection logs.
     * - `routing.http.desync_mitigation_mode` - Determines how the load balancer handles requests that might pose a security risk to your application. The possible values are `monitor` , `defensive` , and `strictest` . The default is `defensive` .
     * - `routing.http.drop_invalid_header_fields.enabled` - Indicates whether HTTP headers with invalid header fields are removed by the load balancer ( `true` ) or routed to targets ( `false` ). The default is `false` .
     * - `routing.http.preserve_host_header.enabled` - Indicates whether the Application Load Balancer should preserve the `Host` header in the HTTP request and send it to the target without any change. The possible values are `true` and `false` . The default is `false` .
     * - `routing.http.x_amzn_tls_version_and_cipher_suite.enabled` - Indicates whether the two headers ( `x-amzn-tls-version` and `x-amzn-tls-cipher-suite` ), which contain information about the negotiated TLS version and cipher suite, are added to the client request before sending it to the target. The `x-amzn-tls-version` header has information about the TLS protocol version negotiated with the client, and the `x-amzn-tls-cipher-suite` header has information about the cipher suite negotiated with the client. Both headers are in OpenSSL format. The possible values for the attribute are `true` and `false` . The default is `false` .
     * - `routing.http.xff_client_port.enabled` - Indicates whether the `X-Forwarded-For` header should preserve the source port that the client used to connect to the load balancer. The possible values are `true` and `false` . The default is `false` .
     * - `routing.http.xff_header_processing.mode` - Enables you to modify, preserve, or remove the `X-Forwarded-For` header in the HTTP request before the Application Load Balancer sends the request to the target. The possible values are `append` , `preserve` , and `remove` . The default is `append` .
     *
     * - If the value is `append` , the Application Load Balancer adds the client IP address (of the last hop) to the `X-Forwarded-For` header in the HTTP request before it sends it to targets.
     * - If the value is `preserve` the Application Load Balancer preserves the `X-Forwarded-For` header in the HTTP request, and sends it to targets without any change.
     * - If the value is `remove` , the Application Load Balancer removes the `X-Forwarded-For` header in the HTTP request before it sends it to targets.
     * - `routing.http2.enabled` - Indicates whether HTTP/2 is enabled. The possible values are `true` and `false` . The default is `true` . Elastic Load Balancing requires that message header names contain only alphanumeric characters and hyphens.
     * - `waf.fail_open.enabled` - Indicates whether to allow a WAF-enabled load balancer to route requests to targets if it is unable to forward the request to AWS WAF. The possible values are `true` and `false` . The default is `false` .
     *
     * The following attributes are supported by only Network Load Balancers:
     *
     * - `dns_record.client_routing_policy` - Indicates how traffic is distributed among the load balancer Availability Zones. The possible values are `availability_zone_affinity` with 100 percent zonal affinity, `partial_availability_zone_affinity` with 85 percent zonal affinity, and `any_availability_zone` with 0 percent zonal affinity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattribute.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattribute-key
     */
    readonly key?: string;

    /**
     * The value of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattribute.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattribute-value
     */
    readonly value?: string;
  }

  /**
   * Specifies a subnet for a load balancer.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html
   */
  export interface SubnetMappingProperty {
    /**
     * [Network Load Balancers] The allocation ID of the Elastic IP address for an internet-facing load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-allocationid
     */
    readonly allocationId?: string;

    /**
     * [Network Load Balancers] The IPv6 address.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-ipv6address
     */
    readonly iPv6Address?: string;

    /**
     * [Network Load Balancers] The private IPv4 address for an internal load balancer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-privateipv4address
     */
    readonly privateIPv4Address?: string;

    /**
     * The ID of the subnet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-subnetid
     */
    readonly subnetId: string;
  }
}

/**
 * Properties for defining a `CfnLoadBalancer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html
 */
export interface CfnLoadBalancerProps {
  /**
   * The IP address type.
   *
   * The possible values are `ipv4` (for IPv4 addresses) and `dualstack` (for IPv4 and IPv6 addresses). You can’t specify `dualstack` for a load balancer with a UDP or TCP_UDP listener.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-ipaddresstype
   */
  readonly ipAddressType?: string;

  /**
   * The load balancer attributes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattributes
   */
  readonly loadBalancerAttributes?: Array<cdk.IResolvable | CfnLoadBalancer.LoadBalancerAttributeProperty> | cdk.IResolvable;

  /**
   * The name of the load balancer.
   *
   * This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, must not begin or end with a hyphen, and must not begin with "internal-".
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-name
   */
  readonly name?: string;

  /**
   * The nodes of an Internet-facing load balancer have public IP addresses.
   *
   * The DNS name of an Internet-facing load balancer is publicly resolvable to the public IP addresses of the nodes. Therefore, Internet-facing load balancers can route requests from clients over the internet.
   *
   * The nodes of an internal load balancer have only private IP addresses. The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes. Therefore, internal load balancers can route requests only from clients with access to the VPC for the load balancer.
   *
   * The default is an Internet-facing load balancer.
   *
   * You cannot specify a scheme for a Gateway Load Balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-scheme
   */
  readonly scheme?: string;

  /**
   * [Application Load Balancers and Network Load Balancers] The IDs of the security groups for the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-securitygroups
   */
  readonly securityGroups?: Array<string>;

  /**
   * The IDs of the public subnets.
   *
   * You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both.
   *
   * [Application Load Balancers] You must specify subnets from at least two Availability Zones. You cannot specify Elastic IP addresses for your subnets.
   *
   * [Application Load Balancers on Outposts] You must specify one Outpost subnet.
   *
   * [Application Load Balancers on Local Zones] You can specify subnets from one or more Local Zones.
   *
   * [Network Load Balancers] You can specify subnets from one or more Availability Zones. You can specify one Elastic IP address per subnet if you need static IP addresses for your internet-facing load balancer. For internal load balancers, you can specify one private IP address per subnet from the IPv4 range of the subnet. For internet-facing load balancer, you can specify one IPv6 address per subnet.
   *
   * [Gateway Load Balancers] You can specify subnets from one or more Availability Zones. You cannot specify Elastic IP addresses for your subnets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmappings
   */
  readonly subnetMappings?: Array<cdk.IResolvable | CfnLoadBalancer.SubnetMappingProperty> | cdk.IResolvable;

  /**
   * The IDs of the public subnets.
   *
   * You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both. To specify an Elastic IP address, specify subnet mappings instead of subnets.
   *
   * [Application Load Balancers] You must specify subnets from at least two Availability Zones.
   *
   * [Application Load Balancers on Outposts] You must specify one Outpost subnet.
   *
   * [Application Load Balancers on Local Zones] You can specify subnets from one or more Local Zones.
   *
   * [Network Load Balancers] You can specify subnets from one or more Availability Zones.
   *
   * [Gateway Load Balancers] You can specify subnets from one or more Availability Zones.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-subnets
   */
  readonly subnets?: Array<string>;

  /**
   * The tags to assign to the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of load balancer.
   *
   * The default is `application` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `LoadBalancerAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBalancerAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerLoadBalancerAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"LoadBalancerAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerLoadBalancerAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerLoadBalancerAttributePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerLoadBalancerAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoadBalancer.LoadBalancerAttributeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.LoadBalancerAttributeProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubnetMappingProperty`
 *
 * @param properties - the TypeScript properties of a `SubnetMappingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerSubnetMappingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allocationId", cdk.validateString)(properties.allocationId));
  errors.collect(cdk.propertyValidator("iPv6Address", cdk.validateString)(properties.iPv6Address));
  errors.collect(cdk.propertyValidator("privateIPv4Address", cdk.validateString)(properties.privateIPv4Address));
  errors.collect(cdk.propertyValidator("subnetId", cdk.requiredValidator)(properties.subnetId));
  errors.collect(cdk.propertyValidator("subnetId", cdk.validateString)(properties.subnetId));
  return errors.wrap("supplied properties not correct for \"SubnetMappingProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerSubnetMappingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerSubnetMappingPropertyValidator(properties).assertSuccess();
  return {
    "AllocationId": cdk.stringToCloudFormation(properties.allocationId),
    "IPv6Address": cdk.stringToCloudFormation(properties.iPv6Address),
    "PrivateIPv4Address": cdk.stringToCloudFormation(properties.privateIPv4Address),
    "SubnetId": cdk.stringToCloudFormation(properties.subnetId)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerSubnetMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoadBalancer.SubnetMappingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.SubnetMappingProperty>();
  ret.addPropertyResult("allocationId", "AllocationId", (properties.AllocationId != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationId) : undefined));
  ret.addPropertyResult("iPv6Address", "IPv6Address", (properties.IPv6Address != null ? cfn_parse.FromCloudFormation.getString(properties.IPv6Address) : undefined));
  ret.addPropertyResult("privateIPv4Address", "PrivateIPv4Address", (properties.PrivateIPv4Address != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateIPv4Address) : undefined));
  ret.addPropertyResult("subnetId", "SubnetId", (properties.SubnetId != null ? cfn_parse.FromCloudFormation.getString(properties.SubnetId) : undefined));
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
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("loadBalancerAttributes", cdk.listValidator(CfnLoadBalancerLoadBalancerAttributePropertyValidator))(properties.loadBalancerAttributes));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("scheme", cdk.validateString)(properties.scheme));
  errors.collect(cdk.propertyValidator("securityGroups", cdk.listValidator(cdk.validateString))(properties.securityGroups));
  errors.collect(cdk.propertyValidator("subnetMappings", cdk.listValidator(CfnLoadBalancerSubnetMappingPropertyValidator))(properties.subnetMappings));
  errors.collect(cdk.propertyValidator("subnets", cdk.listValidator(cdk.validateString))(properties.subnets));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnLoadBalancerProps\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerPropsValidator(properties).assertSuccess();
  return {
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "LoadBalancerAttributes": cdk.listMapper(convertCfnLoadBalancerLoadBalancerAttributePropertyToCloudFormation)(properties.loadBalancerAttributes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Scheme": cdk.stringToCloudFormation(properties.scheme),
    "SecurityGroups": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
    "SubnetMappings": cdk.listMapper(convertCfnLoadBalancerSubnetMappingPropertyToCloudFormation)(properties.subnetMappings),
    "Subnets": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
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
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addPropertyResult("loadBalancerAttributes", "LoadBalancerAttributes", (properties.LoadBalancerAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerLoadBalancerAttributePropertyFromCloudFormation)(properties.LoadBalancerAttributes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("scheme", "Scheme", (properties.Scheme != null ? cfn_parse.FromCloudFormation.getString(properties.Scheme) : undefined));
  ret.addPropertyResult("securityGroups", "SecurityGroups", (properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroups) : undefined));
  ret.addPropertyResult("subnetMappings", "SubnetMappings", (properties.SubnetMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerSubnetMappingPropertyFromCloudFormation)(properties.SubnetMappings) : undefined));
  ret.addPropertyResult("subnets", "Subnets", (properties.Subnets != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Subnets) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a target group for an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
 *
 * Before you register a Lambda function as a target, you must create a `AWS::Lambda::Permission` resource that grants the Elastic Load Balancing service principal permission to invoke the Lambda function.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::TargetGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html
 */
export class CfnTargetGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::TargetGroup";

  /**
   * Build a CfnTargetGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTargetGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTargetGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTargetGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the load balancer that routes traffic to this target group.
   *
   * @cloudformationAttribute LoadBalancerArns
   */
  public readonly attrLoadBalancerArns: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the target group.
   *
   * @cloudformationAttribute TargetGroupArn
   */
  public readonly attrTargetGroupArn: string;

  /**
   * The full name of the target group. For example, `targetgroup/my-target-group/cbf133c568e0d028` .
   *
   * @cloudformationAttribute TargetGroupFullName
   */
  public readonly attrTargetGroupFullName: string;

  /**
   * The name of the target group. For example, `my-target-group` .
   *
   * @cloudformationAttribute TargetGroupName
   */
  public readonly attrTargetGroupName: string;

  /**
   * Indicates whether health checks are enabled.
   */
  public healthCheckEnabled?: boolean | cdk.IResolvable;

  /**
   * The approximate amount of time, in seconds, between health checks of an individual target.
   */
  public healthCheckIntervalSeconds?: number;

  /**
   * [HTTP/HTTPS health checks] The destination for health checks on the targets.
   */
  public healthCheckPath?: string;

  /**
   * The port the load balancer uses when performing health checks on targets.
   */
  public healthCheckPort?: string;

  /**
   * The protocol the load balancer uses when performing health checks on targets.
   */
  public healthCheckProtocol?: string;

  /**
   * The amount of time, in seconds, during which no response from a target means a failed health check.
   */
  public healthCheckTimeoutSeconds?: number;

  /**
   * The number of consecutive health check successes required before considering a target healthy.
   */
  public healthyThresholdCount?: number;

  /**
   * The type of IP address used for this target group.
   */
  public ipAddressType?: string;

  /**
   * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target.
   */
  public matcher?: cdk.IResolvable | CfnTargetGroup.MatcherProperty;

  /**
   * The name of the target group.
   */
  public name?: string;

  /**
   * The port on which the targets receive traffic.
   */
  public port?: number;

  /**
   * The protocol to use for routing traffic to the targets.
   */
  public protocol?: string;

  /**
   * [HTTP/HTTPS protocol] The protocol version.
   */
  public protocolVersion?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The attributes.
   */
  public targetGroupAttributes?: Array<cdk.IResolvable | CfnTargetGroup.TargetGroupAttributeProperty> | cdk.IResolvable;

  /**
   * The targets.
   */
  public targets?: Array<cdk.IResolvable | CfnTargetGroup.TargetDescriptionProperty> | cdk.IResolvable;

  /**
   * The type of target that you must specify when registering targets with this target group.
   */
  public targetType?: string;

  /**
   * The number of consecutive health check failures required before considering a target unhealthy.
   */
  public unhealthyThresholdCount?: number;

  /**
   * The identifier of the virtual private cloud (VPC).
   */
  public vpcId?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTargetGroupProps = {}) {
    super(scope, id, {
      "type": CfnTargetGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrLoadBalancerArns = cdk.Token.asList(this.getAtt("LoadBalancerArns", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrTargetGroupArn = cdk.Token.asString(this.getAtt("TargetGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrTargetGroupFullName = cdk.Token.asString(this.getAtt("TargetGroupFullName", cdk.ResolutionTypeHint.STRING));
    this.attrTargetGroupName = cdk.Token.asString(this.getAtt("TargetGroupName", cdk.ResolutionTypeHint.STRING));
    this.healthCheckEnabled = props.healthCheckEnabled;
    this.healthCheckIntervalSeconds = props.healthCheckIntervalSeconds;
    this.healthCheckPath = props.healthCheckPath;
    this.healthCheckPort = props.healthCheckPort;
    this.healthCheckProtocol = props.healthCheckProtocol;
    this.healthCheckTimeoutSeconds = props.healthCheckTimeoutSeconds;
    this.healthyThresholdCount = props.healthyThresholdCount;
    this.ipAddressType = props.ipAddressType;
    this.matcher = props.matcher;
    this.name = props.name;
    this.port = props.port;
    this.protocol = props.protocol;
    this.protocolVersion = props.protocolVersion;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticLoadBalancingV2::TargetGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.targetGroupAttributes = props.targetGroupAttributes;
    this.targets = props.targets;
    this.targetType = props.targetType;
    this.unhealthyThresholdCount = props.unhealthyThresholdCount;
    this.vpcId = props.vpcId;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "healthCheckEnabled": this.healthCheckEnabled,
      "healthCheckIntervalSeconds": this.healthCheckIntervalSeconds,
      "healthCheckPath": this.healthCheckPath,
      "healthCheckPort": this.healthCheckPort,
      "healthCheckProtocol": this.healthCheckProtocol,
      "healthCheckTimeoutSeconds": this.healthCheckTimeoutSeconds,
      "healthyThresholdCount": this.healthyThresholdCount,
      "ipAddressType": this.ipAddressType,
      "matcher": this.matcher,
      "name": this.name,
      "port": this.port,
      "protocol": this.protocol,
      "protocolVersion": this.protocolVersion,
      "tags": this.tags.renderTags(),
      "targetGroupAttributes": this.targetGroupAttributes,
      "targets": this.targets,
      "targetType": this.targetType,
      "unhealthyThresholdCount": this.unhealthyThresholdCount,
      "vpcId": this.vpcId
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTargetGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTargetGroupPropsToCloudFormation(props);
  }
}

export namespace CfnTargetGroup {
  /**
   * Specifies the HTTP codes that healthy targets must use when responding to an HTTP health check.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html
   */
  export interface MatcherProperty {
    /**
     * You can specify values between 0 and 99.
     *
     * You can specify multiple values (for example, "0,1") or a range of values (for example, "0-5"). The default value is 12.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html#cfn-elasticloadbalancingv2-targetgroup-matcher-grpccode
     */
    readonly grpcCode?: string;

    /**
     * For Application Load Balancers, you can specify values between 200 and 499, with the default value being 200.
     *
     * You can specify multiple values (for example, "200,202") or a range of values (for example, "200-299").
     *
     * For Network Load Balancers, you can specify values between 200 and 599, with the default value being 200-399. You can specify multiple values (for example, "200,202") or a range of values (for example, "200-299").
     *
     * For Gateway Load Balancers, this must be "200–399".
     *
     * Note that when using shorthand syntax, some values such as commas need to be escaped.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html#cfn-elasticloadbalancingv2-targetgroup-matcher-httpcode
     */
    readonly httpCode?: string;
  }

  /**
   * Specifies a target to add to a target group.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html
   */
  export interface TargetDescriptionProperty {
    /**
     * An Availability Zone or `all` .
     *
     * This determines whether the target receives traffic from the load balancer nodes in the specified Availability Zone or from all enabled Availability Zones for the load balancer.
     *
     * For Application Load Balancer target groups, the specified Availability Zone value is only applicable when cross-zone load balancing is off. Otherwise the parameter is ignored and treated as `all` .
     *
     * This parameter is not supported if the target type of the target group is `instance` or `alb` .
     *
     * If the target type is `ip` and the IP address is in a subnet of the VPC for the target group, the Availability Zone is automatically detected and this parameter is optional. If the IP address is outside the VPC, this parameter is required.
     *
     * For Application Load Balancer target groups with cross-zone load balancing off, if the target type is `ip` and the IP address is outside of the VPC for the target group, this should be an Availability Zone inside the VPC for the target group.
     *
     * If the target type is `lambda` , this parameter is optional and the only supported value is `all` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html#cfn-elasticloadbalancingv2-targetgroup-targetdescription-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The ID of the target.
     *
     * If the target type of the target group is `instance` , specify an instance ID. If the target type is `ip` , specify an IP address. If the target type is `lambda` , specify the ARN of the Lambda function. If the target type is `alb` , specify the ARN of the Application Load Balancer target.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html#cfn-elasticloadbalancingv2-targetgroup-targetdescription-id
     */
    readonly id: string;

    /**
     * The port on which the target is listening.
     *
     * If the target group protocol is GENEVE, the supported port is 6081. If the target type is `alb` , the targeted Application Load Balancer must have at least one listener whose port matches the target group port. This parameter is not used if the target is a Lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html#cfn-elasticloadbalancingv2-targetgroup-targetdescription-port
     */
    readonly port?: number;
  }

  /**
   * Specifies a target group attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html
   */
  export interface TargetGroupAttributeProperty {
    /**
     * The name of the attribute.
     *
     * The following attributes are supported by all load balancers:
     *
     * - `deregistration_delay.timeout_seconds` - The amount of time, in seconds, for Elastic Load Balancing to wait before changing the state of a deregistering target from `draining` to `unused` . The range is 0-3600 seconds. The default value is 300 seconds. If the target is a Lambda function, this attribute is not supported.
     * - `stickiness.enabled` - Indicates whether target stickiness is enabled. The value is `true` or `false` . The default is `false` .
     * - `stickiness.type` - Indicates the type of stickiness. The possible values are:
     *
     * - `lb_cookie` and `app_cookie` for Application Load Balancers.
     * - `source_ip` for Network Load Balancers.
     * - `source_ip_dest_ip` and `source_ip_dest_ip_proto` for Gateway Load Balancers.
     *
     * The following attributes are supported by Application Load Balancers and Network Load Balancers:
     *
     * - `load_balancing.cross_zone.enabled` - Indicates whether cross zone load balancing is enabled. The value is `true` , `false` or `use_load_balancer_configuration` . The default is `use_load_balancer_configuration` .
     * - `target_group_health.dns_failover.minimum_healthy_targets.count` - The minimum number of targets that must be healthy. If the number of healthy targets is below this value, mark the zone as unhealthy in DNS, so that traffic is routed only to healthy zones. The possible values are `off` or an integer from 1 to the maximum number of targets. The default is `off` .
     * - `target_group_health.dns_failover.minimum_healthy_targets.percentage` - The minimum percentage of targets that must be healthy. If the percentage of healthy targets is below this value, mark the zone as unhealthy in DNS, so that traffic is routed only to healthy zones. The possible values are `off` or an integer from 1 to 100. The default is `off` .
     * - `target_group_health.unhealthy_state_routing.minimum_healthy_targets.count` - The minimum number of targets that must be healthy. If the number of healthy targets is below this value, send traffic to all targets, including unhealthy targets. The possible values are 1 to the maximum number of targets. The default is 1.
     * - `target_group_health.unhealthy_state_routing.minimum_healthy_targets.percentage` - The minimum percentage of targets that must be healthy. If the percentage of healthy targets is below this value, send traffic to all targets, including unhealthy targets. The possible values are `off` or an integer from 1 to 100. The default is `off` .
     *
     * The following attributes are supported only if the load balancer is an Application Load Balancer and the target is an instance or an IP address:
     *
     * - `load_balancing.algorithm.type` - The load balancing algorithm determines how the load balancer selects targets when routing requests. The value is `round_robin` , `least_outstanding_requests` , or `weighted_random` . The default is `round_robin` .
     * - `load_balancing.algorithm.anomaly_mitigation` - Only available when `load_balancing.algorithm.type` is `weighted_random` . Indicates whether anomaly mitigation is enabled. The value is `on` or `off` . The default is `off` .
     * - `slow_start.duration_seconds` - The time period, in seconds, during which a newly registered target receives an increasing share of the traffic to the target group. After this time period ends, the target receives its full share of traffic. The range is 30-900 seconds (15 minutes). The default is 0 seconds (disabled).
     * - `stickiness.app_cookie.cookie_name` - Indicates the name of the application-based cookie. Names that start with the following prefixes are not allowed: `AWSALB` , `AWSALBAPP` , and `AWSALBTG` ; they're reserved for use by the load balancer.
     * - `stickiness.app_cookie.duration_seconds` - The time period, in seconds, during which requests from a client should be routed to the same target. After this time period expires, the application-based cookie is considered stale. The range is 1 second to 1 week (604800 seconds). The default value is 1 day (86400 seconds).
     * - `stickiness.lb_cookie.duration_seconds` - The time period, in seconds, during which requests from a client should be routed to the same target. After this time period expires, the load balancer-generated cookie is considered stale. The range is 1 second to 1 week (604800 seconds). The default value is 1 day (86400 seconds).
     *
     * The following attribute is supported only if the load balancer is an Application Load Balancer and the target is a Lambda function:
     *
     * - `lambda.multi_value_headers.enabled` - Indicates whether the request and response headers that are exchanged between the load balancer and the Lambda function include arrays of values or strings. The value is `true` or `false` . The default is `false` . If the value is `false` and the request contains a duplicate header field name or query parameter key, the load balancer uses the last value sent by the client.
     *
     * The following attributes are supported only by Network Load Balancers:
     *
     * - `deregistration_delay.connection_termination.enabled` - Indicates whether the load balancer terminates connections at the end of the deregistration timeout. The value is `true` or `false` . For new UDP/TCP_UDP target groups the default is `true` . Otherwise, the default is `false` .
     * - `preserve_client_ip.enabled` - Indicates whether client IP preservation is enabled. The value is `true` or `false` . The default is disabled if the target group type is IP address and the target group protocol is TCP or TLS. Otherwise, the default is enabled. Client IP preservation cannot be disabled for UDP and TCP_UDP target groups.
     * - `proxy_protocol_v2.enabled` - Indicates whether Proxy Protocol version 2 is enabled. The value is `true` or `false` . The default is `false` .
     * - `target_health_state.unhealthy.connection_termination.enabled` - Indicates whether the load balancer terminates connections to unhealthy targets. The value is `true` or `false` . The default is `true` .
     *
     * The following attributes are supported only by Gateway Load Balancers:
     *
     * - `target_failover.on_deregistration` - Indicates how the Gateway Load Balancer handles existing flows when a target is deregistered. The possible values are `rebalance` and `no_rebalance` . The default is `no_rebalance` . The two attributes ( `target_failover.on_deregistration` and `target_failover.on_unhealthy` ) can't be set independently. The value you set for both attributes must be the same.
     * - `target_failover.on_unhealthy` - Indicates how the Gateway Load Balancer handles existing flows when a target is unhealthy. The possible values are `rebalance` and `no_rebalance` . The default is `no_rebalance` . The two attributes ( `target_failover.on_deregistration` and `target_failover.on_unhealthy` ) cannot be set independently. The value you set for both attributes must be the same.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattribute-key
     */
    readonly key?: string;

    /**
     * The value of the attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattribute-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnTargetGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html
 */
export interface CfnTargetGroupProps {
  /**
   * Indicates whether health checks are enabled.
   *
   * If the target type is `lambda` , health checks are disabled by default but can be enabled. If the target type is `instance` , `ip` , or `alb` , health checks are always enabled and cannot be disabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckenabled
   */
  readonly healthCheckEnabled?: boolean | cdk.IResolvable;

  /**
   * The approximate amount of time, in seconds, between health checks of an individual target.
   *
   * The range is 5-300. If the target group protocol is TCP, TLS, UDP, TCP_UDP, HTTP or HTTPS, the default is 30 seconds. If the target group protocol is GENEVE, the default is 10 seconds. If the target type is `lambda` , the default is 35 seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckintervalseconds
   */
  readonly healthCheckIntervalSeconds?: number;

  /**
   * [HTTP/HTTPS health checks] The destination for health checks on the targets.
   *
   * [HTTP1 or HTTP2 protocol version] The ping path. The default is /.
   *
   * [GRPC protocol version] The path of a custom health check method with the format /package.service/method. The default is / AWS .ALB/healthcheck.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckpath
   */
  readonly healthCheckPath?: string;

  /**
   * The port the load balancer uses when performing health checks on targets.
   *
   * If the protocol is HTTP, HTTPS, TCP, TLS, UDP, or TCP_UDP, the default is `traffic-port` , which is the port on which each target receives traffic from the load balancer. If the protocol is GENEVE, the default is port 80.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckport
   */
  readonly healthCheckPort?: string;

  /**
   * The protocol the load balancer uses when performing health checks on targets.
   *
   * For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckprotocol
   */
  readonly healthCheckProtocol?: string;

  /**
   * The amount of time, in seconds, during which no response from a target means a failed health check.
   *
   * The range is 2–120 seconds. For target groups with a protocol of HTTP, the default is 6 seconds. For target groups with a protocol of TCP, TLS or HTTPS, the default is 10 seconds. For target groups with a protocol of GENEVE, the default is 5 seconds. If the target type is `lambda` , the default is 30 seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthchecktimeoutseconds
   */
  readonly healthCheckTimeoutSeconds?: number;

  /**
   * The number of consecutive health check successes required before considering a target healthy.
   *
   * The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 5. For target groups with a protocol of GENEVE, the default is 5. If the target type is `lambda` , the default is 5.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthythresholdcount
   */
  readonly healthyThresholdCount?: number;

  /**
   * The type of IP address used for this target group.
   *
   * The possible values are `ipv4` and `ipv6` . This is an optional parameter. If not specified, the IP address type defaults to `ipv4` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-ipaddresstype
   */
  readonly ipAddressType?: string;

  /**
   * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target.
   *
   * For target groups with a protocol of TCP, TCP_UDP, UDP or TLS the range is 200-599. For target groups with a protocol of HTTP or HTTPS, the range is 200-499. For target groups with a protocol of GENEVE, the range is 200-399.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-matcher
   */
  readonly matcher?: cdk.IResolvable | CfnTargetGroup.MatcherProperty;

  /**
   * The name of the target group.
   *
   * This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-name
   */
  readonly name?: string;

  /**
   * The port on which the targets receive traffic.
   *
   * This port is used unless you specify a port override when registering the target. If the target is a Lambda function, this parameter does not apply. If the protocol is GENEVE, the supported port is 6081.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-port
   */
  readonly port?: number;

  /**
   * The protocol to use for routing traffic to the targets.
   *
   * For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, or TCP_UDP. For Gateway Load Balancers, the supported protocol is GENEVE. A TCP_UDP listener must be associated with a TCP_UDP target group. If the target is a Lambda function, this parameter does not apply.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocol
   */
  readonly protocol?: string;

  /**
   * [HTTP/HTTPS protocol] The protocol version.
   *
   * The possible values are `GRPC` , `HTTP1` , and `HTTP2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocolversion
   */
  readonly protocolVersion?: string;

  /**
   * The tags.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The attributes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattributes
   */
  readonly targetGroupAttributes?: Array<cdk.IResolvable | CfnTargetGroup.TargetGroupAttributeProperty> | cdk.IResolvable;

  /**
   * The targets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targets
   */
  readonly targets?: Array<cdk.IResolvable | CfnTargetGroup.TargetDescriptionProperty> | cdk.IResolvable;

  /**
   * The type of target that you must specify when registering targets with this target group.
   *
   * You can't specify targets for a target group using more than one target type.
   *
   * - `instance` - Register targets by instance ID. This is the default value.
   * - `ip` - Register targets by IP address. You can specify IP addresses from the subnets of the virtual private cloud (VPC) for the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify publicly routable IP addresses.
   * - `lambda` - Register a single Lambda function as a target.
   * - `alb` - Register a single Application Load Balancer as a target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targettype
   */
  readonly targetType?: string;

  /**
   * The number of consecutive health check failures required before considering a target unhealthy.
   *
   * The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 2. For target groups with a protocol of GENEVE, the default is 2. If the target type is `lambda` , the default is 5.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-unhealthythresholdcount
   */
  readonly unhealthyThresholdCount?: number;

  /**
   * The identifier of the virtual private cloud (VPC).
   *
   * If the target is a Lambda function, this parameter does not apply. Otherwise, this parameter is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-vpcid
   */
  readonly vpcId?: string;
}

/**
 * Determine whether the given properties match those of a `MatcherProperty`
 *
 * @param properties - the TypeScript properties of a `MatcherProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupMatcherPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("grpcCode", cdk.validateString)(properties.grpcCode));
  errors.collect(cdk.propertyValidator("httpCode", cdk.validateString)(properties.httpCode));
  return errors.wrap("supplied properties not correct for \"MatcherProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupMatcherPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupMatcherPropertyValidator(properties).assertSuccess();
  return {
    "GrpcCode": cdk.stringToCloudFormation(properties.grpcCode),
    "HttpCode": cdk.stringToCloudFormation(properties.httpCode)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupMatcherPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTargetGroup.MatcherProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.MatcherProperty>();
  ret.addPropertyResult("grpcCode", "GrpcCode", (properties.GrpcCode != null ? cfn_parse.FromCloudFormation.getString(properties.GrpcCode) : undefined));
  ret.addPropertyResult("httpCode", "HttpCode", (properties.HttpCode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpCode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `TargetDescriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupTargetDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  return errors.wrap("supplied properties not correct for \"TargetDescriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupTargetDescriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupTargetDescriptionPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Port": cdk.numberToCloudFormation(properties.port)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupTargetDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTargetGroup.TargetDescriptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.TargetDescriptionProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TargetGroupAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupAttributeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupTargetGroupAttributePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TargetGroupAttributeProperty\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupTargetGroupAttributePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupTargetGroupAttributePropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupTargetGroupAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTargetGroup.TargetGroupAttributeProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.TargetGroupAttributeProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTargetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnTargetGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTargetGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthCheckEnabled", cdk.validateBoolean)(properties.healthCheckEnabled));
  errors.collect(cdk.propertyValidator("healthCheckIntervalSeconds", cdk.validateNumber)(properties.healthCheckIntervalSeconds));
  errors.collect(cdk.propertyValidator("healthCheckPath", cdk.validateString)(properties.healthCheckPath));
  errors.collect(cdk.propertyValidator("healthCheckPort", cdk.validateString)(properties.healthCheckPort));
  errors.collect(cdk.propertyValidator("healthCheckProtocol", cdk.validateString)(properties.healthCheckProtocol));
  errors.collect(cdk.propertyValidator("healthCheckTimeoutSeconds", cdk.validateNumber)(properties.healthCheckTimeoutSeconds));
  errors.collect(cdk.propertyValidator("healthyThresholdCount", cdk.validateNumber)(properties.healthyThresholdCount));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("matcher", CfnTargetGroupMatcherPropertyValidator)(properties.matcher));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("port", cdk.validateNumber)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocolVersion", cdk.validateString)(properties.protocolVersion));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("targetGroupAttributes", cdk.listValidator(CfnTargetGroupTargetGroupAttributePropertyValidator))(properties.targetGroupAttributes));
  errors.collect(cdk.propertyValidator("targetType", cdk.validateString)(properties.targetType));
  errors.collect(cdk.propertyValidator("targets", cdk.listValidator(CfnTargetGroupTargetDescriptionPropertyValidator))(properties.targets));
  errors.collect(cdk.propertyValidator("unhealthyThresholdCount", cdk.validateNumber)(properties.unhealthyThresholdCount));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  return errors.wrap("supplied properties not correct for \"CfnTargetGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnTargetGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTargetGroupPropsValidator(properties).assertSuccess();
  return {
    "HealthCheckEnabled": cdk.booleanToCloudFormation(properties.healthCheckEnabled),
    "HealthCheckIntervalSeconds": cdk.numberToCloudFormation(properties.healthCheckIntervalSeconds),
    "HealthCheckPath": cdk.stringToCloudFormation(properties.healthCheckPath),
    "HealthCheckPort": cdk.stringToCloudFormation(properties.healthCheckPort),
    "HealthCheckProtocol": cdk.stringToCloudFormation(properties.healthCheckProtocol),
    "HealthCheckTimeoutSeconds": cdk.numberToCloudFormation(properties.healthCheckTimeoutSeconds),
    "HealthyThresholdCount": cdk.numberToCloudFormation(properties.healthyThresholdCount),
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "Matcher": convertCfnTargetGroupMatcherPropertyToCloudFormation(properties.matcher),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Port": cdk.numberToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ProtocolVersion": cdk.stringToCloudFormation(properties.protocolVersion),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TargetGroupAttributes": cdk.listMapper(convertCfnTargetGroupTargetGroupAttributePropertyToCloudFormation)(properties.targetGroupAttributes),
    "TargetType": cdk.stringToCloudFormation(properties.targetType),
    "Targets": cdk.listMapper(convertCfnTargetGroupTargetDescriptionPropertyToCloudFormation)(properties.targets),
    "UnhealthyThresholdCount": cdk.numberToCloudFormation(properties.unhealthyThresholdCount),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId)
  };
}

// @ts-ignore TS6133
function CfnTargetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroupProps>();
  ret.addPropertyResult("healthCheckEnabled", "HealthCheckEnabled", (properties.HealthCheckEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HealthCheckEnabled) : undefined));
  ret.addPropertyResult("healthCheckIntervalSeconds", "HealthCheckIntervalSeconds", (properties.HealthCheckIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckIntervalSeconds) : undefined));
  ret.addPropertyResult("healthCheckPath", "HealthCheckPath", (properties.HealthCheckPath != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPath) : undefined));
  ret.addPropertyResult("healthCheckPort", "HealthCheckPort", (properties.HealthCheckPort != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPort) : undefined));
  ret.addPropertyResult("healthCheckProtocol", "HealthCheckProtocol", (properties.HealthCheckProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckProtocol) : undefined));
  ret.addPropertyResult("healthCheckTimeoutSeconds", "HealthCheckTimeoutSeconds", (properties.HealthCheckTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckTimeoutSeconds) : undefined));
  ret.addPropertyResult("healthyThresholdCount", "HealthyThresholdCount", (properties.HealthyThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThresholdCount) : undefined));
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addPropertyResult("matcher", "Matcher", (properties.Matcher != null ? CfnTargetGroupMatcherPropertyFromCloudFormation(properties.Matcher) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("protocolVersion", "ProtocolVersion", (properties.ProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolVersion) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("targetGroupAttributes", "TargetGroupAttributes", (properties.TargetGroupAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnTargetGroupTargetGroupAttributePropertyFromCloudFormation)(properties.TargetGroupAttributes) : undefined));
  ret.addPropertyResult("targets", "Targets", (properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnTargetGroupTargetDescriptionPropertyFromCloudFormation)(properties.Targets) : undefined));
  ret.addPropertyResult("targetType", "TargetType", (properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined));
  ret.addPropertyResult("unhealthyThresholdCount", "UnhealthyThresholdCount", (properties.UnhealthyThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThresholdCount) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a trust store.
 *
 * You must specify `CaCertificatesBundleS3Bucket` and `CaCertificatesBundleS3Key` .
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::TrustStore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html
 */
export class CfnTrustStore extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::TrustStore";

  /**
   * Build a CfnTrustStore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrustStore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrustStorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrustStore(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The number of ca certificates in the trust store.
   *
   * @cloudformationAttribute NumberOfCaCertificates
   */
  public readonly attrNumberOfCaCertificates: number;

  /**
   * The current status of the trust store.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The Amazon Resource Name (ARN) of the trust store.
   *
   * @cloudformationAttribute TrustStoreArn
   */
  public readonly attrTrustStoreArn: string;

  /**
   * The Amazon S3 bucket for the ca certificates bundle.
   */
  public caCertificatesBundleS3Bucket?: string;

  /**
   * The Amazon S3 path for the ca certificates bundle.
   */
  public caCertificatesBundleS3Key?: string;

  /**
   * The Amazon S3 object version for the ca certificates bundle.
   */
  public caCertificatesBundleS3ObjectVersion?: string;

  /**
   * The name of the trust store.
   */
  public name?: string;

  /**
   * The tags to assign to the trust store.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrustStoreProps = {}) {
    super(scope, id, {
      "type": CfnTrustStore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrNumberOfCaCertificates = cdk.Token.asNumber(this.getAtt("NumberOfCaCertificates", cdk.ResolutionTypeHint.NUMBER));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.attrTrustStoreArn = cdk.Token.asString(this.getAtt("TrustStoreArn", cdk.ResolutionTypeHint.STRING));
    this.caCertificatesBundleS3Bucket = props.caCertificatesBundleS3Bucket;
    this.caCertificatesBundleS3Key = props.caCertificatesBundleS3Key;
    this.caCertificatesBundleS3ObjectVersion = props.caCertificatesBundleS3ObjectVersion;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "caCertificatesBundleS3Bucket": this.caCertificatesBundleS3Bucket,
      "caCertificatesBundleS3Key": this.caCertificatesBundleS3Key,
      "caCertificatesBundleS3ObjectVersion": this.caCertificatesBundleS3ObjectVersion,
      "name": this.name,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrustStore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrustStorePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTrustStore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html
 */
export interface CfnTrustStoreProps {
  /**
   * The Amazon S3 bucket for the ca certificates bundle.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html#cfn-elasticloadbalancingv2-truststore-cacertificatesbundles3bucket
   */
  readonly caCertificatesBundleS3Bucket?: string;

  /**
   * The Amazon S3 path for the ca certificates bundle.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html#cfn-elasticloadbalancingv2-truststore-cacertificatesbundles3key
   */
  readonly caCertificatesBundleS3Key?: string;

  /**
   * The Amazon S3 object version for the ca certificates bundle.
   *
   * If undefined the current version is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html#cfn-elasticloadbalancingv2-truststore-cacertificatesbundles3objectversion
   */
  readonly caCertificatesBundleS3ObjectVersion?: string;

  /**
   * The name of the trust store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html#cfn-elasticloadbalancingv2-truststore-name
   */
  readonly name?: string;

  /**
   * The tags to assign to the trust store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststore.html#cfn-elasticloadbalancingv2-truststore-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnTrustStoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrustStoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustStorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caCertificatesBundleS3Bucket", cdk.validateString)(properties.caCertificatesBundleS3Bucket));
  errors.collect(cdk.propertyValidator("caCertificatesBundleS3Key", cdk.validateString)(properties.caCertificatesBundleS3Key));
  errors.collect(cdk.propertyValidator("caCertificatesBundleS3ObjectVersion", cdk.validateString)(properties.caCertificatesBundleS3ObjectVersion));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnTrustStoreProps\"");
}

// @ts-ignore TS6133
function convertCfnTrustStorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustStorePropsValidator(properties).assertSuccess();
  return {
    "CaCertificatesBundleS3Bucket": cdk.stringToCloudFormation(properties.caCertificatesBundleS3Bucket),
    "CaCertificatesBundleS3Key": cdk.stringToCloudFormation(properties.caCertificatesBundleS3Key),
    "CaCertificatesBundleS3ObjectVersion": cdk.stringToCloudFormation(properties.caCertificatesBundleS3ObjectVersion),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnTrustStorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustStoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustStoreProps>();
  ret.addPropertyResult("caCertificatesBundleS3Bucket", "CaCertificatesBundleS3Bucket", (properties.CaCertificatesBundleS3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.CaCertificatesBundleS3Bucket) : undefined));
  ret.addPropertyResult("caCertificatesBundleS3Key", "CaCertificatesBundleS3Key", (properties.CaCertificatesBundleS3Key != null ? cfn_parse.FromCloudFormation.getString(properties.CaCertificatesBundleS3Key) : undefined));
  ret.addPropertyResult("caCertificatesBundleS3ObjectVersion", "CaCertificatesBundleS3ObjectVersion", (properties.CaCertificatesBundleS3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.CaCertificatesBundleS3ObjectVersion) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Adds the specified revocation contents to the specified trust store.
 *
 * You must specify `TrustStoreArn` .
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::TrustStoreRevocation
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststorerevocation.html
 */
export class CfnTrustStoreRevocation extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ElasticLoadBalancingV2::TrustStoreRevocation";

  /**
   * Build a CfnTrustStoreRevocation from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTrustStoreRevocation {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTrustStoreRevocationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTrustStoreRevocation(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The revocation ID of the revocation file.
   *
   * @cloudformationAttribute RevocationId
   */
  public readonly attrRevocationId: number;

  /**
   * Information about the revocation file in the trust store.
   *
   * @cloudformationAttribute TrustStoreRevocations
   */
  public readonly attrTrustStoreRevocations: cdk.IResolvable;

  /**
   * The revocation file to add.
   */
  public revocationContents?: Array<cdk.IResolvable | CfnTrustStoreRevocation.RevocationContentProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the trust store.
   */
  public trustStoreArn?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTrustStoreRevocationProps = {}) {
    super(scope, id, {
      "type": CfnTrustStoreRevocation.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrRevocationId = cdk.Token.asNumber(this.getAtt("RevocationId", cdk.ResolutionTypeHint.NUMBER));
    this.attrTrustStoreRevocations = this.getAtt("TrustStoreRevocations");
    this.revocationContents = props.revocationContents;
    this.trustStoreArn = props.trustStoreArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "revocationContents": this.revocationContents,
      "trustStoreArn": this.trustStoreArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTrustStoreRevocation.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTrustStoreRevocationPropsToCloudFormation(props);
  }
}

export namespace CfnTrustStoreRevocation {
  /**
   * Information about a revocation file.
   *
   * You must specify `S3Bucket` and `S3Key` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-revocationcontent.html
   */
  export interface RevocationContentProperty {
    /**
     * The type of revocation file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-revocationcontent.html#cfn-elasticloadbalancingv2-truststorerevocation-revocationcontent-revocationtype
     */
    readonly revocationType?: string;

    /**
     * The Amazon S3 bucket for the revocation file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-revocationcontent.html#cfn-elasticloadbalancingv2-truststorerevocation-revocationcontent-s3bucket
     */
    readonly s3Bucket?: string;

    /**
     * The Amazon S3 path for the revocation file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-revocationcontent.html#cfn-elasticloadbalancingv2-truststorerevocation-revocationcontent-s3key
     */
    readonly s3Key?: string;

    /**
     * The Amazon S3 object version of the revocation file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-revocationcontent.html#cfn-elasticloadbalancingv2-truststorerevocation-revocationcontent-s3objectversion
     */
    readonly s3ObjectVersion?: string;
  }

  /**
   * Information about a revocation file in use by a trust store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-truststorerevocation.html
   */
  export interface TrustStoreRevocationProperty {
    /**
     * The number of revoked certificates.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-truststorerevocation.html#cfn-elasticloadbalancingv2-truststorerevocation-truststorerevocation-numberofrevokedentries
     */
    readonly numberOfRevokedEntries?: number;

    /**
     * The revocation ID of the revocation file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-truststorerevocation.html#cfn-elasticloadbalancingv2-truststorerevocation-truststorerevocation-revocationid
     */
    readonly revocationId?: string;

    /**
     * The type of revocation file.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-truststorerevocation.html#cfn-elasticloadbalancingv2-truststorerevocation-truststorerevocation-revocationtype
     */
    readonly revocationType?: string;

    /**
     * The Amazon Resource Name (ARN) of the trust store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-truststorerevocation-truststorerevocation.html#cfn-elasticloadbalancingv2-truststorerevocation-truststorerevocation-truststorearn
     */
    readonly trustStoreArn?: string;
  }
}

/**
 * Properties for defining a `CfnTrustStoreRevocation`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststorerevocation.html
 */
export interface CfnTrustStoreRevocationProps {
  /**
   * The revocation file to add.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststorerevocation.html#cfn-elasticloadbalancingv2-truststorerevocation-revocationcontents
   */
  readonly revocationContents?: Array<cdk.IResolvable | CfnTrustStoreRevocation.RevocationContentProperty> | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the trust store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-truststorerevocation.html#cfn-elasticloadbalancingv2-truststorerevocation-truststorearn
   */
  readonly trustStoreArn?: string;
}

/**
 * Determine whether the given properties match those of a `RevocationContentProperty`
 *
 * @param properties - the TypeScript properties of a `RevocationContentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustStoreRevocationRevocationContentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("revocationType", cdk.validateString)(properties.revocationType));
  errors.collect(cdk.propertyValidator("s3Bucket", cdk.validateString)(properties.s3Bucket));
  errors.collect(cdk.propertyValidator("s3Key", cdk.validateString)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3ObjectVersion", cdk.validateString)(properties.s3ObjectVersion));
  return errors.wrap("supplied properties not correct for \"RevocationContentProperty\"");
}

// @ts-ignore TS6133
function convertCfnTrustStoreRevocationRevocationContentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustStoreRevocationRevocationContentPropertyValidator(properties).assertSuccess();
  return {
    "RevocationType": cdk.stringToCloudFormation(properties.revocationType),
    "S3Bucket": cdk.stringToCloudFormation(properties.s3Bucket),
    "S3Key": cdk.stringToCloudFormation(properties.s3Key),
    "S3ObjectVersion": cdk.stringToCloudFormation(properties.s3ObjectVersion)
  };
}

// @ts-ignore TS6133
function CfnTrustStoreRevocationRevocationContentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrustStoreRevocation.RevocationContentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustStoreRevocation.RevocationContentProperty>();
  ret.addPropertyResult("revocationType", "RevocationType", (properties.RevocationType != null ? cfn_parse.FromCloudFormation.getString(properties.RevocationType) : undefined));
  ret.addPropertyResult("s3Bucket", "S3Bucket", (properties.S3Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.S3Bucket) : undefined));
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? cfn_parse.FromCloudFormation.getString(properties.S3Key) : undefined));
  ret.addPropertyResult("s3ObjectVersion", "S3ObjectVersion", (properties.S3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.S3ObjectVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrustStoreRevocationProperty`
 *
 * @param properties - the TypeScript properties of a `TrustStoreRevocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustStoreRevocationTrustStoreRevocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numberOfRevokedEntries", cdk.validateNumber)(properties.numberOfRevokedEntries));
  errors.collect(cdk.propertyValidator("revocationId", cdk.validateString)(properties.revocationId));
  errors.collect(cdk.propertyValidator("revocationType", cdk.validateString)(properties.revocationType));
  errors.collect(cdk.propertyValidator("trustStoreArn", cdk.validateString)(properties.trustStoreArn));
  return errors.wrap("supplied properties not correct for \"TrustStoreRevocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnTrustStoreRevocationTrustStoreRevocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustStoreRevocationTrustStoreRevocationPropertyValidator(properties).assertSuccess();
  return {
    "NumberOfRevokedEntries": cdk.numberToCloudFormation(properties.numberOfRevokedEntries),
    "RevocationId": cdk.stringToCloudFormation(properties.revocationId),
    "RevocationType": cdk.stringToCloudFormation(properties.revocationType),
    "TrustStoreArn": cdk.stringToCloudFormation(properties.trustStoreArn)
  };
}

// @ts-ignore TS6133
function CfnTrustStoreRevocationTrustStoreRevocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTrustStoreRevocation.TrustStoreRevocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustStoreRevocation.TrustStoreRevocationProperty>();
  ret.addPropertyResult("numberOfRevokedEntries", "NumberOfRevokedEntries", (properties.NumberOfRevokedEntries != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfRevokedEntries) : undefined));
  ret.addPropertyResult("revocationId", "RevocationId", (properties.RevocationId != null ? cfn_parse.FromCloudFormation.getString(properties.RevocationId) : undefined));
  ret.addPropertyResult("revocationType", "RevocationType", (properties.RevocationType != null ? cfn_parse.FromCloudFormation.getString(properties.RevocationType) : undefined));
  ret.addPropertyResult("trustStoreArn", "TrustStoreArn", (properties.TrustStoreArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrustStoreArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTrustStoreRevocationProps`
 *
 * @param properties - the TypeScript properties of a `CfnTrustStoreRevocationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTrustStoreRevocationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("revocationContents", cdk.listValidator(CfnTrustStoreRevocationRevocationContentPropertyValidator))(properties.revocationContents));
  errors.collect(cdk.propertyValidator("trustStoreArn", cdk.validateString)(properties.trustStoreArn));
  return errors.wrap("supplied properties not correct for \"CfnTrustStoreRevocationProps\"");
}

// @ts-ignore TS6133
function convertCfnTrustStoreRevocationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTrustStoreRevocationPropsValidator(properties).assertSuccess();
  return {
    "RevocationContents": cdk.listMapper(convertCfnTrustStoreRevocationRevocationContentPropertyToCloudFormation)(properties.revocationContents),
    "TrustStoreArn": cdk.stringToCloudFormation(properties.trustStoreArn)
  };
}

// @ts-ignore TS6133
function CfnTrustStoreRevocationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTrustStoreRevocationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTrustStoreRevocationProps>();
  ret.addPropertyResult("revocationContents", "RevocationContents", (properties.RevocationContents != null ? cfn_parse.FromCloudFormation.getArray(CfnTrustStoreRevocationRevocationContentPropertyFromCloudFormation)(properties.RevocationContents) : undefined));
  ret.addPropertyResult("trustStoreArn", "TrustStoreArn", (properties.TrustStoreArn != null ? cfn_parse.FromCloudFormation.getString(properties.TrustStoreArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}