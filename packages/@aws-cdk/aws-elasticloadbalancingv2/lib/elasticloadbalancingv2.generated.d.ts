import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnListener`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html
 */
export interface CfnListenerProps {
    /**
     * The actions for the default rule. You cannot define a condition for a default rule.
     *
     * To create additional rules for an Application Load Balancer, use [AWS::ElasticLoadBalancingV2::ListenerRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-defaultactions
     */
    readonly defaultActions: Array<CfnListener.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-loadbalancerarn
     */
    readonly loadBalancerArn: string;
    /**
     * [TLS listener] The name of the Application-Layer Protocol Negotiation (ALPN) policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-alpnpolicy
     */
    readonly alpnPolicy?: string[];
    /**
     * The default SSL server certificate for a secure listener. You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
     *
     * To create a certificate list for a secure listener, use [AWS::ElasticLoadBalancingV2::ListenerCertificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-certificates
     */
    readonly certificates?: Array<CfnListener.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The port on which the load balancer is listening. You cannot specify a port for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-port
     */
    readonly port?: number;
    /**
     * The protocol for connections from clients to the load balancer. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, and TCP_UDP. You can’t specify the UDP or TCP_UDP protocol if dual-stack mode is enabled. You cannot specify a protocol for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-protocol
     */
    readonly protocol?: string;
    /**
     * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported.
     *
     * For more information, see [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) in the *Application Load Balancers Guide* and [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html#describe-ssl-policies) in the *Network Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-sslpolicy
     */
    readonly sslPolicy?: string;
}
/**
 * A CloudFormation `AWS::ElasticLoadBalancingV2::Listener`
 *
 * Specifies a listener for an Application Load Balancer, Network Load Balancer, or Gateway Load Balancer.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::Listener
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html
 */
export declare class CfnListener extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::Listener";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListener;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     * @cloudformationAttribute ListenerArn
     */
    readonly attrListenerArn: string;
    /**
     * The actions for the default rule. You cannot define a condition for a default rule.
     *
     * To create additional rules for an Application Load Balancer, use [AWS::ElasticLoadBalancingV2::ListenerRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-defaultactions
     */
    defaultActions: Array<CfnListener.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-loadbalancerarn
     */
    loadBalancerArn: string;
    /**
     * [TLS listener] The name of the Application-Layer Protocol Negotiation (ALPN) policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-alpnpolicy
     */
    alpnPolicy: string[] | undefined;
    /**
     * The default SSL server certificate for a secure listener. You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
     *
     * To create a certificate list for a secure listener, use [AWS::ElasticLoadBalancingV2::ListenerCertificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-certificates
     */
    certificates: Array<CfnListener.CertificateProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The port on which the load balancer is listening. You cannot specify a port for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-port
     */
    port: number | undefined;
    /**
     * The protocol for connections from clients to the load balancer. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, and TCP_UDP. You can’t specify the UDP or TCP_UDP protocol if dual-stack mode is enabled. You cannot specify a protocol for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-protocol
     */
    protocol: string | undefined;
    /**
     * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported.
     *
     * For more information, see [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) in the *Application Load Balancers Guide* and [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html#describe-ssl-policies) in the *Network Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-sslpolicy
     */
    sslPolicy: string | undefined;
    /**
     * Create a new `AWS::ElasticLoadBalancingV2::Listener`.
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
     * Specifies an action for a listener rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html
     */
    interface ActionProperty {
        /**
         * [HTTPS listeners] Information for using Amazon Cognito to authenticate users. Specify only when `Type` is `authenticate-cognito` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-authenticatecognitoconfig
         */
        readonly authenticateCognitoConfig?: CfnListener.AuthenticateCognitoConfigProperty | cdk.IResolvable;
        /**
         * [HTTPS listeners] Information about an identity provider that is compliant with OpenID Connect (OIDC). Specify only when `Type` is `authenticate-oidc` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-authenticateoidcconfig
         */
        readonly authenticateOidcConfig?: CfnListener.AuthenticateOidcConfigProperty | cdk.IResolvable;
        /**
         * [Application Load Balancer] Information for creating an action that returns a custom HTTP response. Specify only when `Type` is `fixed-response` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-fixedresponseconfig
         */
        readonly fixedResponseConfig?: CfnListener.FixedResponseConfigProperty | cdk.IResolvable;
        /**
         * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-forwardconfig
         */
        readonly forwardConfig?: CfnListener.ForwardConfigProperty | cdk.IResolvable;
        /**
         * The order for the action. This value is required for rules with multiple actions. The action with the lowest value for order is performed first.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-order
         */
        readonly order?: number;
        /**
         * [Application Load Balancer] Information for creating a redirect action. Specify only when `Type` is `redirect` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-redirectconfig
         */
        readonly redirectConfig?: CfnListener.RedirectConfigProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the target group. Specify only when `Type` is `forward` and you want to route to a single target group. To route to one or more target groups, use `ForwardConfig` instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-targetgrouparn
         */
        readonly targetGroupArn?: string;
        /**
         * The type of action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html#cfn-elasticloadbalancingv2-listener-action-type
         */
        readonly type: string;
    }
}
export declare namespace CfnListener {
    /**
     * Specifies information required when integrating with Amazon Cognito to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html
     */
    interface AuthenticateCognitoConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The behavior if the user is not authenticated. The following are possible values:
         *
         * - deny `` - Return an HTTP 401 Unauthorized error.
         * - allow `` - Allow the request to be forwarded to the target.
         * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-onunauthenticatedrequest
         */
        readonly onUnauthenticatedRequest?: string;
        /**
         * The set of user claims to be requested from the IdP. The default is `openid` .
         *
         * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-scope
         */
        readonly scope?: string;
        /**
         * The name of the cookie used to maintain session information. The default is AWSELBAuthSessionCookie.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-sessioncookiename
         */
        readonly sessionCookieName?: string;
        /**
         * The maximum duration of the authentication session, in seconds. The default is 604800 seconds (7 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-sessiontimeout
         */
        readonly sessionTimeout?: string;
        /**
         * The Amazon Resource Name (ARN) of the Amazon Cognito user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-userpoolarn
         */
        readonly userPoolArn: string;
        /**
         * The ID of the Amazon Cognito user pool client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-userpoolclientid
         */
        readonly userPoolClientId: string;
        /**
         * The domain prefix or fully-qualified domain name of the Amazon Cognito user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-userpooldomain
         */
        readonly userPoolDomain: string;
    }
}
export declare namespace CfnListener {
    /**
     * Specifies information required using an identity provide (IdP) that is compliant with OpenID Connect (OIDC) to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html
     */
    interface AuthenticateOidcConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The authorization endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-authorizationendpoint
         */
        readonly authorizationEndpoint: string;
        /**
         * The OAuth 2.0 client identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-clientid
         */
        readonly clientId: string;
        /**
         * The OAuth 2.0 client secret. This parameter is required if you are creating a rule. If you are modifying a rule, you can omit this parameter if you set `UseExistingClientSecret` to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-clientsecret
         */
        readonly clientSecret?: string;
        /**
         * The OIDC issuer identifier of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-issuer
         */
        readonly issuer: string;
        /**
         * The behavior if the user is not authenticated. The following are possible values:
         *
         * - deny `` - Return an HTTP 401 Unauthorized error.
         * - allow `` - Allow the request to be forwarded to the target.
         * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-onunauthenticatedrequest
         */
        readonly onUnauthenticatedRequest?: string;
        /**
         * The set of user claims to be requested from the IdP. The default is `openid` .
         *
         * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-scope
         */
        readonly scope?: string;
        /**
         * The name of the cookie used to maintain session information. The default is AWSELBAuthSessionCookie.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-sessioncookiename
         */
        readonly sessionCookieName?: string;
        /**
         * The maximum duration of the authentication session, in seconds. The default is 604800 seconds (7 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-sessiontimeout
         */
        readonly sessionTimeout?: string;
        /**
         * The token endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-tokenendpoint
         */
        readonly tokenEndpoint: string;
        /**
         * Indicates whether to use the existing client secret when modifying a rule. If you are creating a rule, you can omit this parameter or set it to false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-useexistingclientsecret
         */
        readonly useExistingClientSecret?: boolean | cdk.IResolvable;
        /**
         * The user info endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-userinfoendpoint
         */
        readonly userInfoEndpoint: string;
    }
}
export declare namespace CfnListener {
    /**
     * Specifies an SSL server certificate to use as the default certificate for a secure listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificate.html
     */
    interface CertificateProperty {
        /**
         * The Amazon Resource Name (ARN) of the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificate.html#cfn-elasticloadbalancingv2-listener-certificate-certificatearn
         */
        readonly certificateArn?: string;
    }
}
export declare namespace CfnListener {
    /**
     * Specifies information required when returning a custom HTTP response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html
     */
    interface FixedResponseConfigProperty {
        /**
         * The content type.
         *
         * Valid Values: text/plain | text/css | text/html | application/javascript | application/json
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listener-fixedresponseconfig-contenttype
         */
        readonly contentType?: string;
        /**
         * The message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listener-fixedresponseconfig-messagebody
         */
        readonly messageBody?: string;
        /**
         * The HTTP response code (2XX, 4XX, or 5XX).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listener-fixedresponseconfig-statuscode
         */
        readonly statusCode: string;
    }
}
export declare namespace CfnListener {
    /**
     * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html
     */
    interface ForwardConfigProperty {
        /**
         * Information about the target group stickiness for a rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html#cfn-elasticloadbalancingv2-listener-forwardconfig-targetgroupstickinessconfig
         */
        readonly targetGroupStickinessConfig?: CfnListener.TargetGroupStickinessConfigProperty | cdk.IResolvable;
        /**
         * Information about how traffic will be distributed between multiple target groups in a forward rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html#cfn-elasticloadbalancingv2-listener-forwardconfig-targetgroups
         */
        readonly targetGroups?: Array<CfnListener.TargetGroupTupleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnListener {
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html
     */
    interface RedirectConfigProperty {
        /**
         * The hostname. This component is not percent-encoded. The hostname can contain #{host}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-host
         */
        readonly host?: string;
        /**
         * The absolute path, starting with the leading "/". This component is not percent-encoded. The path can contain #{host}, #{path}, and #{port}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-path
         */
        readonly path?: string;
        /**
         * The port. You can specify a value from 1 to 65535 or #{port}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-port
         */
        readonly port?: string;
        /**
         * The protocol. You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP, HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-protocol
         */
        readonly protocol?: string;
        /**
         * The query parameters, URL-encoded when necessary, but not percent-encoded. Do not include the leading "?", as it is automatically added. You can specify any of the reserved keywords.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-query
         */
        readonly query?: string;
        /**
         * The HTTP redirect code. The redirect is either permanent (HTTP 301) or temporary (HTTP 302).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-redirectconfig.html#cfn-elasticloadbalancingv2-listener-redirectconfig-statuscode
         */
        readonly statusCode: string;
    }
}
export declare namespace CfnListener {
    /**
     * Information about the target group stickiness for a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html
     */
    interface TargetGroupStickinessConfigProperty {
        /**
         * The time period, in seconds, during which requests from a client should be routed to the same target group. The range is 1-604800 seconds (7 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listener-targetgroupstickinessconfig-durationseconds
         */
        readonly durationSeconds?: number;
        /**
         * Indicates whether target group stickiness is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listener-targetgroupstickinessconfig-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnListener {
    /**
     * Information about how traffic will be distributed between multiple target groups in a forward rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html
     */
    interface TargetGroupTupleProperty {
        /**
         * The Amazon Resource Name (ARN) of the target group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html#cfn-elasticloadbalancingv2-listener-targetgrouptuple-targetgrouparn
         */
        readonly targetGroupArn?: string;
        /**
         * The weight. The range is 0 to 999.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html#cfn-elasticloadbalancingv2-listener-targetgrouptuple-weight
         */
        readonly weight?: number;
    }
}
/**
 * Properties for defining a `CfnListenerCertificate`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html
 */
export interface CfnListenerCertificateProps {
    /**
     * The certificate. You can specify one certificate per resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-certificates
     */
    readonly certificates: Array<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-listenerarn
     */
    readonly listenerArn: string;
}
/**
 * A CloudFormation `AWS::ElasticLoadBalancingV2::ListenerCertificate`
 *
 * Specifies an SSL server certificate to add to the certificate list for an HTTPS or TLS listener.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::ListenerCertificate
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html
 */
export declare class CfnListenerCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::ListenerCertificate";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListenerCertificate;
    /**
     * The certificate. You can specify one certificate per resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-certificates
     */
    certificates: Array<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-listenerarn
     */
    listenerArn: string;
    /**
     * Create a new `AWS::ElasticLoadBalancingV2::ListenerCertificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnListenerCertificateProps);
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
export declare namespace CfnListenerCertificate {
    /**
     * Specifies an SSL server certificate for the certificate list of a secure listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificates.html
     */
    interface CertificateProperty {
        /**
         * The Amazon Resource Name (ARN) of the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificates.html#cfn-elasticloadbalancingv2-listener-certificates-certificatearn
         */
        readonly certificateArn?: string;
    }
}
/**
 * Properties for defining a `CfnListenerRule`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html
 */
export interface CfnListenerRuleProps {
    /**
     * The actions.
     *
     * The rule must include exactly one of the following types of actions: `forward` , `fixed-response` , or `redirect` , and it must be the last action to be performed. If the rule is for an HTTPS listener, it can also optionally include an authentication action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-actions
     */
    readonly actions: Array<CfnListenerRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The conditions.
     *
     * The rule can optionally include up to one of each of the following conditions: `http-request-method` , `host-header` , `path-pattern` , and `source-ip` . A rule can also optionally include one or more of each of the following conditions: `http-header` and `query-string` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-conditions
     */
    readonly conditions: Array<CfnListenerRule.RuleConditionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-listenerarn
     */
    readonly listenerArn: string;
    /**
     * The rule priority. A listener can't have multiple rules with the same priority.
     *
     * If you try to reorder rules by updating their priorities, do not specify a new priority if an existing rule already uses this priority, as this can cause an error. If you need to reuse a priority with a different rule, you must remove it as a priority first, and then specify it in a subsequent update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-priority
     */
    readonly priority: number;
}
/**
 * A CloudFormation `AWS::ElasticLoadBalancingV2::ListenerRule`
 *
 * Specifies a listener rule. The listener must be associated with an Application Load Balancer. Each rule consists of a priority, one or more actions, and one or more conditions.
 *
 * For more information, see [Quotas for your Application Load Balancers](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-limits.html) in the *User Guide for Application Load Balancers* .
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::ListenerRule
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html
 */
export declare class CfnListenerRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::ListenerRule";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnListenerRule;
    /**
     * Indicates whether this is the default rule.
     * @cloudformationAttribute IsDefault
     */
    readonly attrIsDefault: cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the rule.
     * @cloudformationAttribute RuleArn
     */
    readonly attrRuleArn: string;
    /**
     * The actions.
     *
     * The rule must include exactly one of the following types of actions: `forward` , `fixed-response` , or `redirect` , and it must be the last action to be performed. If the rule is for an HTTPS listener, it can also optionally include an authentication action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-actions
     */
    actions: Array<CfnListenerRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The conditions.
     *
     * The rule can optionally include up to one of each of the following conditions: `http-request-method` , `host-header` , `path-pattern` , and `source-ip` . A rule can also optionally include one or more of each of the following conditions: `http-header` and `query-string` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-conditions
     */
    conditions: Array<CfnListenerRule.RuleConditionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-listenerarn
     */
    listenerArn: string;
    /**
     * The rule priority. A listener can't have multiple rules with the same priority.
     *
     * If you try to reorder rules by updating their priorities, do not specify a new priority if an existing rule already uses this priority, as this can cause an error. If you need to reuse a priority with a different rule, you must remove it as a priority first, and then specify it in a subsequent update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-priority
     */
    priority: number;
    /**
     * Create a new `AWS::ElasticLoadBalancingV2::ListenerRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnListenerRuleProps);
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
export declare namespace CfnListenerRule {
    /**
     * Specifies an action for a listener rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html
     */
    interface ActionProperty {
        /**
         * [HTTPS listeners] Information for using Amazon Cognito to authenticate users. Specify only when `Type` is `authenticate-cognito` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-authenticatecognitoconfig
         */
        readonly authenticateCognitoConfig?: CfnListenerRule.AuthenticateCognitoConfigProperty | cdk.IResolvable;
        /**
         * [HTTPS listeners] Information about an identity provider that is compliant with OpenID Connect (OIDC). Specify only when `Type` is `authenticate-oidc` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-authenticateoidcconfig
         */
        readonly authenticateOidcConfig?: CfnListenerRule.AuthenticateOidcConfigProperty | cdk.IResolvable;
        /**
         * [Application Load Balancer] Information for creating an action that returns a custom HTTP response. Specify only when `Type` is `fixed-response` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-fixedresponseconfig
         */
        readonly fixedResponseConfig?: CfnListenerRule.FixedResponseConfigProperty | cdk.IResolvable;
        /**
         * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-forwardconfig
         */
        readonly forwardConfig?: CfnListenerRule.ForwardConfigProperty | cdk.IResolvable;
        /**
         * The order for the action. This value is required for rules with multiple actions. The action with the lowest value for order is performed first.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-order
         */
        readonly order?: number;
        /**
         * [Application Load Balancer] Information for creating a redirect action. Specify only when `Type` is `redirect` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-redirectconfig
         */
        readonly redirectConfig?: CfnListenerRule.RedirectConfigProperty | cdk.IResolvable;
        /**
         * The Amazon Resource Name (ARN) of the target group. Specify only when `Type` is `forward` and you want to route to a single target group. To route to one or more target groups, use `ForwardConfig` instead.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-targetgrouparn
         */
        readonly targetGroupArn?: string;
        /**
         * The type of action.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html#cfn-elasticloadbalancingv2-listenerrule-action-type
         */
        readonly type: string;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Specifies information required when integrating with Amazon Cognito to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html
     */
    interface AuthenticateCognitoConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The behavior if the user is not authenticated. The following are possible values:
         *
         * - deny `` - Return an HTTP 401 Unauthorized error.
         * - allow `` - Allow the request to be forwarded to the target.
         * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-onunauthenticatedrequest
         */
        readonly onUnauthenticatedRequest?: string;
        /**
         * The set of user claims to be requested from the IdP. The default is `openid` .
         *
         * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-scope
         */
        readonly scope?: string;
        /**
         * The name of the cookie used to maintain session information. The default is AWSELBAuthSessionCookie.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-sessioncookiename
         */
        readonly sessionCookieName?: string;
        /**
         * The maximum duration of the authentication session, in seconds. The default is 604800 seconds (7 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-sessiontimeout
         */
        readonly sessionTimeout?: number;
        /**
         * The Amazon Resource Name (ARN) of the Amazon Cognito user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-userpoolarn
         */
        readonly userPoolArn: string;
        /**
         * The ID of the Amazon Cognito user pool client.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-userpoolclientid
         */
        readonly userPoolClientId: string;
        /**
         * The domain prefix or fully-qualified domain name of the Amazon Cognito user pool.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-userpooldomain
         */
        readonly userPoolDomain: string;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Specifies information required using an identity provide (IdP) that is compliant with OpenID Connect (OIDC) to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html
     */
    interface AuthenticateOidcConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * The authorization endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-authorizationendpoint
         */
        readonly authorizationEndpoint: string;
        /**
         * The OAuth 2.0 client identifier.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-clientid
         */
        readonly clientId: string;
        /**
         * The OAuth 2.0 client secret. This parameter is required if you are creating a rule. If you are modifying a rule, you can omit this parameter if you set `UseExistingClientSecret` to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-clientsecret
         */
        readonly clientSecret?: string;
        /**
         * The OIDC issuer identifier of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-issuer
         */
        readonly issuer: string;
        /**
         * The behavior if the user is not authenticated. The following are possible values:
         *
         * - deny `` - Return an HTTP 401 Unauthorized error.
         * - allow `` - Allow the request to be forwarded to the target.
         * - authenticate `` - Redirect the request to the IdP authorization endpoint. This is the default value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-onunauthenticatedrequest
         */
        readonly onUnauthenticatedRequest?: string;
        /**
         * The set of user claims to be requested from the IdP. The default is `openid` .
         *
         * To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-scope
         */
        readonly scope?: string;
        /**
         * The name of the cookie used to maintain session information. The default is AWSELBAuthSessionCookie.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-sessioncookiename
         */
        readonly sessionCookieName?: string;
        /**
         * The maximum duration of the authentication session, in seconds. The default is 604800 seconds (7 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-sessiontimeout
         */
        readonly sessionTimeout?: number;
        /**
         * The token endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-tokenendpoint
         */
        readonly tokenEndpoint: string;
        /**
         * Indicates whether to use the existing client secret when modifying a rule. If you are creating a rule, you can omit this parameter or set it to false.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-useexistingclientsecret
         */
        readonly useExistingClientSecret?: boolean | cdk.IResolvable;
        /**
         * The user info endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-userinfoendpoint
         */
        readonly userInfoEndpoint: string;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Specifies information required when returning a custom HTTP response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html
     */
    interface FixedResponseConfigProperty {
        /**
         * The content type.
         *
         * Valid Values: text/plain | text/css | text/html | application/javascript | application/json
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listenerrule-fixedresponseconfig-contenttype
         */
        readonly contentType?: string;
        /**
         * The message.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listenerrule-fixedresponseconfig-messagebody
         */
        readonly messageBody?: string;
        /**
         * The HTTP response code (2XX, 4XX, or 5XX).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html#cfn-elasticloadbalancingv2-listenerrule-fixedresponseconfig-statuscode
         */
        readonly statusCode: string;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html
     */
    interface ForwardConfigProperty {
        /**
         * Information about the target group stickiness for a rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html#cfn-elasticloadbalancingv2-listenerrule-forwardconfig-targetgroupstickinessconfig
         */
        readonly targetGroupStickinessConfig?: CfnListenerRule.TargetGroupStickinessConfigProperty | cdk.IResolvable;
        /**
         * Information about how traffic will be distributed between multiple target groups in a forward rule.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html#cfn-elasticloadbalancingv2-listenerrule-forwardconfig-targetgroups
         */
        readonly targetGroups?: Array<CfnListenerRule.TargetGroupTupleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about a host header condition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-hostheaderconfig.html
     */
    interface HostHeaderConfigProperty {
        /**
         * The host names. The maximum size of each name is 128 characters. The comparison is case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character).
         *
         * If you specify multiple strings, the condition is satisfied if one of the strings matches the host name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-hostheaderconfig.html#cfn-elasticloadbalancingv2-listenerrule-hostheaderconfig-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about an HTTP header condition.
     *
     * There is a set of standard HTTP header fields. You can also define custom HTTP header fields.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httpheaderconfig.html
     */
    interface HttpHeaderConfigProperty {
        /**
         * The name of the HTTP header field. The maximum size is 40 characters. The header name is case insensitive. The allowed characters are specified by RFC 7230. Wildcards are not supported.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httpheaderconfig.html#cfn-elasticloadbalancingv2-listenerrule-httpheaderconfig-httpheadername
         */
        readonly httpHeaderName?: string;
        /**
         * The strings to compare against the value of the HTTP header. The maximum size of each string is 128 characters. The comparison strings are case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character).
         *
         * If the same header appears multiple times in the request, we search them in order until a match is found.
         *
         * If you specify multiple strings, the condition is satisfied if one of the strings matches the value of the HTTP header. To require that all of the strings are a match, create one condition per string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httpheaderconfig.html#cfn-elasticloadbalancingv2-listenerrule-httpheaderconfig-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about an HTTP method condition.
     *
     * HTTP defines a set of request methods, also referred to as HTTP verbs. For more information, see the [HTTP Method Registry](https://docs.aws.amazon.com/https://www.iana.org/assignments/http-methods/http-methods.xhtml) . You can also define custom HTTP methods.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httprequestmethodconfig.html
     */
    interface HttpRequestMethodConfigProperty {
        /**
         * The name of the request method. The maximum size is 40 characters. The allowed characters are A-Z, hyphen (-), and underscore (_). The comparison is case sensitive. Wildcards are not supported; therefore, the method name must be an exact match.
         *
         * If you specify multiple strings, the condition is satisfied if one of the strings matches the HTTP request method. We recommend that you route GET and HEAD requests in the same way, because the response to a HEAD request may be cached.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-httprequestmethodconfig.html#cfn-elasticloadbalancingv2-listenerrule-httprequestmethodconfig-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about a path pattern condition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-pathpatternconfig.html
     */
    interface PathPatternConfigProperty {
        /**
         * The path patterns to compare against the request URL. The maximum size of each string is 128 characters. The comparison is case sensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character).
         *
         * If you specify multiple strings, the condition is satisfied if one of them matches the request URL. The path pattern is compared only to the path of the URL, not to its query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-pathpatternconfig.html#cfn-elasticloadbalancingv2-listenerrule-pathpatternconfig-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about a query string condition.
     *
     * The query string component of a URI starts after the first '?' character and is terminated by either a '#' character or the end of the URI. A typical query string contains key/value pairs separated by '&' characters. The allowed characters are specified by RFC 3986. Any character can be percentage encoded.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringconfig.html
     */
    interface QueryStringConfigProperty {
        /**
         * The key/value pairs or values to find in the query string. The maximum size of each string is 128 characters. The comparison is case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character). To search for a literal '*' or '?' character in a query string, you must escape these characters in `Values` using a '\' character.
         *
         * If you specify multiple key/value pairs or values, the condition is satisfied if one of them is found in the query string.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringconfig.html#cfn-elasticloadbalancingv2-listenerrule-querystringconfig-values
         */
        readonly values?: Array<CfnListenerRule.QueryStringKeyValueProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about a key/value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html
     */
    interface QueryStringKeyValueProperty {
        /**
         * The key. You can omit the key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html#cfn-elasticloadbalancingv2-listenerrule-querystringkeyvalue-key
         */
        readonly key?: string;
        /**
         * The value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html#cfn-elasticloadbalancingv2-listenerrule-querystringkeyvalue-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnListenerRule {
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
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html
     */
    interface RedirectConfigProperty {
        /**
         * The hostname. This component is not percent-encoded. The hostname can contain #{host}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-host
         */
        readonly host?: string;
        /**
         * The absolute path, starting with the leading "/". This component is not percent-encoded. The path can contain #{host}, #{path}, and #{port}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-path
         */
        readonly path?: string;
        /**
         * The port. You can specify a value from 1 to 65535 or #{port}.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-port
         */
        readonly port?: string;
        /**
         * The protocol. You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP, HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-protocol
         */
        readonly protocol?: string;
        /**
         * The query parameters, URL-encoded when necessary, but not percent-encoded. Do not include the leading "?", as it is automatically added. You can specify any of the reserved keywords.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-query
         */
        readonly query?: string;
        /**
         * The HTTP redirect code. The redirect is either permanent (HTTP 301) or temporary (HTTP 302).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-redirectconfig.html#cfn-elasticloadbalancingv2-listenerrule-redirectconfig-statuscode
         */
        readonly statusCode: string;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Specifies a condition for a listener rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html
     */
    interface RuleConditionProperty {
        /**
         * The field in the HTTP request. The following are the possible values:
         *
         * - `http-header`
         * - `http-request-method`
         * - `host-header`
         * - `path-pattern`
         * - `query-string`
         * - `source-ip`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-field
         */
        readonly field?: string;
        /**
         * Information for a host header condition. Specify only when `Field` is `host-header` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-hostheaderconfig
         */
        readonly hostHeaderConfig?: CfnListenerRule.HostHeaderConfigProperty | cdk.IResolvable;
        /**
         * Information for an HTTP header condition. Specify only when `Field` is `http-header` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-httpheaderconfig
         */
        readonly httpHeaderConfig?: CfnListenerRule.HttpHeaderConfigProperty | cdk.IResolvable;
        /**
         * Information for an HTTP method condition. Specify only when `Field` is `http-request-method` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-httprequestmethodconfig
         */
        readonly httpRequestMethodConfig?: CfnListenerRule.HttpRequestMethodConfigProperty | cdk.IResolvable;
        /**
         * Information for a path pattern condition. Specify only when `Field` is `path-pattern` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-pathpatternconfig
         */
        readonly pathPatternConfig?: CfnListenerRule.PathPatternConfigProperty | cdk.IResolvable;
        /**
         * Information for a query string condition. Specify only when `Field` is `query-string` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-querystringconfig
         */
        readonly queryStringConfig?: CfnListenerRule.QueryStringConfigProperty | cdk.IResolvable;
        /**
         * Information for a source IP condition. Specify only when `Field` is `source-ip` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-sourceipconfig
         */
        readonly sourceIpConfig?: CfnListenerRule.SourceIpConfigProperty | cdk.IResolvable;
        /**
         * The condition value. Specify only when `Field` is `host-header` or `path-pattern` . Alternatively, to specify multiple host names or multiple path patterns, use `HostHeaderConfig` or `PathPatternConfig` .
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html#cfn-elasticloadbalancingv2-listenerrule-rulecondition-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about a source IP condition.
     *
     * You can use this condition to route based on the IP address of the source that connects to the load balancer. If a client is behind a proxy, this is the IP address of the proxy not the IP address of the client.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-sourceipconfig.html
     */
    interface SourceIpConfigProperty {
        /**
         * The source IP addresses, in CIDR format. You can use both IPv4 and IPv6 addresses. Wildcards are not supported.
         *
         * If you specify multiple addresses, the condition is satisfied if the source IP address of the request matches one of the CIDR blocks. This condition is not satisfied by the addresses in the X-Forwarded-For header.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-sourceipconfig.html#cfn-elasticloadbalancingv2-listenerrule-sourceipconfig-values
         */
        readonly values?: string[];
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about the target group stickiness for a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html
     */
    interface TargetGroupStickinessConfigProperty {
        /**
         * The time period, in seconds, during which requests from a client should be routed to the same target group. The range is 1-604800 seconds (7 days).
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig-durationseconds
         */
        readonly durationSeconds?: number;
        /**
         * Indicates whether target group stickiness is enabled.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html#cfn-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnListenerRule {
    /**
     * Information about how traffic will be distributed between multiple target groups in a forward rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html
     */
    interface TargetGroupTupleProperty {
        /**
         * The Amazon Resource Name (ARN) of the target group.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html#cfn-elasticloadbalancingv2-listenerrule-targetgrouptuple-targetgrouparn
         */
        readonly targetGroupArn?: string;
        /**
         * The weight. The range is 0 to 999.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html#cfn-elasticloadbalancingv2-listenerrule-targetgrouptuple-weight
         */
        readonly weight?: number;
    }
}
/**
 * Properties for defining a `CfnLoadBalancer`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html
 */
export interface CfnLoadBalancerProps {
    /**
     * The IP address type. The possible values are `ipv4` (for IPv4 addresses) and `dualstack` (for IPv4 and IPv6 addresses). You can’t specify `dualstack` for a load balancer with a UDP or TCP_UDP listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-ipaddresstype
     */
    readonly ipAddressType?: string;
    /**
     * The load balancer attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattributes
     */
    readonly loadBalancerAttributes?: Array<CfnLoadBalancer.LoadBalancerAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The name of the load balancer. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, must not begin or end with a hyphen, and must not begin with "internal-".
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-name
     */
    readonly name?: string;
    /**
     * The nodes of an Internet-facing load balancer have public IP addresses. The DNS name of an Internet-facing load balancer is publicly resolvable to the public IP addresses of the nodes. Therefore, Internet-facing load balancers can route requests from clients over the internet.
     *
     * The nodes of an internal load balancer have only private IP addresses. The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes. Therefore, internal load balancers can route requests only from clients with access to the VPC for the load balancer.
     *
     * The default is an Internet-facing load balancer.
     *
     * You cannot specify a scheme for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-scheme
     */
    readonly scheme?: string;
    /**
     * [Application Load Balancers] The IDs of the security groups for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-securitygroups
     */
    readonly securityGroups?: string[];
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmappings
     */
    readonly subnetMappings?: Array<CfnLoadBalancer.SubnetMappingProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both. To specify an Elastic IP address, specify subnet mappings instead of subnets.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-subnets
     */
    readonly subnets?: string[];
    /**
     * The tags to assign to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The type of load balancer. The default is `application` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-type
     */
    readonly type?: string;
}
/**
 * A CloudFormation `AWS::ElasticLoadBalancingV2::LoadBalancer`
 *
 * Specifies an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::LoadBalancer
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html
 */
export declare class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::LoadBalancer";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancer;
    /**
     * The ID of the Amazon Route 53 hosted zone associated with the load balancer. For example, `Z2P70J7EXAMPLE` .
     * @cloudformationAttribute CanonicalHostedZoneID
     */
    readonly attrCanonicalHostedZoneId: string;
    /**
     * The DNS name for the load balancer. For example, `my-load-balancer-424835706.us-west-2.elb.amazonaws.com` .
     * @cloudformationAttribute DNSName
     */
    readonly attrDnsName: string;
    /**
     * The full name of the load balancer. For example, `app/my-load-balancer/50dc6c495c0c9188` .
     * @cloudformationAttribute LoadBalancerFullName
     */
    readonly attrLoadBalancerFullName: string;
    /**
     * The name of the load balancer. For example, `my-load-balancer` .
     * @cloudformationAttribute LoadBalancerName
     */
    readonly attrLoadBalancerName: string;
    /**
     * The IDs of the security groups for the load balancer.
     * @cloudformationAttribute SecurityGroups
     */
    readonly attrSecurityGroups: string[];
    /**
     * The IP address type. The possible values are `ipv4` (for IPv4 addresses) and `dualstack` (for IPv4 and IPv6 addresses). You can’t specify `dualstack` for a load balancer with a UDP or TCP_UDP listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-ipaddresstype
     */
    ipAddressType: string | undefined;
    /**
     * The load balancer attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattributes
     */
    loadBalancerAttributes: Array<CfnLoadBalancer.LoadBalancerAttributeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The name of the load balancer. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, must not begin or end with a hyphen, and must not begin with "internal-".
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-name
     */
    name: string | undefined;
    /**
     * The nodes of an Internet-facing load balancer have public IP addresses. The DNS name of an Internet-facing load balancer is publicly resolvable to the public IP addresses of the nodes. Therefore, Internet-facing load balancers can route requests from clients over the internet.
     *
     * The nodes of an internal load balancer have only private IP addresses. The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes. Therefore, internal load balancers can route requests only from clients with access to the VPC for the load balancer.
     *
     * The default is an Internet-facing load balancer.
     *
     * You cannot specify a scheme for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-scheme
     */
    scheme: string | undefined;
    /**
     * [Application Load Balancers] The IDs of the security groups for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-securitygroups
     */
    securityGroups: string[] | undefined;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmappings
     */
    subnetMappings: Array<CfnLoadBalancer.SubnetMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both. To specify an Elastic IP address, specify subnet mappings instead of subnets.
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
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-subnets
     */
    subnets: string[] | undefined;
    /**
     * The tags to assign to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The type of load balancer. The default is `application` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-type
     */
    type: string | undefined;
    /**
     * Create a new `AWS::ElasticLoadBalancingV2::LoadBalancer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnLoadBalancerProps);
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
export declare namespace CfnLoadBalancer {
    /**
     * Specifies an attribute for an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattributes.html
     */
    interface LoadBalancerAttributeProperty {
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattributes.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattributes-key
         */
        readonly key?: string;
        /**
         * The value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattributes.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattributes-value
         */
        readonly value?: string;
    }
}
export declare namespace CfnLoadBalancer {
    /**
     * Specifies a subnet for a load balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html
     */
    interface SubnetMappingProperty {
        /**
         * [Network Load Balancers] The allocation ID of the Elastic IP address for an internet-facing load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-allocationid
         */
        readonly allocationId?: string;
        /**
         * [Network Load Balancers] The IPv6 address.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-ipv6address
         */
        readonly iPv6Address?: string;
        /**
         * [Network Load Balancers] The private IPv4 address for an internal load balancer.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-privateipv4address
         */
        readonly privateIPv4Address?: string;
        /**
         * The ID of the subnet.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html#cfn-elasticloadbalancingv2-loadbalancer-subnetmapping-subnetid
         */
        readonly subnetId: string;
    }
}
/**
 * Properties for defining a `CfnTargetGroup`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html
 */
export interface CfnTargetGroupProps {
    /**
     * Indicates whether health checks are enabled. If the target type is `lambda` , health checks are disabled by default but can be enabled. If the target type is `instance` , `ip` , or `alb` , health checks are always enabled and cannot be disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckenabled
     */
    readonly healthCheckEnabled?: boolean | cdk.IResolvable;
    /**
     * The approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. If the target group protocol is TCP, TLS, UDP, TCP_UDP, HTTP or HTTPS, the default is 30 seconds. If the target group protocol is GENEVE, the default is 10 seconds. If the target type is `lambda` , the default is 35 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckintervalseconds
     */
    readonly healthCheckIntervalSeconds?: number;
    /**
     * [HTTP/HTTPS health checks] The destination for health checks on the targets.
     *
     * [HTTP1 or HTTP2 protocol version] The ping path. The default is /.
     *
     * [GRPC protocol version] The path of a custom health check method with the format /package.service/method. The default is / AWS .ALB/healthcheck.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckpath
     */
    readonly healthCheckPath?: string;
    /**
     * The port the load balancer uses when performing health checks on targets. If the protocol is HTTP, HTTPS, TCP, TLS, UDP, or TCP_UDP, the default is `traffic-port` , which is the port on which each target receives traffic from the load balancer. If the protocol is GENEVE, the default is port 80.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckport
     */
    readonly healthCheckPort?: string;
    /**
     * The protocol the load balancer uses when performing health checks on targets. For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckprotocol
     */
    readonly healthCheckProtocol?: string;
    /**
     * The amount of time, in seconds, during which no response from a target means a failed health check. The range is 2–120 seconds. For target groups with a protocol of HTTP, the default is 6 seconds. For target groups with a protocol of TCP, TLS or HTTPS, the default is 10 seconds. For target groups with a protocol of GENEVE, the default is 5 seconds. If the target type is `lambda` , the default is 30 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthchecktimeoutseconds
     */
    readonly healthCheckTimeoutSeconds?: number;
    /**
     * The number of consecutive health check successes required before considering a target healthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 5. For target groups with a protocol of GENEVE, the default is 3. If the target type is `lambda` , the default is 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthythresholdcount
     */
    readonly healthyThresholdCount?: number;
    /**
     * The type of IP address used for this target group. The possible values are `ipv4` and `ipv6` . This is an optional parameter. If not specified, the IP address type defaults to `ipv4` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-ipaddresstype
     */
    readonly ipAddressType?: string;
    /**
     * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target. For target groups with a protocol of TCP, TCP_UDP, UDP or TLS the range is 200-599. For target groups with a protocol of HTTP or HTTPS, the range is 200-499. For target groups with a protocol of GENEVE, the range is 200-399.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-matcher
     */
    readonly matcher?: CfnTargetGroup.MatcherProperty | cdk.IResolvable;
    /**
     * The name of the target group.
     *
     * This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-name
     */
    readonly name?: string;
    /**
     * The port on which the targets receive traffic. This port is used unless you specify a port override when registering the target. If the target is a Lambda function, this parameter does not apply. If the protocol is GENEVE, the supported port is 6081.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-port
     */
    readonly port?: number;
    /**
     * The protocol to use for routing traffic to the targets. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, or TCP_UDP. For Gateway Load Balancers, the supported protocol is GENEVE. A TCP_UDP listener must be associated with a TCP_UDP target group. If the target is a Lambda function, this parameter does not apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocol
     */
    readonly protocol?: string;
    /**
     * [HTTP/HTTPS protocol] The protocol version. The possible values are `GRPC` , `HTTP1` , and `HTTP2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocolversion
     */
    readonly protocolVersion?: string;
    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattributes
     */
    readonly targetGroupAttributes?: Array<CfnTargetGroup.TargetGroupAttributeProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The targets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targets
     */
    readonly targets?: Array<CfnTargetGroup.TargetDescriptionProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The type of target that you must specify when registering targets with this target group. You can't specify targets for a target group using more than one target type.
     *
     * - `instance` - Register targets by instance ID. This is the default value.
     * - `ip` - Register targets by IP address. You can specify IP addresses from the subnets of the virtual private cloud (VPC) for the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify publicly routable IP addresses.
     * - `lambda` - Register a single Lambda function as a target.
     * - `alb` - Register a single Application Load Balancer as a target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targettype
     */
    readonly targetType?: string;
    /**
     * The number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 2. For target groups with a protocol of GENEVE, the default is 3. If the target type is `lambda` , the default is 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-unhealthythresholdcount
     */
    readonly unhealthyThresholdCount?: number;
    /**
     * The identifier of the virtual private cloud (VPC). If the target is a Lambda function, this parameter does not apply. Otherwise, this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-vpcid
     */
    readonly vpcId?: string;
}
/**
 * A CloudFormation `AWS::ElasticLoadBalancingV2::TargetGroup`
 *
 * Specifies a target group for an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
 *
 * Before you register a Lambda function as a target, you must create a `AWS::Lambda::Permission` resource that grants the Elastic Load Balancing service principal permission to invoke the Lambda function.
 *
 * @cloudformationResource AWS::ElasticLoadBalancingV2::TargetGroup
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html
 */
export declare class CfnTargetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::TargetGroup";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTargetGroup;
    /**
     * The Amazon Resource Name (ARN) of the load balancer that routes traffic to this target group.
     * @cloudformationAttribute LoadBalancerArns
     */
    readonly attrLoadBalancerArns: string[];
    /**
     * The Amazon Resource Name (ARN) of the target group.
     * @cloudformationAttribute TargetGroupArn
     */
    readonly attrTargetGroupArn: string;
    /**
     * The full name of the target group. For example, `targetgroup/my-target-group/cbf133c568e0d028` .
     * @cloudformationAttribute TargetGroupFullName
     */
    readonly attrTargetGroupFullName: string;
    /**
     * The name of the target group. For example, `my-target-group` .
     * @cloudformationAttribute TargetGroupName
     */
    readonly attrTargetGroupName: string;
    /**
     * Indicates whether health checks are enabled. If the target type is `lambda` , health checks are disabled by default but can be enabled. If the target type is `instance` , `ip` , or `alb` , health checks are always enabled and cannot be disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckenabled
     */
    healthCheckEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * The approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. If the target group protocol is TCP, TLS, UDP, TCP_UDP, HTTP or HTTPS, the default is 30 seconds. If the target group protocol is GENEVE, the default is 10 seconds. If the target type is `lambda` , the default is 35 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckintervalseconds
     */
    healthCheckIntervalSeconds: number | undefined;
    /**
     * [HTTP/HTTPS health checks] The destination for health checks on the targets.
     *
     * [HTTP1 or HTTP2 protocol version] The ping path. The default is /.
     *
     * [GRPC protocol version] The path of a custom health check method with the format /package.service/method. The default is / AWS .ALB/healthcheck.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckpath
     */
    healthCheckPath: string | undefined;
    /**
     * The port the load balancer uses when performing health checks on targets. If the protocol is HTTP, HTTPS, TCP, TLS, UDP, or TCP_UDP, the default is `traffic-port` , which is the port on which each target receives traffic from the load balancer. If the protocol is GENEVE, the default is port 80.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckport
     */
    healthCheckPort: string | undefined;
    /**
     * The protocol the load balancer uses when performing health checks on targets. For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckprotocol
     */
    healthCheckProtocol: string | undefined;
    /**
     * The amount of time, in seconds, during which no response from a target means a failed health check. The range is 2–120 seconds. For target groups with a protocol of HTTP, the default is 6 seconds. For target groups with a protocol of TCP, TLS or HTTPS, the default is 10 seconds. For target groups with a protocol of GENEVE, the default is 5 seconds. If the target type is `lambda` , the default is 30 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthchecktimeoutseconds
     */
    healthCheckTimeoutSeconds: number | undefined;
    /**
     * The number of consecutive health check successes required before considering a target healthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 5. For target groups with a protocol of GENEVE, the default is 3. If the target type is `lambda` , the default is 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthythresholdcount
     */
    healthyThresholdCount: number | undefined;
    /**
     * The type of IP address used for this target group. The possible values are `ipv4` and `ipv6` . This is an optional parameter. If not specified, the IP address type defaults to `ipv4` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-ipaddresstype
     */
    ipAddressType: string | undefined;
    /**
     * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target. For target groups with a protocol of TCP, TCP_UDP, UDP or TLS the range is 200-599. For target groups with a protocol of HTTP or HTTPS, the range is 200-499. For target groups with a protocol of GENEVE, the range is 200-399.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-matcher
     */
    matcher: CfnTargetGroup.MatcherProperty | cdk.IResolvable | undefined;
    /**
     * The name of the target group.
     *
     * This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-name
     */
    name: string | undefined;
    /**
     * The port on which the targets receive traffic. This port is used unless you specify a port override when registering the target. If the target is a Lambda function, this parameter does not apply. If the protocol is GENEVE, the supported port is 6081.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-port
     */
    port: number | undefined;
    /**
     * The protocol to use for routing traffic to the targets. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, or TCP_UDP. For Gateway Load Balancers, the supported protocol is GENEVE. A TCP_UDP listener must be associated with a TCP_UDP target group. If the target is a Lambda function, this parameter does not apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocol
     */
    protocol: string | undefined;
    /**
     * [HTTP/HTTPS protocol] The protocol version. The possible values are `GRPC` , `HTTP1` , and `HTTP2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocolversion
     */
    protocolVersion: string | undefined;
    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattributes
     */
    targetGroupAttributes: Array<CfnTargetGroup.TargetGroupAttributeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The targets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targets
     */
    targets: Array<CfnTargetGroup.TargetDescriptionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The type of target that you must specify when registering targets with this target group. You can't specify targets for a target group using more than one target type.
     *
     * - `instance` - Register targets by instance ID. This is the default value.
     * - `ip` - Register targets by IP address. You can specify IP addresses from the subnets of the virtual private cloud (VPC) for the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify publicly routable IP addresses.
     * - `lambda` - Register a single Lambda function as a target.
     * - `alb` - Register a single Application Load Balancer as a target.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targettype
     */
    targetType: string | undefined;
    /**
     * The number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 2. For target groups with a protocol of GENEVE, the default is 3. If the target type is `lambda` , the default is 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-unhealthythresholdcount
     */
    unhealthyThresholdCount: number | undefined;
    /**
     * The identifier of the virtual private cloud (VPC). If the target is a Lambda function, this parameter does not apply. Otherwise, this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-vpcid
     */
    vpcId: string | undefined;
    /**
     * Create a new `AWS::ElasticLoadBalancingV2::TargetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnTargetGroupProps);
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
export declare namespace CfnTargetGroup {
    /**
     * Specifies the HTTP codes that healthy targets must use when responding to an HTTP health check.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html
     */
    interface MatcherProperty {
        /**
         * You can specify values between 0 and 99. You can specify multiple values (for example, "0,1") or a range of values (for example, "0-5"). The default value is 12.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html#cfn-elasticloadbalancingv2-targetgroup-matcher-grpccode
         */
        readonly grpcCode?: string;
        /**
         * For Application Load Balancers, you can specify values between 200 and 499, with the default value being 200. You can specify multiple values (for example, "200,202") or a range of values (for example, "200-299").
         *
         * For Network Load Balancers, you can specify values between 200 and 599, with the default value being 200-399. You can specify multiple values (for example, "200,202") or a range of values (for example, "200-299").
         *
         * For Gateway Load Balancers, this must be "200–399".
         *
         * Note that when using shorthand syntax, some values such as commas need to be escaped.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html#cfn-elasticloadbalancingv2-targetgroup-matcher-httpcode
         */
        readonly httpCode?: string;
    }
}
export declare namespace CfnTargetGroup {
    /**
     * Specifies a target to add to a target group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html
     */
    interface TargetDescriptionProperty {
        /**
         * An Availability Zone or `all` . This determines whether the target receives traffic from the load balancer nodes in the specified Availability Zone or from all enabled Availability Zones for the load balancer.
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
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html#cfn-elasticloadbalancingv2-targetgroup-targetdescription-availabilityzone
         */
        readonly availabilityZone?: string;
        /**
         * The ID of the target. If the target type of the target group is `instance` , specify an instance ID. If the target type is `ip` , specify an IP address. If the target type is `lambda` , specify the ARN of the Lambda function. If the target type is `alb` , specify the ARN of the Application Load Balancer target.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html#cfn-elasticloadbalancingv2-targetgroup-targetdescription-id
         */
        readonly id: string;
        /**
         * The port on which the target is listening. If the target group protocol is GENEVE, the supported port is 6081. If the target type is `alb` , the targeted Application Load Balancer must have at least one listener whose port matches the target group port. Not used if the target is a Lambda function.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html#cfn-elasticloadbalancingv2-targetgroup-targetdescription-port
         */
        readonly port?: number;
    }
}
export declare namespace CfnTargetGroup {
    /**
     * Specifies a target group attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html
     */
    interface TargetGroupAttributeProperty {
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
         * - `load_balancing.algorithm.type` - The load balancing algorithm determines how the load balancer selects targets when routing requests. The value is `round_robin` or `least_outstanding_requests` . The default is `round_robin` .
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
         * - `deregistration_delay.connection_termination.enabled` - Indicates whether the load balancer terminates connections at the end of the deregistration timeout. The value is `true` or `false` . The default is `false` .
         * - `preserve_client_ip.enabled` - Indicates whether client IP preservation is enabled. The value is `true` or `false` . The default is disabled if the target group type is IP address and the target group protocol is TCP or TLS. Otherwise, the default is enabled. Client IP preservation cannot be disabled for UDP and TCP_UDP target groups.
         * - `proxy_protocol_v2.enabled` - Indicates whether Proxy Protocol version 2 is enabled. The value is `true` or `false` . The default is `false` .
         *
         * The following attributes are supported only by Gateway Load Balancers:
         *
         * - `target_failover.on_deregistration` - Indicates how the Gateway Load Balancer handles existing flows when a target is deregistered. The possible values are `rebalance` and `no_rebalance` . The default is `no_rebalance` . The two attributes ( `target_failover.on_deregistration` and `target_failover.on_unhealthy` ) can't be set independently. The value you set for both attributes must be the same.
         * - `target_failover.on_unhealthy` - Indicates how the Gateway Load Balancer handles existing flows when a target is unhealthy. The possible values are `rebalance` and `no_rebalance` . The default is `no_rebalance` . The two attributes ( `target_failover.on_deregistration` and `target_failover.on_unhealthy` ) cannot be set independently. The value you set for both attributes must be the same.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattribute-key
         */
        readonly key?: string;
        /**
         * The value of the attribute.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattribute-value
         */
        readonly value?: string;
    }
}
