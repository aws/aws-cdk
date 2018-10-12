import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './apigateway.generated';
import { Integration } from './integration';
import { Method, MethodOptions } from './method';
import { RestApi } from './restapi';

export interface IRestApiResource {
  /**
   * The rest API that this resource is part of.
   *
   * The reason we need the RestApi object itself and not just the ID is because the model
   * is being tracked by the top-level RestApi object for the purpose of calculating it's
   * hash to determine the ID of the deployment. This allows us to automatically update
   * the deployment when the model of the REST API changes.
   */
  readonly resourceApi: RestApi;

  /**
   * The ID of the resource.
   */
  readonly resourceId: string;

  /**
   * The full path of this resuorce.
   */
  readonly resourcePath: string;

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
   * Defines a new child resource where this resource is the parent.
   * @param pathPart The path part for the child resource
   * @param options Resource options
   * @returns A Resource object
   */
  addResource(pathPart: string, options?: ResourceOptions): Resource;

  /**
   * Adds a greedy proxy resource ("{proxy+}") and an ANY method to this route.
   * @param options Default integration and method options.
   */
  addProxy(options?: ResourceOptions): ProxyResource;

  /**
   * Defines a new method for this resource.
   * @param httpMethod The HTTP method
   * @param target The target backend integration for this method
   * @param options Method options, such as authentication.
   *
   * @returns The newly created `Method` object.
   */
  addMethod(httpMethod: string, target?: Integration, options?: MethodOptions): Method;
}

export interface ResourceOptions {
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
}

export interface ResourceProps extends ResourceOptions {
  /**
   * The parent resource of this resource. You can either pass another
   * `Resource` object or a `RestApi` object here.
   */
  parent: IRestApiResource;

  /**
   * A path name for the resource.
   */
  pathPart: string;
}

export class Resource extends cdk.Construct implements IRestApiResource {
  public readonly resourceApi: RestApi;
  public readonly resourceId: string;
  public readonly resourcePath: string;
  public readonly defaultIntegration?: Integration;
  public readonly defaultMethodOptions?: MethodOptions;

  constructor(parent: cdk.Construct, id: string, props: ResourceProps) {
    super(parent, id);

    validateResourcePathPart(props.pathPart);

    const resourceProps: cloudformation.ResourceProps = {
      restApiId: props.parent.resourceApi.restApiId,
      parentId: props.parent.resourceId,
      pathPart: props.pathPart
    };
    const resource = new cloudformation.Resource(this, 'Resource', resourceProps);

    this.resourceId = resource.resourceId;
    this.resourceApi = props.parent.resourceApi;

    // render resource path (special case for root)
    this.resourcePath = props.parent.resourcePath;
    if (!this.resourcePath.endsWith('/')) { this.resourcePath += '/'; }
    this.resourcePath += props.pathPart;

    const deployment = props.parent.resourceApi.latestDeployment;
    if (deployment) {
      deployment.addDependency(resource);
      deployment.addToLogicalId({ resource: resourceProps });
    }

    // setup defaults based on properties and inherit from parent. method defaults
    // are inherited per property, so children can override piecemeal.
    this.defaultIntegration = props.defaultIntegration || props.parent.defaultIntegration;
    this.defaultMethodOptions = {
      ...props.parent.defaultMethodOptions,
      ...props.defaultMethodOptions
    };
  }

  public addResource(pathPart: string, options?: ResourceOptions): Resource {
    return new Resource(this, pathPart, { parent: this, pathPart, ...options });
  }

  public addMethod(httpMethod: string, integration?: Integration, options?: MethodOptions): Method {
    return new Method(this, httpMethod, { resource: this, httpMethod, integration, options });
  }

  public addProxy(options?: ResourceOptions): ProxyResource {
    return new ProxyResource(this, '{proxy+}', { parent: this, ...options });
  }
}

export interface ProxyResourceProps extends ResourceOptions {
  /**
   * The parent resource of this resource. You can either pass another
   * `Resource` object or a `RestApi` object here.
   */
  parent: IRestApiResource;

  /**
   * Adds an "ANY" method to this resource. If set to `false`, you will have to explicitly
   * add methods to this resource after it's created.
   *
   * @default true
   */
  anyMethod?: boolean;
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

  constructor(parent: cdk.Construct, id: string, props: ProxyResourceProps) {
    super(parent, id, {
      parent: props.parent,
      pathPart: '{proxy+}',
      defaultIntegration: props.defaultIntegration,
      defaultMethodOptions: props.defaultMethodOptions,
    });

    const anyMethod = props.anyMethod !== undefined ? props.anyMethod : true;
    if (anyMethod) {
      this.anyMethod = this.addMethod('ANY');
    }
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
