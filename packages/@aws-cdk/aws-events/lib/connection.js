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
                            apiKeyValue: apiKeyValue.unsafeUnwrap(),
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
                            password: password.unsafeUnwrap(),
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
                                clientSecret: props.clientSecret.unsafeUnwrap(),
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
exports.Authorization = Authorization;
_a = JSII_RTTI_SYMBOL_1;
Authorization[_a] = { fqn: "@aws-cdk/aws-events.Authorization", version: "0.0.0" };
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
exports.HttpParameter = HttpParameter;
_b = JSII_RTTI_SYMBOL_1;
HttpParameter[_b] = { fqn: "@aws-cdk/aws-events.HttpParameter", version: "0.0.0" };
/**
 * Define an EventBridge Connection
 *
 * @resource AWS::Events::Connection
 */
class Connection extends core_1.Resource {
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
}
exports.Connection = Connection;
_c = JSII_RTTI_SYMBOL_1;
Connection[_c] = { fqn: "@aws-cdk/aws-events.Connection", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdFO0FBRXhFLHlEQUFtRDtBQWlEbkQ7O0dBRUc7QUFDSCxNQUFzQixhQUFhO0lBQ2pDOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFrQixFQUFFLFdBQXdCO1FBQy9ELE9BQU8sSUFBSSxLQUFNLFNBQVEsYUFBYTtZQUM3QixLQUFLO2dCQUNWLE9BQU87b0JBQ0wsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsT0FBTztvQkFDNUMsY0FBYyxFQUFFO3dCQUNkLG9CQUFvQixFQUFFOzRCQUNwQixVQUFVLEVBQUUsVUFBVTs0QkFDdEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxZQUFZLEVBQUU7eUJBQ3hDO3FCQUNzQztpQkFDMUMsQ0FBQztZQUNKLENBQUM7U0FDRixFQUFFLENBQUM7S0FDTDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFnQixFQUFFLFFBQXFCO1FBQ3pELE9BQU8sSUFBSSxLQUFNLFNBQVEsYUFBYTtZQUM3QixLQUFLO2dCQUNWLE9BQU87b0JBQ0wsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsS0FBSztvQkFDMUMsY0FBYyxFQUFFO3dCQUNkLG1CQUFtQixFQUFFOzRCQUNuQixRQUFRLEVBQUUsUUFBUTs0QkFDbEIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxZQUFZLEVBQUU7eUJBQ2xDO3FCQUNzQztpQkFDMUMsQ0FBQztZQUNKLENBQUM7U0FDRixFQUFFLENBQUM7S0FDTDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUE4Qjs7Ozs7Ozs7OztRQUNoRCxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFL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LEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIFNlY3JldFZhbHVlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkNvbm5lY3Rpb24gfSBmcm9tICcuL2V2ZW50cy5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIEFuIEFQSSBEZXN0aW5hdGlvbiBDb25uZWN0aW9uXG4gKlxuICogQSBjb25uZWN0aW9uIGRlZmluZXMgdGhlIGF1dGhvcml6YXRpb24gdHlwZSBhbmQgY3JlZGVudGlhbHMgdG8gdXNlIGZvciBhdXRob3JpemF0aW9uIHdpdGggYW4gQVBJIGRlc3RpbmF0aW9uIEhUVFAgZW5kcG9pbnQuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEEgbmFtZSBpcyBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBjb25uZWN0aW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYXV0aG9yaXphdGlvbiB0eXBlIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6YXRpb246IEF1dGhvcml6YXRpb247XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgc3RyaW5nIHBhcmFtZXRlcnMgdG8gYWRkIHRvIHRoZSBpbnZvY2F0aW9uIGJvZGllc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgYm9keVBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBIdHRwUGFyYW1ldGVyPjtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBzdHJpbmcgcGFyYW1ldGVycyB0byBhZGQgdG8gdGhlIGludm9jYXRpb24gaGVhZGVyc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgcGFyYW1ldGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgaGVhZGVyUGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIEh0dHBQYXJhbWV0ZXI+O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHN0cmluZyBwYXJhbWV0ZXJzIHRvIGFkZCB0byB0aGUgaW52b2NhdGlvbiBxdWVyeSBzdHJpbmdzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBxdWVyeVN0cmluZ1BhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBIdHRwUGFyYW1ldGVyPjtcbn1cblxuLyoqXG4gKiBBdXRob3JpemF0aW9uIHR5cGUgZm9yIGFuIEFQSSBEZXN0aW5hdGlvbiBDb25uZWN0aW9uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBBdXRob3JpemF0aW9uIHtcbiAgLyoqXG4gICAqIFVzZSBBUEkga2V5IGF1dGhvcml6YXRpb25cbiAgICpcbiAgICogQVBJIGtleSBhdXRob3JpemF0aW9uIGhhcyB0d28gY29tcG9uZW50czogYW4gQVBJIGtleSBuYW1lIGFuZCBhbiBBUEkga2V5IHZhbHVlLlxuICAgKiBXaGF0IHRoZXNlIGFyZSBkZXBlbmRzIG9uIHRoZSB0YXJnZXQgb2YgeW91ciBjb25uZWN0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBhcGlLZXkoYXBpS2V5TmFtZTogc3RyaW5nLCBhcGlLZXlWYWx1ZTogU2VjcmV0VmFsdWUpOiBBdXRob3JpemF0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgQXV0aG9yaXphdGlvbiB7XG4gICAgICBwdWJsaWMgX2JpbmQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYXV0aG9yaXphdGlvblR5cGU6IEF1dGhvcml6YXRpb25UeXBlLkFQSV9LRVksXG4gICAgICAgICAgYXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIGFwaUtleUF1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgIGFwaUtleU5hbWU6IGFwaUtleU5hbWUsXG4gICAgICAgICAgICAgIGFwaUtleVZhbHVlOiBhcGlLZXlWYWx1ZS51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9IGFzIENmbkNvbm5lY3Rpb24uQXV0aFBhcmFtZXRlcnNQcm9wZXJ0eSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogVXNlIHVzZXJuYW1lIGFuZCBwYXNzd29yZCBhdXRob3JpemF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGJhc2ljKHVzZXJuYW1lOiBzdHJpbmcsIHBhc3N3b3JkOiBTZWNyZXRWYWx1ZSk6IEF1dGhvcml6YXRpb24ge1xuICAgIHJldHVybiBuZXcgY2xhc3MgZXh0ZW5kcyBBdXRob3JpemF0aW9uIHtcbiAgICAgIHB1YmxpYyBfYmluZCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogQXV0aG9yaXphdGlvblR5cGUuQkFTSUMsXG4gICAgICAgICAgYXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIGJhc2ljQXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgICBwYXNzd29yZDogcGFzc3dvcmQudW5zYWZlVW53cmFwKCksIC8vIFNhZmUgdXNhZ2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSBhcyBDZm5Db25uZWN0aW9uLkF1dGhQYXJhbWV0ZXJzUHJvcGVydHksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBPQXV0aCBhdXRob3JpemF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG9hdXRoKHByb3BzOiBPQXV0aEF1dGhvcml6YXRpb25Qcm9wcyk6IEF1dGhvcml6YXRpb24ge1xuICAgIGlmICghW0h0dHBNZXRob2QuUE9TVCwgSHR0cE1ldGhvZC5HRVQsIEh0dHBNZXRob2QuUFVUXS5pbmNsdWRlcyhwcm9wcy5odHRwTWV0aG9kKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdodHRwTWV0aG9kIG11c3QgYmUgb25lIG9mIEdFVCwgUE9TVCwgUFVUJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEF1dGhvcml6YXRpb24ge1xuICAgICAgcHVibGljIF9iaW5kKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZS5PQVVUSF9DTElFTlRfQ1JFREVOVElBTFMsXG4gICAgICAgICAgYXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIG9BdXRoUGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBhdXRob3JpemF0aW9uRW5kcG9pbnQ6IHByb3BzLmF1dGhvcml6YXRpb25FbmRwb2ludCxcbiAgICAgICAgICAgICAgY2xpZW50UGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICAgIGNsaWVudElkOiBwcm9wcy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgICBjbGllbnRTZWNyZXQ6IHByb3BzLmNsaWVudFNlY3JldC51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBodHRwTWV0aG9kOiBwcm9wcy5odHRwTWV0aG9kLFxuICAgICAgICAgICAgICBvQXV0aEh0dHBQYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICAgICAgYm9keVBhcmFtZXRlcnM6IHJlbmRlckh0dHBQYXJhbWV0ZXJzKHByb3BzLmJvZHlQYXJhbWV0ZXJzKSxcbiAgICAgICAgICAgICAgICBoZWFkZXJQYXJhbWV0ZXJzOiByZW5kZXJIdHRwUGFyYW1ldGVycyhwcm9wcy5oZWFkZXJQYXJhbWV0ZXJzKSxcbiAgICAgICAgICAgICAgICBxdWVyeVN0cmluZ1BhcmFtZXRlcnM6IHJlbmRlckh0dHBQYXJhbWV0ZXJzKHByb3BzLnF1ZXJ5U3RyaW5nUGFyYW1ldGVycyksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0gYXMgQ2ZuQ29ubmVjdGlvbi5BdXRoUGFyYW1ldGVyc1Byb3BlcnR5LFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0oKTtcblxuICB9XG5cbiAgLyoqXG4gICAqIEJpbmQgdGhlIGF1dGhvcml6YXRpb24gdG8gdGhlIGNvbnN0cnVjdCBhbmQgcmV0dXJuIHRoZSBhdXRob3JpemF0aW9uIHByb3BlcnRpZXNcbiAgICpcbiAgICogQGludGVybmFsXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgX2JpbmQoKTogQXV0aG9yaXphdGlvbkJpbmRSZXN1bHQ7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYEF1dGhvcml6YXRpb24ub2F1dGgoKWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBPQXV0aEF1dGhvcml6YXRpb25Qcm9wcyB7XG5cbiAgLyoqXG4gICAqIFRoZSBVUkwgdG8gdGhlIGF1dGhvcml6YXRpb24gZW5kcG9pbnRcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6YXRpb25FbmRwb2ludDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHRvIHVzZSBmb3IgdGhlIGF1dGhvcml6YXRpb24gcmVxdWVzdC5cbiAgICpcbiAgICogKENhbiBvbmx5IGNob29zZSBQT1NULCBHRVQgb3IgUFVUKS5cbiAgICovXG4gIHJlYWRvbmx5IGh0dHBNZXRob2Q6IEh0dHBNZXRob2Q7XG5cbiAgLyoqXG4gICAqIFRoZSBjbGllbnQgSUQgdG8gdXNlIGZvciBPQXV0aCBhdXRob3JpemF0aW9uIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNsaWVudElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjbGllbnQgc2VjcmV0IGFzc29jaWF0ZWQgd2l0aCB0aGUgY2xpZW50IElEIHRvIHVzZSBmb3IgT0F1dGggYXV0aG9yaXphdGlvbiBmb3IgdGhlIGNvbm5lY3Rpb24uXG4gICAqL1xuICByZWFkb25seSBjbGllbnRTZWNyZXQ6IFNlY3JldFZhbHVlO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHN0cmluZyBwYXJhbWV0ZXJzIHRvIGFkZCB0byB0aGUgT0F1dGggcmVxdWVzdCBib2R5XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBib2R5UGFyYW1ldGVycz86IFJlY29yZDxzdHJpbmcsIEh0dHBQYXJhbWV0ZXI+O1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIHN0cmluZyBwYXJhbWV0ZXJzIHRvIGFkZCB0byB0aGUgT0F1dGggcmVxdWVzdCBoZWFkZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBhZGRpdGlvbmFsIHBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IGhlYWRlclBhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBIdHRwUGFyYW1ldGVyPjtcblxuICAvKipcbiAgICogQWRkaXRpb25hbCBzdHJpbmcgcGFyYW1ldGVycyB0byBhZGQgdG8gdGhlIE9BdXRoIHJlcXVlc3QgcXVlcnkgc3RyaW5nXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBxdWVyeVN0cmluZ1BhcmFtZXRlcnM/OiBSZWNvcmQ8c3RyaW5nLCBIdHRwUGFyYW1ldGVyPjtcbn1cblxuLyoqXG4gKiBBbiBhZGRpdGlvbmFsIEhUVFAgcGFyYW1ldGVyIHRvIHNlbmQgYWxvbmcgd2l0aCB0aGUgT0F1dGggcmVxdWVzdFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgSHR0cFBhcmFtZXRlciB7XG4gIC8qKlxuICAgKiBNYWtlIGFuIE9BdXRoUGFyYW1ldGVyIGZyb20gYSBzdHJpbmcgdmFsdWVcbiAgICpcbiAgICogVGhlIHZhbHVlIGlzIG5vdCB0cmVhdGVkIGFzIGEgc2VjcmV0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3RyaW5nKHZhbHVlOiBzdHJpbmcpOiBIdHRwUGFyYW1ldGVyIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgSHR0cFBhcmFtZXRlciB7XG4gICAgICBwdWJsaWMgX3JlbmRlcihuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBrZXk6IG5hbWUsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgaXNWYWx1ZVNlY3JldDogZmFsc2UsXG4gICAgICAgIH0gYXMgQ2ZuQ29ubmVjdGlvbi5QYXJhbWV0ZXJQcm9wZXJ0eTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhbiBPQXV0aFBhcmFtZXRlciBmcm9tIGEgc2VjcmV0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TZWNyZXQodmFsdWU6IFNlY3JldFZhbHVlKTogSHR0cFBhcmFtZXRlciB7XG4gICAgcmV0dXJuIG5ldyBjbGFzcyBleHRlbmRzIEh0dHBQYXJhbWV0ZXIge1xuICAgICAgcHVibGljIF9yZW5kZXIobmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2V5OiBuYW1lLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZS51bnNhZmVVbndyYXAoKSwgLy8gU2FmZSB1c2FnZVxuICAgICAgICAgIGlzVmFsdWVTZWNyZXQ6IHRydWUsXG4gICAgICAgIH0gYXMgQ2ZuQ29ubmVjdGlvbi5QYXJhbWV0ZXJQcm9wZXJ0eTtcbiAgICAgIH1cbiAgICB9KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBwYXJhbXRlciB2YWx1ZVxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBfcmVuZGVyKG5hbWU6IHN0cmluZyk6IGFueTtcbn1cblxuLyoqXG4gKiBSZXN1bHQgb2YgdGhlICdiaW5kJyBvcGVyYXRpb24gb2YgdGhlICdBdXRob3JpemF0aW9uJyBjbGFzc1xuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhvcml6YXRpb25CaW5kUmVzdWx0IHtcbiAgLyoqXG4gICAqIFRoZSBhdXRob3JpemF0aW9uIHR5cGVcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhvcml6YXRpb25UeXBlOiBBdXRob3JpemF0aW9uVHlwZTtcblxuICAvKipcbiAgICogVGhlIGF1dGhvcml6YXRpb24gcGFyYW1ldGVycyAoZGVwZW5kcyBvbiB0aGUgdHlwZSlcbiAgICovXG4gIHJlYWRvbmx5IGF1dGhQYXJhbWV0ZXJzOiBhbnk7XG59XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBFdmVudEJ1cyBDb25uZWN0aW9uc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIElDb25uZWN0aW9uIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBOYW1lIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgY29ubmVjdGlvbiBjcmVhdGVkLlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBjb25uZWN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gZm9yIHRoZSBzZWNyZXQgY3JlYXRlZCBmb3IgdGhlIGNvbm5lY3Rpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGNvbm5lY3Rpb25TZWNyZXRBcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2Ugd2l0aCBwcm9wZXJ0aWVzIG5lY2Vzc2FyeSB0byBpbXBvcnQgYSByZXVzYWJsZSBDb25uZWN0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvbkF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIE5hbWUgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbk5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgY29ubmVjdGlvbiBjcmVhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbkFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIGZvciB0aGUgc2VjcmV0IGNyZWF0ZWQgZm9yIHRoZSBjb25uZWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvblNlY3JldEFybjogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlZmluZSBhbiBFdmVudEJyaWRnZSBDb25uZWN0aW9uXG4gKlxuICogQHJlc291cmNlIEFXUzo6RXZlbnRzOjpDb25uZWN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJQ29ubmVjdGlvbiB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgY29ubmVjdGlvbiByZXNvdXJjZVxuICAgKiBAcGFyYW0gc2NvcGUgUGFyZW50IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgQ29uc3RydWN0IElEXG4gICAqIEBwYXJhbSBjb25uZWN0aW9uQXJuIEFSTiBvZiBpbXBvcnRlZCBjb25uZWN0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FdmVudEJ1c0FybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBjb25uZWN0aW9uQXJuOiBzdHJpbmcsIGNvbm5lY3Rpb25TZWNyZXRBcm46IHN0cmluZyk6IElDb25uZWN0aW9uIHtcbiAgICBjb25zdCBwYXJ0cyA9IFN0YWNrLm9mKHNjb3BlKS5wYXJzZUFybihjb25uZWN0aW9uQXJuKTtcblxuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRDb25uZWN0aW9uKHNjb3BlLCBpZCwge1xuICAgICAgY29ubmVjdGlvbkFybjogY29ubmVjdGlvbkFybixcbiAgICAgIGNvbm5lY3Rpb25OYW1lOiBwYXJ0cy5yZXNvdXJjZU5hbWUgfHwgJycsXG4gICAgICBjb25uZWN0aW9uU2VjcmV0QXJuOiBjb25uZWN0aW9uU2VjcmV0QXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBjb25uZWN0aW9uIHJlc291cmNlXG4gICAqIEBwYXJhbSBzY29wZSBQYXJlbnQgY29uc3RydWN0XG4gICAqIEBwYXJhbSBpZCBDb25zdHJ1Y3QgSURcbiAgICogQHBhcmFtIGF0dHJzIEltcG9ydGVkIGNvbm5lY3Rpb24gcHJvcGVydGllc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ29ubmVjdGlvbkF0dHJpYnV0ZXMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYXR0cnM6IENvbm5lY3Rpb25BdHRyaWJ1dGVzKTogSUNvbm5lY3Rpb24ge1xuICAgIHJldHVybiBuZXcgSW1wb3J0ZWRDb25uZWN0aW9uKHNjb3BlLCBpZCwgYXR0cnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBOYW1lIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIGNvbm5lY3Rpb24gY3JlYXRlZC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIEFSTiBmb3IgdGhlIHNlY3JldCBjcmVhdGVkIGZvciB0aGUgY29ubmVjdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGNvbm5lY3Rpb25TZWNyZXRBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ29ubmVjdGlvblByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLmNvbm5lY3Rpb25OYW1lLFxuICAgIH0pO1xuXG4gICAgY29uc3QgYXV0aEJpbmQgPSBwcm9wcy5hdXRob3JpemF0aW9uLl9iaW5kKCk7XG5cbiAgICBjb25zdCBpbnZvY2F0aW9uSHR0cFBhcmFtZXRlcnMgPSAhIXByb3BzLmhlYWRlclBhcmFtZXRlcnMgfHwgISFwcm9wcy5xdWVyeVN0cmluZ1BhcmFtZXRlcnMgfHwgISFwcm9wcy5ib2R5UGFyYW1ldGVycyA/IHtcbiAgICAgIGJvZHlQYXJhbWV0ZXJzOiByZW5kZXJIdHRwUGFyYW1ldGVycyhwcm9wcy5ib2R5UGFyYW1ldGVycyksXG4gICAgICBoZWFkZXJQYXJhbWV0ZXJzOiByZW5kZXJIdHRwUGFyYW1ldGVycyhwcm9wcy5oZWFkZXJQYXJhbWV0ZXJzKSxcbiAgICAgIHF1ZXJ5U3RyaW5nUGFyYW1ldGVyczogcmVuZGVySHR0cFBhcmFtZXRlcnMocHJvcHMucXVlcnlTdHJpbmdQYXJhbWV0ZXJzKSxcbiAgICB9IDogdW5kZWZpbmVkO1xuXG4gICAgbGV0IGNvbm5lY3Rpb24gPSBuZXcgQ2ZuQ29ubmVjdGlvbih0aGlzLCAnQ29ubmVjdGlvbicsIHtcbiAgICAgIGF1dGhvcml6YXRpb25UeXBlOiBhdXRoQmluZC5hdXRob3JpemF0aW9uVHlwZSxcbiAgICAgIGF1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICAgIC4uLmF1dGhCaW5kLmF1dGhQYXJhbWV0ZXJzLFxuICAgICAgICBpbnZvY2F0aW9uSHR0cFBhcmFtZXRlcnM6IGludm9jYXRpb25IdHRwUGFyYW1ldGVycyxcbiAgICAgIH0sXG4gICAgICBkZXNjcmlwdGlvbjogcHJvcHMuZGVzY3JpcHRpb24sXG4gICAgICBuYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuY29ubmVjdGlvbk5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShjb25uZWN0aW9uLnJlZik7XG4gICAgdGhpcy5jb25uZWN0aW9uQXJuID0gY29ubmVjdGlvbi5hdHRyQXJuO1xuICAgIHRoaXMuY29ubmVjdGlvblNlY3JldEFybiA9IGNvbm5lY3Rpb24uYXR0clNlY3JldEFybjtcbiAgfVxufVxuXG5jbGFzcyBJbXBvcnRlZENvbm5lY3Rpb24gZXh0ZW5kcyBSZXNvdXJjZSB7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uQXJuOiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjb25uZWN0aW9uTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgY29ubmVjdGlvblNlY3JldEFybjogc3RyaW5nO1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogQ29ubmVjdGlvbkF0dHJpYnV0ZXMpIHtcbiAgICBjb25zdCBhcm5QYXJ0cyA9IFN0YWNrLm9mKHNjb3BlKS5wYXJzZUFybihhdHRycy5jb25uZWN0aW9uQXJuKTtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIGFjY291bnQ6IGFyblBhcnRzLmFjY291bnQsXG4gICAgICByZWdpb246IGFyblBhcnRzLnJlZ2lvbixcbiAgICB9KTtcblxuICAgIHRoaXMuY29ubmVjdGlvbkFybiA9IGF0dHJzLmNvbm5lY3Rpb25Bcm47XG4gICAgdGhpcy5jb25uZWN0aW9uTmFtZSA9IGF0dHJzLmNvbm5lY3Rpb25OYW1lO1xuICAgIHRoaXMuY29ubmVjdGlvblNlY3JldEFybiA9IGF0dHJzLmNvbm5lY3Rpb25TZWNyZXRBcm47XG4gIH1cbn1cblxuLyoqXG4gKiBTdXBwb3J0ZWQgSFRUUCBvcGVyYXRpb25zLlxuICovXG5leHBvcnQgZW51bSBIdHRwTWV0aG9kIHtcbiAgLyoqIFBPU1QgKi9cbiAgUE9TVCA9ICdQT1NUJyxcbiAgLyoqIEdFVCAqL1xuICBHRVQgPSAnR0VUJyxcbiAgLyoqIEhFQUQgKi9cbiAgSEVBRCA9ICdIRUFEJyxcbiAgLyoqIE9QVElPTlMgKi9cbiAgT1BUSU9OUyA9ICdPUFRJT05TJyxcbiAgLyoqIFBVVCAqL1xuICBQVVQgPSAnUFVUJyxcbiAgLyoqIFBBVENIICovXG4gIFBBVENIID0gJ1BBVENIJyxcbiAgLyoqIERFTEVURSAqL1xuICBERUxFVEUgPSAnREVMRVRFJyxcbn1cblxuLyoqXG4gKiBTdXBwb3J0ZWQgQXV0aG9yaXphdGlvbiBUeXBlcy5cbiAqL1xuZW51bSBBdXRob3JpemF0aW9uVHlwZSB7XG4gIC8qKiBBUElfS0VZICovXG4gIEFQSV9LRVkgPSAnQVBJX0tFWScsXG4gIC8qKiBCQVNJQyAqL1xuICBCQVNJQyA9ICdCQVNJQycsXG4gIC8qKiBPQVVUSF9DTElFTlRfQ1JFREVOVElBTFMgKi9cbiAgT0FVVEhfQ0xJRU5UX0NSRURFTlRJQUxTID0gJ09BVVRIX0NMSUVOVF9DUkVERU5USUFMUycsXG59XG5cbmZ1bmN0aW9uIHJlbmRlckh0dHBQYXJhbWV0ZXJzKHBzPzogUmVjb3JkPHN0cmluZywgSHR0cFBhcmFtZXRlcj4pOiBDZm5Db25uZWN0aW9uLlBhcmFtZXRlclByb3BlcnR5W10gfCB1bmRlZmluZWQge1xuICBpZiAoIXBzIHx8IE9iamVjdC5rZXlzKHBzKS5sZW5ndGggPT09IDApIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gIHJldHVybiBPYmplY3QuZW50cmllcyhwcykubWFwKChbbmFtZSwgcF0pID0+IHAuX3JlbmRlcihuYW1lKSk7XG59Il19