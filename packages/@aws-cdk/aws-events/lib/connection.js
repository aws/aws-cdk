"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.Connection = exports.HttpParameter = exports.Authorization = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const events_generated_1 = require("./events.generated");
/**
 * Authorization type for an API Destination Connection
 */
class Authorization {
    /**
     * Use API key authorization
     *
     * API key authorization has two components: an API key name and an API key value.
     * What these are depends on the target of your connection.
     */
    static apiKey(apiKeyName, apiKeyValue) {
        return new class extends Authorization {
            _bind() {
                return {
                    authorizationType: AuthorizationType.API_KEY,
                    authParameters: {
                        apiKeyAuthParameters: {
                            apiKeyName: apiKeyName,
                            apiKeyValue: apiKeyValue.unsafeUnwrap(), // Safe usage
                        },
                    },
                };
            }
        }();
    }
    /**
     * Use username and password authorization
     */
    static basic(username, password) {
        return new class extends Authorization {
            _bind() {
                return {
                    authorizationType: AuthorizationType.BASIC,
                    authParameters: {
                        basicAuthParameters: {
                            username: username,
                            password: password.unsafeUnwrap(), // Safe usage
                        },
                    },
                };
            }
        }();
    }
    /**
     * Use OAuth authorization
     */
    static oauth(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_OAuthAuthorizationProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.oauth);
            }
            throw error;
        }
        if (![HttpMethod.POST, HttpMethod.GET, HttpMethod.PUT].includes(props.httpMethod)) {
            throw new Error('httpMethod must be one of GET, POST, PUT');
        }
        return new class extends Authorization {
            _bind() {
                return {
                    authorizationType: AuthorizationType.OAUTH_CLIENT_CREDENTIALS,
                    authParameters: {
                        oAuthParameters: {
                            authorizationEndpoint: props.authorizationEndpoint,
                            clientParameters: {
                                clientId: props.clientId,
                                clientSecret: props.clientSecret.unsafeUnwrap(), // Safe usage
                            },
                            httpMethod: props.httpMethod,
                            oAuthHttpParameters: {
                                bodyParameters: renderHttpParameters(props.bodyParameters),
                                headerParameters: renderHttpParameters(props.headerParameters),
                                queryStringParameters: renderHttpParameters(props.queryStringParameters),
                            },
                        },
                    },
                };
            }
        }();
    }
}
_a = JSII_RTTI_SYMBOL_1;
Authorization[_a] = { fqn: "@aws-cdk/aws-events.Authorization", version: "0.0.0" };
exports.Authorization = Authorization;
/**
 * An additional HTTP parameter to send along with the OAuth request
 */
class HttpParameter {
    /**
     * Make an OAuthParameter from a string value
     *
     * The value is not treated as a secret.
     */
    static fromString(value) {
        return new class extends HttpParameter {
            _render(name) {
                return {
                    key: name,
                    value,
                    isValueSecret: false,
                };
            }
        }();
    }
    /**
     * Make an OAuthParameter from a secret
     */
    static fromSecret(value) {
        return new class extends HttpParameter {
            _render(name) {
                return {
                    key: name,
                    value: value.unsafeUnwrap(),
                    isValueSecret: true,
                };
            }
        }();
    }
}
_b = JSII_RTTI_SYMBOL_1;
HttpParameter[_b] = { fqn: "@aws-cdk/aws-events.HttpParameter", version: "0.0.0" };
exports.HttpParameter = HttpParameter;
/**
 * Define an EventBridge Connection
 *
 * @resource AWS::Events::Connection
 */
class Connection extends core_1.Resource {
    /**
     * Import an existing connection resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param connectionArn ARN of imported connection
     */
    static fromEventBusArn(scope, id, connectionArn, connectionSecretArn) {
        const parts = core_1.Stack.of(scope).parseArn(connectionArn);
        return new ImportedConnection(scope, id, {
            connectionArn: connectionArn,
            connectionName: parts.resourceName || '',
            connectionSecretArn: connectionSecretArn,
        });
    }
    /**
     * Import an existing connection resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param attrs Imported connection properties
     */
    static fromConnectionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_ConnectionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromConnectionAttributes);
            }
            throw error;
        }
        return new ImportedConnection(scope, id, attrs);
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.connectionName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_ConnectionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Connection);
            }
            throw error;
        }
        const authBind = props.authorization._bind();
        const invocationHttpParameters = !!props.headerParameters || !!props.queryStringParameters || !!props.bodyParameters ? {
            bodyParameters: renderHttpParameters(props.bodyParameters),
            headerParameters: renderHttpParameters(props.headerParameters),
            queryStringParameters: renderHttpParameters(props.queryStringParameters),
        } : undefined;
        let connection = new events_generated_1.CfnConnection(this, 'Connection', {
            authorizationType: authBind.authorizationType,
            authParameters: {
                ...authBind.authParameters,
                invocationHttpParameters: invocationHttpParameters,
            },
            description: props.description,
            name: this.physicalName,
        });
        this.connectionName = this.getResourceNameAttribute(connection.ref);
        this.connectionArn = connection.attrArn;
        this.connectionSecretArn = connection.attrSecretArn;
    }
}
_c = JSII_RTTI_SYMBOL_1;
Connection[_c] = { fqn: "@aws-cdk/aws-events.Connection", version: "0.0.0" };
exports.Connection = Connection;
class ImportedConnection extends core_1.Resource {
    constructor(scope, id, attrs) {
        const arnParts = core_1.Stack.of(scope).parseArn(attrs.connectionArn);
        super(scope, id, {
            account: arnParts.account,
            region: arnParts.region,
        });
        this.connectionArn = attrs.connectionArn;
        this.connectionName = attrs.connectionName;
        this.connectionSecretArn = attrs.connectionSecretArn;
    }
}
/**
 * Supported HTTP operations.
 */
var HttpMethod;
(function (HttpMethod) {
    /** POST */
    HttpMethod["POST"] = "POST";
    /** GET */
    HttpMethod["GET"] = "GET";
    /** HEAD */
    HttpMethod["HEAD"] = "HEAD";
    /** OPTIONS */
    HttpMethod["OPTIONS"] = "OPTIONS";
    /** PUT */
    HttpMethod["PUT"] = "PUT";
    /** PATCH */
    HttpMethod["PATCH"] = "PATCH";
    /** DELETE */
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod = exports.HttpMethod || (exports.HttpMethod = {}));
/**
 * Supported Authorization Types.
 */
var AuthorizationType;
(function (AuthorizationType) {
    /** API_KEY */
    AuthorizationType["API_KEY"] = "API_KEY";
    /** BASIC */
    AuthorizationType["BASIC"] = "BASIC";
    /** OAUTH_CLIENT_CREDENTIALS */
    AuthorizationType["OAUTH_CLIENT_CREDENTIALS"] = "OAUTH_CLIENT_CREDENTIALS";
})(AuthorizationType || (AuthorizationType = {}));
function renderHttpParameters(ps) {
    if (!ps || Object.keys(ps).length === 0) {
        return undefined;
    }
    return Object.entries(ps).map(([name, p]) => p._render(name));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdFO0FBRXhFLHlEQUFtRDtBQWlEbkQ7O0dBRUc7QUFDSCxNQUFzQixhQUFhO0lBQ2pDOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFrQixFQUFFLFdBQXdCO1FBQy9ELE9BQU8sSUFBSSxLQUFNLFNBQVEsYUFBYTtZQUM3QixLQUFLO2dCQUNWLE9BQU87b0JBQ0wsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsT0FBTztvQkFDNUMsY0FBYyxFQUFFO3dCQUNkLG9CQUFvQixFQUFFOzRCQUNwQixVQUFVLEVBQUUsVUFBVTs0QkFDdEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxZQUFZLEVBQUUsRUFBRSxhQUFhO3lCQUN2RDtxQkFDc0M7aUJBQzFDLENBQUM7WUFDSixDQUFDO1NBQ0YsRUFBRSxDQUFDO0tBQ0w7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBZ0IsRUFBRSxRQUFxQjtRQUN6RCxPQUFPLElBQUksS0FBTSxTQUFRLGFBQWE7WUFDN0IsS0FBSztnQkFDVixPQUFPO29CQUNMLGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLEtBQUs7b0JBQzFDLGNBQWMsRUFBRTt3QkFDZCxtQkFBbUIsRUFBRTs0QkFDbkIsUUFBUSxFQUFFLFFBQVE7NEJBQ2xCLFFBQVEsRUFBRSxRQUFRLENBQUMsWUFBWSxFQUFFLEVBQUUsYUFBYTt5QkFDakQ7cUJBQ3NDO2lCQUMxQyxDQUFDO1lBQ0osQ0FBQztTQUNGLEVBQUUsQ0FBQztLQUNMO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQThCOzs7Ozs7Ozs7O1FBQ2hELElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFD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QUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjaywgU2VjcmV0VmFsdWUgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuQ29ubmVjdGlvbiB9IGZyb20gJy4vZXZlbnRzLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogQW4gQVBJIERlc3RpbmF0aW9uIENvbm5lY3Rpb25cbiAqXG4gKiBBIGNvbm5lY3Rpb24gZGVmaW5lcyB0aGUgYXV0aG9yaXphdGlvbiB0eXBlIGFuZCBjcmVkZW50aWFscyB0byB1c2UgZm9yIGF1dGhvcml6YXRpb24gd2l0aCBhbiBBUEkgZGVzdGluYXRpb24gSFRUUCBlbmRwb2ludC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uUHJvcHMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbm5lY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQSBuYW1lIGlzIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGNvbm5lY3Rpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBhdXRob3JpemF0aW9uIHR5cGUgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvbjogQXV0aG9yaXphdGlvbjtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBzdHJpbmcgcGFyYW1ldGVycyB0byBhZGQgdG8gdGhlIGludm9jYXRpb24gYm9kaWVzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBib2R5UGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIEh0dHBQYXJhbWV0ZXI+O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHN0cmluZyBwYXJhbWV0ZXJzIHRvIGFkZCB0byB0aGUgaW52b2NhdGlvbiBoZWFkZXJzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBoZWFkZXJQYXJhbWV0ZXJzPzogUmVjb3JkPHN0cmluZywgSHR0cFBhcmFtZXRlcj47XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgc3RyaW5nIHBhcmFtZXRlcnMgdG8gYWRkIHRvIHRoZSBpbnZvY2F0aW9uIHF1ZXJ5IHN0cmluZ3NcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5U3RyaW5nUGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIEh0dHBQYXJhbWV0ZXI+O1xufVxuXG4vKipcbiAqIEF1dGhvcml6YXRpb24gdHlwZSBmb3IgYW4gQVBJIERlc3RpbmF0aW9uIENvbm5lY3Rpb25cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEF1dGhvcml6YXRpb24ge1xuICAvKipcbiAgICogVXNlIEFQSSBrZXkgYXV0aG9yaXphdGlvblxuICAgKlxuICAgKiBBUEkga2V5IGF1dGhvcml6YXRpb24gaGFzIHR3byBjb21wb25lbnRzOiBhbiBBUEkga2V5IG5hbWUgYW5kIGFuIEFQSSBrZXkgdmFsdWUuXG4gICAqIFdoYXQgdGhlc2UgYXJlIGRlcGVuZHMgb24gdGhlIHRhcmdldCBvZiB5b3VyIGNvbm5lY3Rpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFwaUtleShhcGlLZXlOYW1lOiBzdHJpbmcsIGFwaUtleVZhbHVlOiBTZWNyZXRWYWx1ZSk6IEF1dGhvcml6YXRpb24ge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBBdXRob3JpemF0aW9uIHtcbiAgICAgIHB1YmxpYyBfYmluZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQVBJX0tFWSxcbiAgICAgICAgICBhdXRoUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgYXBpS2V5QXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgYXBpS2V5TmFtZTogYXBpS2V5TmFtZSxcbiAgICAgICAgICAgICAgYXBpS2V5VmFsdWU6IGFwaUtleVZhbHVlLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0gYXMgQ2ZuQ29ubmVjdGlvbi5BdXRoUGFyYW1ldGVyc1Byb3BlcnR5LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgdXNlcm5hbWUgYW5kIHBhc3N3b3JkIGF1dGhvcml6YXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYmFzaWModXNlcm5hbWU6IHN0cmluZywgcGFzc3dvcmQ6IFNlY3JldFZhbHVlKTogQXV0aG9yaXphdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEF1dGhvcml6YXRpb24ge1xuICAgICAgcHVibGljIF9iaW5kKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZS5CQVNJQyxcbiAgICAgICAgICBhdXRoUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgYmFzaWNBdXRoUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICB1c2VybmFtZTogdXNlcm5hbWUsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZC51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9IGFzIENmbkNvbm5lY3Rpb24uQXV0aFBhcmFtZXRlcnNQcm9wZXJ0eSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIE9BdXRoIGF1dGhvcml6YXRpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb2F1dGgocHJvcHM6IE9BdXRoQXV0aG9yaXphdGlvblByb3BzKTogQXV0aG9yaXphdGlvbiB7XG4gICAgaWYgKCFbSHR0cE1ldGhvZC5QT1NULCBIdHRwTWV0aG9kLkdFVCwgSHR0cE1ldGhvZC5QVVRdLmluY2x1ZGVzKHByb3BzLmh0dHBNZXRob2QpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2h0dHBNZXRob2QgbXVzdCBiZSBvbmUgb2YgR0VULCBQT1NULCBQVVQnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgQXV0aG9yaXphdGlvbiB7XG4gICAgICBwdWJsaWMgX2JpbmQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLk9BVVRIX0NMSUVOVF9DUkVERU5USUFMUyxcbiAgICAgICAgICBhdXRoUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgb0F1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIGF1dGhvcml6YXRpb25FbmRwb2ludDogcHJvcHMuYXV0aG9yaXphdGlvbkVuZHBvaW50LFxuICAgICAgICAgICAgICBjbGllbnRQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICAgY2xpZW50SWQ6IHByb3BzLmNsaWVudElkLFxuICAgICAgICAgICAgICAgIGNsaWVudFNlY3JldDogcHJvcHMuY2xpZW50U2VjcmV0LnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGh0dHBNZXRob2Q6IHByb3BzLmh0dHBNZXRob2QsXG4gICAgICAgICAgICAgIG9BdXRoSHR0cFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgICBib2R5UGFyYW1ldGVyczogcmVuZGVySHR0cFBhcmFtZXRlcnMocHJvcHMuYm9keVBhcmFtZXRlcnMpLFxuICAgICAgICAgICAgICAgIGhlYWRlclBhcmFtZXRlcnM6IHJlbmRlckh0dHBQYXJhbWV0ZXJzKHByb3BzLmhlYWRlclBhcmFtZXRlcnMpLFxuICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczogcmVuZGVySHR0cFBhcmFtZXRlcnMocHJvcHMucXVlcnlTdHJpbmdQYXJhbWV0ZXJzKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSBhcyBDZm5Db25uZWN0aW9uLkF1dGhQYXJhbWV0ZXJzUHJvcGVydHksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSgpO1xuXG4gIH1cblxuICAvKipcbiAgICogQmluZCB0aGUgYXV0aG9yaXphdGlvbiB0byB0aGUgY29uc3RydWN0IGFuZCByZXR1cm4gdGhlIGF1dGhvcml6YXRpb24gcHJvcGVydGllc1xuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfYmluZCgpOiBBdXRob3JpemF0aW9uQmluZFJlc3VsdDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBgQXV0aG9yaXphdGlvbi5vYXV0aCgpYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE9BdXRoQXV0aG9yaXphdGlvblByb3BzIHtcblxuICAvKipcbiAgICogVGhlIFVSTCB0byB0aGUgYXV0aG9yaXphdGlvbiBlbmRwb2ludFxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvbkVuZHBvaW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdG8gdXNlIGZvciB0aGUgYXV0aG9yaXphdGlvbiByZXF1ZXN0LlxuICAgKlxuICAgKiAoQ2FuIG9ubHkgY2hvb3NlIFBPU1QsIEdFVCBvciBQVVQpLlxuICAgKi9cbiAgcmVhZG9ubHkgaHR0cE1ldGhvZDogSHR0cE1ldGhvZDtcblxuICAvKipcbiAgICogVGhlIGNsaWVudCBJRCB0byB1c2UgZm9yIE9BdXRoIGF1dGhvcml6YXRpb24gZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY2xpZW50SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGNsaWVudCBzZWNyZXQgYXNzb2NpYXRlZCB3aXRoIHRoZSBjbGllbnQgSUQgdG8gdXNlIGZvciBPQXV0aCBhdXRob3JpemF0aW9uIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudFNlY3JldDogU2VjcmV0VmFsdWU7XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgc3RyaW5nIHBhcmFtZXRlcnMgdG8gYWRkIHRvIHRoZSBPQXV0aCByZXF1ZXN0IGJvZHlcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IGJvZHlQYXJhbWV0ZXJzPzogUmVjb3JkPHN0cmluZywgSHR0cFBhcmFtZXRlcj47XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgc3RyaW5nIHBhcmFtZXRlcnMgdG8gYWRkIHRvIHRoZSBPQXV0aCByZXF1ZXN0IGhlYWRlclxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgaGVhZGVyUGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIEh0dHBQYXJhbWV0ZXI+O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHN0cmluZyBwYXJhbWV0ZXJzIHRvIGFkZCB0byB0aGUgT0F1dGggcmVxdWVzdCBxdWVyeSBzdHJpbmdcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IHF1ZXJ5U3RyaW5nUGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIEh0dHBQYXJhbWV0ZXI+O1xufVxuXG4vKipcbiAqIEFuIGFkZGl0aW9uYWwgSFRUUCBwYXJhbWV0ZXIgdG8gc2VuZCBhbG9uZyB3aXRoIHRoZSBPQXV0aCByZXF1ZXN0XG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBIdHRwUGFyYW1ldGVyIHtcbiAgLyoqXG4gICAqIE1ha2UgYW4gT0F1dGhQYXJhbWV0ZXIgZnJvbSBhIHN0cmluZyB2YWx1ZVxuICAgKlxuICAgKiBUaGUgdmFsdWUgaXMgbm90IHRyZWF0ZWQgYXMgYSBzZWNyZXQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJpbmcodmFsdWU6IHN0cmluZyk6IEh0dHBQYXJhbWV0ZXIge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBIdHRwUGFyYW1ldGVyIHtcbiAgICAgIHB1YmxpYyBfcmVuZGVyKG5hbWU6IHN0cmluZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtleTogbmFtZSxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBpc1ZhbHVlU2VjcmV0OiBmYWxzZSxcbiAgICAgICAgfSBhcyBDZm5Db25uZWN0aW9uLlBhcmFtZXRlclByb3BlcnR5O1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFuIE9BdXRoUGFyYW1ldGVyIGZyb20gYSBzZWNyZXRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNlY3JldCh2YWx1ZTogU2VjcmV0VmFsdWUpOiBIdHRwUGFyYW1ldGVyIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSHR0cFBhcmFtZXRlciB7XG4gICAgICBwdWJsaWMgX3JlbmRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IG5hbWUsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlLnVuc2FmZVVud3JhcCgpLCAvLyBTYWZlIHVzYWdlXG4gICAgICAgICAgaXNWYWx1ZVNlY3JldDogdHJ1ZSxcbiAgICAgICAgfSBhcyBDZm5Db25uZWN0aW9uLlBhcmFtZXRlclByb3BlcnR5O1xuICAgICAgfVxuICAgIH0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHBhcmFtdGVyIHZhbHVlXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IF9yZW5kZXIobmFtZTogc3RyaW5nKTogYW55O1xufVxuXG4vKipcbiAqIFJlc3VsdCBvZiB0aGUgJ2JpbmQnIG9wZXJhdGlvbiBvZiB0aGUgJ0F1dGhvcml6YXRpb24nIGNsYXNzXG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQXV0aG9yaXphdGlvbkJpbmRSZXN1bHQge1xuICAvKipcbiAgICogVGhlIGF1dGhvcml6YXRpb24gdHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgYXV0aG9yaXphdGlvbiBwYXJhbWV0ZXJzIChkZXBlbmRzIG9uIHRoZSB0eXBlKVxuICAgKi9cbiAgcmVhZG9ubHkgYXV0aFBhcmFtZXRlcnM6IGFueTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIEV2ZW50QnVzIENvbm5lY3Rpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUNvbm5lY3Rpb24gZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIE5hbWUgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBjb25uZWN0aW9uIGNyZWF0ZWQuXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbm5lY3Rpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBmb3IgdGhlIHNlY3JldCBjcmVhdGVkIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvblNlY3JldEFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSB3aXRoIHByb3BlcnRpZXMgbmVjZXNzYXJ5IHRvIGltcG9ydCBhIHJldXNhYmxlIENvbm5lY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uQXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgTmFtZSBmb3IgdGhlIGNvbm5lY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBjb25uZWN0aW9uIGNyZWF0ZWQuXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gZm9yIHRoZSBzZWNyZXQgY3JlYXRlZCBmb3IgdGhlIGNvbm5lY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uU2VjcmV0QXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogRGVmaW5lIGFuIEV2ZW50QnJpZGdlIENvbm5lY3Rpb25cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpFdmVudHM6OkNvbm5lY3Rpb25cbiAqL1xuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb24gZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElDb25uZWN0aW9uIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBjb25uZWN0aW9uIHJlc291cmNlXG4gICAqIEBwYXJhbSBzY29wZSBQYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBDb25zdHJ1Y3QgSURcbiAgICogQHBhcmFtIGNvbm5lY3Rpb25Bcm4gQVJOIG9mIGltcG9ydGVkIGNvbm5lY3Rpb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUV2ZW50QnVzQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNvbm5lY3Rpb25Bcm46IHN0cmluZywgY29ubmVjdGlvblNlY3JldEFybjogc3RyaW5nKTogSUNvbm5lY3Rpb24ge1xuICAgIGNvbnN0IHBhcnRzID0gU3RhY2sub2Yoc2NvcGUpLnBhcnNlQXJuKGNvbm5lY3Rpb25Bcm4pO1xuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZENvbm5lY3Rpb24oc2NvcGUsIGlkLCB7XG4gICAgICBjb25uZWN0aW9uQXJuOiBjb25uZWN0aW9uQXJuLFxuICAgICAgY29ubmVjdGlvbk5hbWU6IHBhcnRzLnJlc291cmNlTmFtZSB8fCAnJyxcbiAgICAgIGNvbm5lY3Rpb25TZWNyZXRBcm46IGNvbm5lY3Rpb25TZWNyZXRBcm4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIGNvbm5lY3Rpb24gcmVzb3VyY2VcbiAgICogQHBhcmFtIHNjb3BlIFBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIENvbnN0cnVjdCBJRFxuICAgKiBAcGFyYW0gYXR0cnMgSW1wb3J0ZWQgY29ubmVjdGlvbiBwcm9wZXJ0aWVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Db25uZWN0aW9uQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQ29ubmVjdGlvbkF0dHJpYnV0ZXMpOiBJQ29ubmVjdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBJbXBvcnRlZENvbm5lY3Rpb24oc2NvcGUsIGlkLCBhdHRycyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIE5hbWUgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgY29ubmVjdGlvbiBjcmVhdGVkLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIGZvciB0aGUgc2VjcmV0IGNyZWF0ZWQgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvblNlY3JldEFybjogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBDb25uZWN0aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuY29ubmVjdGlvbk5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBhdXRoQmluZCA9IHByb3BzLmF1dGhvcml6YXRpb24uX2JpbmQoKTtcblxuICAgIGNvbnN0IGludm9jYXRpb25IdHRwUGFyYW1ldGVycyA9ICEhcHJvcHMuaGVhZGVyUGFyYW1ldGVycyB8fCAhIXByb3BzLnF1ZXJ5U3RyaW5nUGFyYW1ldGVycyB8fCAhIXByb3BzLmJvZHlQYXJhbWV0ZXJzID8ge1xuICAgICAgYm9keVBhcmFtZXRlcnM6IHJlbmRlckh0dHBQYXJhbWV0ZXJzKHByb3BzLmJvZHlQYXJhbWV0ZXJzKSxcbiAgICAgIGhlYWRlclBhcmFtZXRlcnM6IHJlbmRlckh0dHBQYXJhbWV0ZXJzKHByb3BzLmhlYWRlclBhcmFtZXRlcnMpLFxuICAgICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiByZW5kZXJIdHRwUGFyYW1ldGVycyhwcm9wcy5xdWVyeVN0cmluZ1BhcmFtZXRlcnMpLFxuICAgIH0gOiB1bmRlZmluZWQ7XG5cbiAgICBsZXQgY29ubmVjdGlvbiA9IG5ldyBDZm5Db25uZWN0aW9uKHRoaXMsICdDb25uZWN0aW9uJywge1xuICAgICAgYXV0aG9yaXphdGlvblR5cGU6IGF1dGhCaW5kLmF1dGhvcml6YXRpb25UeXBlLFxuICAgICAgYXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgLi4uYXV0aEJpbmQuYXV0aFBhcmFtZXRlcnMsXG4gICAgICAgIGludm9jYXRpb25IdHRwUGFyYW1ldGVyczogaW52b2NhdGlvbkh0dHBQYXJhbWV0ZXJzLFxuICAgICAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kZXNjcmlwdGlvbixcbiAgICAgIG5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25uZWN0aW9uTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKGNvbm5lY3Rpb24ucmVmKTtcbiAgICB0aGlzLmNvbm5lY3Rpb25Bcm4gPSBjb25uZWN0aW9uLmF0dHJBcm47XG4gICAgdGhpcy5jb25uZWN0aW9uU2VjcmV0QXJuID0gY29ubmVjdGlvbi5hdHRyU2VjcmV0QXJuO1xuICB9XG59XG5cbmNsYXNzIEltcG9ydGVkQ29ubmVjdGlvbiBleHRlbmRzIFJlc291cmNlIHtcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25Bcm46IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25OYW1lOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uU2VjcmV0QXJuOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBDb25uZWN0aW9uQXR0cmlidXRlcykge1xuICAgIGNvbnN0IGFyblBhcnRzID0gU3RhY2sub2Yoc2NvcGUpLnBhcnNlQXJuKGF0dHJzLmNvbm5lY3Rpb25Bcm4pO1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgYWNjb3VudDogYXJuUGFydHMuYWNjb3VudCxcbiAgICAgIHJlZ2lvbjogYXJuUGFydHMucmVnaW9uLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jb25uZWN0aW9uQXJuID0gYXR0cnMuY29ubmVjdGlvbkFybjtcbiAgICB0aGlzLmNvbm5lY3Rpb25OYW1lID0gYXR0cnMuY29ubmVjdGlvbk5hbWU7XG4gICAgdGhpcy5jb25uZWN0aW9uU2VjcmV0QXJuID0gYXR0cnMuY29ubmVjdGlvblNlY3JldEFybjtcbiAgfVxufVxuXG4vKipcbiAqIFN1cHBvcnRlZCBIVFRQIG9wZXJhdGlvbnMuXG4gKi9cbmV4cG9ydCBlbnVtIEh0dHBNZXRob2Qge1xuICAvKiogUE9TVCAqL1xuICBQT1NUID0gJ1BPU1QnLFxuICAvKiogR0VUICovXG4gIEdFVCA9ICdHRVQnLFxuICAvKiogSEVBRCAqL1xuICBIRUFEID0gJ0hFQUQnLFxuICAvKiogT1BUSU9OUyAqL1xuICBPUFRJT05TID0gJ09QVElPTlMnLFxuICAvKiogUFVUICovXG4gIFBVVCA9ICdQVVQnLFxuICAvKiogUEFUQ0ggKi9cbiAgUEFUQ0ggPSAnUEFUQ0gnLFxuICAvKiogREVMRVRFICovXG4gIERFTEVURSA9ICdERUxFVEUnLFxufVxuXG4vKipcbiAqIFN1cHBvcnRlZCBBdXRob3JpemF0aW9uIFR5cGVzLlxuICovXG5lbnVtIEF1dGhvcml6YXRpb25UeXBlIHtcbiAgLyoqIEFQSV9LRVkgKi9cbiAgQVBJX0tFWSA9ICdBUElfS0VZJyxcbiAgLyoqIEJBU0lDICovXG4gIEJBU0lDID0gJ0JBU0lDJyxcbiAgLyoqIE9BVVRIX0NMSUVOVF9DUkVERU5USUFMUyAqL1xuICBPQVVUSF9DTElFTlRfQ1JFREVOVElBTFMgPSAnT0FVVEhfQ0xJRU5UX0NSRURFTlRJQUxTJyxcbn1cblxuZnVuY3Rpb24gcmVuZGVySHR0cFBhcmFtZXRlcnMocHM/OiBSZWNvcmQ8c3RyaW5nLCBIdHRwUGFyYW1ldGVyPik6IENmbkNvbm5lY3Rpb24uUGFyYW1ldGVyUHJvcGVydHlbXSB8IHVuZGVmaW5lZCB7XG4gIGlmICghcHMgfHwgT2JqZWN0LmtleXMocHMpLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG5cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHBzKS5tYXAoKFtuYW1lLCBwXSkgPT4gcC5fcmVuZGVyKG5hbWUpKTtcbn0iXX0=