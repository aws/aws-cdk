import * as ec2 from '@aws-cdk/aws-ec2';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as core from '@aws-cdk/core';
import { ParameterGroupFamilyMapping } from './private/parameter-group-family-mapping';

/**
 * The options passed to {@link IInstanceEngine.bind}.
 */
export interface InstanceEngineBindOptions {
  /**
   * The timezone of the database, set by the customer.
   *
   * @default - none (it's an optional field)
   */
  readonly timezone?: string;
}

/**
 * The type returned from the {@link IInstanceEngine.bind} method.
 * Empty for now,
 * but there might be fields added to it in the future.
 */
export interface InstanceEngineBindConfig {
}

/**
 * Interface representing a database instance (as opposed to cluster) engine.
 */
export interface IInstanceEngine {
  /** The type of the engine, for example "mysql". */
  readonly engineType: string;

  /**
   * The exact version of the engine that is used,
   * for example "5.1.42".
   *
   * @default - use the default version for this engine type
   */
  readonly engineVersion?: string;

  /** The application used by this engine to perform rotation for a single-user scenario. */
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The application used by this engine to perform rotation for a multi-user scenario. */
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * The default instanceType to use with this engine.
   */
  readonly defaultInstanceType: ec2.InstanceType;

  /**
   * Returns a new instance of this engine with a particular version specified.
   * Calling {@link engineVersion} on the returned instance will always return the provided value.
   *
   * @param engineVersion the exact engine version, for example "5.1.42"
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html#cfn-rds-dbinstance-engineversion
   */
  withVersion(engineVersion: string): IInstanceEngine;

  /**
   * Method called when the engine is used to create a new instance.
   */
  bindToInstance(scope: core.Construct, options: InstanceEngineBindOptions): InstanceEngineBindConfig;
}

abstract class AbstractInstanceEngine implements IInstanceEngine {
  public readonly engineType: string;
  public readonly engineVersion?: string;
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;
  public readonly defaultInstanceType: ec2.InstanceType;

  constructor(
    engineName: string,
    singleUserRotationApplication: secretsmanager.SecretRotationApplication,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication,
    _parameterGroupFamilies: ParameterGroupFamilyMapping[],
    defaultInstanceType?: ec2.InstanceType,
    engineVersion?: string) {

    this.engineType = engineName;
    this.singleUserRotationApplication = singleUserRotationApplication;
    this.multiUserRotationApplication = multiUserRotationApplication;
    this.defaultInstanceType = defaultInstanceType ?? ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE);
    this.engineVersion = engineVersion;
  }

  public withVersion(engineVersion: string): IInstanceEngine {
    class CopyWithVersion extends AbstractInstanceEngine {}

    return new CopyWithVersion(
      this.engineType,
      this.singleUserRotationApplication,
      this.multiUserRotationApplication,
      [],
      this.defaultInstanceType,
      engineVersion,
    );
  }

  public bindToInstance(_scope: core.Construct, _options: InstanceEngineBindOptions): InstanceEngineBindConfig {
    return {
      defaultInstanceType: this.defaultInstanceType,
    };
  }
}

class NonSqlServerInstanceEngine extends AbstractInstanceEngine {
  public bindToInstance(scope: core.Construct, options: InstanceEngineBindOptions): InstanceEngineBindConfig {
    if (options.timezone) {
      throw new Error(`timezone property can be configured only for Microsoft SQL Server, not ${this.engineType}`);
    }
    return super.bindToInstance(scope, options);
  }
}

class SqlServerInstanceEngine extends AbstractInstanceEngine {
}

/**
 * The instance engine for PostgreSQL.
 */
export interface IPostgresInstanceEngine extends IInstanceEngine {
  /** Returns a Postgres instance engine with engine version set to "9.4.26". */
  withVersion9dot4dot26(): IInstanceEngine;
}

class PostgresInstanceEngine extends NonSqlServerInstanceEngine implements IPostgresInstanceEngine {
  public withVersion9dot4dot26(): IInstanceEngine {
    return this.withVersion('9.4.26');
  }
}

/**
 * A database instance engine. Provides mapping to DatabaseEngine used for
 * secret rotation.
 */
export class DatabaseInstanceEngine {
  public static readonly MARIADB: IInstanceEngine = new NonSqlServerInstanceEngine(
    'mariadb',
    secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.MARIADB_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '10.0', parameterGroupFamily: 'mariadb10.0' },
      { engineMajorVersion: '10.1', parameterGroupFamily: 'mariadb10.1' },
      { engineMajorVersion: '10.2', parameterGroupFamily: 'mariadb10.2' },
      { engineMajorVersion: '10.3', parameterGroupFamily: 'mariadb10.3' },
    ],
  );

  public static readonly MYSQL: IInstanceEngine = new NonSqlServerInstanceEngine(
    'mysql',
    secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '5.6', parameterGroupFamily: 'mysql5.6' },
      { engineMajorVersion: '5.7', parameterGroupFamily: 'mysql5.7' },
      { engineMajorVersion: '8.0', parameterGroupFamily: 'mysql8.0' },
    ],
  );

  public static readonly ORACLE_EE: IInstanceEngine = new NonSqlServerInstanceEngine(
    'oracle-ee',
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-ee-11.2' },
      { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-ee-12.1' },
      { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-ee-12.2' },
      { engineMajorVersion: '18', parameterGroupFamily: 'oracle-ee-18' },
      { engineMajorVersion: '19', parameterGroupFamily: 'oracle-ee-19' },
    ],
  );

  public static readonly ORACLE_SE2: IInstanceEngine = new NonSqlServerInstanceEngine(
    'oracle-se2',
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-se2-12.1' },
      { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-se2-12.2' },
      { engineMajorVersion: '18', parameterGroupFamily: 'oracle-se2-18' },
      { engineMajorVersion: '19', parameterGroupFamily: 'oracle-se2-19' },
    ],
  );

  public static readonly ORACLE_SE1: IInstanceEngine = new NonSqlServerInstanceEngine(
    'oracle-se1',
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se1-11.2' },
    ],
  );

  public static readonly ORACLE_SE: IInstanceEngine = new NonSqlServerInstanceEngine(
    'oracle-se',
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se-11.2' },
    ],
  );

  public static readonly POSTGRES: IPostgresInstanceEngine = new PostgresInstanceEngine(
    'postgres',
    secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '9.3', parameterGroupFamily: 'postgres9.3' },
      { engineMajorVersion: '9.4', parameterGroupFamily: 'postgres9.4' },
      { engineMajorVersion: '9.5', parameterGroupFamily: 'postgres9.5' },
      { engineMajorVersion: '9.6', parameterGroupFamily: 'postgres9.6' },
      { engineMajorVersion: '10', parameterGroupFamily: 'postgres10' },
      { engineMajorVersion: '11', parameterGroupFamily: 'postgres11' },
    ],
  );

  public static readonly SQL_SERVER_EE: IInstanceEngine = new SqlServerInstanceEngine(
    'sqlserver-ee',
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ee-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ee-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ee-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ee-14.0' },
    ],
    ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
  );

  public static readonly SQL_SERVER_SE: IInstanceEngine = new SqlServerInstanceEngine(
    'sqlserver-se',
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-se-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-se-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-se-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-se-14.0' },
    ],
  );

  public static readonly SQL_SERVER_EX: IInstanceEngine = new SqlServerInstanceEngine(
    'sqlserver-ex',
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ex-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ex-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ex-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ex-14.0' },
    ],
  );

  public static readonly SQL_SERVER_WEB: IInstanceEngine = new SqlServerInstanceEngine(
    'sqlserver-web',
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-web-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-web-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-web-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-web-14.0' },
    ],
  );
}
