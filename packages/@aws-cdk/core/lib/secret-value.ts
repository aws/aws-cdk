import { CfnDynamicReference, CfnDynamicReferenceService } from './cfn-dynamic-reference';
import { CfnParameter } from './cfn-parameter';
import { Intrinsic } from './private/intrinsic';

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
 * You can escape the check by calling `Secret.plainText()`, but doing
 * so is highly discouraged.
 */
export class SecretValue extends Intrinsic {
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
      throw new Error('secretId cannot be empty');
    }

    if (!secretId.startsWith('arn:') && secretId.includes(':')) {
      throw new Error(`secret id "${secretId}" is not an ARN but contains ":"`);
    }

    const parts = [
      secretId,
      'SecretString',
      options.jsonField || '',
      options.versionStage || '',
      options.versionId || '',
    ];

    const dyref = new CfnDynamicReference(CfnDynamicReferenceService.SECRETS_MANAGER, parts.join(':'));
    return this.cfnDynamicReference(dyref);
  }

  /**
   * Use a secret value stored from a Systems Manager (SSM) parameter.
   *
   * @param parameterName The name of the parameter in the Systems Manager
   * Parameter Store. The parameter name is case-sensitive.
   *
   * @param version An integer that specifies the version of the parameter to
   * use. You must specify the exact version. You cannot currently specify that
   * AWS CloudFormation use the latest version of a parameter.
   */
  public static ssmSecure(parameterName: string, version: string): SecretValue {
    const parts = [parameterName, version];
    return this.cfnDynamicReference(new CfnDynamicReference(CfnDynamicReferenceService.SSM_SECURE, parts.join(':')));
  }

  /**
   * Obtain the secret value through a CloudFormation dynamic reference.
   *
   * If possible, use `SecretValue.ssmSecure` or `SecretValue.secretsManager` directly.
   *
   * @param ref The dynamic reference to use.
   */
  public static cfnDynamicReference(ref: CfnDynamicReference) {
    return new SecretValue(ref);
  }

  /**
   * Obtain the secret value through a CloudFormation parameter.
   *
   * Generally, this is not a recommended approach. AWS Secrets Manager is the
   * recommended way to reference secrets.
   *
   * @param param The CloudFormation parameter to use.
   */
  public static cfnParameter(param: CfnParameter) {
    if (!param.noEcho) {
      throw new Error('CloudFormation parameter must be configured with "NoEcho"');
    }

    return new SecretValue(param.value);
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
