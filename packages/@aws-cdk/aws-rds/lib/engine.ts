import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { compare } from './private/version';
import { ParameterGroupFamily } from './props';

/**
 * Base properties for all types of engines
 * (cluster and instances).
 */
export interface BaseEngineProps {
  /** The type of the engine. */
  readonly name: string;

  /** The single-user secret rotation application. */
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The multi-user secret rotation application. */
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * The ParameterGroupFamilies to use when determining the
   * parameterGroupFamily for a given engineVersion major version.
   *
   * @default - no parameter group families
   */
  readonly parameterGroupFamilies?: ParameterGroupFamily[];
}

abstract class BaseEngine {
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

  protected readonly parameterGroupFamilies?: ParameterGroupFamily[];

  constructor(props: BaseEngineProps) {
    this.name = props.name;
    this.singleUserRotationApplication = props.singleUserRotationApplication;
    this.multiUserRotationApplication = props.multiUserRotationApplication;
    this.parameterGroupFamilies = props.parameterGroupFamilies;
  }
}

/**
 * Construction properties for {@link DatabaseClusterEngine}.
 */
export interface DatabaseClusterEngineProps extends BaseEngineProps {
}

/**
 * A database cluster engine. Provides mapping to the serverless application
 * used for secret rotation.
 */
export class DatabaseClusterEngine extends BaseEngine {
  public static readonly AURORA = new DatabaseClusterEngine({
    name: 'aurora',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '5.6', parameterGroupFamily: 'aurora5.6' },
    ],
  });

  public static readonly AURORA_MYSQL = new DatabaseClusterEngine({
    name: 'aurora-mysql',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '5.7', parameterGroupFamily: 'aurora-mysql5.7' },
    ],
  });

  public static readonly AURORA_POSTGRESQL = new DatabaseClusterEngine({
    name: 'aurora-postgresql',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '9.6', parameterGroupFamily: 'aurora-postgresql9.6' },
      { engineMajorVersion: '10', parameterGroupFamily: 'aurora-postgresql10' },
      { engineMajorVersion: '11', parameterGroupFamily: 'aurora-postgresql11' },
    ],
  });

  constructor(props: DatabaseClusterEngineProps) {
    super(props);
  }

  /**
   * Get the latest parameter group family for this engine. Latest is determined using semver on the engine major version.
   * When `engineVersion` is specified, return the parameter group family corresponding to that engine version.
   * Return undefined if no parameter group family is defined for this engine or for the requested `engineVersion`.
   */
  public parameterGroupFamily(engineVersion?: string): string | undefined {
    if (this.parameterGroupFamilies === undefined) {
      return undefined;
    }
    if (engineVersion) {
      const family = this.parameterGroupFamilies.find(x => engineVersion.startsWith(x.engineMajorVersion));
      if (family) {
        return family.parameterGroupFamily;
      }
    } else if (this.parameterGroupFamilies.length > 0) {
      const sorted = this.parameterGroupFamilies.slice().sort((a, b) => {
        return compare(a.engineMajorVersion, b.engineMajorVersion);
      }).reverse();
      return sorted[0].parameterGroupFamily;
    }
    return undefined;
  }
}

/**
 * Construction properties for {@link DatabaseInstanceEngine}.
 */
export interface DatabaseInstanceEngineProps extends BaseEngineProps {
}

/**
 * A database instance engine. Provides mapping to DatabaseEngine used for
 * secret rotation.
 */
export class DatabaseInstanceEngine extends BaseEngine {
  public static readonly MARIADB = new DatabaseInstanceEngine({
    name: 'mariadb',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '10.0', parameterGroupFamily: 'mariadb10.0' },
      { engineMajorVersion: '10.1', parameterGroupFamily: 'mariadb10.1' },
      { engineMajorVersion: '10.2', parameterGroupFamily: 'mariadb10.2' },
      { engineMajorVersion: '10.3', parameterGroupFamily: 'mariadb10.3' },
    ],
  });

  public static readonly MYSQL = new DatabaseInstanceEngine({
    name: 'mysql',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '5.6', parameterGroupFamily: 'mysql5.6' },
      { engineMajorVersion: '5.7', parameterGroupFamily: 'mysql5.7' },
      { engineMajorVersion: '8.0', parameterGroupFamily: 'mysql8.0' },
    ],
  });

  public static readonly ORACLE_EE = new DatabaseInstanceEngine({
    name: 'oracle-ee',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-ee-11.2' },
      { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-ee-12.1' },
      { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-ee-12.2' },
      { engineMajorVersion: '18', parameterGroupFamily: 'oracle-ee-18' },
      { engineMajorVersion: '19', parameterGroupFamily: 'oracle-ee-19' },
    ],
  });

  public static readonly ORACLE_SE2 = new DatabaseInstanceEngine({
    name: 'oracle-se2',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '12.1', parameterGroupFamily: 'oracle-se2-12.1' },
      { engineMajorVersion: '12.2', parameterGroupFamily: 'oracle-se2-12.2' },
      { engineMajorVersion: '18', parameterGroupFamily: 'oracle-se2-18' },
      { engineMajorVersion: '19', parameterGroupFamily: 'oracle-se2-19' },
    ],
  });

  public static readonly ORACLE_SE1 = new DatabaseInstanceEngine({
    name: 'oracle-se1',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se1-11.2' },
    ],
  });

  public static readonly ORACLE_SE = new DatabaseInstanceEngine({
    name: 'oracle-se',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.ORACLE_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11.2', parameterGroupFamily: 'oracle-se-11.2' },
    ],
  });

  public static readonly POSTGRES = new DatabaseInstanceEngine({
    name: 'postgres',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '9.3', parameterGroupFamily: 'postgres9.3' },
      { engineMajorVersion: '9.4', parameterGroupFamily: 'postgres9.4' },
      { engineMajorVersion: '9.5', parameterGroupFamily: 'postgres9.5' },
      { engineMajorVersion: '9.6', parameterGroupFamily: 'postgres9.6' },
      { engineMajorVersion: '10', parameterGroupFamily: 'postgres10' },
      { engineMajorVersion: '11', parameterGroupFamily: 'postgres11' },
    ],
  });

  public static readonly SQL_SERVER_EE = new DatabaseInstanceEngine({
    name: 'sqlserver-ee',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ee-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ee-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ee-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ee-14.0' },
    ],
  });

  public static readonly SQL_SERVER_SE = new DatabaseInstanceEngine({
    name: 'sqlserver-se',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-se-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-se-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-se-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-se-14.0' },
    ],
  });

  public static readonly SQL_SERVER_EX = new DatabaseInstanceEngine({
    name: 'sqlserver-ex',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-ex-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-ex-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-ex-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-ex-14.0' },
    ],
  });

  public static readonly SQL_SERVER_WEB = new DatabaseInstanceEngine({
    name: 'sqlserver-web',
    singleUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_SINGLE_USER,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication.SQLSERVER_ROTATION_MULTI_USER,
    parameterGroupFamilies: [
      { engineMajorVersion: '11', parameterGroupFamily: 'sqlserver-web-11.0' },
      { engineMajorVersion: '12', parameterGroupFamily: 'sqlserver-web-12.0' },
      { engineMajorVersion: '13', parameterGroupFamily: 'sqlserver-web-13.0' },
      { engineMajorVersion: '14', parameterGroupFamily: 'sqlserver-web-14.0' },
    ],
  });

  /** To make it a compile-time error to pass a DatabaseClusterEngine where a DatabaseInstanceEngine is expected. */
  public readonly isDatabaseInstanceEngine = true;

  constructor(props: DatabaseInstanceEngineProps) {
    super(props);
  }
}
