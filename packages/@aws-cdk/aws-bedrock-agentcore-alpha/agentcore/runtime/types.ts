/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

/******************************************************************************
 *                                 Enums
 *****************************************************************************/

/**
 * Network mode configuration for Agent Runtime
 */
export enum NetworkMode {
  /**
   * Public network mode - accessible from the internet
   */
  PUBLIC = 'PUBLIC',
}

/**
 * Protocol configuration for Agent Runtime
 */
export enum ProtocolType {
  /**
   * Model Context Protocol
   */
  MCP = 'MCP',

  /**
   * HTTP protocol
   */
  HTTP = 'HTTP',
}

/**
 * Agent runtime status
 */
export enum AgentStatus {
  CREATING = 'CREATING',
  CREATE_FAILED = 'CREATE_FAILED',
  UPDATING = 'UPDATING',
  UPDATE_FAILED = 'UPDATE_FAILED',
  READY = 'READY',
  DELETING = 'DELETING',
}

/******************************************************************************
 *                           Network Configuration
 *****************************************************************************/

/**
 * Network configuration for Agent Runtime
 */
export interface NetworkConfiguration {
  /**
   * The network mode for the agent runtime
   */
  readonly networkMode: NetworkMode;
}

/******************************************************************************
 *                         Authorizer Configuration
 *****************************************************************************/

/**
 * Authentication mode for Agent Runtime
 */
export enum AuthenticationMode {
  /**
   * IAM SigV4 authentication (default)
   * Requires AWS credentials to sign requests
   */
  IAM = 'IAM',

  /**
   * JWT Bearer token authentication
   * Uses custom JWT tokens for authentication
   */
  JWT = 'JWT',

  /**
   * AWS Cognito User Pool authentication
   * Uses Cognito-issued JWT tokens
   */
  COGNITO = 'COGNITO',

  /**
   * OAuth 2.0 authentication
   * Supports various OAuth providers
   */
  OAUTH = 'OAUTH',
}

/**
 * Authorizer configuration for Agent Runtime
 */
export interface AuthorizerConfigurationRuntime {
  /**
   * Authentication mode
   * @default AuthenticationMode.IAM
   */
  readonly mode?: AuthenticationMode;

  /**
   * Custom JWT authorizer configuration
   */
  readonly customJWTAuthorizer?: CustomJWTAuthorizerConfigurationRuntime;

  /**
   * Cognito authorizer configuration (required when mode is COGNITO)
   */
  readonly cognitoAuthorizer?: CognitoAuthorizerConfiguration;

  /**
   * OAuth authorizer configuration (required when mode is OAUTH)
   */
  readonly oauthAuthorizer?: OAuthAuthorizerConfiguration;
}

/**
 * Custom JWT authorizer configuration
 */
export interface CustomJWTAuthorizerConfigurationRuntime {
  /**
   * OpenID Connect discovery URL
   * Must end with /.well-known/openid-configuration
   */
  readonly discoveryUrl: string;

  /**
   * List of allowed audiences
   */
  readonly allowedAudience?: string[];

  /**
   * List of allowed clients
   */
  readonly allowedClients?: string[];
}

/**
 * Cognito authorizer configuration
 */
export interface CognitoAuthorizerConfiguration {
  /**
   * Cognito User Pool ID
   */
  readonly userPoolId: string;

  /**
   * Cognito User Pool Client ID
   * @default - No client ID validation (accepts any valid client)
   */
  readonly clientId?: string;

  /**
   * AWS Region where the User Pool is located
   * @default - Same region as the stack
   */
  readonly region?: string;
}

/**
 * OAuth authorizer configuration
 */
export interface OAuthAuthorizerConfiguration {
  /**
   * OAuth provider (e.g., 'google', 'github', 'custom')
   */
  readonly provider: string;

  /**
   * OAuth discovery URL for OpenID Connect
   * Must end with /.well-known/openid-configuration
   */
  readonly discoveryUrl: string;

  /**
   * Client ID for OAuth
   */
  readonly clientId: string;

  /**
   * Allowed OAuth scopes
   */
  readonly scopes?: string[];
}
