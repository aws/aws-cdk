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
export interface InstanceEngineConfig {
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
   * Method called when the engine is used to create a new instance.
   */
  bindToInstance(scope: core.Construct, options: InstanceEngineBindOptions): InstanceEngineConfig;
}

interface InstanceEngineBaseProps {
  readonly engineType: string;
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;
  readonly parameterGroupFamilies?: ParameterGroupFamilyMapping[];
  readonly version?: string;
}

abstract class InstanceEngineBase implements IInstanceEngine {
  public readonly engineType: string;
  public readonly engineVersion?: string;
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  constructor(props: InstanceEngineBaseProps) {
    this.engineType = props.engineType;
    this.singleUserRotationApplication = props.singleUserRotationApplication;
    this.multiUserRotationApplication = props.multiUserRotationApplication;
    this.engineVersion = props.version;
  }

  public bindToInstance(_scope: core.Construct, options: InstanceEngineBindOptions): InstanceEngineConfig {
    if (options.timezone) {
      throw new Error(`timezone property can be configured only for Microsoft SQL Server, not ${this.engineType}`);
    }
    return {
    };
  }
}

/** Common properties of all instance engines. */
interface InstanceEngineProps {
  /**
   * The exact version of the engine to use.
   *
   * @default - no version specified
   */
  readonly version?: string;
}

/**
 * Properties for MariaDB instance engines.
 * Used in {@link DatabaseInstanceEngine.mariaDb}.
 */
export interface MariaDbInstanceEngineProps extends InstanceEngineProps {
}

class MariaDbInstanceEngine extends InstanceEngineBase {
  constructor(props: MariaDbInstanceEngineProps = {}) {
    super({
      engineType: 'mariadb',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_MULTI_USER,
      parameterGroupFamilies: [
        { engineMajorVersion: '10.0', parameterGroupFamily: 'mariadb10.0' },
        { engineMajorVersion: '10.1', parameterGroupFamily: 'mariadb10.1' },
        { engineMajorVersion: '10.2', parameterGroupFamily: 'mariadb10.2' },
        { engineMajorVersion: '10.3', parameterGroupFamily: 'mariadb10.3' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for MySQL instance engines.
 * Used in {@link DatabaseInstanceEngine.mysql}.
 */
export interface MySqlInstanceEngineProps extends InstanceEngineProps {
}

class MySqlInstanceEngine extends InstanceEngineBase {
  constructor(props: MySqlInstanceEngineProps = {}) {
    super({
      engineType: 'mysql',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
      parameterGroupFamilies: [
        { engineMajorVersion: '5.6', parameterGroupFamily: 'mysql5.6' },
        { engineMajorVersion: '5.7', parameterGroupFamily: 'mysql5.7' },
        { engineMajorVersion: '8.0', parameterGroupFamily: 'mysql8.0' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for PostgreSQL instance engines.
 * Used in {@link DatabaseInstanceEngine.postgres}.
 */
export interface PostgresInstanceEngineProps extends InstanceEngineProps {
}

/**
 * The instance engine for PostgreSQL.
 */
class PostgresInstanceEngine extends InstanceEngineBase {
  constructor(props: PostgresInstanceEngineProps = {}) {
    super({
      engineType: 'postgres',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
      parameterGroupFamilies: [
        { engineMajorVersion: '9.3', parameterGroupFamily: 'postgres9.3' },
        { engineMajorVersion: '9.4', parameterGroupFamily: 'postgres9.4' },
        { engineMajorVersion: '9.5', parameterGroupFamily: 'postgres9.5' },
        { engineMajorVersion: '9.6', parameterGroupFamily: 'postgres9.6' },
        { engineMajorVersion: '10',  parameterGroupFamily: 'postgres10'  },
        { engineMajorVersion: '11',  parameterGroupFamily: 'postgres11'  },
      ],
      version: props.version,
    });
  }
}

interface OracleInstanceEngineProps extends InstanceEngineProps {
  readonly engineType: string;
  readonly parameterGroupFamilies?: ParameterGroupFamilyMapping[];
}

abstract class OracleInstanceEngine extends InstanceEngineBase {
  constructor(props: OracleInstanceEngineProps) {
    super({
      ...props,
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    });
  }
}

/**
 * Properties for Oracle Standard Edition instance engines.
 * Used in {@link DatabaseInstanceEngine.oracleSe}.
 */
export interface OracleSeInstanceEngineProps extends InstanceEngineProps {
}

class OracleSeInstanceEngine extends OracleInstanceEngine {
  constructor(props: OracleSeInstanceEngineProps = {}) {
    super({
      engineType: 'oracle-se',
      parameterGroupFamilies: [
        { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se-11.2' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for Oracle Standard Edition 1 instance engines.
 * Used in {@link DatabaseInstanceEngine.oracleSe1}.
 */
export interface OracleSe1InstanceEngineProps extends InstanceEngineProps {
}

class OracleSe1InstanceEngine extends OracleInstanceEngine {
  constructor(props: OracleSe1InstanceEngineProps = {}) {
    super({
      engineType: 'oracle-se1',
      parameterGroupFamilies: [
        { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se1-11.2' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for Oracle Standard Edition 2 instance engines.
 * Used in {@link DatabaseInstanceEngine.oracleSe2}.
 */
export interface OracleSe2InstanceEngineProps extends InstanceEngineProps {
}

class OracleSe2InstanceEngine extends OracleInstanceEngine {
  constructor(props: OracleSe2InstanceEngineProps = {}) {
    super({
      engineType: 'oracle-se2',
      parameterGroupFamilies: [
        { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-se2-12.1' },
        { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-se2-12.2' },
        { engineMajorVersion: '18',   parameterGroupFamily: 'oracle-se2-18'   },
        { engineMajorVersion: '19',   parameterGroupFamily: 'oracle-se2-19'   },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for Oracle Enterprise Edition instance engines.
 * Used in {@link DatabaseInstanceEngine.oracleEe}.
 */
export interface OracleEeInstanceEngineProps extends InstanceEngineProps {
}

class OracleEeInstanceEngine extends OracleInstanceEngine {
  constructor(props: OracleEeInstanceEngineProps = {}) {
    super({
      engineType: 'oracle-ee',
      parameterGroupFamilies: [
        { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-ee-11.2' },
        { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-ee-12.1' },
        { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-ee-12.2' },
        { engineMajorVersion: '18',   parameterGroupFamily: 'oracle-ee-18'   },
        { engineMajorVersion: '19',   parameterGroupFamily: 'oracle-ee-19'   },
      ],
      version: props.version,
    });
  }
}

interface SqlServerInstanceEngineProps extends InstanceEngineProps {
  readonly engineType: string;
  readonly parameterGroupFamilies?: ParameterGroupFamilyMapping[];
  readonly defaultInstanceType?: ec2.InstanceType;
}

abstract class SqlServerInstanceEngine extends InstanceEngineBase {
  constructor(props: SqlServerInstanceEngineProps) {
    super({
      ...props,
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    });
  }

  public bindToInstance(_scope: core.Construct, _options: InstanceEngineBindOptions): InstanceEngineConfig {
    return {
    };
  }
}

/**
 * Properties for SQL Server Standard Edition instance engines.
 * Used in {@link DatabaseInstanceEngine.sqlServerSe}.
 */
export interface SqlServerSeInstanceEngineProps extends InstanceEngineProps {
}

class SqlServerSeInstanceEngine extends SqlServerInstanceEngine {
  constructor(props: SqlServerSeInstanceEngineProps = {}) {
    super({
      engineType: 'sqlserver-se',
      parameterGroupFamilies: [
        { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-se-11.0' },
        { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-se-12.0' },
        { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-se-13.0' },
        { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-se-14.0' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for SQL Server Express Edition instance engines.
 * Used in {@link DatabaseInstanceEngine.sqlServerEx}.
 */
export interface SqlServerExInstanceEngineProps extends InstanceEngineProps {
}

class SqlServerExInstanceEngine extends SqlServerInstanceEngine {
  constructor(props: SqlServerExInstanceEngineProps = {}) {
    super({
      engineType: 'sqlserver-ex',
      parameterGroupFamilies: [
        { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ex-11.0' },
        { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ex-12.0' },
        { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ex-13.0' },
        { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ex-14.0' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for SQL Server Web Edition instance engines.
 * Used in {@link DatabaseInstanceEngine.sqlServerWeb}.
 */
export interface SqlServerWebInstanceEngineProps extends InstanceEngineProps {
}

class SqlServerWebInstanceEngine extends SqlServerInstanceEngine {
  constructor(props: SqlServerWebInstanceEngineProps = {}) {
    super({
      engineType: 'sqlserver-web',
      parameterGroupFamilies: [
        { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-web-11.0' },
        { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-web-12.0' },
        { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-web-13.0' },
        { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-web-14.0' },
      ],
      version: props.version,
    });
  }
}

/**
 * Properties for SQL Server Enterprise Edition instance engines.
 * Used in {@link DatabaseInstanceEngine.sqlServerEe}.
 */
export interface SqlServerEeInstanceEngineProps extends InstanceEngineProps {
}

class SqlServerEeInstanceEngine extends SqlServerInstanceEngine {
  constructor(props: SqlServerEeInstanceEngineProps = {}) {
    super({
      engineType: 'sqlserver-ee',
      parameterGroupFamilies: [
        { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ee-11.0' },
        { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ee-12.0' },
        { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ee-13.0' },
        { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ee-14.0' },
      ],
      defaultInstanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE),
      version: props.version,
    });
  }
}

/**
 * A database instance engine. Provides mapping to DatabaseEngine used for
 * secret rotation.
 */
export class DatabaseInstanceEngine {
  public static readonly MARIADB: IInstanceEngine = new MariaDbInstanceEngine();

  public static readonly MYSQL: IInstanceEngine = new MySqlInstanceEngine();

  public static readonly ORACLE_EE: IInstanceEngine = new OracleEeInstanceEngine();

  public static readonly ORACLE_SE2: IInstanceEngine = new OracleSe2InstanceEngine();

  public static readonly ORACLE_SE1: IInstanceEngine = new OracleSe1InstanceEngine();

  public static readonly ORACLE_SE: IInstanceEngine = new OracleSeInstanceEngine();

  public static readonly POSTGRES: IInstanceEngine = new PostgresInstanceEngine();

  public static readonly SQL_SERVER_EE: IInstanceEngine = new SqlServerEeInstanceEngine();

  public static readonly SQL_SERVER_SE: IInstanceEngine = new SqlServerSeInstanceEngine();

  public static readonly SQL_SERVER_EX: IInstanceEngine = new SqlServerExInstanceEngine();

  public static readonly SQL_SERVER_WEB: IInstanceEngine = new SqlServerWebInstanceEngine();

  /** Creates a new MariaDB instance engine. */
  public static mariaDb(props: MariaDbInstanceEngineProps): IInstanceEngine {
    return new MariaDbInstanceEngine(props);
  }

  /** Creates a new MySQL instance engine. */
  public static mysql(props: MySqlInstanceEngineProps): IInstanceEngine {
    return new MySqlInstanceEngine(props);
  }

  /** Creates a new PostgreSQL instance engine. */
  public static postgres(props: PostgresInstanceEngineProps): IInstanceEngine {
    return new PostgresInstanceEngine(props);
  }

  /** Creates a new Oracle Standard Edition instance engine. */
  public static oracleSe(props: OracleSeInstanceEngineProps): IInstanceEngine {
    return new OracleSeInstanceEngine(props);
  }

  /** Creates a new Oracle Standard Edition 1 instance engine. */
  public static oracleSe1(props: OracleSe1InstanceEngineProps): IInstanceEngine {
    return new OracleSe1InstanceEngine(props);
  }

  /** Creates a new Oracle Standard Edition 1 instance engine. */
  public static oracleSe2(props: OracleSe2InstanceEngineProps): IInstanceEngine {
    return new OracleSe2InstanceEngine(props);
  }

  /** Creates a new Oracle Enterprise Edition instance engine. */
  public static oracleEe(props: OracleEeInstanceEngineProps): IInstanceEngine {
    return new OracleEeInstanceEngine(props);
  }

  /** Creates a new SQL Server Standard Edition instance engine. */
  public static sqlServerSe(props: SqlServerSeInstanceEngineProps): IInstanceEngine {
    return new SqlServerSeInstanceEngine(props);
  }

  /** Creates a new SQL Server Express Edition instance engine. */
  public static sqlServerEx(props: SqlServerExInstanceEngineProps): IInstanceEngine {
    return new SqlServerExInstanceEngine(props);
  }

  /** Creates a new SQL Server Web Edition instance engine. */
  public static sqlServerWeb(props: SqlServerWebInstanceEngineProps): IInstanceEngine {
    return new SqlServerWebInstanceEngine(props);
  }

  /** Creates a new SQL Server Enterprise Edition instance engine. */
  public static sqlServerEe(props: SqlServerEeInstanceEngineProps): IInstanceEngine {
    return new SqlServerEeInstanceEngine(props);
  }
}
