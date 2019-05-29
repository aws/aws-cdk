import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
import { SecretValue } from '@aws-cdk/cdk';
import { SecretRotationApplication } from './secret-rotation';

/**
 * A database cluster engine. Provides mapping to the serverless application
 * used for secret rotation.
 */
export class DatabaseClusterEngine {
  public static readonly Aurora = new DatabaseClusterEngine('aurora', SecretRotationApplication.MysqlRotationSingleUser);
  public static readonly AuroraMysql = new DatabaseClusterEngine('aurora-mysql', SecretRotationApplication.MysqlRotationSingleUser);
  public static readonly AuroraPostgresql = new DatabaseClusterEngine('aurora-postgresql', SecretRotationApplication.PostgresRotationSingleUser);

  /**
   * The engine.
   */
  public readonly name: string;

  /**
   * The secret rotation application.
   */
  public readonly secretRotationApplication: SecretRotationApplication;

  constructor(name: string, secretRotationApplication: SecretRotationApplication) {
    this.name = name;
    this.secretRotationApplication = secretRotationApplication;
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
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security group. If not specified a new one will be created.
   */
  readonly securityGroup?: ec2.ISecurityGroup;
}

/**
 * Backup configuration for RDS databases
 *
 * @default - The retention period for automated backups is 1 day.
 * The preferred backup window will be a 30-minute window selected at random
 * from an 8-hour block of time for each AWS Region.
 * @see https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/USER_UpgradeDBInstance.Maintenance.html#AdjustingTheMaintenanceWindow.Aurora
 */
export interface BackupProps {

  /**
   * How many days to retain the backup
   */
  readonly retentionDays: number;

  /**
   * A daily time range in 24-hours UTC format in which backups preferably execute.
   *
   * Must be at least 30 minutes long.
   *
   * Example: '01:00-02:00'
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
