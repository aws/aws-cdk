import type { IUserPoolClient, IUserPool } from 'aws-cdk-lib/aws-cognito';
import { ValidationError } from '../validation-helpers';
import type { GatewayCustomClaim } from './custom-claim';

/******************************************************************************
 *                                Authorizer Configuration
 *****************************************************************************/

/**
 * Gateway authorizer type
 */
export enum GatewayAuthorizerType {
  /** Custom JWT authorizer type */
  CUSTOM_JWT = 'CUSTOM_JWT',
  /** AWS IAM authorizer type */
  AWS_IAM = 'AWS_IAM',
}

/**
 * Abstract interface for gateway authorizer configuration
 */
export interface IGatewayAuthorizerConfig {
  /**
   * The authorizer type
   */
  readonly authorizerType: GatewayAuthorizerType;

  /**
   * The authorizer configuration in CFN format
   * @internal
   */
  _render(): any;
}

/******************************************************************************
 *                                  Custom JWT
 *****************************************************************************/
/**
 * Custom JWT authorizer configuration
 */
export interface CustomJwtConfiguration {
  /**
   * This URL is used to fetch OpenID Connect configuration or authorization server metadata
   * for validating incoming tokens.
   *
   * Pattern: .+/\.well-known/openid-configuration
   * Required: Yes
   */
  readonly discoveryUrl: string;

  /**
   * Represents individual audience values that are validated in the incoming JWT token validation process.
   * @default - No audience validation
   */
  readonly allowedAudience?: string[];

  /**
   * Represents individual client IDs that are validated in the incoming JWT token validation process.
   * @default - No client ID validation
   */
  readonly allowedClients?: string[];

  /**
   * Represents individual scopes that are validated in the incoming JWT token validation process.
   * @default - No scope validation
   */
  readonly allowedScopes?: string[];

  /**
   * Custom claims for additional JWT token validation.
   * Allows you to validate additional fields in JWT tokens beyond the standard audience, client, and scope validations.
   * @default - No custom claim validation
   */
  readonly customClaims?: GatewayCustomClaim[];
}

/**
 * Custom JWT authorizer configuration implementation
 */
export class CustomJwtAuthorizer implements IGatewayAuthorizerConfig {
  public readonly authorizerType = GatewayAuthorizerType.CUSTOM_JWT;
  private readonly discoveryUrl: string;
  private readonly allowedAudience?: string[];
  private readonly allowedClients?: string[];
  private readonly allowedScopes?: string[];
  private readonly customClaims?: GatewayCustomClaim[];

  constructor(config: CustomJwtConfiguration) {
    this.discoveryUrl = config.discoveryUrl;
    this.allowedAudience = config.allowedAudience;
    this.allowedClients = config.allowedClients;
    this.allowedScopes = config.allowedScopes;
    this.customClaims = config.customClaims;
  }

  /**
   * @internal
   */
  public _render(): any {
    return {
      customJwtAuthorizer: {
        discoveryUrl: this.discoveryUrl,
        ...(this.allowedAudience && { allowedAudience: this.allowedAudience }),
        ...(this.allowedClients && { allowedClients: this.allowedClients }),
        ...(this.allowedScopes && { allowedScopes: this.allowedScopes }),
        ...(this.customClaims && this.customClaims.length > 0 && {
          customClaims: this.customClaims.map(claim => claim._render()),
        }),
      },
    };
  }
}

/******************************************************************************
 *                               AWS IAM
 *****************************************************************************/

/**
 * AWS IAM authorizer configuration implementation
 *
 */
export class IamAuthorizer implements IGatewayAuthorizerConfig {
  public readonly authorizerType = GatewayAuthorizerType.AWS_IAM;

  /**
   * @internal
   */
  _render(): any {
    // AWS IAM authorizer doesn't need additional configuration
    // Return null or undefined to indicate no configuration needed
    return undefined;
  }
}

/******************************************************************************
 *                               Factory
 *****************************************************************************/

export interface CognitoAuthorizerProps {
  /**
   * The Cognito User Pool to use for authentication
   */
  readonly userPool: IUserPool;
  /**
   * The allowed User Pool clients
   * @default - All clients are allowed
   */
  readonly allowedClients?: IUserPoolClient[];
  /**
   * The allowed audiences for JWT validation
   * @default - No audience validation
   */
  readonly allowedAudiences?: string[];
  /**
   * The allowed scopes for JWT validation
   * @default - No scope validation
   */
  readonly allowedScopes?: string[];
  /**
   * Custom claims for additional JWT token validation.
   * Allows you to validate additional fields in JWT tokens beyond the standard audience, client, and scope validations.
   * @default - No custom claim validation
   */
  readonly customClaims?: GatewayCustomClaim[];
}
/**
 * Factory class for creating Gateway Authorizers
 */
export abstract class GatewayAuthorizer {
  /**
   * AWS IAM authorizer instance
   */
  public static usingAwsIam(): IGatewayAuthorizerConfig {
    return new IamAuthorizer();
  }

  /**
   * Create a custom JWT authorizer
   * @param configuration - The JWT configuration
   * @returns IGatewayAuthorizerConfig configured for custom JWT
   */
  public static usingCustomJwt(configuration: CustomJwtConfiguration): IGatewayAuthorizerConfig {
    // At least one of allowedAudience, allowedClients, allowedScopes, or customClaims must be defined for CUSTOM_JWT authorizer
    if (!configuration.allowedAudience && !configuration.allowedClients && !configuration.allowedScopes && !configuration.customClaims) {
      throw new ValidationError('At least one of allowedAudience, allowedClients, allowedScopes, or customClaims must be defined for CUSTOM_JWT authorizer');
    }
    return new CustomJwtAuthorizer(configuration);
  }

  /**
   * Create a JWT authorizer from Cognito User Pool
   * @param props - The Cognito configuration
   * @returns CustomJwtAuthorizer configured for Cognito
   */
  public static usingCognito(props: CognitoAuthorizerProps): IGatewayAuthorizerConfig {
    const discoveryUrl = `https://cognito-idp.${props.userPool.env.region}.amazonaws.com/${props.userPool.userPoolId}/.well-known/openid-configuration`;

    return new CustomJwtAuthorizer({
      discoveryUrl: discoveryUrl,
      allowedClients: props.allowedClients?.flatMap((client) => client.userPoolClientId),
      allowedAudience: props.allowedAudiences,
      allowedScopes: props.allowedScopes,
      customClaims: props.customClaims,
    });
  }
}
