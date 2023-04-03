"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyResource = exports.Resource = exports.ResourceBase = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const apigateway_generated_1 = require("./apigateway.generated");
const cors_1 = require("./cors");
const integrations_1 = require("./integrations");
const method_1 = require("./method");
class ResourceBase extends core_1.Resource {
    constructor(scope, id) {
        super(scope, id);
        this.children = {};
    }
    addResource(pathPart, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ResourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addResource);
            }
            throw error;
        }
        return new Resource(this, pathPart, { parent: this, pathPart, ...options });
    }
    addMethod(httpMethod, integration, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_Integration(integration);
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_MethodOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMethod);
            }
            throw error;
        }
        return new method_1.Method(this, httpMethod, { resource: this, httpMethod, integration, options });
    }
    addProxy(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ProxyResourceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addProxy);
            }
            throw error;
        }
        return new ProxyResource(this, '{proxy+}', { parent: this, ...options });
    }
    addCorsPreflight(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CorsOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addCorsPreflight);
            }
            throw error;
        }
        const headers = {};
        //
        // Access-Control-Allow-Headers
        const allowHeaders = options.allowHeaders || cors_1.Cors.DEFAULT_HEADERS;
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
        let allowMethods = options.allowMethods || cors_1.Cors.ALL_METHODS;
        if (allowMethods.includes('ANY')) {
            if (allowMethods.length > 1) {
                throw new Error(`ANY cannot be used with any other method. Received: ${allowMethods.join(',')}`);
            }
            allowMethods = cors_1.Cors.ALL_METHODS;
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
        const integrationResponseParams = {};
        const methodResponseParams = {};
        for (const [name, value] of Object.entries(headers)) {
            const key = `method.response.header.${name}`;
            integrationResponseParams[key] = value;
            methodResponseParams[key] = true;
        }
        return this.addMethod('OPTIONS', new integrations_1.MockIntegration({
            requestTemplates: { 'application/json': '{ statusCode: 200 }' },
            integrationResponses: [
                { statusCode: `${statusCode}`, responseParameters: integrationResponseParams, responseTemplates: renderResponseTemplate() },
            ],
        }), {
            authorizer: {
                authorizerId: '',
                authorizationType: method_1.AuthorizationType.NONE,
            },
            apiKeyRequired: false,
            authorizationType: method_1.AuthorizationType.NONE,
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
            const template = new Array();
            template.push('#set($origin = $input.params().header.get("Origin"))');
            template.push('#if($origin == "") #set($origin = $input.params().header.get("origin")) #end');
            const condition = origins.map(o => `$origin.matches("${o}")`).join(' || ');
            template.push(`#if(${condition})`);
            template.push('  #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin)');
            template.push('#end');
            return {
                'application/json': template.join('\n'),
            };
        }
    }
    getResource(pathPart) {
        return this.children[pathPart];
    }
    /**
     * @internal
     */
    _trackChild(pathPart, resource) {
        this.children[pathPart] = resource;
    }
    resourceForPath(path) {
        if (!path) {
            return this;
        }
        if (path.startsWith('/')) {
            if (this.path !== '/') {
                throw new Error(`Path may start with "/" only for the resource, but we are at: ${this.path}`);
            }
            // trim trailing "/"
            return this.resourceForPath(path.slice(1));
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
    get url() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.ResourceBase#url", "- Throws error in some use cases that have been enabled since this deprecation notice. Use `RestApi.urlForPath()` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "url").get);
            }
            throw error;
        }
        return this.restApi.urlForPath(this.path);
    }
}
exports.ResourceBase = ResourceBase;
_a = JSII_RTTI_SYMBOL_1;
ResourceBase[_a] = { fqn: "@aws-cdk/aws-apigateway.ResourceBase", version: "0.0.0" };
class Resource extends ResourceBase {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Resource);
            }
            throw error;
        }
        validateResourcePathPart(props.pathPart);
        this.parentResource = props.parent;
        if (props.parent instanceof ResourceBase) {
            props.parent._trackChild(props.pathPart, this);
        }
        const resourceProps = {
            restApiId: props.parent.api.restApiId,
            parentId: props.parent.resourceId,
            pathPart: props.pathPart,
        };
        const resource = new apigateway_generated_1.CfnResource(this, 'Resource', resourceProps);
        this.resourceId = resource.ref;
        this.api = props.parent.api;
        // render resource path (special case for root)
        this.path = props.parent.path;
        if (!this.path.endsWith('/')) {
            this.path += '/';
        }
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
     * Import an existing resource
     */
    static fromResourceAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ResourceAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromResourceAttributes);
            }
            throw error;
        }
        class Import extends ResourceBase {
            constructor() {
                super(...arguments);
                this.api = attrs.restApi;
                this.resourceId = attrs.resourceId;
                this.path = attrs.path;
                this.defaultIntegration = undefined;
                this.defaultMethodOptions = undefined;
                this.defaultCorsPreflightOptions = undefined;
            }
            get parentResource() {
                throw new Error('parentResource is not configured for imported resource.');
            }
            get restApi() {
                throw new Error('restApi is not configured for imported resource.');
            }
        }
        return new Import(scope, id);
    }
    /**
     * The RestApi associated with this Resource
     * @deprecated - Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.
     */
    get restApi() {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-apigateway.Resource#restApi", "- Throws an error if this Resource is not associated with an instance of `RestApi`. Use `api` instead.");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, jsiiDeprecationWarnings.getPropertyDescriptor(this, "restApi").get);
            }
            throw error;
        }
        if (!this.parentResource) {
            throw new Error('parentResource was unexpectedly not defined');
        }
        return this.parentResource.restApi;
    }
}
exports.Resource = Resource;
_b = JSII_RTTI_SYMBOL_1;
Resource[_b] = { fqn: "@aws-cdk/aws-apigateway.Resource", version: "0.0.0" };
/**
 * Defines a {proxy+} greedy resource and an ANY method on a route.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-set-up-simple-proxy.html
 */
class ProxyResource extends Resource {
    constructor(scope, id, props) {
        super(scope, id, {
            parent: props.parent,
            pathPart: '{proxy+}',
            defaultIntegration: props.defaultIntegration,
            defaultMethodOptions: props.defaultMethodOptions,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_ProxyResourceProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ProxyResource);
            }
            throw error;
        }
        const anyMethod = props.anyMethod ?? true;
        if (anyMethod) {
            this.anyMethod = this.addMethod('ANY');
        }
    }
    addMethod(httpMethod, integration, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_Integration(integration);
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_MethodOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addMethod);
            }
            throw error;
        }
        // In case this proxy is mounted under the root, also add this method to
        // the root so that empty paths are proxied as well.
        if (this.parentResource && this.parentResource.path === '/') {
            // skip if the root resource already has this method defined
            if (!(this.parentResource.node.tryFindChild(httpMethod) instanceof method_1.Method)) {
                this.parentResource.addMethod(httpMethod, integration, options);
            }
        }
        return super.addMethod(httpMethod, integration, options);
    }
}
exports.ProxyResource = ProxyResource;
_c = JSII_RTTI_SYMBOL_1;
ProxyResource[_c] = { fqn: "@aws-cdk/aws-apigateway.ProxyResource", version: "0.0.0" };
function validateResourcePathPart(part) {
    // strip {} which indicate this is a parameter
    if (part.startsWith('{') && part.endsWith('}')) {
        part = part.slice(1, -1);
        // proxy resources are allowed to end with a '+'
        if (part.endsWith('+')) {
            part = part.slice(0, -1);
        }
    }
    if (!/^[a-zA-Z0-9:\.\_\-]+$/.test(part)) {
        throw new Error(`Resource's path part only allow [a-zA-Z0-9:._-], an optional trailing '+'
      and curly braces at the beginning and the end: ${part}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3Q0FBMEY7QUFFMUYsaUVBQXVFO0FBQ3ZFLGlDQUEyQztBQUUzQyxpREFBaUQ7QUFDakQscUNBQW9FO0FBNEpwRSxNQUFzQixZQUFhLFNBQVEsZUFBaUI7SUFlMUQsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUhGLGFBQVEsR0FBcUMsRUFBRyxDQUFDO0tBSWpFO0lBRU0sV0FBVyxDQUFDLFFBQWdCLEVBQUUsT0FBeUI7Ozs7Ozs7Ozs7UUFDNUQsT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0tBQzdFO0lBRU0sU0FBUyxDQUFDLFVBQWtCLEVBQUUsV0FBeUIsRUFBRSxPQUF1Qjs7Ozs7Ozs7Ozs7UUFDckYsT0FBTyxJQUFJLGVBQU0sQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDM0Y7SUFFTSxRQUFRLENBQUMsT0FBOEI7Ozs7Ozs7Ozs7UUFDNUMsT0FBTyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDMUU7SUFFTSxnQkFBZ0IsQ0FBQyxPQUFvQjs7Ozs7Ozs7OztRQUMxQyxNQUFNLE9BQU8sR0FBK0IsRUFBRyxDQUFDO1FBRWhELEVBQUU7UUFDRiwrQkFBK0I7UUFFL0IsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksSUFBSSxXQUFJLENBQUMsZUFBZSxDQUFD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VUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDOUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekIsZ0RBQWdEO1FBQ2hELElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN0QixJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxQjtLQUNGO0lBRUQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN2QyxNQUFNLElBQUksS0FBSyxDQUFDO3VEQUNtQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQzVEO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElSZXNvdXJjZSBhcyBJUmVzb3VyY2VCYXNlLCBSZXNvdXJjZSBhcyBSZXNvdXJjZUNvbnN0cnVjdCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5SZXNvdXJjZSwgQ2ZuUmVzb3VyY2VQcm9wcyB9IGZyb20gJy4vYXBpZ2F0ZXdheS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQ29ycywgQ29yc09wdGlvbnMgfSBmcm9tICcuL2NvcnMnO1xuaW1wb3J0IHsgSW50ZWdyYXRpb24gfSBmcm9tICcuL2ludGVncmF0aW9uJztcbmltcG9ydCB7IE1vY2tJbnRlZ3JhdGlvbiB9IGZyb20gJy4vaW50ZWdyYXRpb25zJztcbmltcG9ydCB7IE1ldGhvZCwgTWV0aG9kT3B0aW9ucywgQXV0aG9yaXphdGlvblR5cGUgfSBmcm9tICcuL21ldGhvZCc7XG5pbXBvcnQgeyBJUmVzdEFwaSwgUmVzdEFwaSB9IGZyb20gJy4vcmVzdGFwaSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlc291cmNlIGV4dGVuZHMgSVJlc291cmNlQmFzZSB7XG4gIC8qKlxuICAgKiBUaGUgcGFyZW50IG9mIHRoaXMgcmVzb3VyY2Ugb3IgdW5kZWZpbmVkIGZvciB0aGUgcm9vdCByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IHBhcmVudFJlc291cmNlPzogSVJlc291cmNlO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzdCBBUEkgdGhhdCB0aGlzIHJlc291cmNlIGlzIHBhcnQgb2YuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIC0gVGhyb3dzIGFuIGVycm9yIGlmIHRoaXMgUmVzb3VyY2UgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhbiBpbnN0YW5jZSBvZiBgUmVzdEFwaWAuIFVzZSBgYXBpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdEFwaTogUmVzdEFwaTtcblxuICAvKipcbiAgICogVGhlIHJlc3QgQVBJIHRoYXQgdGhpcyByZXNvdXJjZSBpcyBwYXJ0IG9mLlxuICAgKlxuICAgKiBUaGUgcmVhc29uIHdlIG5lZWQgdGhlIFJlc3RBcGkgb2JqZWN0IGl0c2VsZiBhbmQgbm90IGp1c3QgdGhlIElEIGlzIGJlY2F1c2UgdGhlIG1vZGVsXG4gICAqIGlzIGJlaW5nIHRyYWNrZWQgYnkgdGhlIHRvcC1sZXZlbCBSZXN0QXBpIG9iamVjdCBmb3IgdGhlIHB1cnBvc2Ugb2YgY2FsY3VsYXRpbmcgaXQnc1xuICAgKiBoYXNoIHRvIGRldGVybWluZSB0aGUgSUQgb2YgdGhlIGRlcGxveW1lbnQuIFRoaXMgYWxsb3dzIHVzIHRvIGF1dG9tYXRpY2FsbHkgdXBkYXRlXG4gICAqIHRoZSBkZXBsb3ltZW50IHdoZW4gdGhlIG1vZGVsIG9mIHRoZSBSRVNUIEFQSSBjaGFuZ2VzLlxuICAgKi9cbiAgcmVhZG9ubHkgYXBpOiBJUmVzdEFwaTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSByZXNvdXJjZS5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZnVsbCBwYXRoIG9mIHRoaXMgcmVzb3VyY2UuXG4gICAqL1xuICByZWFkb25seSBwYXRoOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIGludGVncmF0aW9uIHRvIHVzZSBhcyBhIGRlZmF1bHQgZm9yIGFsbCBtZXRob2RzIGNyZWF0ZWQgd2l0aGluIHRoaXNcbiAgICogQVBJIHVubGVzcyBhbiBpbnRlZ3JhdGlvbiBpcyBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0SW50ZWdyYXRpb24/OiBJbnRlZ3JhdGlvbjtcblxuICAvKipcbiAgICogTWV0aG9kIG9wdGlvbnMgdG8gdXNlIGFzIGEgZGVmYXVsdCBmb3IgYWxsIG1ldGhvZHMgY3JlYXRlZCB3aXRoaW4gdGhpc1xuICAgKiBBUEkgdW5sZXNzIGN1c3RvbSBvcHRpb25zIGFyZSBzcGVjaWZpZWQuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0TWV0aG9kT3B0aW9ucz86IE1ldGhvZE9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIERlZmF1bHQgb3B0aW9ucyBmb3IgQ09SUyBwcmVmbGlnaHQgT1BUSU9OUyBtZXRob2QuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM/OiBDb3JzT3B0aW9ucztcblxuICAvKipcbiAgICogR2V0cyBvciBjcmVhdGUgYWxsIHJlc291cmNlcyBsZWFkaW5nIHVwIHRvIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAgICpcbiAgICogLSBQYXRoIG1heSBvbmx5IHN0YXJ0IHdpdGggXCIvXCIgaWYgdGhpcyBtZXRob2QgaXMgY2FsbGVkIG9uIHRoZSByb290IHJlc291cmNlLlxuICAgKiAtIEFsbCByZXNvdXJjZXMgYXJlIGNyZWF0ZWQgdXNpbmcgZGVmYXVsdCBvcHRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCBUaGUgcmVsYXRpdmUgcGF0aFxuICAgKiBAcmV0dXJucyBhIG5ldyBvciBleGlzdGluZyByZXNvdXJjZS5cbiAgICovXG4gIHJlc291cmNlRm9yUGF0aChwYXRoOiBzdHJpbmcpOiBSZXNvdXJjZTtcblxuICAvKipcbiAgICogRGVmaW5lcyBhIG5ldyBjaGlsZCByZXNvdXJjZSB3aGVyZSB0aGlzIHJlc291cmNlIGlzIHRoZSBwYXJlbnQuXG4gICAqIEBwYXJhbSBwYXRoUGFydCBUaGUgcGF0aCBwYXJ0IGZvciB0aGUgY2hpbGQgcmVzb3VyY2VcbiAgICogQHBhcmFtIG9wdGlvbnMgUmVzb3VyY2Ugb3B0aW9uc1xuICAgKiBAcmV0dXJucyBBIFJlc291cmNlIG9iamVjdFxuICAgKi9cbiAgYWRkUmVzb3VyY2UocGF0aFBhcnQ6IHN0cmluZywgb3B0aW9ucz86IFJlc291cmNlT3B0aW9ucyk6IFJlc291cmNlO1xuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZXMgYSBjaGlsZCByZXNvdXJjZSBieSBwYXRoIHBhcnQuXG4gICAqXG4gICAqIEBwYXJhbSBwYXRoUGFydCBUaGUgcGF0aCBwYXJ0IG9mIHRoZSBjaGlsZCByZXNvdXJjZVxuICAgKiBAcmV0dXJucyB0aGUgY2hpbGQgcmVzb3VyY2Ugb3IgdW5kZWZpbmVkIGlmIG5vdCBmb3VuZFxuICAgKi9cbiAgZ2V0UmVzb3VyY2UocGF0aFBhcnQ6IHN0cmluZyk6IElSZXNvdXJjZSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQWRkcyBhIGdyZWVkeSBwcm94eSByZXNvdXJjZSAoXCJ7cHJveHkrfVwiKSBhbmQgYW4gQU5ZIG1ldGhvZCB0byB0aGlzIHJvdXRlLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBEZWZhdWx0IGludGVncmF0aW9uIGFuZCBtZXRob2Qgb3B0aW9ucy5cbiAgICovXG4gIGFkZFByb3h5KG9wdGlvbnM/OiBQcm94eVJlc291cmNlT3B0aW9ucyk6IFByb3h5UmVzb3VyY2U7XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYSBuZXcgbWV0aG9kIGZvciB0aGlzIHJlc291cmNlLlxuICAgKiBAcGFyYW0gaHR0cE1ldGhvZCBUaGUgSFRUUCBtZXRob2RcbiAgICogQHBhcmFtIHRhcmdldCBUaGUgdGFyZ2V0IGJhY2tlbmQgaW50ZWdyYXRpb24gZm9yIHRoaXMgbWV0aG9kXG4gICAqIEBwYXJhbSBvcHRpb25zIE1ldGhvZCBvcHRpb25zLCBzdWNoIGFzIGF1dGhlbnRpY2F0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3bHkgY3JlYXRlZCBgTWV0aG9kYCBvYmplY3QuXG4gICAqL1xuICBhZGRNZXRob2QoaHR0cE1ldGhvZDogc3RyaW5nLCB0YXJnZXQ/OiBJbnRlZ3JhdGlvbiwgb3B0aW9ucz86IE1ldGhvZE9wdGlvbnMpOiBNZXRob2Q7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT1BUSU9OUyBtZXRob2QgdG8gdGhpcyByZXNvdXJjZSB3aGljaCByZXNwb25kcyB0byBDcm9zcy1PcmlnaW5cbiAgICogUmVzb3VyY2UgU2hhcmluZyAoQ09SUykgcHJlZmxpZ2h0IHJlcXVlc3RzLlxuICAgKlxuICAgKiBDcm9zcy1PcmlnaW4gUmVzb3VyY2UgU2hhcmluZyAoQ09SUykgaXMgYSBtZWNoYW5pc20gdGhhdCB1c2VzIGFkZGl0aW9uYWxcbiAgICogSFRUUCBoZWFkZXJzIHRvIHRlbGwgYnJvd3NlcnMgdG8gZ2l2ZSBhIHdlYiBhcHBsaWNhdGlvbiBydW5uaW5nIGF0IG9uZVxuICAgKiBvcmlnaW4sIGFjY2VzcyB0byBzZWxlY3RlZCByZXNvdXJjZXMgZnJvbSBhIGRpZmZlcmVudCBvcmlnaW4uIEEgd2ViXG4gICAqIGFwcGxpY2F0aW9uIGV4ZWN1dGVzIGEgY3Jvc3Mtb3JpZ2luIEhUVFAgcmVxdWVzdCB3aGVuIGl0IHJlcXVlc3RzIGFcbiAgICogcmVzb3VyY2UgdGhhdCBoYXMgYSBkaWZmZXJlbnQgb3JpZ2luIChkb21haW4sIHByb3RvY29sLCBvciBwb3J0KSBmcm9tIGl0c1xuICAgKiBvd24uXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSFRUUC9DT1JTXG4gICAqIEBwYXJhbSBvcHRpb25zIENPUlMgb3B0aW9uc1xuICAgKiBAcmV0dXJucyBhIGBNZXRob2RgIG9iamVjdFxuICAgKi9cbiAgYWRkQ29yc1ByZWZsaWdodChvcHRpb25zOiBDb3JzT3B0aW9ucyk6IE1ldGhvZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZU9wdGlvbnMge1xuICAvKipcbiAgICogQW4gaW50ZWdyYXRpb24gdG8gdXNlIGFzIGEgZGVmYXVsdCBmb3IgYWxsIG1ldGhvZHMgY3JlYXRlZCB3aXRoaW4gdGhpc1xuICAgKiBBUEkgdW5sZXNzIGFuIGludGVncmF0aW9uIGlzIHNwZWNpZmllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBJbmhlcml0ZWQgZnJvbSBwYXJlbnQuXG4gICAqL1xuICByZWFkb25seSBkZWZhdWx0SW50ZWdyYXRpb24/OiBJbnRlZ3JhdGlvbjtcblxuICAvKipcbiAgICogTWV0aG9kIG9wdGlvbnMgdG8gdXNlIGFzIGEgZGVmYXVsdCBmb3IgYWxsIG1ldGhvZHMgY3JlYXRlZCB3aXRoaW4gdGhpc1xuICAgKiBBUEkgdW5sZXNzIGN1c3RvbSBvcHRpb25zIGFyZSBzcGVjaWZpZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gSW5oZXJpdGVkIGZyb20gcGFyZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdE1ldGhvZE9wdGlvbnM/OiBNZXRob2RPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgQ09SUyBwcmVmbGlnaHQgT1BUSU9OUyBtZXRob2QgdG8gdGhpcyByZXNvdXJjZSBhbmQgYWxsIGNoaWxkXG4gICAqIHJlc291cmNlcy5cbiAgICpcbiAgICogWW91IGNhbiBhZGQgQ09SUyBhdCB0aGUgcmVzb3VyY2UtbGV2ZWwgdXNpbmcgYGFkZENvcnNQcmVmbGlnaHRgLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIENPUlMgaXMgZGlzYWJsZWRcbiAgICovXG4gIHJlYWRvbmx5IGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucz86IENvcnNPcHRpb25zO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlc291cmNlUHJvcHMgZXh0ZW5kcyBSZXNvdXJjZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhcmVudCByZXNvdXJjZSBvZiB0aGlzIHJlc291cmNlLiBZb3UgY2FuIGVpdGhlciBwYXNzIGFub3RoZXJcbiAgICogYFJlc291cmNlYCBvYmplY3Qgb3IgYSBgUmVzdEFwaWAgb2JqZWN0IGhlcmUuXG4gICAqL1xuICByZWFkb25seSBwYXJlbnQ6IElSZXNvdXJjZTtcblxuICAvKipcbiAgICogQSBwYXRoIG5hbWUgZm9yIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IHBhdGhQYXJ0OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXNvdXJjZUJhc2UgZXh0ZW5kcyBSZXNvdXJjZUNvbnN0cnVjdCBpbXBsZW1lbnRzIElSZXNvdXJjZSB7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBwYXJlbnRSZXNvdXJjZT86IElSZXNvdXJjZTtcbiAgLyoqXG4gICAqIEBkZXByZWNhdGVkIC0gIFRocm93cyBhbiBlcnJvciBpZiB0aGlzIFJlc291cmNlIGlzIG5vdCBhc3NvY2lhdGVkIHdpdGggYW4gaW5zdGFuY2Ugb2YgYFJlc3RBcGlgLiBVc2UgYGFwaWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSByZXN0QXBpOiBSZXN0QXBpO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYXBpOiBJUmVzdEFwaTtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHJlc291cmNlSWQ6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGRlZmF1bHRJbnRlZ3JhdGlvbj86IEludGVncmF0aW9uO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZGVmYXVsdE1ldGhvZE9wdGlvbnM/OiBNZXRob2RPcHRpb25zO1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zPzogQ29yc09wdGlvbnM7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjaGlsZHJlbjogeyBbcGF0aFBhcnQ6IHN0cmluZ106IFJlc291cmNlIH0gPSB7IH07XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gIH1cblxuICBwdWJsaWMgYWRkUmVzb3VyY2UocGF0aFBhcnQ6IHN0cmluZywgb3B0aW9ucz86IFJlc291cmNlT3B0aW9ucyk6IFJlc291cmNlIHtcbiAgICByZXR1cm4gbmV3IFJlc291cmNlKHRoaXMsIHBhdGhQYXJ0LCB7IHBhcmVudDogdGhpcywgcGF0aFBhcnQsIC4uLm9wdGlvbnMgfSk7XG4gIH1cblxuICBwdWJsaWMgYWRkTWV0aG9kKGh0dHBNZXRob2Q6IHN0cmluZywgaW50ZWdyYXRpb24/OiBJbnRlZ3JhdGlvbiwgb3B0aW9ucz86IE1ldGhvZE9wdGlvbnMpOiBNZXRob2Qge1xuICAgIHJldHVybiBuZXcgTWV0aG9kKHRoaXMsIGh0dHBNZXRob2QsIHsgcmVzb3VyY2U6IHRoaXMsIGh0dHBNZXRob2QsIGludGVncmF0aW9uLCBvcHRpb25zIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZFByb3h5KG9wdGlvbnM/OiBQcm94eVJlc291cmNlT3B0aW9ucyk6IFByb3h5UmVzb3VyY2Uge1xuICAgIHJldHVybiBuZXcgUHJveHlSZXNvdXJjZSh0aGlzLCAne3Byb3h5K30nLCB7IHBhcmVudDogdGhpcywgLi4ub3B0aW9ucyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRDb3JzUHJlZmxpZ2h0KG9wdGlvbnM6IENvcnNPcHRpb25zKSB7XG4gICAgY29uc3QgaGVhZGVyczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7IH07XG5cbiAgICAvL1xuICAgIC8vIEFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcblxuICAgIGNvbnN0IGFsbG93SGVhZGVycyA9IG9wdGlvbnMuYWxsb3dIZWFkZXJzIHx8IENvcnMuREVGQVVMVF9IRUFERVJTO1xuICAgIGhlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSA9IGAnJHthbGxvd0hlYWRlcnMuam9pbignLCcpfSdgO1xuXG4gICAgLy9cbiAgICAvLyBBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cblxuICAgIGlmIChvcHRpb25zLmFsbG93T3JpZ2lucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYWxsb3dPcmlnaW5zIG11c3QgY29udGFpbiBhdCBsZWFzdCBvbmUgb3JpZ2luJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuYWxsb3dPcmlnaW5zLmluY2x1ZGVzKCcqJykgJiYgb3B0aW9ucy5hbGxvd09yaWdpbnMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIFwiYWxsb3dPcmlnaW5zXCIgLSBjYW5ub3QgbWl4IFwiKlwiIHdpdGggc3BlY2lmaWMgb3JpZ2luczogJHtvcHRpb25zLmFsbG93T3JpZ2lucy5qb2luKCcsJyl9YCk7XG4gICAgfVxuXG4gICAgLy8gd2UgdXNlIHRoZSBmaXJzdCBvcmlnaW4gaGVyZSBhbmQgaWYgdGhlcmUgYXJlIG1vcmUgb3JpZ2lucyBpbiB0aGUgbGlzdCwgd2VcbiAgICAvLyB3aWxsIG1hdGNoIGFnYWluc3QgdGhlbSBpbiB0aGUgcmVzcG9uc2UgdmVsb2NpdHkgdGVtcGxhdGVcbiAgICBjb25zdCBpbml0aWFsT3JpZ2luID0gb3B0aW9ucy5hbGxvd09yaWdpbnNbMF07XG4gICAgaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJ10gPSBgJyR7aW5pdGlhbE9yaWdpbn0nYDtcblxuICAgIC8vIHRoZSBcIlZhcnlcIiBoZWFkZXIgaXMgcmVxdWlyZWQgaWYgd2UgYWxsb3cgYSBzcGVjaWZpYyBvcmlnaW5cbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9IVFRQL0hlYWRlcnMvQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luI0NPUlNfYW5kX2NhY2hpbmdcbiAgICBpZiAoaW5pdGlhbE9yaWdpbiAhPT0gJyonKSB7XG4gICAgICBoZWFkZXJzLlZhcnkgPSAnXFwnT3JpZ2luXFwnJztcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIEFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcblxuICAgIGxldCBhbGxvd01ldGhvZHMgPSBvcHRpb25zLmFsbG93TWV0aG9kcyB8fCBDb3JzLkFMTF9NRVRIT0RTO1xuXG4gICAgaWYgKGFsbG93TWV0aG9kcy5pbmNsdWRlcygnQU5ZJykpIHtcbiAgICAgIGlmIChhbGxvd01ldGhvZHMubGVuZ3RoID4gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEFOWSBjYW5ub3QgYmUgdXNlZCB3aXRoIGFueSBvdGhlciBtZXRob2QuIFJlY2VpdmVkOiAke2FsbG93TWV0aG9kcy5qb2luKCcsJyl9YCk7XG4gICAgICB9XG5cbiAgICAgIGFsbG93TWV0aG9kcyA9IENvcnMuQUxMX01FVEhPRFM7XG4gICAgfVxuXG4gICAgaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyddID0gYCcke2FsbG93TWV0aG9kcy5qb2luKCcsJyl9J2A7XG5cbiAgICAvL1xuICAgIC8vIEFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXG5cbiAgICBpZiAob3B0aW9ucy5hbGxvd0NyZWRlbnRpYWxzKSB7XG4gICAgICBoZWFkZXJzWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1DcmVkZW50aWFscyddID0gJ1xcJ3RydWVcXCcnO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gQWNjZXNzLUNvbnRyb2wtTWF4LUFnZVxuXG4gICAgbGV0IG1heEFnZVNlY29uZHM7XG5cbiAgICBpZiAob3B0aW9ucy5tYXhBZ2UgJiYgb3B0aW9ucy5kaXNhYmxlQ2FjaGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIG9wdGlvbnMgXCJtYXhBZ2VcIiBhbmQgXCJkaXNhYmxlQ2FjaGVcIiBhcmUgbXV0dWFsbHkgZXhjbHVzaXZlJyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMubWF4QWdlKSB7XG4gICAgICBtYXhBZ2VTZWNvbmRzID0gb3B0aW9ucy5tYXhBZ2UudG9TZWNvbmRzKCk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMuZGlzYWJsZUNhY2hlKSB7XG4gICAgICBtYXhBZ2VTZWNvbmRzID0gLTE7XG4gICAgfVxuXG4gICAgaWYgKG1heEFnZVNlY29uZHMpIHtcbiAgICAgIGhlYWRlcnNbJ0FjY2Vzcy1Db250cm9sLU1heC1BZ2UnXSA9IGAnJHttYXhBZ2VTZWNvbmRzfSdgO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gQWNjZXNzLUNvbnRyb2wtRXhwb3NlLUhlYWRlcnNcbiAgICAvL1xuXG4gICAgaWYgKG9wdGlvbnMuZXhwb3NlSGVhZGVycykge1xuICAgICAgaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtRXhwb3NlLUhlYWRlcnMnXSA9IGAnJHtvcHRpb25zLmV4cG9zZUhlYWRlcnMuam9pbignLCcpfSdgO1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gc3RhdHVzQ29kZVxuXG4gICAgY29uc3Qgc3RhdHVzQ29kZSA9IG9wdGlvbnMuc3RhdHVzQ29kZSA/PyAyMDQ7XG5cbiAgICAvL1xuICAgIC8vIHByZXBhcmUgcmVzcG9uc2VQYXJhbXNcblxuICAgIGNvbnN0IGludGVncmF0aW9uUmVzcG9uc2VQYXJhbXM6IHsgW3A6IHN0cmluZ106IHN0cmluZyB9ID0geyB9O1xuICAgIGNvbnN0IG1ldGhvZFJlc3BvbnNlUGFyYW1zOiB7IFtwOiBzdHJpbmddOiBib29sZWFuIH0gPSB7IH07XG5cbiAgICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoaGVhZGVycykpIHtcbiAgICAgIGNvbnN0IGtleSA9IGBtZXRob2QucmVzcG9uc2UuaGVhZGVyLiR7bmFtZX1gO1xuICAgICAgaW50ZWdyYXRpb25SZXNwb25zZVBhcmFtc1trZXldID0gdmFsdWU7XG4gICAgICBtZXRob2RSZXNwb25zZVBhcmFtc1trZXldID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5hZGRNZXRob2QoJ09QVElPTlMnLCBuZXcgTW9ja0ludGVncmF0aW9uKHtcbiAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHsgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBzdGF0dXNDb2RlOiAyMDAgfScgfSxcbiAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbXG4gICAgICAgIHsgc3RhdHVzQ29kZTogYCR7c3RhdHVzQ29kZX1gLCByZXNwb25zZVBhcmFtZXRlcnM6IGludGVncmF0aW9uUmVzcG9uc2VQYXJhbXMsIHJlc3BvbnNlVGVtcGxhdGVzOiByZW5kZXJSZXNwb25zZVRlbXBsYXRlKCkgfSxcbiAgICAgIF0sXG4gICAgfSksIHtcbiAgICAgIGF1dGhvcml6ZXI6IHtcbiAgICAgICAgYXV0aG9yaXplcklkOiAnJyxcbiAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLk5PTkUsXG4gICAgICB9LFxuICAgICAgYXBpS2V5UmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLk5PTkUsXG4gICAgICBtZXRob2RSZXNwb25zZXM6IFtcbiAgICAgICAgeyBzdGF0dXNDb2RlOiBgJHtzdGF0dXNDb2RlfWAsIHJlc3BvbnNlUGFyYW1ldGVyczogbWV0aG9kUmVzcG9uc2VQYXJhbXMgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyByZW5kZXJzIHRoZSByZXNwb25zZSB0ZW1wbGF0ZSB0byBtYXRjaCBhbGwgcG9zc2libGUgb3JpZ2lucyAoaWYgd2UgaGF2ZSBtb3JlIHRoYW4gb25lKVxuICAgIGZ1bmN0aW9uIHJlbmRlclJlc3BvbnNlVGVtcGxhdGUoKSB7XG4gICAgICBjb25zdCBvcmlnaW5zID0gb3B0aW9ucy5hbGxvd09yaWdpbnMuc2xpY2UoMSk7XG5cbiAgICAgIGlmIChvcmlnaW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgICAgIHRlbXBsYXRlLnB1c2goJyNzZXQoJG9yaWdpbiA9ICRpbnB1dC5wYXJhbXMoKS5oZWFkZXIuZ2V0KFwiT3JpZ2luXCIpKScpO1xuICAgICAgdGVtcGxhdGUucHVzaCgnI2lmKCRvcmlnaW4gPT0gXCJcIikgI3NldCgkb3JpZ2luID0gJGlucHV0LnBhcmFtcygpLmhlYWRlci5nZXQoXCJvcmlnaW5cIikpICNlbmQnKTtcblxuICAgICAgY29uc3QgY29uZGl0aW9uID0gb3JpZ2lucy5tYXAobyA9PiBgJG9yaWdpbi5tYXRjaGVzKFwiJHtvfVwiKWApLmpvaW4oJyB8fCAnKTtcblxuICAgICAgdGVtcGxhdGUucHVzaChgI2lmKCR7Y29uZGl0aW9ufSlgKTtcbiAgICAgIHRlbXBsYXRlLnB1c2goJyAgI3NldCgkY29udGV4dC5yZXNwb25zZU92ZXJyaWRlLmhlYWRlci5BY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW4gPSAkb3JpZ2luKScpO1xuICAgICAgdGVtcGxhdGUucHVzaCgnI2VuZCcpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IHRlbXBsYXRlLmpvaW4oJ1xcbicpLFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0UmVzb3VyY2UocGF0aFBhcnQ6IHN0cmluZyk6IElSZXNvdXJjZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5bcGF0aFBhcnRdO1xuICB9XG5cbiAgLyoqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF90cmFja0NoaWxkKHBhdGhQYXJ0OiBzdHJpbmcsIHJlc291cmNlOiBSZXNvdXJjZSkge1xuICAgIHRoaXMuY2hpbGRyZW5bcGF0aFBhcnRdID0gcmVzb3VyY2U7XG4gIH1cblxuICBwdWJsaWMgcmVzb3VyY2VGb3JQYXRoKHBhdGg6IHN0cmluZyk6IFJlc291cmNlIHtcbiAgICBpZiAoIXBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGlmIChwYXRoLnN0YXJ0c1dpdGgoJy8nKSkge1xuICAgICAgaWYgKHRoaXMucGF0aCAhPT0gJy8nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUGF0aCBtYXkgc3RhcnQgd2l0aCBcIi9cIiBvbmx5IGZvciB0aGUgcmVzb3VyY2UsIGJ1dCB3ZSBhcmUgYXQ6ICR7dGhpcy5wYXRofWApO1xuICAgICAgfVxuXG4gICAgICAvLyB0cmltIHRyYWlsaW5nIFwiL1wiXG4gICAgICByZXR1cm4gdGhpcy5yZXNvdXJjZUZvclBhdGgocGF0aC5zbGljZSgxKSk7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgbmV4dCA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgaWYgKCFuZXh0IHx8IG5leHQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Jlc291cmNlRm9yUGF0aCBjYW5ub3QgYmUgY2FsbGVkIHdpdGggYW4gZW1wdHkgcGF0aCcpO1xuICAgIH1cblxuICAgIGxldCByZXNvdXJjZSA9IHRoaXMuZ2V0UmVzb3VyY2UobmV4dCk7XG4gICAgaWYgKCFyZXNvdXJjZSkge1xuICAgICAgcmVzb3VyY2UgPSB0aGlzLmFkZFJlc291cmNlKG5leHQpO1xuICAgIH1cblxuICAgIHJldHVybiByZXNvdXJjZS5yZXNvdXJjZUZvclBhdGgocGFydHMuam9pbignLycpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAZGVwcmVjYXRlZCAtIFRocm93cyBlcnJvciBpbiBzb21lIHVzZSBjYXNlcyB0aGF0IGhhdmUgYmVlbiBlbmFibGVkIHNpbmNlIHRoaXMgZGVwcmVjYXRpb24gbm90aWNlLiBVc2UgYFJlc3RBcGkudXJsRm9yUGF0aCgpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIGdldCB1cmwoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5yZXN0QXBpLnVybEZvclBhdGgodGhpcy5wYXRoKTtcbiAgfVxufVxuXG4vKipcbiAqIEF0dHJpYnV0ZXMgdGhhdCBjYW4gYmUgc3BlY2lmaWVkIHdoZW4gaW1wb3J0aW5nIGEgUmVzb3VyY2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXNvdXJjZUF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IHJlc291cmNlSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlc3QgQVBJIHRoYXQgdGhpcyByZXNvdXJjZSBpcyBwYXJ0IG9mLlxuICAgKi9cbiAgcmVhZG9ubHkgcmVzdEFwaTogSVJlc3RBcGk7XG5cbiAgLyoqXG4gICAqIFRoZSBmdWxsIHBhdGggb2YgdGhpcyByZXNvdXJjZS5cbiAgICovXG4gIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2VCYXNlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyByZXNvdXJjZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmVzb3VyY2VBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBSZXNvdXJjZUF0dHJpYnV0ZXMpOiBJUmVzb3VyY2Uge1xuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIFJlc291cmNlQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYXBpID0gYXR0cnMucmVzdEFwaTtcbiAgICAgIHB1YmxpYyByZWFkb25seSByZXNvdXJjZUlkID0gYXR0cnMucmVzb3VyY2VJZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBwYXRoID0gYXR0cnMucGF0aDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0SW50ZWdyYXRpb24/OiBJbnRlZ3JhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkZWZhdWx0TWV0aG9kT3B0aW9ucz86IE1ldGhvZE9wdGlvbnMgPSB1bmRlZmluZWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zPzogQ29yc09wdGlvbnMgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHB1YmxpYyBnZXQgcGFyZW50UmVzb3VyY2UoKTogSVJlc291cmNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJlbnRSZXNvdXJjZSBpcyBub3QgY29uZmlndXJlZCBmb3IgaW1wb3J0ZWQgcmVzb3VyY2UuJyk7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyBnZXQgcmVzdEFwaSgpOiBSZXN0QXBpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZXN0QXBpIGlzIG5vdCBjb25maWd1cmVkIGZvciBpbXBvcnRlZCByZXNvdXJjZS4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHBhcmVudFJlc291cmNlPzogSVJlc291cmNlO1xuICBwdWJsaWMgcmVhZG9ubHkgYXBpOiBJUmVzdEFwaTtcbiAgcHVibGljIHJlYWRvbmx5IHJlc291cmNlSWQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgZGVmYXVsdEludGVncmF0aW9uPzogSW50ZWdyYXRpb247XG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0TWV0aG9kT3B0aW9ucz86IE1ldGhvZE9wdGlvbnM7XG4gIHB1YmxpYyByZWFkb25seSBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM/OiBDb3JzT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVzb3VyY2VQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB2YWxpZGF0ZVJlc291cmNlUGF0aFBhcnQocHJvcHMucGF0aFBhcnQpO1xuXG4gICAgdGhpcy5wYXJlbnRSZXNvdXJjZSA9IHByb3BzLnBhcmVudDtcblxuICAgIGlmIChwcm9wcy5wYXJlbnQgaW5zdGFuY2VvZiBSZXNvdXJjZUJhc2UpIHtcbiAgICAgIHByb3BzLnBhcmVudC5fdHJhY2tDaGlsZChwcm9wcy5wYXRoUGFydCwgdGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb3VyY2VQcm9wczogQ2ZuUmVzb3VyY2VQcm9wcyA9IHtcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMucGFyZW50LmFwaS5yZXN0QXBpSWQsXG4gICAgICBwYXJlbnRJZDogcHJvcHMucGFyZW50LnJlc291cmNlSWQsXG4gICAgICBwYXRoUGFydDogcHJvcHMucGF0aFBhcnQsXG4gICAgfTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZSh0aGlzLCAnUmVzb3VyY2UnLCByZXNvdXJjZVByb3BzKTtcblxuICAgIHRoaXMucmVzb3VyY2VJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmFwaSA9IHByb3BzLnBhcmVudC5hcGk7XG5cbiAgICAvLyByZW5kZXIgcmVzb3VyY2UgcGF0aCAoc3BlY2lhbCBjYXNlIGZvciByb290KVxuICAgIHRoaXMucGF0aCA9IHByb3BzLnBhcmVudC5wYXRoO1xuICAgIGlmICghdGhpcy5wYXRoLmVuZHNXaXRoKCcvJykpIHsgdGhpcy5wYXRoICs9ICcvJzsgfVxuICAgIHRoaXMucGF0aCArPSBwcm9wcy5wYXRoUGFydDtcblxuICAgIGNvbnN0IGRlcGxveW1lbnQgPSBwcm9wcy5wYXJlbnQuYXBpLmxhdGVzdERlcGxveW1lbnQ7XG4gICAgaWYgKGRlcGxveW1lbnQpIHtcbiAgICAgIGRlcGxveW1lbnQubm9kZS5hZGREZXBlbmRlbmN5KHJlc291cmNlKTtcbiAgICAgIGRlcGxveW1lbnQuYWRkVG9Mb2dpY2FsSWQoeyByZXNvdXJjZTogcmVzb3VyY2VQcm9wcyB9KTtcbiAgICB9XG5cbiAgICAvLyBzZXR1cCBkZWZhdWx0cyBiYXNlZCBvbiBwcm9wZXJ0aWVzIGFuZCBpbmhlcml0IGZyb20gcGFyZW50LiBtZXRob2QgZGVmYXVsdHNcbiAgICAvLyBhcmUgaW5oZXJpdGVkIHBlciBwcm9wZXJ0eSwgc28gY2hpbGRyZW4gY2FuIG92ZXJyaWRlIHBpZWNlbWVhbC5cbiAgICB0aGlzLmRlZmF1bHRJbnRlZ3JhdGlvbiA9IHByb3BzLmRlZmF1bHRJbnRlZ3JhdGlvbiB8fCBwcm9wcy5wYXJlbnQuZGVmYXVsdEludGVncmF0aW9uO1xuICAgIHRoaXMuZGVmYXVsdE1ldGhvZE9wdGlvbnMgPSB7XG4gICAgICAuLi5wcm9wcy5wYXJlbnQuZGVmYXVsdE1ldGhvZE9wdGlvbnMsXG4gICAgICAuLi5wcm9wcy5kZWZhdWx0TWV0aG9kT3B0aW9ucyxcbiAgICB9O1xuICAgIHRoaXMuZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zID0gcHJvcHMuZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zIHx8IHByb3BzLnBhcmVudC5kZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM7XG5cbiAgICBpZiAodGhpcy5kZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuYWRkQ29yc1ByZWZsaWdodCh0aGlzLmRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBSZXN0QXBpIGFzc29jaWF0ZWQgd2l0aCB0aGlzIFJlc291cmNlXG4gICAqIEBkZXByZWNhdGVkIC0gVGhyb3dzIGFuIGVycm9yIGlmIHRoaXMgUmVzb3VyY2UgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhbiBpbnN0YW5jZSBvZiBgUmVzdEFwaWAuIFVzZSBgYXBpYCBpbnN0ZWFkLlxuICAgKi9cbiAgcHVibGljIGdldCByZXN0QXBpKCk6IFJlc3RBcGkge1xuICAgIGlmICghdGhpcy5wYXJlbnRSZXNvdXJjZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdwYXJlbnRSZXNvdXJjZSB3YXMgdW5leHBlY3RlZGx5IG5vdCBkZWZpbmVkJyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnBhcmVudFJlc291cmNlLnJlc3RBcGk7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm94eVJlc291cmNlT3B0aW9ucyBleHRlbmRzIFJlc291cmNlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBZGRzIGFuIFwiQU5ZXCIgbWV0aG9kIHRvIHRoaXMgcmVzb3VyY2UuIElmIHNldCB0byBgZmFsc2VgLCB5b3Ugd2lsbCBoYXZlIHRvIGV4cGxpY2l0bHlcbiAgICogYWRkIG1ldGhvZHMgdG8gdGhpcyByZXNvdXJjZSBhZnRlciBpdCdzIGNyZWF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGFueU1ldGhvZD86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJveHlSZXNvdXJjZVByb3BzIGV4dGVuZHMgUHJveHlSZXNvdXJjZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHBhcmVudCByZXNvdXJjZSBvZiB0aGlzIHJlc291cmNlLiBZb3UgY2FuIGVpdGhlciBwYXNzIGFub3RoZXJcbiAgICogYFJlc291cmNlYCBvYmplY3Qgb3IgYSBgUmVzdEFwaWAgb2JqZWN0IGhlcmUuXG4gICAqL1xuICByZWFkb25seSBwYXJlbnQ6IElSZXNvdXJjZTtcbn1cblxuLyoqXG4gKiBEZWZpbmVzIGEge3Byb3h5K30gZ3JlZWR5IHJlc291cmNlIGFuZCBhbiBBTlkgbWV0aG9kIG9uIGEgcm91dGUuXG4gKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGktZ2F0ZXdheS1zZXQtdXAtc2ltcGxlLXByb3h5Lmh0bWxcbiAqL1xuZXhwb3J0IGNsYXNzIFByb3h5UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBJZiBgcHJvcHMuYW55TWV0aG9kYCBpcyBgdHJ1ZWAsIHRoaXMgd2lsbCBiZSB0aGUgcmVmZXJlbmNlIHRvIHRoZSAnQU5ZJ1xuICAgKiBtZXRob2QgYXNzb2NpYXRlZCB3aXRoIHRoaXMgcHJveHkgcmVzb3VyY2UuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYW55TWV0aG9kPzogTWV0aG9kO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQcm94eVJlc291cmNlUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBhcmVudDogcHJvcHMucGFyZW50LFxuICAgICAgcGF0aFBhcnQ6ICd7cHJveHkrfScsXG4gICAgICBkZWZhdWx0SW50ZWdyYXRpb246IHByb3BzLmRlZmF1bHRJbnRlZ3JhdGlvbixcbiAgICAgIGRlZmF1bHRNZXRob2RPcHRpb25zOiBwcm9wcy5kZWZhdWx0TWV0aG9kT3B0aW9ucyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFueU1ldGhvZCA9IHByb3BzLmFueU1ldGhvZCA/PyB0cnVlO1xuICAgIGlmIChhbnlNZXRob2QpIHtcbiAgICAgIHRoaXMuYW55TWV0aG9kID0gdGhpcy5hZGRNZXRob2QoJ0FOWScpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRNZXRob2QoaHR0cE1ldGhvZDogc3RyaW5nLCBpbnRlZ3JhdGlvbj86IEludGVncmF0aW9uLCBvcHRpb25zPzogTWV0aG9kT3B0aW9ucyk6IE1ldGhvZCB7XG4gICAgLy8gSW4gY2FzZSB0aGlzIHByb3h5IGlzIG1vdW50ZWQgdW5kZXIgdGhlIHJvb3QsIGFsc28gYWRkIHRoaXMgbWV0aG9kIHRvXG4gICAgLy8gdGhlIHJvb3Qgc28gdGhhdCBlbXB0eSBwYXRocyBhcmUgcHJveGllZCBhcyB3ZWxsLlxuICAgIGlmICh0aGlzLnBhcmVudFJlc291cmNlICYmIHRoaXMucGFyZW50UmVzb3VyY2UucGF0aCA9PT0gJy8nKSB7XG4gICAgICAvLyBza2lwIGlmIHRoZSByb290IHJlc291cmNlIGFscmVhZHkgaGFzIHRoaXMgbWV0aG9kIGRlZmluZWRcbiAgICAgIGlmICghKHRoaXMucGFyZW50UmVzb3VyY2Uubm9kZS50cnlGaW5kQ2hpbGQoaHR0cE1ldGhvZCkgaW5zdGFuY2VvZiBNZXRob2QpKSB7XG4gICAgICAgIHRoaXMucGFyZW50UmVzb3VyY2UuYWRkTWV0aG9kKGh0dHBNZXRob2QsIGludGVncmF0aW9uLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLmFkZE1ldGhvZChodHRwTWV0aG9kLCBpbnRlZ3JhdGlvbiwgb3B0aW9ucyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVSZXNvdXJjZVBhdGhQYXJ0KHBhcnQ6IHN0cmluZykge1xuICAvLyBzdHJpcCB7fSB3aGljaCBpbmRpY2F0ZSB0aGlzIGlzIGEgcGFyYW1ldGVyXG4gIGlmIChwYXJ0LnN0YXJ0c1dpdGgoJ3snKSAmJiBwYXJ0LmVuZHNXaXRoKCd9JykpIHtcbiAgICBwYXJ0ID0gcGFydC5zbGljZSgxLCAtMSk7XG5cbiAgICAvLyBwcm94eSByZXNvdXJjZXMgYXJlIGFsbG93ZWQgdG8gZW5kIHdpdGggYSAnKydcbiAgICBpZiAocGFydC5lbmRzV2l0aCgnKycpKSB7XG4gICAgICBwYXJ0ID0gcGFydC5zbGljZSgwLCAtMSk7XG4gICAgfVxuICB9XG5cbiAgaWYgKCEvXlthLXpBLVowLTk6XFwuXFxfXFwtXSskLy50ZXN0KHBhcnQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBSZXNvdXJjZSdzIHBhdGggcGFydCBvbmx5IGFsbG93IFthLXpBLVowLTk6Ll8tXSwgYW4gb3B0aW9uYWwgdHJhaWxpbmcgJysnXG4gICAgICBhbmQgY3VybHkgYnJhY2VzIGF0IHRoZSBiZWdpbm5pbmcgYW5kIHRoZSBlbmQ6ICR7cGFydH1gKTtcbiAgfVxufVxuIl19