import ec2 = require('@aws-cdk/aws-ec2');

/**
 * The engine for the database cluster
 */
export enum DatabaseClusterEngine {
  Aurora = 'aurora',
  AuroraMysql = 'aurora-mysql',
  AuroraPostgresql = 'aurora-postgresql',
  Neptune = 'neptune'
}

/**
 * Instance properties for database instances
 */
export interface InstanceProps {
  /**
   * What type of instance to start for the replicas
   */
  instanceType: ec2.InstanceType;

  /**
   * What subnets to run the RDS instances in.
   *
   * Must be at least 2 subnets in two different AZs.
   */
  vpc: ec2.VpcNetworkRef;

  /**
   * Where to place the instances within the VPC
   */
  vpcPlacement?: ec2.VpcPlacementStrategy;
}

/**
 * Backup configuration for RDS databases
 */
export interface BackupProps {

  /**
   * How many days to retain the backup
   */
  retentionDays: number;

  /**
   * A daily time range in 24-hours UTC format in which backups preferably execute.
   *
   * Must be at least 30 minutes long.
   *
   * Example: '01:00-02:00'
   */
  preferredWindow?: string;
}

/**
 * Username and password combination
 */
export interface Login {
  /**
   * Username
   */
  username: string;

  /**
   * Password
   *
   * Do not put passwords in your CDK code directly. Import it from a Stack
   * Parameter or the SSM Parameter Store instead.
   */
  password: string;
}

/**
 * Type for database parameters
 */
export type Parameters = {[key: string]: any};
