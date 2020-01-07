import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Construct } from '@aws-cdk/core';

/**
 * Construction properties for a DatabaseSecret.
 */
export interface DatabaseSecretProps {
  /**
   * The username.
   */
  readonly username: string;

  /**
   * The KMS key to use to encrypt the secret.
   *
   * @default default master key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A database secret.
 *
 * @resource AWS::SecretsManager::Secret
 */
export class DatabaseSecret extends secretsmanager.Secret {
  constructor(scope: Construct, id: string, props: DatabaseSecretProps) {
    super(scope, id, {
      encryptionKey: props.encryptionKey,
      generateSecretString: {
        passwordLength: 30, // Oracle password cannot have more than 30 characters
        secretStringTemplate: JSON.stringify({ username: props.username }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\'
      }
    });
  }
}
