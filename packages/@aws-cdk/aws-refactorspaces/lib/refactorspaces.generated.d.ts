import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html
 */
export interface CfnApplicationProps {
    /**
     * The endpoint URL of the Amazon API Gateway proxy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-apigatewayproxy
     */
    readonly apiGatewayProxy?: CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable;
    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-environmentidentifier
     */
    readonly environmentIdentifier?: string;
    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-name
     */
    readonly name?: string;
    /**
     * The proxy type of the proxy created within the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-proxytype
     */
    readonly proxyType?: string;
    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-vpcid
     */
    readonly vpcId?: string;
}
/**
 * A CloudFormation `AWS::RefactorSpaces::Application`
 *
 * Creates an AWS Migration Hub Refactor Spaces application. The account that owns the environment also owns the applications created inside the environment, regardless of the account that creates the application. Refactor Spaces provisions an Amazon API Gateway , API Gateway VPC link, and Network Load Balancer for the application proxy inside your account.
 *
 * @cloudformationResource AWS::RefactorSpaces::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html
 */
export declare class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Application";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication;
    /**
     * The resource ID of the API Gateway for the proxy.
     * @cloudformationAttribute ApiGatewayId
     */
    readonly attrApiGatewayId: string;
    /**
     * The unique identifier of the application.
     * @cloudformationAttribute ApplicationIdentifier
     */
    readonly attrApplicationIdentifier: string;
    /**
     * The Amazon Resource Name (ARN) of the application.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The Amazon Resource Name (ARN) of the Network Load Balancer .
     * @cloudformationAttribute NlbArn
     */
    readonly attrNlbArn: string;
    /**
     * The name of the Network Load Balancer configured by the API Gateway proxy.
     * @cloudformationAttribute NlbName
     */
    readonly attrNlbName: string;
    /**
     * The endpoint URL of the Amazon API Gateway proxy.
     * @cloudformationAttribute ProxyUrl
     */
    readonly attrProxyUrl: string;
    /**
     * The name of the API Gateway stage. The name defaults to `prod` .
     * @cloudformationAttribute StageName
     */
    readonly attrStageName: string;
    /**
     * The `VpcLink` ID of the API Gateway proxy.
     * @cloudformationAttribute VpcLinkId
     */
    readonly attrVpcLinkId: string;
    /**
     * The endpoint URL of the Amazon API Gateway proxy.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-apigatewayproxy
     */
    apiGatewayProxy: CfnApplication.ApiGatewayProxyInputProperty | cdk.IResolvable | undefined;
    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-environmentidentifier
     */
    environmentIdentifier: string | undefined;
    /**
     * The name of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-name
     */
    name: string | undefined;
    /**
     * The proxy type of the proxy created within the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-proxytype
     */
    proxyType: string | undefined;
    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-application.html#cfn-refactorspaces-application-vpcid
     */
    vpcId: string | undefined;
    /**
     * Create a new `AWS::RefactorSpaces::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnApplicationProps);
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
export declare namespace CfnApplication {
    /**
     * A wrapper object holding the Amazon API Gateway endpoint input.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html
     */
    interface ApiGatewayProxyInputProperty {
        /**
         * The type of endpoint to use for the API Gateway proxy. If no value is specified in the request, the value is set to `REGIONAL` by default.
         *
         * If the value is set to `PRIVATE` in the request, this creates a private API endpoint that is isolated from the public internet. The private endpoint can only be accessed by using Amazon Virtual Private Cloud ( Amazon VPC ) endpoints for Amazon API Gateway that have been granted access.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html#cfn-refactorspaces-application-apigatewayproxyinput-endpointtype
         */
        readonly endpointType?: string;
        /**
         * The name of the API Gateway stage. The name defaults to `prod` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-application-apigatewayproxyinput.html#cfn-refactorspaces-application-apigatewayproxyinput-stagename
         */
        readonly stageName?: string;
    }
}
/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html
 */
export interface CfnEnvironmentProps {
    /**
     * A description of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-description
     */
    readonly description?: string;
    /**
     * The name of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-name
     */
    readonly name?: string;
    /**
     * The network fabric type of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-networkfabrictype
     */
    readonly networkFabricType?: string;
    /**
     * The tags assigned to the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::RefactorSpaces::Environment`
 *
 * Creates an AWS Migration Hub Refactor Spaces environment. The caller owns the environment resource, and all Refactor Spaces applications, services, and routes created within the environment. They are referred to as the *environment owner* . The environment owner has cross-account visibility and control of Refactor Spaces resources that are added to the environment by other accounts that the environment is shared with. When creating an environment, Refactor Spaces provisions a transit gateway in your account.
 *
 * @cloudformationResource AWS::RefactorSpaces::Environment
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html
 */
export declare class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Environment";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment;
    /**
     * The Amazon Resource Name (ARN) of the environment.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The unique identifier of the environment.
     * @cloudformationAttribute EnvironmentIdentifier
     */
    readonly attrEnvironmentIdentifier: string;
    /**
     * The ID of the AWS Transit Gateway set up by the environment.
     * @cloudformationAttribute TransitGatewayId
     */
    readonly attrTransitGatewayId: string;
    /**
     * A description of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-description
     */
    description: string | undefined;
    /**
     * The name of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-name
     */
    name: string | undefined;
    /**
     * The network fabric type of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-networkfabrictype
     */
    networkFabricType: string | undefined;
    /**
     * The tags assigned to the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-environment.html#cfn-refactorspaces-environment-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RefactorSpaces::Environment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnEnvironmentProps);
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
 * Properties for defining a `CfnRoute`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html
 */
export interface CfnRouteProps {
    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-applicationidentifier
     */
    readonly applicationIdentifier: string;
    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-environmentidentifier
     */
    readonly environmentIdentifier: string;
    /**
     * The unique identifier of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-serviceidentifier
     */
    readonly serviceIdentifier: string;
    /**
     * Configuration for the default route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-defaultroute
     */
    readonly defaultRoute?: CfnRoute.DefaultRouteInputProperty | cdk.IResolvable;
    /**
     * The route type of the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-routetype
     */
    readonly routeType?: string;
    /**
     * The tags assigned to the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The configuration for the URI path route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-uripathroute
     */
    readonly uriPathRoute?: CfnRoute.UriPathRouteInputProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::RefactorSpaces::Route`
 *
 * Creates an AWS Migration Hub Refactor Spaces route. The account owner of the service resource is always the environment owner, regardless of which account creates the route. Routes target a service in the application. If an application does not have any routes, then the first route must be created as a `DEFAULT` `RouteType` .
 *
 * When created, the default route defaults to an active state so state is not a required input. However, like all other state values the state of the default route can be updated after creation, but only when all other routes are also inactive. Conversely, no route can be active without the default route also being active.
 *
 * > In the `AWS::RefactorSpaces::Route` resource, you can only update the `ActivationState` property, which resides under the `UriPathRoute` and `DefaultRoute` properties. All other properties associated with the `AWS::RefactorSpaces::Route` cannot be updated, even though the property description might indicate otherwise. Updating all other properties will result in the replacement of Route.
 *
 * When you create a route, Refactor Spaces configures the Amazon API Gateway to send traffic to the target service as follows:
 *
 * - If the service has a URL endpoint, and the endpoint resolves to a private IP address, Refactor Spaces routes traffic using the API Gateway VPC link.
 * - If the service has a URL endpoint, and the endpoint resolves to a public IP address, Refactor Spaces routes traffic over the public internet.
 * - If the service has an AWS Lambda function endpoint, then Refactor Spaces configures the Lambda function's resource policy to allow the application's API Gateway to invoke the function.
 *
 * A one-time health check is performed on the service when either the route is updated from inactive to active, or when it is created with an active state. If the health check fails, the route transitions the route state to `FAILED` , an error code of `SERVICE_ENDPOINT_HEALTH_CHECK_FAILURE` is provided, and no traffic is sent to the service.
 *
 * For Lambda functions, the Lambda function state is checked. If the function is not active, the function configuration is updated so that Lambda resources are provisioned. If the Lambda state is `Failed` , then the route creation fails. For more information, see the [GetFunctionConfiguration's State response parameter](https://docs.aws.amazon.com/lambda/latest/dg/API_GetFunctionConfiguration.html#SSS-GetFunctionConfiguration-response-State) in the *AWS Lambda Developer Guide* .
 *
 * For Lambda endpoints, a check is performed to determine that a Lambda function with the specified ARN exists. If it does not exist, the health check fails. For public URLs, a connection is opened to the public endpoint. If the URL is not reachable, the health check fails.
 *
 * For private URLS, a target group is created on the Elastic Load Balancing and the target group health check is run. The `HealthCheckProtocol` , `HealthCheckPort` , and `HealthCheckPath` are the same protocol, port, and path specified in the URL or health URL, if used. All other settings use the default values, as described in [Health checks for your target groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) . The health check is considered successful if at least one target within the target group transitions to a healthy state.
 *
 * Services can have HTTP or HTTPS URL endpoints. For HTTPS URLs, publicly-signed certificates are supported. Private Certificate Authorities (CAs) are permitted only if the CA's domain is also publicly resolvable.
 *
 * @cloudformationResource AWS::RefactorSpaces::Route
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html
 */
export declare class CfnRoute extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Route";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoute;
    /**
     * The Amazon Resource Name (ARN) of the route.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * A mapping of Amazon API Gateway path resources to resource IDs.
     * @cloudformationAttribute PathResourceToId
     */
    readonly attrPathResourceToId: string;
    /**
     * The unique identifier of the route.
     * @cloudformationAttribute RouteIdentifier
     */
    readonly attrRouteIdentifier: string;
    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-applicationidentifier
     */
    applicationIdentifier: string;
    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-environmentidentifier
     */
    environmentIdentifier: string;
    /**
     * The unique identifier of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-serviceidentifier
     */
    serviceIdentifier: string;
    /**
     * Configuration for the default route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-defaultroute
     */
    defaultRoute: CfnRoute.DefaultRouteInputProperty | cdk.IResolvable | undefined;
    /**
     * The route type of the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-routetype
     */
    routeType: string | undefined;
    /**
     * The tags assigned to the route.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The configuration for the URI path route type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-route.html#cfn-refactorspaces-route-uripathroute
     */
    uriPathRoute: CfnRoute.UriPathRouteInputProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::RefactorSpaces::Route`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRouteProps);
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
export declare namespace CfnRoute {
    /**
     * The configuration for the default route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-defaultrouteinput.html
     */
    interface DefaultRouteInputProperty {
        /**
         * If set to `ACTIVE` , traffic is forwarded to this route’s service after the route is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-defaultrouteinput.html#cfn-refactorspaces-route-defaultrouteinput-activationstate
         */
        readonly activationState: string;
    }
}
export declare namespace CfnRoute {
    /**
     * The configuration for the URI path route type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html
     */
    interface UriPathRouteInputProperty {
        /**
         * If set to `ACTIVE` , traffic is forwarded to this route’s service after the route is created.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-activationstate
         */
        readonly activationState: string;
        /**
         * Indicates whether to match all subpaths of the given source path. If this value is `false` , requests must match the source path exactly before they are forwarded to this route's service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-includechildpaths
         */
        readonly includeChildPaths?: boolean | cdk.IResolvable;
        /**
         * A list of HTTP methods to match. An empty list matches all values. If a method is present, only HTTP requests using that method are forwarded to this route’s service.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-methods
         */
        readonly methods?: string[];
        /**
         * The path to use to match traffic. Paths must start with `/` and are relative to the base of the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-route-uripathrouteinput.html#cfn-refactorspaces-route-uripathrouteinput-sourcepath
         */
        readonly sourcePath?: string;
    }
}
/**
 * Properties for defining a `CfnService`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html
 */
export interface CfnServiceProps {
    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-applicationidentifier
     */
    readonly applicationIdentifier: string;
    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-environmentidentifier
     */
    readonly environmentIdentifier: string;
    /**
     * A description of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-description
     */
    readonly description?: string;
    /**
     * The endpoint type of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-endpointtype
     */
    readonly endpointType?: string;
    /**
     * A summary of the configuration for the AWS Lambda endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-lambdaendpoint
     */
    readonly lambdaEndpoint?: CfnService.LambdaEndpointInputProperty | cdk.IResolvable;
    /**
     * The name of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-name
     */
    readonly name?: string;
    /**
     * The tags assigned to the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-tags
     */
    readonly tags?: cdk.CfnTag[];
    /**
     * The summary of the configuration for the URL endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-urlendpoint
     */
    readonly urlEndpoint?: CfnService.UrlEndpointInputProperty | cdk.IResolvable;
    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-vpcid
     */
    readonly vpcId?: string;
}
/**
 * A CloudFormation `AWS::RefactorSpaces::Service`
 *
 * Creates an AWS Migration Hub Refactor Spaces service. The account owner of the service is always the environment owner, regardless of which account in the environment creates the service. Services have either a URL endpoint in a virtual private cloud (VPC), or a Lambda function endpoint.
 *
 * > If an AWS resource is launched in a service VPC, and you want it to be accessible to all of an environment’s services with VPCs and routes, apply the `RefactorSpacesSecurityGroup` to the resource. Alternatively, to add more cross-account constraints, apply your own security group.
 *
 * @cloudformationResource AWS::RefactorSpaces::Service
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html
 */
export declare class CfnService extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RefactorSpaces::Service";
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
     * The unique identifier of the service.
     * @cloudformationAttribute ServiceIdentifier
     */
    readonly attrServiceIdentifier: string;
    /**
     * The unique identifier of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-applicationidentifier
     */
    applicationIdentifier: string;
    /**
     * The unique identifier of the environment.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-environmentidentifier
     */
    environmentIdentifier: string;
    /**
     * A description of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-description
     */
    description: string | undefined;
    /**
     * The endpoint type of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-endpointtype
     */
    endpointType: string | undefined;
    /**
     * A summary of the configuration for the AWS Lambda endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-lambdaendpoint
     */
    lambdaEndpoint: CfnService.LambdaEndpointInputProperty | cdk.IResolvable | undefined;
    /**
     * The name of the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-name
     */
    name: string | undefined;
    /**
     * The tags assigned to the service.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * The summary of the configuration for the URL endpoint type.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-urlendpoint
     */
    urlEndpoint: CfnService.UrlEndpointInputProperty | cdk.IResolvable | undefined;
    /**
     * The ID of the virtual private cloud (VPC).
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-refactorspaces-service.html#cfn-refactorspaces-service-vpcid
     */
    vpcId: string | undefined;
    /**
     * Create a new `AWS::RefactorSpaces::Service`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnServiceProps);
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
     * The input for the AWS Lambda endpoint type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-lambdaendpointinput.html
     */
    interface LambdaEndpointInputProperty {
        /**
         * The Amazon Resource Name (ARN) of the Lambda function or alias.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-lambdaendpointinput.html#cfn-refactorspaces-service-lambdaendpointinput-arn
         */
        readonly arn: string;
    }
}
export declare namespace CfnService {
    /**
     * The configuration for the URL endpoint type.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html
     */
    interface UrlEndpointInputProperty {
        /**
         * The health check URL of the URL endpoint type. If the URL is a public endpoint, the `HealthUrl` must also be a public endpoint. If the URL is a private endpoint inside a virtual private cloud (VPC), the health URL must also be a private endpoint, and the host must be the same as the URL.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html#cfn-refactorspaces-service-urlendpointinput-healthurl
         */
        readonly healthUrl?: string;
        /**
         * The URL to route traffic to. The URL must be an [rfc3986-formatted URL](https://docs.aws.amazon.com/https://datatracker.ietf.org/doc/html/rfc3986) . If the host is a domain name, the name must be resolvable over the public internet. If the scheme is `https` , the top level domain of the host must be listed in the [IANA root zone database](https://docs.aws.amazon.com/https://www.iana.org/domains/root/db) .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-refactorspaces-service-urlendpointinput.html#cfn-refactorspaces-service-urlendpointinput-url
         */
        readonly url: string;
    }
}
