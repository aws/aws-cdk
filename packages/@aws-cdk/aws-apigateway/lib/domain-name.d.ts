import * as acm from '@aws-cdk/aws-certificatemanager';
import { IBucket } from '@aws-cdk/aws-s3';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BasePathMapping, BasePathMappingOptions } from './base-path-mapping';
import { EndpointType, IRestApi } from './restapi';
import { IStage } from './stage';
/**
 * Options for creating an api mapping
 */
export interface ApiMappingOptions {
    /**
     * The api path name that callers of the API must provide in the URL after
     * the domain name (e.g. `example.com/base-path`). If you specify this
     * property, it can't be an empty string.
     *
     * If this is undefined, a mapping will be added for the empty path. Any request
     * that does not match a mapping will get sent to the API that has been mapped
     * to the empty path.
     *
     * @default - map requests from the domain root (e.g. `example.com`).
     */
    readonly basePath?: string;
}
/**
 * The minimum version of the SSL protocol that you want API Gateway to use for HTTPS connections.
 */
export declare enum SecurityPolicy {
    /** Cipher suite TLS 1.0 */
    TLS_1_0 = "TLS_1_0",
    /** Cipher suite TLS 1.2 */
    TLS_1_2 = "TLS_1_2"
}
export interface DomainNameOptions {
    /**
     * The custom domain name for your API. Uppercase letters are not supported.
     */
    readonly domainName: string;
    /**
     * The reference to an AWS-managed certificate for use by the edge-optimized
     * endpoint for the domain name. For "EDGE" domain names, the certificate
     * needs to be in the US East (N. Virginia) region.
     */
    readonly certificate: acm.ICertificate;
    /**
     * The type of endpoint for this DomainName.
     * @default REGIONAL
     */
    readonly endpointType?: EndpointType;
    /**
     * The Transport Layer Security (TLS) version + cipher suite for this domain name.
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-domainname.html
     * @default SecurityPolicy.TLS_1_2
     */
    readonly securityPolicy?: SecurityPolicy;
    /**
     * The mutual TLS authentication configuration for a custom domain name.
     * @default - mTLS is not configured.
     */
    readonly mtls?: MTLSConfig;
    /**
     * The base path name that callers of the API must provide in the URL after
     * the domain name (e.g. `example.com/base-path`). If you specify this
     * property, it can't be an empty string.
     *
     * @default - map requests from the domain root (e.g. `example.com`).
     */
    readonly basePath?: string;
}
export interface DomainNameProps extends DomainNameOptions {
    /**
     * If specified, all requests to this domain will be mapped to the production
     * deployment of this API. If you wish to map this domain to multiple APIs
     * with different base paths, use `addBasePathMapping` or `addApiMapping`.
     *
     * @default - you will have to call `addBasePathMapping` to map this domain to
     * API endpoints.
     */
    readonly mapping?: IRestApi;
}
export interface IDomainName extends IResource {
    /**
     * The domain name (e.g. `example.com`)
     *
     * @attribute DomainName
     */
    readonly domainName: string;
    /**
     * The Route53 alias target to use in order to connect a record set to this domain through an alias.
     *
     * @attribute DistributionDomainName,RegionalDomainName
     */
    readonly domainNameAliasDomainName: string;
    /**
     * The Route53 hosted zone ID to use in order to connect a record set to this domain through an alias.
     *
     * @attribute DistributionHostedZoneId,RegionalHostedZoneId
     */
    readonly domainNameAliasHostedZoneId: string;
}
export declare class DomainName extends Resource implements IDomainName {
    /**
     * Imports an existing domain name.
     */
    static fromDomainNameAttributes(scope: Construct, id: string, attrs: DomainNameAttributes): IDomainName;
    readonly domainName: string;
    readonly domainNameAliasDomainName: string;
    readonly domainNameAliasHostedZoneId: string;
    private readonly basePaths;
    private readonly securityPolicy?;
    private readonly endpointType;
    constructor(scope: Construct, id: string, props: DomainNameProps);
    private validateBasePath;
    private isMultiLevel;
    /**
     * Maps this domain to an API endpoint.
     *
     * This uses the BasePathMapping from ApiGateway v1 which does not support multi-level paths.
     *
     * If you need to create a mapping for a multi-level path use `addApiMapping` instead.
     *
     * @param targetApi That target API endpoint, requests will be mapped to the deployment stage.
     * @param options Options for mapping to base path with or without a stage
     */
    addBasePathMapping(targetApi: IRestApi, options?: BasePathMappingOptions): BasePathMapping;
    /**
     * Maps this domain to an API endpoint.
     *
     * This uses the ApiMapping from ApiGatewayV2 which supports multi-level paths, but
     * also only supports:
     * - SecurityPolicy.TLS_1_2
     * - EndpointType.REGIONAL
     *
     * @param targetStage the target API stage.
     * @param options Options for mapping to a stage
     */
    addApiMapping(targetStage: IStage, options?: ApiMappingOptions): void;
    private configureMTLS;
}
export interface DomainNameAttributes {
    /**
     * The domain name (e.g. `example.com`)
     */
    readonly domainName: string;
    /**
     * The Route53 alias target to use in order to connect a record set to this domain through an alias.
     */
    readonly domainNameAliasTarget: string;
    /**
     * The Route53 hosted zone ID to use in order to connect a record set to this domain through an alias.
     */
    readonly domainNameAliasHostedZoneId: string;
}
/**
 * The mTLS authentication configuration for a custom domain name.
 */
export interface MTLSConfig {
    /**
     * The bucket that the trust store is hosted in.
     */
    readonly bucket: IBucket;
    /**
     * The key in S3 to look at for the trust store.
     */
    readonly key: string;
    /**
     *  The version of the S3 object that contains your truststore.
     *  To specify a version, you must have versioning enabled for the S3 bucket.
     *  @default - latest version
     */
    readonly version?: string;
}
