import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';

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
@propertyInjectable
export class DatabaseSecret extends secretsmanager.Secret {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-redshift-alpha.DatabaseSecret';

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
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
  }
}
