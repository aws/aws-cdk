import { IResource as IResourceBase, Resource as ResourceConstruct } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CorsOptions } from './cors';
import { Integration } from './integration';
import { Method, MethodOptions } from './method';
import { IRestApi, RestApi } from './restapi';
export interface IResource extends IResourceBase {
    /**
     * The parent of this resource or undefined for the root resource.
     */
    readonly parentResource?: IResource;
    /**
     * The rest API that this resource is part of.
     *
     * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    readonly restApi: RestApi;
    /**
     * The rest API that this resource is part of.
     *
     * The reason we need the RestApi object itself and not just the ID is because the model
     * is being tracked by the top-level RestApi object for the purpose of calculating it's
     * hash to determine the ID of the deployment. This allows us to automatically update
     * the deployment when the model of the REST API changes.
     */
    readonly api: IRestApi;
    /**
     * The ID of the resource.
     * @attribute
     */
    readonly resourceId: string;
    /**
     * The full path of this resource.
     */
    readonly path: string;
    /**
     * An integration to use as a default for all methods created within this
     * API unless an integration is specified.
     */
    readonly defaultIntegration?: Integration;
    /**
     * Method options to use as a default for all methods created within this
     * API unless custom options are specified.
     */
    readonly defaultMethodOptions?: MethodOptions;
    /**
     * Default options for CORS preflight OPTIONS method.
     */
    readonly defaultCorsPreflightOptions?: CorsOptions;
    /**
     * Gets or create all resources leading up to the specified path.
     *
     * - Path may only start with "/" if this method is called on the root resource.
     * - All resources are created using default options.
     *
     * @param path The relative path
     * @returns a new or existing resource.
     */
    resourceForPath(path: string): Resource;
    /**
     * Defines a new child resource where this resource is the parent.
     * @param pathPart The path part for the child resource
     * @param options Resource options
     * @returns A Resource object
     */
    addResource(pathPart: string, options?: ResourceOptions): Resource;
    /**
     * Retrieves a child resource by path part.
     *
     * @param pathPart The path part of the child resource
     * @returns the child resource or undefined if not found
     */
    getResource(pathPart: string): IResource | undefined;
    /**
     * Adds a greedy proxy resource ("{proxy+}") and an ANY method to this route.
     * @param options Default integration and method options.
     */
    addProxy(options?: ProxyResourceOptions): ProxyResource;
    /**
     * Defines a new method for this resource.
     * @param httpMethod The HTTP method
     * @param target The target backend integration for this method
     * @param options Method options, such as authentication.
     *
     * @returns The newly created `Method` object.
     */
    addMethod(httpMethod: string, target?: Integration, options?: MethodOptions): Method;
    /**
     * Adds an OPTIONS method to this resource which responds to Cross-Origin
     * Resource Sharing (CORS) preflight requests.
     *
     * Cross-Origin Resource Sharing (CORS) is a mechanism that uses additional
     * HTTP headers to tell browsers to give a web application running at one
     * origin, access to selected resources from a different origin. A web
     * application executes a cross-origin HTTP request when it requests a
     * resource that has a different origin (domain, protocol, or port) from its
     * own.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
     * @param options CORS options
     * @returns a `Method` object
     */
    addCorsPreflight(options: CorsOptions): Method;
}
export interface ResourceOptions {
    /**
     * An integration to use as a default for all methods created within this
     * API unless an integration is specified.
     *
     * @default - Inherited from parent.
     */
    readonly defaultIntegration?: Integration;
    /**
     * Method options to use as a default for all methods created within this
     * API unless custom options are specified.
     *
     * @default - Inherited from parent.
     */
    readonly defaultMethodOptions?: MethodOptions;
    /**
     * Adds a CORS preflight OPTIONS method to this resource and all child
     * resources.
     *
     * You can add CORS at the resource-level using `addCorsPreflight`.
     *
     * @default - CORS is disabled
     */
    readonly defaultCorsPreflightOptions?: CorsOptions;
}
export interface ResourceProps extends ResourceOptions {
    /**
     * The parent resource of this resource. You can either pass another
     * `Resource` object or a `RestApi` object here.
     */
    readonly parent: IResource;
    /**
     * A path name for the resource.
     */
    readonly pathPart: string;
}
export declare abstract class ResourceBase extends ResourceConstruct implements IResource {
    abstract readonly parentResource?: IResource;
    /**
     * @deprecated -  Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    abstract readonly restApi: RestApi;
    abstract readonly api: IRestApi;
    abstract readonly resourceId: string;
    abstract readonly path: string;
    abstract readonly defaultIntegration?: Integration;
    abstract readonly defaultMethodOptions?: MethodOptions;
    abstract readonly defaultCorsPreflightOptions?: CorsOptions;
    private readonly children;
    constructor(scope: Construct, id: string);
    addResource(pathPart: string, options?: ResourceOptions): Resource;
    addMethod(httpMethod: string, integration?: Integration, options?: MethodOptions): Method;
    addProxy(options?: ProxyResourceOptions): ProxyResource;
    addCorsPreflight(options: CorsOptions): Method;
    getResource(pathPart: string): IResource | undefined;
    /**
     * @internal
     */
    _trackChild(pathPart: string, resource: Resource): void;
    resourceForPath(path: string): Resource;
    /**
     * @deprecated - Throws error in some use cases that have been enabled since this deprecation notice. Use `RestApi.urlForPath()` instead.
     */
    get url(): string;
}
/**
 * Attributes that can be specified when importing a Resource
 */
export interface ResourceAttributes {
    /**
     * The ID of the resource.
     */
    readonly resourceId: string;
    /**
     * The rest API that this resource is part of.
     */
    readonly restApi: IRestApi;
    /**
     * The full path of this resource.
     */
    readonly path: string;
}
export declare class Resource extends ResourceBase {
    /**
     * Import an existing resource
     */
    static fromResourceAttributes(scope: Construct, id: string, attrs: ResourceAttributes): IResource;
    readonly parentResource?: IResource;
    readonly api: IRestApi;
    readonly resourceId: string;
    readonly path: string;
    readonly defaultIntegration?: Integration;
    readonly defaultMethodOptions?: MethodOptions;
    readonly defaultCorsPreflightOptions?: CorsOptions;
    constructor(scope: Construct, id: string, props: ResourceProps);
    /**
     * The RestApi associated with this Resource
     * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    get restApi(): RestApi;
}
export interface ProxyResourceOptions extends ResourceOptions {
    /**
     * Adds an "ANY" method to this resource. If set to `false`, you will have to explicitly
     * add methods to this resource after it's created.
     *
     * @default true
     */
    readonly anyMethod?: boolean;
}
export interface ProxyResourceProps extends ProxyResourceOptions {
    /**
     * The parent resource of this resource. You can either pass another
     * `Resource` object or a `RestApi` object here.
     */
    readonly parent: IResource;
}
/**
 * Defines a {proxy+} greedy resource and an ANY method on a route.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html
 */
export declare class ProxyResource extends Resource {
    /**
     * If `props.anyMethod` is `true`, this will be the reference to the 'ANY'
     * method associated with this proxy resource.
     */
    readonly anyMethod?: Method;
    constructor(scope: Construct, id: string, props: ProxyResourceProps);
    addMethod(httpMethod: string, integration?: Integration, options?: MethodOptions): Method;
}
