import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Duration, SecretValue } from '@aws-cdk/core';

/**
 * Username and password combination
 */
export interface Login {
  /**
   * Username
   */
  readonly masterUsername: string;

  /**
   * Password
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default a Secrets Manager generated password
   */
  readonly masterPassword?: SecretValue;

  /**
   * KMS encryption key to encrypt the generated secret.
   *
   * @default default master key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Options to add the multi user rotation
 */
export interface RotationMultiUserOptions {
  /**
   * The secret to rotate. It must be a JSON string with the following format:
   * ```
   * {
   *   "engine": <required: database engine>,
   *   "host": <required: instance host name>,
   *   "username": <required: username>,
   *   "password": <required: password>,
   *   "dbname": <optional: database name>,
   *   "port": <optional: if not specified, default port will be used>,
   *   "masterarn": <required: the arn of the master secret which will be used to create users/change passwords>
   * }
   * ```
   */
  readonly secret: secretsmanager.ISecret;

  /**
   * Specifies the number of days after the previous rotation before
   * Secrets Manager triggers the next automatic rotation.
   *
   * @default Duration.days(30)
   */
  readonly automaticallyAfter?: Duration;
}