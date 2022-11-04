import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { SecretValue } from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Properties for a BasicAuth
 */
export interface BasicAuthProps {
  /**
   * The username
   */
  readonly username: string;

  /**
   * The password
   *
   * @default - A Secrets Manager generated password
   */
  readonly password?: SecretValue;

  /**
   * The encryption key to use to encrypt the password when it's generated
   * in Secrets Manager
   *
   * @default - default master key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A Basic Auth configuration
 */
export interface BasicAuthConfig {
  /**
   * Whether to enable Basic Auth
   */
  readonly enableBasicAuth: boolean;

  /**
   * The username
   */
  readonly username: string;

  /**
   * The password
   */
  readonly password: string;
}

/**
 * Basic Auth configuration
 */
export class BasicAuth {
  /**
   * Creates a Basic Auth configuration from a username and a password
   *
   * @param username The username
   * @param password The password
   */
  public static fromCredentials(username: string, password: SecretValue) {
    return new BasicAuth({ username, password });
  }

  /**
   * Creates a Basic Auth configuration with a password generated in Secrets
   * Manager.
   *
   * @param username The username
   * @param encryptionKey The encryption key to use to encrypt the password in
   * Secrets Manager
   */
  public static fromGeneratedPassword(username: string, encryptionKey?: kms.IKey) {
    return new BasicAuth({ username, encryptionKey });
  }

  constructor(private readonly props: BasicAuthProps) {}

  /**
   * Binds this Basic Auth configuration to an App
   */
  public bind(scope: Construct, id: string): BasicAuthConfig {
    const config = {
      enableBasicAuth: true,
      username: this.props.username,
    };

    if (this.props.password) {
      return {
        ...config,
        password: this.props.password.unsafeUnwrap(), // Safe usage
      };
    }

    const secret = new secretsmanager.Secret(scope, id, {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: this.props.username }),
        generateStringKey: 'password',
      },
    });
    return {
      ...config,
      password: secret.secretValueFromJson('password').unsafeUnwrap(),
    };
  }
}
