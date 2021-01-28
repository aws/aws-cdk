import { Duration } from '@aws-cdk/core';
import { IParameterGroup } from './parameter-group';

/**
 * Possible Instances Types to use in Neptune cluster
 * used for defining {@link InstanceProps.instanceType}.
 */
export enum InstanceType {
  /**
   * db.r5.large
   */
  R5_LARGE = 'db.r5.large',
  /**
   * db.r5.xlarge
   */
  R5_XLARGE = 'db.r5.xlarge',
  /**
   * db.r5.2xlarge
   */
  R5_2XLARGE = 'db.r5.2xlarge',
  /**
   * db.r5.4xlarge
   */
  R5_4XLARGE = 'db.r5.4xlarge',
  /**
   * db.r5.8xlarge
   */
  R5_8XLARGE = 'db.r5.8xlarge',
  /**
   * db.r5.12xlarge
   */
  R5_12XLARGE = 'db.r5.12xlarge',
  /**
   * db.r5.24xlarge
   */
  R5_24XLARGE = 'db.r5.24xlarge',
  /**
   * db.r4.large
   */
  R4_LARGE = 'db.r4.large',
  /**
   * db.r4.xlarge
   */
  R4_XLARGE = 'db.r4.xlarge',
  /**
   * db.r4.2xlarge
   */
  R4_2XLARGE = 'db.r4.2xlarge',
  /**
   * db.r4.4xlarge
   */
  R4_4XLARGE = 'db.r4.4xlarge',
  /**
   * db.r4.8xlarge
   */
  R4_8XLARGE = 'db.r4.8xlarge',
  /**
   * db.t3.medium
   */
  T3_MEDIUM = 'db.t3.medium'
}

/**
 * Backup configuration for Neptune databases
 *
 * @default - The retention period for automated backups is 1 day.
 * The preferred backup window will be a 30-minute window selected at random
 * from an 8-hour block of time for each AWS Region.
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
   */
  readonly preferredWindow?: string;
}

/**
 * Instance properties for Neptune database instances
 */
export interface InstanceProps {
  /**
   * What type of instance to start for the replicas
   */
  readonly instanceType: InstanceType;

  /**
   * The DB parameter group to associate with the instance.
   *
   * @default no parameter group
   */
  readonly parameterGroup?: IParameterGroup;
}

