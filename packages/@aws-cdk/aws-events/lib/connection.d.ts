import { IResource, Resource, SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * An API Destination Connection
 *
 * A connection defines the authorization type and credentials to use for authorization with an API destination HTTP endpoint.
 */
export interface ConnectionProps {
    /**
     * The name of the connection.
     *
     * @default - A name is automatically generated
     */
    readonly connectionName?: string;
    /**
     * The name of the connection.
     *
     * @default - none
     */
    readonly description?: string;
    /**
     * The authorization type for the connection.
     */
    readonly authorization: Authorization;
    /**
     * Additional string parameters to add to the invocation bodies
     *
     * @default - No additional parameters
     */
    readonly bodyParameters?: Record<string, HttpParameter>;
    /**
     * Additional string parameters to add to the invocation headers
     *
     * @default - No additional parameters
     */
    readonly headerParameters?: Record<string, HttpParameter>;
    /**
     * Additional string parameters to add to the invocation query strings
     *
     * @default - No additional parameters
     */
    readonly queryStringParameters?: Record<string, HttpParameter>;
}
/**
 * Authorization type for an API Destination Connection
 */
export declare abstract class Authorization {
    /**
     * Use API key authorization
     *
     * API key authorization has two components: an API key name and an API key value.
     * What these are depends on the target of your connection.
     */
    static apiKey(apiKeyName: string, apiKeyValue: SecretValue): Authorization;
    /**
     * Use username and password authorization
     */
    static basic(username: string, password: SecretValue): Authorization;
    /**
     * Use OAuth authorization
     */
    static oauth(props: OAuthAuthorizationProps): Authorization;
    /**
     * Bind the authorization to the construct and return the authorization properties
     *
     * @internal
     */
    abstract _bind(): AuthorizationBindResult;
}
/**
 * Properties for `Authorization.oauth()`
 */
export interface OAuthAuthorizationProps {
    /**
     * The URL to the authorization endpoint
     */
    readonly authorizationEndpoint: string;
    /**
     * The method to use for the authorization request.
     *
     * (Can only choose POST, GET or PUT).
     */
    readonly httpMethod: HttpMethod;
    /**
     * The client ID to use for OAuth authorization for the connection.
     */
    readonly clientId: string;
    /**
     * The client secret associated with the client ID to use for OAuth authorization for the connection.
     */
    readonly clientSecret: SecretValue;
    /**
     * Additional string parameters to add to the OAuth request body
     *
     * @default - No additional parameters
     */
    readonly bodyParameters?: Record<string, HttpParameter>;
    /**
     * Additional string parameters to add to the OAuth request header
     *
     * @default - No additional parameters
     */
    readonly headerParameters?: Record<string, HttpParameter>;
    /**
     * Additional string parameters to add to the OAuth request query string
     *
     * @default - No additional parameters
     */
    readonly queryStringParameters?: Record<string, HttpParameter>;
}
/**
 * An additional HTTP parameter to send along with the OAuth request
 */
export declare abstract class HttpParameter {
    /**
     * Make an OAuthParameter from a string value
     *
     * The value is not treated as a secret.
     */
    static fromString(value: string): HttpParameter;
    /**
     * Make an OAuthParameter from a secret
     */
    static fromSecret(value: SecretValue): HttpParameter;
    /**
     * Render the paramter value
     *
     * @internal
     */
    abstract _render(name: string): any;
}
/**
 * Result of the 'bind' operation of the 'Authorization' class
 *
 * @internal
 */
export interface AuthorizationBindResult {
    /**
     * The authorization type
     */
    readonly authorizationType: AuthorizationType;
    /**
     * The authorization parameters (depends on the type)
     */
    readonly authParameters: any;
}
/**
 * Interface for EventBus Connections
 */
export interface IConnection extends IResource {
    /**
     * The Name for the connection.
     * @attribute
     */
    readonly connectionName: string;
    /**
     * The ARN of the connection created.
     * @attribute
     */
    readonly connectionArn: string;
    /**
     * The ARN for the secret created for the connection.
     * @attribute
     */
    readonly connectionSecretArn: string;
}
/**
 * Interface with properties necessary to import a reusable Connection
 */
export interface ConnectionAttributes {
    /**
     * The Name for the connection.
     */
    readonly connectionName: string;
    /**
     * The ARN of the connection created.
     */
    readonly connectionArn: string;
    /**
     * The ARN for the secret created for the connection.
     */
    readonly connectionSecretArn: string;
}
/**
 * Define an EventBridge Connection
 *
 * @resource AWS::Events::Connection
 */
export declare class Connection extends Resource implements IConnection {
    /**
     * Import an existing connection resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param connectionArn ARN of imported connection
     */
    static fromEventBusArn(scope: Construct, id: string, connectionArn: string, connectionSecretArn: string): IConnection;
    /**
     * Import an existing connection resource
     * @param scope Parent construct
     * @param id Construct ID
     * @param attrs Imported connection properties
     */
    static fromConnectionAttributes(scope: Construct, id: string, attrs: ConnectionAttributes): IConnection;
    /**
     * The Name for the connection.
     * @attribute
     */
    readonly connectionName: string;
    /**
     * The ARN of the connection created.
     * @attribute
     */
    readonly connectionArn: string;
    /**
     * The ARN for the secret created for the connection.
     * @attribute
     */
    readonly connectionSecretArn: string;
    constructor(scope: Construct, id: string, props: ConnectionProps);
}
/**
 * Supported HTTP operations.
 */
export declare enum HttpMethod {
    /** POST */
    POST = "POST",
    /** GET */
    GET = "GET",
    /** HEAD */
    HEAD = "HEAD",
    /** OPTIONS */
    OPTIONS = "OPTIONS",
    /** PUT */
    PUT = "PUT",
    /** PATCH */
    PATCH = "PATCH",
    /** DELETE */
    DELETE = "DELETE"
}
/**
 * Supported Authorization Types.
 */
declare enum AuthorizationType {
    /** API_KEY */
    API_KEY = "API_KEY",
    /** BASIC */
    BASIC = "BASIC",
    /** OAUTH_CLIENT_CREDENTIALS */
    OAUTH_CLIENT_CREDENTIALS = "OAUTH_CLIENT_CREDENTIALS"
}
export {};
