import { IResource as IResourceBase, Resource as ResourceConstruct } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnResource, CfnResourceProps } from './apigateway.generated';
import { Cors, CorsOptions } from './cors';
import { Integration } from './integration';
import { MockIntegration } from './integrations';
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

export abstract class ResourceBase extends ResourceConstruct implements IResource {
  public abstract readonly parentResource?: IResource;
  /**
   * @deprecated -  Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
   */
  public abstract readonly restApi: RestApi;
  public abstract readonly api: IRestApi;
  public abstract readonly resourceId: string;
  public abstract readonly path: string;
  public abstract readonly defaultIntegration?: Integration;
  public abstract readonly defaultMethodOptions?: MethodOptions;
  public abstract readonly defaultCorsPreflightOptions?: CorsOptions;

  private readonly children: { [pathPart: string]: Resource } = { };

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  public addResource(pathPart: string, options?: ResourceOptions): Resource {
    return new Resource(this, pathPart, { parent: this, pathPart, ...options });
  }

  public addMethod(httpMethod: string, integration?: Integration, options?: MethodOptions): Method {
    return new Method(this, httpMethod, { resource: this, httpMethod, integration, options });
  }

  public addProxy(options?: ProxyResourceOptions): ProxyResource {
    return new ProxyResource(this, '{proxy+}', { parent: this, ...options });
  }

  public addCorsPreflight(options: CorsOptions) {
    const headers: { [name: string]: string } = { };

    //
    // Access-Control-Allow-Headers

    const allowHeaders = options.allowHeaders || Cors.DEFAULT_HEADERS;
    headers['Access-Control-Allow-Headers'] = `'${allowHeaders.join(',')}'`;

    //
    // Access-Control-Allow-Origin

    if (options.allowOrigins.length === 0) {
      throw new Error('allowOrigins must contain at least one origin');
    }

    if (options.allowOrigins.includes('*') && options.allowOrigins.length > 1) {
      throw new Error(`Invalid "allowOrigins" - cannot mix "*" with specific origins: ${options.allowOrigins.join(',')}`);
    }

    // we use the first origin here and if there are more origins in the list, we
    // will match against them in the response velocity template
    const initialOrigin = options.allowOrigins[0];
    headers['Access-Control-Allow-Origin'] = `'${initialOrigin}'`;

    // the "Vary" header is required if we allow a specific origin
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin#CORS_and_caching
    if (initialOrigin !== '*') {
      headers.Vary = '\'Origin\'';
    }

    //
    // Access-Control-Allow-Methods

    let allowMethods = options.allowMethods || Cors.ALL_METHODS;

    if (allowMethods.includes('ANY')) {
      if (allowMethods.length > 1) {
        throw new Error(`ANY cannot be used with any other method. Received: ${allowMethods.join(',')}`);
      }

      allowMethods = Cors.ALL_METHODS;
    }

    headers['Access-Control-Allow-Methods'] = `'${allowMethods.join(',')}'`;

    //
    // Access-Control-Allow-Credentials

    if (options.allowCredentials) {
      headers['Access-Control-Allow-Credentials'] = '\'true\'';
    }

    //
    // Access-Control-Max-Age

    let maxAgeSeconds;

    if (options.maxAge && options.disableCache) {
      throw new Error('The options "maxAge" and "disableCache" are mutually exclusive');
    }

    if (options.maxAge) {
      maxAgeSeconds = options.maxAge.toSeconds();
    }

    if (options.disableCache) {
      maxAgeSeconds = -1;
    }

    if (maxAgeSeconds) {
      headers['Access-Control-Max-Age'] = `'${maxAgeSeconds}'`;
    }

    //
    // Access-Control-Expose-Headers
    //

    if (options.exposeHeaders) {
      headers['Access-Control-Expose-Headers'] = `'${options.exposeHeaders.join(',')}'`;
    }

    //
    // statusCode

    const statusCode = options.statusCode ?? 204;

    //
    // prepare responseParams

    const integrationResponseParams: { [p: string]: string } = { };
    const methodResponseParams: { [p: string]: boolean } = { };

    for (const [name, value] of Object.entries(headers)) {
      const key = `method.response.header.${name}`;
      integrationResponseParams[key] = value;
      methodResponseParams[key] = true;
    }

    return this.addMethod('OPTIONS', new MockIntegration({
      requestTemplates: { 'application/json': '{ statusCode: 200 }' },
      integrationResponses: [
        { statusCode: `${statusCode}`, responseParameters: integrationResponseParams, responseTemplates: renderResponseTemplate() },
      ],
    }), {
      methodResponses: [
        { statusCode: `${statusCode}`, responseParameters: methodResponseParams },
      ],
    });

    // renders the response template to match all possible origins (if we have more than one)
    function renderResponseTemplate() {
      const origins = options.allowOrigins.slice(1);

      if (origins.length === 0) {
        return undefined;
      }

      const template = new Array<string>();

      template.push('#set($origin = $input.params("Origin"))');
      template.push('#if($origin == "") #set($origin = $input.params("origin")) #end');

      const condition = origins.map(o => `$origin.matches("${o}")`).join(' || ');

      template.push(`#if(${condition})`);
      template.push('  #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)');
      template.push('#end');

      return {
        'application/json': template.join('\n'),
      };
    }
  }

  public getResource(pathPart: string): IResource | undefined {
    return this.children[pathPart];
  }

  /**
   * @internal
   */
  public _trackChild(pathPart: string, resource: Resource) {
    this.children[pathPart] = resource;
  }

  public resourceForPath(path: string): Resource {
    if (!path) {
      return this;
    }

    if (path.startsWith('/')) {
      if (this.path !== '/') {
        throw new Error(`Path may start with "/" only for the resource, but we are at: ${this.path}`);
      }

      // trim trailing "/"
      return this.resourceForPath(path.substr(1));
    }

    const parts = path.split('/');
    const next = parts.shift();
    if (!next || next === '') {
      throw new Error('resourceForPath cannot be called with an empty path');
    }

    let resource = this.getResource(next);
    if (!resource) {
      resource = this.addResource(next);
    }

    return resource.resourceForPath(parts.join('/'));
  }

  /**
   * @deprecated - Throws error in some use cases that have been enabled since this deprecation notice. Use `RestApi.urlForPath()` instead.
   */
  public get url(): string {
    return this.restApi.urlForPath(this.path);
  }
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

export class Resource extends ResourceBase {
  /**
   * Import an existing resource
   */
  public static fromResourceAttributes(scope: Construct, id: string, attrs: ResourceAttributes): IResource {
    class Import extends ResourceBase {
      public readonly api = attrs.restApi;
      public readonly resourceId = attrs.resourceId;
      public readonly path = attrs.path;
      public readonly defaultIntegration?: Integration = undefined;
      public readonly defaultMethodOptions?: MethodOptions = undefined;
      public readonly defaultCorsPreflightOptions?: CorsOptions = undefined;

      public get parentResource(): IResource {
        throw new Error('parentResource is not configured for imported resource.');
      }

      public get restApi(): RestApi {
        throw new Error('restApi is not configured for imported resource.');
      }
    }

    return new Import(scope, id);
  }

  public readonly parentResource?: IResource;
  public readonly api: IRestApi;
  public readonly resourceId: string;
  public readonly path: string;

  public readonly defaultIntegration?: Integration;
  public readonly defaultMethodOptions?: MethodOptions;
  public readonly defaultCorsPreflightOptions?: CorsOptions;

  constructor(scope: Construct, id: string, props: ResourceProps) {
    super(scope, id);

    validateResourcePathPart(props.pathPart);

    this.parentResource = props.parent;

    if (props.parent instanceof ResourceBase) {
      props.parent._trackChild(props.pathPart, this);
    }

    const resourceProps: CfnResourceProps = {
      restApiId: props.parent.api.restApiId,
      parentId: props.parent.resourceId,
      pathPart: props.pathPart,
    };
    const resource = new CfnResource(this, 'Resource', resourceProps);

    this.resourceId = resource.ref;
    this.api = props.parent.api;

    // render resource path (special case for root)
    this.path = props.parent.path;
    if (!this.path.endsWith('/')) { this.path += '/'; }
    this.path += props.pathPart;

    const deployment = props.parent.api.latestDeployment;
    if (deployment) {
      deployment.node.addDependency(resource);
      deployment.addToLogicalId({ resource: resourceProps });
    }

    // setup defaults based on properties and inherit from parent. method defaults
    // are inherited per property, so children can override piecemeal.
    this.defaultIntegration = props.defaultIntegration || props.parent.defaultIntegration;
    this.defaultMethodOptions = {
      ...props.parent.defaultMethodOptions,
      ...props.defaultMethodOptions,
    };
    this.defaultCorsPreflightOptions = props.defaultCorsPreflightOptions || props.parent.defaultCorsPreflightOptions;

    if (this.defaultCorsPreflightOptions) {
      this.addCorsPreflight(this.defaultCorsPreflightOptions);
    }
  }

  /**
   * The RestApi associated with this Resource
   * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
   */
  public get restApi(): RestApi {
    if (!this.parentResource) {
      throw new Error('parentResource was unexpectedly not defined');
    }
    return this.parentResource.restApi;
  }
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
export class ProxyResource extends Resource {
  /**
   * If `props.anyMethod` is `true`, this will be the reference to the 'ANY'
   * method associated with this proxy resource.
   */
  public readonly anyMethod?: Method;

  constructor(scope: Construct, id: string, props: ProxyResourceProps) {
    super(scope, id, {
      parent: props.parent,
      pathPart: '{proxy+}',
      defaultIntegration: props.defaultIntegration,
      defaultMethodOptions: props.defaultMethodOptions,
    });

    const anyMethod = props.anyMethod ?? true;
    if (anyMethod) {
      this.anyMethod = this.addMethod('ANY');
    }
  }

  public addMethod(httpMethod: string, integration?: Integration, options?: MethodOptions): Method {
    // In case this proxy is mounted under the root, also add this method to
    // the root so that empty paths are proxied as well.
    if (this.parentResource && this.parentResource.path === '/') {
      // skip if the root resource already has this method defined
      if (!(this.parentResource.node.tryFindChild(httpMethod) instanceof Method)) {
        this.parentResource.addMethod(httpMethod, integration, options);
      }
    }
    return super.addMethod(httpMethod, integration, options);
  }
}

function validateResourcePathPart(part: string) {
  // strip {} which indicate this is a parameter
  if (part.startsWith('{') && part.endsWith('}')) {
    part = part.substr(1, part.length - 2);

    // proxy resources are allowed to end with a '+'
    if (part.endsWith('+')) {
      part = part.substr(0, part.length - 1);
    }
  }

  if (!/^[a-zA-Z0-9\.\_\-]+$/.test(part)) {
    throw new Error(`Resource's path part only allow [a-zA-Z0-9._-], an optional trailing '+'
      and curly braces at the beginning and the end: ${part}`);
  }
}
