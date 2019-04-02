import { DynamicReference, DynamicReferenceService } from './dynamic-reference';
import { Token } from './token';

/**
 * Work with secret values in the CDK
 *
 * Secret values in the CDK (such as those retrieved from SecretsManager) are
 * represented as regular strings, just like other values that are only
 * available at deployment time.
 *
 * To help you avoid accidental mistakes which would lead to you putting your
 * secret values directly into a CloudFormation template, constructs that take
 * secret values will not allow you to pass in a literal secret value. They do
 * so by calling `Secret.assertSafeSecret()`.
 *
 * You can escape the check by calling `Secret.plainTex()`, but doing
 * so is highly discouraged.
 */
export class SecretValue extends Token {
  /**
   * Construct a literal secret value for use with secret-aware constructs
   *
   * *Do not use this method for any secrets that you care about.*
   *
   * The only reasonable use case for using this method is when you are testing.
   */
  public static plainText(secret: string): SecretValue {
    return new SecretValue(secret);
  }

  /**
   * Creates a `SecretValue` with a value which is dynamically loaded from AWS Secrets Manager.
   * @param secretId The ID or ARN of the secret
   * @param options Options
   */
  public static secretsManager(secretId: string, options: SecretsManagerSecretOptions = { }): SecretValue {
    if (!secretId) {
      throw new Error(`secretId cannot be empty`);
    }

    const parts = [
      secretId,
      'SecretString',
      options.jsonField      || '',
      options.versionStage || '',
      options.versionId    || ''
    ];

    const dyref = new DynamicReference(DynamicReferenceService.SecretsManager, parts.join(':'));
    return new SecretValue(() => dyref.toString());
  }
}

/**
 * Options for referencing a secret value from Secrets Manager.
 */
export interface SecretsManagerSecretOptions {
  /**
   * Specified the secret version that you want to retrieve by the staging label attached to the version.
   *
   * Can specify at most one of `versionId` and `versionStage`.
   *
   * @default AWSCURRENT
   */
  readonly versionStage?: string;

  /**
   * Specifies the unique identifier of the version of the secret you want to use.
   *
   * Can specify at most one of `versionId` and `versionStage`.
   *
   * @default AWSCURRENT
   */
  readonly versionId?: string;

  /**
   * The key of a JSON field to retrieve. This can only be used if the secret
   * stores a JSON object.
   *
   * @default - returns all the content stored in the Secrets Manager secret.
   */
  readonly jsonField?: string;
}
