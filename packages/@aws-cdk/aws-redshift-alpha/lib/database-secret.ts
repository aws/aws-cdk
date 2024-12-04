import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

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

  /**
   * Characters to not include in the generated password.
   *
   * @default '"@/\\\ \''
   */
  readonly excludeCharacters?: string;
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
        passwordLength: 30, // Redshift password could be up to 64 characters
        secretStringTemplate: JSON.stringify({ username: props.username }),
        generateStringKey: 'password',
        excludeCharacters: props.excludeCharacters ?? '"@/\\\ \'',
      },
    });
  }
}
