import { IUserPoolClient, UserPool } from 'aws-cdk-lib/aws-cognito';

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
export interface IGatewayAuthorizer {
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
   *
   * @default - No audience validation
   */
  readonly allowedAudience?: string[];

  /**
   * Represents individual client IDs that are validated in the incoming JWT token validation process.
   *
   * @default - No client ID validation
   */
  readonly allowedClients?: string[];
}

/**
 * Custom JWT authorizer configuration implementation
 */
export class CustomJwtAuthorizer implements IGatewayAuthorizer {
  /**
   * Create a JWT authorizer from Cognito User Pool
   * @param props - The Cognito configuration
   * @returns CustomJwtAuthorizer configured for Cognito
   */
  public static fromCognito(props: CognitoAuthorizerProps) {
    return new CustomJwtAuthorizer({
      discoveryUrl: `${props.userPool.userPoolProviderUrl}/.well-known/openid-configuration`,
      allowedClients: props.allowedClients?.flatMap((client) => client.userPoolClientId),
      allowedAudience: props.allowedAudiences,
    });
  }

  public readonly authorizerType = GatewayAuthorizerType.CUSTOM_JWT;
  private readonly discoveryUrl: string;
  private readonly allowedAudience?: string[];
  private readonly allowedClients?: string[];

  constructor(config: CustomJwtConfiguration) {
    this.discoveryUrl = config.discoveryUrl;
    this.allowedAudience = config.allowedAudience;
    this.allowedClients = config.allowedClients;
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
      },
    };
  }
}

/******************************************************************************
 *                               AWS IAM
 *****************************************************************************/

/**
 * Custom JWT authorizer configuration implementation
 *
 */
export class IamAuthorizer implements IGatewayAuthorizer {
  public readonly authorizerType = GatewayAuthorizerType.AWS_IAM;

  /**
   * @internal
   */
  _render(): any {
    return {};
  }
}

/******************************************************************************
 *                               Factory
 *****************************************************************************/

export interface CognitoAuthorizerProps {
  /**
   * The Cognito User Pool to use for authentication
   */
  readonly userPool: UserPool;
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
}
/**
 * Factory class for creating Gateway Authorizers
 */
export abstract class GatewayAuthorizer {
  /**
   * AWS IAM authorizer instance
   */
  public static awsIam = new IamAuthorizer();

  /**
   * Create a custom JWT authorizer
   * @param configuration - The JWT configuration
   * @returns IGatewayAuthorizer configured for custom JWT
   */
  public static usingCustomJwt(configuration: CustomJwtConfiguration): IGatewayAuthorizer {
    // At least one of allowedAudience or allowedClients must be defined for CUSTOM_JWT authorizer
    if (!configuration.allowedAudience && !configuration.allowedClients) {
      throw new Error('At least one of allowedAudience or allowedClients must be defined for CUSTOM_JWT authorizer');
    }
    return new CustomJwtAuthorizer(configuration);
  }

  /**
   * Static method for creating a Cognito authorizer
   */
  public static usingCognito(props: CognitoAuthorizerProps): IGatewayAuthorizer {
    return CustomJwtAuthorizer.fromCognito(props);
  }
}
