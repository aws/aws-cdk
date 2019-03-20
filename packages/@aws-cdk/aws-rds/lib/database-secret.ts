import kms = require('@aws-cdk/aws-kms');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties for a DatabaseSecret.
 */
export interface DatabaseSecretProps {
  /**
   * The username.
   */
  username: string;

  /**
   * The KMS key to use to encrypt the secret.
   *
   * @default default master key
   */
  encryptionKey?: kms.IEncryptionKey;
}

/**
 * A database secret.
 */
export class DatabaseSecret extends secretsmanager.Secret {
  constructor(scope: cdk.Construct, id: string, props: DatabaseSecretProps) {
    super(scope, id, {
      encryptionKey: props.encryptionKey,
      generateSecretString: ({
        passwordLength: 30, // Oracle password cannot have more than 30 characters
        secretStringTemplate: JSON.stringify({ username: props.username }),
        generateStringKey: 'password',
        excludeCharacters: '"@/\\'
      }) as secretsmanager.TemplatedSecretStringGenerator
    });
  }
}
