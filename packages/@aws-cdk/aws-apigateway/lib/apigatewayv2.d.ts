import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Properties for defining a `AWS::ApiGatewayV2::Api`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnApiV2Props {
    /**
     * `AWS::ApiGatewayV2::Api.ApiKeySelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-apikeyselectionexpression
     */
    readonly apiKeySelectionExpression?: string;
    /**
     * `AWS::ApiGatewayV2::Api.BasePath`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-basepath
     */
    readonly basePath?: string;
    /**
     * `AWS::ApiGatewayV2::Api.Body`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-body
     */
    readonly body?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Api.BodyS3Location`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-bodys3location
     */
    readonly bodyS3Location?: CfnApiV2.BodyS3LocationProperty | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Api.CorsConfiguration`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-corsconfiguration
     */
    readonly corsConfiguration?: CfnApiV2.CorsProperty | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Api.CredentialsArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-credentialsarn
     */
    readonly credentialsArn?: string;
    /**
     * `AWS::ApiGatewayV2::Api.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-description
     */
    readonly description?: string;
    /**
     * `AWS::ApiGatewayV2::Api.DisableSchemaValidation`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-disableschemavalidation
     */
    readonly disableSchemaValidation?: boolean | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Api.FailOnWarnings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-failonwarnings
     */
    readonly failOnWarnings?: boolean | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Api.Name`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-name
     */
    readonly name?: string;
    /**
     * `AWS::ApiGatewayV2::Api.ProtocolType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-protocoltype
     */
    readonly protocolType?: string;
    /**
     * `AWS::ApiGatewayV2::Api.RouteKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routekey
     */
    readonly routeKey?: string;
    /**
     * `AWS::ApiGatewayV2::Api.RouteSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routeselectionexpression
     */
    readonly routeSelectionExpression?: string;
    /**
     * `AWS::ApiGatewayV2::Api.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-tags
     */
    readonly tags?: any;
    /**
     * `AWS::ApiGatewayV2::Api.Target`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-target
     */
    readonly target?: string;
    /**
     * `AWS::ApiGatewayV2::Api.Version`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-version
     */
    readonly version?: string;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Api`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Api
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnApiV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Api";
    /**
     * `AWS::ApiGatewayV2::Api.ApiKeySelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-apikeyselectionexpression
     */
    apiKeySelectionExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.BasePath`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-basepath
     */
    basePath: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.Body`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-body
     */
    body: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.BodyS3Location`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-bodys3location
     */
    bodyS3Location: CfnApiV2.BodyS3LocationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.CorsConfiguration`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-corsconfiguration
     */
    corsConfiguration: CfnApiV2.CorsProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.CredentialsArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-credentialsarn
     */
    credentialsArn: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-description
     */
    description: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.DisableSchemaValidation`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-disableschemavalidation
     */
    disableSchemaValidation: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.FailOnWarnings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-failonwarnings
     */
    failOnWarnings: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.Name`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-name
     */
    name: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.ProtocolType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-protocoltype
     */
    protocolType: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.RouteKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routekey
     */
    routeKey: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.RouteSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-routeselectionexpression
     */
    routeSelectionExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::ApiGatewayV2::Api.Target`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-target
     */
    target: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Api.Version`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-api.html#cfn-apigatewayv2-api-version
     */
    version: string | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props?: CfnApiV2Props);
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
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnApiV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface BodyS3LocationProperty {
        /**
         * `CfnApiV2.BodyS3LocationProperty.Bucket`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-bucket
         */
        readonly bucket?: string;
        /**
         * `CfnApiV2.BodyS3LocationProperty.Etag`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-etag
         */
        readonly etag?: string;
        /**
         * `CfnApiV2.BodyS3LocationProperty.Key`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-key
         */
        readonly key?: string;
        /**
         * `CfnApiV2.BodyS3LocationProperty.Version`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-bodys3location.html#cfn-apigatewayv2-api-bodys3location-version
         */
        readonly version?: string;
    }
}
/**
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnApiV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface CorsProperty {
        /**
         * `CfnApiV2.CorsProperty.AllowCredentials`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowcredentials
         */
        readonly allowCredentials?: boolean | cdk.IResolvable;
        /**
         * `CfnApiV2.CorsProperty.AllowHeaders`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowheaders
         */
        readonly allowHeaders?: string[];
        /**
         * `CfnApiV2.CorsProperty.AllowMethods`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-allowmethods
         */
        readonly allowMethods?: string[];
        /**
         * `CfnApiV2.CorsProperty.AllowOrigins`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-alloworigins
         */
        readonly allowOrigins?: string[];
        /**
         * `CfnApiV2.CorsProperty.ExposeHeaders`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-exposeheaders
         */
        readonly exposeHeaders?: string[];
        /**
         * `CfnApiV2.CorsProperty.MaxAge`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-api-cors.html#cfn-apigatewayv2-api-cors-maxage
         */
        readonly maxAge?: number;
    }
}
/**
 * Properties for defining a `AWS::ApiGatewayV2::ApiMapping`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnApiMappingV2Props {
    /**
     * `AWS::ApiGatewayV2::ApiMapping.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::ApiMapping.DomainName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-domainname
     */
    readonly domainName: string;
    /**
     * `AWS::ApiGatewayV2::ApiMapping.Stage`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-stage
     */
    readonly stage: string;
    /**
     * `AWS::ApiGatewayV2::ApiMapping.ApiMappingKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apimappingkey
     */
    readonly apiMappingKey?: string;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::ApiMapping`
 *
 * @cloudformationResource AWS::ApiGatewayV2::ApiMapping
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnApiMappingV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::ApiMapping";
    /**
     * `AWS::ApiGatewayV2::ApiMapping.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::ApiMapping.DomainName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-domainname
     */
    domainName: string;
    /**
     * `AWS::ApiGatewayV2::ApiMapping.Stage`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-stage
     */
    stage: string;
    /**
     * `AWS::ApiGatewayV2::ApiMapping.ApiMappingKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-apimapping.html#cfn-apigatewayv2-apimapping-apimappingkey
     */
    apiMappingKey: string | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::ApiMapping`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnApiMappingV2Props);
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
 * Properties for defining a `AWS::ApiGatewayV2::Authorizer`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnAuthorizerV2Props {
    /**
     * `AWS::ApiGatewayV2::Authorizer.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizertype
     */
    readonly authorizerType: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.IdentitySource`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identitysource
     */
    readonly identitySource: string[];
    /**
     * `AWS::ApiGatewayV2::Authorizer.Name`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-name
     */
    readonly name: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerCredentialsArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizercredentialsarn
     */
    readonly authorizerCredentialsArn?: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerResultTtlInSeconds`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizerresultttlinseconds
     */
    readonly authorizerResultTtlInSeconds?: number;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerUri`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizeruri
     */
    readonly authorizerUri?: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.IdentityValidationExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identityvalidationexpression
     */
    readonly identityValidationExpression?: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.JwtConfiguration`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-jwtconfiguration
     */
    readonly jwtConfiguration?: CfnAuthorizerV2.JWTConfigurationProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Authorizer`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Authorizer
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnAuthorizerV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Authorizer";
    /**
     * `AWS::ApiGatewayV2::Authorizer.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizertype
     */
    authorizerType: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.IdentitySource`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identitysource
     */
    identitySource: string[];
    /**
     * `AWS::ApiGatewayV2::Authorizer.Name`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-name
     */
    name: string;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerCredentialsArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizercredentialsarn
     */
    authorizerCredentialsArn: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerResultTtlInSeconds`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizerresultttlinseconds
     */
    authorizerResultTtlInSeconds: number | undefined;
    /**
     * `AWS::ApiGatewayV2::Authorizer.AuthorizerUri`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-authorizeruri
     */
    authorizerUri: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Authorizer.IdentityValidationExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-identityvalidationexpression
     */
    identityValidationExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Authorizer.JwtConfiguration`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-authorizer.html#cfn-apigatewayv2-authorizer-jwtconfiguration
     */
    jwtConfiguration: CfnAuthorizerV2.JWTConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::Authorizer`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnAuthorizerV2Props);
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
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnAuthorizerV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface JWTConfigurationProperty {
        /**
         * `CfnAuthorizerV2.JWTConfigurationProperty.Audience`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html#cfn-apigatewayv2-authorizer-jwtconfiguration-audience
         */
        readonly audience?: string[];
        /**
         * `CfnAuthorizerV2.JWTConfigurationProperty.Issuer`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-authorizer-jwtconfiguration.html#cfn-apigatewayv2-authorizer-jwtconfiguration-issuer
         */
        readonly issuer?: string;
    }
}
/**
 * Properties for defining a `AWS::ApiGatewayV2::Deployment`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnDeploymentV2Props {
    /**
     * `AWS::ApiGatewayV2::Deployment.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::Deployment.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-description
     */
    readonly description?: string;
    /**
     * `AWS::ApiGatewayV2::Deployment.StageName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-stagename
     */
    readonly stageName?: string;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Deployment`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Deployment
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnDeploymentV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Deployment";
    /**
     * `AWS::ApiGatewayV2::Deployment.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::Deployment.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-description
     */
    description: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Deployment.StageName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-deployment.html#cfn-apigatewayv2-deployment-stagename
     */
    stageName: string | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::Deployment`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnDeploymentV2Props);
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
 * Properties for defining a `AWS::ApiGatewayV2::DomainName`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnDomainNameV2Props {
    /**
     * `AWS::ApiGatewayV2::DomainName.DomainName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainname
     */
    readonly domainName: string;
    /**
     * `AWS::ApiGatewayV2::DomainName.DomainNameConfigurations`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainnameconfigurations
     */
    readonly domainNameConfigurations?: Array<CfnDomainNameV2.DomainNameConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::DomainName.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-tags
     */
    readonly tags?: any;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::DomainName`
 *
 * @cloudformationResource AWS::ApiGatewayV2::DomainName
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnDomainNameV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::DomainName";
    /**
     * @cloudformationAttribute RegionalDomainName
     */
    readonly attrRegionalDomainName: string;
    /**
     * @cloudformationAttribute RegionalHostedZoneId
     */
    readonly attrRegionalHostedZoneId: string;
    /**
     * `AWS::ApiGatewayV2::DomainName.DomainName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainname
     */
    domainName: string;
    /**
     * `AWS::ApiGatewayV2::DomainName.DomainNameConfigurations`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-domainnameconfigurations
     */
    domainNameConfigurations: Array<CfnDomainNameV2.DomainNameConfigurationProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::DomainName.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-domainname.html#cfn-apigatewayv2-domainname-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ApiGatewayV2::DomainName`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnDomainNameV2Props);
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
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnDomainNameV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface DomainNameConfigurationProperty {
        /**
         * `CfnDomainNameV2.DomainNameConfigurationProperty.CertificateArn`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-certificatearn
         */
        readonly certificateArn?: string;
        /**
         * `CfnDomainNameV2.DomainNameConfigurationProperty.CertificateName`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-certificatename
         */
        readonly certificateName?: string;
        /**
         * `CfnDomainNameV2.DomainNameConfigurationProperty.EndpointType`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-domainnameconfiguration.html#cfn-apigatewayv2-domainname-domainnameconfiguration-endpointtype
         */
        readonly endpointType?: string;
    }
}
/**
 * Properties for defining a `AWS::ApiGatewayV2::Integration`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnIntegrationV2Props {
    /**
     * `AWS::ApiGatewayV2::Integration.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::Integration.IntegrationType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationtype
     */
    readonly integrationType: string;
    /**
     * `AWS::ApiGatewayV2::Integration.ConnectionType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-connectiontype
     */
    readonly connectionType?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.ContentHandlingStrategy`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-contenthandlingstrategy
     */
    readonly contentHandlingStrategy?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.CredentialsArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-credentialsarn
     */
    readonly credentialsArn?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-description
     */
    readonly description?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.IntegrationMethod`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationmethod
     */
    readonly integrationMethod?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.IntegrationUri`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationuri
     */
    readonly integrationUri?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.PassthroughBehavior`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-passthroughbehavior
     */
    readonly passthroughBehavior?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.PayloadFormatVersion`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-payloadformatversion
     */
    readonly payloadFormatVersion?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.RequestParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requestparameters
     */
    readonly requestParameters?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Integration.RequestTemplates`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requesttemplates
     */
    readonly requestTemplates?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Integration.TemplateSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-templateselectionexpression
     */
    readonly templateSelectionExpression?: string;
    /**
     * `AWS::ApiGatewayV2::Integration.TimeoutInMillis`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-timeoutinmillis
     */
    readonly timeoutInMillis?: number;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Integration`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Integration
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnIntegrationV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Integration";
    /**
     * `AWS::ApiGatewayV2::Integration.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::Integration.IntegrationType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationtype
     */
    integrationType: string;
    /**
     * `AWS::ApiGatewayV2::Integration.ConnectionType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-connectiontype
     */
    connectionType: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.ContentHandlingStrategy`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-contenthandlingstrategy
     */
    contentHandlingStrategy: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.CredentialsArn`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-credentialsarn
     */
    credentialsArn: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-description
     */
    description: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.IntegrationMethod`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationmethod
     */
    integrationMethod: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.IntegrationUri`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-integrationuri
     */
    integrationUri: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.PassthroughBehavior`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-passthroughbehavior
     */
    passthroughBehavior: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.PayloadFormatVersion`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-payloadformatversion
     */
    payloadFormatVersion: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.RequestParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requestparameters
     */
    requestParameters: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.RequestTemplates`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-requesttemplates
     */
    requestTemplates: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.TemplateSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-templateselectionexpression
     */
    templateSelectionExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Integration.TimeoutInMillis`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integration.html#cfn-apigatewayv2-integration-timeoutinmillis
     */
    timeoutInMillis: number | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::Integration`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnIntegrationV2Props);
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
 * Properties for defining a `AWS::ApiGatewayV2::IntegrationResponse`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnIntegrationResponseV2Props {
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationid
     */
    readonly integrationId: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationResponseKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationresponsekey
     */
    readonly integrationResponseKey: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ContentHandlingStrategy`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-contenthandlingstrategy
     */
    readonly contentHandlingStrategy?: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ResponseParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responseparameters
     */
    readonly responseParameters?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ResponseTemplates`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responsetemplates
     */
    readonly responseTemplates?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.TemplateSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-templateselectionexpression
     */
    readonly templateSelectionExpression?: string;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::IntegrationResponse`
 *
 * @cloudformationResource AWS::ApiGatewayV2::IntegrationResponse
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnIntegrationResponseV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::IntegrationResponse";
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationid
     */
    integrationId: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.IntegrationResponseKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-integrationresponsekey
     */
    integrationResponseKey: string;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ContentHandlingStrategy`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-contenthandlingstrategy
     */
    contentHandlingStrategy: string | undefined;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ResponseParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responseparameters
     */
    responseParameters: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.ResponseTemplates`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-responsetemplates
     */
    responseTemplates: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::IntegrationResponse.TemplateSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-integrationresponse.html#cfn-apigatewayv2-integrationresponse-templateselectionexpression
     */
    templateSelectionExpression: string | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::IntegrationResponse`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnIntegrationResponseV2Props);
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
 * Properties for defining a `AWS::ApiGatewayV2::Model`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnModelV2Props {
    /**
     * `AWS::ApiGatewayV2::Model.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::Model.Name`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-name
     */
    readonly name: string;
    /**
     * `AWS::ApiGatewayV2::Model.Schema`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-schema
     */
    readonly schema: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Model.ContentType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-contenttype
     */
    readonly contentType?: string;
    /**
     * `AWS::ApiGatewayV2::Model.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-description
     */
    readonly description?: string;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Model`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Model
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnModelV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Model";
    /**
     * `AWS::ApiGatewayV2::Model.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::Model.Name`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-name
     */
    name: string;
    /**
     * `AWS::ApiGatewayV2::Model.Schema`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-schema
     */
    schema: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Model.ContentType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-contenttype
     */
    contentType: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Model.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-model.html#cfn-apigatewayv2-model-description
     */
    description: string | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::Model`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnModelV2Props);
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
 * Properties for defining a `AWS::ApiGatewayV2::Route`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnRouteV2Props {
    /**
     * `AWS::ApiGatewayV2::Route.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::Route.RouteKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routekey
     */
    readonly routeKey: string;
    /**
     * `AWS::ApiGatewayV2::Route.ApiKeyRequired`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apikeyrequired
     */
    readonly apiKeyRequired?: boolean | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Route.AuthorizationScopes`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationscopes
     */
    readonly authorizationScopes?: string[];
    /**
     * `AWS::ApiGatewayV2::Route.AuthorizationType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationtype
     */
    readonly authorizationType?: string;
    /**
     * `AWS::ApiGatewayV2::Route.AuthorizerId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizerid
     */
    readonly authorizerId?: string;
    /**
     * `AWS::ApiGatewayV2::Route.ModelSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-modelselectionexpression
     */
    readonly modelSelectionExpression?: string;
    /**
     * `AWS::ApiGatewayV2::Route.OperationName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-operationname
     */
    readonly operationName?: string;
    /**
     * `AWS::ApiGatewayV2::Route.RequestModels`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestmodels
     */
    readonly requestModels?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Route.RequestParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestparameters
     */
    readonly requestParameters?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Route.RouteResponseSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routeresponseselectionexpression
     */
    readonly routeResponseSelectionExpression?: string;
    /**
     * `AWS::ApiGatewayV2::Route.Target`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-target
     */
    readonly target?: string;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Route`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Route
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnRouteV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Route";
    /**
     * `AWS::ApiGatewayV2::Route.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::Route.RouteKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routekey
     */
    routeKey: string;
    /**
     * `AWS::ApiGatewayV2::Route.ApiKeyRequired`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-apikeyrequired
     */
    apiKeyRequired: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.AuthorizationScopes`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationscopes
     */
    authorizationScopes: string[] | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.AuthorizationType`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizationtype
     */
    authorizationType: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.AuthorizerId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-authorizerid
     */
    authorizerId: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.ModelSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-modelselectionexpression
     */
    modelSelectionExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.OperationName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-operationname
     */
    operationName: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.RequestModels`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestmodels
     */
    requestModels: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.RequestParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-requestparameters
     */
    requestParameters: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.RouteResponseSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-routeresponseselectionexpression
     */
    routeResponseSelectionExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Route.Target`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-route.html#cfn-apigatewayv2-route-target
     */
    target: string | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::Route`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnRouteV2Props);
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
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnRouteV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-route-parameterconstraints.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface ParameterConstraintsProperty {
        /**
         * `CfnRouteV2.ParameterConstraintsProperty.Required`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-route-parameterconstraints.html#cfn-apigatewayv2-route-parameterconstraints-required
         */
        readonly required: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `AWS::ApiGatewayV2::RouteResponse`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnRouteResponseV2Props {
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.RouteId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeid
     */
    readonly routeId: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.RouteResponseKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeresponsekey
     */
    readonly routeResponseKey: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ModelSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-modelselectionexpression
     */
    readonly modelSelectionExpression?: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ResponseModels`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responsemodels
     */
    readonly responseModels?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ResponseParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responseparameters
     */
    readonly responseParameters?: any | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::RouteResponse`
 *
 * @cloudformationResource AWS::ApiGatewayV2::RouteResponse
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnRouteResponseV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::RouteResponse";
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.RouteId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeid
     */
    routeId: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.RouteResponseKey`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-routeresponsekey
     */
    routeResponseKey: string;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ModelSelectionExpression`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-modelselectionexpression
     */
    modelSelectionExpression: string | undefined;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ResponseModels`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responsemodels
     */
    responseModels: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::RouteResponse.ResponseParameters`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-routeresponse.html#cfn-apigatewayv2-routeresponse-responseparameters
     */
    responseParameters: any | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::ApiGatewayV2::RouteResponse`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnRouteResponseV2Props);
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
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnRouteResponseV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-routeresponse-parameterconstraints.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface ParameterConstraintsProperty {
        /**
         * `CfnRouteResponseV2.ParameterConstraintsProperty.Required`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-routeresponse-parameterconstraints.html#cfn-apigatewayv2-routeresponse-parameterconstraints-required
         */
        readonly required: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `AWS::ApiGatewayV2::Stage`
 *
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 * @deprecated moved to package aws-apigatewayv2
 */
export interface CfnStageV2Props {
    /**
     * `AWS::ApiGatewayV2::Stage.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-apiid
     */
    readonly apiId: string;
    /**
     * `AWS::ApiGatewayV2::Stage.StageName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagename
     */
    readonly stageName: string;
    /**
     * `AWS::ApiGatewayV2::Stage.AccessLogSettings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-accesslogsettings
     */
    readonly accessLogSettings?: CfnStageV2.AccessLogSettingsProperty | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Stage.AutoDeploy`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-autodeploy
     */
    readonly autoDeploy?: boolean | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Stage.ClientCertificateId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-clientcertificateid
     */
    readonly clientCertificateId?: string;
    /**
     * `AWS::ApiGatewayV2::Stage.DefaultRouteSettings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings
     */
    readonly defaultRouteSettings?: CfnStageV2.RouteSettingsProperty | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Stage.DeploymentId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-deploymentid
     */
    readonly deploymentId?: string;
    /**
     * `AWS::ApiGatewayV2::Stage.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-description
     */
    readonly description?: string;
    /**
     * `AWS::ApiGatewayV2::Stage.RouteSettings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
     */
    readonly routeSettings?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Stage.StageVariables`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagevariables
     */
    readonly stageVariables?: any | cdk.IResolvable;
    /**
     * `AWS::ApiGatewayV2::Stage.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-tags
     */
    readonly tags?: any;
}
/**
 * A CloudFormation `AWS::ApiGatewayV2::Stage`
 *
 * @cloudformationResource AWS::ApiGatewayV2::Stage
 * @stability deprecated
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html
 * @deprecated moved to package aws-apigatewayv2
 */
export declare class CfnStageV2 extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::ApiGatewayV2::Stage";
    /**
     * `AWS::ApiGatewayV2::Stage.ApiId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-apiid
     */
    apiId: string;
    /**
     * `AWS::ApiGatewayV2::Stage.StageName`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagename
     */
    stageName: string;
    /**
     * `AWS::ApiGatewayV2::Stage.AccessLogSettings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-accesslogsettings
     */
    accessLogSettings: CfnStageV2.AccessLogSettingsProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.AutoDeploy`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-autodeploy
     */
    autoDeploy: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.ClientCertificateId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-clientcertificateid
     */
    clientCertificateId: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.DefaultRouteSettings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-defaultroutesettings
     */
    defaultRouteSettings: CfnStageV2.RouteSettingsProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.DeploymentId`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-deploymentid
     */
    deploymentId: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.Description`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-description
     */
    description: string | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.RouteSettings`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
     */
    routeSettings: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.StageVariables`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-stagevariables
     */
    stageVariables: any | cdk.IResolvable | undefined;
    /**
     * `AWS::ApiGatewayV2::Stage.Tags`
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::ApiGatewayV2::Stage`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: Construct, id: string, props: CfnStageV2Props);
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
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnStageV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface AccessLogSettingsProperty {
        /**
         * `CfnStageV2.AccessLogSettingsProperty.DestinationArn`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html#cfn-apigatewayv2-stage-accesslogsettings-destinationarn
         */
        readonly destinationArn?: string;
        /**
         * `CfnStageV2.AccessLogSettingsProperty.Format`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-accesslogsettings.html#cfn-apigatewayv2-stage-accesslogsettings-format
         */
        readonly format?: string;
    }
}
/**
 * @deprecated moved to package aws-apigatewayv2
 */
export declare namespace CfnStageV2 {
    /**
     * @stability deprecated
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
     * @deprecated moved to package aws-apigatewayv2
     */
    interface RouteSettingsProperty {
        /**
         * `CfnStageV2.RouteSettingsProperty.DataTraceEnabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
         */
        readonly dataTraceEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnStageV2.RouteSettingsProperty.DetailedMetricsEnabled`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
         */
        readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnStageV2.RouteSettingsProperty.LoggingLevel`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
         */
        readonly loggingLevel?: string;
        /**
         * `CfnStageV2.RouteSettingsProperty.ThrottlingBurstLimit`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
         */
        readonly throttlingBurstLimit?: number;
        /**
         * `CfnStageV2.RouteSettingsProperty.ThrottlingRateLimit`
         * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
         */
        readonly throttlingRateLimit?: number;
    }
}
