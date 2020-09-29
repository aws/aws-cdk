import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Duration, SecretValue } from '@aws-cdk/core';
import { IParameterGroup } from './parameter-group';

/**
 * Instance properties for database instances
 */
export interface InstanceProps {
  /**
   * What type of instance to start for the replicas.
   *
   * @default - t3.medium (or, more precisely, db.t3.medium)
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * What subnets to run the RDS instances in.
   *
   * Must be at least 2 subnets in two different AZs.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Where to place the instances within the VPC
   *
   * @default - the Vpc default strategy if not specified.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security group.
   *
   * @default a new security group is created.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * The DB parameter group to associate with the instance.
   *
   * @default no parameter group
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * Whether to enable Performance Insights for the DB instance.
   *
   * @default - false, unless ``performanceInsightRentention`` or ``performanceInsightEncryptionKey`` is set.
   */
  readonly enablePerformanceInsights?: boolean;

  /**
   * The amount of time, in days, to retain Performance Insights data.
   *
   * @default 7
   */
  readonly performanceInsightRetention?: PerformanceInsightRetention;

  /**
   * The AWS KMS key for encryption of Performance Insights data.
   *
   * @default - default master key
   */
  readonly performanceInsightEncryptionKey?: kms.IKey;

  /**
   * Whether to enable automatic upgrade of minor version for the DB instance.
   *
   * @default - true
   */
  readonly autoMinorVersionUpgrade?: boolean;

  /**
   * Whether to allow upgrade of major version for the DB instance.
   *
   * @default - false
   */
  readonly allowMajorVersionUpgrade?: boolean;

  /**
   *  Whether to remove automated backups immediately after the DB instance is deleted for the DB instance.
   *
   * @default - true
   */
  readonly deleteAutomatedBackups?: boolean;
}

/**
 * Backup configuration for RDS databases
 *
 * @default - The retention period for automated backups is 1 day.
 * The preferred backup window will be a 30-minute window selected at random
 * from an 8-hour block of time for each AWS Region.
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupWindow
 */
export interface BackupProps {

  /**
   * How many days to retain the backup
   */
  readonly retention: Duration;

  /**
   * A daily time range in 24-hours UTC format in which backups preferably execute.
   *
   * Must be at least 30 minutes long.
   *
   * Example: '01:00-02:00'
   *
   * @default - a 30-minute window selected at random from an 8-hour block of
   * time for each AWS Region. To see the time blocks available, see
   * https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html#USER_WorkingWithAutomatedBackups.BackupWindow
   */
  readonly preferredWindow?: string;
}

/**
 * Options for creating a Login from a username.
 */
export interface CredentialsFromUsernameOptions {
  /**
   * Password
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default - a Secrets Manager generated password
   */
  readonly password?: SecretValue;

  /**
   * KMS encryption key to encrypt the generated secret.
   *
   * @default - default master key
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Username and password combination
 */
export abstract class Credentials {

  /**
   * Creates Credentials for the given username, and optional password and key.
   * If no password is provided, one will be generated and stored in SecretsManager.
   */
  public static fromUsername(username: string, options: CredentialsFromUsernameOptions = {}): Credentials {
    return { username, password: options.password, encryptionKey: options.encryptionKey };
  }

  /**
   * Creates Credentials from an existing SecretsManager ``Secret`` (or ``DatabaseSecret``)
   *
   * The Secret must be a JSON string with a ``username`` and ``password`` field:
   * ```
   * {
   *   ...
   *   "username": <required: username>,
   *   "password": <required: password>,
   * }
   * ```
   */
  public static fromSecret(secret: secretsmanager.Secret): Credentials {
    return {
      username: secret.secretValueFromJson('username').toString(),
      password: secret.secretValueFromJson('password'),
      encryptionKey: secret.encryptionKey,
      secret,
    };
  }

  /**
   * Username
   */
  public abstract readonly username: string;

  /**
   * Password
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default - a Secrets Manager generated password
   */
  public abstract readonly password?: SecretValue;

  /**
   * KMS encryption key to encrypt the generated secret.
   *
   * @default - default master key
   */
  public abstract readonly encryptionKey?: kms.IKey;

  /**
   * Secret used to instantiate this Login.
   *
   * @default - none
   */
  public abstract readonly secret?: secretsmanager.Secret;
}

/**
 * Credentials to update the password for a ``DatabaseInstanceFromSnapshot``.
 */
export abstract class SnapshotCredentials {
  /**
   * Generate a new password for the snapshot, using the existing username and an optional encryption key.
   *
   * Note - The username must match the existing master username of the snapshot.
   */
  public static fromGeneratedPassword(username: string, encryptionKey?: kms.IKey): SnapshotCredentials {
    return { generatePassword: true, username, encryptionKey };
  }

  /**
   * Update the snapshot login with an existing password.
   */
  public static fromPassword(password: SecretValue): SnapshotCredentials {
    return { generatePassword: false, password };
  }

  /**
   * Update the snapshot login with an existing password from a Secret.
   *
   * The Secret must be a JSON string with a ``password`` field:
   * ```
   * {
   *   ...
   *   "password": <required: password>,
   * }
   * ```
   */
  public static fromSecret(secret: secretsmanager.Secret): SnapshotCredentials {
    return {
      generatePassword: false,
      password: secret.secretValueFromJson('password'),
      secret,
    };
  }

  /**
   * The master user name.
   *
   * Must be the **current** master user name of the snapshot.
   * It is not possible to change the master user name of a RDS instance.
   *
   * @default - the existing username from the snapshot
   */
  public abstract readonly username?: string;

  /**
   * Whether a new password should be generated.
   */
  public abstract readonly generatePassword: boolean;

  /**
   * The master user password.
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default - the existing password from the snapshot
   */
  public abstract readonly password?: SecretValue;

  /**
   * KMS encryption key to encrypt the generated secret.
   *
   * @default - default master key
   */
  public abstract readonly encryptionKey?: kms.IKey;

  /**
   * Secret used to instantiate this Login.
   *
   * @default - none
   */
  public abstract readonly secret?: secretsmanager.Secret;
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

/**
 * The retention period for Performance Insight.
 */
export enum PerformanceInsightRetention {
  /**
   * Default retention period of 7 days.
   */
  DEFAULT = 7,

  /**
   * Long term retention period of 2 years.
   */
  LONG_TERM = 731
}
