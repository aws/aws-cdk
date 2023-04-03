"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestAuthorizer = exports.TokenAuthorizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const apigateway_generated_1 = require("../apigateway.generated");
const authorizer_1 = require("../authorizer");
class LambdaAuthorizer extends authorizer_1.Authorizer {
    constructor(scope, id, props) {
        super(scope, id);
        this.handler = props.handler;
        this.role = props.assumeRole;
        if (props.resultsCacheTtl && props.resultsCacheTtl?.toSeconds() > 3600) {
            throw new Error('Lambda authorizer property \'resultsCacheTtl\' must not be greater than 3600 seconds (1 hour)');
        }
    }
    /**
     * Attaches this authorizer to a specific REST API.
     * @internal
     */
    _attachToApi(restApi) {
        if (this.restApiId && this.restApiId !== restApi.restApiId) {
            throw new Error('Cannot attach authorizer to two different rest APIs');
        }
        this.restApiId = restApi.restApiId;
        const deployment = restApi.latestDeployment;
        const addToLogicalId = core_1.FeatureFlags.of(this).isEnabled(cx_api_1.APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID);
        if (deployment && addToLogicalId) {
            let functionName;
            if (this.handler instanceof lambda.Function) {
                // if not imported, attempt to get the function name, which
                // may be a token
                functionName = this.handler.node.defaultChild.functionName;
            }
            else {
                // if imported, the function name will be a token
                functionName = this.handler.functionName;
            }
            deployment.node.addDependency(this);
            deployment.addToLogicalId({
                authorizer: this.authorizerProps,
                authorizerToken: functionName,
            });
        }
    }
    /**
     * Sets up the permissions necessary for the API Gateway service to invoke the Lambda function.
     */
    setupPermissions() {
        if (!this.role) {
            this.addDefaultPermisionRole();
        }
        else if (iam.Role.isRole(this.role)) {
            this.addLambdaInvokePermission(this.role);
        }
    }
    /**
     * Add Default Permission Role for handler
     */
    addDefaultPermisionRole() {
        this.handler.addPermission(`${core_1.Names.uniqueId(this)}:Permissions`, {
            principal: new iam.ServicePrincipal('apigateway.amazonaws.com'),
            sourceArn: this.authorizerArn,
        });
    }
    /**
     * Add Lambda Invoke Permission for LambdaAurhorizer's role
     */
    addLambdaInvokePermission(role) {
        role.attachInlinePolicy(new iam.Policy(this, 'authorizerInvokePolicy', {
            statements: [
                new iam.PolicyStatement({
                    resources: this.handler.resourceArnsForGrantInvoke,
                    actions: ['lambda:InvokeFunction'],
                }),
            ],
        }));
    }
    /**
     * Returns a token that resolves to the Rest Api Id at the time of synthesis.
     * Throws an error, during token resolution, if no RestApi is attached to this authorizer.
     */
    lazyRestApiId() {
        return core_1.Lazy.string({
            produce: () => {
                if (!this.restApiId) {
                    throw new Error(`Authorizer (${this.node.path}) must be attached to a RestApi`);
                }
                return this.restApiId;
            },
        });
    }
}
/**
 * Token based lambda authorizer that recognizes the caller's identity as a bearer token,
 * such as a JSON Web Token (JWT) or an OAuth token.
 * Based on the token, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
class TokenAuthorizer extends LambdaAuthorizer {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_TokenAuthorizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, TokenAuthorizer);
            }
            throw error;
        }
        const restApiId = this.lazyRestApiId();
        const authorizerProps = {
            name: props.authorizerName ?? core_1.Names.uniqueId(this),
            restApiId,
            type: 'TOKEN',
            authorizerUri: lambdaAuthorizerArn(props.handler),
            authorizerCredentials: props.assumeRole?.roleArn,
            authorizerResultTtlInSeconds: props.resultsCacheTtl?.toSeconds(),
            identitySource: props.identitySource || 'method.request.header.Authorization',
            identityValidationExpression: props.validationRegex,
        };
        this.authorizerProps = authorizerProps;
        const resource = new apigateway_generated_1.CfnAuthorizer(this, 'Resource', authorizerProps);
        this.authorizerId = resource.ref;
        this.authorizerArn = core_1.Stack.of(this).formatArn({
            service: 'execute-api',
            resource: restApiId,
            resourceName: `authorizers/${this.authorizerId}`,
        });
        this.setupPermissions();
    }
}
exports.TokenAuthorizer = TokenAuthorizer;
_a = JSII_RTTI_SYMBOL_1;
TokenAuthorizer[_a] = { fqn: "@aws-cdk/aws-apigateway.TokenAuthorizer", version: "0.0.0" };
/**
 * Request-based lambda authorizer that recognizes the caller's identity via request parameters,
 * such as headers, paths, query strings, stage variables, or context variables.
 * Based on the request, authorization is performed by a lambda function.
 *
 * @resource AWS::ApiGateway::Authorizer
 */
class RequestAuthorizer extends LambdaAuthorizer {
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_RequestAuthorizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, RequestAuthorizer);
            }
            throw error;
        }
        if ((props.resultsCacheTtl === undefined || props.resultsCacheTtl.toSeconds() !== 0) && props.identitySources.length === 0) {
            throw new Error('At least one Identity Source is required for a REQUEST-based Lambda authorizer if caching is enabled.');
        }
        const restApiId = this.lazyRestApiId();
        const authorizerProps = {
            name: props.authorizerName ?? core_1.Names.uniqueId(this),
            restApiId,
            type: 'REQUEST',
            authorizerUri: lambdaAuthorizerArn(props.handler),
            authorizerCredentials: props.assumeRole?.roleArn,
            authorizerResultTtlInSeconds: props.resultsCacheTtl?.toSeconds(),
            identitySource: props.identitySources.map(is => is.toString()).join(','),
        };
        this.authorizerProps = authorizerProps;
        const resource = new apigateway_generated_1.CfnAuthorizer(this, 'Resource', authorizerProps);
        this.authorizerId = resource.ref;
        this.authorizerArn = core_1.Stack.of(this).formatArn({
            service: 'execute-api',
            resource: restApiId,
            resourceName: `authorizers/${this.authorizerId}`,
        });
        this.setupPermissions();
    }
}
exports.RequestAuthorizer = RequestAuthorizer;
_b = JSII_RTTI_SYMBOL_1;
RequestAuthorizer[_b] = { fqn: "@aws-cdk/aws-apigateway.RequestAuthorizer", version: "0.0.0" };
/**
 * constructs the authorizerURIArn.
 */
function lambdaAuthorizerArn(handler) {
    const { region, partition } = core_1.Arn.split(handler.functionArn, core_1.ArnFormat.COLON_RESOURCE_NAME);
    return `arn:${partition}:apigateway:${region}:lambda:path/2015-03-31/functions/${handler.functionArn}/invocations`;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMsd0NBQTJGO0FBQzNGLDRDQUFxRjtBQUVyRixrRUFBNEU7QUFDNUUsOENBQXdEO0FBMEN4RCxNQUFlLGdCQUFpQixTQUFRLHVCQUFVO0lBMkJoRCxZQUFzQixLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE0QjtRQUM5RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFN0IsSUFBSSxLQUFLLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxFQUFFO1lBQ3RFLE1BQU0sSUFBSSxLQUFLLENBQUMsK0ZBQStGLENBQUMsQ0FBQztTQUNsSDtLQUNGO0lBRUQ7OztPQUdHO0lBQ0ksWUFBWSxDQUFDLE9BQWlCO1FBQ25DLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDMUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1NBQ3hFO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBRW5DLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztRQUM1QyxNQUFNLGNBQWMsR0FBRyxtQkFBWSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsMkRBQWtELENBQUMsQ0FBQztRQUUzRyxJQUFJLFVBQVUsSUFBSSxjQUFjLEVBQUU7WUFDaEMsSUFBSSxZQUFZLENBQUM7WUFFakIsSUFBSSxJ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Q0FBQyxXQUFXLGNBQWMsQ0FBQztBQUNySCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXJuLCBBcm5Gb3JtYXQsIER1cmF0aW9uLCBGZWF0dXJlRmxhZ3MsIExhenksIE5hbWVzLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQVBJR0FURVdBWV9BVVRIT1JJWkVSX0NIQU5HRV9ERVBMT1lNRU5UX0xPR0lDQUxfSUQgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5BdXRob3JpemVyLCBDZm5BdXRob3JpemVyUHJvcHMgfSBmcm9tICcuLi9hcGlnYXRld2F5LmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBBdXRob3JpemVyLCBJQXV0aG9yaXplciB9IGZyb20gJy4uL2F1dGhvcml6ZXInO1xuaW1wb3J0IHsgSVJlc3RBcGkgfSBmcm9tICcuLi9yZXN0YXBpJztcblxuXG4vKipcbiAqIEJhc2UgcHJvcGVydGllcyBmb3IgYWxsIGxhbWJkYSBhdXRob3JpemVyc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIExhbWJkYUF1dGhvcml6ZXJQcm9wcyB7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBodW1hbiBmcmllbmRseSBuYW1lIGZvciB0aGUgYXV0aG9yaXplci4gTm90ZSB0aGF0LCB0aGlzIGlzIG5vdCB0aGUgcHJpbWFyeSBpZGVudGlmaWVyIG9mIHRoZSBhdXRob3JpemVyLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSB1bmlxdWUgY29uc3RydWN0IElEXG4gICAqL1xuICByZWFkb25seSBhdXRob3JpemVyTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGhhbmRsZXIgZm9yIHRoZSBhdXRob3JpemVyIGxhbWJkYSBmdW5jdGlvbi5cbiAgICpcbiAgICogVGhlIGhhbmRsZXIgbXVzdCBmb2xsb3cgYSB2ZXJ5IHNwZWNpZmljIHByb3RvY29sIG9uIHRoZSBpbnB1dCBpdCByZWNlaXZlc1xuICAgKiBhbmQgdGhlIG91dHB1dCBpdCBuZWVkcyB0byBwcm9kdWNlLiAgQVBJIEdhdGV3YXkgaGFzIGRvY3VtZW50ZWQgdGhlXG4gICAqIGhhbmRsZXIncyBbaW5wdXQgc3BlY2lmaWNhdGlvbl0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2FwaS1nYXRld2F5LWxhbWJkYS1hdXRob3JpemVyLWlucHV0Lmh0bWwpXG4gICAqIGFuZCBbb3V0cHV0IHNwZWNpZmljYXRpb25dKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9hcGktZ2F0ZXdheS1sYW1iZGEtYXV0aG9yaXplci1vdXRwdXQuaHRtbCkuXG4gICAqL1xuICByZWFkb25seSBoYW5kbGVyOiBsYW1iZGEuSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBIb3cgbG9uZyBBUElHYXRld2F5IHNob3VsZCBjYWNoZSB0aGUgcmVzdWx0cy4gTWF4IDEgaG91ci5cbiAgICogRGlzYWJsZSBjYWNoaW5nIGJ5IHNldHRpbmcgdGhpcyB0byAwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSByZXN1bHRzQ2FjaGVUdGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogQW4gb3B0aW9uYWwgSUFNIHJvbGUgZm9yIEFQSUdhdGV3YXkgdG8gYXNzdW1lIGJlZm9yZSBjYWxsaW5nIHRoZSBMYW1iZGEtYmFzZWQgYXV0aG9yaXplci4gVGhlIElBTSByb2xlIG11c3QgYmVcbiAgICogYXNzdW1hYmxlIGJ5ICdhcGlnYXRld2F5LmFtYXpvbmF3cy5jb20nLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgcmVzb3VyY2UgcG9saWN5wqBpcyBhZGRlZCB0byB0aGUgTGFtYmRhIGZ1bmN0aW9uIGFsbG93aW5nIGFwaWdhdGV3YXkuYW1hem9uYXdzLmNvbSB0byBpbnZva2UgdGhlIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYXNzdW1lUm9sZT86IGlhbS5JUm9sZTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgTGFtYmRhQXV0aG9yaXplciBleHRlbmRzIEF1dGhvcml6ZXIgaW1wbGVtZW50cyBJQXV0aG9yaXplciB7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCBvZiB0aGUgYXV0aG9yaXplci5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGF1dGhvcml6ZXJJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBhdXRob3JpemVyIHRvIGJlIHVzZWQgaW4gcGVybWlzc2lvbiBwb2xpY2llcywgc3VjaCBhcyBJQU0gYW5kIHJlc291cmNlLWJhc2VkIGdyYW50cy5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhdXRob3JpemVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBMYW1iZGEgZnVuY3Rpb24gaGFuZGxlciB0aGF0IHRoaXMgYXV0aG9yaXplciB1c2VzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGhhbmRsZXI6IGxhbWJkYS5JRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSB0aGF0IHRoZSBBUEkgR2F0ZXdheSBzZXJ2aWNlIGFzc3VtZXMgd2hpbGUgaW52b2tpbmcgdGhlIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHByb3RlY3RlZCByZWFkb25seSByb2xlPzogaWFtLklSb2xlO1xuXG4gIHByb3RlY3RlZCByZXN0QXBpSWQ/OiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlYWRvbmx5IGF1dGhvcml6ZXJQcm9wczogQ2ZuQXV0aG9yaXplclByb3BzO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTGFtYmRhQXV0aG9yaXplclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIHRoaXMuaGFuZGxlciA9IHByb3BzLmhhbmRsZXI7XG4gICAgdGhpcy5yb2xlID0gcHJvcHMuYXNzdW1lUm9sZTtcblxuICAgIGlmIChwcm9wcy5yZXN1bHRzQ2FjaGVUdGwgJiYgcHJvcHMucmVzdWx0c0NhY2hlVHRsPy50b1NlY29uZHMoKSA+IDM2MDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTGFtYmRhIGF1dGhvcml6ZXIgcHJvcGVydHkgXFwncmVzdWx0c0NhY2hlVHRsXFwnIG11c3Qgbm90IGJlIGdyZWF0ZXIgdGhhbiAzNjAwIHNlY29uZHMgKDEgaG91ciknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBhdXRob3JpemVyIHRvIGEgc3BlY2lmaWMgUkVTVCBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hdHRhY2hUb0FwaShyZXN0QXBpOiBJUmVzdEFwaSkge1xuICAgIGlmICh0aGlzLnJlc3RBcGlJZCAmJiB0aGlzLnJlc3RBcGlJZCAhPT0gcmVzdEFwaS5yZXN0QXBpSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGF0dGFjaCBhdXRob3JpemVyIHRvIHR3byBkaWZmZXJlbnQgcmVzdCBBUElzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXN0QXBpSWQgPSByZXN0QXBpLnJlc3RBcGlJZDtcblxuICAgIGNvbnN0IGRlcGxveW1lbnQgPSByZXN0QXBpLmxhdGVzdERlcGxveW1lbnQ7XG4gICAgY29uc3QgYWRkVG9Mb2dpY2FsSWQgPSBGZWF0dXJlRmxhZ3Mub2YodGhpcykuaXNFbmFibGVkKEFQSUdBVEVXQVlfQVVUSE9SSVpFUl9DSEFOR0VfREVQTE9ZTUVOVF9MT0dJQ0FMX0lEKTtcblxuICAgIGlmIChkZXBsb3ltZW50ICYmIGFkZFRvTG9naWNhbElkKSB7XG4gICAgICBsZXQgZnVuY3Rpb25OYW1lO1xuXG4gICAgICBpZiAodGhpcy5oYW5kbGVyIGluc3RhbmNlb2YgbGFtYmRhLkZ1bmN0aW9uKSB7XG4gICAgICAgIC8vIGlmIG5vdCBpbXBvcnRlZCwgYXR0ZW1wdCB0byBnZXQgdGhlIGZ1bmN0aW9uIG5hbWUsIHdoaWNoXG4gICAgICAgIC8vIG1heSBiZSBhIHRva2VuXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9ICh0aGlzLmhhbmRsZXIubm9kZS5kZWZhdWx0Q2hpbGQgYXMgbGFtYmRhLkNmbkZ1bmN0aW9uKS5mdW5jdGlvbk5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBpZiBpbXBvcnRlZCwgdGhlIGZ1bmN0aW9uIG5hbWUgd2lsbCBiZSBhIHRva2VuXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9IHRoaXMuaGFuZGxlci5mdW5jdGlvbk5hbWU7XG4gICAgICB9XG5cbiAgICAgIGRlcGxveW1lbnQubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMpO1xuICAgICAgZGVwbG95bWVudC5hZGRUb0xvZ2ljYWxJZCh7XG4gICAgICAgIGF1dGhvcml6ZXI6IHRoaXMuYXV0aG9yaXplclByb3BzLFxuICAgICAgICBhdXRob3JpemVyVG9rZW46IGZ1bmN0aW9uTmFtZSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBwZXJtaXNzaW9ucyBuZWNlc3NhcnkgZm9yIHRoZSBBUEkgR2F0ZXdheSBzZXJ2aWNlIHRvIGludm9rZSB0aGUgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKi9cbiAgcHJvdGVjdGVkIHNldHVwUGVybWlzc2lvbnMoKSB7XG4gICAgaWYgKCF0aGlzLnJvbGUpIHtcbiAgICAgIHRoaXMuYWRkRGVmYXVsdFBlcm1pc2lvblJvbGUoKTtcbiAgICB9IGVsc2UgaWYgKGlhbS5Sb2xlLmlzUm9sZSh0aGlzLnJvbGUpKSB7XG4gICAgICB0aGlzLmFkZExhbWJkYUludm9rZVBlcm1pc3Npb24odGhpcy5yb2xlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIERlZmF1bHQgUGVybWlzc2lvbiBSb2xlIGZvciBoYW5kbGVyXG4gICAqL1xuICBwcml2YXRlIGFkZERlZmF1bHRQZXJtaXNpb25Sb2xlKCkgOnZvaWQge1xuICAgIHRoaXMuaGFuZGxlci5hZGRQZXJtaXNzaW9uKGAke05hbWVzLnVuaXF1ZUlkKHRoaXMpfTpQZXJtaXNzaW9uc2AsIHtcbiAgICAgIHByaW5jaXBhbDogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdhcGlnYXRld2F5LmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIHNvdXJjZUFybjogdGhpcy5hdXRob3JpemVyQXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBMYW1iZGEgSW52b2tlIFBlcm1pc3Npb24gZm9yIExhbWJkYUF1cmhvcml6ZXIncyByb2xlXG4gICAqL1xuICBwcml2YXRlIGFkZExhbWJkYUludm9rZVBlcm1pc3Npb24ocm9sZTogaWFtLlJvbGUpIDp2b2lkIHtcbiAgICByb2xlLmF0dGFjaElubGluZVBvbGljeShuZXcgaWFtLlBvbGljeSh0aGlzLCAnYXV0aG9yaXplckludm9rZVBvbGljeScsIHtcbiAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIHJlc291cmNlczogdGhpcy5oYW5kbGVyLnJlc291cmNlQXJuc0ZvckdyYW50SW52b2tlLFxuICAgICAgICAgIGFjdGlvbnM6IFsnbGFtYmRhOkludm9rZUZ1bmN0aW9uJ10sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHRva2VuIHRoYXQgcmVzb2x2ZXMgdG8gdGhlIFJlc3QgQXBpIElkIGF0IHRoZSB0aW1lIG9mIHN5bnRoZXNpcy5cbiAgICogVGhyb3dzIGFuIGVycm9yLCBkdXJpbmcgdG9rZW4gcmVzb2x1dGlvbiwgaWYgbm8gUmVzdEFwaSBpcyBhdHRhY2hlZCB0byB0aGlzIGF1dGhvcml6ZXIuXG4gICAqL1xuICBwcm90ZWN0ZWQgbGF6eVJlc3RBcGlJZCgpIHtcbiAgICByZXR1cm4gTGF6eS5zdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMucmVzdEFwaUlkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdXRob3JpemVyICgke3RoaXMubm9kZS5wYXRofSkgbXVzdCBiZSBhdHRhY2hlZCB0byBhIFJlc3RBcGlgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZXN0QXBpSWQ7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgVG9rZW5BdXRob3JpemVyXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVG9rZW5BdXRob3JpemVyUHJvcHMgZXh0ZW5kcyBMYW1iZGFBdXRob3JpemVyUHJvcHMge1xuICAvKipcbiAgICogQW4gb3B0aW9uYWwgcmVnZXggdG8gYmUgbWF0Y2hlZCBhZ2FpbnN0IHRoZSBhdXRob3JpemF0aW9uIHRva2VuLiBXaGVuIG1hdGNoZWQgdGhlIGF1dGhvcml6ZXIgbGFtYmRhIGlzIGludm9rZWQsXG4gICAqIG90aGVyd2lzZSBhIDQwMSBVbmF1dGhvcml6ZWQgaXMgcmV0dXJuZWQgdG8gdGhlIGNsaWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyByZWdleCBmaWx0ZXIgd2lsbCBiZSBhcHBsaWVkLlxuICAgKi9cbiAgcmVhZG9ubHkgdmFsaWRhdGlvblJlZ2V4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVxdWVzdCBoZWFkZXIgbWFwcGluZyBleHByZXNzaW9uIGZvciB0aGUgYmVhcmVyIHRva2VuLiBUaGlzIGlzIHR5cGljYWxseSBwYXNzZWQgYXMgcGFydCBvZiB0aGUgaGVhZGVyLCBpbiB3aGljaCBjYXNlXG4gICAqIHRoaXMgc2hvdWxkIGJlIGBtZXRob2QucmVxdWVzdC5oZWFkZXIuQXV0aG9yaXplcmAgd2hlcmUgQXV0aG9yaXplciBpcyB0aGUgaGVhZGVyIGNvbnRhaW5pbmcgdGhlIGJlYXJlciB0b2tlbi5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXBpZ2F0ZXdheS9hcGktcmVmZXJlbmNlL2xpbmstcmVsYXRpb24vYXV0aG9yaXplci1jcmVhdGUvI2lkZW50aXR5U291cmNlXG4gICAqIEBkZWZhdWx0IGBJZGVudGl0eVNvdXJjZS5oZWFkZXIoJ0F1dGhvcml6YXRpb24nKWBcbiAgICovXG4gIHJlYWRvbmx5IGlkZW50aXR5U291cmNlPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIFRva2VuIGJhc2VkIGxhbWJkYSBhdXRob3JpemVyIHRoYXQgcmVjb2duaXplcyB0aGUgY2FsbGVyJ3MgaWRlbnRpdHkgYXMgYSBiZWFyZXIgdG9rZW4sXG4gKiBzdWNoIGFzIGEgSlNPTiBXZWIgVG9rZW4gKEpXVCkgb3IgYW4gT0F1dGggdG9rZW4uXG4gKiBCYXNlZCBvbiB0aGUgdG9rZW4sIGF1dGhvcml6YXRpb24gaXMgcGVyZm9ybWVkIGJ5IGEgbGFtYmRhIGZ1bmN0aW9uLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkFwaUdhdGV3YXk6OkF1dGhvcml6ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFRva2VuQXV0aG9yaXplciBleHRlbmRzIExhbWJkYUF1dGhvcml6ZXIge1xuXG4gIHB1YmxpYyByZWFkb25seSBhdXRob3JpemVySWQ6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgYXV0aG9yaXplckFybjogc3RyaW5nO1xuXG4gIHByb3RlY3RlZCByZWFkb25seSBhdXRob3JpemVyUHJvcHM6IENmbkF1dGhvcml6ZXJQcm9wcztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogVG9rZW5BdXRob3JpemVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHJlc3RBcGlJZCA9IHRoaXMubGF6eVJlc3RBcGlJZCgpO1xuXG4gICAgY29uc3QgYXV0aG9yaXplclByb3BzOiBDZm5BdXRob3JpemVyUHJvcHMgPSB7XG4gICAgICBuYW1lOiBwcm9wcy5hdXRob3JpemVyTmFtZSA/PyBOYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICAgIHJlc3RBcGlJZCxcbiAgICAgIHR5cGU6ICdUT0tFTicsXG4gICAgICBhdXRob3JpemVyVXJpOiBsYW1iZGFBdXRob3JpemVyQXJuKHByb3BzLmhhbmRsZXIpLFxuICAgICAgYXV0aG9yaXplckNyZWRlbnRpYWxzOiBwcm9wcy5hc3N1bWVSb2xlPy5yb2xlQXJuLFxuICAgICAgYXV0aG9yaXplclJlc3VsdFR0bEluU2Vjb25kczogcHJvcHMucmVzdWx0c0NhY2hlVHRsPy50b1NlY29uZHMoKSxcbiAgICAgIGlkZW50aXR5U291cmNlOiBwcm9wcy5pZGVudGl0eVNvdXJjZSB8fCAnbWV0aG9kLnJlcXVlc3QuaGVhZGVyLkF1dGhvcml6YXRpb24nLFxuICAgICAgaWRlbnRpdHlWYWxpZGF0aW9uRXhwcmVzc2lvbjogcHJvcHMudmFsaWRhdGlvblJlZ2V4LFxuICAgIH07XG5cbiAgICB0aGlzLmF1dGhvcml6ZXJQcm9wcyA9IGF1dGhvcml6ZXJQcm9wcztcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkF1dGhvcml6ZXIodGhpcywgJ1Jlc291cmNlJywgYXV0aG9yaXplclByb3BzKTtcblxuICAgIHRoaXMuYXV0aG9yaXplcklkID0gcmVzb3VyY2UucmVmO1xuICAgIHRoaXMuYXV0aG9yaXplckFybiA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnZXhlY3V0ZS1hcGknLFxuICAgICAgcmVzb3VyY2U6IHJlc3RBcGlJZCxcbiAgICAgIHJlc291cmNlTmFtZTogYGF1dGhvcml6ZXJzLyR7dGhpcy5hdXRob3JpemVySWR9YCxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0dXBQZXJtaXNzaW9ucygpO1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgUmVxdWVzdEF1dGhvcml6ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0QXV0aG9yaXplclByb3BzIGV4dGVuZHMgTGFtYmRhQXV0aG9yaXplclByb3BzIHtcbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIHJlcXVlc3QgaGVhZGVyIG1hcHBpbmcgZXhwcmVzc2lvbnMgZm9yIGlkZW50aXRpZXMuIFN1cHBvcnRlZCBwYXJhbWV0ZXIgdHlwZXMgYXJlXG4gICAqIEhlYWRlciwgUXVlcnkgU3RyaW5nLCBTdGFnZSBWYXJpYWJsZSwgYW5kIENvbnRleHQuIEZvciBpbnN0YW5jZSwgZXh0cmFjdGluZyBhbiBhdXRob3JpemF0aW9uXG4gICAqIHRva2VuIGZyb20gYSBoZWFkZXIgd291bGQgdXNlIHRoZSBpZGVudGl0eSBzb3VyY2UgYElkZW50aXR5U291cmNlLmhlYWRlcignQXV0aG9yaXplcicpYC5cbiAgICpcbiAgICogTm90ZTogQVBJIEdhdGV3YXkgdXNlcyB0aGUgc3BlY2lmaWVkIGlkZW50aXR5IHNvdXJjZXMgYXMgdGhlIHJlcXVlc3QgYXV0aG9yaXplciBjYWNoaW5nIGtleS4gV2hlbiBjYWNoaW5nIGlzXG4gICAqIGVuYWJsZWQsIEFQSSBHYXRld2F5IGNhbGxzIHRoZSBhdXRob3JpemVyJ3MgTGFtYmRhIGZ1bmN0aW9uIG9ubHkgYWZ0ZXIgc3VjY2Vzc2Z1bGx5IHZlcmlmeWluZyB0aGF0IGFsbCB0aGVcbiAgICogc3BlY2lmaWVkIGlkZW50aXR5IHNvdXJjZXMgYXJlIHByZXNlbnQgYXQgcnVudGltZS4gSWYgYSBzcGVjaWZpZWQgaWRlbnRpZnkgc291cmNlIGlzIG1pc3NpbmcsIG51bGwsIG9yIGVtcHR5LFxuICAgKiBBUEkgR2F0ZXdheSByZXR1cm5zIGEgNDAxIFVuYXV0aG9yaXplZCByZXNwb25zZSB3aXRob3V0IGNhbGxpbmcgdGhlIGF1dGhvcml6ZXIgTGFtYmRhIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2FwaS1yZWZlcmVuY2UvbGluay1yZWxhdGlvbi9hdXRob3JpemVyLWNyZWF0ZS8jaWRlbnRpdHlTb3VyY2VcbiAgICovXG4gIHJlYWRvbmx5IGlkZW50aXR5U291cmNlczogc3RyaW5nW107XG59XG5cbi8qKlxuICogUmVxdWVzdC1iYXNlZCBsYW1iZGEgYXV0aG9yaXplciB0aGF0IHJlY29nbml6ZXMgdGhlIGNhbGxlcidzIGlkZW50aXR5IHZpYSByZXF1ZXN0IHBhcmFtZXRlcnMsXG4gKiBzdWNoIGFzIGhlYWRlcnMsIHBhdGhzLCBxdWVyeSBzdHJpbmdzLCBzdGFnZSB2YXJpYWJsZXMsIG9yIGNvbnRleHQgdmFyaWFibGVzLlxuICogQmFzZWQgb24gdGhlIHJlcXVlc3QsIGF1dGhvcml6YXRpb24gaXMgcGVyZm9ybWVkIGJ5IGEgbGFtYmRhIGZ1bmN0aW9uLlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkFwaUdhdGV3YXk6OkF1dGhvcml6ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFJlcXVlc3RBdXRob3JpemVyIGV4dGVuZHMgTGFtYmRhQXV0aG9yaXplciB7XG5cbiAgcHVibGljIHJlYWRvbmx5IGF1dGhvcml6ZXJJZDogc3RyaW5nO1xuXG4gIHB1YmxpYyByZWFkb25seSBhdXRob3JpemVyQXJuOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGF1dGhvcml6ZXJQcm9wczogQ2ZuQXV0aG9yaXplclByb3BzO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBSZXF1ZXN0QXV0aG9yaXplclByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBpZiAoKHByb3BzLnJlc3VsdHNDYWNoZVR0bCA9PT0gdW5kZWZpbmVkIHx8IHByb3BzLnJlc3VsdHNDYWNoZVR0bC50b1NlY29uZHMoKSAhPT0gMCkgJiYgcHJvcHMuaWRlbnRpdHlTb3VyY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCBvbmUgSWRlbnRpdHkgU291cmNlIGlzIHJlcXVpcmVkIGZvciBhIFJFUVVFU1QtYmFzZWQgTGFtYmRhIGF1dGhvcml6ZXIgaWYgY2FjaGluZyBpcyBlbmFibGVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3RBcGlJZCA9IHRoaXMubGF6eVJlc3RBcGlJZCgpO1xuXG4gICAgY29uc3QgYXV0aG9yaXplclByb3BzOiBDZm5BdXRob3JpemVyUHJvcHMgPSB7XG4gICAgICBuYW1lOiBwcm9wcy5hdXRob3JpemVyTmFtZSA/PyBOYW1lcy51bmlxdWVJZCh0aGlzKSxcbiAgICAgIHJlc3RBcGlJZCxcbiAgICAgIHR5cGU6ICdSRVFVRVNUJyxcbiAgICAgIGF1dGhvcml6ZXJVcmk6IGxhbWJkYUF1dGhvcml6ZXJBcm4ocHJvcHMuaGFuZGxlciksXG4gICAgICBhdXRob3JpemVyQ3JlZGVudGlhbHM6IHByb3BzLmFzc3VtZVJvbGU/LnJvbGVBcm4sXG4gICAgICBhdXRob3JpemVyUmVzdWx0VHRsSW5TZWNvbmRzOiBwcm9wcy5yZXN1bHRzQ2FjaGVUdGw/LnRvU2Vjb25kcygpLFxuICAgICAgaWRlbnRpdHlTb3VyY2U6IHByb3BzLmlkZW50aXR5U291cmNlcy5tYXAoaXMgPT4gaXMudG9TdHJpbmcoKSkuam9pbignLCcpLFxuICAgIH07XG5cbiAgICB0aGlzLmF1dGhvcml6ZXJQcm9wcyA9IGF1dGhvcml6ZXJQcm9wcztcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmbkF1dGhvcml6ZXIodGhpcywgJ1Jlc291cmNlJywgYXV0aG9yaXplclByb3BzKTtcblxuICAgIHRoaXMuYXV0aG9yaXplcklkID0gcmVzb3VyY2UucmVmO1xuICAgIHRoaXMuYXV0aG9yaXplckFybiA9IFN0YWNrLm9mKHRoaXMpLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnZXhlY3V0ZS1hcGknLFxuICAgICAgcmVzb3VyY2U6IHJlc3RBcGlJZCxcbiAgICAgIHJlc291cmNlTmFtZTogYGF1dGhvcml6ZXJzLyR7dGhpcy5hdXRob3JpemVySWR9YCxcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0dXBQZXJtaXNzaW9ucygpO1xuICB9XG59XG5cbi8qKlxuICogY29uc3RydWN0cyB0aGUgYXV0aG9yaXplclVSSUFybi5cbiAqL1xuZnVuY3Rpb24gbGFtYmRhQXV0aG9yaXplckFybihoYW5kbGVyOiBsYW1iZGEuSUZ1bmN0aW9uKSB7XG4gIGNvbnN0IHsgcmVnaW9uLCBwYXJ0aXRpb24gfSA9IEFybi5zcGxpdCggaGFuZGxlci5mdW5jdGlvbkFybiwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpO1xuICByZXR1cm4gYGFybjoke3BhcnRpdGlvbn06YXBpZ2F0ZXdheToke3JlZ2lvbn06bGFtYmRhOnBhdGgvMjAxNS0wMy0zMS9mdW5jdGlvbnMvJHtoYW5kbGVyLmZ1bmN0aW9uQXJufS9pbnZvY2F0aW9uc2A7XG59XG4iXX0=