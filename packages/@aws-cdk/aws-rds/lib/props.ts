import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
import secretsmanager = require('@aws-cdk/aws-secretsmanager');
import { Duration, SecretValue } from '@aws-cdk/core';
import { IParameterGroup } from './parameter-group';

/**
 * A database cluster engine. Provides mapping to the serverless application
 * used for secret rotation.
 */
export class DatabaseClusterEngine {
  /* tslint:disable max-line-length */
  public static readonly AURORA = new DatabaseClusterEngine('aurora', secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER);
  public static readonly AURORA_MYSQL = new DatabaseClusterEngine('aurora-mysql', secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER);
  public static readonly AURORA_POSTGRESQL = new DatabaseClusterEngine('aurora-postgresql', secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER, secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER);
  /* tslint:enable max-line-length */

  /**
   * The engine.
   */
  public readonly name: string;

  /**
   * The single user secret rotation application.
   */
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * The multi user secret rotation application.
   */
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  constructor(name: string, singleUserRotationApplication: secretsmanager.SecretRotationApplication, multiUserRotationApplication) {
    this.name = name;
    this.singleUserRotationApplication = singleUserRotationApplication;
    this.multiUserRotationApplication = multiUserRotationApplication;
  }
}

/**
 * Instance properties for database instances
 */
export interface InstanceProps {
  /**
   * What type of instance to start for the replicas
   */
  readonly instanceType: ec2.InstanceType;

  /**
   * What subnets to run the RDS instances in.
   *
   * Must be at least 2 subnets in two different AZs.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Where to place the instances within the VPC
   *
   * @default private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security group.
   *
   * @default a new security group is created.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The DB parameter group to associate with the instance.
   *
   * @default no parameter group
   */
  readonly parameterGroup?: IParameterGroup;
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
 * Username and password combination
 */
export interface Login {
  /**
   * Username
   */
  readonly username: string;

  /**
   * Password
   *
   * Do not put passwords in your CDK code directly.
   *
   * @default a Secrets Manager generated password
   */
  readonly password?: SecretValue;

  /**
   * KMS encryption key to encrypt the generated secret.
   *
   * @default default master key
   */
  readonly kmsKey?: kms.IKey;
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
