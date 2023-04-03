"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoUserPoolsAuthorizer = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const apigateway_generated_1 = require("../apigateway.generated");
const authorizer_1 = require("../authorizer");
const method_1 = require("../method");
/**
 * Cognito user pools based custom authorizer
 *
 * @resource AWS::ApiGateway::Authorizer
 */
class CognitoUserPoolsAuthorizer extends authorizer_1.Authorizer {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_apigateway_CognitoUserPoolsAuthorizerProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CognitoUserPoolsAuthorizer);
            }
            throw error;
        }
        const restApiId = this.lazyRestApiId();
        const authorizerProps = {
            name: props.authorizerName ?? core_1.Names.uniqueId(this),
            restApiId,
            type: 'COGNITO_USER_POOLS',
            providerArns: props.cognitoUserPools.map(userPool => userPool.userPoolArn),
            authorizerResultTtlInSeconds: props.resultsCacheTtl?.toSeconds(),
            identitySource: props.identitySource || 'method.request.header.Authorization',
        };
        this.authorizerProps = authorizerProps;
        const resource = new apigateway_generated_1.CfnAuthorizer(this, 'Resource', authorizerProps);
        this.authorizerId = resource.ref;
        this.authorizerArn = core_1.Stack.of(this).formatArn({
            service: 'execute-api',
            resource: restApiId,
            resourceName: `authorizers/${this.authorizerId}`,
        });
        this.authorizationType = method_1.AuthorizationType.COGNITO;
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
        const addToLogicalId = core_1.FeatureFlags.of(this).isEnabled(cx_api_1.APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID);
        const deployment = restApi.latestDeployment;
        if (deployment && addToLogicalId) {
            deployment.node.addDependency(this);
            deployment.addToLogicalId({
                authorizer: this.authorizerProps,
            });
        }
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
exports.CognitoUserPoolsAuthorizer = CognitoUserPoolsAuthorizer;
_a = JSII_RTTI_SYMBOL_1;
CognitoUserPoolsAuthorizer[_a] = { fqn: "@aws-cdk/aws-apigateway.CognitoUserPoolsAuthorizer", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0NBQTJFO0FBQzNFLDRDQUFxRjtBQUVyRixrRUFBNEU7QUFDNUUsOENBQXdEO0FBQ3hELHNDQUE4QztBQW9DOUM7Ozs7R0FJRztBQUNILE1BQWEsMEJBQTJCLFNBQVEsdUJBQVU7SUFzQnhELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0M7UUFDOUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQzs7Ozs7OytDQXZCUiwwQkFBMEI7Ozs7UUF5Qm5DLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUV2QyxNQUFNLGVBQWUsR0FBRztZQUN0QixJQUFJLEVBQUUsS0FBSyxDQUFDLGNBQWMsSUFBSSxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztZQUNsRCxTQUFTO1lBQ1QsSUFBSSxFQUFFLG9CQUFvQjtZQUMxQixZQUFZLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7WUFDMUUsNEJBQTRCLEVBQUUsS0FBSyxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUU7WUFDaEUsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjLElBQUkscUNBQXFDO1NBQzlFLENBQUM7UUFFRixJQUFJLENBQUMsZUFBZSxHQUFHLGVBQWUsQ0FBQztRQUV2QyxNQUFNLFFBQVEsR0FBRyxJQUFJLG9DQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUV0RSxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUM1QyxPQUFPLEVBQUUsYUFBYTtZQUN0QixRQUFRLEVBQUUsU0FBUztZQUNuQixZQUFZLEVBQUUsZUFBZSxJQUFJLENBQUMsWUFBWSxFQUFFO1NBQ2pELENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRywwQkFBaUIsQ0FBQyxPQUFPLENBQUM7S0FDcEQ7SUFFRDs7O09BR0c7SUFDSSxZQUFZLENBQUMsT0FBaUI7UUFDbkMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUMxRCxNQUFNLElBQUksS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7U0FDeEU7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFFbkMsTUFBTSxjQUFjLEdBQUcsbUJBQVksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLDJEQUFrRCxDQUFDLENBQUM7UUFFM0csTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBQzVDLElBQUksVUFBVSxJQUFJLGNBQWMsRUFBRTtZQUNoQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxVQUFVLENBQUMsY0FBYyxDQUFDO2dCQUN4QixVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWU7YUFDakMsQ0FBQyxDQUFDO1NBQ0o7S0FDRjtJQUVEOzs7T0FHRztJQUNLLGFBQWE7UUFDbkIsT0FBTyxXQUFJLENBQUMsTUFBTSxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxHQUFHLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7b0JBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsZUFBZSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksaUNBQWlDLENBQUMsQ0FBQztpQkFDakY7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1lBQ3hCLENBQUM7U0FDRixDQUFDLENBQUM7S0FDSjs7QUFwRkgsZ0VBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgRmVhdHVyZUZsYWdzLCBMYXp5LCBOYW1lcywgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEFQSUdBVEVXQVlfQVVUSE9SSVpFUl9DSEFOR0VfREVQTE9ZTUVOVF9MT0dJQ0FMX0lEIH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQXV0aG9yaXplciwgQ2ZuQXV0aG9yaXplclByb3BzIH0gZnJvbSAnLi4vYXBpZ2F0ZXdheS5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgQXV0aG9yaXplciwgSUF1dGhvcml6ZXIgfSBmcm9tICcuLi9hdXRob3JpemVyJztcbmltcG9ydCB7IEF1dGhvcml6YXRpb25UeXBlIH0gZnJvbSAnLi4vbWV0aG9kJztcbmltcG9ydCB7IElSZXN0QXBpIH0gZnJvbSAnLi4vcmVzdGFwaSc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgQ29nbml0b1VzZXJQb29sc0F1dGhvcml6ZXJcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb2duaXRvVXNlclBvb2xzQXV0aG9yaXplclByb3BzIHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGh1bWFuIGZyaWVuZGx5IG5hbWUgZm9yIHRoZSBhdXRob3JpemVyLiBOb3RlIHRoYXQsIHRoaXMgaXMgbm90IHRoZSBwcmltYXJ5IGlkZW50aWZpZXIgb2YgdGhlIGF1dGhvcml6ZXIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdGhlIHVuaXF1ZSBjb25zdHJ1Y3QgSURcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6ZXJOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdXNlciBwb29scyB0byBhc3NvY2lhdGUgd2l0aCB0aGlzIGF1dGhvcml6ZXIuXG4gICAqL1xuICByZWFkb25seSBjb2duaXRvVXNlclBvb2xzOiBjb2duaXRvLklVc2VyUG9vbFtdO1xuXG4gIC8qKlxuICAgKiBIb3cgbG9uZyBBUElHYXRld2F5IHNob3VsZCBjYWNoZSB0aGUgcmVzdWx0cy4gTWF4IDEgaG91ci5cbiAgICogRGlzYWJsZSBjYWNoaW5nIGJ5IHNldHRpbmcgdGhpcyB0byAwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDUpXG4gICAqL1xuICByZWFkb25seSByZXN1bHRzQ2FjaGVUdGw/OiBEdXJhdGlvbjtcblxuICAvKipcbiAgICogVGhlIHJlcXVlc3QgaGVhZGVyIG1hcHBpbmcgZXhwcmVzc2lvbiBmb3IgdGhlIGJlYXJlciB0b2tlbi4gVGhpcyBpcyB0eXBpY2FsbHkgcGFzc2VkIGFzIHBhcnQgb2YgdGhlIGhlYWRlciwgaW4gd2hpY2ggY2FzZVxuICAgKiB0aGlzIHNob3VsZCBiZSBgbWV0aG9kLnJlcXVlc3QuaGVhZGVyLkF1dGhvcml6ZXJgIHdoZXJlIEF1dGhvcml6ZXIgaXMgdGhlIGhlYWRlciBjb250YWluaW5nIHRoZSBiZWFyZXIgdG9rZW4uXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvYXBpLXJlZmVyZW5jZS9saW5rLXJlbGF0aW9uL2F1dGhvcml6ZXItY3JlYXRlLyNpZGVudGl0eVNvdXJjZVxuICAgKiBAZGVmYXVsdCBgSWRlbnRpdHlTb3VyY2UuaGVhZGVyKCdBdXRob3JpemF0aW9uJylgXG4gICAqL1xuICByZWFkb25seSBpZGVudGl0eVNvdXJjZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBDb2duaXRvIHVzZXIgcG9vbHMgYmFzZWQgY3VzdG9tIGF1dGhvcml6ZXJcbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpBcGlHYXRld2F5OjpBdXRob3JpemVyXG4gKi9cbmV4cG9ydCBjbGFzcyBDb2duaXRvVXNlclBvb2xzQXV0aG9yaXplciBleHRlbmRzIEF1dGhvcml6ZXIgaW1wbGVtZW50cyBJQXV0aG9yaXplciB7XG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIGF1dGhvcml6ZXIuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhdXRob3JpemVySWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgYXV0aG9yaXplciB0byBiZSB1c2VkIGluIHBlcm1pc3Npb24gcG9saWNpZXMsIHN1Y2ggYXMgSUFNIGFuZCByZXNvdXJjZS1iYXNlZCBncmFudHMuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBhdXRob3JpemVyQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhdXRob3JpemF0aW9uIHR5cGUgb2YgdGhpcyBhdXRob3JpemVyLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGF1dGhvcml6YXRpb25UeXBlPzogQXV0aG9yaXphdGlvblR5cGU7XG5cbiAgcHJpdmF0ZSByZXN0QXBpSWQ/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhdXRob3JpemVyUHJvcHM6IENmbkF1dGhvcml6ZXJQcm9wcztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ29nbml0b1VzZXJQb29sc0F1dGhvcml6ZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCByZXN0QXBpSWQgPSB0aGlzLmxhenlSZXN0QXBpSWQoKTtcblxuICAgIGNvbnN0IGF1dGhvcml6ZXJQcm9wcyA9IHtcbiAgICAgIG5hbWU6IHByb3BzLmF1dGhvcml6ZXJOYW1lID8/IE5hbWVzLnVuaXF1ZUlkKHRoaXMpLFxuICAgICAgcmVzdEFwaUlkLFxuICAgICAgdHlwZTogJ0NPR05JVE9fVVNFUl9QT09MUycsXG4gICAgICBwcm92aWRlckFybnM6IHByb3BzLmNvZ25pdG9Vc2VyUG9vbHMubWFwKHVzZXJQb29sID0+IHVzZXJQb29sLnVzZXJQb29sQXJuKSxcbiAgICAgIGF1dGhvcml6ZXJSZXN1bHRUdGxJblNlY29uZHM6IHByb3BzLnJlc3VsdHNDYWNoZVR0bD8udG9TZWNvbmRzKCksXG4gICAgICBpZGVudGl0eVNvdXJjZTogcHJvcHMuaWRlbnRpdHlTb3VyY2UgfHwgJ21ldGhvZC5yZXF1ZXN0LmhlYWRlci5BdXRob3JpemF0aW9uJyxcbiAgICB9O1xuXG4gICAgdGhpcy5hdXRob3JpemVyUHJvcHMgPSBhdXRob3JpemVyUHJvcHM7XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5BdXRob3JpemVyKHRoaXMsICdSZXNvdXJjZScsIGF1dGhvcml6ZXJQcm9wcyk7XG5cbiAgICB0aGlzLmF1dGhvcml6ZXJJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmF1dGhvcml6ZXJBcm4gPSBTdGFjay5vZih0aGlzKS5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2V4ZWN1dGUtYXBpJyxcbiAgICAgIHJlc291cmNlOiByZXN0QXBpSWQsXG4gICAgICByZXNvdXJjZU5hbWU6IGBhdXRob3JpemVycy8ke3RoaXMuYXV0aG9yaXplcklkfWAsXG4gICAgfSk7XG4gICAgdGhpcy5hdXRob3JpemF0aW9uVHlwZSA9IEF1dGhvcml6YXRpb25UeXBlLkNPR05JVE87XG4gIH1cblxuICAvKipcbiAgICogQXR0YWNoZXMgdGhpcyBhdXRob3JpemVyIHRvIGEgc3BlY2lmaWMgUkVTVCBBUEkuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIF9hdHRhY2hUb0FwaShyZXN0QXBpOiBJUmVzdEFwaSk6IHZvaWQge1xuICAgIGlmICh0aGlzLnJlc3RBcGlJZCAmJiB0aGlzLnJlc3RBcGlJZCAhPT0gcmVzdEFwaS5yZXN0QXBpSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGF0dGFjaCBhdXRob3JpemVyIHRvIHR3byBkaWZmZXJlbnQgcmVzdCBBUElzJyk7XG4gICAgfVxuXG4gICAgdGhpcy5yZXN0QXBpSWQgPSByZXN0QXBpLnJlc3RBcGlJZDtcblxuICAgIGNvbnN0IGFkZFRvTG9naWNhbElkID0gRmVhdHVyZUZsYWdzLm9mKHRoaXMpLmlzRW5hYmxlZChBUElHQVRFV0FZX0FVVEhPUklaRVJfQ0hBTkdFX0RFUExPWU1FTlRfTE9HSUNBTF9JRCk7XG5cbiAgICBjb25zdCBkZXBsb3ltZW50ID0gcmVzdEFwaS5sYXRlc3REZXBsb3ltZW50O1xuICAgIGlmIChkZXBsb3ltZW50ICYmIGFkZFRvTG9naWNhbElkKSB7XG4gICAgICBkZXBsb3ltZW50Lm5vZGUuYWRkRGVwZW5kZW5jeSh0aGlzKTtcbiAgICAgIGRlcGxveW1lbnQuYWRkVG9Mb2dpY2FsSWQoe1xuICAgICAgICBhdXRob3JpemVyOiB0aGlzLmF1dGhvcml6ZXJQcm9wcyxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgdG9rZW4gdGhhdCByZXNvbHZlcyB0byB0aGUgUmVzdCBBcGkgSWQgYXQgdGhlIHRpbWUgb2Ygc3ludGhlc2lzLlxuICAgKiBUaHJvd3MgYW4gZXJyb3IsIGR1cmluZyB0b2tlbiByZXNvbHV0aW9uLCBpZiBubyBSZXN0QXBpIGlzIGF0dGFjaGVkIHRvIHRoaXMgYXV0aG9yaXplci5cbiAgICovXG4gIHByaXZhdGUgbGF6eVJlc3RBcGlJZCgpIHtcbiAgICByZXR1cm4gTGF6eS5zdHJpbmcoe1xuICAgICAgcHJvZHVjZTogKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMucmVzdEFwaUlkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBBdXRob3JpemVyICgke3RoaXMubm9kZS5wYXRofSkgbXVzdCBiZSBhdHRhY2hlZCB0byBhIFJlc3RBcGlgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5yZXN0QXBpSWQ7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG4iXX0=