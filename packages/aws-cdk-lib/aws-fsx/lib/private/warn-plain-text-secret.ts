import type { Construct } from 'constructs';
import type { SecretValue } from '../../../core';
import { Annotations, Token } from '../../../core';

/**
 * Warn when an admin password `SecretValue` resolves to a literal string at
 * synth time, since that value will be embedded in the synthesized CloudFormation
 * template. Token-based `SecretValue`s (Secrets Manager, SSM Parameter Store,
 * CloudFormation parameters, custom dynamic references) are silent and resolve
 * at deploy time without leaving the password in the template.
 *
 * @internal
 */
export function warnIfPlainTextSecret(scope: Construct, propName: string, value: SecretValue | undefined): void {
  if (value == null) return;
  if (!Token.isUnresolved(value.unsafeUnwrap())) {
    Annotations.of(scope).addWarningV2(
      'aws-cdk-lib.aws-fsx:plainTextAdminPassword',
      `'${propName}' is a literal string and will be embedded in the synthesized CloudFormation template. Consider using a token-based SecretValue (e.g. SecretValue.secretsManager(...), SecretValue.ssmSecure(...), or SecretValue.cfnParameter(...)) so the password resolves at deploy time.`,
    );
  }
}
