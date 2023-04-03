import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';
import { IRestApi } from './restapi';
/**
 * Represents an OpenAPI definition asset.
 */
export declare abstract class ApiDefinition {
    /**
     * Creates an API definition from a specification file in an S3 bucket
     */
    static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3ApiDefinition;
    /**
     * Create an API definition from an inline object. The inline object must follow the
     * schema of OpenAPI 2.0 or OpenAPI 3.0
     *
     * @example
     *
     *   apigateway.ApiDefinition.fromInline({
     *     openapi: '3.0.2',
     *     paths: {
     *       '/pets': {
     *         get: {
     *           'responses': {
     *             200: {
     *               content: {
     *                 'application/json': {
     *                   schema: {
     *                     $ref: '#/components/schemas/Empty',
     *                   },
     *                 },
     *               },
     *             },
     *           },
     *           'x-amazon-apigateway-integration': {
     *             responses: {
     *               default: {
     *                 statusCode: '200',
     *               },
     *             },
     *             requestTemplates: {
     *               'application/json': '{"statusCode": 200}',
     *             },
     *             passthroughBehavior: 'when_no_match',
     *             type: 'mock',
     *           },
     *         },
     *       },
     *     },
     *     components: {
     *       schemas: {
     *         Empty: {
     *           title: 'Empty Schema',
     *           type: 'object',
     *         },
     *       },
     *     },
     *   });
     */
    static fromInline(definition: any): InlineApiDefinition;
    /**
     * Loads the API specification from a local disk asset.
     */
    static fromAsset(file: string, options?: s3_assets.AssetOptions): AssetApiDefinition;
    /**
     * Called when the specification is initialized to allow this object to bind
     * to the stack, add resources and have fun.
     *
     * @param scope The binding scope. Don't be smart about trying to down-cast or
     * assume it's initialized. You may just use it as a construct scope.
     */
    abstract bind(scope: Construct): ApiDefinitionConfig;
    /**
     * Called after the CFN RestApi resource has been created to allow the Api
     * Definition to bind to it. Specifically it's required to allow assets to add
     * metadata for tooling like SAM CLI to be able to find their origins.
     */
    bindAfterCreate(_scope: Construct, _restApi: IRestApi): void;
}
/**
 * S3 location of the API definition file
 */
export interface ApiDefinitionS3Location {
    /** The S3 bucket */
    readonly bucket: string;
    /** The S3 key */
    readonly key: string;
    /**
     * An optional version
     * @default - latest version
     */
    readonly version?: string;
}
/**
 * Post-Binding Configuration for a CDK construct
 */
export interface ApiDefinitionConfig {
    /**
     * The location of the specification in S3 (mutually exclusive with `inlineDefinition`).
     *
     * @default - API definition is not an S3 location
     */
    readonly s3Location?: ApiDefinitionS3Location;
    /**
     * Inline specification (mutually exclusive with `s3Location`).
     *
     * @default - API definition is not defined inline
     */
    readonly inlineDefinition?: any;
}
/**
 * OpenAPI specification from an S3 archive.
 */
export declare class S3ApiDefinition extends ApiDefinition {
    private key;
    private objectVersion?;
    private bucketName;
    constructor(bucket: s3.IBucket, key: string, objectVersion?: string | undefined);
    bind(_scope: Construct): ApiDefinitionConfig;
}
/**
 * OpenAPI specification from an inline JSON object.
 */
export declare class InlineApiDefinition extends ApiDefinition {
    private definition;
    constructor(definition: any);
    bind(_scope: Construct): ApiDefinitionConfig;
}
/**
 * OpenAPI specification from a local file.
 */
export declare class AssetApiDefinition extends ApiDefinition {
    private readonly path;
    private readonly options;
    private asset?;
    constructor(path: string, options?: s3_assets.AssetOptions);
    bind(scope: Construct): ApiDefinitionConfig;
    bindAfterCreate(scope: Construct, restApi: IRestApi): void;
}
