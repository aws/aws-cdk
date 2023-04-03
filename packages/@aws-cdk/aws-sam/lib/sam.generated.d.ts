import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnApi`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
export interface CfnApiProps {
    /**
     * `AWS::Serverless::Api.StageName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly stageName: string;
    /**
     * `AWS::Serverless::Api.AccessLogSetting`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly accessLogSetting?: CfnApi.AccessLogSettingProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.Auth`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly auth?: CfnApi.AuthProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.BinaryMediaTypes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly binaryMediaTypes?: string[];
    /**
     * `AWS::Serverless::Api.CacheClusterEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly cacheClusterEnabled?: boolean | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.CacheClusterSize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly cacheClusterSize?: string;
    /**
     * `AWS::Serverless::Api.CanarySetting`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-canarysetting
     */
    readonly canarySetting?: CfnApi.CanarySettingProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.Cors`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly cors?: CfnApi.CorsConfigurationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.DefinitionBody`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly definitionBody?: any | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.DefinitionUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly definitionUri?: CfnApi.S3LocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.Description`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-description
     */
    readonly description?: string;
    /**
     * `AWS::Serverless::Api.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-disableexecuteapiendpoint
     */
    readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.Domain`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-domain
     */
    readonly domain?: CfnApi.DomainConfigurationProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.EndpointConfiguration`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly endpointConfiguration?: CfnApi.EndpointConfigurationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.GatewayResponses`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-gatewayresponses
     */
    readonly gatewayResponses?: any | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.MethodSettings`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly methodSettings?: Array<any | cdk.IResolvable> | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.MinimumCompressionSize`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-minimumcompressionsize
     */
    readonly minimumCompressionSize?: number;
    /**
     * `AWS::Serverless::Api.Models`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-models
     */
    readonly models?: any | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.Name`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly name?: string;
    /**
     * `AWS::Serverless::Api.OpenApiVersion`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly openApiVersion?: string;
    /**
     * `AWS::Serverless::Api.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * `AWS::Serverless::Api.TracingEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly tracingEnabled?: boolean | cdk.IResolvable;
    /**
     * `AWS::Serverless::Api.Variables`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    readonly variables?: {
        [key: string]: (string);
    } | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Serverless::Api`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::Api
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
 */
export declare class CfnApi extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::Api";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApi;
    /**
     * `AWS::Serverless::Api.StageName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    stageName: string;
    /**
     * `AWS::Serverless::Api.AccessLogSetting`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    accessLogSetting: CfnApi.AccessLogSettingProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.Auth`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    auth: CfnApi.AuthProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.BinaryMediaTypes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    binaryMediaTypes: string[] | undefined;
    /**
     * `AWS::Serverless::Api.CacheClusterEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    cacheClusterEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.CacheClusterSize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    cacheClusterSize: string | undefined;
    /**
     * `AWS::Serverless::Api.CanarySetting`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-canarysetting
     */
    canarySetting: CfnApi.CanarySettingProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.Cors`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    cors: CfnApi.CorsConfigurationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.DefinitionBody`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    definitionBody: any | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.DefinitionUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    definitionUri: CfnApi.S3LocationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.Description`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-description
     */
    description: string | undefined;
    /**
     * `AWS::Serverless::Api.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-disableexecuteapiendpoint
     */
    disableExecuteApiEndpoint: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.Domain`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-domain
     */
    domain: CfnApi.DomainConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.EndpointConfiguration`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    endpointConfiguration: CfnApi.EndpointConfigurationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.GatewayResponses`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-gatewayresponses
     */
    gatewayResponses: any | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.MethodSettings`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    methodSettings: Array<any | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.MinimumCompressionSize`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-minimumcompressionsize
     */
    minimumCompressionSize: number | undefined;
    /**
     * `AWS::Serverless::Api.Models`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-api.html#sam-api-models
     */
    models: any | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.Name`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    name: string | undefined;
    /**
     * `AWS::Serverless::Api.OpenApiVersion`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    openApiVersion: string | undefined;
    /**
     * `AWS::Serverless::Api.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::Serverless::Api.TracingEnabled`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    tracingEnabled: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Api.Variables`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi
     */
    variables: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Serverless::Api`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApiProps);
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
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html
     */
    interface AccessLogSettingProperty {
        /**
         * `CfnApi.AccessLogSettingProperty.DestinationArn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-destinationarn
         */
        readonly destinationArn?: string;
        /**
         * `CfnApi.AccessLogSettingProperty.Format`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-format
         */
        readonly format?: string;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
     */
    interface AuthProperty {
        /**
         * `CfnApi.AuthProperty.AddDefaultAuthorizerToCorsPreflight`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        readonly addDefaultAuthorizerToCorsPreflight?: boolean | cdk.IResolvable;
        /**
         * `CfnApi.AuthProperty.Authorizers`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        readonly authorizers?: any | cdk.IResolvable;
        /**
         * `CfnApi.AuthProperty.DefaultAuthorizer`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api-auth-object
         */
        readonly defaultAuthorizer?: string;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html
     */
    interface CanarySettingProperty {
        /**
         * `CfnApi.CanarySettingProperty.DeploymentId`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-deploymentid
         */
        readonly deploymentId?: string;
        /**
         * `CfnApi.CanarySettingProperty.PercentTraffic`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-percenttraffic
         */
        readonly percentTraffic?: number;
        /**
         * `CfnApi.CanarySettingProperty.StageVariableOverrides`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-stagevariableoverrides
         */
        readonly stageVariableOverrides?: {
            [key: string]: (string);
        } | cdk.IResolvable;
        /**
         * `CfnApi.CanarySettingProperty.UseStageCache`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-canarysetting.html#cfn-apigateway-stage-canarysetting-usestagecache
         */
        readonly useStageCache?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
     */
    interface CorsConfigurationProperty {
        /**
         * `CfnApi.CorsConfigurationProperty.AllowCredentials`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowCredentials?: boolean | cdk.IResolvable;
        /**
         * `CfnApi.CorsConfigurationProperty.AllowHeaders`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowHeaders?: string;
        /**
         * `CfnApi.CorsConfigurationProperty.AllowMethods`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowMethods?: string;
        /**
         * `CfnApi.CorsConfigurationProperty.AllowOrigin`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly allowOrigin: string;
        /**
         * `CfnApi.CorsConfigurationProperty.MaxAge`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration
         */
        readonly maxAge?: string;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html
     */
    interface DomainConfigurationProperty {
        /**
         * `CfnApi.DomainConfigurationProperty.BasePath`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-basepath
         */
        readonly basePath?: string[];
        /**
         * `CfnApi.DomainConfigurationProperty.CertificateArn`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-certificatearn
         */
        readonly certificateArn: string;
        /**
         * `CfnApi.DomainConfigurationProperty.DomainName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-domainname
         */
        readonly domainName: string;
        /**
         * `CfnApi.DomainConfigurationProperty.EndpointConfiguration`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-endpointconfiguration
         */
        readonly endpointConfiguration?: string;
        /**
         * `CfnApi.DomainConfigurationProperty.MutualTlsAuthentication`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-mutualtlsauthentication
         */
        readonly mutualTlsAuthentication?: CfnApi.MutualTlsAuthenticationProperty | cdk.IResolvable;
        /**
         * `CfnApi.DomainConfigurationProperty.OwnershipVerificationCertificateArn`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-ownershipverificationcertificatearn
         */
        readonly ownershipVerificationCertificateArn?: string;
        /**
         * `CfnApi.DomainConfigurationProperty.Route53`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-route53
         */
        readonly route53?: CfnApi.Route53ConfigurationProperty | cdk.IResolvable;
        /**
         * `CfnApi.DomainConfigurationProperty.SecurityPolicy`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-domainconfiguration.html#sam-api-domainconfiguration-securitypolicy
         */
        readonly securityPolicy?: string;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-endpointconfiguration.html
     */
    interface EndpointConfigurationProperty {
        /**
         * `CfnApi.EndpointConfigurationProperty.Type`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-endpointconfiguration.html#sam-api-endpointconfiguration-type
         */
        readonly type?: string;
        /**
         * `CfnApi.EndpointConfigurationProperty.VpcEndpointIds`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-endpointconfiguration.html#sam-api-endpointconfiguration-vpcendpointids
         */
        readonly vpcEndpointIds?: string[];
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html
     */
    interface MutualTlsAuthenticationProperty {
        /**
         * `CfnApi.MutualTlsAuthenticationProperty.TruststoreUri`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html#cfn-apigateway-domainname-mutualtlsauthentication-truststoreuri
         */
        readonly truststoreUri?: string;
        /**
         * `CfnApi.MutualTlsAuthenticationProperty.TruststoreVersion`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-domainname-mutualtlsauthentication.html#cfn-apigateway-domainname-mutualtlsauthentication-truststoreversion
         */
        readonly truststoreVersion?: string;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html
     */
    interface Route53ConfigurationProperty {
        /**
         * `CfnApi.Route53ConfigurationProperty.DistributedDomainName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-distributiondomainname
         */
        readonly distributedDomainName?: string;
        /**
         * `CfnApi.Route53ConfigurationProperty.EvaluateTargetHealth`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-evaluatetargethealth
         */
        readonly evaluateTargetHealth?: boolean | cdk.IResolvable;
        /**
         * `CfnApi.Route53ConfigurationProperty.HostedZoneId`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-hostedzoneid
         */
        readonly hostedZoneId?: string;
        /**
         * `CfnApi.Route53ConfigurationProperty.HostedZoneName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-hostedzonename
         */
        readonly hostedZoneName?: string;
        /**
         * `CfnApi.Route53ConfigurationProperty.IpV6`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-api-route53configuration.html#sam-api-route53configuration-ipv6
         */
        readonly ipV6?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
        /**
         * `CfnApi.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly bucket: string;
        /**
         * `CfnApi.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly key: string;
        /**
         * `CfnApi.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly version: number;
    }
}
/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export interface CfnApplicationProps {
    /**
     * `AWS::Serverless::Application.Location`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly location: CfnApplication.ApplicationLocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Application.NotificationArns`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly notificationArns?: string[];
    /**
     * `AWS::Serverless::Application.Parameters`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly parameters?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * `AWS::Serverless::Application.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * `AWS::Serverless::Application.TimeoutInMinutes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly timeoutInMinutes?: number;
}
/**
 * A CloudFormation `AWS::Serverless::Application`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::Application
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
 */
export declare class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::Application";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication;
    /**
     * `AWS::Serverless::Application.Location`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    location: CfnApplication.ApplicationLocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Application.NotificationArns`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    notificationArns: string[] | undefined;
    /**
     * `AWS::Serverless::Application.Parameters`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    parameters: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Application.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::Serverless::Application.TimeoutInMinutes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    timeoutInMinutes: number | undefined;
    /**
     * Create a new `AWS::Serverless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps);
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
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
     */
    interface ApplicationLocationProperty {
        /**
         * `CfnApplication.ApplicationLocationProperty.ApplicationId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
         */
        readonly applicationId: string;
        /**
         * `CfnApplication.ApplicationLocationProperty.SemanticVersion`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication
         */
        readonly semanticVersion: string;
    }
}
/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
export interface CfnFunctionProps {
    /**
     * `AWS::Serverless::Function.Architectures`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-architectures
     */
    readonly architectures?: string[];
    /**
     * `AWS::Serverless::Function.AssumeRolePolicyDocument`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-assumerolepolicydocument
     */
    readonly assumeRolePolicyDocument?: any | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.AutoPublishAlias`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly autoPublishAlias?: string;
    /**
     * `AWS::Serverless::Function.AutoPublishCodeSha256`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-autopublishcodesha256
     */
    readonly autoPublishCodeSha256?: string;
    /**
     * `AWS::Serverless::Function.CodeSigningConfigArn`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-codesigningconfigarn
     */
    readonly codeSigningConfigArn?: string;
    /**
     * `AWS::Serverless::Function.CodeUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly codeUri?: CfnFunction.S3LocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.DeadLetterQueue`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly deadLetterQueue?: CfnFunction.DeadLetterQueueProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.DeploymentPreference`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
     */
    readonly deploymentPreference?: CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly description?: string;
    /**
     * `AWS::Serverless::Function.Environment`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly environment?: CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.EventInvokeConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly eventInvokeConfig?: CfnFunction.EventInvokeConfigProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.Events`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly events?: {
        [key: string]: (CfnFunction.EventSourceProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.FileSystemConfigs`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html
     */
    readonly fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.FunctionName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly functionName?: string;
    /**
     * `AWS::Serverless::Function.Handler`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly handler?: string;
    /**
     * `AWS::Serverless::Function.ImageConfig`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageconfig
     */
    readonly imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.ImageUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageuri
     */
    readonly imageUri?: string;
    /**
     * `AWS::Serverless::Function.InlineCode`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly inlineCode?: string;
    /**
     * `AWS::Serverless::Function.KmsKeyArn`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly kmsKeyArn?: string;
    /**
     * `AWS::Serverless::Function.Layers`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly layers?: string[];
    /**
     * `AWS::Serverless::Function.MemorySize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly memorySize?: number;
    /**
     * `AWS::Serverless::Function.PackageType`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-packagetype
     */
    readonly packageType?: string;
    /**
     * `AWS::Serverless::Function.PermissionsBoundary`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly permissionsBoundary?: string;
    /**
     * `AWS::Serverless::Function.Policies`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly policies?: Array<CfnFunction.IAMPolicyDocumentProperty | CfnFunction.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnFunction.IAMPolicyDocumentProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.ProvisionedConcurrencyConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly provisionedConcurrencyConfig?: CfnFunction.ProvisionedConcurrencyConfigProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::Function.ReservedConcurrentExecutions`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly reservedConcurrentExecutions?: number;
    /**
     * `AWS::Serverless::Function.Role`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly role?: string;
    /**
     * `AWS::Serverless::Function.Runtime`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly runtime?: string;
    /**
     * `AWS::Serverless::Function.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * `AWS::Serverless::Function.Timeout`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly timeout?: number;
    /**
     * `AWS::Serverless::Function.Tracing`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly tracing?: string;
    /**
     * `AWS::Serverless::Function.VersionDescription`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly versionDescription?: string;
    /**
     * `AWS::Serverless::Function.VpcConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly vpcConfig?: CfnFunction.VpcConfigProperty | cdk.IResolvable;
}
/**
 * A CloudFormation `AWS::Serverless::Function`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::Function
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
 */
export declare class CfnFunction extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::Function";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunction;
    /**
     * `AWS::Serverless::Function.Architectures`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-architectures
     */
    architectures: string[] | undefined;
    /**
     * `AWS::Serverless::Function.AssumeRolePolicyDocument`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-assumerolepolicydocument
     */
    assumeRolePolicyDocument: any | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.AutoPublishAlias`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    autoPublishAlias: string | undefined;
    /**
     * `AWS::Serverless::Function.AutoPublishCodeSha256`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-autopublishcodesha256
     */
    autoPublishCodeSha256: string | undefined;
    /**
     * `AWS::Serverless::Function.CodeSigningConfigArn`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-codesigningconfigarn
     */
    codeSigningConfigArn: string | undefined;
    /**
     * `AWS::Serverless::Function.CodeUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    codeUri: CfnFunction.S3LocationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.DeadLetterQueue`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    deadLetterQueue: CfnFunction.DeadLetterQueueProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.DeploymentPreference`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
     */
    deploymentPreference: CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    description: string | undefined;
    /**
     * `AWS::Serverless::Function.Environment`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    environment: CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.EventInvokeConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    eventInvokeConfig: CfnFunction.EventInvokeConfigProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.Events`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    events: {
        [key: string]: (CfnFunction.EventSourceProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.FileSystemConfigs`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html
     */
    fileSystemConfigs: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.FunctionName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    functionName: string | undefined;
    /**
     * `AWS::Serverless::Function.Handler`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    handler: string | undefined;
    /**
     * `AWS::Serverless::Function.ImageConfig`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageconfig
     */
    imageConfig: CfnFunction.ImageConfigProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.ImageUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-imageuri
     */
    imageUri: string | undefined;
    /**
     * `AWS::Serverless::Function.InlineCode`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    inlineCode: string | undefined;
    /**
     * `AWS::Serverless::Function.KmsKeyArn`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    kmsKeyArn: string | undefined;
    /**
     * `AWS::Serverless::Function.Layers`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    layers: string[] | undefined;
    /**
     * `AWS::Serverless::Function.MemorySize`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    memorySize: number | undefined;
    /**
     * `AWS::Serverless::Function.PackageType`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-function.html#sam-function-packagetype
     */
    packageType: string | undefined;
    /**
     * `AWS::Serverless::Function.PermissionsBoundary`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    permissionsBoundary: string | undefined;
    /**
     * `AWS::Serverless::Function.Policies`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    policies: Array<CfnFunction.IAMPolicyDocumentProperty | CfnFunction.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnFunction.IAMPolicyDocumentProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.ProvisionedConcurrencyConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    provisionedConcurrencyConfig: CfnFunction.ProvisionedConcurrencyConfigProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::Function.ReservedConcurrentExecutions`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    reservedConcurrentExecutions: number | undefined;
    /**
     * `AWS::Serverless::Function.Role`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    role: string | undefined;
    /**
     * `AWS::Serverless::Function.Runtime`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    runtime: string | undefined;
    /**
     * `AWS::Serverless::Function.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::Serverless::Function.Timeout`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    timeout: number | undefined;
    /**
     * `AWS::Serverless::Function.Tracing`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    tracing: string | undefined;
    /**
     * `AWS::Serverless::Function.VersionDescription`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    versionDescription: string | undefined;
    /**
     * `AWS::Serverless::Function.VpcConfig`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
     */
    vpcConfig: CfnFunction.VpcConfigProperty | cdk.IResolvable | undefined;
    /**
     * Create a new `AWS::Serverless::Function`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnFunctionProps);
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
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
     */
    interface AlexaSkillEventProperty {
        /**
         * `CfnFunction.AlexaSkillEventProperty.Variables`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#alexaskill
         */
        readonly variables?: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    interface ApiEventProperty {
        /**
         * `CfnFunction.ApiEventProperty.Auth`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly auth?: CfnFunction.AuthProperty | cdk.IResolvable;
        /**
         * `CfnFunction.ApiEventProperty.Method`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly method: string;
        /**
         * `CfnFunction.ApiEventProperty.Path`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly path: string;
        /**
         * `CfnFunction.ApiEventProperty.RequestModel`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly requestModel?: CfnFunction.RequestModelProperty | cdk.IResolvable;
        /**
         * `CfnFunction.ApiEventProperty.RequestParameters`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly requestParameters?: Array<CfnFunction.RequestParameterProperty | string | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnFunction.ApiEventProperty.RestApiId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly restApiId?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
     */
    interface AuthProperty {
        /**
         * `CfnFunction.AuthProperty.ApiKeyRequired`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly apiKeyRequired?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.AuthProperty.AuthorizationScopes`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly authorizationScopes?: string[];
        /**
         * `CfnFunction.AuthProperty.Authorizer`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly authorizer?: string;
        /**
         * `CfnFunction.AuthProperty.ResourcePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly resourcePolicy?: CfnFunction.AuthResourcePolicyProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
     */
    interface AuthResourcePolicyProperty {
        /**
         * `CfnFunction.AuthResourcePolicyProperty.AwsAccountBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly awsAccountBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.AwsAccountWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly awsAccountWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.CustomStatements`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly customStatements?: Array<any | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpcBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpcBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpcWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpcWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpceBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpceBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IntrinsicVpceWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly intrinsicVpceWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IpRangeBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly ipRangeBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.IpRangeWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly ipRangeWhitelist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.SourceVpcBlacklist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly sourceVpcBlacklist?: string[];
        /**
         * `CfnFunction.AuthResourcePolicyProperty.SourceVpcWhitelist`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#function-auth-object
         */
        readonly sourceVpcWhitelist?: string[];
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface BucketSAMPTProperty {
        /**
         * `CfnFunction.BucketSAMPTProperty.BucketName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly bucketName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
     */
    interface CloudWatchEventEventProperty {
        /**
         * `CfnFunction.CloudWatchEventEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
         */
        readonly input?: string;
        /**
         * `CfnFunction.CloudWatchEventEventProperty.InputPath`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
         */
        readonly inputPath?: string;
        /**
         * `CfnFunction.CloudWatchEventEventProperty.Pattern`
         *
         * @link http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchevent
     */
    interface CloudWatchLogsEventProperty {
        /**
         * `CfnFunction.CloudWatchLogsEventProperty.FilterPattern`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchlogs
         */
        readonly filterPattern: string;
        /**
         * `CfnFunction.CloudWatchLogsEventProperty.LogGroupName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#cloudwatchlogs
         */
        readonly logGroupName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface CollectionSAMPTProperty {
        /**
         * `CfnFunction.CollectionSAMPTProperty.CollectionId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly collectionId: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deadletterqueue-object
     */
    interface DeadLetterQueueProperty {
        /**
         * `CfnFunction.DeadLetterQueueProperty.TargetArn`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly targetArn: string;
        /**
         * `CfnFunction.DeadLetterQueueProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly type: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst
     */
    interface DeploymentPreferenceProperty {
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Alarms`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly alarms?: string[];
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly enabled: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Hooks`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly hooks?: CfnFunction.HooksProperty | cdk.IResolvable;
        /**
         * `CfnFunction.DeploymentPreferenceProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly type: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
     */
    interface DestinationProperty {
        /**
         * `CfnFunction.DestinationProperty.Destination`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
         */
        readonly destination: string;
        /**
         * `CfnFunction.DestinationProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
         */
        readonly type?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
     */
    interface DestinationConfigProperty {
        /**
         * `CfnFunction.DestinationConfigProperty.OnFailure`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#destination-config-object
         */
        readonly onFailure: CfnFunction.DestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface DomainSAMPTProperty {
        /**
         * `CfnFunction.DomainSAMPTProperty.DomainName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly domainName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
     */
    interface DynamoDBEventProperty {
        /**
         * `CfnFunction.DynamoDBEventProperty.BatchSize`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly batchSize?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.BisectBatchOnFunctionError`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly bisectBatchOnFunctionError?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.DynamoDBEventProperty.DestinationConfig`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly destinationConfig?: CfnFunction.DestinationConfigProperty | cdk.IResolvable;
        /**
         * `CfnFunction.DynamoDBEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.DynamoDBEventProperty.MaximumBatchingWindowInSeconds`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly maximumBatchingWindowInSeconds?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.MaximumRecordAgeInSeconds`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly maximumRecordAgeInSeconds?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.MaximumRetryAttempts`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly maximumRetryAttempts?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.ParallelizationFactor`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly parallelizationFactor?: number;
        /**
         * `CfnFunction.DynamoDBEventProperty.StartingPosition`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly startingPosition: string;
        /**
         * `CfnFunction.DynamoDBEventProperty.Stream`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#dynamodb
         */
        readonly stream: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface EmptySAMPTProperty {
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
     */
    interface EventBridgeRuleEventProperty {
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.EventBusName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
         */
        readonly eventBusName?: string;
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
         */
        readonly input?: string;
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.InputPath`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#eventbridgerule
         */
        readonly inputPath?: string;
        /**
         * `CfnFunction.EventBridgeRuleEventProperty.Pattern`
         *
         * @link https://docs.aws.amazon.com/eventbridge/latest/userguide/filtering-examples-structure.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
     */
    interface EventInvokeConfigProperty {
        /**
         * `CfnFunction.EventInvokeConfigProperty.DestinationConfig`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
         */
        readonly destinationConfig?: CfnFunction.EventInvokeDestinationConfigProperty | cdk.IResolvable;
        /**
         * `CfnFunction.EventInvokeConfigProperty.MaximumEventAgeInSeconds`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
         */
        readonly maximumEventAgeInSeconds?: number;
        /**
         * `CfnFunction.EventInvokeConfigProperty.MaximumRetryAttempts`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-config-object
         */
        readonly maximumRetryAttempts?: number;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-destination-config-object
     */
    interface EventInvokeDestinationConfigProperty {
        /**
         * `CfnFunction.EventInvokeDestinationConfigProperty.OnFailure`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-destination-config-object
         */
        readonly onFailure: CfnFunction.DestinationProperty | cdk.IResolvable;
        /**
         * `CfnFunction.EventInvokeDestinationConfigProperty.OnSuccess`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#event-invoke-destination-config-object
         */
        readonly onSuccess: CfnFunction.DestinationProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
     */
    interface EventSourceProperty {
        /**
         * `CfnFunction.EventSourceProperty.Properties`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types
         */
        readonly properties: CfnFunction.S3EventProperty | CfnFunction.SNSEventProperty | CfnFunction.SQSEventProperty | CfnFunction.KinesisEventProperty | CfnFunction.DynamoDBEventProperty | CfnFunction.ApiEventProperty | CfnFunction.ScheduleEventProperty | CfnFunction.CloudWatchEventEventProperty | CfnFunction.CloudWatchLogsEventProperty | CfnFunction.IoTRuleEventProperty | CfnFunction.AlexaSkillEventProperty | CfnFunction.EventBridgeRuleEventProperty | CfnFunction.HttpApiEventProperty | cdk.IResolvable;
        /**
         * `CfnFunction.EventSourceProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
         */
        readonly type: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
     */
    interface FileSystemConfigProperty {
        /**
         * `CfnFunction.FileSystemConfigProperty.Arn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
         */
        readonly arn?: string;
        /**
         * `CfnFunction.FileSystemConfigProperty.LocalMountPath`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-filesystemconfig.html#cfn-lambda-function-filesystemconfig-localmountpath
         */
        readonly localMountPath?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
     */
    interface FunctionEnvironmentProperty {
        /**
         * `CfnFunction.FunctionEnvironmentProperty.Variables`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#environment-object
         */
        readonly variables: {
            [key: string]: (string);
        } | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface FunctionSAMPTProperty {
        /**
         * `CfnFunction.FunctionSAMPTProperty.FunctionName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly functionName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/safe_lambda_deployments.rst
     */
    interface HooksProperty {
        /**
         * `CfnFunction.HooksProperty.PostTraffic`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly postTraffic?: string;
        /**
         * `CfnFunction.HooksProperty.PreTraffic`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#deploymentpreference-object
         */
        readonly preTraffic?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
     */
    interface HttpApiEventProperty {
        /**
         * `CfnFunction.HttpApiEventProperty.ApiId`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly apiId?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.Auth`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapi.html
         */
        readonly auth?: CfnFunction.HttpApiFunctionAuthProperty | cdk.IResolvable;
        /**
         * `CfnFunction.HttpApiEventProperty.Method`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly method?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.Path`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly path?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.PayloadFormatVersion`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly payloadFormatVersion?: string;
        /**
         * `CfnFunction.HttpApiEventProperty.RouteSettings`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigatewayv2-stage.html#cfn-apigatewayv2-stage-routesettings
         */
        readonly routeSettings?: CfnFunction.RouteSettingsProperty | cdk.IResolvable;
        /**
         * `CfnFunction.HttpApiEventProperty.TimeoutInMillis`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#httpapi
         */
        readonly timeoutInMillis?: number;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapifunctionauth.html
     */
    interface HttpApiFunctionAuthProperty {
        /**
         * `CfnFunction.HttpApiFunctionAuthProperty.AuthorizationScopes`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapifunctionauth.html
         */
        readonly authorizationScopes?: string[];
        /**
         * `CfnFunction.HttpApiFunctionAuthProperty.Authorizer`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-httpapifunctionauth.html
         */
        readonly authorizer?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
     */
    interface IAMPolicyDocumentProperty {
        /**
         * `CfnFunction.IAMPolicyDocumentProperty.Statement`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly statement: any | cdk.IResolvable;
        /**
         * `CfnFunction.IAMPolicyDocumentProperty.Version`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly version?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface IdentitySAMPTProperty {
        /**
         * `CfnFunction.IdentitySAMPTProperty.IdentityName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly identityName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html
     */
    interface ImageConfigProperty {
        /**
         * `CfnFunction.ImageConfigProperty.Command`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-command
         */
        readonly command?: string[];
        /**
         * `CfnFunction.ImageConfigProperty.EntryPoint`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-entrypoint
         */
        readonly entryPoint?: string[];
        /**
         * `CfnFunction.ImageConfigProperty.WorkingDirectory`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-imageconfig.html#cfn-lambda-function-imageconfig-workingdirectory
         */
        readonly workingDirectory?: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
     */
    interface IoTRuleEventProperty {
        /**
         * `CfnFunction.IoTRuleEventProperty.AwsIotSqlVersion`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
         */
        readonly awsIotSqlVersion?: string;
        /**
         * `CfnFunction.IoTRuleEventProperty.Sql`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#iotrule
         */
        readonly sql: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface KeySAMPTProperty {
        /**
         * `CfnFunction.KeySAMPTProperty.KeyId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly keyId: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
     */
    interface KinesisEventProperty {
        /**
         * `CfnFunction.KinesisEventProperty.BatchSize`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly batchSize?: number;
        /**
         * `CfnFunction.KinesisEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.KinesisEventProperty.FunctionResponseTypes`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly functionResponseTypes?: string[];
        /**
         * `CfnFunction.KinesisEventProperty.StartingPosition`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly startingPosition: string;
        /**
         * `CfnFunction.KinesisEventProperty.Stream`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#kinesis
         */
        readonly stream: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface LogGroupSAMPTProperty {
        /**
         * `CfnFunction.LogGroupSAMPTProperty.LogGroupName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly logGroupName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface ParameterNameSAMPTProperty {
        /**
         * `CfnFunction.ParameterNameSAMPTProperty.ParameterName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly parameterName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#provisioned-concurrency-config-object
     */
    interface ProvisionedConcurrencyConfigProperty {
        /**
         * `CfnFunction.ProvisionedConcurrencyConfigProperty.ProvisionedConcurrentExecutions`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#provisioned-concurrency-config-object
         */
        readonly provisionedConcurrentExecutions: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface QueueSAMPTProperty {
        /**
         * `CfnFunction.QueueSAMPTProperty.QueueName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly queueName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html
     */
    interface RequestModelProperty {
        /**
         * `CfnFunction.RequestModelProperty.Model`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-model
         */
        readonly model: string;
        /**
         * `CfnFunction.RequestModelProperty.Required`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-required
         */
        readonly required?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RequestModelProperty.ValidateBody`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-validatebody
         */
        readonly validateBody?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RequestModelProperty.ValidateParameters`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestmodel.html#sam-function-requestmodel-validateparameters
         */
        readonly validateParameters?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestparameter.html
     */
    interface RequestParameterProperty {
        /**
         * `CfnFunction.RequestParameterProperty.Caching`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestparameter.html#sam-function-requestparameter-caching
         */
        readonly caching?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RequestParameterProperty.Required`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-function-requestparameter.html#sam-function-requestparameter-required
         */
        readonly required?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
     */
    interface RouteSettingsProperty {
        /**
         * `CfnFunction.RouteSettingsProperty.DataTraceEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
         */
        readonly dataTraceEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RouteSettingsProperty.DetailedMetricsEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
         */
        readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.RouteSettingsProperty.LoggingLevel`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
         */
        readonly loggingLevel?: string;
        /**
         * `CfnFunction.RouteSettingsProperty.ThrottlingBurstLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
         */
        readonly throttlingBurstLimit?: number;
        /**
         * `CfnFunction.RouteSettingsProperty.ThrottlingRateLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
         */
        readonly throttlingRateLimit?: number;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
     */
    interface S3EventProperty {
        /**
         * `CfnFunction.S3EventProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        readonly bucket: string;
        /**
         * `CfnFunction.S3EventProperty.Events`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        readonly events: string[] | string | cdk.IResolvable;
        /**
         * `CfnFunction.S3EventProperty.Filter`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3
         */
        readonly filter?: CfnFunction.S3NotificationFilterProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    interface S3KeyFilterProperty {
        /**
         * `CfnFunction.S3KeyFilterProperty.Rules`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
         */
        readonly rules: Array<CfnFunction.S3KeyFilterRuleProperty | cdk.IResolvable> | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
     */
    interface S3KeyFilterRuleProperty {
        /**
         * `CfnFunction.S3KeyFilterRuleProperty.Name`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
         */
        readonly name: string;
        /**
         * `CfnFunction.S3KeyFilterRuleProperty.Value`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter-s3key-rules.html
         */
        readonly value: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
        /**
         * `CfnFunction.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly bucket: string;
        /**
         * `CfnFunction.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly key: string;
        /**
         * `CfnFunction.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly version?: number;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
     */
    interface S3NotificationFilterProperty {
        /**
         * `CfnFunction.S3NotificationFilterProperty.S3Key`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-notificationconfiguration-config-filter.html
         */
        readonly s3Key: CfnFunction.S3KeyFilterProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface SAMPolicyTemplateProperty {
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.AMIDescribePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly amiDescribePolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.AWSSecretsManagerGetSecretValuePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly awsSecretsManagerGetSecretValuePolicy?: CfnFunction.SecretArnSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.CloudFormationDescribeStacksPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly cloudFormationDescribeStacksPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.CloudWatchPutMetricPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly cloudWatchPutMetricPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbCrudPolicy?: CfnFunction.TableSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbReadPolicy?: CfnFunction.TableSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBStreamReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbStreamReadPolicy?: CfnFunction.TableStreamSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.DynamoDBWritePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly dynamoDbWritePolicy?: CfnFunction.TableSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.EC2DescribePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly ec2DescribePolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.ElasticsearchHttpPostPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly elasticsearchHttpPostPolicy?: CfnFunction.DomainSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.FilterLogEventsPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly filterLogEventsPolicy?: CfnFunction.LogGroupSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.KMSDecryptPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly kmsDecryptPolicy?: CfnFunction.KeySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.KinesisCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly kinesisCrudPolicy?: CfnFunction.StreamSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.KinesisStreamReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly kinesisStreamReadPolicy?: CfnFunction.StreamSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.LambdaInvokePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly lambdaInvokePolicy?: CfnFunction.FunctionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionDetectOnlyPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionDetectOnlyPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionLabelsPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionLabelsPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionNoDataAccessPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionNoDataAccessPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionReadPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.RekognitionWriteOnlyAccessPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly rekognitionWriteOnlyAccessPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.S3CrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly s3CrudPolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.S3ReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly s3ReadPolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.S3WritePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly s3WritePolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESBulkTemplatedCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesBulkTemplatedCrudPolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesCrudPolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESEmailTemplateCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesEmailTemplateCrudPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SESSendBouncePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sesSendBouncePolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SNSCrudPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly snsCrudPolicy?: CfnFunction.TopicSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SNSPublishMessagePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly snsPublishMessagePolicy?: CfnFunction.TopicSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SQSPollerPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sqsPollerPolicy?: CfnFunction.QueueSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SQSSendMessagePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly sqsSendMessagePolicy?: CfnFunction.QueueSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.SSMParameterReadPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly ssmParameterReadPolicy?: CfnFunction.ParameterNameSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.StepFunctionsExecutionPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stepFunctionsExecutionPolicy?: CfnFunction.StateMachineSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnFunction.SAMPolicyTemplateProperty.VPCAccessPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly vpcAccessPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
     */
    interface SNSEventProperty {
        /**
         * `CfnFunction.SNSEventProperty.Topic`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sns
         */
        readonly topic: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
     */
    interface SQSEventProperty {
        /**
         * `CfnFunction.SQSEventProperty.BatchSize`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        readonly batchSize?: number;
        /**
         * `CfnFunction.SQSEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.SQSEventProperty.Queue`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#sqs
         */
        readonly queue: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
     */
    interface ScheduleEventProperty {
        /**
         * `CfnFunction.ScheduleEventProperty.Description`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly description?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Enabled`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * `CfnFunction.ScheduleEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly input?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Name`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly name?: string;
        /**
         * `CfnFunction.ScheduleEventProperty.Schedule`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly schedule: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface SecretArnSAMPTProperty {
        /**
         * `CfnFunction.SecretArnSAMPTProperty.SecretArn`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly secretArn: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface StateMachineSAMPTProperty {
        /**
         * `CfnFunction.StateMachineSAMPTProperty.StateMachineName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stateMachineName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface StreamSAMPTProperty {
        /**
         * `CfnFunction.StreamSAMPTProperty.StreamName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly streamName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface TableSAMPTProperty {
        /**
         * `CfnFunction.TableSAMPTProperty.TableName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly tableName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface TableStreamSAMPTProperty {
        /**
         * `CfnFunction.TableStreamSAMPTProperty.StreamName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly streamName: string;
        /**
         * `CfnFunction.TableStreamSAMPTProperty.TableName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly tableName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface TopicSAMPTProperty {
        /**
         * `CfnFunction.TopicSAMPTProperty.TopicName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly topicName: string;
    }
}
export declare namespace CfnFunction {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
     */
    interface VpcConfigProperty {
        /**
         * `CfnFunction.VpcConfigProperty.SecurityGroupIds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
         */
        readonly securityGroupIds: string[];
        /**
         * `CfnFunction.VpcConfigProperty.SubnetIds`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lambda-function-vpcconfig.html
         */
        readonly subnetIds: string[];
    }
}
/**
 * Properties for defining a `CfnHttpApi`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
 */
export interface CfnHttpApiProps {
    /**
     * `AWS::Serverless::HttpApi.AccessLogSetting`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly accessLogSetting?: CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.Auth`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly auth?: CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.CorsConfiguration`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly corsConfiguration?: CfnHttpApi.CorsConfigurationObjectProperty | boolean | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.DefaultRouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly defaultRouteSettings?: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.DefinitionBody`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly definitionBody?: any | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.DefinitionUri`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly definitionUri?: CfnHttpApi.S3LocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.Description`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly description?: string;
    /**
     * `AWS::Serverless::HttpApi.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-httpapi.html#sam-httpapi-disableexecuteapiendpoint
     */
    readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.Domain`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly domain?: CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.FailOnWarnings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly failOnWarnings?: boolean | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.RouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly routeSettings?: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.StageName`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly stageName?: string;
    /**
     * `AWS::Serverless::HttpApi.StageVariables`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly stageVariables?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * `AWS::Serverless::HttpApi.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::Serverless::HttpApi`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::HttpApi
 * @stability external
 *
 * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
 */
export declare class CfnHttpApi extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::HttpApi";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHttpApi;
    /**
     * `AWS::Serverless::HttpApi.AccessLogSetting`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    accessLogSetting: CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.Auth`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    auth: CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.CorsConfiguration`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    corsConfiguration: CfnHttpApi.CorsConfigurationObjectProperty | boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.DefaultRouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    defaultRouteSettings: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.DefinitionBody`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    definitionBody: any | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.DefinitionUri`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    definitionUri: CfnHttpApi.S3LocationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.Description`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    description: string | undefined;
    /**
     * `AWS::Serverless::HttpApi.DisableExecuteApiEndpoint`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-httpapi.html#sam-httpapi-disableexecuteapiendpoint
     */
    disableExecuteApiEndpoint: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.Domain`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    domain: CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.FailOnWarnings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    failOnWarnings: boolean | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.RouteSettings`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    routeSettings: CfnHttpApi.RouteSettingsProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.StageName`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    stageName: string | undefined;
    /**
     * `AWS::Serverless::HttpApi.StageVariables`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    stageVariables: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::HttpApi.Tags`
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Serverless::HttpApi`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnHttpApiProps);
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
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html
     */
    interface AccessLogSettingProperty {
        /**
         * `CfnHttpApi.AccessLogSettingProperty.DestinationArn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-destinationarn
         */
        readonly destinationArn?: string;
        /**
         * `CfnHttpApi.AccessLogSettingProperty.Format`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigateway-stage-accesslogsetting.html#cfn-apigateway-stage-accesslogsetting-format
         */
        readonly format?: string;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
     */
    interface CorsConfigurationObjectProperty {
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowCredentials`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowCredentials?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowHeaders`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowHeaders?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowMethods`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowMethods?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.AllowOrigins`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly allowOrigins?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.ExposeHeaders`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly exposeHeaders?: string[];
        /**
         * `CfnHttpApi.CorsConfigurationObjectProperty.MaxAge`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#cors-configuration-object
         */
        readonly maxAge?: number;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapiauth.html
     */
    interface HttpApiAuthProperty {
        /**
         * `CfnHttpApi.HttpApiAuthProperty.Authorizers`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapiauth.html#sam-httpapi-httpapiauth-defaultauthorizer
         */
        readonly authorizers?: any | cdk.IResolvable;
        /**
         * `CfnHttpApi.HttpApiAuthProperty.DefaultAuthorizer`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapiauth.html#sam-httpapi-httpapiauth-authorizers
         */
        readonly defaultAuthorizer?: string;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
     */
    interface HttpApiDomainConfigurationProperty {
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.BasePath`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly basePath?: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.CertificateArn`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly certificateArn: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.DomainName`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly domainName: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.EndpointConfiguration`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly endpointConfiguration?: string;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.MutualTlsAuthentication`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-httpapidomainconfiguration.html#sam-httpapi-httpapidomainconfiguration-mutualtlsauthentication
         */
        readonly mutualTlsAuthentication?: CfnHttpApi.MutualTlsAuthenticationProperty | cdk.IResolvable;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.Route53`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly route53?: CfnHttpApi.Route53ConfigurationProperty | cdk.IResolvable;
        /**
         * `CfnHttpApi.HttpApiDomainConfigurationProperty.SecurityPolicy`
         *
         * @link https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#domain-configuration-object
         */
        readonly securityPolicy?: string;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html
     */
    interface MutualTlsAuthenticationProperty {
        /**
         * `CfnHttpApi.MutualTlsAuthenticationProperty.TruststoreUri`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html#cfn-apigatewayv2-domainname-mutualtlsauthentication-truststoreuri
         */
        readonly truststoreUri?: string;
        /**
         * `CfnHttpApi.MutualTlsAuthenticationProperty.TruststoreVersion`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-domainname-mutualtlsauthentication.html#cfn-apigatewayv2-domainname-mutualtlsauthentication-truststoreversion
         */
        readonly truststoreVersion?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html
     */
    interface Route53ConfigurationProperty {
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.DistributedDomainName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-distributiondomainname
         */
        readonly distributedDomainName?: string;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.EvaluateTargetHealth`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-evaluatetargethealth
         */
        readonly evaluateTargetHealth?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.HostedZoneId`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-hostedzoneid
         */
        readonly hostedZoneId?: string;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.HostedZoneName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-hostedzonename
         */
        readonly hostedZoneName?: string;
        /**
         * `CfnHttpApi.Route53ConfigurationProperty.IpV6`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-httpapi-route53configuration.html#sam-httpapi-route53configuration-ipv6
         */
        readonly ipV6?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html
     */
    interface RouteSettingsProperty {
        /**
         * `CfnHttpApi.RouteSettingsProperty.DataTraceEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-datatraceenabled
         */
        readonly dataTraceEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.RouteSettingsProperty.DetailedMetricsEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-detailedmetricsenabled
         */
        readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;
        /**
         * `CfnHttpApi.RouteSettingsProperty.LoggingLevel`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-logginglevel
         */
        readonly loggingLevel?: string;
        /**
         * `CfnHttpApi.RouteSettingsProperty.ThrottlingBurstLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingburstlimit
         */
        readonly throttlingBurstLimit?: number;
        /**
         * `CfnHttpApi.RouteSettingsProperty.ThrottlingRateLimit`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-apigatewayv2-stage-routesettings.html#cfn-apigatewayv2-stage-routesettings-throttlingratelimit
         */
        readonly throttlingRateLimit?: number;
    }
}
export declare namespace CfnHttpApi {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
        /**
         * `CfnHttpApi.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly bucket: string;
        /**
         * `CfnHttpApi.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly key: string;
        /**
         * `CfnHttpApi.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
         */
        readonly version: number;
    }
}
/**
 * Properties for defining a `CfnLayerVersion`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
export interface CfnLayerVersionProps {
    /**
     * `AWS::Serverless::LayerVersion.CompatibleRuntimes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly compatibleRuntimes?: string[];
    /**
     * `AWS::Serverless::LayerVersion.ContentUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly contentUri?: CfnLayerVersion.S3LocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::LayerVersion.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly description?: string;
    /**
     * `AWS::Serverless::LayerVersion.LayerName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly layerName?: string;
    /**
     * `AWS::Serverless::LayerVersion.LicenseInfo`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly licenseInfo?: string;
    /**
     * `AWS::Serverless::LayerVersion.RetentionPolicy`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    readonly retentionPolicy?: string;
}
/**
 * A CloudFormation `AWS::Serverless::LayerVersion`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::LayerVersion
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
 */
export declare class CfnLayerVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::LayerVersion";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayerVersion;
    /**
     * `AWS::Serverless::LayerVersion.CompatibleRuntimes`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    compatibleRuntimes: string[] | undefined;
    /**
     * `AWS::Serverless::LayerVersion.ContentUri`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    contentUri: CfnLayerVersion.S3LocationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::LayerVersion.Description`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    description: string | undefined;
    /**
     * `AWS::Serverless::LayerVersion.LayerName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    layerName: string | undefined;
    /**
     * `AWS::Serverless::LayerVersion.LicenseInfo`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    licenseInfo: string | undefined;
    /**
     * `AWS::Serverless::LayerVersion.RetentionPolicy`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion
     */
    retentionPolicy: string | undefined;
    /**
     * Create a new `AWS::Serverless::LayerVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnLayerVersionProps);
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
export declare namespace CfnLayerVersion {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
        /**
         * `CfnLayerVersion.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly bucket: string;
        /**
         * `CfnLayerVersion.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly key: string;
        /**
         * `CfnLayerVersion.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly version?: number;
    }
}
/**
 * Properties for defining a `CfnSimpleTable`
 *
 * @struct
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export interface CfnSimpleTableProps {
    /**
     * `AWS::Serverless::SimpleTable.PrimaryKey`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    readonly primaryKey?: CfnSimpleTable.PrimaryKeyProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::SimpleTable.ProvisionedThroughput`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    readonly provisionedThroughput?: CfnSimpleTable.ProvisionedThroughputProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::SimpleTable.SSESpecification`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly sseSpecification?: CfnSimpleTable.SSESpecificationProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::SimpleTable.TableName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly tableName?: string;
    /**
     * `AWS::Serverless::SimpleTable.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::Serverless::SimpleTable`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::SimpleTable
 * @stability external
 *
 * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
 */
export declare class CfnSimpleTable extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::SimpleTable";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimpleTable;
    /**
     * `AWS::Serverless::SimpleTable.PrimaryKey`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    primaryKey: CfnSimpleTable.PrimaryKeyProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::SimpleTable.ProvisionedThroughput`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    provisionedThroughput: CfnSimpleTable.ProvisionedThroughputProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::SimpleTable.SSESpecification`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    sseSpecification: CfnSimpleTable.SSESpecificationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::SimpleTable.TableName`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    tableName: string | undefined;
    /**
     * `AWS::Serverless::SimpleTable.Tags`
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::Serverless::SimpleTable`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnSimpleTableProps);
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
export declare namespace CfnSimpleTable {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
     */
    interface PrimaryKeyProperty {
        /**
         * `CfnSimpleTable.PrimaryKeyProperty.Name`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
         */
        readonly name?: string;
        /**
         * `CfnSimpleTable.PrimaryKeyProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#primary-key-object
         */
        readonly type: string;
    }
}
export declare namespace CfnSimpleTable {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
     */
    interface ProvisionedThroughputProperty {
        /**
         * `CfnSimpleTable.ProvisionedThroughputProperty.ReadCapacityUnits`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
         */
        readonly readCapacityUnits?: number;
        /**
         * `CfnSimpleTable.ProvisionedThroughputProperty.WriteCapacityUnits`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-provisionedthroughput.html
         */
        readonly writeCapacityUnits: number;
    }
}
export declare namespace CfnSimpleTable {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
     */
    interface SSESpecificationProperty {
        /**
         * `CfnSimpleTable.SSESpecificationProperty.SSEEnabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-dynamodb-table-ssespecification.html
         */
        readonly sseEnabled?: boolean | cdk.IResolvable;
    }
}
/**
 * Properties for defining a `CfnStateMachine`
 *
 * @struct
 * @stability external
 *
 * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
 */
export interface CfnStateMachineProps {
    /**
     * `AWS::Serverless::StateMachine.Definition`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly definition?: any | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.DefinitionSubstitutions`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly definitionSubstitutions?: {
        [key: string]: (string);
    } | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.DefinitionUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly definitionUri?: CfnStateMachine.S3LocationProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.Events`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly events?: {
        [key: string]: (CfnStateMachine.EventSourceProperty | cdk.IResolvable);
    } | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.Logging`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly logging?: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.Name`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly name?: string;
    /**
     * `AWS::Serverless::StateMachine.PermissionsBoundaries`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-permissionsboundary
     */
    readonly permissionsBoundaries?: string;
    /**
     * `AWS::Serverless::StateMachine.Policies`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly policies?: Array<CfnStateMachine.IAMPolicyDocumentProperty | CfnStateMachine.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnStateMachine.IAMPolicyDocumentProperty | string | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.Role`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly role?: string;
    /**
     * `AWS::Serverless::StateMachine.Tags`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly tags?: {
        [key: string]: (string);
    };
    /**
     * `AWS::Serverless::StateMachine.Tracing`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-tracing
     */
    readonly tracing?: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable;
    /**
     * `AWS::Serverless::StateMachine.Type`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly type?: string;
}
/**
 * A CloudFormation `AWS::Serverless::StateMachine`
 *
 *
 *
 * @cloudformationResource AWS::Serverless::StateMachine
 * @stability external
 *
 * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
 */
export declare class CfnStateMachine extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::Serverless::StateMachine";
    /**
     * The `Transform` a template must use in order to use this resource
     */
    static readonly REQUIRED_TRANSFORM = "AWS::Serverless-2016-10-31";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachine;
    /**
     * `AWS::Serverless::StateMachine.Definition`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    definition: any | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.DefinitionSubstitutions`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    definitionSubstitutions: {
        [key: string]: (string);
    } | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.DefinitionUri`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    definitionUri: CfnStateMachine.S3LocationProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.Events`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    events: {
        [key: string]: (CfnStateMachine.EventSourceProperty | cdk.IResolvable);
    } | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.Logging`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    logging: CfnStateMachine.LoggingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.Name`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    name: string | undefined;
    /**
     * `AWS::Serverless::StateMachine.PermissionsBoundaries`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-permissionsboundary
     */
    permissionsBoundaries: string | undefined;
    /**
     * `AWS::Serverless::StateMachine.Policies`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    policies: Array<CfnStateMachine.IAMPolicyDocumentProperty | CfnStateMachine.SAMPolicyTemplateProperty | string | cdk.IResolvable> | CfnStateMachine.IAMPolicyDocumentProperty | string | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.Role`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    role: string | undefined;
    /**
     * `AWS::Serverless::StateMachine.Tags`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    readonly tags: cdk.TagManager;
    /**
     * `AWS::Serverless::StateMachine.Tracing`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html#sam-statemachine-tracing
     */
    tracing: CfnStateMachine.TracingConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * `AWS::Serverless::StateMachine.Type`
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html
     */
    type: string | undefined;
    /**
     * Create a new `AWS::Serverless::StateMachine`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnStateMachineProps);
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
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    interface ApiEventProperty {
        /**
         * `CfnStateMachine.ApiEventProperty.Method`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly method: string;
        /**
         * `CfnStateMachine.ApiEventProperty.Path`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly path: string;
        /**
         * `CfnStateMachine.ApiEventProperty.RestApiId`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
         */
        readonly restApiId?: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
     */
    interface CloudWatchEventEventProperty {
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.EventBusName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly eventBusName?: string;
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.Input`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly input?: string;
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.InputPath`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly inputPath?: string;
        /**
         * `CfnStateMachine.CloudWatchEventEventProperty.Pattern`
         *
         * @link http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup.html
     */
    interface CloudWatchLogsLogGroupProperty {
        /**
         * `CfnStateMachine.CloudWatchLogsLogGroupProperty.LogGroupArn`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup.html
         */
        readonly logGroupArn: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
     */
    interface EventBridgeRuleEventProperty {
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.EventBusName`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly eventBusName?: string;
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.Input`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly input?: string;
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.InputPath`
         *
         * @link https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-property-statemachine-cloudwatchevent.html
         */
        readonly inputPath?: string;
        /**
         * `CfnStateMachine.EventBridgeRuleEventProperty.Pattern`
         *
         * @link http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
         */
        readonly pattern: any | cdk.IResolvable;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
     */
    interface EventSourceProperty {
        /**
         * `CfnStateMachine.EventSourceProperty.Properties`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-types
         */
        readonly properties: CfnStateMachine.CloudWatchEventEventProperty | CfnStateMachine.EventBridgeRuleEventProperty | CfnStateMachine.ScheduleEventProperty | CfnStateMachine.ApiEventProperty | cdk.IResolvable;
        /**
         * `CfnStateMachine.EventSourceProperty.Type`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#event-source-object
         */
        readonly type: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface FunctionSAMPTProperty {
        /**
         * `CfnStateMachine.FunctionSAMPTProperty.FunctionName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly functionName: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
     */
    interface IAMPolicyDocumentProperty {
        /**
         * `CfnStateMachine.IAMPolicyDocumentProperty.Statement`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly statement: any | cdk.IResolvable;
        /**
         * `CfnStateMachine.IAMPolicyDocumentProperty.Version`
         *
         * @link http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html
         */
        readonly version: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
     */
    interface LogDestinationProperty {
        /**
         * `CfnStateMachine.LogDestinationProperty.CloudWatchLogsLogGroup`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-logdestination.html#cfn-stepfunctions-statemachine-logdestination-cloudwatchlogsloggroup
         */
        readonly cloudWatchLogsLogGroup: CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
     */
    interface LoggingConfigurationProperty {
        /**
         * `CfnStateMachine.LoggingConfigurationProperty.Destinations`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
         */
        readonly destinations: Array<CfnStateMachine.LogDestinationProperty | cdk.IResolvable> | cdk.IResolvable;
        /**
         * `CfnStateMachine.LoggingConfigurationProperty.IncludeExecutionData`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
         */
        readonly includeExecutionData: boolean | cdk.IResolvable;
        /**
         * `CfnStateMachine.LoggingConfigurationProperty.Level`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-loggingconfiguration.html
         */
        readonly level: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#s3-location-object
     */
    interface S3LocationProperty {
        /**
         * `CfnStateMachine.S3LocationProperty.Bucket`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly bucket: string;
        /**
         * `CfnStateMachine.S3LocationProperty.Key`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly key: string;
        /**
         * `CfnStateMachine.S3LocationProperty.Version`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
         */
        readonly version?: number;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface SAMPolicyTemplateProperty {
        /**
         * `CfnStateMachine.SAMPolicyTemplateProperty.LambdaInvokePolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly lambdaInvokePolicy?: CfnStateMachine.FunctionSAMPTProperty | cdk.IResolvable;
        /**
         * `CfnStateMachine.SAMPolicyTemplateProperty.StepFunctionsExecutionPolicy`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stepFunctionsExecutionPolicy?: CfnStateMachine.StateMachineSAMPTProperty | cdk.IResolvable;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
     */
    interface ScheduleEventProperty {
        /**
         * `CfnStateMachine.ScheduleEventProperty.Input`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly input?: string;
        /**
         * `CfnStateMachine.ScheduleEventProperty.Schedule`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule
         */
        readonly schedule: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
     */
    interface StateMachineSAMPTProperty {
        /**
         * `CfnStateMachine.StateMachineSAMPTProperty.StateMachineName`
         *
         * @link https://github.com/awslabs/serverless-application-model/blob/master/docs/policy_templates.rst
         */
        readonly stateMachineName: string;
    }
}
export declare namespace CfnStateMachine {
    /**
     *
     *
     * @struct
     * @stability external
     *
     * @link https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
     */
    interface TracingConfigurationProperty {
        /**
         * `CfnStateMachine.TracingConfigurationProperty.Enabled`
         *
         * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-stepfunctions-statemachine-tracingconfiguration.html
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}
