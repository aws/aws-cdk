import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as core from '@aws-cdk/core';
import { ClusterParameterGroup, IParameterGroup, ParameterGroup } from './parameter-group';
import { ParameterGroupFamilyMapping } from './private/parameter-group-family-mapping';
import { compare } from './private/version';

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
export interface ClusterEngineBindConfig {
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
export interface IClusterEngine {
  /** The type of the engine, for example "aurora-mysql". */
  readonly engineType: string;

  /**
   * The exact version of a given engine.
   *
   * @default - default version for the given engine type
   */
  readonly engineVersion?: string;

  /**
   * The family to use for ParameterGroups using this engine.
   * This is usually equal to "<engineType><engineMajorVersion>",
   * but can sometimes be a variation of that.
   * You can pass this property when creating new ClusterParameterGroup.
   */
  readonly parameterGroupFamily: string;

  /** The application used by this engine to perform rotation for a single-user scenario. */
  readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The application used by this engine to perform rotation for a multi-user scenario. */
  readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;

  /** The default EC2 instance type to use for databases in this cluster. */
  readonly defaultInstanceType: ec2.InstanceType;

  /**
   * Returns a new instance of this engine with a particular version specified.
   * Calling {@link engineVersion} on the returned instance will always return the provided value.
   *
   * @param engineVersion the exact engine version, for example "5.7.mysql_aurora.2.03.4"
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-dbcluster.html#cfn-rds-dbcluster-engineversion
   */
  withVersion(engineVersion: string): IClusterEngine;

  /**
   * Method called when the engine is used to create a new cluster.
   */
  bindToCluster(scope: core.Construct, options: ClusterEngineBindOptions): ClusterEngineBindConfig;
}

abstract class AbstractClusterEngine implements IClusterEngine {
  public readonly engineType: string;
  public readonly engineVersion?: string;
  public readonly parameterGroupFamily: string;
  public readonly singleUserRotationApplication: secretsmanager.SecretRotationApplication;
  public readonly multiUserRotationApplication: secretsmanager.SecretRotationApplication;
  // this works for all 3 cluster engines that are currently supported
  public readonly defaultInstanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM);

  private readonly needsS3RolesInParameters: boolean;
  private readonly parameterGroupFamilies?: ParameterGroupFamilyMapping[];
  private readonly defaultPort?: number;

  constructor(
    engineName: string,
    needsS3RolesInParameters: boolean,
    singleUserRotationApplication: secretsmanager.SecretRotationApplication,
    multiUserRotationApplication: secretsmanager.SecretRotationApplication,
    parameterGroupFamilies?: ParameterGroupFamilyMapping[],
    defaultPort?: number,
    engineVersion?: string) {

    this.engineType = engineName;
    this.needsS3RolesInParameters = needsS3RolesInParameters;
    this.singleUserRotationApplication = singleUserRotationApplication;
    this.multiUserRotationApplication = multiUserRotationApplication;
    this.parameterGroupFamilies = parameterGroupFamilies;
    this.defaultPort = defaultPort;
    this.engineVersion = engineVersion;
    this.parameterGroupFamily = this.establishParameterGroupFamily();
  }

  public withVersion(engineVersion: string): IClusterEngine {
    const self = this;
    // put it in a local variable, as it's protected
    const defaultParameterGroup = this.defaultParameterGroup;

    class CopyWithVersion extends AbstractClusterEngine {
      protected defaultParameterGroup(scope: core.Construct) {
        // we need to use call, so that 'this' inside defaultParameterGroup() is resolved correctly
        return defaultParameterGroup.call(self, scope);
      }
    }

    return new CopyWithVersion(
      this.engineType,
      this.needsS3RolesInParameters,
      this.singleUserRotationApplication,
      this.multiUserRotationApplication,
      this.parameterGroupFamilies,
      this.defaultPort,
      engineVersion,
    );
  }

  public bindToCluster(scope: core.Construct, options: ClusterEngineBindOptions): ClusterEngineBindConfig {
    let parameterGroup: IParameterGroup | undefined;
    if (options.parameterGroup) {
      parameterGroup = options.parameterGroup;
    } else if (this.needsS3RolesInParameters && (options.s3ImportRole || options.s3ExportRole)) {
      // in this case, we need to create a new ParameterGroup to store the S3 Role parameters in
      // (imported ParameterGroups, like the RDS default ones, don't allow adding parameters to them)
      parameterGroup = new ClusterParameterGroup(scope, 'ClusterParameterGroup', {
        family: this.parameterGroupFamily,
      });
    } else {
      parameterGroup = this.defaultParameterGroup(scope);
    }

    if (this.needsS3RolesInParameters) {
      if (options.s3ImportRole) {
        parameterGroup?.addParameter('aurora_load_from_s3_role', options.s3ImportRole.roleArn);
      }
      if (options.s3ExportRole) {
        parameterGroup?.addParameter('aurora_select_into_s3_role', options.s3ExportRole.roleArn);
      }
    }

    return {
      parameterGroup,
      port: this.defaultPort,
    };
  }

  /** Must be public because of the usage in withVersion */
  protected abstract defaultParameterGroup(scope: core.Construct): IParameterGroup | undefined;

  private establishParameterGroupFamily(): string {
    const ret = this.calculateParameterGroupFamily();
    if (ret === undefined) {
      throw new Error(`No parameter group family found for database engine ${this.engineType} with version ${this.engineVersion}.`);
    }
    return ret;
  }

  /**
   * Get the latest parameter group family for this engine. Latest is determined using semver on the engine major version.
   * When `engineVersion` is specified, return the parameter group family corresponding to that engine version.
   * Return undefined if no parameter group family is defined for this engine or for the requested `engineVersion`.
   */
  private calculateParameterGroupFamily(): string | undefined {
    if (this.parameterGroupFamilies === undefined) {
      return undefined;
    }
    const engineVersion = this.engineVersion;
    if (engineVersion !== undefined) {
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
 * The interface for plain Aurora cluster engines.
 */
export interface IAuroraClusterEngine extends IClusterEngine {
  /** Returns an Aurora cluster engine with the engine version set to "5.6.mysql_aurora.1.17.9". */
  withVersion1dot17dot9(): IClusterEngine;
}

class DefaultAuroraClusterEngine extends AbstractClusterEngine implements IAuroraClusterEngine {
  public withVersion1dot17dot9(): IClusterEngine {
    return this.withVersion('5.6.mysql_aurora.1.17.9');
  }

  protected defaultParameterGroup(_scope: core.Construct): IParameterGroup | undefined {
    // the default.aurora5.6 ParameterGroup is actually the default,
    // so just return undefined in this case
    return undefined;
  }
}

class NonDefaultAuroraClusterEngine extends AbstractClusterEngine {
  protected defaultParameterGroup(scope: core.Construct): IParameterGroup | undefined {
    return ParameterGroup.fromParameterGroupName(scope, 'AuroraMySqlDefaultParameterGroup',
      `default.${this.parameterGroupFamily}`);
  }
}

/**
 * A database cluster engine. Provides mapping to the serverless application
 * used for secret rotation.
 */
export class DatabaseClusterEngine {
  public static readonly AURORA: IAuroraClusterEngine = new DefaultAuroraClusterEngine(
    'aurora',
    true,
    secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '5.6', parameterGroupFamily: 'aurora5.6' },
    ],
  );

  public static readonly AURORA_MYSQL: IClusterEngine = new NonDefaultAuroraClusterEngine(
    'aurora-mysql',
    true,
    secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '5.7', parameterGroupFamily: 'aurora-mysql5.7' },
    ],
  );

  public static readonly AURORA_POSTGRESQL: IClusterEngine = new NonDefaultAuroraClusterEngine(
    'aurora-postgresql',
    false,
    secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_SINGLE_USER,
    secretsmanager.SecretRotationApplication.POSTGRES_ROTATION_MULTI_USER,
    [
      { engineMajorVersion: '9.6', parameterGroupFamily: 'aurora-postgresql9.6' },
      { engineMajorVersion: '10', parameterGroupFamily: 'aurora-postgresql10' },
      { engineMajorVersion: '11', parameterGroupFamily: 'aurora-postgresql11' },
    ],
    5432,
  );
}
