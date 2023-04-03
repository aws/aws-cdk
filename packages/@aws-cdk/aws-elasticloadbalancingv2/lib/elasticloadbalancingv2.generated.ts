// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-09T03:56:15.068Z","fingerprint":"ONP86E593kjJWL0CZ44j2pBrH8XuHvwIL7DzIRoBjYE="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

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
 * Determine whether the given properties match those of a `CfnListenerProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerProps`
 *
 * @returns the result of the validation.
 */
function CfnListenerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('alpnPolicy', cdk.listValidator(cdk.validateString))(properties.alpnPolicy));
    errors.collect(cdk.propertyValidator('certificates', cdk.listValidator(CfnListener_CertificatePropertyValidator))(properties.certificates));
    errors.collect(cdk.propertyValidator('defaultActions', cdk.requiredValidator)(properties.defaultActions));
    errors.collect(cdk.propertyValidator('defaultActions', cdk.listValidator(CfnListener_ActionPropertyValidator))(properties.defaultActions));
    errors.collect(cdk.propertyValidator('loadBalancerArn', cdk.requiredValidator)(properties.loadBalancerArn));
    errors.collect(cdk.propertyValidator('loadBalancerArn', cdk.validateString)(properties.loadBalancerArn));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('sslPolicy', cdk.validateString)(properties.sslPolicy));
    return errors.wrap('supplied properties not correct for "CfnListenerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener` resource
 *
 * @param properties - the TypeScript properties of a `CfnListenerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener` resource.
 */
// @ts-ignore TS6133
function cfnListenerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerPropsValidator(properties).assertSuccess();
    return {
        DefaultActions: cdk.listMapper(cfnListenerActionPropertyToCloudFormation)(properties.defaultActions),
        LoadBalancerArn: cdk.stringToCloudFormation(properties.loadBalancerArn),
        AlpnPolicy: cdk.listMapper(cdk.stringToCloudFormation)(properties.alpnPolicy),
        Certificates: cdk.listMapper(cfnListenerCertificatePropertyToCloudFormation)(properties.certificates),
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        SslPolicy: cdk.stringToCloudFormation(properties.sslPolicy),
    };
}

// @ts-ignore TS6133
function CfnListenerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerProps>();
    ret.addPropertyResult('defaultActions', 'DefaultActions', cfn_parse.FromCloudFormation.getArray(CfnListenerActionPropertyFromCloudFormation)(properties.DefaultActions));
    ret.addPropertyResult('loadBalancerArn', 'LoadBalancerArn', cfn_parse.FromCloudFormation.getString(properties.LoadBalancerArn));
    ret.addPropertyResult('alpnPolicy', 'AlpnPolicy', properties.AlpnPolicy != null ? cfn_parse.FromCloudFormation.getStringArray(properties.AlpnPolicy) : undefined);
    ret.addPropertyResult('certificates', 'Certificates', properties.Certificates != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerCertificatePropertyFromCloudFormation)(properties.Certificates) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('sslPolicy', 'SslPolicy', properties.SslPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SslPolicy) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnListener extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::Listener";

    /**
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
        const ret = new CfnListener(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the listener.
     * @cloudformationAttribute ListenerArn
     */
    public readonly attrListenerArn: string;

    /**
     * The actions for the default rule. You cannot define a condition for a default rule.
     *
     * To create additional rules for an Application Load Balancer, use [AWS::ElasticLoadBalancingV2::ListenerRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-defaultactions
     */
    public defaultActions: Array<CfnListener.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-loadbalancerarn
     */
    public loadBalancerArn: string;

    /**
     * [TLS listener] The name of the Application-Layer Protocol Negotiation (ALPN) policy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-alpnpolicy
     */
    public alpnPolicy: string[] | undefined;

    /**
     * The default SSL server certificate for a secure listener. You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
     *
     * To create a certificate list for a secure listener, use [AWS::ElasticLoadBalancingV2::ListenerCertificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-certificates
     */
    public certificates: Array<CfnListener.CertificateProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The port on which the load balancer is listening. You cannot specify a port for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-port
     */
    public port: number | undefined;

    /**
     * The protocol for connections from clients to the load balancer. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, and TCP_UDP. You can’t specify the UDP or TCP_UDP protocol if dual-stack mode is enabled. You cannot specify a protocol for a Gateway Load Balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-protocol
     */
    public protocol: string | undefined;

    /**
     * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported.
     *
     * For more information, see [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html#describe-ssl-policies) in the *Application Load Balancers Guide* and [Security policies](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/create-tls-listener.html#describe-ssl-policies) in the *Network Load Balancers Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listener.html#cfn-elasticloadbalancingv2-listener-sslpolicy
     */
    public sslPolicy: string | undefined;

    /**
     * Create a new `AWS::ElasticLoadBalancingV2::Listener`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnListenerProps) {
        super(scope, id, { type: CfnListener.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'defaultActions', this);
        cdk.requireProperty(props, 'loadBalancerArn', this);
        this.attrListenerArn = cdk.Token.asString(this.getAtt('ListenerArn', cdk.ResolutionTypeHint.STRING));

        this.defaultActions = props.defaultActions;
        this.loadBalancerArn = props.loadBalancerArn;
        this.alpnPolicy = props.alpnPolicy;
        this.certificates = props.certificates;
        this.port = props.port;
        this.protocol = props.protocol;
        this.sslPolicy = props.sslPolicy;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnListener.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            defaultActions: this.defaultActions,
            loadBalancerArn: this.loadBalancerArn,
            alpnPolicy: this.alpnPolicy,
            certificates: this.certificates,
            port: this.port,
            protocol: this.protocol,
            sslPolicy: this.sslPolicy,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnListenerPropsToCloudFormation(props);
    }
}

export namespace CfnListener {
    /**
     * Specifies an action for a listener rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-action.html
     */
    export interface ActionProperty {
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

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticateCognitoConfig', CfnListener_AuthenticateCognitoConfigPropertyValidator)(properties.authenticateCognitoConfig));
    errors.collect(cdk.propertyValidator('authenticateOidcConfig', CfnListener_AuthenticateOidcConfigPropertyValidator)(properties.authenticateOidcConfig));
    errors.collect(cdk.propertyValidator('fixedResponseConfig', CfnListener_FixedResponseConfigPropertyValidator)(properties.fixedResponseConfig));
    errors.collect(cdk.propertyValidator('forwardConfig', CfnListener_ForwardConfigPropertyValidator)(properties.forwardConfig));
    errors.collect(cdk.propertyValidator('order', cdk.validateNumber)(properties.order));
    errors.collect(cdk.propertyValidator('redirectConfig', CfnListener_RedirectConfigPropertyValidator)(properties.redirectConfig));
    errors.collect(cdk.propertyValidator('targetGroupArn', cdk.validateString)(properties.targetGroupArn));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.Action` resource.
 */
// @ts-ignore TS6133
function cfnListenerActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_ActionPropertyValidator(properties).assertSuccess();
    return {
        AuthenticateCognitoConfig: cfnListenerAuthenticateCognitoConfigPropertyToCloudFormation(properties.authenticateCognitoConfig),
        AuthenticateOidcConfig: cfnListenerAuthenticateOidcConfigPropertyToCloudFormation(properties.authenticateOidcConfig),
        FixedResponseConfig: cfnListenerFixedResponseConfigPropertyToCloudFormation(properties.fixedResponseConfig),
        ForwardConfig: cfnListenerForwardConfigPropertyToCloudFormation(properties.forwardConfig),
        Order: cdk.numberToCloudFormation(properties.order),
        RedirectConfig: cfnListenerRedirectConfigPropertyToCloudFormation(properties.redirectConfig),
        TargetGroupArn: cdk.stringToCloudFormation(properties.targetGroupArn),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnListenerActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.ActionProperty>();
    ret.addPropertyResult('authenticateCognitoConfig', 'AuthenticateCognitoConfig', properties.AuthenticateCognitoConfig != null ? CfnListenerAuthenticateCognitoConfigPropertyFromCloudFormation(properties.AuthenticateCognitoConfig) : undefined);
    ret.addPropertyResult('authenticateOidcConfig', 'AuthenticateOidcConfig', properties.AuthenticateOidcConfig != null ? CfnListenerAuthenticateOidcConfigPropertyFromCloudFormation(properties.AuthenticateOidcConfig) : undefined);
    ret.addPropertyResult('fixedResponseConfig', 'FixedResponseConfig', properties.FixedResponseConfig != null ? CfnListenerFixedResponseConfigPropertyFromCloudFormation(properties.FixedResponseConfig) : undefined);
    ret.addPropertyResult('forwardConfig', 'ForwardConfig', properties.ForwardConfig != null ? CfnListenerForwardConfigPropertyFromCloudFormation(properties.ForwardConfig) : undefined);
    ret.addPropertyResult('order', 'Order', properties.Order != null ? cfn_parse.FromCloudFormation.getNumber(properties.Order) : undefined);
    ret.addPropertyResult('redirectConfig', 'RedirectConfig', properties.RedirectConfig != null ? CfnListenerRedirectConfigPropertyFromCloudFormation(properties.RedirectConfig) : undefined);
    ret.addPropertyResult('targetGroupArn', 'TargetGroupArn', properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Specifies information required when integrating with Amazon Cognito to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html
     */
    export interface AuthenticateCognitoConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listener-authenticatecognitoconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: { [key: string]: (string) } | cdk.IResolvable;
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

/**
 * Determine whether the given properties match those of a `AuthenticateCognitoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateCognitoConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_AuthenticateCognitoConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationRequestExtraParams', cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
    errors.collect(cdk.propertyValidator('onUnauthenticatedRequest', cdk.validateString)(properties.onUnauthenticatedRequest));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('sessionCookieName', cdk.validateString)(properties.sessionCookieName));
    errors.collect(cdk.propertyValidator('sessionTimeout', cdk.validateString)(properties.sessionTimeout));
    errors.collect(cdk.propertyValidator('userPoolArn', cdk.requiredValidator)(properties.userPoolArn));
    errors.collect(cdk.propertyValidator('userPoolArn', cdk.validateString)(properties.userPoolArn));
    errors.collect(cdk.propertyValidator('userPoolClientId', cdk.requiredValidator)(properties.userPoolClientId));
    errors.collect(cdk.propertyValidator('userPoolClientId', cdk.validateString)(properties.userPoolClientId));
    errors.collect(cdk.propertyValidator('userPoolDomain', cdk.requiredValidator)(properties.userPoolDomain));
    errors.collect(cdk.propertyValidator('userPoolDomain', cdk.validateString)(properties.userPoolDomain));
    return errors.wrap('supplied properties not correct for "AuthenticateCognitoConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.AuthenticateCognitoConfig` resource
 *
 * @param properties - the TypeScript properties of a `AuthenticateCognitoConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.AuthenticateCognitoConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerAuthenticateCognitoConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_AuthenticateCognitoConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthenticationRequestExtraParams: cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
        OnUnauthenticatedRequest: cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
        Scope: cdk.stringToCloudFormation(properties.scope),
        SessionCookieName: cdk.stringToCloudFormation(properties.sessionCookieName),
        SessionTimeout: cdk.stringToCloudFormation(properties.sessionTimeout),
        UserPoolArn: cdk.stringToCloudFormation(properties.userPoolArn),
        UserPoolClientId: cdk.stringToCloudFormation(properties.userPoolClientId),
        UserPoolDomain: cdk.stringToCloudFormation(properties.userPoolDomain),
    };
}

// @ts-ignore TS6133
function CfnListenerAuthenticateCognitoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.AuthenticateCognitoConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.AuthenticateCognitoConfigProperty>();
    ret.addPropertyResult('authenticationRequestExtraParams', 'AuthenticationRequestExtraParams', properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined);
    ret.addPropertyResult('onUnauthenticatedRequest', 'OnUnauthenticatedRequest', properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined);
    ret.addPropertyResult('sessionCookieName', 'SessionCookieName', properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined);
    ret.addPropertyResult('sessionTimeout', 'SessionTimeout', properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getString(properties.SessionTimeout) : undefined);
    ret.addPropertyResult('userPoolArn', 'UserPoolArn', cfn_parse.FromCloudFormation.getString(properties.UserPoolArn));
    ret.addPropertyResult('userPoolClientId', 'UserPoolClientId', cfn_parse.FromCloudFormation.getString(properties.UserPoolClientId));
    ret.addPropertyResult('userPoolDomain', 'UserPoolDomain', cfn_parse.FromCloudFormation.getString(properties.UserPoolDomain));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Specifies information required using an identity provide (IdP) that is compliant with OpenID Connect (OIDC) to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html
     */
    export interface AuthenticateOidcConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listener-authenticateoidcconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: { [key: string]: (string) } | cdk.IResolvable;
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

/**
 * Determine whether the given properties match those of a `AuthenticateOidcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateOidcConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_AuthenticateOidcConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationRequestExtraParams', cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
    errors.collect(cdk.propertyValidator('authorizationEndpoint', cdk.requiredValidator)(properties.authorizationEndpoint));
    errors.collect(cdk.propertyValidator('authorizationEndpoint', cdk.validateString)(properties.authorizationEndpoint));
    errors.collect(cdk.propertyValidator('clientId', cdk.requiredValidator)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientSecret', cdk.validateString)(properties.clientSecret));
    errors.collect(cdk.propertyValidator('issuer', cdk.requiredValidator)(properties.issuer));
    errors.collect(cdk.propertyValidator('issuer', cdk.validateString)(properties.issuer));
    errors.collect(cdk.propertyValidator('onUnauthenticatedRequest', cdk.validateString)(properties.onUnauthenticatedRequest));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('sessionCookieName', cdk.validateString)(properties.sessionCookieName));
    errors.collect(cdk.propertyValidator('sessionTimeout', cdk.validateString)(properties.sessionTimeout));
    errors.collect(cdk.propertyValidator('tokenEndpoint', cdk.requiredValidator)(properties.tokenEndpoint));
    errors.collect(cdk.propertyValidator('tokenEndpoint', cdk.validateString)(properties.tokenEndpoint));
    errors.collect(cdk.propertyValidator('useExistingClientSecret', cdk.validateBoolean)(properties.useExistingClientSecret));
    errors.collect(cdk.propertyValidator('userInfoEndpoint', cdk.requiredValidator)(properties.userInfoEndpoint));
    errors.collect(cdk.propertyValidator('userInfoEndpoint', cdk.validateString)(properties.userInfoEndpoint));
    return errors.wrap('supplied properties not correct for "AuthenticateOidcConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.AuthenticateOidcConfig` resource
 *
 * @param properties - the TypeScript properties of a `AuthenticateOidcConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.AuthenticateOidcConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerAuthenticateOidcConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_AuthenticateOidcConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthenticationRequestExtraParams: cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
        AuthorizationEndpoint: cdk.stringToCloudFormation(properties.authorizationEndpoint),
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        ClientSecret: cdk.stringToCloudFormation(properties.clientSecret),
        Issuer: cdk.stringToCloudFormation(properties.issuer),
        OnUnauthenticatedRequest: cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
        Scope: cdk.stringToCloudFormation(properties.scope),
        SessionCookieName: cdk.stringToCloudFormation(properties.sessionCookieName),
        SessionTimeout: cdk.stringToCloudFormation(properties.sessionTimeout),
        TokenEndpoint: cdk.stringToCloudFormation(properties.tokenEndpoint),
        UseExistingClientSecret: cdk.booleanToCloudFormation(properties.useExistingClientSecret),
        UserInfoEndpoint: cdk.stringToCloudFormation(properties.userInfoEndpoint),
    };
}

// @ts-ignore TS6133
function CfnListenerAuthenticateOidcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.AuthenticateOidcConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.AuthenticateOidcConfigProperty>();
    ret.addPropertyResult('authenticationRequestExtraParams', 'AuthenticationRequestExtraParams', properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined);
    ret.addPropertyResult('authorizationEndpoint', 'AuthorizationEndpoint', cfn_parse.FromCloudFormation.getString(properties.AuthorizationEndpoint));
    ret.addPropertyResult('clientId', 'ClientId', cfn_parse.FromCloudFormation.getString(properties.ClientId));
    ret.addPropertyResult('clientSecret', 'ClientSecret', properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined);
    ret.addPropertyResult('issuer', 'Issuer', cfn_parse.FromCloudFormation.getString(properties.Issuer));
    ret.addPropertyResult('onUnauthenticatedRequest', 'OnUnauthenticatedRequest', properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined);
    ret.addPropertyResult('sessionCookieName', 'SessionCookieName', properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined);
    ret.addPropertyResult('sessionTimeout', 'SessionTimeout', properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getString(properties.SessionTimeout) : undefined);
    ret.addPropertyResult('tokenEndpoint', 'TokenEndpoint', cfn_parse.FromCloudFormation.getString(properties.TokenEndpoint));
    ret.addPropertyResult('useExistingClientSecret', 'UseExistingClientSecret', properties.UseExistingClientSecret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseExistingClientSecret) : undefined);
    ret.addPropertyResult('userInfoEndpoint', 'UserInfoEndpoint', cfn_parse.FromCloudFormation.getString(properties.UserInfoEndpoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Specifies an SSL server certificate to use as the default certificate for a secure listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificate.html
     */
    export interface CertificateProperty {
        /**
         * The Amazon Resource Name (ARN) of the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificate.html#cfn-elasticloadbalancingv2-listener-certificate-certificatearn
         */
        readonly certificateArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CertificateProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_CertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    return errors.wrap('supplied properties not correct for "CertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.Certificate` resource.
 */
// @ts-ignore TS6133
function cfnListenerCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_CertificatePropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
    };
}

// @ts-ignore TS6133
function CfnListenerCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.CertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.CertificateProperty>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Specifies information required when returning a custom HTTP response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-fixedresponseconfig.html
     */
    export interface FixedResponseConfigProperty {
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

/**
 * Determine whether the given properties match those of a `FixedResponseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FixedResponseConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_FixedResponseConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    errors.collect(cdk.propertyValidator('messageBody', cdk.validateString)(properties.messageBody));
    errors.collect(cdk.propertyValidator('statusCode', cdk.requiredValidator)(properties.statusCode));
    errors.collect(cdk.propertyValidator('statusCode', cdk.validateString)(properties.statusCode));
    return errors.wrap('supplied properties not correct for "FixedResponseConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.FixedResponseConfig` resource
 *
 * @param properties - the TypeScript properties of a `FixedResponseConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.FixedResponseConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerFixedResponseConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_FixedResponseConfigPropertyValidator(properties).assertSuccess();
    return {
        ContentType: cdk.stringToCloudFormation(properties.contentType),
        MessageBody: cdk.stringToCloudFormation(properties.messageBody),
        StatusCode: cdk.stringToCloudFormation(properties.statusCode),
    };
}

// @ts-ignore TS6133
function CfnListenerFixedResponseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.FixedResponseConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.FixedResponseConfigProperty>();
    ret.addPropertyResult('contentType', 'ContentType', properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined);
    ret.addPropertyResult('messageBody', 'MessageBody', properties.MessageBody != null ? cfn_parse.FromCloudFormation.getString(properties.MessageBody) : undefined);
    ret.addPropertyResult('statusCode', 'StatusCode', cfn_parse.FromCloudFormation.getString(properties.StatusCode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-forwardconfig.html
     */
    export interface ForwardConfigProperty {
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

/**
 * Determine whether the given properties match those of a `ForwardConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_ForwardConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetGroupStickinessConfig', CfnListener_TargetGroupStickinessConfigPropertyValidator)(properties.targetGroupStickinessConfig));
    errors.collect(cdk.propertyValidator('targetGroups', cdk.listValidator(CfnListener_TargetGroupTuplePropertyValidator))(properties.targetGroups));
    return errors.wrap('supplied properties not correct for "ForwardConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.ForwardConfig` resource
 *
 * @param properties - the TypeScript properties of a `ForwardConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.ForwardConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerForwardConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_ForwardConfigPropertyValidator(properties).assertSuccess();
    return {
        TargetGroupStickinessConfig: cfnListenerTargetGroupStickinessConfigPropertyToCloudFormation(properties.targetGroupStickinessConfig),
        TargetGroups: cdk.listMapper(cfnListenerTargetGroupTuplePropertyToCloudFormation)(properties.targetGroups),
    };
}

// @ts-ignore TS6133
function CfnListenerForwardConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.ForwardConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.ForwardConfigProperty>();
    ret.addPropertyResult('targetGroupStickinessConfig', 'TargetGroupStickinessConfig', properties.TargetGroupStickinessConfig != null ? CfnListenerTargetGroupStickinessConfigPropertyFromCloudFormation(properties.TargetGroupStickinessConfig) : undefined);
    ret.addPropertyResult('targetGroups', 'TargetGroups', properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerTargetGroupTuplePropertyFromCloudFormation)(properties.TargetGroups) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
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
    export interface RedirectConfigProperty {
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

/**
 * Determine whether the given properties match those of a `RedirectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_RedirectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('port', cdk.validateString)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('query', cdk.validateString)(properties.query));
    errors.collect(cdk.propertyValidator('statusCode', cdk.requiredValidator)(properties.statusCode));
    errors.collect(cdk.propertyValidator('statusCode', cdk.validateString)(properties.statusCode));
    return errors.wrap('supplied properties not correct for "RedirectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.RedirectConfig` resource
 *
 * @param properties - the TypeScript properties of a `RedirectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.RedirectConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRedirectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_RedirectConfigPropertyValidator(properties).assertSuccess();
    return {
        Host: cdk.stringToCloudFormation(properties.host),
        Path: cdk.stringToCloudFormation(properties.path),
        Port: cdk.stringToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        Query: cdk.stringToCloudFormation(properties.query),
        StatusCode: cdk.stringToCloudFormation(properties.statusCode),
    };
}

// @ts-ignore TS6133
function CfnListenerRedirectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.RedirectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.RedirectConfigProperty>();
    ret.addPropertyResult('host', 'Host', properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('query', 'Query', properties.Query != null ? cfn_parse.FromCloudFormation.getString(properties.Query) : undefined);
    ret.addPropertyResult('statusCode', 'StatusCode', cfn_parse.FromCloudFormation.getString(properties.StatusCode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Information about the target group stickiness for a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgroupstickinessconfig.html
     */
    export interface TargetGroupStickinessConfigProperty {
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

/**
 * Determine whether the given properties match those of a `TargetGroupStickinessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupStickinessConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_TargetGroupStickinessConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('durationSeconds', cdk.validateNumber)(properties.durationSeconds));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TargetGroupStickinessConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.TargetGroupStickinessConfig` resource
 *
 * @param properties - the TypeScript properties of a `TargetGroupStickinessConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.TargetGroupStickinessConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerTargetGroupStickinessConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_TargetGroupStickinessConfigPropertyValidator(properties).assertSuccess();
    return {
        DurationSeconds: cdk.numberToCloudFormation(properties.durationSeconds),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnListenerTargetGroupStickinessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.TargetGroupStickinessConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.TargetGroupStickinessConfigProperty>();
    ret.addPropertyResult('durationSeconds', 'DurationSeconds', properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListener {
    /**
     * Information about how traffic will be distributed between multiple target groups in a forward rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-targetgrouptuple.html
     */
    export interface TargetGroupTupleProperty {
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
 * Determine whether the given properties match those of a `TargetGroupTupleProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupTupleProperty`
 *
 * @returns the result of the validation.
 */
function CfnListener_TargetGroupTuplePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetGroupArn', cdk.validateString)(properties.targetGroupArn));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "TargetGroupTupleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.TargetGroupTuple` resource
 *
 * @param properties - the TypeScript properties of a `TargetGroupTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::Listener.TargetGroupTuple` resource.
 */
// @ts-ignore TS6133
function cfnListenerTargetGroupTuplePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListener_TargetGroupTuplePropertyValidator(properties).assertSuccess();
    return {
        TargetGroupArn: cdk.stringToCloudFormation(properties.targetGroupArn),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnListenerTargetGroupTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListener.TargetGroupTupleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListener.TargetGroupTupleProperty>();
    ret.addPropertyResult('targetGroupArn', 'TargetGroupArn', properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined);
    ret.addPropertyResult('weight', 'Weight', properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnListenerCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerCertificateProps`
 *
 * @returns the result of the validation.
 */
function CfnListenerCertificatePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificates', cdk.requiredValidator)(properties.certificates));
    errors.collect(cdk.propertyValidator('certificates', cdk.listValidator(CfnListenerCertificate_CertificatePropertyValidator))(properties.certificates));
    errors.collect(cdk.propertyValidator('listenerArn', cdk.requiredValidator)(properties.listenerArn));
    errors.collect(cdk.propertyValidator('listenerArn', cdk.validateString)(properties.listenerArn));
    return errors.wrap('supplied properties not correct for "CfnListenerCertificateProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerCertificate` resource
 *
 * @param properties - the TypeScript properties of a `CfnListenerCertificateProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerCertificate` resource.
 */
// @ts-ignore TS6133
function cfnListenerCertificatePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerCertificatePropsValidator(properties).assertSuccess();
    return {
        Certificates: cdk.listMapper(cfnListenerCertificateCertificatePropertyToCloudFormation)(properties.certificates),
        ListenerArn: cdk.stringToCloudFormation(properties.listenerArn),
    };
}

// @ts-ignore TS6133
function CfnListenerCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerCertificateProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerCertificateProps>();
    ret.addPropertyResult('certificates', 'Certificates', cfn_parse.FromCloudFormation.getArray(CfnListenerCertificateCertificatePropertyFromCloudFormation)(properties.Certificates));
    ret.addPropertyResult('listenerArn', 'ListenerArn', cfn_parse.FromCloudFormation.getString(properties.ListenerArn));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnListenerCertificate extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::ListenerCertificate";

    /**
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
        const ret = new CfnListenerCertificate(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The certificate. You can specify one certificate per resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-certificates
     */
    public certificates: Array<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenercertificate.html#cfn-elasticloadbalancingv2-listenercertificate-listenerarn
     */
    public listenerArn: string;

    /**
     * Create a new `AWS::ElasticLoadBalancingV2::ListenerCertificate`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnListenerCertificateProps) {
        super(scope, id, { type: CfnListenerCertificate.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'certificates', this);
        cdk.requireProperty(props, 'listenerArn', this);

        this.certificates = props.certificates;
        this.listenerArn = props.listenerArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnListenerCertificate.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            certificates: this.certificates,
            listenerArn: this.listenerArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnListenerCertificatePropsToCloudFormation(props);
    }
}

export namespace CfnListenerCertificate {
    /**
     * Specifies an SSL server certificate for the certificate list of a secure listener.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificates.html
     */
    export interface CertificateProperty {
        /**
         * The Amazon Resource Name (ARN) of the certificate.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listener-certificates.html#cfn-elasticloadbalancingv2-listener-certificates-certificatearn
         */
        readonly certificateArn?: string;
    }
}

/**
 * Determine whether the given properties match those of a `CertificateProperty`
 *
 * @param properties - the TypeScript properties of a `CertificateProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerCertificate_CertificatePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('certificateArn', cdk.validateString)(properties.certificateArn));
    return errors.wrap('supplied properties not correct for "CertificateProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerCertificate.Certificate` resource
 *
 * @param properties - the TypeScript properties of a `CertificateProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerCertificate.Certificate` resource.
 */
// @ts-ignore TS6133
function cfnListenerCertificateCertificatePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerCertificate_CertificatePropertyValidator(properties).assertSuccess();
    return {
        CertificateArn: cdk.stringToCloudFormation(properties.certificateArn),
    };
}

// @ts-ignore TS6133
function CfnListenerCertificateCertificatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerCertificate.CertificateProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerCertificate.CertificateProperty>();
    ret.addPropertyResult('certificateArn', 'CertificateArn', properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnListenerRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnListenerRuleProps`
 *
 * @returns the result of the validation.
 */
function CfnListenerRulePropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('actions', cdk.requiredValidator)(properties.actions));
    errors.collect(cdk.propertyValidator('actions', cdk.listValidator(CfnListenerRule_ActionPropertyValidator))(properties.actions));
    errors.collect(cdk.propertyValidator('conditions', cdk.requiredValidator)(properties.conditions));
    errors.collect(cdk.propertyValidator('conditions', cdk.listValidator(CfnListenerRule_RuleConditionPropertyValidator))(properties.conditions));
    errors.collect(cdk.propertyValidator('listenerArn', cdk.requiredValidator)(properties.listenerArn));
    errors.collect(cdk.propertyValidator('listenerArn', cdk.validateString)(properties.listenerArn));
    errors.collect(cdk.propertyValidator('priority', cdk.requiredValidator)(properties.priority));
    errors.collect(cdk.propertyValidator('priority', cdk.validateNumber)(properties.priority));
    return errors.wrap('supplied properties not correct for "CfnListenerRuleProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule` resource
 *
 * @param properties - the TypeScript properties of a `CfnListenerRuleProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule` resource.
 */
// @ts-ignore TS6133
function cfnListenerRulePropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRulePropsValidator(properties).assertSuccess();
    return {
        Actions: cdk.listMapper(cfnListenerRuleActionPropertyToCloudFormation)(properties.actions),
        Conditions: cdk.listMapper(cfnListenerRuleRuleConditionPropertyToCloudFormation)(properties.conditions),
        ListenerArn: cdk.stringToCloudFormation(properties.listenerArn),
        Priority: cdk.numberToCloudFormation(properties.priority),
    };
}

// @ts-ignore TS6133
function CfnListenerRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRuleProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRuleProps>();
    ret.addPropertyResult('actions', 'Actions', cfn_parse.FromCloudFormation.getArray(CfnListenerRuleActionPropertyFromCloudFormation)(properties.Actions));
    ret.addPropertyResult('conditions', 'Conditions', cfn_parse.FromCloudFormation.getArray(CfnListenerRuleRuleConditionPropertyFromCloudFormation)(properties.Conditions));
    ret.addPropertyResult('listenerArn', 'ListenerArn', cfn_parse.FromCloudFormation.getString(properties.ListenerArn));
    ret.addPropertyResult('priority', 'Priority', cfn_parse.FromCloudFormation.getNumber(properties.Priority));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnListenerRule extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::ListenerRule";

    /**
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
        const ret = new CfnListenerRule(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Indicates whether this is the default rule.
     * @cloudformationAttribute IsDefault
     */
    public readonly attrIsDefault: cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the rule.
     * @cloudformationAttribute RuleArn
     */
    public readonly attrRuleArn: string;

    /**
     * The actions.
     *
     * The rule must include exactly one of the following types of actions: `forward` , `fixed-response` , or `redirect` , and it must be the last action to be performed. If the rule is for an HTTPS listener, it can also optionally include an authentication action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-actions
     */
    public actions: Array<CfnListenerRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The conditions.
     *
     * The rule can optionally include up to one of each of the following conditions: `http-request-method` , `host-header` , `path-pattern` , and `source-ip` . A rule can also optionally include one or more of each of the following conditions: `http-header` and `query-string` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-conditions
     */
    public conditions: Array<CfnListenerRule.RuleConditionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-listenerarn
     */
    public listenerArn: string;

    /**
     * The rule priority. A listener can't have multiple rules with the same priority.
     *
     * If you try to reorder rules by updating their priorities, do not specify a new priority if an existing rule already uses this priority, as this can cause an error. If you need to reuse a priority with a different rule, you must remove it as a priority first, and then specify it in a subsequent update.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-listenerrule.html#cfn-elasticloadbalancingv2-listenerrule-priority
     */
    public priority: number;

    /**
     * Create a new `AWS::ElasticLoadBalancingV2::ListenerRule`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnListenerRuleProps) {
        super(scope, id, { type: CfnListenerRule.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'actions', this);
        cdk.requireProperty(props, 'conditions', this);
        cdk.requireProperty(props, 'listenerArn', this);
        cdk.requireProperty(props, 'priority', this);
        this.attrIsDefault = this.getAtt('IsDefault', cdk.ResolutionTypeHint.STRING);
        this.attrRuleArn = cdk.Token.asString(this.getAtt('RuleArn', cdk.ResolutionTypeHint.STRING));

        this.actions = props.actions;
        this.conditions = props.conditions;
        this.listenerArn = props.listenerArn;
        this.priority = props.priority;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnListenerRule.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            actions: this.actions,
            conditions: this.conditions,
            listenerArn: this.listenerArn,
            priority: this.priority,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnListenerRulePropsToCloudFormation(props);
    }
}

export namespace CfnListenerRule {
    /**
     * Specifies an action for a listener rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-action.html
     */
    export interface ActionProperty {
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

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_ActionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticateCognitoConfig', CfnListenerRule_AuthenticateCognitoConfigPropertyValidator)(properties.authenticateCognitoConfig));
    errors.collect(cdk.propertyValidator('authenticateOidcConfig', CfnListenerRule_AuthenticateOidcConfigPropertyValidator)(properties.authenticateOidcConfig));
    errors.collect(cdk.propertyValidator('fixedResponseConfig', CfnListenerRule_FixedResponseConfigPropertyValidator)(properties.fixedResponseConfig));
    errors.collect(cdk.propertyValidator('forwardConfig', CfnListenerRule_ForwardConfigPropertyValidator)(properties.forwardConfig));
    errors.collect(cdk.propertyValidator('order', cdk.validateNumber)(properties.order));
    errors.collect(cdk.propertyValidator('redirectConfig', CfnListenerRule_RedirectConfigPropertyValidator)(properties.redirectConfig));
    errors.collect(cdk.propertyValidator('targetGroupArn', cdk.validateString)(properties.targetGroupArn));
    errors.collect(cdk.propertyValidator('type', cdk.requiredValidator)(properties.type));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "ActionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.Action` resource
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.Action` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleActionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_ActionPropertyValidator(properties).assertSuccess();
    return {
        AuthenticateCognitoConfig: cfnListenerRuleAuthenticateCognitoConfigPropertyToCloudFormation(properties.authenticateCognitoConfig),
        AuthenticateOidcConfig: cfnListenerRuleAuthenticateOidcConfigPropertyToCloudFormation(properties.authenticateOidcConfig),
        FixedResponseConfig: cfnListenerRuleFixedResponseConfigPropertyToCloudFormation(properties.fixedResponseConfig),
        ForwardConfig: cfnListenerRuleForwardConfigPropertyToCloudFormation(properties.forwardConfig),
        Order: cdk.numberToCloudFormation(properties.order),
        RedirectConfig: cfnListenerRuleRedirectConfigPropertyToCloudFormation(properties.redirectConfig),
        TargetGroupArn: cdk.stringToCloudFormation(properties.targetGroupArn),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.ActionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.ActionProperty>();
    ret.addPropertyResult('authenticateCognitoConfig', 'AuthenticateCognitoConfig', properties.AuthenticateCognitoConfig != null ? CfnListenerRuleAuthenticateCognitoConfigPropertyFromCloudFormation(properties.AuthenticateCognitoConfig) : undefined);
    ret.addPropertyResult('authenticateOidcConfig', 'AuthenticateOidcConfig', properties.AuthenticateOidcConfig != null ? CfnListenerRuleAuthenticateOidcConfigPropertyFromCloudFormation(properties.AuthenticateOidcConfig) : undefined);
    ret.addPropertyResult('fixedResponseConfig', 'FixedResponseConfig', properties.FixedResponseConfig != null ? CfnListenerRuleFixedResponseConfigPropertyFromCloudFormation(properties.FixedResponseConfig) : undefined);
    ret.addPropertyResult('forwardConfig', 'ForwardConfig', properties.ForwardConfig != null ? CfnListenerRuleForwardConfigPropertyFromCloudFormation(properties.ForwardConfig) : undefined);
    ret.addPropertyResult('order', 'Order', properties.Order != null ? cfn_parse.FromCloudFormation.getNumber(properties.Order) : undefined);
    ret.addPropertyResult('redirectConfig', 'RedirectConfig', properties.RedirectConfig != null ? CfnListenerRuleRedirectConfigPropertyFromCloudFormation(properties.RedirectConfig) : undefined);
    ret.addPropertyResult('targetGroupArn', 'TargetGroupArn', properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined);
    ret.addPropertyResult('type', 'Type', cfn_parse.FromCloudFormation.getString(properties.Type));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Specifies information required when integrating with Amazon Cognito to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html
     */
    export interface AuthenticateCognitoConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticatecognitoconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: { [key: string]: (string) } | cdk.IResolvable;
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

/**
 * Determine whether the given properties match those of a `AuthenticateCognitoConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateCognitoConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_AuthenticateCognitoConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationRequestExtraParams', cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
    errors.collect(cdk.propertyValidator('onUnauthenticatedRequest', cdk.validateString)(properties.onUnauthenticatedRequest));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('sessionCookieName', cdk.validateString)(properties.sessionCookieName));
    errors.collect(cdk.propertyValidator('sessionTimeout', cdk.validateNumber)(properties.sessionTimeout));
    errors.collect(cdk.propertyValidator('userPoolArn', cdk.requiredValidator)(properties.userPoolArn));
    errors.collect(cdk.propertyValidator('userPoolArn', cdk.validateString)(properties.userPoolArn));
    errors.collect(cdk.propertyValidator('userPoolClientId', cdk.requiredValidator)(properties.userPoolClientId));
    errors.collect(cdk.propertyValidator('userPoolClientId', cdk.validateString)(properties.userPoolClientId));
    errors.collect(cdk.propertyValidator('userPoolDomain', cdk.requiredValidator)(properties.userPoolDomain));
    errors.collect(cdk.propertyValidator('userPoolDomain', cdk.validateString)(properties.userPoolDomain));
    return errors.wrap('supplied properties not correct for "AuthenticateCognitoConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.AuthenticateCognitoConfig` resource
 *
 * @param properties - the TypeScript properties of a `AuthenticateCognitoConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.AuthenticateCognitoConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleAuthenticateCognitoConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_AuthenticateCognitoConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthenticationRequestExtraParams: cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
        OnUnauthenticatedRequest: cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
        Scope: cdk.stringToCloudFormation(properties.scope),
        SessionCookieName: cdk.stringToCloudFormation(properties.sessionCookieName),
        SessionTimeout: cdk.numberToCloudFormation(properties.sessionTimeout),
        UserPoolArn: cdk.stringToCloudFormation(properties.userPoolArn),
        UserPoolClientId: cdk.stringToCloudFormation(properties.userPoolClientId),
        UserPoolDomain: cdk.stringToCloudFormation(properties.userPoolDomain),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleAuthenticateCognitoConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.AuthenticateCognitoConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.AuthenticateCognitoConfigProperty>();
    ret.addPropertyResult('authenticationRequestExtraParams', 'AuthenticationRequestExtraParams', properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined);
    ret.addPropertyResult('onUnauthenticatedRequest', 'OnUnauthenticatedRequest', properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined);
    ret.addPropertyResult('sessionCookieName', 'SessionCookieName', properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined);
    ret.addPropertyResult('sessionTimeout', 'SessionTimeout', properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeout) : undefined);
    ret.addPropertyResult('userPoolArn', 'UserPoolArn', cfn_parse.FromCloudFormation.getString(properties.UserPoolArn));
    ret.addPropertyResult('userPoolClientId', 'UserPoolClientId', cfn_parse.FromCloudFormation.getString(properties.UserPoolClientId));
    ret.addPropertyResult('userPoolDomain', 'UserPoolDomain', cfn_parse.FromCloudFormation.getString(properties.UserPoolDomain));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Specifies information required using an identity provide (IdP) that is compliant with OpenID Connect (OIDC) to authenticate users.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html
     */
    export interface AuthenticateOidcConfigProperty {
        /**
         * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-authenticateoidcconfig.html#cfn-elasticloadbalancingv2-listenerrule-authenticateoidcconfig-authenticationrequestextraparams
         */
        readonly authenticationRequestExtraParams?: { [key: string]: (string) } | cdk.IResolvable;
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

/**
 * Determine whether the given properties match those of a `AuthenticateOidcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AuthenticateOidcConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_AuthenticateOidcConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('authenticationRequestExtraParams', cdk.hashValidator(cdk.validateString))(properties.authenticationRequestExtraParams));
    errors.collect(cdk.propertyValidator('authorizationEndpoint', cdk.requiredValidator)(properties.authorizationEndpoint));
    errors.collect(cdk.propertyValidator('authorizationEndpoint', cdk.validateString)(properties.authorizationEndpoint));
    errors.collect(cdk.propertyValidator('clientId', cdk.requiredValidator)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientId', cdk.validateString)(properties.clientId));
    errors.collect(cdk.propertyValidator('clientSecret', cdk.validateString)(properties.clientSecret));
    errors.collect(cdk.propertyValidator('issuer', cdk.requiredValidator)(properties.issuer));
    errors.collect(cdk.propertyValidator('issuer', cdk.validateString)(properties.issuer));
    errors.collect(cdk.propertyValidator('onUnauthenticatedRequest', cdk.validateString)(properties.onUnauthenticatedRequest));
    errors.collect(cdk.propertyValidator('scope', cdk.validateString)(properties.scope));
    errors.collect(cdk.propertyValidator('sessionCookieName', cdk.validateString)(properties.sessionCookieName));
    errors.collect(cdk.propertyValidator('sessionTimeout', cdk.validateNumber)(properties.sessionTimeout));
    errors.collect(cdk.propertyValidator('tokenEndpoint', cdk.requiredValidator)(properties.tokenEndpoint));
    errors.collect(cdk.propertyValidator('tokenEndpoint', cdk.validateString)(properties.tokenEndpoint));
    errors.collect(cdk.propertyValidator('useExistingClientSecret', cdk.validateBoolean)(properties.useExistingClientSecret));
    errors.collect(cdk.propertyValidator('userInfoEndpoint', cdk.requiredValidator)(properties.userInfoEndpoint));
    errors.collect(cdk.propertyValidator('userInfoEndpoint', cdk.validateString)(properties.userInfoEndpoint));
    return errors.wrap('supplied properties not correct for "AuthenticateOidcConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.AuthenticateOidcConfig` resource
 *
 * @param properties - the TypeScript properties of a `AuthenticateOidcConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.AuthenticateOidcConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleAuthenticateOidcConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_AuthenticateOidcConfigPropertyValidator(properties).assertSuccess();
    return {
        AuthenticationRequestExtraParams: cdk.hashMapper(cdk.stringToCloudFormation)(properties.authenticationRequestExtraParams),
        AuthorizationEndpoint: cdk.stringToCloudFormation(properties.authorizationEndpoint),
        ClientId: cdk.stringToCloudFormation(properties.clientId),
        ClientSecret: cdk.stringToCloudFormation(properties.clientSecret),
        Issuer: cdk.stringToCloudFormation(properties.issuer),
        OnUnauthenticatedRequest: cdk.stringToCloudFormation(properties.onUnauthenticatedRequest),
        Scope: cdk.stringToCloudFormation(properties.scope),
        SessionCookieName: cdk.stringToCloudFormation(properties.sessionCookieName),
        SessionTimeout: cdk.numberToCloudFormation(properties.sessionTimeout),
        TokenEndpoint: cdk.stringToCloudFormation(properties.tokenEndpoint),
        UseExistingClientSecret: cdk.booleanToCloudFormation(properties.useExistingClientSecret),
        UserInfoEndpoint: cdk.stringToCloudFormation(properties.userInfoEndpoint),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleAuthenticateOidcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.AuthenticateOidcConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.AuthenticateOidcConfigProperty>();
    ret.addPropertyResult('authenticationRequestExtraParams', 'AuthenticationRequestExtraParams', properties.AuthenticationRequestExtraParams != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.AuthenticationRequestExtraParams) : undefined);
    ret.addPropertyResult('authorizationEndpoint', 'AuthorizationEndpoint', cfn_parse.FromCloudFormation.getString(properties.AuthorizationEndpoint));
    ret.addPropertyResult('clientId', 'ClientId', cfn_parse.FromCloudFormation.getString(properties.ClientId));
    ret.addPropertyResult('clientSecret', 'ClientSecret', properties.ClientSecret != null ? cfn_parse.FromCloudFormation.getString(properties.ClientSecret) : undefined);
    ret.addPropertyResult('issuer', 'Issuer', cfn_parse.FromCloudFormation.getString(properties.Issuer));
    ret.addPropertyResult('onUnauthenticatedRequest', 'OnUnauthenticatedRequest', properties.OnUnauthenticatedRequest != null ? cfn_parse.FromCloudFormation.getString(properties.OnUnauthenticatedRequest) : undefined);
    ret.addPropertyResult('scope', 'Scope', properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined);
    ret.addPropertyResult('sessionCookieName', 'SessionCookieName', properties.SessionCookieName != null ? cfn_parse.FromCloudFormation.getString(properties.SessionCookieName) : undefined);
    ret.addPropertyResult('sessionTimeout', 'SessionTimeout', properties.SessionTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionTimeout) : undefined);
    ret.addPropertyResult('tokenEndpoint', 'TokenEndpoint', cfn_parse.FromCloudFormation.getString(properties.TokenEndpoint));
    ret.addPropertyResult('useExistingClientSecret', 'UseExistingClientSecret', properties.UseExistingClientSecret != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseExistingClientSecret) : undefined);
    ret.addPropertyResult('userInfoEndpoint', 'UserInfoEndpoint', cfn_parse.FromCloudFormation.getString(properties.UserInfoEndpoint));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Specifies information required when returning a custom HTTP response.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-fixedresponseconfig.html
     */
    export interface FixedResponseConfigProperty {
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

/**
 * Determine whether the given properties match those of a `FixedResponseConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FixedResponseConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_FixedResponseConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contentType', cdk.validateString)(properties.contentType));
    errors.collect(cdk.propertyValidator('messageBody', cdk.validateString)(properties.messageBody));
    errors.collect(cdk.propertyValidator('statusCode', cdk.requiredValidator)(properties.statusCode));
    errors.collect(cdk.propertyValidator('statusCode', cdk.validateString)(properties.statusCode));
    return errors.wrap('supplied properties not correct for "FixedResponseConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.FixedResponseConfig` resource
 *
 * @param properties - the TypeScript properties of a `FixedResponseConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.FixedResponseConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleFixedResponseConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_FixedResponseConfigPropertyValidator(properties).assertSuccess();
    return {
        ContentType: cdk.stringToCloudFormation(properties.contentType),
        MessageBody: cdk.stringToCloudFormation(properties.messageBody),
        StatusCode: cdk.stringToCloudFormation(properties.statusCode),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleFixedResponseConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.FixedResponseConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.FixedResponseConfigProperty>();
    ret.addPropertyResult('contentType', 'ContentType', properties.ContentType != null ? cfn_parse.FromCloudFormation.getString(properties.ContentType) : undefined);
    ret.addPropertyResult('messageBody', 'MessageBody', properties.MessageBody != null ? cfn_parse.FromCloudFormation.getString(properties.MessageBody) : undefined);
    ret.addPropertyResult('statusCode', 'StatusCode', cfn_parse.FromCloudFormation.getString(properties.StatusCode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when `Type` is `forward` . If you specify both `ForwardConfig` and `TargetGroupArn` , you can specify only one target group using `ForwardConfig` and it must be the same target group specified in `TargetGroupArn` .
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-forwardconfig.html
     */
    export interface ForwardConfigProperty {
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

/**
 * Determine whether the given properties match those of a `ForwardConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ForwardConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_ForwardConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetGroupStickinessConfig', CfnListenerRule_TargetGroupStickinessConfigPropertyValidator)(properties.targetGroupStickinessConfig));
    errors.collect(cdk.propertyValidator('targetGroups', cdk.listValidator(CfnListenerRule_TargetGroupTuplePropertyValidator))(properties.targetGroups));
    return errors.wrap('supplied properties not correct for "ForwardConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.ForwardConfig` resource
 *
 * @param properties - the TypeScript properties of a `ForwardConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.ForwardConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleForwardConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_ForwardConfigPropertyValidator(properties).assertSuccess();
    return {
        TargetGroupStickinessConfig: cfnListenerRuleTargetGroupStickinessConfigPropertyToCloudFormation(properties.targetGroupStickinessConfig),
        TargetGroups: cdk.listMapper(cfnListenerRuleTargetGroupTuplePropertyToCloudFormation)(properties.targetGroups),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleForwardConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.ForwardConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.ForwardConfigProperty>();
    ret.addPropertyResult('targetGroupStickinessConfig', 'TargetGroupStickinessConfig', properties.TargetGroupStickinessConfig != null ? CfnListenerRuleTargetGroupStickinessConfigPropertyFromCloudFormation(properties.TargetGroupStickinessConfig) : undefined);
    ret.addPropertyResult('targetGroups', 'TargetGroups', properties.TargetGroups != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerRuleTargetGroupTuplePropertyFromCloudFormation)(properties.TargetGroups) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Information about a host header condition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-hostheaderconfig.html
     */
    export interface HostHeaderConfigProperty {
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

/**
 * Determine whether the given properties match those of a `HostHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HostHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_HostHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "HostHeaderConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.HostHeaderConfig` resource
 *
 * @param properties - the TypeScript properties of a `HostHeaderConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.HostHeaderConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleHostHeaderConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_HostHeaderConfigPropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleHostHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.HostHeaderConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.HostHeaderConfigProperty>();
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
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
    export interface HttpHeaderConfigProperty {
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

/**
 * Determine whether the given properties match those of a `HttpHeaderConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HttpHeaderConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_HttpHeaderConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('httpHeaderName', cdk.validateString)(properties.httpHeaderName));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "HttpHeaderConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.HttpHeaderConfig` resource
 *
 * @param properties - the TypeScript properties of a `HttpHeaderConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.HttpHeaderConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleHttpHeaderConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_HttpHeaderConfigPropertyValidator(properties).assertSuccess();
    return {
        HttpHeaderName: cdk.stringToCloudFormation(properties.httpHeaderName),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleHttpHeaderConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.HttpHeaderConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.HttpHeaderConfigProperty>();
    ret.addPropertyResult('httpHeaderName', 'HttpHeaderName', properties.HttpHeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HttpHeaderName) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
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
    export interface HttpRequestMethodConfigProperty {
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

/**
 * Determine whether the given properties match those of a `HttpRequestMethodConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HttpRequestMethodConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_HttpRequestMethodConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "HttpRequestMethodConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.HttpRequestMethodConfig` resource
 *
 * @param properties - the TypeScript properties of a `HttpRequestMethodConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.HttpRequestMethodConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleHttpRequestMethodConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_HttpRequestMethodConfigPropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleHttpRequestMethodConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.HttpRequestMethodConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.HttpRequestMethodConfigProperty>();
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Information about a path pattern condition.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-pathpatternconfig.html
     */
    export interface PathPatternConfigProperty {
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

/**
 * Determine whether the given properties match those of a `PathPatternConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PathPatternConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_PathPatternConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "PathPatternConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.PathPatternConfig` resource
 *
 * @param properties - the TypeScript properties of a `PathPatternConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.PathPatternConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRulePathPatternConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_PathPatternConfigPropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRulePathPatternConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.PathPatternConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.PathPatternConfigProperty>();
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
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
    export interface QueryStringConfigProperty {
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

/**
 * Determine whether the given properties match those of a `QueryStringConfigProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_QueryStringConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(CfnListenerRule_QueryStringKeyValuePropertyValidator))(properties.values));
    return errors.wrap('supplied properties not correct for "QueryStringConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.QueryStringConfig` resource
 *
 * @param properties - the TypeScript properties of a `QueryStringConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.QueryStringConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleQueryStringConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_QueryStringConfigPropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cfnListenerRuleQueryStringKeyValuePropertyToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleQueryStringConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.QueryStringConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.QueryStringConfigProperty>();
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getArray(CfnListenerRuleQueryStringKeyValuePropertyFromCloudFormation)(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Information about a key/value pair.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-querystringkeyvalue.html
     */
    export interface QueryStringKeyValueProperty {
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

/**
 * Determine whether the given properties match those of a `QueryStringKeyValueProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringKeyValueProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_QueryStringKeyValuePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "QueryStringKeyValueProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.QueryStringKeyValue` resource
 *
 * @param properties - the TypeScript properties of a `QueryStringKeyValueProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.QueryStringKeyValue` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleQueryStringKeyValuePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_QueryStringKeyValuePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleQueryStringKeyValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.QueryStringKeyValueProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.QueryStringKeyValueProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
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
    export interface RedirectConfigProperty {
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

/**
 * Determine whether the given properties match those of a `RedirectConfigProperty`
 *
 * @param properties - the TypeScript properties of a `RedirectConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_RedirectConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('host', cdk.validateString)(properties.host));
    errors.collect(cdk.propertyValidator('path', cdk.validateString)(properties.path));
    errors.collect(cdk.propertyValidator('port', cdk.validateString)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('query', cdk.validateString)(properties.query));
    errors.collect(cdk.propertyValidator('statusCode', cdk.requiredValidator)(properties.statusCode));
    errors.collect(cdk.propertyValidator('statusCode', cdk.validateString)(properties.statusCode));
    return errors.wrap('supplied properties not correct for "RedirectConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.RedirectConfig` resource
 *
 * @param properties - the TypeScript properties of a `RedirectConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.RedirectConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleRedirectConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_RedirectConfigPropertyValidator(properties).assertSuccess();
    return {
        Host: cdk.stringToCloudFormation(properties.host),
        Path: cdk.stringToCloudFormation(properties.path),
        Port: cdk.stringToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        Query: cdk.stringToCloudFormation(properties.query),
        StatusCode: cdk.stringToCloudFormation(properties.statusCode),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleRedirectConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.RedirectConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.RedirectConfigProperty>();
    ret.addPropertyResult('host', 'Host', properties.Host != null ? cfn_parse.FromCloudFormation.getString(properties.Host) : undefined);
    ret.addPropertyResult('path', 'Path', properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('query', 'Query', properties.Query != null ? cfn_parse.FromCloudFormation.getString(properties.Query) : undefined);
    ret.addPropertyResult('statusCode', 'StatusCode', cfn_parse.FromCloudFormation.getString(properties.StatusCode));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Specifies a condition for a listener rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-rulecondition.html
     */
    export interface RuleConditionProperty {
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

/**
 * Determine whether the given properties match those of a `RuleConditionProperty`
 *
 * @param properties - the TypeScript properties of a `RuleConditionProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_RuleConditionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('field', cdk.validateString)(properties.field));
    errors.collect(cdk.propertyValidator('hostHeaderConfig', CfnListenerRule_HostHeaderConfigPropertyValidator)(properties.hostHeaderConfig));
    errors.collect(cdk.propertyValidator('httpHeaderConfig', CfnListenerRule_HttpHeaderConfigPropertyValidator)(properties.httpHeaderConfig));
    errors.collect(cdk.propertyValidator('httpRequestMethodConfig', CfnListenerRule_HttpRequestMethodConfigPropertyValidator)(properties.httpRequestMethodConfig));
    errors.collect(cdk.propertyValidator('pathPatternConfig', CfnListenerRule_PathPatternConfigPropertyValidator)(properties.pathPatternConfig));
    errors.collect(cdk.propertyValidator('queryStringConfig', CfnListenerRule_QueryStringConfigPropertyValidator)(properties.queryStringConfig));
    errors.collect(cdk.propertyValidator('sourceIpConfig', CfnListenerRule_SourceIpConfigPropertyValidator)(properties.sourceIpConfig));
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "RuleConditionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.RuleCondition` resource
 *
 * @param properties - the TypeScript properties of a `RuleConditionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.RuleCondition` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleRuleConditionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_RuleConditionPropertyValidator(properties).assertSuccess();
    return {
        Field: cdk.stringToCloudFormation(properties.field),
        HostHeaderConfig: cfnListenerRuleHostHeaderConfigPropertyToCloudFormation(properties.hostHeaderConfig),
        HttpHeaderConfig: cfnListenerRuleHttpHeaderConfigPropertyToCloudFormation(properties.httpHeaderConfig),
        HttpRequestMethodConfig: cfnListenerRuleHttpRequestMethodConfigPropertyToCloudFormation(properties.httpRequestMethodConfig),
        PathPatternConfig: cfnListenerRulePathPatternConfigPropertyToCloudFormation(properties.pathPatternConfig),
        QueryStringConfig: cfnListenerRuleQueryStringConfigPropertyToCloudFormation(properties.queryStringConfig),
        SourceIpConfig: cfnListenerRuleSourceIpConfigPropertyToCloudFormation(properties.sourceIpConfig),
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleRuleConditionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.RuleConditionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.RuleConditionProperty>();
    ret.addPropertyResult('field', 'Field', properties.Field != null ? cfn_parse.FromCloudFormation.getString(properties.Field) : undefined);
    ret.addPropertyResult('hostHeaderConfig', 'HostHeaderConfig', properties.HostHeaderConfig != null ? CfnListenerRuleHostHeaderConfigPropertyFromCloudFormation(properties.HostHeaderConfig) : undefined);
    ret.addPropertyResult('httpHeaderConfig', 'HttpHeaderConfig', properties.HttpHeaderConfig != null ? CfnListenerRuleHttpHeaderConfigPropertyFromCloudFormation(properties.HttpHeaderConfig) : undefined);
    ret.addPropertyResult('httpRequestMethodConfig', 'HttpRequestMethodConfig', properties.HttpRequestMethodConfig != null ? CfnListenerRuleHttpRequestMethodConfigPropertyFromCloudFormation(properties.HttpRequestMethodConfig) : undefined);
    ret.addPropertyResult('pathPatternConfig', 'PathPatternConfig', properties.PathPatternConfig != null ? CfnListenerRulePathPatternConfigPropertyFromCloudFormation(properties.PathPatternConfig) : undefined);
    ret.addPropertyResult('queryStringConfig', 'QueryStringConfig', properties.QueryStringConfig != null ? CfnListenerRuleQueryStringConfigPropertyFromCloudFormation(properties.QueryStringConfig) : undefined);
    ret.addPropertyResult('sourceIpConfig', 'SourceIpConfig', properties.SourceIpConfig != null ? CfnListenerRuleSourceIpConfigPropertyFromCloudFormation(properties.SourceIpConfig) : undefined);
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
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
    export interface SourceIpConfigProperty {
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

/**
 * Determine whether the given properties match those of a `SourceIpConfigProperty`
 *
 * @param properties - the TypeScript properties of a `SourceIpConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_SourceIpConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('values', cdk.listValidator(cdk.validateString))(properties.values));
    return errors.wrap('supplied properties not correct for "SourceIpConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.SourceIpConfig` resource
 *
 * @param properties - the TypeScript properties of a `SourceIpConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.SourceIpConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleSourceIpConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_SourceIpConfigPropertyValidator(properties).assertSuccess();
    return {
        Values: cdk.listMapper(cdk.stringToCloudFormation)(properties.values),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleSourceIpConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.SourceIpConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.SourceIpConfigProperty>();
    ret.addPropertyResult('values', 'Values', properties.Values != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Values) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Information about the target group stickiness for a rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgroupstickinessconfig.html
     */
    export interface TargetGroupStickinessConfigProperty {
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

/**
 * Determine whether the given properties match those of a `TargetGroupStickinessConfigProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupStickinessConfigProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_TargetGroupStickinessConfigPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('durationSeconds', cdk.validateNumber)(properties.durationSeconds));
    errors.collect(cdk.propertyValidator('enabled', cdk.validateBoolean)(properties.enabled));
    return errors.wrap('supplied properties not correct for "TargetGroupStickinessConfigProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.TargetGroupStickinessConfig` resource
 *
 * @param properties - the TypeScript properties of a `TargetGroupStickinessConfigProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.TargetGroupStickinessConfig` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleTargetGroupStickinessConfigPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_TargetGroupStickinessConfigPropertyValidator(properties).assertSuccess();
    return {
        DurationSeconds: cdk.numberToCloudFormation(properties.durationSeconds),
        Enabled: cdk.booleanToCloudFormation(properties.enabled),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleTargetGroupStickinessConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.TargetGroupStickinessConfigProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.TargetGroupStickinessConfigProperty>();
    ret.addPropertyResult('durationSeconds', 'DurationSeconds', properties.DurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DurationSeconds) : undefined);
    ret.addPropertyResult('enabled', 'Enabled', properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnListenerRule {
    /**
     * Information about how traffic will be distributed between multiple target groups in a forward rule.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-listenerrule-targetgrouptuple.html
     */
    export interface TargetGroupTupleProperty {
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
 * Determine whether the given properties match those of a `TargetGroupTupleProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupTupleProperty`
 *
 * @returns the result of the validation.
 */
function CfnListenerRule_TargetGroupTuplePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('targetGroupArn', cdk.validateString)(properties.targetGroupArn));
    errors.collect(cdk.propertyValidator('weight', cdk.validateNumber)(properties.weight));
    return errors.wrap('supplied properties not correct for "TargetGroupTupleProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.TargetGroupTuple` resource
 *
 * @param properties - the TypeScript properties of a `TargetGroupTupleProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::ListenerRule.TargetGroupTuple` resource.
 */
// @ts-ignore TS6133
function cfnListenerRuleTargetGroupTuplePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnListenerRule_TargetGroupTuplePropertyValidator(properties).assertSuccess();
    return {
        TargetGroupArn: cdk.stringToCloudFormation(properties.targetGroupArn),
        Weight: cdk.numberToCloudFormation(properties.weight),
    };
}

// @ts-ignore TS6133
function CfnListenerRuleTargetGroupTuplePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnListenerRule.TargetGroupTupleProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnListenerRule.TargetGroupTupleProperty>();
    ret.addPropertyResult('targetGroupArn', 'TargetGroupArn', properties.TargetGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetGroupArn) : undefined);
    ret.addPropertyResult('weight', 'Weight', properties.Weight != null ? cfn_parse.FromCloudFormation.getNumber(properties.Weight) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnLoadBalancerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancerPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('ipAddressType', cdk.validateString)(properties.ipAddressType));
    errors.collect(cdk.propertyValidator('loadBalancerAttributes', cdk.listValidator(CfnLoadBalancer_LoadBalancerAttributePropertyValidator))(properties.loadBalancerAttributes));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('scheme', cdk.validateString)(properties.scheme));
    errors.collect(cdk.propertyValidator('securityGroups', cdk.listValidator(cdk.validateString))(properties.securityGroups));
    errors.collect(cdk.propertyValidator('subnetMappings', cdk.listValidator(CfnLoadBalancer_SubnetMappingPropertyValidator))(properties.subnetMappings));
    errors.collect(cdk.propertyValidator('subnets', cdk.listValidator(cdk.validateString))(properties.subnets));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('type', cdk.validateString)(properties.type));
    return errors.wrap('supplied properties not correct for "CfnLoadBalancerProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::LoadBalancer` resource
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::LoadBalancer` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancerPropsValidator(properties).assertSuccess();
    return {
        IpAddressType: cdk.stringToCloudFormation(properties.ipAddressType),
        LoadBalancerAttributes: cdk.listMapper(cfnLoadBalancerLoadBalancerAttributePropertyToCloudFormation)(properties.loadBalancerAttributes),
        Name: cdk.stringToCloudFormation(properties.name),
        Scheme: cdk.stringToCloudFormation(properties.scheme),
        SecurityGroups: cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroups),
        SubnetMappings: cdk.listMapper(cfnLoadBalancerSubnetMappingPropertyToCloudFormation)(properties.subnetMappings),
        Subnets: cdk.listMapper(cdk.stringToCloudFormation)(properties.subnets),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        Type: cdk.stringToCloudFormation(properties.type),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerProps>();
    ret.addPropertyResult('ipAddressType', 'IpAddressType', properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined);
    ret.addPropertyResult('loadBalancerAttributes', 'LoadBalancerAttributes', properties.LoadBalancerAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerLoadBalancerAttributePropertyFromCloudFormation)(properties.LoadBalancerAttributes) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('scheme', 'Scheme', properties.Scheme != null ? cfn_parse.FromCloudFormation.getString(properties.Scheme) : undefined);
    ret.addPropertyResult('securityGroups', 'SecurityGroups', properties.SecurityGroups != null ? cfn_parse.FromCloudFormation.getStringArray(properties.SecurityGroups) : undefined);
    ret.addPropertyResult('subnetMappings', 'SubnetMappings', properties.SubnetMappings != null ? cfn_parse.FromCloudFormation.getArray(CfnLoadBalancerSubnetMappingPropertyFromCloudFormation)(properties.SubnetMappings) : undefined);
    ret.addPropertyResult('subnets', 'Subnets', properties.Subnets != null ? cfn_parse.FromCloudFormation.getStringArray(properties.Subnets) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('type', 'Type', properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::LoadBalancer";

    /**
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
        const ret = new CfnLoadBalancer(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The ID of the Amazon Route 53 hosted zone associated with the load balancer. For example, `Z2P70J7EXAMPLE` .
     * @cloudformationAttribute CanonicalHostedZoneID
     */
    public readonly attrCanonicalHostedZoneId: string;

    /**
     * The DNS name for the load balancer. For example, `my-load-balancer-424835706.us-west-2.elb.amazonaws.com` .
     * @cloudformationAttribute DNSName
     */
    public readonly attrDnsName: string;

    /**
     * The full name of the load balancer. For example, `app/my-load-balancer/50dc6c495c0c9188` .
     * @cloudformationAttribute LoadBalancerFullName
     */
    public readonly attrLoadBalancerFullName: string;

    /**
     * The name of the load balancer. For example, `my-load-balancer` .
     * @cloudformationAttribute LoadBalancerName
     */
    public readonly attrLoadBalancerName: string;

    /**
     * The IDs of the security groups for the load balancer.
     * @cloudformationAttribute SecurityGroups
     */
    public readonly attrSecurityGroups: string[];

    /**
     * The IP address type. The possible values are `ipv4` (for IPv4 addresses) and `dualstack` (for IPv4 and IPv6 addresses). You can’t specify `dualstack` for a load balancer with a UDP or TCP_UDP listener.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-ipaddresstype
     */
    public ipAddressType: string | undefined;

    /**
     * The load balancer attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-loadbalancerattributes
     */
    public loadBalancerAttributes: Array<CfnLoadBalancer.LoadBalancerAttributeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The name of the load balancer. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, must not begin or end with a hyphen, and must not begin with "internal-".
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID for the load balancer. If you specify a name, you cannot perform updates that require replacement of this resource, but you can perform other updates. To replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-name
     */
    public name: string | undefined;

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
    public scheme: string | undefined;

    /**
     * [Application Load Balancers] The IDs of the security groups for the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-securitygroups
     */
    public securityGroups: string[] | undefined;

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
    public subnetMappings: Array<CfnLoadBalancer.SubnetMappingProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

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
    public subnets: string[] | undefined;

    /**
     * The tags to assign to the load balancer.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The type of load balancer. The default is `application` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-loadbalancer.html#cfn-elasticloadbalancingv2-loadbalancer-type
     */
    public type: string | undefined;

    /**
     * Create a new `AWS::ElasticLoadBalancingV2::LoadBalancer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerProps = {}) {
        super(scope, id, { type: CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrCanonicalHostedZoneId = cdk.Token.asString(this.getAtt('CanonicalHostedZoneID', cdk.ResolutionTypeHint.STRING));
        this.attrDnsName = cdk.Token.asString(this.getAtt('DNSName', cdk.ResolutionTypeHint.STRING));
        this.attrLoadBalancerFullName = cdk.Token.asString(this.getAtt('LoadBalancerFullName', cdk.ResolutionTypeHint.STRING));
        this.attrLoadBalancerName = cdk.Token.asString(this.getAtt('LoadBalancerName', cdk.ResolutionTypeHint.STRING));
        this.attrSecurityGroups = cdk.Token.asList(this.getAtt('SecurityGroups', cdk.ResolutionTypeHint.STRING_LIST));

        this.ipAddressType = props.ipAddressType;
        this.loadBalancerAttributes = props.loadBalancerAttributes;
        this.name = props.name;
        this.scheme = props.scheme;
        this.securityGroups = props.securityGroups;
        this.subnetMappings = props.subnetMappings;
        this.subnets = props.subnets;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticLoadBalancingV2::LoadBalancer", props.tags, { tagPropertyName: 'tags' });
        this.type = props.type;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            ipAddressType: this.ipAddressType,
            loadBalancerAttributes: this.loadBalancerAttributes,
            name: this.name,
            scheme: this.scheme,
            securityGroups: this.securityGroups,
            subnetMappings: this.subnetMappings,
            subnets: this.subnets,
            tags: this.tags.renderTags(),
            type: this.type,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnLoadBalancerPropsToCloudFormation(props);
    }
}

export namespace CfnLoadBalancer {
    /**
     * Specifies an attribute for an Application Load Balancer, a Network Load Balancer, or a Gateway Load Balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-loadbalancerattributes.html
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

/**
 * Determine whether the given properties match those of a `LoadBalancerAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `LoadBalancerAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_LoadBalancerAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "LoadBalancerAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::LoadBalancer.LoadBalancerAttribute` resource
 *
 * @param properties - the TypeScript properties of a `LoadBalancerAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::LoadBalancer.LoadBalancerAttribute` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerLoadBalancerAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_LoadBalancerAttributePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerLoadBalancerAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.LoadBalancerAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.LoadBalancerAttributeProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnLoadBalancer {
    /**
     * Specifies a subnet for a load balancer.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-loadbalancer-subnetmapping.html
     */
    export interface SubnetMappingProperty {
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
 * Determine whether the given properties match those of a `SubnetMappingProperty`
 *
 * @param properties - the TypeScript properties of a `SubnetMappingProperty`
 *
 * @returns the result of the validation.
 */
function CfnLoadBalancer_SubnetMappingPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('allocationId', cdk.validateString)(properties.allocationId));
    errors.collect(cdk.propertyValidator('iPv6Address', cdk.validateString)(properties.iPv6Address));
    errors.collect(cdk.propertyValidator('privateIPv4Address', cdk.validateString)(properties.privateIPv4Address));
    errors.collect(cdk.propertyValidator('subnetId', cdk.requiredValidator)(properties.subnetId));
    errors.collect(cdk.propertyValidator('subnetId', cdk.validateString)(properties.subnetId));
    return errors.wrap('supplied properties not correct for "SubnetMappingProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::LoadBalancer.SubnetMapping` resource
 *
 * @param properties - the TypeScript properties of a `SubnetMappingProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::LoadBalancer.SubnetMapping` resource.
 */
// @ts-ignore TS6133
function cfnLoadBalancerSubnetMappingPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnLoadBalancer_SubnetMappingPropertyValidator(properties).assertSuccess();
    return {
        AllocationId: cdk.stringToCloudFormation(properties.allocationId),
        IPv6Address: cdk.stringToCloudFormation(properties.iPv6Address),
        PrivateIPv4Address: cdk.stringToCloudFormation(properties.privateIPv4Address),
        SubnetId: cdk.stringToCloudFormation(properties.subnetId),
    };
}

// @ts-ignore TS6133
function CfnLoadBalancerSubnetMappingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancer.SubnetMappingProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancer.SubnetMappingProperty>();
    ret.addPropertyResult('allocationId', 'AllocationId', properties.AllocationId != null ? cfn_parse.FromCloudFormation.getString(properties.AllocationId) : undefined);
    ret.addPropertyResult('iPv6Address', 'IPv6Address', properties.IPv6Address != null ? cfn_parse.FromCloudFormation.getString(properties.IPv6Address) : undefined);
    ret.addPropertyResult('privateIPv4Address', 'PrivateIPv4Address', properties.PrivateIPv4Address != null ? cfn_parse.FromCloudFormation.getString(properties.PrivateIPv4Address) : undefined);
    ret.addPropertyResult('subnetId', 'SubnetId', cfn_parse.FromCloudFormation.getString(properties.SubnetId));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
 * Determine whether the given properties match those of a `CfnTargetGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnTargetGroupProps`
 *
 * @returns the result of the validation.
 */
function CfnTargetGroupPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('healthCheckEnabled', cdk.validateBoolean)(properties.healthCheckEnabled));
    errors.collect(cdk.propertyValidator('healthCheckIntervalSeconds', cdk.validateNumber)(properties.healthCheckIntervalSeconds));
    errors.collect(cdk.propertyValidator('healthCheckPath', cdk.validateString)(properties.healthCheckPath));
    errors.collect(cdk.propertyValidator('healthCheckPort', cdk.validateString)(properties.healthCheckPort));
    errors.collect(cdk.propertyValidator('healthCheckProtocol', cdk.validateString)(properties.healthCheckProtocol));
    errors.collect(cdk.propertyValidator('healthCheckTimeoutSeconds', cdk.validateNumber)(properties.healthCheckTimeoutSeconds));
    errors.collect(cdk.propertyValidator('healthyThresholdCount', cdk.validateNumber)(properties.healthyThresholdCount));
    errors.collect(cdk.propertyValidator('ipAddressType', cdk.validateString)(properties.ipAddressType));
    errors.collect(cdk.propertyValidator('matcher', CfnTargetGroup_MatcherPropertyValidator)(properties.matcher));
    errors.collect(cdk.propertyValidator('name', cdk.validateString)(properties.name));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocolVersion', cdk.validateString)(properties.protocolVersion));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('targetGroupAttributes', cdk.listValidator(CfnTargetGroup_TargetGroupAttributePropertyValidator))(properties.targetGroupAttributes));
    errors.collect(cdk.propertyValidator('targetType', cdk.validateString)(properties.targetType));
    errors.collect(cdk.propertyValidator('targets', cdk.listValidator(CfnTargetGroup_TargetDescriptionPropertyValidator))(properties.targets));
    errors.collect(cdk.propertyValidator('unhealthyThresholdCount', cdk.validateNumber)(properties.unhealthyThresholdCount));
    errors.collect(cdk.propertyValidator('vpcId', cdk.validateString)(properties.vpcId));
    return errors.wrap('supplied properties not correct for "CfnTargetGroupProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup` resource
 *
 * @param properties - the TypeScript properties of a `CfnTargetGroupProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup` resource.
 */
// @ts-ignore TS6133
function cfnTargetGroupPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTargetGroupPropsValidator(properties).assertSuccess();
    return {
        HealthCheckEnabled: cdk.booleanToCloudFormation(properties.healthCheckEnabled),
        HealthCheckIntervalSeconds: cdk.numberToCloudFormation(properties.healthCheckIntervalSeconds),
        HealthCheckPath: cdk.stringToCloudFormation(properties.healthCheckPath),
        HealthCheckPort: cdk.stringToCloudFormation(properties.healthCheckPort),
        HealthCheckProtocol: cdk.stringToCloudFormation(properties.healthCheckProtocol),
        HealthCheckTimeoutSeconds: cdk.numberToCloudFormation(properties.healthCheckTimeoutSeconds),
        HealthyThresholdCount: cdk.numberToCloudFormation(properties.healthyThresholdCount),
        IpAddressType: cdk.stringToCloudFormation(properties.ipAddressType),
        Matcher: cfnTargetGroupMatcherPropertyToCloudFormation(properties.matcher),
        Name: cdk.stringToCloudFormation(properties.name),
        Port: cdk.numberToCloudFormation(properties.port),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        ProtocolVersion: cdk.stringToCloudFormation(properties.protocolVersion),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TargetGroupAttributes: cdk.listMapper(cfnTargetGroupTargetGroupAttributePropertyToCloudFormation)(properties.targetGroupAttributes),
        Targets: cdk.listMapper(cfnTargetGroupTargetDescriptionPropertyToCloudFormation)(properties.targets),
        TargetType: cdk.stringToCloudFormation(properties.targetType),
        UnhealthyThresholdCount: cdk.numberToCloudFormation(properties.unhealthyThresholdCount),
        VpcId: cdk.stringToCloudFormation(properties.vpcId),
    };
}

// @ts-ignore TS6133
function CfnTargetGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroupProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroupProps>();
    ret.addPropertyResult('healthCheckEnabled', 'HealthCheckEnabled', properties.HealthCheckEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HealthCheckEnabled) : undefined);
    ret.addPropertyResult('healthCheckIntervalSeconds', 'HealthCheckIntervalSeconds', properties.HealthCheckIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckIntervalSeconds) : undefined);
    ret.addPropertyResult('healthCheckPath', 'HealthCheckPath', properties.HealthCheckPath != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPath) : undefined);
    ret.addPropertyResult('healthCheckPort', 'HealthCheckPort', properties.HealthCheckPort != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPort) : undefined);
    ret.addPropertyResult('healthCheckProtocol', 'HealthCheckProtocol', properties.HealthCheckProtocol != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckProtocol) : undefined);
    ret.addPropertyResult('healthCheckTimeoutSeconds', 'HealthCheckTimeoutSeconds', properties.HealthCheckTimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthCheckTimeoutSeconds) : undefined);
    ret.addPropertyResult('healthyThresholdCount', 'HealthyThresholdCount', properties.HealthyThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThresholdCount) : undefined);
    ret.addPropertyResult('ipAddressType', 'IpAddressType', properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined);
    ret.addPropertyResult('matcher', 'Matcher', properties.Matcher != null ? CfnTargetGroupMatcherPropertyFromCloudFormation(properties.Matcher) : undefined);
    ret.addPropertyResult('name', 'Name', properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined);
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addPropertyResult('protocol', 'Protocol', properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined);
    ret.addPropertyResult('protocolVersion', 'ProtocolVersion', properties.ProtocolVersion != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolVersion) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('targetGroupAttributes', 'TargetGroupAttributes', properties.TargetGroupAttributes != null ? cfn_parse.FromCloudFormation.getArray(CfnTargetGroupTargetGroupAttributePropertyFromCloudFormation)(properties.TargetGroupAttributes) : undefined);
    ret.addPropertyResult('targets', 'Targets', properties.Targets != null ? cfn_parse.FromCloudFormation.getArray(CfnTargetGroupTargetDescriptionPropertyFromCloudFormation)(properties.Targets) : undefined);
    ret.addPropertyResult('targetType', 'TargetType', properties.TargetType != null ? cfn_parse.FromCloudFormation.getString(properties.TargetType) : undefined);
    ret.addPropertyResult('unhealthyThresholdCount', 'UnhealthyThresholdCount', properties.UnhealthyThresholdCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThresholdCount) : undefined);
    ret.addPropertyResult('vpcId', 'VpcId', properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
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
export class CfnTargetGroup extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ElasticLoadBalancingV2::TargetGroup";

    /**
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
        const ret = new CfnTargetGroup(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The Amazon Resource Name (ARN) of the load balancer that routes traffic to this target group.
     * @cloudformationAttribute LoadBalancerArns
     */
    public readonly attrLoadBalancerArns: string[];

    /**
     * The Amazon Resource Name (ARN) of the target group.
     * @cloudformationAttribute TargetGroupArn
     */
    public readonly attrTargetGroupArn: string;

    /**
     * The full name of the target group. For example, `targetgroup/my-target-group/cbf133c568e0d028` .
     * @cloudformationAttribute TargetGroupFullName
     */
    public readonly attrTargetGroupFullName: string;

    /**
     * The name of the target group. For example, `my-target-group` .
     * @cloudformationAttribute TargetGroupName
     */
    public readonly attrTargetGroupName: string;

    /**
     * Indicates whether health checks are enabled. If the target type is `lambda` , health checks are disabled by default but can be enabled. If the target type is `instance` , `ip` , or `alb` , health checks are always enabled and cannot be disabled.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckenabled
     */
    public healthCheckEnabled: boolean | cdk.IResolvable | undefined;

    /**
     * The approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. If the target group protocol is TCP, TLS, UDP, TCP_UDP, HTTP or HTTPS, the default is 30 seconds. If the target group protocol is GENEVE, the default is 10 seconds. If the target type is `lambda` , the default is 35 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckintervalseconds
     */
    public healthCheckIntervalSeconds: number | undefined;

    /**
     * [HTTP/HTTPS health checks] The destination for health checks on the targets.
     *
     * [HTTP1 or HTTP2 protocol version] The ping path. The default is /.
     *
     * [GRPC protocol version] The path of a custom health check method with the format /package.service/method. The default is / AWS .ALB/healthcheck.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckpath
     */
    public healthCheckPath: string | undefined;

    /**
     * The port the load balancer uses when performing health checks on targets. If the protocol is HTTP, HTTPS, TCP, TLS, UDP, or TCP_UDP, the default is `traffic-port` , which is the port on which each target receives traffic from the load balancer. If the protocol is GENEVE, the default is port 80.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckport
     */
    public healthCheckPort: string | undefined;

    /**
     * The protocol the load balancer uses when performing health checks on targets. For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthcheckprotocol
     */
    public healthCheckProtocol: string | undefined;

    /**
     * The amount of time, in seconds, during which no response from a target means a failed health check. The range is 2–120 seconds. For target groups with a protocol of HTTP, the default is 6 seconds. For target groups with a protocol of TCP, TLS or HTTPS, the default is 10 seconds. For target groups with a protocol of GENEVE, the default is 5 seconds. If the target type is `lambda` , the default is 30 seconds.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthchecktimeoutseconds
     */
    public healthCheckTimeoutSeconds: number | undefined;

    /**
     * The number of consecutive health check successes required before considering a target healthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 5. For target groups with a protocol of GENEVE, the default is 3. If the target type is `lambda` , the default is 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-healthythresholdcount
     */
    public healthyThresholdCount: number | undefined;

    /**
     * The type of IP address used for this target group. The possible values are `ipv4` and `ipv6` . This is an optional parameter. If not specified, the IP address type defaults to `ipv4` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-ipaddresstype
     */
    public ipAddressType: string | undefined;

    /**
     * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target. For target groups with a protocol of TCP, TCP_UDP, UDP or TLS the range is 200-599. For target groups with a protocol of HTTP or HTTPS, the range is 200-499. For target groups with a protocol of GENEVE, the range is 200-399.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-matcher
     */
    public matcher: CfnTargetGroup.MatcherProperty | cdk.IResolvable | undefined;

    /**
     * The name of the target group.
     *
     * This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-name
     */
    public name: string | undefined;

    /**
     * The port on which the targets receive traffic. This port is used unless you specify a port override when registering the target. If the target is a Lambda function, this parameter does not apply. If the protocol is GENEVE, the supported port is 6081.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-port
     */
    public port: number | undefined;

    /**
     * The protocol to use for routing traffic to the targets. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, or TCP_UDP. For Gateway Load Balancers, the supported protocol is GENEVE. A TCP_UDP listener must be associated with a TCP_UDP target group. If the target is a Lambda function, this parameter does not apply.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocol
     */
    public protocol: string | undefined;

    /**
     * [HTTP/HTTPS protocol] The protocol version. The possible values are `GRPC` , `HTTP1` , and `HTTP2` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-protocolversion
     */
    public protocolVersion: string | undefined;

    /**
     * The tags.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The attributes.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targetgroupattributes
     */
    public targetGroupAttributes: Array<CfnTargetGroup.TargetGroupAttributeProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The targets.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-targets
     */
    public targets: Array<CfnTargetGroup.TargetDescriptionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

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
    public targetType: string | undefined;

    /**
     * The number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 2. For target groups with a protocol of GENEVE, the default is 3. If the target type is `lambda` , the default is 5.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-unhealthythresholdcount
     */
    public unhealthyThresholdCount: number | undefined;

    /**
     * The identifier of the virtual private cloud (VPC). If the target is a Lambda function, this parameter does not apply. Otherwise, this parameter is required.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#cfn-elasticloadbalancingv2-targetgroup-vpcid
     */
    public vpcId: string | undefined;

    /**
     * Create a new `AWS::ElasticLoadBalancingV2::TargetGroup`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTargetGroupProps = {}) {
        super(scope, id, { type: CfnTargetGroup.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrLoadBalancerArns = cdk.Token.asList(this.getAtt('LoadBalancerArns', cdk.ResolutionTypeHint.STRING_LIST));
        this.attrTargetGroupArn = cdk.Token.asString(this.getAtt('TargetGroupArn', cdk.ResolutionTypeHint.STRING));
        this.attrTargetGroupFullName = cdk.Token.asString(this.getAtt('TargetGroupFullName', cdk.ResolutionTypeHint.STRING));
        this.attrTargetGroupName = cdk.Token.asString(this.getAtt('TargetGroupName', cdk.ResolutionTypeHint.STRING));

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
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ElasticLoadBalancingV2::TargetGroup", props.tags, { tagPropertyName: 'tags' });
        this.targetGroupAttributes = props.targetGroupAttributes;
        this.targets = props.targets;
        this.targetType = props.targetType;
        this.unhealthyThresholdCount = props.unhealthyThresholdCount;
        this.vpcId = props.vpcId;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTargetGroup.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            healthCheckEnabled: this.healthCheckEnabled,
            healthCheckIntervalSeconds: this.healthCheckIntervalSeconds,
            healthCheckPath: this.healthCheckPath,
            healthCheckPort: this.healthCheckPort,
            healthCheckProtocol: this.healthCheckProtocol,
            healthCheckTimeoutSeconds: this.healthCheckTimeoutSeconds,
            healthyThresholdCount: this.healthyThresholdCount,
            ipAddressType: this.ipAddressType,
            matcher: this.matcher,
            name: this.name,
            port: this.port,
            protocol: this.protocol,
            protocolVersion: this.protocolVersion,
            tags: this.tags.renderTags(),
            targetGroupAttributes: this.targetGroupAttributes,
            targets: this.targets,
            targetType: this.targetType,
            unhealthyThresholdCount: this.unhealthyThresholdCount,
            vpcId: this.vpcId,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTargetGroupPropsToCloudFormation(props);
    }
}

export namespace CfnTargetGroup {
    /**
     * Specifies the HTTP codes that healthy targets must use when responding to an HTTP health check.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html
     */
    export interface MatcherProperty {
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

/**
 * Determine whether the given properties match those of a `MatcherProperty`
 *
 * @param properties - the TypeScript properties of a `MatcherProperty`
 *
 * @returns the result of the validation.
 */
function CfnTargetGroup_MatcherPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('grpcCode', cdk.validateString)(properties.grpcCode));
    errors.collect(cdk.propertyValidator('httpCode', cdk.validateString)(properties.httpCode));
    return errors.wrap('supplied properties not correct for "MatcherProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup.Matcher` resource
 *
 * @param properties - the TypeScript properties of a `MatcherProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup.Matcher` resource.
 */
// @ts-ignore TS6133
function cfnTargetGroupMatcherPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTargetGroup_MatcherPropertyValidator(properties).assertSuccess();
    return {
        GrpcCode: cdk.stringToCloudFormation(properties.grpcCode),
        HttpCode: cdk.stringToCloudFormation(properties.httpCode),
    };
}

// @ts-ignore TS6133
function CfnTargetGroupMatcherPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroup.MatcherProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.MatcherProperty>();
    ret.addPropertyResult('grpcCode', 'GrpcCode', properties.GrpcCode != null ? cfn_parse.FromCloudFormation.getString(properties.GrpcCode) : undefined);
    ret.addPropertyResult('httpCode', 'HttpCode', properties.HttpCode != null ? cfn_parse.FromCloudFormation.getString(properties.HttpCode) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTargetGroup {
    /**
     * Specifies a target to add to a target group.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetdescription.html
     */
    export interface TargetDescriptionProperty {
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

/**
 * Determine whether the given properties match those of a `TargetDescriptionProperty`
 *
 * @param properties - the TypeScript properties of a `TargetDescriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTargetGroup_TargetDescriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('availabilityZone', cdk.validateString)(properties.availabilityZone));
    errors.collect(cdk.propertyValidator('id', cdk.requiredValidator)(properties.id));
    errors.collect(cdk.propertyValidator('id', cdk.validateString)(properties.id));
    errors.collect(cdk.propertyValidator('port', cdk.validateNumber)(properties.port));
    return errors.wrap('supplied properties not correct for "TargetDescriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup.TargetDescription` resource
 *
 * @param properties - the TypeScript properties of a `TargetDescriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup.TargetDescription` resource.
 */
// @ts-ignore TS6133
function cfnTargetGroupTargetDescriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTargetGroup_TargetDescriptionPropertyValidator(properties).assertSuccess();
    return {
        AvailabilityZone: cdk.stringToCloudFormation(properties.availabilityZone),
        Id: cdk.stringToCloudFormation(properties.id),
        Port: cdk.numberToCloudFormation(properties.port),
    };
}

// @ts-ignore TS6133
function CfnTargetGroupTargetDescriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroup.TargetDescriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.TargetDescriptionProperty>();
    ret.addPropertyResult('availabilityZone', 'AvailabilityZone', properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined);
    ret.addPropertyResult('id', 'Id', cfn_parse.FromCloudFormation.getString(properties.Id));
    ret.addPropertyResult('port', 'Port', properties.Port != null ? cfn_parse.FromCloudFormation.getNumber(properties.Port) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

export namespace CfnTargetGroup {
    /**
     * Specifies a target group attribute.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-targetgroupattribute.html
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

/**
 * Determine whether the given properties match those of a `TargetGroupAttributeProperty`
 *
 * @param properties - the TypeScript properties of a `TargetGroupAttributeProperty`
 *
 * @returns the result of the validation.
 */
function CfnTargetGroup_TargetGroupAttributePropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('key', cdk.validateString)(properties.key));
    errors.collect(cdk.propertyValidator('value', cdk.validateString)(properties.value));
    return errors.wrap('supplied properties not correct for "TargetGroupAttributeProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup.TargetGroupAttribute` resource
 *
 * @param properties - the TypeScript properties of a `TargetGroupAttributeProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::ElasticLoadBalancingV2::TargetGroup.TargetGroupAttribute` resource.
 */
// @ts-ignore TS6133
function cfnTargetGroupTargetGroupAttributePropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTargetGroup_TargetGroupAttributePropertyValidator(properties).assertSuccess();
    return {
        Key: cdk.stringToCloudFormation(properties.key),
        Value: cdk.stringToCloudFormation(properties.value),
    };
}

// @ts-ignore TS6133
function CfnTargetGroupTargetGroupAttributePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTargetGroup.TargetGroupAttributeProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTargetGroup.TargetGroupAttributeProperty>();
    ret.addPropertyResult('key', 'Key', properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined);
    ret.addPropertyResult('value', 'Value', properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}
