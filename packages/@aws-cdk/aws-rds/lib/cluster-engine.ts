import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as core from '@aws-cdk/core';
import { IEngine } from './engine';
import { IParameterGroup, ParameterGroup } from './parameter-group';
import { calculateParameterGroupFamily, ParameterGroupFamilyMapping } from './private/parameter-group-family-mapping';

/**
 * The extra options passed to the {@link IClusterEngine.bindToCluster} method.
 */
export interface ClusterEngineBindOptions {
  /**
   * The role used for S3 importing.
   *
   * @default - none
   */
  readonly s3ImportRole?: iam.IRole;

  /**
   * The role used for S3 exporting.
   *
   *  @default - none
   */
  readonly s3ExportRole?: iam.IRole;

  /**
   * The customer-provided ParameterGroup.
   *
   * @default - none
   */
  readonly parameterGroup?: IParameterGroup;
}

/**
 * The type returned from the {@link IClusterEngine.bindToCluster} method.
 */
export interface ClusterEngineConfig {
  /**
   * The ParameterGroup to use for the cluster.
   *
   * @default - no ParameterGroup will be used
   */
  readonly parameterGroup?: IParameterGroup;

  /**
   * The port to use for this cluster,
   * unless the customer specified the port directly.
   *
   * @default - use the default port for clusters (3306)
   */
  readonly port?: number;
}

/**
 * The interface representing a database cluster (as opposed to instance) engine.
 */
export interface IClusterEngine extends IEngine {
  /** The application used by this engine to perform rotation for a single-user scenario. */
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The application used by this engine to perform rotation for a multi-user scenario. */
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /**
   * Method called when the engine is used to create a new cluster.
   */
  bindToCluster(scope: core.Construct, options: ClusterEngineBindOptions): ClusterEngineConfig;
}

interface ClusterEngineBaseProps {
  readonly engineType: string;
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;
  readonly parameterGroupFamilies?: ParameterGroupFamilyMapping[];
  readonly defaultPort?: number;
  readonly engineVersion?: string;
}

abstract class ClusterEngineBase implements IClusterEngine {
  public readonly engineType: string;
  public readonly engineVersion?: string;
  public readonly parameterGroupFamily: string;
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  private readonly defaultPort?: number;

  constructor(props: ClusterEngineBaseProps) {
    this.engineType = props.engineType;
    this.singleUserRotationApplication = props.singleUserRotationApplication;
    this.multiUserRotationApplication = props.multiUserRotationApplication;
    this.defaultPort = props.defaultPort;
    this.engineVersion = props.engineVersion;
    const parameterGroupFamily = calculateParameterGroupFamily(props.parameterGroupFamilies, props.engineVersion);
    if (parameterGroupFamily === undefined) {
      throw new Error(`No parameter group family found for database engine ${this.engineType} with version ${this.engineVersion}.`);
    }
    this.parameterGroupFamily = parameterGroupFamily;
  }

  public bindToCluster(scope: core.Construct, options: ClusterEngineBindOptions): ClusterEngineConfig {
    const parameterGroup = options.parameterGroup ?? this.defaultParameterGroup(scope);
    return {
      parameterGroup,
      port: this.defaultPort,
    };
  }

  /**
   * Return an optional default ParameterGroup,
   * possibly an imported one,
   * if one wasn't provided by the customer explicitly.
   */
  protected abstract defaultParameterGroup(scope: core.Construct): IParameterGroup | undefined;
}

abstract class MySqlClusterEngineBase extends ClusterEngineBase {
  public bindToCluster(scope: core.Construct, options: ClusterEngineBindOptions): ClusterEngineConfig {
    const config = super.bindToCluster(scope, options);
    const parameterGroup = options.parameterGroup ?? (options.s3ImportRole || options.s3ExportRole
      ? new ParameterGroup(scope, 'ClusterParameterGroup', {
        engine: this,
      })
      : config.parameterGroup);
    if (options.s3ImportRole) {
      parameterGroup?.addParameter('aurora_load_from_s3_role', options.s3ImportRole.roleArn);
    }
    if (options.s3ExportRole) {
      parameterGroup?.addParameter('aurora_select_into_s3_role', options.s3ExportRole.roleArn);
    }

    return {
      ...config,
      parameterGroup,
    };
  }
}

/**
 * Common properties of all cluster engines.
 */
interface ClusterEngineProps {
  /**
   * The exact version of the engine.
   *
   * @example "5.6.mysql_aurora.1.22.2"
   * @default - no version specified
   */
  readonly version?: string;
}

/**
 * Creation properties of the plain Aurora database cluster engine.
 * Used in {@link DatabaseClusterEngine.aurora}.
 */
export interface AuroraClusterEngineProps extends ClusterEngineProps {
}

class AuroraClusterEngine extends MySqlClusterEngineBase {
  constructor(props: AuroraClusterEngineProps = {}) {
    super({
      engineType: 'aurora',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
      parameterGroupFamilies: [
        { engineMajorVersion: '5.6', parameterGroupFamily: 'aurora5.6' },
      ],
      engineVersion: props.version,
    });
  }

  protected defaultParameterGroup(_scope: core.Construct): IParameterGroup | undefined {
    // the default.aurora5.6 ParameterGroup is actually the default,
    // so just return undefined in this case
    return undefined;
  }
}

/**
 * Creation properties of the Aurora MySQL database cluster engine.
 * Used in {@link DatabaseClusterEngine.auroraMysql}.
 */
export interface AuroraMysqlClusterEngineProps extends ClusterEngineProps {
}

class AuroraMysqlClusterEngine extends MySqlClusterEngineBase {
  constructor(props: AuroraMysqlClusterEngineProps = {}) {
    super({
      engineType: 'aurora-mysql',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
      parameterGroupFamilies: [
        { engineMajorVersion: '5.7', parameterGroupFamily: 'aurora-mysql5.7' },
      ],
      engineVersion: props.version,
    });
  }

  protected defaultParameterGroup(scope: core.Construct): IParameterGroup | undefined {
    return ParameterGroup.fromParameterGroupName(scope, 'AuroraMySqlDatabaseClusterEngineDefaultParameterGroup',
      `default.${this.parameterGroupFamily}`);
  }
}

/**
 * Creation properties of the Aurora PostgreSQL database cluster engine.
 * Used in {@link DatabaseClusterEngine.auroraPostgres}.
 */
export interface AuroraPostgresClusterEngineProps extends ClusterEngineProps {
}

class AuroraPostgresClusterEngine extends ClusterEngineBase {
  constructor(props: AuroraPostgresClusterEngineProps = {}) {
    super({
      engineType: 'aurora-postgresql',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
      parameterGroupFamilies: [
        { engineMajorVersion: '9.6', parameterGroupFamily: 'aurora-postgresql9.6' },
        { engineMajorVersion: '10',  parameterGroupFamily: 'aurora-postgresql10'  },
        { engineMajorVersion: '11',  parameterGroupFamily: 'aurora-postgresql11'  },
      ],
      defaultPort: 5432,
      engineVersion: props.version,
    });
  }

  protected defaultParameterGroup(scope: core.Construct): IParameterGroup | undefined {
    return ParameterGroup.fromParameterGroupName(scope, 'AuroraPostgreSqlDatabaseClusterEngineDefaultParameterGroup',
      `default.${this.parameterGroupFamily}`);
  }
}

/**
 * A database cluster engine. Provides mapping to the serverless application
 * used for secret rotation.
 */
export class DatabaseClusterEngine {
  public static readonly AURORA: IClusterEngine = new AuroraClusterEngine();

  public static readonly AURORA_MYSQL: IClusterEngine = new AuroraMysqlClusterEngine();

  public static readonly AURORA_POSTGRESQL: IClusterEngine = new AuroraPostgresClusterEngine();

  /** Creates a new plain Aurora database cluster engine. */
  public static aurora(props: AuroraClusterEngineProps): IClusterEngine {
    return new AuroraClusterEngine(props);
  }

  /** Creates a new Aurora MySQL database cluster engine. */
  public static auroraMysql(props: AuroraMysqlClusterEngineProps): IClusterEngine {
    return new AuroraMysqlClusterEngine(props);
  }

  /** Creates a new Aurora PostgreSQL database cluster engine. */
  public static auroraPostgres(props: AuroraPostgresClusterEngineProps): IClusterEngine {
    return new AuroraPostgresClusterEngine(props);
  }
}
