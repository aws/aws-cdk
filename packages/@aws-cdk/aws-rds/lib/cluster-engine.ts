import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { Construct } from 'constructs';
import { IEngine } from './engine';
import { EngineVersion } from './engine-version';
import { IParameterGroup, ParameterGroup } from './parameter-group';

/**
 * The extra options passed to the `IClusterEngine.bindToCluster` method.
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
 * The type returned from the `IClusterEngine.bindToCluster` method.
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

  /**
   * Features supported by the database engine.
   *
   * @see https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/API_DBEngineVersion.html
   *
   * @default - no features
   */
  readonly features?: ClusterEngineFeatures;
}

/**
 * Represents Database Engine features
 */
export interface ClusterEngineFeatures {
  /**
   * Feature name for the DB instance that the IAM role to access the S3 bucket for import
   * is to be associated with.
   *
   * @default - no s3Import feature name
   */
  readonly s3Import?: string;

  /**
   * Feature name for the DB instance that the IAM role to export to S3 bucket is to be
   * associated with.
   *
   * @default - no s3Export feature name
   */
  readonly s3Export?: string;
}

/**
 * The interface representing a database cluster (as opposed to instance) engine.
 */
export interface IClusterEngine extends IEngine {
  /** The application used by this engine to perform rotation for a single-user scenario. */
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The application used by this engine to perform rotation for a multi-user scenario. */
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The log types that are available with this engine type */
  readonly supportedLogTypes: string[];

  /**
   * Whether the IAM Roles used for data importing and exporting need to be combined for this Engine,
   * or can they be kept separate.
   *
   * @default false
   */
  readonly combineImportAndExportRoles?: boolean;

  /**
   * Method called when the engine is used to create a new cluster.
   */
  bindToCluster(scope: Construct, options: ClusterEngineBindOptions): ClusterEngineConfig;
}

interface ClusterEngineBaseProps {
  readonly engineType: string;
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;
  readonly defaultPort?: number;
  readonly engineVersion?: EngineVersion;
  readonly features?: ClusterEngineFeatures;
}

abstract class ClusterEngineBase implements IClusterEngine {
  public readonly engineType: string;
  public readonly engineVersion?: EngineVersion;
  public readonly parameterGroupFamily?: string;
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;
  public abstract readonly supportedLogTypes: string[];

  private readonly defaultPort?: number;
  private readonly features?: ClusterEngineFeatures;

  constructor(props: ClusterEngineBaseProps) {
    this.engineType = props.engineType;
    this.features = props.features;
    this.singleUserRotationApplication = props.singleUserRotationApplication;
    this.multiUserRotationApplication = props.multiUserRotationApplication;
    this.defaultPort = props.defaultPort;
    this.engineVersion = props.engineVersion;
    this.parameterGroupFamily = this.engineVersion ? `${this.engineType}${this.engineVersion.majorVersion}` : undefined;
  }

  public bindToCluster(scope: Construct, options: ClusterEngineBindOptions): ClusterEngineConfig {
    const parameterGroup = options.parameterGroup ?? this.defaultParameterGroup(scope);
    return {
      parameterGroup,
      port: this.defaultPort,
      features: this.features,
    };
  }

  /**
   * Return an optional default ParameterGroup,
   * possibly an imported one,
   * if one wasn't provided by the customer explicitly.
   */
  protected abstract defaultParameterGroup(scope: Construct): IParameterGroup | undefined;
}

interface MysqlClusterEngineBaseProps {
  readonly engineType: string;
  readonly engineVersion?: EngineVersion;
  readonly defaultMajorVersion: string;
  readonly combineImportAndExportRoles?: boolean;
}

abstract class MySqlClusterEngineBase extends ClusterEngineBase {
  public readonly engineFamily = 'MYSQL';
  public readonly supportedLogTypes: string[] = ['error', 'general', 'slowquery', 'audit'];
  public readonly combineImportAndExportRoles?: boolean;

  constructor(props: MysqlClusterEngineBaseProps) {
    super({
      ...props,
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
      engineVersion: props.engineVersion ? props.engineVersion : { majorVersion: props.defaultMajorVersion },
    });
    this.combineImportAndExportRoles = props.combineImportAndExportRoles;
  }

  public bindToCluster(scope: Construct, options: ClusterEngineBindOptions): ClusterEngineConfig {
    const config = super.bindToCluster(scope, options);
    const parameterGroup = options.parameterGroup ?? (options.s3ImportRole || options.s3ExportRole
      ? new ParameterGroup(scope, 'ClusterParameterGroup', {
        engine: this,
      })
      : config.parameterGroup);
    if (options.s3ImportRole) {
      // versions which combine the import and export Roles (right now, this is only 8.0)
      // require a different parameter name (identical for both import and export)
      const s3ImportParam = this.combineImportAndExportRoles
        ? 'aws_default_s3_role'
        : 'aurora_load_from_s3_role';
      parameterGroup?.addParameter(s3ImportParam, options.s3ImportRole.roleArn);
    }
    if (options.s3ExportRole) {
      const s3ExportParam = this.combineImportAndExportRoles
        ? 'aws_default_s3_role'
        : 'aurora_select_into_s3_role';
      parameterGroup?.addParameter(s3ExportParam, options.s3ExportRole.roleArn);
    }

    return {
      ...config,
      parameterGroup,
    };
  }
}

/**
 * The versions for the Aurora cluster engine
 * (those returned by `DatabaseClusterEngine.aurora`).
 */
export class AuroraEngineVersion {
  /** Version "5.6.10a". */
  public static readonly VER_10A = AuroraEngineVersion.builtIn_5_6('10a', false);
  /** Version "5.6.mysql_aurora.1.17.9". */
  public static readonly VER_1_17_9 = AuroraEngineVersion.builtIn_5_6('1.17.9');
  /** Version "5.6.mysql_aurora.1.19.0". */
  public static readonly VER_1_19_0 = AuroraEngineVersion.builtIn_5_6('1.19.0');
  /** Version "5.6.mysql_aurora.1.19.1". */
  public static readonly VER_1_19_1 = AuroraEngineVersion.builtIn_5_6('1.19.1');
  /** Version "5.6.mysql_aurora.1.19.2". */
  public static readonly VER_1_19_2 = AuroraEngineVersion.builtIn_5_6('1.19.2');
  /** Version "5.6.mysql_aurora.1.19.5". */
  public static readonly VER_1_19_5 = AuroraEngineVersion.builtIn_5_6('1.19.5');
  /** Version "5.6.mysql_aurora.1.19.6". */
  public static readonly VER_1_19_6 = AuroraEngineVersion.builtIn_5_6('1.19.6');
  /** Version "5.6.mysql_aurora.1.20.0". */
  public static readonly VER_1_20_0 = AuroraEngineVersion.builtIn_5_6('1.20.0');
  /** Version "5.6.mysql_aurora.1.20.1". */
  public static readonly VER_1_20_1 = AuroraEngineVersion.builtIn_5_6('1.20.1');
  /** Version "5.6.mysql_aurora.1.21.0". */
  public static readonly VER_1_21_0 = AuroraEngineVersion.builtIn_5_6('1.21.0');
  /** Version "5.6.mysql_aurora.1.22.0". */
  public static readonly VER_1_22_0 = AuroraEngineVersion.builtIn_5_6('1.22.0');
  /** Version "5.6.mysql_aurora.1.22.1". */
  public static readonly VER_1_22_1 = AuroraEngineVersion.builtIn_5_6('1.22.1');
  /** Version "5.6.mysql_aurora.1.22.1.3". */
  public static readonly VER_1_22_1_3 = AuroraEngineVersion.builtIn_5_6('1.22.1.3');
  /** Version "5.6.mysql_aurora.1.22.2". */
  public static readonly VER_1_22_2 = AuroraEngineVersion.builtIn_5_6('1.22.2');
  /** Version "5.6.mysql_aurora.1.22.3". */
  public static readonly VER_1_22_3 = AuroraEngineVersion.builtIn_5_6('1.22.3');
  /** Version "5.6.mysql_aurora.1.22.4". */
  public static readonly VER_1_22_4 = AuroraEngineVersion.builtIn_5_6('1.22.4');
  /** Version "5.6.mysql_aurora.1.22.5". */
  public static readonly VER_1_22_5 = AuroraEngineVersion.builtIn_5_6('1.22.5');
  /** Version "5.6.mysql_aurora.1.23.0". */
  public static readonly VER_1_23_0 = AuroraEngineVersion.builtIn_5_6('1.23.0');
  /** Version "5.6.mysql_aurora.1.23.1". */
  public static readonly VER_1_23_1 = AuroraEngineVersion.builtIn_5_6('1.23.1');
  /** Version "5.6.mysql_aurora.1.23.2". */
  public static readonly VER_1_23_2 = AuroraEngineVersion.builtIn_5_6('1.23.2');
  /** Version "5.6.mysql_aurora.1.23.3". */
  public static readonly VER_1_23_3 = AuroraEngineVersion.builtIn_5_6('1.23.3');
  /** Version "5.6.mysql_aurora.1.23.4". */
  public static readonly VER_1_23_4 = AuroraEngineVersion.builtIn_5_6('1.23.4');

  /**
   * Create a new AuroraEngineVersion with an arbitrary version.
   *
   * @param auroraFullVersion the full version string,
   *   for example "5.6.mysql_aurora.1.78.3.6"
   * @param auroraMajorVersion the major version of the engine,
   *   defaults to "5.6"
   */
  public static of(auroraFullVersion: string, auroraMajorVersion?: string): AuroraEngineVersion {
    return new AuroraEngineVersion(auroraFullVersion, auroraMajorVersion);
  }

  private static builtIn_5_6(minorVersion: string, addStandardPrefix: boolean = true): AuroraEngineVersion {
    return new AuroraEngineVersion(`5.6.${addStandardPrefix ? 'mysql_aurora.' : ''}${minorVersion}`);
  }

  /** The full version string, for example, "5.6.mysql_aurora.1.78.3.6". */
  public readonly auroraFullVersion: string;
  /** The major version of the engine. Currently, it's always "5.6". */
  public readonly auroraMajorVersion: string;

  private constructor(auroraFullVersion: string, auroraMajorVersion: string = '5.6') {
    this.auroraFullVersion = auroraFullVersion;
    this.auroraMajorVersion = auroraMajorVersion;
  }
}

/**
 * Creation properties of the plain Aurora database cluster engine.
 * Used in `DatabaseClusterEngine.aurora`.
 */
export interface AuroraClusterEngineProps {
  /** The version of the Aurora cluster engine. */
  readonly version: AuroraEngineVersion;
}

class AuroraClusterEngine extends MySqlClusterEngineBase {
  constructor(version?: AuroraEngineVersion) {
    super({
      engineType: 'aurora',
      engineVersion: version
        ? {
          fullVersion: version.auroraFullVersion,
          majorVersion: version.auroraMajorVersion,
        }
        : undefined,
      defaultMajorVersion: '5.6',
    });
  }

  protected defaultParameterGroup(_scope: Construct): IParameterGroup | undefined {
    // the default.aurora5.6 ParameterGroup is actually the default,
    // so just return undefined in this case
    return undefined;
  }
}

/**
 * The versions for the Aurora MySQL cluster engine
 * (those returned by `DatabaseClusterEngine.auroraMysql`).
 *
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraMySQLReleaseNotes/Welcome.html
 */
export class AuroraMysqlEngineVersion {
  /**
   * Version "5.7.12".
   * @deprecated Version 5.7.12 is no longer supported by Amazon RDS.
   */
  public static readonly VER_5_7_12 = AuroraMysqlEngineVersion.builtIn_5_7('12', false);
  /**
   * Version "5.7.mysql_aurora.2.03.2".
   * @deprecated Version 5.7.mysql_aurora.2.03.2 is no longer supported by Amazon RDS.
   */
  public static readonly VER_2_03_2 = AuroraMysqlEngineVersion.builtIn_5_7('2.03.2');
  /**
   * Version "5.7.mysql_aurora.2.03.3".
   * @deprecated Version 5.7.mysql_aurora.2.03.3 is no longer supported by Amazon RDS.
   */
  public static readonly VER_2_03_3 = AuroraMysqlEngineVersion.builtIn_5_7('2.03.3');
  /**
   * Version "5.7.mysql_aurora.2.03.4".
   * @deprecated Version 5.7.mysql_aurora.2.03.4 is no longer supported by Amazon RDS.
   */
  public static readonly VER_2_03_4 = AuroraMysqlEngineVersion.builtIn_5_7('2.03.4');
  /** Version "5.7.mysql_aurora.2.04.0". */
  public static readonly VER_2_04_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.0');
  /** Version "5.7.mysql_aurora.2.04.1". */
  public static readonly VER_2_04_1 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.1');
  /** Version "5.7.mysql_aurora.2.04.2". */
  public static readonly VER_2_04_2 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.2');
  /** Version "5.7.mysql_aurora.2.04.3". */
  public static readonly VER_2_04_3 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.3');
  /** Version "5.7.mysql_aurora.2.04.4". */
  public static readonly VER_2_04_4 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.4');
  /** Version "5.7.mysql_aurora.2.04.5". */
  public static readonly VER_2_04_5 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.5');
  /** Version "5.7.mysql_aurora.2.04.6". */
  public static readonly VER_2_04_6 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.6');
  /** Version "5.7.mysql_aurora.2.04.7". */
  public static readonly VER_2_04_7 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.7');
  /** Version "5.7.mysql_aurora.2.04.8". */
  public static readonly VER_2_04_8 = AuroraMysqlEngineVersion.builtIn_5_7('2.04.8');
  /**
   * Version "5.7.mysql_aurora.2.05.0".
   * @deprecated Version 5.7.mysql_aurora.2.05.0 is no longer supported by Amazon RDS.
   */
  public static readonly VER_2_05_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.05.0');
  /**
   * Version "5.7.mysql_aurora.2.06.0".
   * @deprecated Version 5.7.mysql_aurora.2.06.0 is no longer supported by Amazon RDS.
   */
  public static readonly VER_2_06_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.06.0');
  /** Version "5.7.mysql_aurora.2.07.0". */
  public static readonly VER_2_07_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.0');
  /** Version "5.7.mysql_aurora.2.07.1". */
  public static readonly VER_2_07_1 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.1');
  /** Version "5.7.mysql_aurora.2.07.2". */
  public static readonly VER_2_07_2 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.2');
  /** Version "5.7.mysql_aurora.2.07.3". */
  public static readonly VER_2_07_3 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.3');
  /** Version "5.7.mysql_aurora.2.07.4". */
  public static readonly VER_2_07_4 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.4');
  /** Version "5.7.mysql_aurora.2.07.5". */
  public static readonly VER_2_07_5 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.5');
  /** Version "5.7.mysql_aurora.2.07.6". */
  public static readonly VER_2_07_6 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.6');
  /** Version "5.7.mysql_aurora.2.07.7". */
  public static readonly VER_2_07_7 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.7');
  /** Version "5.7.mysql_aurora.2.07.8". */
  public static readonly VER_2_07_8 = AuroraMysqlEngineVersion.builtIn_5_7('2.07.8');
  /** Version "5.7.mysql_aurora.2.08.0". */
  public static readonly VER_2_08_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.08.0');
  /** Version "5.7.mysql_aurora.2.08.1". */
  public static readonly VER_2_08_1 = AuroraMysqlEngineVersion.builtIn_5_7('2.08.1');
  /** Version "5.7.mysql_aurora.2.08.2". */
  public static readonly VER_2_08_2 = AuroraMysqlEngineVersion.builtIn_5_7('2.08.2');
  /** Version "5.7.mysql_aurora.2.08.3". */
  public static readonly VER_2_08_3 = AuroraMysqlEngineVersion.builtIn_5_7('2.08.3');
  /** Version "5.7.mysql_aurora.2.08.4". */
  public static readonly VER_2_08_4 = AuroraMysqlEngineVersion.builtIn_5_7('2.08.4');
  /** Version "5.7.mysql_aurora.2.09.0". */
  public static readonly VER_2_09_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.09.0');
  /** Version "5.7.mysql_aurora.2.09.1". */
  public static readonly VER_2_09_1 = AuroraMysqlEngineVersion.builtIn_5_7('2.09.1');
  /** Version "5.7.mysql_aurora.2.09.2". */
  public static readonly VER_2_09_2 = AuroraMysqlEngineVersion.builtIn_5_7('2.09.2');
  /** Version "5.7.mysql_aurora.2.09.3". */
  public static readonly VER_2_09_3 = AuroraMysqlEngineVersion.builtIn_5_7('2.09.3');
  /** Version "5.7.mysql_aurora.2.10.0". */
  public static readonly VER_2_10_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.10.0');
  /** Version "5.7.mysql_aurora.2.10.1". */
  public static readonly VER_2_10_1 = AuroraMysqlEngineVersion.builtIn_5_7('2.10.1');
  /** Version "5.7.mysql_aurora.2.10.2". */
  public static readonly VER_2_10_2 = AuroraMysqlEngineVersion.builtIn_5_7('2.10.2');
  /** Version "5.7.mysql_aurora.2.10.3". */
  public static readonly VER_2_10_3 = AuroraMysqlEngineVersion.builtIn_5_7('2.10.3');
  /** Version "5.7.mysql_aurora.2.11.0". */
  public static readonly VER_2_11_0 = AuroraMysqlEngineVersion.builtIn_5_7('2.11.0');
  /** Version "5.7.mysql_aurora.2.11.1". */
  public static readonly VER_2_11_1 = AuroraMysqlEngineVersion.builtIn_5_7('2.11.1');
  /** Version "8.0.mysql_aurora.3.01.0". */
  public static readonly VER_3_01_0 = AuroraMysqlEngineVersion.builtIn_8_0('3.01.0');
  /** Version "8.0.mysql_aurora.3.01.1". */
  public static readonly VER_3_01_1 = AuroraMysqlEngineVersion.builtIn_8_0('3.01.1');
  /** Version "8.0.mysql_aurora.3.02.0". */
  public static readonly VER_3_02_0 = AuroraMysqlEngineVersion.builtIn_8_0('3.02.0');
  /** Version "8.0.mysql_aurora.3.02.1". */
  public static readonly VER_3_02_1 = AuroraMysqlEngineVersion.builtIn_8_0('3.02.1');
  /** Version "8.0.mysql_aurora.3.02.2". */
  public static readonly VER_3_02_2 = AuroraMysqlEngineVersion.builtIn_8_0('3.02.2');
  /** Version "8.0.mysql_aurora.3.03.0". */
  public static readonly VER_3_03_0 = AuroraMysqlEngineVersion.builtIn_8_0('3.03.0');

  /**
   * Create a new AuroraMysqlEngineVersion with an arbitrary version.
   *
   * @param auroraMysqlFullVersion the full version string,
   *   for example "5.7.mysql_aurora.2.78.3.6"
   * @param auroraMysqlMajorVersion the major version of the engine,
   *   defaults to "5.7"
   */
  public static of(auroraMysqlFullVersion: string, auroraMysqlMajorVersion?: string): AuroraMysqlEngineVersion {
    return new AuroraMysqlEngineVersion(auroraMysqlFullVersion, auroraMysqlMajorVersion);
  }

  private static builtIn_5_7(minorVersion: string, addStandardPrefix: boolean = true): AuroraMysqlEngineVersion {
    return new AuroraMysqlEngineVersion(`5.7.${addStandardPrefix ? 'mysql_aurora.' : ''}${minorVersion}`);
  }

  private static builtIn_8_0(minorVersion: string): AuroraMysqlEngineVersion {
    // 8.0 of the MySQL engine needs to combine the import and export Roles
    return new AuroraMysqlEngineVersion(`8.0.mysql_aurora.${minorVersion}`, '8.0', true);
  }

  /** The full version string, for example, "5.7.mysql_aurora.1.78.3.6". */
  public readonly auroraMysqlFullVersion: string;
  /** The major version of the engine. Currently, it's either "5.7", or "8.0". */
  public readonly auroraMysqlMajorVersion: string;
  /**
   * Whether this version requires combining the import and export IAM Roles.
   *
   * @internal
   */
  public readonly _combineImportAndExportRoles?: boolean;

  private constructor(
    auroraMysqlFullVersion: string, auroraMysqlMajorVersion: string = '5.7',
    combineImportAndExportRoles?: boolean,
  ) {
    this.auroraMysqlFullVersion = auroraMysqlFullVersion;
    this.auroraMysqlMajorVersion = auroraMysqlMajorVersion;
    this._combineImportAndExportRoles = combineImportAndExportRoles;
  }
}

/**
 * Creation properties of the Aurora MySQL database cluster engine.
 * Used in `DatabaseClusterEngine.auroraMysql`.
 */
export interface AuroraMysqlClusterEngineProps {
  /** The version of the Aurora MySQL cluster engine. */
  readonly version: AuroraMysqlEngineVersion;
}

class AuroraMysqlClusterEngine extends MySqlClusterEngineBase {
  constructor(version?: AuroraMysqlEngineVersion) {
    super({
      engineType: 'aurora-mysql',
      engineVersion: version
        ? {
          fullVersion: version.auroraMysqlFullVersion,
          majorVersion: version.auroraMysqlMajorVersion,
        }
        : undefined,
      defaultMajorVersion: '5.7',
      combineImportAndExportRoles: version?._combineImportAndExportRoles,
    });
  }

  protected defaultParameterGroup(scope: Construct): IParameterGroup | undefined {
    return ParameterGroup.fromParameterGroupName(scope, 'AuroraMySqlDatabaseClusterEngineDefaultParameterGroup',
      `default.${this.parameterGroupFamily}`);
  }
}

/**
 * Features supported by this version of the Aurora Postgres cluster engine.
 */
export interface AuroraPostgresEngineFeatures {
  /**
   * Whether this version of the Aurora Postgres cluster engine supports the S3 data import feature.
   *
   * @default false
   */
  readonly s3Import?: boolean;

  /**
   * Whether this version of the Aurora Postgres cluster engine supports the S3 data export feature.
   *
   * @default false
   */
  readonly s3Export?: boolean;
}

/**
 * The versions for the Aurora PostgreSQL cluster engine
 * (those returned by `DatabaseClusterEngine.auroraPostgres`).
 *
 * https://docs.aws.amazon.com/AmazonRDS/latest/AuroraPostgreSQLReleaseNotes/AuroraPostgreSQL.Updates.html
 */
export class AuroraPostgresEngineVersion {
  /**
   * Version "9.6.8".
   * @deprecated Version 9.6.8 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_8 = AuroraPostgresEngineVersion.of('9.6.8', '9.6');
  /**
   * Version "9.6.9".
   * @deprecated Version 9.6.9 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_9 = AuroraPostgresEngineVersion.of('9.6.9', '9.6');
  /**
   * Version "9.6.11".
   * @deprecated Version 9.6.11 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_11 = AuroraPostgresEngineVersion.of('9.6.11', '9.6');
  /**
   * Version "9.6.12".
   * @deprecated Version 9.6.12 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_12 = AuroraPostgresEngineVersion.of('9.6.12', '9.6');
  /**
   * Version "9.6.16".
   * @deprecated Version 9.6.16 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_16 = AuroraPostgresEngineVersion.of('9.6.16', '9.6');
  /**
   * Version "9.6.17".
   * @deprecated Version 9.6.17 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_17 = AuroraPostgresEngineVersion.of('9.6.17', '9.6');
  /**
   * Version "9.6.18".
   * @deprecated Version 9.6.18 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_18 = AuroraPostgresEngineVersion.of('9.6.18', '9.6');
  /**
   * Version "9.6.19".
   * @deprecated Version 9.6.19 is no longer supported by Amazon RDS.
   */
  public static readonly VER_9_6_19 = AuroraPostgresEngineVersion.of('9.6.19', '9.6');
  /**
   *  Version "10.4".
   * @deprecated Version 10.4 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_4 = AuroraPostgresEngineVersion.of('10.4', '10');
  /**
   *  Version "10.5".
   * @deprecated Version 10.5 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_5 = AuroraPostgresEngineVersion.of('10.5', '10');
  /**
   *  Version "10.6".
   * @deprecated Version 10.6 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_6 = AuroraPostgresEngineVersion.of('10.6', '10');
  /**
   *  Version "10.7".
   * @deprecated Version 10.7 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_7 = AuroraPostgresEngineVersion.of('10.7', '10', { s3Import: true });
  /**
   *  Version "10.11".
   * @deprecated Version 10.11 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_11 = AuroraPostgresEngineVersion.of('10.11', '10', { s3Import: true, s3Export: true });
  /**
   *  Version "10.12".
   * @deprecated Version 10.12 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_12 = AuroraPostgresEngineVersion.of('10.12', '10', { s3Import: true, s3Export: true });
  /**
   *  Version "10.13".
   * @deprecated Version 10.13 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_13 = AuroraPostgresEngineVersion.of('10.13', '10', { s3Import: true, s3Export: true });
  /**
   *  Version "10.14".
   * @deprecated Version 10.14 is no longer supported by Amazon RDS.
   */
  public static readonly VER_10_14 = AuroraPostgresEngineVersion.of('10.14', '10', { s3Import: true, s3Export: true });
  /** Version "10.16". */
  public static readonly VER_10_16 = AuroraPostgresEngineVersion.of('10.16', '10', { s3Import: true, s3Export: true });
  /** Version "10.17". */
  public static readonly VER_10_17 = AuroraPostgresEngineVersion.of('10.17', '10', { s3Import: true, s3Export: true });
  /** Version "10.18". */
  public static readonly VER_10_18 = AuroraPostgresEngineVersion.of('10.18', '10', { s3Import: true, s3Export: true });
  /** Version "10.19". */
  public static readonly VER_10_19 = AuroraPostgresEngineVersion.of('10.19', '10', { s3Import: true, s3Export: true });
  /** Version "10.20". */
  public static readonly VER_10_20 = AuroraPostgresEngineVersion.of('10.20', '10', { s3Import: true, s3Export: true });
  /** Version "10.21". */
  public static readonly VER_10_21 = AuroraPostgresEngineVersion.of('10.21', '10', { s3Import: true, s3Export: true });
  /**
   *  Version "11.4".
   * @deprecated Version 11.4 is no longer supported by Amazon RDS.
   */
  public static readonly VER_11_4 = AuroraPostgresEngineVersion.of('11.4', '11', { s3Import: true });
  /**
   *  Version "11.6".
   * @deprecated Version 11.6 is no longer supported by Amazon RDS.
   */
  public static readonly VER_11_6 = AuroraPostgresEngineVersion.of('11.6', '11', { s3Import: true, s3Export: true });
  /**
   *  Version "11.7".
   * @deprecated Version 11.7 is no longer supported by Amazon RDS.
   */
  public static readonly VER_11_7 = AuroraPostgresEngineVersion.of('11.7', '11', { s3Import: true, s3Export: true });
  /**
   *  Version "11.8".
   * @deprecated Version 11.8 is no longer supported by Amazon RDS.
   */
  public static readonly VER_11_8 = AuroraPostgresEngineVersion.of('11.8', '11', { s3Import: true, s3Export: true });
  /** Version "11.9". */
  public static readonly VER_11_9 = AuroraPostgresEngineVersion.of('11.9', '11', { s3Import: true, s3Export: true });
  /** Version "11.11". */
  public static readonly VER_11_11 = AuroraPostgresEngineVersion.of('11.11', '11', { s3Import: true, s3Export: true });
  /** Version "11.12". */
  public static readonly VER_11_12 = AuroraPostgresEngineVersion.of('11.12', '11', { s3Import: true, s3Export: true });
  /** Version "11.13". */
  public static readonly VER_11_13 = AuroraPostgresEngineVersion.of('11.13', '11', { s3Import: true, s3Export: true });
  /** Version "11.14". */
  public static readonly VER_11_14 = AuroraPostgresEngineVersion.of('11.14', '11', { s3Import: true, s3Export: true });
  /** Version "11.15". */
  public static readonly VER_11_15 = AuroraPostgresEngineVersion.of('11.15', '11', { s3Import: true, s3Export: true });
  /** Version "11.16". */
  public static readonly VER_11_16 = AuroraPostgresEngineVersion.of('11.16', '11', { s3Import: true, s3Export: true });
  /** Version "11.17". */
  public static readonly VER_11_17 = AuroraPostgresEngineVersion.of('11.17', '11', { s3Import: true, s3Export: true });
  /** Version "11.18". */
  public static readonly VER_11_18 = AuroraPostgresEngineVersion.of('11.18', '11', { s3Import: true, s3Export: true });
  /** Version "12.4". */
  public static readonly VER_12_4 = AuroraPostgresEngineVersion.of('12.4', '12', { s3Import: true, s3Export: true });
  /** Version "12.6". */
  public static readonly VER_12_6 = AuroraPostgresEngineVersion.of('12.6', '12', { s3Import: true, s3Export: true });
  /** Version "12.7". */
  public static readonly VER_12_7 = AuroraPostgresEngineVersion.of('12.7', '12', { s3Import: true, s3Export: true });
  /** Version "12.8". */
  public static readonly VER_12_8 = AuroraPostgresEngineVersion.of('12.8', '12', { s3Import: true, s3Export: true });
  /** Version "12.9". */
  public static readonly VER_12_9 = AuroraPostgresEngineVersion.of('12.9', '12', { s3Import: true, s3Export: true });
  /** Version "12.10". */
  public static readonly VER_12_10 = AuroraPostgresEngineVersion.of('12.10', '12', { s3Import: true, s3Export: true });
  /** Version "12.11". */
  public static readonly VER_12_11 = AuroraPostgresEngineVersion.of('12.11', '12', { s3Import: true, s3Export: true });
  /** Version "12.12". */
  public static readonly VER_12_12 = AuroraPostgresEngineVersion.of('12.12', '12', { s3Import: true, s3Export: true });
  /** Version "12.13". */
  public static readonly VER_12_13 = AuroraPostgresEngineVersion.of('12.13', '12', { s3Import: true, s3Export: true });
  /** Version "13.3". */
  public static readonly VER_13_3 = AuroraPostgresEngineVersion.of('13.3', '13', { s3Import: true, s3Export: true });
  /** Version "13.4". */
  public static readonly VER_13_4 = AuroraPostgresEngineVersion.of('13.4', '13', { s3Import: true, s3Export: true });
  /** Version "13.5". */
  public static readonly VER_13_5 = AuroraPostgresEngineVersion.of('13.5', '13', { s3Import: true, s3Export: true });
  /** Version "13.6". */
  public static readonly VER_13_6 = AuroraPostgresEngineVersion.of('13.6', '13', { s3Import: true, s3Export: true });
  /** Version "13.7". */
  public static readonly VER_13_7 = AuroraPostgresEngineVersion.of('13.7', '13', { s3Import: true, s3Export: true });
  /** Version "13.8". */
  public static readonly VER_13_8 = AuroraPostgresEngineVersion.of('13.8', '13', { s3Import: true, s3Export: true });
  /** Version "13.9". */
  public static readonly VER_13_9 = AuroraPostgresEngineVersion.of('13.9', '13', { s3Import: true, s3Export: true });
  /** Version "14.3". */
  public static readonly VER_14_3 = AuroraPostgresEngineVersion.of('14.3', '14', { s3Import: true, s3Export: true });
  /**
   *  Version "14.4".
   * @deprecated Version 14.4 is no longer supported by Amazon RDS.
   */
  public static readonly VER_14_4 = AuroraPostgresEngineVersion.of('14.4', '14', { s3Import: true, s3Export: true });
  /** Version "14.5". */
  public static readonly VER_14_5 = AuroraPostgresEngineVersion.of('14.5', '14', { s3Import: true, s3Export: true });
  /** Version "14.6". */
  public static readonly VER_14_6 = AuroraPostgresEngineVersion.of('14.6', '14', { s3Import: true, s3Export: true });

  /**
   * Create a new AuroraPostgresEngineVersion with an arbitrary version.
   *
   * @param auroraPostgresFullVersion the full version string,
   *   for example "9.6.25.1"
   * @param auroraPostgresMajorVersion the major version of the engine,
   *   for example "9.6"
   */
  public static of(auroraPostgresFullVersion: string, auroraPostgresMajorVersion: string,
    auroraPostgresFeatures?: AuroraPostgresEngineFeatures): AuroraPostgresEngineVersion {

    return new AuroraPostgresEngineVersion(auroraPostgresFullVersion, auroraPostgresMajorVersion, auroraPostgresFeatures);
  }

  /** The full version string, for example, "9.6.25.1". */
  public readonly auroraPostgresFullVersion: string;
  /** The major version of the engine, for example, "9.6". */
  public readonly auroraPostgresMajorVersion: string;
  /**
   * The supported features for the DB engine
   *
   * @internal
   */
  public readonly _features: ClusterEngineFeatures;

  private constructor(auroraPostgresFullVersion: string, auroraPostgresMajorVersion: string, auroraPostgresFeatures?: AuroraPostgresEngineFeatures) {
    this.auroraPostgresFullVersion = auroraPostgresFullVersion;
    this.auroraPostgresMajorVersion = auroraPostgresMajorVersion;
    this._features = {
      s3Import: auroraPostgresFeatures?.s3Import ? 's3Import' : undefined,
      s3Export: auroraPostgresFeatures?.s3Export ? 's3Export' : undefined,
    };
  }
}

/**
 * Creation properties of the Aurora PostgreSQL database cluster engine.
 * Used in `DatabaseClusterEngine.auroraPostgres`.
 */
export interface AuroraPostgresClusterEngineProps {
  /** The version of the Aurora PostgreSQL cluster engine. */
  readonly version: AuroraPostgresEngineVersion;
}

class AuroraPostgresClusterEngine extends ClusterEngineBase {
  /**
   * feature name for the S3 data import feature
   */
  private static readonly S3_IMPORT_FEATURE_NAME = 's3Import';

  /**
   * feature name for the S3 data export feature
   */
  private static readonly S3_EXPORT_FEATURE_NAME = 's3Export';

  public readonly engineFamily = 'POSTGRESQL';
  public readonly defaultUsername = 'postgres';
  public readonly supportedLogTypes: string[] = ['postgresql'];

  constructor(version?: AuroraPostgresEngineVersion) {
    super({
      engineType: 'aurora-postgresql',
      singleUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
      multiUserRotationApplication: secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
      defaultPort: 5432,
      engineVersion: version
        ? {
          fullVersion: version.auroraPostgresFullVersion,
          majorVersion: version.auroraPostgresMajorVersion,
        }
        : undefined,
      features: version
        ? {
          s3Import: version._features.s3Import ? AuroraPostgresClusterEngine.S3_IMPORT_FEATURE_NAME : undefined,
          s3Export: version._features.s3Export ? AuroraPostgresClusterEngine.S3_EXPORT_FEATURE_NAME : undefined,
        }
        : {
          s3Import: AuroraPostgresClusterEngine.S3_IMPORT_FEATURE_NAME,
          s3Export: AuroraPostgresClusterEngine.S3_EXPORT_FEATURE_NAME,
        },
    });
  }

  public bindToCluster(scope: Construct, options: ClusterEngineBindOptions): ClusterEngineConfig {
    const config = super.bindToCluster(scope, options);
    // skip validation for unversioned as it might be supported/unsupported. we cannot reliably tell at compile-time
    if (this.engineVersion?.fullVersion) {
      if (options.s3ImportRole && !(config.features?.s3Import)) {
        throw new Error(`s3Import is not supported for Postgres version: ${this.engineVersion.fullVersion}. Use a version that supports the s3Import feature.`);
      }
      if (options.s3ExportRole && !(config.features?.s3Export)) {
        throw new Error(`s3Export is not supported for Postgres version: ${this.engineVersion.fullVersion}. Use a version that supports the s3Export feature.`);
      }
    }
    return config;
  }

  protected defaultParameterGroup(scope: Construct): IParameterGroup | undefined {
    if (!this.parameterGroupFamily) {
      throw new Error('Could not create a new ParameterGroup for an unversioned aurora-postgresql cluster engine. ' +
        'Please either use a versioned engine, or pass an explicit ParameterGroup when creating the cluster');
    }
    return ParameterGroup.fromParameterGroupName(scope, 'AuroraPostgreSqlDatabaseClusterEngineDefaultParameterGroup',
      `default.${this.parameterGroupFamily}`);
  }
}

/**
 * A database cluster engine. Provides mapping to the serverless application
 * used for secret rotation.
 */
export class DatabaseClusterEngine {
  /**
   * The unversioned 'aurora' cluster engine.
   *
   * **Note**: we do not recommend using unversioned engines for non-serverless Clusters,
   *   as that can pose an availability risk.
   *   We recommend using versioned engines created using the `aurora()` method
   */
  public static readonly AURORA: IClusterEngine = new AuroraClusterEngine();

  /**
   * The unversioned 'aurora-msql' cluster engine.
   *
   * **Note**: we do not recommend using unversioned engines for non-serverless Clusters,
   *   as that can pose an availability risk.
   *   We recommend using versioned engines created using the `auroraMysql()` method
   */
  public static readonly AURORA_MYSQL: IClusterEngine = new AuroraMysqlClusterEngine();

  /**
   * The unversioned 'aurora-postgresql' cluster engine.
   *
   * **Note**: we do not recommend using unversioned engines for non-serverless Clusters,
   *   as that can pose an availability risk.
   *   We recommend using versioned engines created using the `auroraPostgres()` method
   */
  public static readonly AURORA_POSTGRESQL: IClusterEngine = new AuroraPostgresClusterEngine();

  /** Creates a new plain Aurora database cluster engine. */
  public static aurora(props: AuroraClusterEngineProps): IClusterEngine {
    return new AuroraClusterEngine(props.version);
  }

  /** Creates a new Aurora MySQL database cluster engine. */
  public static auroraMysql(props: AuroraMysqlClusterEngineProps): IClusterEngine {
    return new AuroraMysqlClusterEngine(props.version);
  }

  /** Creates a new Aurora PostgreSQL database cluster engine. */
  public static auroraPostgres(props: AuroraPostgresClusterEngineProps): IClusterEngine {
    return new AuroraPostgresClusterEngine(props.version);
  }
}
