import { Token } from "./token";
import { unresolved } from "./unresolved";

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
 * You can escape the check by calling `Secret.unsafeSecret()`, but doing
 * so is highly discouraged.
 */
export class Secret {
  /**
   * Validate that a given secret value is not a literal
   *
   * If the value is a literal, throw an error.
   */
  public static assertSafeSecret(secretValue: string, parameterName?: string) {
    if (!unresolved(secretValue)) {
      const theParameter = parameterName ? `'${parameterName}'` : 'The value';

      // tslint:disable-next-line:max-line-length
      throw new Error(`${theParameter} should be a secret. Store it in SecretsManager or Systems Manager Parameter Store and retrieve it from there. Secret.unsafeSecret() can be used to bypass this check, but do so for testing purposes only.`);
    }
  }

  /**
   * Construct a literal secret value for use with secret-aware constructs
   *
   * *Do not use this method for any secrets that you care about.*
   *
   * The only reasonable use case for using this method is when you are testing.
   */
  public static unsafeSecret(secret: string): string {
    return new Token(() => secret).toString();
  }

  private constructor() {
  }
}